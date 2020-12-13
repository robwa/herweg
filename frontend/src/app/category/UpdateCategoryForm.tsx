import { update } from "api/update";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from 'SnackbarProvider';
import { Category } from "./Category";
import { CategoryForm } from './CategoryForm';

type UpdateCategoryFormProps = { upstreamCategory: Category, onSuccess: () => void };
export function UpdateCategoryForm({ upstreamCategory, onSuccess }: UpdateCategoryFormProps) {
    const notify = useSnackbarNotifier();

    const queryCache = useQueryCache();
    const [mutate] = useMutation(update, {
        onSuccess: (resp: any) => {
            const category: Category = resp.data;
            notify({
                severity: 'success',
                title: <>Updated category <q>{category.name}</q></>,
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
        ({ id, name }: Category) => mutate({
            type: 'categories',
            id,
            name,
        }),
        [mutate]
    );

    return <CategoryForm {...{ upstreamCategory }} onSubmit={handleSubmit} />;
}
