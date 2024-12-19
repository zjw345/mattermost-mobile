import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';

import {ChecklistItem} from 'types/playbook';
import Icon from '@components/icon';

interface Props {
    title: string;
    items: ChecklistItem[];
    index: number;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    disabled: boolean;
    playbookRunID?: string;
}

const CollapsibleChecklist = ({
    title,
    items,
    index,
    collapsed,
    setCollapsed,
    disabled,
    playbookRunID,
}: Props) => {
    const theme = useTheme();

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={toggleCollapsed}
                style={[styles.header, {borderBottomColor: theme.colors.border}]}
            >
                <View style={styles.titleContainer}>
                    <Icon
                        name={collapsed ? 'chevron-right' : 'chevron-down'}
                        size={20}
                        color={theme.colors.text}
                    />
                    <Text style={[styles.title, {color: theme.colors.text}]}>
                        {title}
                    </Text>
                </View>
                <Text style={[styles.itemCount, {color: theme.colors.text}]}>
                    {items.length} items
                </Text>
            </TouchableOpacity>
            {!collapsed && (
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
            )}
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
