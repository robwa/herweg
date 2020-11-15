import { IconButton } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { remove } from "api/remove";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from "SnackbarProvider";

export function AssignmentDeleteButton({ assignmentId }) {
    const notify = useSnackbarNotifier();

    const queryCache = useQueryCache();
    const [mutate] = useMutation(remove, {
        onSuccess: () => {
            notify({
                severity: 'success',
                title: <>Deleted assignment</>,
                content: null,
            });
            queryCache.invalidateQueries('assignments');
        },
        onError: err => notify({
            severity: 'error',
            title: 'Something went wrong',
            content: err.toString(),
        }),
    });

    const handleDelete = () => mutate({
        type: 'assignments',
        id: assignmentId,
    });

    return (<>
        <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
    </>);
}
