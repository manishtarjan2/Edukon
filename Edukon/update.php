<?php include 'headerT.php'; ?>

<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edukond";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);
// Check connection
if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "UPDATE registration SET 
firstName='".$_POST["firstName"]."', 
lastName='".$_POST["lastName"]."'
WHERE id='".$_POST["id"]."'";

if (mysqli_query($conn, $sql)) {
  //echo "Record updated successfully";
  header("location:users.php");exit;
} else {
  echo "Error updating record: " . mysqli_error($conn);
}

mysqli_close($conn);
?>

<?php include 'footerT.php'; ?>