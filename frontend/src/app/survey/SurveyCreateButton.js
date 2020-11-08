import { Button } from '@material-ui/core';
import { create } from "api/create";
import React from "react";
import { useMutation } from 'react-query';
import { useHistory } from "react-router-dom";
import { useSnackbarNotifier } from "SnackbarProvider";
import { v4 as uuidv4 } from 'uuid';

export function SurveyCreateButton() {
    const history = useHistory();
    const notify = useSnackbarNotifier();

    const [mutate] = useMutation(create, {
        onSuccess: ({ data: { uuid } }) => history.push(`/surveys/${uuid}`),
        onError: err => notify({
            severity: 'error',
            title: 'Something went wrong',
            content: err.toString(),
        }),
    });

    const handleClick = () => mutate({
        type: 'surveys',
        uuid: uuidv4(),
    });

    return (<>
        <Button variant="contained" color="primary" onClick={handleClick}>Create new survey</Button>
    </>);
}
