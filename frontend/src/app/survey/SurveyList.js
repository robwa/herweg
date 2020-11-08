import { CircularProgress } from '@material-ui/core';
import { fetchMany } from "api/fetchMany";
import React from "react";
import { useQuery } from 'react-query';
import { Link } from "react-router-dom";
import { SurveyCreateButton } from "./SurveyCreateButton";

function SurveyLink({ survey }) {
    return (<>
        <Link to={`surveys/${survey.id}`}>{survey.uuid}</Link>
    </>);
}

export function SurveyList() {
    const { isLoading, error, data: resp } = useQuery('surveys', fetchMany);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return 'An error has occurred: ' + error.message;
    }

    return (<>
        <ul>
            {resp.data.map(survey => <li key={survey.id}><SurveyLink {...{ survey }} /></li>)}
        </ul>
        <SurveyCreateButton />
    </>);
}
