// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {useMemo} from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
} from 'react-native';

import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import {makeStyleSheetFromTheme} from '@utils/theme';

import {usePlaybookRunsForChannel} from '../../state/playbook_runs';

import RunItem from './run_item';

export type Props = {
    channelId: string;
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: theme.centerChannelBg,
        },
        content: {
            flex: 1,
            marginTop: 20,
            marginHorizontal: 20,
        },
    });
});

const ChannelRuns = ({channelId}: Props) => {
    const theme = useTheme();
    const serverUrl = useServerUrl();
    const style = getStyleSheet(theme);

    const runs = usePlaybookRunsForChannel(serverUrl, channelId);

    const hasRuns = useMemo(() => runs.length > 0, [runs]);

    if (!hasRuns) {
        return null;
    }

    return (
        <SafeAreaView style={style.container}>
            <View style={style.content}>
                {runs.map((run) => (
                    <RunItem
                        key={run.id}
                        run={run}
                    />
                ))}
            </View>
        </SafeAreaView>
    );
};

export default ChannelRuns;
