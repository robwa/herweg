<?php

function serveResourceIndex($db, $resource, $filter)
{
    $filterPlaceholders = array_map(
        function ($k, $vs) { return array_map(
            function ($k, $idx) { return ":$k$idx"; },
            array_fill(0, count($vs), $k),
            range(1, count($vs))
        ); },
        array_keys($filter),
        array_values($filter)
    );

    $filterConditions = array_map(
        function ($k, $ps) { return "$k IN (" . implode(', ', $ps) . ")"; },
        array_keys($filter),
        $filterPlaceholders
    );

    $stmt = count($filterConditions) === 0
        ? $db->prepare("SELECT * FROM $resource WHERE deleted_at IS NULL;")
        : $db->prepare("SELECT * FROM $resource WHERE " . implode(' AND ', $filterConditions) . " AND deleted_at IS NULL;");
    if (!$stmt) {
        http_response_code(500);
        return;
    }

    $filterBindings = array_map(
        function ($ps, $vs) { return array_combine($ps, $vs); },
        $filterPlaceholders,
        array_values($filter)
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
