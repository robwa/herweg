<?php

function serveResourceById($db, $resource, $id)
{
    $stmt = $db->prepare("SELECT * FROM $resource WHERE id = :id;");
    if (!$stmt) {
        http_response_code(500);
        return;
    }
    $stmt->bindParam(':id', $id);
    $result = $stmt->execute();
    while ($row = $result->fetchArray()) {
        $row = array_filter($row, 'is_string', ARRAY_FILTER_USE_KEY);
        header('Content-Type: application/json');
        echo json_encode($row);
        return;
    }
    http_response_code(404);
}
