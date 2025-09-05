<?php include 'headerT.php'; ?>


<?php
error_reporting("0");
print_r($_POST);
$firstName = $_POST['firstName'];
$lastName  = $_POST['lastName'];
$gender    = $_POST['gender'];
$email     = $_POST['email'];
$password  = $_POST['password'];
$number    = $_POST['phone'];

// Database connection
$conn = new mysqli('localhost','root','','edukond');
if($conn->connect_error){
    die("Connection Failed: " . $conn->connect_error);
}else{
    $stmt = $conn->prepare("INSERT INTO registration(firstName, lastName, gender, email, password, number) VALUES (?,?,?,?,?,?)");
    $stmt->bind_param("sssssi", $firstName, $lastName, $gender, $email, $password, $number);
    $stmt->execute();
    echo "Registration Successfully...";
    $stmt->close();
    $conn->close();
}
?>

<?php include 'footerT.php'; ?>