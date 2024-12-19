// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {StyleSheet, Text, View, type StyleProp, type ViewStyle} from 'react-native';

import ProfilePicture from '@components/profile_picture';
import {useTheme} from '@context/theme';
import {changeOpacity, makeStyleSheetFromTheme} from '@utils/theme';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    owner: UserModel;
    containerStyle?: StyleProp<ViewStyle>;
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

const Owner = ({owner, containerStyle}: Props) => {
    const theme = useTheme();
    const stylesheet = getStyleSheet(theme);

    return (
        <View style={[stylesheet.ownerContainer, containerStyle]}>
            <ProfilePicture
                size={20}
                author={owner}
                showStatus={false}
                containerStyle={stylesheet.ownerProfilePictureContainer}
            />
            <Text style={stylesheet.ownerName}>
                {owner?.username || 'Unknown User'}
            </Text>
        </View>
    );
};

export default Owner;
