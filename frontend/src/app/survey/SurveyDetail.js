import { CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from "@material-ui/core";
import { fetchMany } from "api/fetchMany";
import { fetchOne } from "api/fetchOne";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { CategoryForm } from "../category/CategoryForm";


function SurveyTableRow({ category }) {
    return (<>
        <TableRow>
            <TableCell component="th" scope="row">
                {category.name}
            </TableCell>
        </TableRow>
    </>);
}

function SurveyTableRows({ surveyId }) {
    const { isLoading, error, data: resp } = useQuery(
        ['categories', { filter: { survey_id: surveyId } }],
        fetchMany
    );

    if (isLoading) {
        return <TableRow><TableCell><CircularProgress /></TableCell></TableRow>;
    }

    if (error) {
        return <TableRow><TableCell>An error has occurred: {error.message}</TableCell></TableRow>;
    }

    return resp.data.map(category => <SurveyTableRow key={category.id} {...{ category }} />);
}

export function SurveyDetail() {
    const { surveyId } = useParams();
    const { isLoading, error, data: resp } = useQuery(['surveys', surveyId], fetchOne);

    if (isLoading) {
        return <CircularProgress />;
    }

    if (error) {
        return 'An error has occurred: ' + error.message;
    }

    return (<>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell component="th" scope="col">What?</TableCell>
                    <TableCell component="th" scope="col">Who?</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <SurveyTableRows {...{ surveyId }} />
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell><CategoryForm {...{ surveyId }} /></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>);
}
