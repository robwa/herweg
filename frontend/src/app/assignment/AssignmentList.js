import { List, ListItem } from "@material-ui/core";
import React from "react";

export function AssignmentList({ assignmentData }) {
    return (<>
        <List>
            {assignmentData.map(a => <ListItem key={a.id}>{a.assignee}</ListItem>)}
        </List>
    </>);
}
