<?php include 'headerT.php'; ?>

<?php
error_reporting(0);

// Collect form data
$user_id   = $_POST['user_id'];
$firstName = $_POST['firstName'];
$lastName  = $_POST['lastName'];
$gender    = $_POST['gender'];
$email     = $_POST['email'];
$password  = $_POST['password'];
$number    = $_POST['phone'];

//print_r($_POST);exit;
// Handle file upload (profile photo)
$photo = "";
if (isset($_FILES['photo_path']) && $_FILES['photo_path']['error'] === UPLOAD_ERR_OK) {
    $targetDir = "uploads/"; // make sure this folder exists and is writable
    $fileName = basename($_FILES["photo_path"]["name"]);
    $targetFilePath = $targetDir . $fileName;

    // Move uploaded file
    if (move_uploaded_file($_FILES["photo_path"]["tmp_name"], $targetFilePath)) {
        $photo = $fileName; // only store filename in DB
    }
}


// Database connection
$conn = new mysqli('localhost','root','','edukond');
if ($conn->connect_error) {
    die("Connection Failed: " . $conn->connect_error);
} else {
    $stmt = $conn->prepare("INSERT INTO registration 
    (user_id, firstName, lastName, gender, email, password, number, photo_path) 
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssis", $user_id, $firstName, $lastName, $gender, $email, $password, $number, $photo);
    $stmt->execute();

    echo "<p style='color:green; font-weight:bold;'>Registration Successful!</p>";

    $stmt->close();
    $conn->close();
}
?>

<?php include 'footerT.php'; ?>
