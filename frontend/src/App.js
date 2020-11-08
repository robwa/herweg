import { Container } from "@material-ui/core";
import { SurveyCreateButton } from "app/survey/SurveyCreateButton";
import { instance } from 'gaxios';
import qs from 'qs';
import React from "react";
import { ReactQueryCacheProvider } from 'react-query';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SnackbarProvider from "SnackbarProvider";
import 'typeface-roboto';
import './App.css';
import { SurveyDetail } from "./app/survey/SurveyDetail";

instance.defaults = {
    // baseURL: 'http://localhost:3000',
    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }),
    //headers: {
    //  Authorization: 'SOME_TOKEN'
    //}
}

function Main() {
    return (<>
        <Router>
            <Switch>
                <Route path="/surveys/:surveyUuid/:julianDay">
                    <SurveyDetail />
                </Route>
                <Route path="/surveys/:surveyUuid">
                    <SurveyDetail />
                </Route>
                <Route path="/">
                    <SurveyCreateButton />
                </Route>
            </Switch>
        </Router>
    </>);
}

function Layout() {
    return (<>
        <Container>
            <Main />
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
