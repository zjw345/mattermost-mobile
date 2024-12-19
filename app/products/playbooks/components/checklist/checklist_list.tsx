// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react';
import {View} from 'react-native';

import CollapsibleChecklist from './collapsible_checklist';

import type {PlaybookRun, Checklist} from '../../client/rest';

interface Props {
    playbookRun: PlaybookRun;
}

const ChecklistList = ({playbookRun}: Props) => {
    const checklists = playbookRun.checklists || [];

    return (
        <View>
            {checklists.map((checklist: Checklist) => (
                <CollapsibleChecklist
                    key={checklist.id}
                    title={checklist.title}
                    items={checklist.items}
                />
            ))}
        </View>
    );
};

export default ChecklistList;
