import { CircularProgress, IconButton, Table, TableBody, TableCell, TableFooter, TableHead, TableRow } from "@material-ui/core";
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { ArrowLeft as ArrowLeftIcon, ArrowRight as ArrowRightIcon } from "@material-ui/icons";
import { fetchMany } from "api/fetchMany";
import { AssignmentForm } from "app/assignment/AssignmentForm";
import { CategoryDeleteButton } from "app/category/CategoryDeleteButton";
import { CreateCategoryForm } from "app/category/CreateCategoryForm";
import { EditableCategoryName } from "app/category/EditableCategoryName";
import { convertDateToJulianDay, convertJulianDayToDate } from 'lib/dateUtil';
import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { AssignmentList } from "../assignment/AssignmentList";
import { SurveyDeleteButton } from "./SurveyDeleteButton";


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
                <EditableCategoryName {...{ category }} />
            </TableCell>
            <TableCell padding="checkbox">
            </TableCell>
            <TableCell padding="checkbox">{/* prev day */}</TableCell>
            {julianDays.map(julianDay => (
                <AssignmentsCell key={julianDay} {...{ julianDay, assignmentsByJulianDay, category }} />))}
            <TableCell padding="checkbox">{/* next day */}</TableCell>
        </TableRow>
    </>);
}

function SurveyTableRows({ categories, assignmentsByCategoryIdAndJulianDay, julianDays }) {
    return categories.data.map(category => (
        <SurveyTableRow key={category.id} {...{ category, assignmentsByCategoryIdAndJulianDay, julianDays }} />));
}

export function SurveyDetail() {
    const { surveyUuid, julianDay } = useParams();

    const { data: surveys } = useQuery(['surveys', {
        filter: { uuid: surveyUuid },
    }], fetchMany);

    const survey = surveys?.data?.[0];

    const { data: categories } = useQuery(['categories', {
        filter: { survey_id: survey?.id }
    }], fetchMany, { enabled: survey });


    const centralJulianDay = Number(julianDay ?? convertDateToJulianDay(new Date()));

    const theme = useTheme();
    const upXl = useMediaQuery(theme.breakpoints.up('xl'));
    const upLg = useMediaQuery(theme.breakpoints.up('lg'));
    const upMd = useMediaQuery(theme.breakpoints.up('md'));
    const numberOfDays = (() => {
        if (upXl) return 7;
        if (upLg) return 5;
        if (upMd) return 3;
        return 1;
    })();

    const julianDays = React.useMemo(
        () => [...Array(numberOfDays).keys()].map(offset => centralJulianDay + offset),
        [numberOfDays, centralJulianDay]
    );

    const { data: assignments } = useQuery(['assignments', {
        filter: {
            category_id: categories?.data?.map(c => c.id)?.join(','),
            julian_day: julianDays.join(','),
        },
    }], fetchMany, { enabled: categories?.data });

    if (!assignments) {
        return <CircularProgress />;
    }

    return <SurveyTableWithEverythingYouNeed {...{ assignments, survey, julianDays, categories, centralJulianDay, numberOfDays }} />;
}

function SurveyTableWithEverythingYouNeed({ assignments, survey, julianDays, categories, centralJulianDay, numberOfDays }) {
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

    const [upstreamCategory, setUpstreamCategory] = React.useState(undefined);
    const resetUpstreamCategory = React.useCallback(
        () => setUpstreamCategory({ survey_id: survey.id }),
        [setUpstreamCategory, survey.id]
    );
    React.useEffect(resetUpstreamCategory, [resetUpstreamCategory]);

    return (<>
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    <TableCell component="th" scope="col" colSpan={2}>What?</TableCell>
                    <TableCell padding="checkbox"><IconButton component={Link} to={`/surveys/${survey.uuid}/${centralJulianDay - numberOfDays}`}><ArrowLeftIcon /></IconButton></TableCell>
                    {julianDays.map(julianDay => (
                        <TableCell key={julianDay} component="th" scope="col">
                            {convertJulianDayToDate(julianDay).toLocaleDateString(undefined,
                                { weekday: 'short', day: 'numeric', month: 'numeric' })}
                        </TableCell>))}
                    <TableCell padding="checkbox"><IconButton component={Link} to={`/surveys/${survey.uuid}/${centralJulianDay + numberOfDays}`}><ArrowRightIcon /></IconButton></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <SurveyTableRows {...{ categories, assignmentsByCategoryIdAndJulianDay, julianDays }} />
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2}>
                        {upstreamCategory
                            ? <CreateCategoryForm {...{ upstreamCategory }} onSuccess={resetUpstreamCategory} />
                            : null}
                    </TableCell>
                    <TableCell colSpan={999}></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>);
}
