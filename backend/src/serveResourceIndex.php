<?php

function serveResourceIndex($db, $resource, $filter)
{
    $filterKeys = array_keys($filter);

    $filterValues = array_map(
        function ($v) { return is_array($v) ? $v : explode(',', $v); },
        array_values($filter)
    );

    $filterPlaceholders = array_map(
        function ($k, $vs) { return array_map(
            function ($k, $idx) { return ":$k$idx"; },
            [ $k ],
            range(1, count($vs))
        ); },
        $filterKeys,
        $filterValues
    );

    $filterConditions = array_map(
        function ($k, $ps) { return "$k IN (" . implode(', ', $ps) . ")"; },
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
        function ($ps, $vs) { return array_combine($ps, $vs); },
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
