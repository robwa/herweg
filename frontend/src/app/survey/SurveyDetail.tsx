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
import { Assignment } from "../assignment/Assignment";
import { AssignmentList } from "../assignment/AssignmentList";
import { Category } from "../category/Category";
import { Survey } from "./Survey";
import { SurveyDeleteButton } from "./SurveyDeleteButton";

type AssignmentsByJulianDay = { [julianDay: string]: Assignment[] };
type AssignmentsByCategoryIdAndJulianDay = { [categoryId: string]: AssignmentsByJulianDay };

type AssignmentCellProps = {
    julianDay: number;
    assignmentsByJulianDay: AssignmentsByJulianDay;
    category: Category;
};
function AssignmentsCell({ julianDay, assignmentsByJulianDay, category }: AssignmentCellProps) {
    const assignmentData = assignmentsByJulianDay[julianDay] ?? [];

    return (
        <TableCell key={julianDay}>
            <AssignmentList {...{ assignmentData }} />
            <AssignmentForm categoryId={category.id} {...{ julianDay }} />
        </TableCell>
    );
}

type SurveyTableRowProps = {
    category: Category;
    assignmentsByCategoryIdAndJulianDay: AssignmentsByCategoryIdAndJulianDay;
    julianDays: number[];
};
function SurveyTableRow({ category, assignmentsByCategoryIdAndJulianDay, julianDays }: SurveyTableRowProps) {
    if(!category.id) {
        return null;
    }
    const assignmentsByJulianDay = assignmentsByCategoryIdAndJulianDay[category.id] ?? {};

    return (<>
        <TableRow>
            <TableCell component="th" scope="row">
                <EditableCategoryName {...{ category }} />
            </TableCell>
            <TableCell padding="checkbox">
                <CategoryDeleteButton categoryId={category.id} />
            </TableCell>
            <TableCell padding="checkbox">{/* prev day */}</TableCell>
            {julianDays.map(julianDay => (
                <AssignmentsCell key={julianDay} {...{ julianDay, assignmentsByJulianDay, category }} />))}
            <TableCell padding="checkbox">{/* next day */}</TableCell>
        </TableRow>
    </>);
}

type SurveyTableRowsProps = {
    categories?: Category[];
    assignmentsByCategoryIdAndJulianDay: AssignmentsByCategoryIdAndJulianDay;
    julianDays: number[];
};
function SurveyTableRows({ categories, assignmentsByCategoryIdAndJulianDay, julianDays }: SurveyTableRowsProps) {
    return <>{categories?.map(category => (
        <SurveyTableRow key={category.id} {...{ category, assignmentsByCategoryIdAndJulianDay, julianDays }} />)) ?? null}</>;
}

export function SurveyDetail() {
    const { surveyUuid, julianDay } = useParams<any>();

    const surveysResp: any = useQuery(['surveys', {
        filter: { uuid: surveyUuid },
    }], fetchMany);

    const survey: Survey | undefined = surveysResp?.data?.data?.[0];

    const categoriesResp: any = useQuery(['categories', {
        filter: { survey_id: survey?.id }
    }], fetchMany, { enabled: survey });

    const categories: Category[] | undefined = categoriesResp?.data?.data;


    const centralJulianDay = Number(julianDay ?? convertDateToJulianDay(new Date()));

    const theme = useTheme();
    const isLargeViewport = useMediaQuery(theme.breakpoints.up('md'));
    const numberOfDays = isLargeViewport ? 3 : 1;

    const julianDays = React.useMemo(
        () => [...Array(numberOfDays).keys()].map(offset => centralJulianDay + offset),
        [numberOfDays, centralJulianDay]
    );

    const assignmentsResp: any = useQuery(['assignments', {
        filter: {
            category_id: categories?.map(c => c.id)?.join(','),
            julian_day: julianDays.join(','),
        },
    }], fetchMany, { enabled: categories });
    const assignments = assignmentsResp?.data?.data;

    if (!assignments) {
        return <CircularProgress />;
    }

    return <SurveyTableWithEverythingYouNeed {...{ assignments, survey, julianDays, categories, centralJulianDay }} />;
}

type SurveyTableWithEverythingYouNeedProps = {
    assignments?: Assignment[];
    survey?: Survey;
    julianDays: number[];
    categories?: Category[];
    centralJulianDay: number;
};
function SurveyTableWithEverythingYouNeed({ assignments, survey, julianDays, categories, centralJulianDay }: SurveyTableWithEverythingYouNeedProps) {
    const assignmentsByCategoryIdAndJulianDay = React.useMemo(() => {
        const assignmentsByCategoryIdAndJulianDayEmpty: AssignmentsByCategoryIdAndJulianDay = {};
        return assignments?.reduce((acc, assignment) => {
            const categoryId = assignment.category_id;
            const julianDay = assignment.julian_day;
            const byJulianDayEmpty: AssignmentsByJulianDay = {};
            const byJulianDay = acc[categoryId ?? ''] ?? byJulianDayEmpty;
            const list = byJulianDay[julianDay ?? ''] ?? [];
            list.push(assignment);
            byJulianDay[julianDay ?? ''] = list;
            acc[categoryId ?? ''] = byJulianDay;
            return acc;
        }, assignmentsByCategoryIdAndJulianDayEmpty);
    }, [assignments]) ?? {};

    const [upstreamCategory, setUpstreamCategory] = React.useState<Category | undefined>(undefined);
    const resetUpstreamCategory = React.useCallback(
        () => setUpstreamCategory({ survey_id: survey?.id }),
        [setUpstreamCategory, survey?.id]
    );
    React.useEffect(resetUpstreamCategory, [resetUpstreamCategory]);

    return (<>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell component="th" scope="col" colSpan={2}>What?</TableCell>
                    <TableCell padding="checkbox"><IconButton component={Link} to={`/surveys/${survey?.uuid}/${centralJulianDay - 1}`}><ArrowLeftIcon /></IconButton></TableCell>
                    {julianDays.map(julianDay => (
                        <TableCell key={julianDay} component="th" scope="col">
                            {convertJulianDayToDate(julianDay).toLocaleDateString(undefined,
                                { weekday: 'short', day: 'numeric', month: 'numeric' })}
                        </TableCell>))}
                    <TableCell padding="checkbox"><IconButton component={Link} to={`/surveys/${survey?.uuid}/${centralJulianDay + 1}`}><ArrowRightIcon /></IconButton></TableCell>
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
        <SurveyDeleteButton surveyUuid={survey?.uuid} />
    </>);
}
