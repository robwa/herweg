<?php
//ini_set('display_errors', 1);
//error_reporting(E_ALL);

require 'serveResourceById.php';
require 'serveResourceIndex.php';

require 'handleGet.php';
require 'handlePost.php';

function matchRequestPath()
{
  $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

  $base = '/api/v1';
  $groups = [
    'resource' => '(?<resource>[^/]+)',
    'id' => '(?<id>\d+)',
    'uuid' => '(?<uuid>[^/]+)',
  ];

  if (preg_match('#\A' . $base . '/' . $groups['resource'] . '\z#', $path, $matches)) {
    return $matches;
  }

  if (preg_match('#\A' . $base . '/' . $groups['resource'] . '/' . $groups['id'] . '\z#', $path, $matches)) {
    return $matches;
  }

  if (preg_match('#\A' . $base . '/' . $groups['resource'] . '/' . $groups['uuid'] . '\z#', $path, $matches)) {
    return $matches;
  }

  http_response_code(404);
  die();
}

$db = new SQLite3("db.sqlite3");
$uriMatch = matchRequestPath();

switch ($_SERVER["REQUEST_METHOD"]) {
  case 'POST':
    handlePost($db, $uriMatch);
    break;
  case 'GET':
    handleGet($db, $uriMatch);
    break;
  default:
    http_response_code(405);
}
