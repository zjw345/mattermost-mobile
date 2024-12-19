// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import {useTheme} from '@react-navigation/native';
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import type {ChecklistItem} from '../../client/rest';

interface Props {
    title: string;
    items: ChecklistItem[];
}

const CollapsibleChecklist = ({
    title,
    items,
}: Props) => {
    const theme = useTheme();

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.header, {borderBottomColor: theme.colors.border}]}
            >
                <View style={styles.titleContainer}>
                    <Text style={[styles.title, {color: theme.colors.text}]}>
                        {title}
                    </Text>
                </View>
                <Text style={[styles.itemCount, {color: theme.colors.text}]}>
                    {items.length} {' items'}
                </Text>
            </TouchableOpacity>
            <View style={styles.itemsContainer}>
                {items.map((item, itemIndex) => (
                    <View
                        key={`${item.title}_${itemIndex}`}
                        style={[styles.item, {borderBottomColor: theme.colors.border}]}
                    >
                        <Text style={[styles.itemTitle, {color: theme.colors.text}]}>
                            {item.title}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    itemCount: {
        fontSize: 14,
    },
    itemsContainer: {
        paddingHorizontal: 16,
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
    },
    itemTitle: {
        fontSize: 14,
        marginLeft: 28,
    },
});

export default CollapsibleChecklist;
