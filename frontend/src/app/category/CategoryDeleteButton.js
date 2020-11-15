import { IconButton } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { remove } from "api/remove";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from "SnackbarProvider";

export function CategoryDeleteButton({ categoryId }) {
    const notify = useSnackbarNotifier();

    const queryCache = useQueryCache();
    const [mutate] = useMutation(remove, {
        onSuccess: () => {
            notify({
                severity: 'success',
                title: <>Deleted category</>,
                content: null,
            });
            queryCache.invalidateQueries('categories');
        },
        onError: err => notify({
            severity: 'error',
            title: 'Something went wrong',
            content: err.toString(),
        }),
    });

    const handleDelete = () => mutate({
        type: 'categories',
        id: categoryId,
    });

    return (<>
        <IconButton onClick={handleDelete}><DeleteIcon /></IconButton>
    </>);
}
