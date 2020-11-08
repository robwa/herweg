import { CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from "@material-ui/core";
import { fetchMany } from "api/fetchMany";
import { fetchOne } from "api/fetchOne";
import { AssignmentForm } from "app/assignment/AssignmentForm";
import { CategoryForm } from "app/category/CategoryForm";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { AssignmentList } from "../assignment/AssignmentList";

import { convertDateToJulianDay } from 'lib/dateUtil';

function SurveyTableRow({ category, assignments, julianDay }) {
    const assignmentData = assignments.data.filter(a => (
        (a.category_id === category.id)
        && (a.julian_day === julianDay)));

    return (<>
        <TableRow>
            <TableCell component="th" scope="row">
                {category.name}
            </TableCell>
            <TableCell>
                <AssignmentList  {...{ assignmentData }} />
                <AssignmentForm categoryId={category.id} {...{ julianDay }} />
            </TableCell>
        </TableRow>
    </>);
}

function SurveyTableRows({ categories, assignments, julianDay }) {
    return categories.data.map(category => (
        <SurveyTableRow key={category.id} {...{ category, assignments, julianDay }} />));
}

export function SurveyDetail() {
    const { surveyId } = useParams();

    const { data: survey } = useQuery(['surveys', {
        id: surveyId,
    }], fetchOne);

    const { data: categories } = useQuery(['categories', {
        filter: { survey_id: surveyId }
    }], fetchMany);

    if (!survey || !categories) {
        return <CircularProgress />;
    }

    return <SurveyTableWithAssignments {...{ survey, categories }} />;
}

function SurveyTableWithAssignments({ survey, categories }) {
    const categoryIds = categories.data.map(c => c.id);

    const julianDay = convertDateToJulianDay(new Date());

    const { data: assignments } = useQuery(['assignments', {
        filter: {
            category_id: categoryIds.join(','),
            julian_day: julianDay,
        },
    }], fetchMany);

    if (!assignments) {
        return <CircularProgress />;
    }

    return (<>
        <Typography variant="h6">{survey.data.uuid}</Typography>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell component="th" scope="col">What?</TableCell>
                    <TableCell component="th" scope="col">Who? ({julianDay})</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <SurveyTableRows {...{ categories, assignments, julianDay }} />
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell><CategoryForm surveyId={survey.data.id} /></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>);
}
