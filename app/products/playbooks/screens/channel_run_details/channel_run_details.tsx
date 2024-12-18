// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {
    Image,
    SafeAreaView,
    View,
    StyleSheet,
    Text,
} from 'react-native';

import Markdown from '@components/markdown';
import CompassIcon from '@components/compass_icon';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';
import {typography} from '@utils/typography';

import type {PlaybookRun} from '../../client/rest';

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
    const theme = useTheme();
    const style = getStyleSheet(theme);

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
                        <View style={style.ownerSection}>
                            <Image
                                source={{uri: run.owner_user_info?.avatar_url}}
                                style={style.avatar}
                            />
                            <Text style={[style.text, {marginLeft: 8}]}>
                                {run.owner_user_info?.username || 'Unknown'}
                            </Text>
                        </View>
                    </View>
                    <View style={style.halfSection}>
                        <Text style={style.sectionTitle}>{'Participants'}</Text>
                        <View style={style.participantsSection}>
                            {run.participant_user_infos?.map((participant) => (
                                <Image
                                    key={participant.user_id}
                                    source={{uri: participant.avatar_url}}
                                    style={style.avatar}
                                />
                            ))}
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ChannelRunDetails;
