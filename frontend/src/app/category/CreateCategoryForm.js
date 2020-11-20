import { create } from "api/create";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from 'SnackbarProvider';
import { CategoryForm } from './CategoryForm';

export function CreateCategoryForm({ upstreamCategory, onSuccess }) {
    const notify = useSnackbarNotifier();

    const queryCache = useQueryCache();
    const [mutate] = useMutation(create, {
        onSuccess: ({ data: { name } }) => {
            notify({
                severity: 'success',
                title: <>Created category <q>{name}</q></>,
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
        ({ survey_id, name }) => mutate({
            type: 'categories',
            survey_id,
            name,
        }),
        [mutate]
    );

    return <CategoryForm {...{ upstreamCategory }} onSubmit={handleSubmit} />;
}
