import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useIntl} from 'react-intl';
import {useDispatch} from 'react-redux';

import {PlaybookRun, PlaybookRunStatus} from 'types/playbook_run';
import {Checklist} from 'types/playbook';
import {playbookRunUpdated} from 'src/actions';
import {clientAddChecklist, clientMoveChecklist, clientMoveChecklistItem} from 'src/client';

import CollapsibleChecklist from './collapsible_checklist';

interface Props {
    playbookRun?: PlaybookRun;
    isReadOnly: boolean;
    checklistsCollapseState: Record<number, boolean>;
    onChecklistCollapsedStateChange: (checklistIndex: number, state: boolean) => void;
    onEveryChecklistCollapsedStateChange: (state: Record<number, boolean>) => void;
}

const ChecklistList = ({
    playbookRun,
    isReadOnly,
    checklistsCollapseState,
    onChecklistCollapsedStateChange,
    onEveryChecklistCollapsedStateChange,
}: Props) => {
    const dispatch = useDispatch();
    const {formatMessage} = useIntl();
    const [addingChecklist, setAddingChecklist] = useState(false);
    const [newChecklistName, setNewChecklistName] = useState('');

    const checklists = playbookRun?.checklists || [];
    const finished = playbookRun?.current_status === PlaybookRunStatus.Finished;
    const readOnly = finished || isReadOnly;

    const onMoveChecklist = (srcIdx: number, dstIdx: number) => {
        if (!playbookRun) {
            return;
        }

        const newChecklists = [...checklists];
        const [moved] = newChecklists.splice(srcIdx, 1);
        newChecklists.splice(dstIdx, 0, moved);

        const newState = {...checklistsCollapseState};
        if (srcIdx < dstIdx) {
            for (let i = srcIdx; i < dstIdx; i++) {
                newState[i] = checklistsCollapseState[i + 1];
            }
        } else {
            for (let i = dstIdx + 1; i <= srcIdx; i++) {
                newState[i] = checklistsCollapseState[i - 1];
            }
        }
        newState[dstIdx] = checklistsCollapseState[srcIdx];

        onEveryChecklistCollapsedStateChange(newState);
        clientMoveChecklist(playbookRun.id, srcIdx, dstIdx);

        dispatch(playbookRunUpdated({
            ...playbookRun,
            checklists: newChecklists,
        }));
    };

    const onMoveChecklistItem = (srcChecklistIdx: number, srcIdx: number, dstChecklistIdx: number, dstIdx: number) => {
        if (!playbookRun) {
            return;
        }

        const newChecklists = [...checklists];
        
        if (srcChecklistIdx === dstChecklistIdx) {
            const newChecklistItems = [...checklists[srcChecklistIdx].items];
            const [moved] = newChecklistItems.splice(srcIdx, 1);
            newChecklistItems.splice(dstIdx, 0, moved);
            newChecklists[srcChecklistIdx] = {
                ...newChecklists[srcChecklistIdx],
                items: newChecklistItems,
            };
        } else {
            const srcChecklist = checklists[srcChecklistIdx];
            const dstChecklist = checklists[dstChecklistIdx];

            const newSrcChecklistItems = [...srcChecklist.items];
            const [moved] = newSrcChecklistItems.splice(srcIdx, 1);

            const newDstChecklistItems = [...dstChecklist.items];
            newDstChecklistItems.splice(dstIdx, 0, moved);

            newChecklists[srcChecklistIdx] = {
                ...srcChecklist,
                items: newSrcChecklistItems,
            };
            newChecklists[dstChecklistIdx] = {
                ...dstChecklist,
                items: newDstChecklistItems,
            };
        }

        clientMoveChecklistItem(playbookRun.id, srcChecklistIdx, srcIdx, dstChecklistIdx, dstIdx);

        dispatch(playbookRunUpdated({
            ...playbookRun,
            checklists: newChecklists,
        }));
    };

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
