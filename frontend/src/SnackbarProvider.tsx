import { Snackbar } from '@material-ui/core';
import { Alert, AlertTitle, Color } from '@material-ui/lab';
import React, { Dispatch, ReactNode, SetStateAction } from 'react';

type Notification = { title: ReactNode, severity: Color, content: ReactNode }
const context = React.createContext<[Notification | undefined, Dispatch<SetStateAction<Notification | undefined>>]>([undefined, () => {}]);
const { Provider } = context;

type SnackbarProviderProps = { children: ReactNode };
export default function SnackbarProvider({ children }: SnackbarProviderProps) {
    const [notification, setNotification] = React.useState<Notification | undefined>();

    return (<>
        <Provider value={[notification, setNotification]}>
            {children}
            <SimpleSnackbar />
        </Provider>
    </>);
}

export function useSnackbarNotifier() {
    const [, setNotification] = React.useContext(context);
    return setNotification;
}

function SimpleSnackbar() {
    const [notification] = React.useContext(context);
    const [open, setOpen] = React.useState(notification !== null);
    React.useEffect(() => setOpen(notification !== null), [notification]);

    const handleClose = (event: any, reason: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    return (<>
        <Snackbar {...{ open }} anchorOrigin={{vertical: "bottom", horizontal: "left"}} autoHideDuration={6000} onClose={handleClose}>
            <SnackbarNotification {...{ notification }} onClose={handleClose} />
        </Snackbar>
    </>);
}

type SnackbarNotificationProps = { notification?: Notification, onClose: (...args: any[]) => void };
function SnackbarNotification({ notification, onClose }: SnackbarNotificationProps) {
    if (!notification) {
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
