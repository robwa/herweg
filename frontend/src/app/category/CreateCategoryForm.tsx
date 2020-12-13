import { create } from "api/create";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from 'SnackbarProvider';
import { Category } from "./Category";
import { CategoryForm } from './CategoryForm';

type CreateCategoryFormProps = { upstreamCategory: Category, onSuccess: () => void }
export function CreateCategoryForm({ upstreamCategory, onSuccess }: CreateCategoryFormProps) {
    const notify = useSnackbarNotifier();

    const queryCache = useQueryCache();
    const [mutate] = useMutation(create, {
        onSuccess: (resp: any) => {
            notify({
                severity: 'success',
                title: <>Created category <q>{resp.data.name}</q></>,
                content: null,
            });
            queryCache.invalidateQueries('categories');
            if (onSuccess) onSuccess();
        },
        onError: (err: any) => notify({
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
