<?php
/**
 * CourseRoad: A Four-Year Planner for the MIT Undergraduate Community
 * August 17, 2012
 * By: Danny Ben-David (dannybd@mit.edu)
 * 
 * CourseRoad is published under the MIT License, as follows:
 *
 * Copyright (c) 2012 Danny Ben-David (dannybd@mit.edu)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation 
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, 
 * and/or sell copies of the Software, and to permit persons to whom the 
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included 
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR 
 * OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, 
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
 * OTHER DEALINGS IN THE SOFTWARE.
 */

// connect to database
require('connect.php'); 
session_start();
require('functions.php'); 

// Makes it easier to test POST code
if (__DEV__ && isset($_GET['dev'])) {
  $_POST = $_POST + $_GET; 
}

get_csrf_token();

// Yields a JSON-encoded list of classes which match the autocompletion field
// in the Add Class tab.
if (isset($_POST['autocomplete'])) {
  $search = mysql_real_escape_string($_POST['autocomplete']);
  $temp = array();
  $query = mysql_query(
    "SELECT DISTINCT `subject_id` FROM `warehouse` " .
    "WHERE `subject_id` LIKE '$search%' ORDER BY `subject_id` LIMIT 6"
  );
  while($row = mysql_fetch_array($query)) {
    $temp[] = $row['subject_id'];
  }
  dieJSON($temp);
}

// Loads class data from the database and serves up the JSON which CourseRoad 
// requires to load that class.
if (isset($_POST['getclass'])){
  $class = mysql_real_escape_string($_POST['getclass']);
  $year = isset($_POST['getyear'])
    ? mysql_real_escape_string($_POST['getyear'])
    : false;
  dieJSON(pullClass($class, $year));
}

// Same, but for a custom class. These are used by the Add tab.
if (isset($_POST['getcustom'])){
  $name = htmlentities($_POST['getcustom']);
  $units = isset($_POST['getunits']) ? floatval($_POST['getunits']) : false;
  dieJSON(pullCustom($name, $units));
}

// Returns the desired hash's class and major data
if (isset($_POST['gethash'])){
  require_csrf();
  // Strip the leading octothrope
  $hash = substr($_POST['gethash'], 1);
  $json = buildClassesArray($hash);
  dieJSON($json);
}

// If we haven't tried to log in, then default to false.
if (!isset($_SESSION['triedcert'])) {
  $_SESSION['triedcert'] = false;
}

// SESSION.athena is only set within secure.php, so if it has a value then we've
// logged in sucessfully
$loggedin = isset($_SESSION['athena']);
$athena = $loggedin ? $_SESSION['athena'] : false;

// Without logging in, we don't have a user pref map, so this sets the default.
// class_year is assumed to be that of the freshmen.
if (!isset($_SESSION['user'])) {
  $_SESSION['user'] = array(
    'class_year' => strval(date('Y') + (date('m') > 7) + 3),
    'view_req_lines' => 1,
    'autocomplete' => 1,
    'need_permission' => 0,
    'edited' => 0
  );
}

// If logged in, repopulate the user prefs with their real values.
if ($loggedin) {
  $tempuser = mysql_fetch_assoc(mysql_query(
    "SELECT * FROM `users` WHERE `athena`='$athena'"
  ));
  if ($tempuser) {
    $_SESSION['user']['class_year'] = $tempuser['class_year'];
    $_SESSION['user']['view_req_lines'] = $tempuser['view_req_lines'];
    $_SESSION['user']['autocomplete'] = $tempuser['autocomplete'];
    $_SESSION['user']['need_permission'] = $tempuser['need_permission'];
    unset($tempuser);
  }
}

/**
 * This runs if the user has click "save road". It determines the login 
 * status of the user and sets the hash to be either random characters 
 * or something like username/20120504051511
 */
if (isset($_POST['saveNewRoad'])) {
  require_csrf();
  $classes = mysql_real_escape_string(encrypt($_POST['classes']));
  $majors = mysql_real_escape_string(encrypt($_POST['majors']));
  $hash = substr(
    strtr(
      base64_encode(md5($classes . $majors)), 
      '+/=', 
      '-_,'
    ), 0, 5
  );
  for (
    $i = ''; 
    hash_is_safe($hash . $i, $classes, $majors); 
    $i === '' 
      ? $i = 0 
      : $i++
  );
  $hash .= $i;
  $_SESSION['crhash'] = $hash;
  $trycert = false;
  if ($_POST['trycert']) {
    if ($loggedin) {
      $saveas = date('YmdHis');
      $hash = $athena . '/' . $saveas;
    }else if (!$_SESSION['triedcert']) {
      $_SESSION['trycert'] = true;
    }
  }
  // id, hash, user, classes, majors, public, desc, ip, added
  $sql = (
    "INSERT INTO `roads2` (`hash`, `user`, `classes`, `majors`, `ip`) VALUES " .
    "('$hash', '$athena', '$classes', '$majors', '{$_SERVER['REMOTE_ADDR']}');"
  );
  mysql_query($sql);
  // The **auth** lets the user's browser know to try to log in
  die(isset($_SESSION['trycert']) ? '**auth**' : $hash); 
}

if (isset($_SESSION['trycert']) || isset($_GET['triedlogin'])) {
  // This only happens when the check has failed, and the user isn't 
  // authenticated.
  $_SESSION['triedcert'] = true;
  unset($_SESSION['trycert']);
  if (!isset($_SESSION['crhash'])) {
    $_SESSION['crhash'] = 'error401';
  }
  redirect_hash($_SESSION['crhash']);
}

// Returns the desired table of saved roads when the user is logged in
if (isset($_POST['savedroads'])) {
  require_csrf();
  if (!$loggedin) {
    die('Sorry, you need to log in again.');
  }
  $sql = "SELECT * FROM `roads2` WHERE `user`='$athena' ORDER BY `added` DESC";
  $query = mysql_query($sql);
  echo "<table>\n";
  echo "<tr>";
  echo (
    "<th style=\"min-width:50px\" title=\"Select if you'd like one of " . 
    "your saved roads to be available more easily at " .
    "courseroad.mit.edu/index.php#{$_SESSION['athena']}\">Public</th>"
  );
  echo "<th style=\"min-width:118px\">Hash</th>";
  echo "<th style=\"min-width:118px\">Added</th>";
  echo "<th style=\"min-width:95px\">Major(s)</th>";
  echo "<th>Classes</th>";
  echo "<th style=\"min-width:30px;max-width:120px;\">Comment</th>";
  echo "<th>Delete?</th>";
  echo "</tr>\n";
  echo "<tr>";
  $numrows = mysql_query(
    "SELECT COUNT(*) FROM `roads2` " .
    "WHERE `hash` LIKE '$athena/%' AND `public`='1'"
  );
  $numrows = mysql_fetch_array($numrows);
  $numrows = $numrows[0];
  echo (
    "<td><input type=\"radio\" name=\"setPublicRoad\" " .
    "class=\"setPublicRoad\" value=\"null\" " .
    ($numrows ? "" : "checked=\"true\" ") . "/></td>"
  );
  echo (
    "<td colspan=\"6\">Select this row to prevent any of your " .
    "saved roads from being your publicly-facing road.</td>"
  );
  echo "</tr>\n";
  while($row = mysql_fetch_array($query)) {
    $row['classes'] = decrypt($row['classes']);
    $row['majors'] = decrypt($row['majors']);
    $hash = stripslashes($row['hash']);
    $roadURL = "?hash=$hash";
    echo "<tr data-hash=\"$hash\">";
    echo (
      "<td><input type=\"radio\" name=\"setPublicRoad\" " .
      "class=\"setPublicRoad\" value=\"$hash\" " .
      ($row['public'] === "1" ? "checked=\"true\" " : "") . "/></td>"
    );
    echo (
      "<td><span class=\"saved-roads-hash\">" .
      substr(strstr($hash, "/"), 1) . "</span><span " .
      "class=\"saved-roads-edit-hash ui-icon ui-icon-pencil\"></span></td>"
    );
    echo (
      "<td><a class=\"hashlink\" href=\"$roadURL\">" .
      stripslashes($row['added']) . "</a></td>"
    );
    $majors = stripslashes($row['majors']);
    if ($majors[0] != '[') {
      $majors = "[\"$majors\"]";
    }
    $majors = str_replace(',"m0"', '', $majors);
    $majors = implode(",<br>\n", json_decode($majors));
    echo "<td>$majors</td>";
    $classes = json_decode($row['classes'], true);
    $classes2 = array();
    foreach($classes as &$class2) {
      if (isset($class2["custom"])) {
        $class2['id'] = '(' . $class2['name'] . ')';
      }
      if (!isset($class2['id'])) {
        continue;
      }
      if (isset($class2['override']) && $class2['override']) {
        $class2['id'] .= '*';
      }
      $classes2[] = $class2['id'];
    }
    echo '<td>' . implode(', ', $classes2) . '</td>';
    echo (
      "<td><span class=\"saved-roads-comment\">" .
      $row['comment'] . "</span><span ". 
      "class=\"saved-roads-edit-comment ui-icon ui-icon-pencil\"></span></td>"
    );
    echo "<td><span class=\"deleteroad ui-icon ui-icon-close\"></span></td>";
    echo "</tr>\n";
  }
  echo "</table>";
  die();
}

// Runs when the user sets one of their roads to be their public road
if (isset($_POST['setPublicRoad'])) {
  require_csrf();
  $hash = mysql_real_escape_string($_POST['setPublicRoad']);
  if (!$loggedin) {
    die();
  }
  if (($athena != strstr($hash, '/', true)) && ($hash != 'null')) {
    die();
  }
  mysql_query(
    "UPDATE `roads2` SET `public`= CASE " .
    "WHEN `hash`='$hash' THEN '1' ELSE '0' END WHERE `user`='$athena'"
  );
  die('ok');
}

// When the user changes a road's hash
if (isset($_POST['changeroadhash'])) {
  require_csrf();
  $hash = mysql_real_escape_string($_POST['changeroadhash']);
  $newhash = mysql_real_escape_string(
    $athena . '/' . htmlentities(substr($_POST['newhash'], 0, 36))
  );
  if (!$loggedin || 
      preg_match('/\/.*?[^A-Za-z0-9\-]/', $newhash) || 
      !strlen($_POST['newhash'])) {
    die($hash);
  }
  if (($athena != strstr($hash, '/', true)) && ($hash != 'null')) {
    die($hash);
  }
  if (mysql_num_rows(mysql_query(
    "SELECT * FROM `roads2` WHERE `hash`='$newhash'"))) {
    die($hash);
  }
  mysql_query("UPDATE `roads2` SET `hash`='$newhash' WHERE `hash`='$hash'");
  die($newhash);
}

// And when the user adds a comment
if (isset($_POST['commentonroad'])) {
  require_csrf();
  $hash = mysql_real_escape_string($_POST['commentonroad']);
  $comment = mysql_real_escape_string(
    htmlentities(substr($_POST['commentforroad'], 0, 100))
  );
  if (!$loggedin) {
    die($hash);
  }
  if (($athena != strstr($hash, '/', true)) && ($hash != 'null')) {
    die();
  }
  mysql_query("UPDATE `roads2` SET `comment`='$comment' WHERE `hash`='$hash'");
  die(stripslashes($comment));
}

//Similarly, runs when the user deletes a road.
if (isset($_POST['deleteroad'])) {
  require_csrf();
  $hash = mysql_real_escape_string($_POST['deleteroad']);
  if (!$loggedin) die();
  if (($athena != strstr($hash, '/', true)) && ($hash != 'null')) die();
  if ($hash != 'null') mysql_query("DELETE FROM `roads2` WHERE `hash`='$hash'");
  die('ok');
}

// When the user saves changes to their user prefs, we update their prefs if
// they're logged in and redisplay the userprefs HTML.
if (isset($_POST['usersettings'])) {
  require_csrf();
  $_SESSION['user']['class_year'] = intval(
    mysql_real_escape_string($_POST['class_year'])
  );
  $_SESSION['user']['view_req_lines'] = (
    $_POST['toggle_view_req_lines'] == '1' ? 1 : 0
  );
  $_SESSION['user']['autocomplete'] = (
    mysql_real_escape_string($_POST['toggle_autocomplete']) == 1 ? 1 : 0
  );
  $_SESSION['user']['edited'] = $loggedin ? 0 : 1;
  if ($loggedin) {
    mysql_query(
      "UPDATE `users` SET `class_year`='{$_SESSION['user']['class_year']}', " .
      "`view_req_lines`='{$_SESSION['user']['view_req_lines']}', " . 
      "`autocomplete`='{$_SESSION['user']['autocomplete']}' " .
      "WHERE `athena`='$athena'"
    );
  }
  $view_req_lines = $_SESSION['user']['view_req_lines']
    ? 'checked="checked"'
    : '';
  $autocomplete = $_SESSION['user']['autocomplete']
    ? 'checked="checked"'
    : '';
  echo <<<EOD
    <label for="usersettings_class_year">Class Year: </label>
    <input id="usersettings_class_year" type="text" name="class_year" 
      value="{$_SESSION['user']['class_year']}"><br>
    <label for="usersettings_view_req_lines">Toggle requisite lines: </label>
    <input id="usersettings_view_req_lines" type="checkbox" 
      name="view_req_lines" value="1" $view_req_lines><br>
    <label for="usersettings_autocomplete">Toggle autocomplete: </label>
    <input id="usersettings_autocomplete" type="checkbox" name="autocomplete" 
      value="1" $autocomplete><br>
EOD;
  die();
}

if (__DEV__ && isset($_GET['user'])) {
  $msg = (
    "user<br><pre>" . 
    print_r(@$_SESSION, true) . 
    "\n\n\n" . 
    print_r(@$_SERVER, true) . 
    "</pre>"
  );
  die($msg);
}
?>