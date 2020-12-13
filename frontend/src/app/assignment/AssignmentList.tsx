import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import React from "react";
import { Assignment } from "./Assignment";
import { AssignmentDeleteButton } from "./AssignmentDeleteButton";

type AssignmentItemProps = { assignment: Assignment };
function AssignmentItem({ assignment }: AssignmentItemProps) {
    return (
        <ListItem>
            <ListItemText>
                {assignment.assignee}
            </ListItemText>
            <ListItemSecondaryAction>
                <AssignmentDeleteButton assignmentId={assignment.id} />
            </ListItemSecondaryAction>
        </ListItem>
    );
}

type AssignmentListProps = { assignmentData: Assignment[] };
export function AssignmentList({ assignmentData }: AssignmentListProps) {
    return (<>
        <List>
            {assignmentData.map(assignment => <AssignmentItem key={assignment.id} {...{ assignment }} />)}
        </List>
    </>);
}
