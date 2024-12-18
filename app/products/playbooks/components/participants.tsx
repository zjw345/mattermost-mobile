// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {StyleSheet, View} from 'react-native';

import ProfilePicture from '@components/profile_picture';
import {useTheme} from '@context/theme';

import type UserModel from '@typings/database/models/servers/user';

type Props = {
    participants: UserModel[];
    ownerId: string;
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return StyleSheet.create({
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

const Participants = ({participants, ownerId}: Props) => {
    const theme = useTheme();
    const style = getStyleSheet(theme);

    const participantsLessOwner = participants.filter((user) => user?.id !== ownerId);

    return (
        <View style={style.participantsContainer}>
            {participantsLessOwner.map((user) => (
                <View
                    key={user?.id}
                    style={style.participant}
                >
                    <ProfilePicture
                        size={24}
                        author={user}
                        showStatus={false}
                        containerStyle={style.participantProfilePictureContainer}
                        imageStyle={{borderColor: theme.centerChannelBg, borderWidth: 1.5}}
                    />
                </View>
            ))}
        </View>
    );
};

export default Participants;
