<?php

function handlePost($db, $query)
{
    $resource = $query['resource'];
    // TODO: die if not in whitelist
    $payload = json_decode(file_get_contents('php://input'), true);
    $columns = implode(", ", array_keys($payload));
    $bind_params = array_map(function ($c) {
        return ":$c";
    }, array_keys($payload));
    $placeholders = implode(", ", $bind_params);
    $stmt = $db->prepare("INSERT INTO $resource ($columns) VALUES ($placeholders);");
    if (!$stmt) {
        http_response_code(500);
        return;
    }
    foreach (array_combine($bind_params, array_values($payload)) as $placeholder => &$value) {
        $stmt->bindParam($placeholder, $value);
    }
    $result = $stmt->execute();
    return serveResourceById($db, $resource, $db->lastInsertRowID());
}
