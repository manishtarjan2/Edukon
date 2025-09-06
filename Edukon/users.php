<?php include 'headerT.php'; ?>

<?php
echo "Dashboard";
?>

<!--  --->
  <!--  -->

&puncsp;
<?php
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



$sql = "SELECT * FROM registration";
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
  // output data of each row
  while($row = $result->fetch_assoc()) {
    echo '<tr><td>'.$row["id"].'</td>
     <td>'.$row["user_id"].'</td>
    <td>'.$row["firstName"].'</td>
    <td>'.$row["lastName"].'</td>
     <td>'.$row["gender"].'</td>
      <td>'.$row["email"].'</td>
      <td>'.$row["password"].'</td>

    <td><a href="edituser.php?id='.$row["id"].'">Edit</a></td>
    </tr>';
  }


  echo "</table>";
} else {
  echo "0 results";
}
$conn->close();
?>

<?php include 'footerT.php'; ?>
