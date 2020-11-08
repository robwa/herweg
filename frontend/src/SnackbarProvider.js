import { Snackbar } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import React from 'react';

const context = React.createContext();
const { Provider } = context;

export default function SnackbarProvider({ children }) {
    const [notification, setNotification] = React.useState(null);

    return (<>
        <Provider value={[notification, setNotification]}>
            {children}
            <SimpleSnackbar />
        </Provider>
    </>);
}

export function useSnackbarNotifier() {
    const [notification, setNotification] = React.useContext(context);
    return setNotification;
}

function SimpleSnackbar() {
    const [notification] = React.useContext(context);
    const [open, setOpen] = React.useState(notification !== null);
    React.useEffect(() => setOpen(notification !== null), [notification]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const anchorOrigin = {
        vertical: 'bottom',
        horizontal: 'left',
    };

    return (<>
        <Snackbar {...{ anchorOrigin, open }} autoHideDuration={6000} onClose={handleClose}>
            <SnackbarNotification {...{ notification }} onClose={handleClose} />
        </Snackbar>
    </>);
}

function SnackbarNotification({ notification, onClose }) {
    if (notification === null) {
        return <p>nothing</p>;
    }

    const { title, severity, content } = notification;

    return (<>
        <Alert {...{ severity, onClose }}>
            <AlertTitle>{title}</AlertTitle>
            {content}
        </Alert>
    </>);
}
