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
        $stmt = $conn->prepare("SELECT * FROM registration WHERE loginType=? AND email=?");
        $stmt->bind_param("ss", $loginType, $emailOrUser);
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

<div class="flex justify-center items-center min-h-screen p-4 bg-gradient-to-br from-blue-200 to-sky-400 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500">

    <div class="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border-t-8 border-blue-600 dark:border-blue-400 transform scale-95 hover:scale-100 transition-transform duration-500 animate-fadeIn">

        <h2 class="text-3xl font-extrabold text-center text-blue-700 dark:text-blue-400 mb-6 animate-pulse">Login</h2>

        <?php if (!empty($errMessage)): ?>
            <div class="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300 text-sm rounded-lg flex items-center space-x-2 shadow">
                <svg class="w-5 h-5 text-red-500 dark:text-red-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-9-4a1 1 0 012 0v4a1 1 0 11-2 0V6zm1 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"/>
                </svg>
                <span><?= htmlspecialchars($errMessage) ?></span>
            </div>
        <?php endif; ?>

        <form method="POST" action="" class="space-y-5">

            <div>
                <label class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Login Type</label>
                <select name="login_type" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </div>

            <div>
                <label for="emailOrUser" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email / Username</label>
                <input type="text" name="emailOrUser" id="emailOrUser" placeholder="Enter email or username"
                       class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition"/>
            </div>

            <div>
                <label for="password" class="block text-gray-700 dark:text-gray-300 font-medium mb-2">Password</label>
                <input type="password" name="password" id="password" placeholder="Enter password"
                       class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 transition"/>
            </div>

            <button type="submit" 
                    class="w-full bg-gradient-to-r from-blue-600 to-sky-500 hover:from-sky-500 hover:to-blue-600 text-white py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-500">
                Login
            </button>
        </form>

        <div class="mt-6 text-center text-gray-600 dark:text-gray-300">
            <span>Don't have an account? </span>
            <a href="register.php" class="text-blue-700 dark:text-blue-400 font-medium hover:underline hover:text-blue-900 transition">Register Here</a>
        </div>
    </div>
</div>



<?php include 'footerT.php'; ?>
