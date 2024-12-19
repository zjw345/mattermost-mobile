// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PlaybookRun} from 'types/playbook_run';

import CollapsibleChecklist from './collapsible_checklist';

interface Props {
    playbookRun: PlaybookRun;
    checklistsCollapseState: Record<number, boolean>;
    onChecklistCollapsedStateChange: (checklistIndex: number, state: boolean) => void;
}

const ChecklistList = ({playbookRun, checklistsCollapseState, onChecklistCollapsedStateChange}: Props) => {
    const checklists = playbookRun.checklists || [];

    return (
        <View style={styles.container}>
            {checklists.map((checklist: Checklist, checklistIndex: number) => (
                <CollapsibleChecklist
                    key={`${checklist.title}_${checklistIndex}`}
                    title={checklist.title}
                    items={checklist.items}
                    index={checklistIndex}
                    collapsed={Boolean(checklistsCollapseState[checklistIndex])}
                    setCollapsed={(newState) => onChecklistCollapsedStateChange(checklistIndex, newState)}
                    disabled={readOnly}
                    playbookRunID={playbookRun?.id}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default ChecklistList;
