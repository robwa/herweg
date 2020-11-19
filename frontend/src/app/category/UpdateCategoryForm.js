import { update } from "api/update";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from 'SnackbarProvider';
import { CategoryForm } from './CategoryForm';

export function UpdateCategoryForm({ upstreamCategory, onSuccess }) {
    const notify = useSnackbarNotifier();

    const queryCache = useQueryCache();
    const [mutate] = useMutation(update, {
        onSuccess: ({ data: { name } }) => {
            notify({
                severity: 'success',
                title: <>Updated category <q>{name}</q></>,
                content: null,
            });
            queryCache.invalidateQueries('categories');
            if (onSuccess) onSuccess();
        },
        onError: err => notify({
            severity: 'error',
            title: 'Something went wrong',
            content: err.toString(),
        }),
    });

    const handleSubmit = React.useCallback(
        ({ id, name }) => mutate({
            type: 'categories',
            id,
            name,
        }),
        [mutate]
    );

    return <CategoryForm {...{ upstreamCategory }} onSubmit={handleSubmit} />;
}
