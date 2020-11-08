const fs = require('fs');
const { exec } = require("child_process");

fs.mkdirSync('build');

fs.mkdirSync('build/api');
exec('cd build/api && sqlite3 db.sqlite3 < ../../backend/db/schema.sql');
fs.copyFileSync('backend/conf/apache-htaccess', 'build/api/.htaccess');
fs.copyFileSync('backend/src/index.php', 'build/api/index.php');
