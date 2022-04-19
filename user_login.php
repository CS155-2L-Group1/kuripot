<?php
// header('Location:dashboard.html');
$creds = strval($_POST['cred']);
$pass = strval($_POST['pass']);
$jsonSQLFile = file_get_contents("mysql_data.json");
$jsonSQLLogin = json_decode($jsonSQLFile, true);
//PUT DATABASE INFORMATION HERE
$con = mysqli_connect($jsonSQLLogin['servername'],$jsonSQLLogin['username'],'',$jsonSQLLogin['password']);

if (!$con){
  die('Could not connect to server');
}

//CHECKS IF USERNAME OR EMAIL EXISTS
mysqli_select_db($con,"cs155project");
$sql="SELECT user_id, password FROM users WHERE username='".$creds."' or email_address='".$creds."'";
$result = mysqli_query($con,$sql);
if (mysqli_num_rows($result) > 0){
  $row = $result->fetch_row();
  if ($row[1] == $pass){
    echo "<script type='text/javascript'>alert('CORRECT');</script>";
    echo "<script>window.location = 'dashboard.html?uid=".$row[0]."'</script>";
    //login from here
  }
  else{
    echo "<script type='text/javascript'>alert('Incorrect password');</script>";
    echo "<script>window.location = 'index.html'</script>";
  }
}
else{
  echo "<script type='text/javascript'>alert('".$creds."Username or Email does not exist');</script>";
  echo "<script>window.location = 'index.html'</script>";
};
?>