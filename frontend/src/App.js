import { BottomNavigation, BottomNavigationAction, Container } from "@material-ui/core";
import { Favorite as FavoriteIcon, LocationOn as LocationOnIcon, Restore as RestoreIcon } from '@material-ui/icons';
import { instance } from 'gaxios';
import qs from 'qs';
import React from "react";
import { ReactQueryCacheProvider } from 'react-query';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SnackbarProvider from "SnackbarProvider";
import 'typeface-roboto';
import './App.css';
import { SurveyDetail } from "./app/survey/SurveyDetail";
import { SurveyList } from "./app/survey/SurveyList";

instance.defaults = {
    // baseURL: 'http://localhost:3000',
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }),
    //headers: {
    //  Authorization: 'SOME_TOKEN'
    //}
}

function SimpleBottomNavigation() {
    const [value, setValue] = React.useState(0);

    return (
        <BottomNavigation
            value={value}
            onChange={(e, newValue) => setValue(newValue)}
            showLabels
        >
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
            <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
        </BottomNavigation >
    );
}

function Main() {
    return (<>
        <Router>
            <Switch>
                <Route path="/surveys/:surveyId">
                    <SurveyDetail />
                </Route>
                <Route path="/">
                    <SurveyList />
                </Route>
            </Switch>
        </Router>
    </>);
}

function Layout() {
    return (<>
        <Container>
            <Main />
            <SimpleBottomNavigation />
        </Container>
    </>);
}

export default function App() {
    return (<>
        <ReactQueryCacheProvider>
            <SnackbarProvider>
                <Layout />
            </SnackbarProvider>
        </ReactQueryCacheProvider>
    </>);
}
