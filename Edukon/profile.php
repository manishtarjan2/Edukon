<?php
session_start();
include 'headerT.php';

// Redirect if not logged in
if (!isset($_SESSION['email'])) {
    header("Location: login.php");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edukond";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// Fetch logged-in user
$stmt = $conn->prepare("SELECT * FROM registration WHERE email = ?");
$stmt->bind_param("s", $_SESSION['email']);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Profile photo (check if uploaded, else fallback to default)
$imgPath = (!empty($user["photo_path"]) && file_exists("uploads/" . $user["photo_path"])) 
    ? "uploads/" . htmlspecialchars($user["photo_path"]) 
    : "uploads/default.jpeg";
?>

<!-- Main Content -->
<div class="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-4xl font-bold text-gray-800 dark:text-gray-100">
            Welcome, <?= htmlspecialchars($user['firstName']) ?>
        </h2>
        <a href="logout.php" class="text-red-500 hover:underline text-lg">Logout</a>
    </div>

    <!-- Profile Card -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8 transition transform hover:scale-[1.01]">
        
        <!-- Profile Photo -->
        <div class="relative">
            <img src="<?= $imgPath ?>" 
                 alt="Profile Photo" 
                 class="w-36 h-36 rounded-full object-cover border-4 border-blue-500 shadow-md">
            <span class="absolute bottom-2 right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800"></span>
        </div>

        <!-- Profile Details -->
        <div class="flex-1 space-y-3">
            <h3 class="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
                <?= htmlspecialchars($user['firstName'] . ' ' . $user['lastName']) ?>
            </h3>
            <p class="text-gray-700 dark:text-gray-300"><strong>User ID:</strong> <?= htmlspecialchars($user['user_id']) ?></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Email:</strong> <?= htmlspecialchars($user['email']) ?></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Gender:</strong> <?= htmlspecialchars($user['gender']) ?></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Phone:</strong> <?= htmlspecialchars($user['phone'] ?? 'Not Provided') ?></p>
            <p class="text-gray-700 dark:text-gray-300"><strong>Address:</strong> <?= htmlspecialchars($user['address'] ?? 'Not Provided') ?></p>
        </div>
    </div>
</div>

<?php
$stmt->close();
$conn->close();
include 'footerT.php';
?>
