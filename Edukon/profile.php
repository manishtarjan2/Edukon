<?php
session_start();
echo //"We are save your session";

include 'headerT.php'; 

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
if(@$_SESSION['email']) {
  $sql = "SELECT * FROM registration WHERE email='".$_SESSION['email']."'";
  $result = $conn->query($sql);


  

  if ($result->num_rows > 0) {



     echo '<table border="1">
  <tr><th>ID</th>
   <th>User_id</th>
  <th>First Name</th>
  <th>Last Name</th>
   <th>Gender</th>
  <th>Email</th>
        <th>Action</th></tr>';

    // session 
    $row = $result->fetch_assoc();
    
    echo '<tr><td>'.$row["id"].'</td>
     <td>'.$row["user_id"].'</td>
    <td>'.$row["firstName"].'</td>
    <td>'.$row["lastName"].'</td>
     <td>'.$row["gender"].'</td>
      <td>'.$row["email"].'</td>
      <td>'.$row["password"].'</td>

    <td><a href="edituser.php?id='.$row["id"].'">Edit</a></td>
    </tr>';
  

   // print_r($row);
  $conn->close();
  } else {
    $errMessage = "Please enter the correct login credential.";
  }
} else{
 header("location:login.php");
}

?>


</div>

<?php include 'footerT.php'; ?>