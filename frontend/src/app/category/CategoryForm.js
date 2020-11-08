import { IconButton, Input } from '@material-ui/core';
import { Save as AddIcon } from "@material-ui/icons";
import { create } from "api/create";
import React from "react";
import { useMutation, useQueryCache } from 'react-query';
import { useSnackbarNotifier } from 'SnackbarProvider';

export function CategoryForm({ surveyId }) {
    const notify = useSnackbarNotifier();

    const [name, setName] = React.useState("");
    const handleNameChange = e => setName(e.target.value);

    const queryCache = useQueryCache();
    const [mutate] = useMutation(create, {
        onSuccess: ({ data: { name } }) => {
            notify({
                severity: 'success',
                title: <>Created category <q>{name}</q></>,
                content: null,
            });
            queryCache.invalidateQueries('categories');
            setName('');
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
            type: 'categories',
            survey_id: surveyId,
            name,
        });
    };

    return (<>
        <form onSubmit={handleSubmit}>
            <Input value={name} onChange={handleNameChange} required variant="outlined" />
            <IconButton type="submit"><AddIcon /></IconButton>
        </form>
    </>);
}
