<?php

require('settings.ini');
if (!__DEV__) {
  error_reporting(0);
}

$connect = @mysql_connect($databaseURL, $username, $password);
mysql_select_db($database);

require('sql.php');
CourseRoadDB::initialize($databaseURL, $username, $password, $database);

unset($databaseURL, $username, $password, $database);

?>
