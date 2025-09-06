<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edukond";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}



$errMessage = "";
if(@$_POST) {
  $sql = "SELECT * FROM registration WHERE email='".$_POST['email']."' AND password='".$_POST['password']."'";
  $result = $conn->query($sql);

  if ($result->num_rows > 0) {

    // session 
    $row = $result->fetch_assoc();
    $_SESSION['email']=$row["email"];
    $_SESSION['firstName']=$row["firstName"];
    $_SESSION['lastName']=$row["lastName"]; 
  
header("location:profile.php");
   // print_r($row);
  $conn->close();
  } else {
    $errMessage = "Please enter the correct login credential.";
  }
}

include 'headerT.php'; 
?>
<div style="margin-top:10px; border: radius 5px; padding:40px;">
<?php 
if(empty($_SESSION['email'])){
echo $errMessage;?>
<form name="login" id="login" method="post" action="">
  <input type="email" name="email" id="email" placeholder="Enter email" />
  <input type="password" name="password" id="password"  />
  <input type="submit" name="loginSubmit" value="Login" />

</form>
<?php }
echo @$_SESSION['email'];
?>

</div>

<?php include 'footerT.php'; ?>