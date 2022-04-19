<?php
$user_id = $_GET['id'];

$jsonSQLFile = file_get_contents("mysql_data.json");
$jsonSQLLogin = json_decode($jsonSQLFile, true);
//PUT DATABASE INFORMATION HERE
$con = mysqli_connect($jsonSQLLogin['servername'],$jsonSQLLogin['username'],'',$jsonSQLLogin['password']);

if (!$con){
    die('Could not connect to server');
  }

mysqli_select_db($con, "cs155project");

$sql = "SELECT * FROM income WHERE user_id='".$user_id."';";
$result = mysqli_query($con, $sql);

while($row=mysqli_fetch_assoc($result))
{
    $emparray[]=$row;
}
echo json_encode($emparray);
?>