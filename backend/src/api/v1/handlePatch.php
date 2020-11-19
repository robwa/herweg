<?php

function determineWhereConstraint($query)
{
    if (isset($query['id'])) {
        return ['key' => 'id', 'value' => $query['id']];
    }
    // if (isset($query['uuid'])) {
    //     return ['key' => 'uuid', 'value' => $query['uuid']];
    // }

    http_response_code(400);
    die();
}

function handlePatch($db, $query)
{
    $resource = $query['resource'];
    // TODO: die if not in whitelist

    $where = determineWhereConstraint($query);
    $whereKey = $where['key'];

    $payload = json_decode(file_get_contents('php://input'), true);
    $updateMapping = array_map(function ($c) {
        return "$c = :$c";
    }, array_keys($payload));
    $updateString = implode(", ", $updateMapping);
    $stmt = $db->prepare("UPDATE $resource SET $updateString WHERE $whereKey = :$whereKey;");
    if (!$stmt) {
        http_response_code(500);
        return;
    }
    foreach ($payload as $c => &$value) {
        $stmt->bindParam(":$c", $value);
    }
    $stmt->bindParam(":$whereKey", $where['value']);

    if ($whereKey === 'id') {
        $stmt->execute();
        return serveResourceById($db, $resource, $where['value']);
    }

    http_response_code(500);// not implemented
}
