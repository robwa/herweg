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

function AssignmentsCell({ julianDay, assignmentsByJulianDay, category }) {
    const assignmentData = assignmentsByJulianDay[julianDay] ?? [];

    return (
        <TableCell key={julianDay}>
            <AssignmentList {...{ assignmentData }} />
            <AssignmentForm categoryId={category.id} {...{ julianDay }} />
        </TableCell>
    );
}

function SurveyTableRow({ category, assignmentsByCategoryIdAndJulianDay, julianDays }) {
    const assignmentsByJulianDay = assignmentsByCategoryIdAndJulianDay[category.id] ?? {};

    return (<>
        <TableRow>
            <TableCell component="th" scope="row">
                {category.name}
            </TableCell>
            {julianDays.map(julianDay => (
                <AssignmentsCell key={julianDay} {...{ julianDay, assignmentsByJulianDay, category }} />))}
        </TableRow>
    </>);
}

function SurveyTableRows({ categories, assignmentsByCategoryIdAndJulianDay, julianDays }) {
    return categories.data.map(category => (
        <SurveyTableRow key={category.id} {...{ category, assignmentsByCategoryIdAndJulianDay, julianDays }} />));
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

    const julianToday = convertDateToJulianDay(new Date());
    const julianDays = [julianToday - 1, julianToday, julianToday + 1];

    const { data: assignments } = useQuery(['assignments', {
        filter: {
            category_id: categoryIds.join(','),
            julian_day: julianDays.join(','),
        },
    }], fetchMany);

    if (!assignments) {
        return <CircularProgress />;
    }

    return <SurveyTableWithEverythingYouNeed {...{ assignments, survey, julianDays, categories }} />;
}

function SurveyTableWithEverythingYouNeed({ assignments, survey, julianDays, categories }) {
    const assignmentsByCategoryIdAndJulianDay = React.useMemo(
        () => assignments.data.reduce((acc, assignment) => {
            const categoryId = assignment.category_id;
            const julianDay = assignment.julian_day;
            const byJulianDay = acc[categoryId] ?? {};
            const list = byJulianDay[julianDay] ?? [];
            list.push(assignment);
            byJulianDay[julianDay] = list;
            acc[categoryId] = byJulianDay;
            return acc;
        }, {}), [assignments]
    );

    return (<>
        <Typography variant="h6">{survey.data.uuid}</Typography>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell component="th" scope="col">What?</TableCell>
                    {julianDays.map(julianDay => (
                        <TableCell key={julianDay} component="th" scope="col">Who? ({julianDay})</TableCell>))}
                </TableRow>
            </TableHead>
            <TableBody>
                <SurveyTableRows {...{ categories, assignmentsByCategoryIdAndJulianDay, julianDays }} />
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell><CategoryForm surveyId={survey.data.id} /></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>);
}
