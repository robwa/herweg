import { IconButton, Input } from '@material-ui/core';
import { Save as AddIcon } from "@material-ui/icons";
import { create } from "api/create";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from 'SnackbarProvider';

const DISPLAY_FLEX = { display: 'flex' };

export function AssignmentForm({ categoryId, julianDay }) {
    const notify = useSnackbarNotifier();

    const [assignee, setAssignee] = React.useState("");
    const handleAssigneeChange = React.useCallback(e => setAssignee(e.target.value), [setAssignee]);

    const queryCache = useQueryCache();
    const [mutate] = useMutation(create, {
        onSuccess: ({ data: { assignee } }) => {
            notify({
                severity: 'success',
                title: <>Created assignment <q>{assignee}</q></>,
                content: null,
            });
            queryCache.invalidateQueries('assignments');
            setAssignee('');
        },
        onError: err => notify({
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
            <Input value={assignee} onChange={handleAssigneeChange} required variant="outlined" />
            <IconButton type="submit"><AddIcon /></IconButton>
        </form>
    </>);
}
