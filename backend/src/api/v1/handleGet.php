<?php

function handleGet($db, $query)
{
    $resource = $query['resource'];

    if (isset($query['id'])) {
        return serveResourceById($db, $query['resource'], $query['id']);
    }

    return serveResourceIndex($db, $query['resource'], $query['filter']);
}
