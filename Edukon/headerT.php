<?php


// Database connection
$conn = new mysqli("localhost", "root", "", "edukond");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// Check login
$isLoggedIn = isset($_SESSION['email']);
$userPhoto = 'uploads/default.jpeg'; // Default photo

// Get profile photo
if ($isLoggedIn) {
    $stmt = $conn->prepare("SELECT photo_path FROM registration WHERE email=?");
    $stmt->bind_param("s", $_SESSION['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $userPhoto = !empty($row['photo_path']) && file_exists("uploads/" . $row['photo_path'])
                     ? "uploads/" . htmlspecialchars($row['photo_path'])
                     : "uploads/default.jpeg";
    }
    $stmt->close();
}

// Logout
if (isset($_GET['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit();
}

$currentPage = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Edukon</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={darkMode:'class'};</script>
<style>
.nav-link.active { font-weight: 700; color: #2563eb; }

/* Rotating ring animation */
@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 4s linear infinite; }

/* Three-dot menu */
.three-dots { width: 24px; height: 24px; display:flex; flex-direction: column; justify-content: center; align-items: center; cursor:pointer; gap:3px;}
.three-dots span { width: 4px; height: 4px; background-color: currentColor; border-radius: 50%; display:block; }
</style>
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

<!-- Header -->
<header class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

    <!-- Logo -->
    <div class="flex items-center gap-3">
      <img src="https://img.icons8.com/color/48/school.png" class="h-10 w-10" alt="Edukon Logo">
      <span class="font-extrabold text-xl text-blue-600 dark:text-blue-400 select-none">Edukon</span>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-6">
      <a href="index.php" class="nav-link <?= $currentPage=='index.php'?'active':'' ?>">Home</a>
      <a href="" class="nav-link <?= $currentPage=='about.php'?'active':'' ?>">SyllabusT</a>
      <a href="contact.php" class="nav-link <?= $currentPage=='contact.php'?'active':'' ?>">RankOn</a>
      <a href="service.php" class="nav-link <?= $currentPage=='service.php'?'active':'' ?>">Service</a>
      <a href="users.php" class="nav-link <?= $currentPage=='users.php'?'active':'' ?>">Dashboard</a>

      <?php if (!$isLoggedIn): ?>
        <a href="login.php" class="nav-link <?= $currentPage=='login.php'?'active':'' ?>">Login</a>
      <?php endif; ?>

      <!-- Classic Emoji Mode Toggle -->
      <button id="themeToggle" class="text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        <span id="themeEmoji">🌙</span>
      </button>

      <!-- Profile Icon with Rotating Ring -->
      <?php if ($isLoggedIn): ?>
        <div class="relative w-10 h-10">
          <span class="absolute inset-0 rounded-full border-2 border-blue-500 dark:border-blue-400 animate-spin-slow"></span>
          <a href="profile.php">
            <img src="<?= $userPhoto ?>" alt="Profile" class="relative w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900 cursor-pointer">
          </a>
        </div>
        <a href="?logout=1" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">Logout</a>
      <?php else: ?>
        <a href="login.php">
          <img src="<?= $userPhoto ?>" alt="Login" class="w-10 h-10 rounded-full border object-cover cursor-pointer">
        </a>
      <?php endif; ?>

      <!-- Three-dot menu dropdown -->
      <div class="relative ml-4">
        <div id="dotsMenu" class="three-dots text-gray-800 dark:text-gray-200">
          <span></span><span></span><span></span>
        </div>
        <div id="dotsDropdown" class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 hidden">
          <a href="service.php" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Service</a>
          <a href="users.php" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
          <a href="" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Setting</a>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu Button -->
    <div class="flex md:hidden items-center gap-2">
      <button id="menuBtn" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>
</header>

<!-- Mobile Sidebar -->
<div id="overlay" class="fixed inset-0 bg-black/40 hidden z-40"></div>
<aside id="mobileSidebar" class="fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform translate-x-full transition-transform duration-300 z-50">
  <div class="flex items-center justify-between p-4 border-b dark:border-gray-700">
    <h3 class="text-lg font-semibold">Menu</h3>
    <button id="closeSidebar" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">✖</button>
  </div>
  <nav class="p-4 space-y-3 flex flex-col">
    <a href="index.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='index.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">Home</a>
    <a href="about.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='about.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">About</a>
    <a href="contact.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='contact.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">Contact</a>
    <a href="service.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='service.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">Service</a>
    <a href="users.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='users.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">Dashboard</a>
    <?php if (!$isLoggedIn): ?>
      <a href="login.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='login.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">Login</a>
    <?php else: ?>
      <div class="flex items-center gap-2 px-3 py-2">
        <img src="<?= $userPhoto ?>" class="w-8 h-8 rounded-full border object-cover">
        <a href="?logout=1" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">Logout</a>
      </div>
    <?php endif; ?>
  </nav>
</aside>

<script>
// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const themeEmoji = document.getElementById("themeEmoji");
if(localStorage.getItem("theme")==="dark") {
  document.documentElement.classList.add("dark");
  themeEmoji.textContent = "☀️";
} else { themeEmoji.textContent = "🌙"; }
themeToggle.addEventListener("click", () => {
  const darkMode = document.documentElement.classList.toggle("dark");
  themeEmoji.textContent = darkMode ? "☀️" : "🌙";
  localStorage.setItem("theme", darkMode ? "dark" : "light");
});

// Mobile sidebar toggle
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("mobileSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const overlay = document.getElementById("overlay");
menuBtn.addEventListener("click", () => { sidebar.classList.remove("translate-x-full"); overlay.classList.remove("hidden"); });
closeSidebar.addEventListener("click", () => { sidebar.classList.add("translate-x-full"); overlay.classList.add("hidden"); });
overlay.addEventListener("click", () => { sidebar.classList.add("translate-x-full"); overlay.classList.add("hidden"); });

// Three-dot dropdown toggle
const dotsMenu = document.getElementById("dotsMenu");
const dotsDropdown = document.getElementById("dotsDropdown");
dotsMenu.addEventListener("click", () => {
  dotsDropdown.classList.toggle("hidden");
});
</script>
</body>
</html>
