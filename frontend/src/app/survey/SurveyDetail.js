import { CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from "@material-ui/core";
import { fetchMany } from "api/fetchMany";
import { AssignmentForm } from "app/assignment/AssignmentForm";
import { CategoryForm } from "app/category/CategoryForm";
import { convertDateToJulianDay, convertJulianDayToDate } from 'lib/dateUtil';
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { AssignmentList } from "../assignment/AssignmentList";


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
    const { surveyUuid } = useParams();

    const { data: surveys } = useQuery(['surveys', {
        filter: { uuid: surveyUuid },
    }], fetchMany);

    const survey = surveys?.data?.[0];

    const { data: categories } = useQuery(['categories', {
        filter: { survey_id: survey?.id }
    }], fetchMany, { enabled: survey });

    const julianToday = convertDateToJulianDay(new Date());
    const julianDays = [julianToday - 1, julianToday, julianToday + 1];

    const { data: assignments } = useQuery(['assignments', {
        filter: {
            category_id: categories?.data?.map(c => c.id)?.join(','),
            julian_day: julianDays.join(','),
        },
    }], fetchMany, { enabled: categories?.data });

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
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell component="th" scope="col">What?</TableCell>
                    {julianDays.map(julianDay => (
                        <TableCell key={julianDay} component="th" scope="col">{convertJulianDayToDate(julianDay).toLocaleDateString()}</TableCell>))}
                </TableRow>
            </TableHead>
            <TableBody>
                <SurveyTableRows {...{ categories, assignmentsByCategoryIdAndJulianDay, julianDays }} />
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell><CategoryForm surveyId={survey.id} /></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>);
}
