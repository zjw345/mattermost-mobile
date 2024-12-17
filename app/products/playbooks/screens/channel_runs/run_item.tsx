// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {useDatabase} from '@nozbe/watermelondb/react';
import moment from 'moment-timezone';
import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import FormattedText from '@components/formatted_text';
import ProfilePicture from '@components/profile_picture';
import {useTheme} from '@context/theme';
import {queryUsersById} from '@queries/servers/user';
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
        ownerContainer: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
            borderRadius: 20,
            paddingVertical: 4,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            height: 24,
        },
        ownerProfilePictureContainer: {
            marginLeft: -10,
        },
        ownerName: {
            color: theme.centerChannelColor,
            fontSize: 16,
            marginLeft: 8,
            lineHeight: 17,
        },
        participantsContainer: {
            flexDirection: 'row',
            marginLeft: 8,
        },
        participant: {
            marginLeft: -8,
        },
        participantProfilePictureContainer: {
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

    const participantIdsLessOwner = run.participant_ids.filter((id) => id !== run.owner_user_id);

    const onPress = () => null;

    return (
        <Pressable
            onPress={onPress}
        >
            <View style={style.container}>
                <View style={style.nameContainer}>
                    <Text style={style.name}>{run.name}</Text>
                </View>
                <View style={style.users}>
                    <View style={style.ownerContainer}>
                        <ProfilePicture
                            size={20}
                            author={users[run.owner_user_id]}
                            showStatus={false}
                            containerStyle={style.ownerProfilePictureContainer}
                        />
                        <Text style={style.ownerName}>
                            {users[run.owner_user_id]?.username || 'Unknown User'}
                        </Text>
                    </View>
                    <View style={style.participantsContainer}>
                        {participantIdsLessOwner.map((userId) => (
                            <View
                                key={userId}
                                style={style.participant}
                            >
                                <ProfilePicture
                                    size={24}
                                    author={users[userId]}
                                    showStatus={false}
                                    containerStyle={style.participantProfilePictureContainer}
                                    imageStyle={{borderColor: theme.centerChannelBg, borderWidth: 1.5}}
                                />
                            </View>
                        ))}
                    </View>
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
