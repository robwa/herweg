<?php
// ini_set('display_errors', 1);
// error_reporting(E_ALL);

require 'serveResourceById.php';
require 'serveResourceIndex.php';

require 'handleDelete.php';
require 'handleGet.php';
require 'handlePatch.php';
require 'handlePost.php';

function die_invalid_request()
{
  http_response_code(400);
  die();
}

function get_string_with_pattern(&$var, $pattern, $required = true)
{
  if (!isset($var)) {
    if (!$required) return null;
    die_invalid_request();
  }
  if (!is_string($var) || !preg_match($pattern, $var)) {
    die_invalid_request();
  }
  return $var;
}

function matchQuery()
{
  $resource = get_string_with_pattern(
    $_GET['resource'],
    '/\A[a-z]+\z/',
    true
  );

  $id = get_string_with_pattern(
    $_GET['id'],
    '/\A[-]?\d+\z/',
    false
  );

  $uuid = get_string_with_pattern(
    $_GET['uuid'],
    '/\A[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\z/i',
    false
  );

  $uncheckedFilter = $_GET['filter'] ?? [];
  if (!is_array($uncheckedFilter)) die_invalid_request();
  $filterKeys = array_map(
    function ($k) {
      if (!is_string($k) || !preg_match('/\A[a-z_]+\z/', $k)) {
        die_invalid_request();
      }
      return $k;
    },
    array_keys($uncheckedFilter)
  );
  $filterValues = array_map(
    function ($vs) {
      if (is_string($vs)) $vs = explode(',', $vs);
      if (!is_array($vs)) die_invalid_request();
      $vs = array_values($vs);
      foreach ($vs as $v) {
        if (!is_string($v)) die_invalid_request();
        // no need to check filter values
      }
      return $vs;
    },
    array_values($uncheckedFilter)
  );
  $filter = array_combine($filterKeys, $filterValues);

  return [
    'resource' => $resource,
    'id' => $id,
    'uuid' => $uuid,
    'filter' => $filter,
  ];
}

$db = new SQLite3("../db.sqlite3");
$query = matchQuery();

switch ($_SERVER["REQUEST_METHOD"]) {
  case 'POST':
    handlePost($db, $query);
    break;
  case 'GET':
    handleGet($db, $query);
    break;
  case 'DELETE':
    handleDelete($db, $query);
    break;
  case 'PATCH':
    handlePatch($db, $query);
    break;
  default:
    http_response_code(405);
}
