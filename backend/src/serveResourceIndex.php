<?php

function serveResourceIndex($db, $resource, $filter)
{
    $filterKeys = array_keys($filter);

    $filterValues = array_map(
        fn ($v) => is_array($v) ? $v : explode(',', $v),
        array_values($filter)
    );

    $filterPlaceholders = array_map(
        fn ($k, $vs) => array_map(
            fn ($idx) => ":$k$idx",
            range(1, count($vs))
        ),
        $filterKeys,
        $filterValues
    );

    $filterConditions = array_map(
        fn ($k, $ps) => "$k IN (" . implode(', ', $ps) . ")",
        $filterKeys,
        $filterPlaceholders
    );

    $stmt = count($filterConditions) === 0
        ? $db->prepare("SELECT * FROM $resource;")
        : $db->prepare("SELECT * FROM $resource WHERE " . implode(' AND ', $filterConditions) . ";");
    if (!$stmt) {
        http_response_code(500);
        return;
    }

    $filterBindings = array_map(
        fn ($ps, $vs) => array_combine($ps, $vs),
        $filterPlaceholders,
        $filterValues
    );

    foreach ($filterBindings as $bs) {
        foreach ($bs as $p => &$v) {
            $stmt->bindParam($p, $v);
        }
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
