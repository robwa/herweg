import { IconButton, TextField } from '@material-ui/core';
import { Save as AddIcon } from "@material-ui/icons";
import { create } from "api/create";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from 'SnackbarProvider';
import { Assignment } from './Assignment';

const DISPLAY_FLEX = { display: 'flex' };

type AssignmentFormProps = { categoryId?: string, julianDay: number };
export function AssignmentForm({ categoryId, julianDay }: AssignmentFormProps) {
    const notify = useSnackbarNotifier();

    const [assignee, setAssignee] = React.useState("");
    const handleAssigneeChange = React.useCallback(e => setAssignee(e.target.value), [setAssignee]);

    const queryCache = useQueryCache();
    const [mutate] = useMutation(create, {
        onSuccess: (resp: any) => {
            const assignment: Assignment = resp.data;
            notify({
                severity: 'success',
                title: <>Created assignment <q>{assignment.assignee}</q></>,
                content: null,
            });
            queryCache.invalidateQueries('assignments');
            setAssignee('');
        },
        onError: (err: any) => notify({
            severity: 'error',
            title: 'Something went wrong',
            content: err.toString(),
        }),
    });

    const handleSubmit = React.useCallback(
        e => {
            e.preventDefault();
            mutate({
                type: 'assignments',
                category_id: categoryId,
                julian_day: julianDay,
                assignee: assignee,
            });
        },
        [mutate, categoryId, julianDay, assignee]
    );

    return (<>
        <form onSubmit={handleSubmit} style={DISPLAY_FLEX}>
            <TextField value={assignee} onChange={handleAssigneeChange} required variant="outlined" />
            <IconButton type="submit"><AddIcon /></IconButton>
        </form>
    </>);
}
