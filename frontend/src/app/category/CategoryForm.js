import { FormGroup, IconButton, Input } from '@material-ui/core';
import { Save as AddIcon } from "@material-ui/icons";
import React from "react";

const DISPLAY_FLEX = { display: 'flex' };

export function CategoryForm({ upstreamCategory, onSubmit }) {
    const [category, setCategory] = React.useState(upstreamCategory ?? {});
    React.useEffect(
        () => setCategory(upstreamCategory ?? {}),
        [setCategory, upstreamCategory]
    );

    const handleNameChange = React.useCallback(
        e => setCategory(prev => ({ ...prev, name: e.target.value })),
        [setCategory]
    );

    const handleSubmit = React.useCallback(
        e => {
            e.preventDefault();
            onSubmit(category);
        },
        [onSubmit, category]
    );

    return (<>
        <form onSubmit={handleSubmit} style={DISPLAY_FLEX}>
            <Input value={category?.name ?? ''} onChange={handleNameChange} required variant="outlined" />
            <IconButton type="submit"><AddIcon /></IconButton>
        </form>
    </>);
}
