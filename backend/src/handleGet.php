<?php

function handleGet($db, $pathMatch)
{
    $resource = $pathMatch['resource'];

    $filter = $_GET['filter'] ?? [];

    if (array_key_exists('id', $pathMatch)) {
        return serveResourceById($db, $resource, $pathMatch['id']);
    }

    return serveResourceIndex($db, $resource, $filter);
}
