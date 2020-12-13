import { IconButton } from '@material-ui/core';
import { Edit as EditIcon } from '@material-ui/icons';
import React from 'react';
import { Category } from './Category';
import { UpdateCategoryForm } from './UpdateCategoryForm';

type EditableCategoryNameProps = { category: Category };
export function EditableCategoryName({ category }: EditableCategoryNameProps) {
    const [upstreamCategory, setUpstreamCategory] = React.useState<Category | null>(null);

    const handleEditStart = React.useCallback(
        () => setUpstreamCategory({ id: category.id, name: category?.name ?? '' }),
        [setUpstreamCategory, category?.id, category?.name]
    );

    const handleEditClose = React.useCallback(
        () => setUpstreamCategory(null),
        [setUpstreamCategory]
    );

    if (upstreamCategory) {
        return <UpdateCategoryForm {...{ upstreamCategory }} onSuccess={handleEditClose} />;
    }

    return (<>
        {category.name}<IconButton onClick={handleEditStart}><EditIcon /></IconButton>
    </>);
}
