// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
} from 'react-native';

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
                    <Text style={style.text}>{run.summary || 'No summary provided'}</Text>
                </View>

                <View style={style.section}>
                    <Text style={style.sectionTitle}>{'Status'}</Text>
                    <Text style={style.text}>{run.current_status}</Text>
                </View>

                <View style={style.section}>
                    <Text style={style.sectionTitle}>{'Created'}</Text>
                    <Text style={style.text}>
                        {new Date(run.create_at).toLocaleDateString()}
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ChannelRunDetails;
