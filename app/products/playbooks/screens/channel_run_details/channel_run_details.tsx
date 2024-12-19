// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useDatabase} from '@nozbe/watermelondb/react';
import React, {useEffect, useState} from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
} from 'react-native';

import Markdown from '@components/markdown';
import {useTheme} from '@context/theme';
import {queryUsersById} from '@queries/servers/user';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import Owner from '../../components/owner';
import Participants from '../../components/participants';

import type {PlaybookRun} from '../../client/rest';
import type UserModel from '@typings/database/models/servers/user';

type Props = {
    run: PlaybookRun;
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.centerChannelBg,
        },
        content: {
            flex: 1,
            padding: 20,
        },
        name: {
            ...typography('Heading', 400),
            color: theme.centerChannelColor,
            marginBottom: 10,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            ...typography('Heading', 200),
            color: theme.centerChannelColor,
            marginBottom: 8,
        },
        text: {
            ...typography('Body', 200),
            color: theme.centerChannelColor,
        },
        avatar: {
            width: 32,
            height: 32,
            borderRadius: 16,
        },
        horizontalSection: {
            flexDirection: 'row',
            marginBottom: 24,
        },
        halfSection: {
            flex: 1,
            marginRight: 36,
        },
        ownerSection: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        participantsSection: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
        },
    });
});

const ChannelRunDetails = ({run}: Props) => {
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
    }, [database, run.owner_user_id, run.participant_ids]);

    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                <Text style={style.name}>{run.name}</Text>

                <View style={style.section}>
                    <Text style={style.sectionTitle}>{'Summary'}</Text>
                    {run.summary ? (
                        <Markdown
                            value={run.summary}
                            baseTextStyle={style.text}
                            location='channel_run_details'
                            theme={theme}
                        />
                    ) : (
                        <Text style={style.text}>{'No summary provided'}</Text>
                    )}
                </View>

                <View style={style.horizontalSection}>
                    <View style={style.halfSection}>
                        <Text style={style.sectionTitle}>{'Owner'}</Text>
                        <Owner owner={users[run.owner_user_id]}/>
                    </View>
                    <View style={style.halfSection}>
                        <Text style={style.sectionTitle}>{'Participants'}</Text>
                        <Participants
                            participants={Object.values(users)}
                            ownerId={run.owner_user_id}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ChannelRunDetails;
