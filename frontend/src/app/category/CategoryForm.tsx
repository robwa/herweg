import { IconButton, TextField } from '@material-ui/core';
import { Save as AddIcon } from "@material-ui/icons";
import React from "react";
import { Category } from './Category';

const DISPLAY_FLEX = { display: 'flex' };

type CategoryFormProps = { upstreamCategory: Category, onSubmit: (category: Category) => void }
export function CategoryForm({ upstreamCategory, onSubmit }: CategoryFormProps) {
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
            <TextField value={category?.name ?? ''} onChange={handleNameChange} required variant="outlined" />
            <IconButton type="submit"><AddIcon /></IconButton>
        </form>
    </>);
}
