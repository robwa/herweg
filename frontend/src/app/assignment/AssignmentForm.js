import { IconButton, Input } from '@material-ui/core';
import { Save as AddIcon } from "@material-ui/icons";
import { create } from "api/create";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from 'SnackbarProvider';

export function AssignmentForm({ categoryId }) {
    const notify = useSnackbarNotifier();

    const [assignee, setAssignee] = React.useState("");
    const handleAssigneeChange = e => setAssignee(e.target.value);

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

    const handleSubmit = e => {
        e.preventDefault();
        mutate({
            type: 'assignments',
            category_id: categoryId,
            julian_day: 4,
            assignee: assignee,
        });
    };

    return (<>
        <form onSubmit={handleSubmit}>
            <Input value={assignee} onChange={handleAssigneeChange} required variant="outlined" />
            <IconButton type="submit"><AddIcon /></IconButton>
        </form>
    </>);
}
