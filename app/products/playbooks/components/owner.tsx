// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import ProfilePicture from '@components/profile_picture';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    owner: UserModel;
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return StyleSheet.create({
        ownerContainer: {
            backgroundColor: changeOpacity(theme.centerChannelColor, 0.08),
            borderRadius: 20,
            paddingVertical: 4,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            height: 24,
            alignSelf: 'flex-start',
        },
        ownerProfilePictureContainer: {
            marginLeft: -10,
        },
        ownerName: {
            color: theme.centerChannelColor,
            fontSize: 16,
            marginLeft: 8,
            lineHeight: 17,
            flexShrink: 1,
        },
    });
});

const Owner = ({owner}: Props) => {
    const theme = useTheme();
    const style = getStyleSheet(theme);

    return (
        <View style={style.ownerContainer}>
            <ProfilePicture
                size={20}
                author={owner}
                showStatus={false}
                containerStyle={style.ownerProfilePictureContainer}
            />
            <Text style={style.ownerName}>
                {owner?.username || 'Unknown User'}
            </Text>
        </View>
    );
};

export default Owner;
