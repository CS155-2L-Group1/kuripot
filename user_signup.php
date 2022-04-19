<?php
// header('Location:dashboard.html');
$uname = strval($_POST['uname']);
$email = strval($_POST['email']);
$pass = strval($_POST['pass']);
$jsonSQLFile = file_get_contents("mysql_data.json");
$jsonSQLLogin = json_decode($jsonSQLFile, true);
//PUT DATABASE INFORMATION HERE
$con = mysqli_connect($jsonSQLLogin['servername'],$jsonSQLLogin['username'],'',$jsonSQLLogin['password']);

if (!$con){
  die('Could not connect to server');
}

//CHECKS IF USERNAME OR EMAIL IS TAKEN CHANGE ECHO IF NEEDED
mysqli_select_db($con,"cs155project");
$sql="SELECT * FROM users WHERE username= '".$uname."'";
$result = mysqli_query($con,$sql);
if (mysqli_num_rows($result) > 0){
  echo "<script type='text/javascript'>alert('USERNAME IS TAKEN');</script>";
  echo "<script>window.location = 'index.html'</script>";
  return;
};

$sql="SELECT * FROM users WHERE email_address= '".$email."'";
$result = mysqli_query($con,$sql);
if (mysqli_num_rows($result) > 0){
  echo "<script type='text/javascript'>alert('Email address is taken');</script>";
  echo "<script>window.location = 'index.html'</script>";
  return;
};
//---------------------------------------TO-DO---------------------------------------
//PASS USER ID TO dashboard.html so user is signed in
$sql = "INSERT INTO USERS (username, email_address, password) VALUES ('".$uname."', '".$email."', '".$pass."');";
$con->query($sql);
$sql = "SELECT user_id FROM users WHERE username='".$uname."'";
$result = mysqli_query($con,$sql);
$row = $result->fetch_row();
$sql = "INSERT INTO overall (user_id, overall_income, overall_expense) VALUES (".$row[0].",0,0);";
$con->query($sql);
echo "<script type='text/javascript'>alert('Sign up successful');</script>";
echo "<script>window.location = 'index.html'</script>";
?>