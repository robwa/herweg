import { CircularProgress, Table, TableBody, TableCell, TableFooter, TableHead, TableRow, Typography } from "@material-ui/core";
import { fetchMany } from "api/fetchMany";
import { fetchOne } from "api/fetchOne";
import { AssignmentForm } from "app/assignment/AssignmentForm";
import { CategoryForm } from "app/category/CategoryForm";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { AssignmentList } from "../assignment/AssignmentList";

function SurveyTableRow({ category, assignments }) {
    const assignmentData = assignments.data.filter(a => a.category_id === category.id);

    return (<>
        <TableRow>
            <TableCell component="th" scope="row">
                {category.name}
            </TableCell>
            <TableCell>
                <AssignmentList  {...{ assignmentData }} />
                <AssignmentForm categoryId={category.id} />
            </TableCell>
        </TableRow>
    </>);
}

function SurveyTableRows({ categories, assignments }) {
    return categories.data.map(category => (
        <SurveyTableRow key={category.id} {...{ category, assignments }} />));
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


    const { data: assignments } = useQuery(['assignments', {
        filter: { category_id: categoryIds.join(',') }
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
                    <TableCell component="th" scope="col">Who?</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                <SurveyTableRows {...{ categories, assignments }} />
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell><CategoryForm surveyId={survey.data.id} /></TableCell>
                </TableRow>
            </TableFooter>
        </Table>
    </>);
}
