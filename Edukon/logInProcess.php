  
  <?php include 'headerT.php'; ?>
  
  <?php
session_start();

// Database connection
$conn = new mysqli("localhost", "root", "", "edukond");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get form input
$username = $_POST['username'];
$password = $_POST['password'];

// Find user in DB
$sql = "SELECT * FROM users WHERE username = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $row = $result->fetch_assoc();
    // Verify password
    if (password_verify($password, $row['password'])) {
        // Save session
        $_SESSION['user_id'] = $row['id'];
        $_SESSION['username'] = $row['username'];
        header("Location: dashboard.php");
        exit();
    } else {
        header("Location: login.php?error=Invalid password");
        exit();
    }
} else {
    header("Location: login.php?error=User not found");
    exit();
}

$stmt->close();
$conn->close();
?>

  

  <?php include 'footerT.php' ;?>