// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {useDatabase} from '@nozbe/watermelondb/react';
import moment from 'moment-timezone';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import FormattedText from '@components/formatted_text';
import {Screens} from '@constants';
import {useTheme} from '@context/theme';
import Owner from '@playbooks/components/owner';
import Participants from '@playbooks/components/participants';
import {queryUsersById} from '@queries/servers/user';
import {dismissAllModalsAndPopToScreen} from '@screens/navigation';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import {type PlaybookRun} from '../../client/rest';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    run: PlaybookRun;
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return StyleSheet.create({
        container: {
            flexDirection: 'column',
            alignItems: 'stretch',
            paddingTop: 16,
            paddingBottom: 22,
            paddingLeft: 20,
            paddingRight: 20,
            marginBottom: 12,
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: changeOpacity(theme.centerChannelColor, 0.08),
            borderRadius: 4,

            elevation: 1,
            shadowColor: '#000000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.08,
            shadowRadius: 3,
            backgroundColor: theme.centerChannelBg,
        },
        nameContainer: {
            marginBottom: 10,
        },
        name: {
            ...typography('Heading', 200),
            fontFamily: 'OpenSans',
        },
        users: {
            flexDirection: 'row',
            marginBottom: 8,
        },
        details: {
        },
    });
});

const RunItem = ({run}: Props) => {
    const database = useDatabase();
    const theme = useTheme();
    const style = getStyleSheet(theme);
    const [users, setUsers] = useState<Record<string, UserModel>>({});

    useEffect(() => {
        const fetch = async () => {
            const localUsers = await queryUsersById(database, [run.owner_user_id, ...run.participant_ids]).fetch();
            const usersMap = localUsers.reduce((map: Record<string, UserModel>, user: UserModel) => {
                map[user.id] = user;
                return map;
            }, {} as Record<string, UserModel>);

            setUsers(usersMap);
        };
        fetch();
    }, [database, run.owner_user_id, run.participant_ids, setUsers]);


    const onPress = () => {
        dismissAllModalsAndPopToScreen(
            Screens.PLAYBOOKS_CHANNEL_RUN_DETAILS,
            'Run Details',
            {run},
        );
    };

    return (
        <Pressable
            onPress={onPress}
        >
            <View style={style.container}>
                <View style={style.nameContainer}>
                    <Text style={style.name}>{run.name}</Text>
                </View>
                <View style={style.users}>
                    <Owner owner={users[run.owner_user_id]}/>
                    <Participants
                        participants={Object.values(users)}
                        ownerId={run.owner_user_id}
                    />
                </View>
                <View style={style.details}>
                    <FormattedText
                        id={'playbooks.last_updated_at'}
                        defaultMessage={'Last updated {duration} ago'}
                        values={{duration: moment.duration(moment.now() - run.last_status_update_at).humanize(false)}}
                    />
                </View>
            </View>
        </Pressable>
    );
};

export default RunItem;
