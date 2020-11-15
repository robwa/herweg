<?php

function handleDelete($db, $query)
{
    if(isset($query['id'])) {
        deleteBy($db, $query, 'id');
        return;
    }

    if(isset($query['uuid'])) {
        deleteBy($db, $query, 'uuid');
        return;
    }

    http_response_code(400);
    die();
}

function deleteBy($db, $query, $key) {
    $resource = $query['resource'];

    $stmt = $db->prepare("UPDATE $resource SET deleted_at = julianday('now') WHERE $key = :val;");
    if (!$stmt) {
        http_response_code(500);
        return;
    }
    $stmt->bindParam(':val', $query[$key]);
    $result = $stmt->execute();
    http_response_code(204);
}
