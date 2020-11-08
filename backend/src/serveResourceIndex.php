<?php

function serveResourceIndex($db, $resource, $filter)
{
    $filterConditions = implode(
        ' AND ',
        array_map(
            fn ($c) => "$c = :$c",
            array_keys($filter)
        )
    );
    $placeholders = array_map(
        fn ($c) => ":$c",
        array_keys($filter)
    );
    $stmt = count($filter) === 0
        ? $db->prepare("SELECT * FROM $resource;")
        : $db->prepare("SELECT * FROM $resource WHERE $filterConditions;");
    if (!$stmt) {
        http_response_code(500);
        return;
    }
    foreach (array_combine($placeholders, array_values($filter)) as $placeholder => &$value) {
        $stmt->bindParam($placeholder, $value);
    }
    $result = $stmt->execute();

    $resources = [];
    while ($row = $result->fetchArray()) {
        $row = array_filter($row, 'is_string', ARRAY_FILTER_USE_KEY);
        array_push($resources, $row);
    }
    header('Content-Type: application/json');
    echo json_encode($resources);
}
