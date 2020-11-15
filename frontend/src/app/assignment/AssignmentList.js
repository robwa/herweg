import { List, ListItem, ListItemSecondaryAction, ListItemText } from "@material-ui/core";
import React from "react";
import { AssignmentDeleteButton } from "./AssignmentDeleteButton";

function AssignmentItem({ assignment }) {
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


export function AssignmentList({ assignmentData }) {
    return (<>
        <List>
            {assignmentData.map(assignment => <AssignmentItem key={assignment.id} {...{ assignment }} />)}
        </List>
    </>);
}
