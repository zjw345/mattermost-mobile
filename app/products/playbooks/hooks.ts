// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {useDatabase} from '@nozbe/watermelondb/react';
import {useCallback, useState} from 'react';
import {useIntl} from 'react-intl';
import {Alert} from 'react-native';

import {errorAlert} from '@calls/utils';
import {Screens} from '@constants';
import {useServerUrl} from '@context/server';
import {useTheme} from '@context/theme';
import NetworkManager from '@managers/network_manager';
import {getChannelById} from '@queries/servers/channel';
import {dismissAllModalsAndPopToScreen} from '@screens/navigation';
import {getFullErrorMessage} from '@utils/errors';
import {changeOpacity} from '@utils/theme';

import type {Client} from '@client/rest';

export const useTryPlaybooksFunction = (fn: () => void) => {
    const intl = useIntl();
    const serverUrl = useServerUrl();
    const [msgPostfix, setMsgPostfix] = useState('');
    const [clientError, setClientError] = useState('');

    let client: Client | undefined;
    if (!clientError) {
        try {
            client = NetworkManager.getClient(serverUrl);
        } catch (error) {
            setClientError(getFullErrorMessage(error));
        }
    }
    const tryFn = useCallback(async () => {
        let enabled;
        try {
            enabled = await client?.getEnabled();
        } catch (error) {
            errorAlert(getFullErrorMessage(error), intl);
            return;
        }

        if (enabled) {
            setMsgPostfix('');
            fn();
            return;
        }

        if (clientError) {
            errorAlert(clientError, intl);
            return;
        }

        const title = intl.formatMessage({
            id: 'mobile.playbooks_not_available_title',
            defaultMessage: 'Playbooks is not enabled',
        });
        const message = intl.formatMessage({
            id: 'mobile.playbooks_not_available_msg',
            defaultMessage: 'Please contact your System Admin to enable the feature.',
        });
        const ok = intl.formatMessage({
            id: 'mobile.playbooks_ok',
            defaultMessage: 'OK',
        });
        const notAvailable = intl.formatMessage({
            id: 'mobile.playbooks_not_available_option',
            defaultMessage: '(Not available)',
        });

        Alert.alert(
            title,
            message,
            [
                {
                    text: ok,
                    style: 'cancel',
                },
            ],
        );
        setMsgPostfix(` ${notAvailable}`);
    }, [client, fn, clientError, intl]);

    return [tryFn, msgPostfix] as [() => Promise<void>, string];
};

// useGoToPlaybooksChannelRuns returns a callback to close all open modals and navigate
// to the Playbook Runs screen for the given channel.
export const useGoToPlaybooksChannelRuns = (channelId: string) => {
    const database = useDatabase();
    const {formatMessage} = useIntl();
    const title = formatMessage({id: 'channel_info.playbook runs', defaultMessage: 'Playbook runs'});
    const theme = useTheme();

    const goToPlaybooksChannelRuns = useCallback(async () => {
        const channel = await getChannelById(database, channelId);
        if (!channel) {
            throw new Error('Channel not found');
        }

        let options;

        if (channel?.displayName) {
            options = {
                topBar: {
                    subtitle: {
                        color: changeOpacity(theme.sidebarHeaderTextColor, 0.72),
                        text: channel.displayName,
                    },
                },
            };
        }

        dismissAllModalsAndPopToScreen(Screens.PLAYBOOKS_CHANNEL_RUNS, title, {channelId}, options);
    }, [database, title, theme, channelId]);

    return goToPlaybooksChannelRuns;
};
