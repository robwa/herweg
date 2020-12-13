import { Fab, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';
import { remove } from "api/remove";
import React from "react";
import { useMutation } from 'react-query';
import { useHistory } from "react-router-dom";
import { useSnackbarNotifier } from "SnackbarProvider";

const useStyles = makeStyles(theme => ({
    root: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

type SurveyDeleteButtonProps = { surveyUuid?: string };
export function SurveyDeleteButton({ surveyUuid }: SurveyDeleteButtonProps) {
    const history = useHistory();
    const notify = useSnackbarNotifier();

    const classes = useStyles();

    const [mutate] = useMutation(remove, {
        onSuccess: () => history.push('/'),
        onError: (err: any) => notify({
            severity: 'error',
            title: 'Something went wrong',
            content: err.toString(),
        }),
    });

    const handleDelete = () => {
        if (!window.confirm('are you sure?')) {
            return;
        }

        mutate({
            type: 'surveys',
            uuid: surveyUuid,
        });
    };

    return (<>
        <Fab onClick={handleDelete} className={classes.root}><DeleteIcon /></Fab>
    </>);
}
