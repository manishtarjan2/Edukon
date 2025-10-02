<?php
session_start();
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edukond";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$errMessage = "";

// Handle login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $loginType = $_POST['login_type'];
    $emailOrUser = trim($_POST['emailOrUser']);
    $password = trim($_POST['password']);

    if (!empty($emailOrUser) && !empty($password)) {
        $stmt = $conn->prepare("SELECT * FROM registration WHERE loginType=? AND email = ?");
        $stmt->bind_param("ss", $loginType,$emailOrUser);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($row = $result->fetch_assoc()) {
            if ($password === $row['password']) { // Use password_verify() if hashed
                $_SESSION['email'] = $row["email"];
                $_SESSION['firstName'] = $row["firstName"];
                $_SESSION['lastName'] = $row["lastName"];
                $_SESSION['is_admin'] = ($loginType == 'admin');
                header($loginType == 'admin' ? "Location: users.php" : "Location: profile.php");
                exit();
            } else $errMessage = "Invalid email or password.";
        } else $errMessage = "Invalid email or password.";
        $stmt->close();
    } else {
        $errMessage = "Please enter both username/email and password.";
    }
}

include 'headerT.php';
?>

<div class="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-200 to-blue-300 p-4">

    <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 border-t-8 border-blue-600 animate-fadeIn scale-95 hover:scale-100 transition-transform duration-500">
        
        <h2 class="text-3xl font-extrabold text-center text-blue-700 mb-6 animate-pulse">Login</h2>

        <?php if (!empty($errMessage)): ?>
            <div class="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg flex items-center space-x-2 shadow">
                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-4a1 1 0 012 0v4a1 1 0 11-2 0V6zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"/></svg>
                <span><?= htmlspecialchars($errMessage) ?></span>
            </div>
        <?php endif; ?>

        <form method="POST" action="" class="space-y-5">
            <div>
                <label class="block text-gray-700 font-medium mb-2">Login Type</label>
                <select name="login_type" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div>
                <label for="emailOrUser" class="block text-gray-700 font-medium mb-2">Email / Username</label>
                <input type="text" name="emailOrUser" id="emailOrUser" placeholder="Enter email or username"
                       class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>

            <div>
                <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
                <input type="password" name="password" id="password" placeholder="Enter password"
                       class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
            </div>

            <button type="submit" 
                    class="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-sky-500 hover:to-blue-600 text-white py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-500">
                Login
            </button>
        </form>

        <div class="mt-6 text-center text-gray-600">
            <span>Don't have an account? </span>
            <a href="register.php" class="text-blue-700 font-medium hover:underline hover:text-blue-900 transition">Register Here</a>
        </div>
    </div>
</div>

<?php include 'footerT.php'; ?>
