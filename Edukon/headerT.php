<?php
if (session_status() === PHP_SESSION_NONE) session_start();

// Database connection
$conn = new mysqli("localhost", "root", "", "edukond");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// Check login
$isLoggedIn = isset($_SESSION['email']);
$userPhoto = 'uploads/default.jpeg'; // Default photo

// Get profile photo if logged in
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

/* Slow spin animation */
@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin-slow { animation: spin-slow 6s linear infinite; }

/* Three-dot menu */
.three-dots { width: 24px; height: 24px; display:flex; flex-direction: column; justify-content: center; align-items: center; cursor:pointer; gap:3px;}
.three-dots span { width: 4px; height: 4px; background-color: currentColor; border-radius: 50%; display:block; }

/* Page helper styles used by pages (glass cards, thin outline, toggles) */
.glass-card {
  border: 1px solid rgba(200,200,210,0.06);
  box-shadow: 0 10px 30px rgba(2,6,23,0.35);
  backdrop-filter: blur(6px);
}
.outline-thin { border-radius: 12px; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03); }
.toggle-icon { transition: transform .2s ease; }
.toggle-open .toggle-icon { transform: rotate(45deg); }

/* Theme-aware variables and utility classes for pages */
:root {
  --page-bg: #ffffff;
  --text-color: #000000; /* black */
  --muted-text: rgba(0,0,0,0.65);
  --card-bg: #ffffff;
  --card-content-bg: #ffffff;
  --input-bg: #ffffff;
  --border-color: rgba(0,0,0,0.12);
  --accent: #2563eb; /* blue accent for section top stripe */
}
.dark {
  --page-bg: #000000;
  --text-color: #ffffff; /* white */
  --muted-text: rgba(255,255,255,0.75);
  --card-bg: #000000;
  --card-content-bg: #000000;
  --input-bg: #000000;
  --border-color: rgba(255,255,255,0.12);
  --accent: #2563eb; /* keep accent blue in dark mode */
}

/* Apply variables globally so normal text and backgrounds evolve with the theme */
html, body { background-color: var(--page-bg); color: var(--text-color); }
body { transition: background-color .20s ease, color .20s ease; }

/* Cards, inputs, buttons and common elements using variables */
.page-card, .glass-card { background-color: var(--card-bg); border-color: var(--border-color); }
.card-content { background-color: var(--card-content-bg); }

/* Section / card visual: rounded with a theme-driven top accent stripe */
.page-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(2,6,23,0.06);
}
.page-card::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 8px;
  background: var(--accent);
  opacity: 0.95;
}
.page-card > * { position: relative; z-index: 1; }

/* Slightly lighter/darker top stripe when background is same color as accent */
.dark .page-card::before { opacity: 1; }

/* Unit panel styles (collapsed units and items) */
.unit-panel { border: 1px solid var(--border-color); background: var(--card-bg); border-radius: 12px; overflow: hidden; position: relative; }
.unit-header { display: flex; align-items: center; justify-content: space-between; padding: 0.6rem 1rem; background: var(--card-content-bg); color: var(--text-color); cursor: pointer; }
.unit-header .toggle-icon { font-size: 1rem; }
.unit-content { padding: 0.6rem 1rem; }
.unit-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.7rem 0.9rem; border-radius: 8px; background: var(--card-bg); color: var(--text-color); border: 1px solid var(--border-color); margin-bottom: 0.55rem; }
.unit-item:last-child { margin-bottom: 0; }
.unit-item input[type="checkbox"] { width: 18px; height: 18px; accent-color: var(--accent); }
.unit-panel .unit-top-bg { background: transparent; }
/* Percent badge positioned absolute inside panel */
.unit-badge { position: absolute; right: 12px; top: 10px; background: transparent; color: var(--text-color); }

input, select, textarea { background-color: var(--input-bg); color: var(--text-color); border-color: var(--border-color); }
.btn-primary { background-color: var(--accent); color: var(--page-bg); }
.page-pill { background-color: var(--card-content-bg); border-radius: 8px; padding: .4rem .75rem; }
.unit-top-bg { background-color: var(--card-bg); }
.card-header { background-color: var(--card-bg); }
.unit-badge { background-color: var(--card-content-bg); }

/* Utility helpers to force text color when needed */
.text-page { color: var(--text-color) !important; }
.muted { color: var(--muted-text) !important; }

/* Accent helpers */
.text-accent { color: var(--accent) !important; }
.accent-bg { background: var(--accent); color: white; }

/* Selector (select inputs) style that follows theme */
.selector {
  background-color: var(--input-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  padding: .6rem .75rem;
  border-radius: .5rem;
  transition: background-color .25s ease, color .25s ease, border-color .25s ease;
}
.selector:focus { outline: none; box-shadow: 0 0 0 3px rgba(59,130,246,0.12); }

/* Subject pill used for tags/hot subjects */
.subject-pill { background-color: var(--card-content-bg); color: var(--text-color); border: 1px solid var(--border-color); padding: .35rem .6rem; border-radius: .5rem; }
</style>
</head>
<!-- Body background switches by mode; dark color matches syllabus design -->
<body class="bg-white dark:bg-[#070707] text-gray-900 dark:text-gray-100 transition-colors duration-300 ease-in-out min-h-screen">

<!-- Header -->
<header class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">

    <!-- Logo -->
    <div class="flex items-center gap-3">
      <img src="uploads/default.jpeg" class="h-10 w-10 rounded-md object-cover" alt="Edukon Logo">
      <span class="font-extrabold text-xl text-blue-600 dark:text-blue-400 select-none">Edukon</span>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex items-center gap-6">
      <a href="index.php" class="nav-link <?= $currentPage=='index.php'?'active':'' ?>">Home</a>
      <a href="syllabus.php" class="nav-link <?= $currentPage=='ipuIndex.php'?'active':'' ?>">SyllabusT</a>
      <a href="ipuRankList.php" class="nav-link <?= $currentPage=='contact.php'?'active':'' ?>">RankOn</a>
      <a href="service.php" class="nav-link <?= $currentPage=='service.php'?'active':'' ?>">Service</a>
      <a href="users.php" class="nav-link <?= $currentPage=='users.php'?'active':'' ?>">Dashboard</a>

      <?php if (!$isLoggedIn): ?>
        <a href="login.php" class="nav-link <?= $currentPage=='login.php'?'active':'' ?>">Login</a>
      <?php endif; ?>

      <!-- Theme Toggle -->
      <button id="themeToggle" class="text-xl px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
        <span id="themeEmoji">🌙</span>
      </button>

      <!-- Profile Icon -->
      <?php if ($isLoggedIn): ?>
        <div class="relative w-12 h-12 group cursor-pointer" onclick="window.location.href='profile.php'">
          <!-- Animated gradient ring -->
          <span class="absolute inset-0 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 animate-spin-slow"></span>
          <!-- Profile image -->
          <img src="<?= $userPhoto ?>" alt="Profile" 
               class="relative w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-900 shadow-lg group-hover:scale-105 group-hover:shadow-xl transition duration-300">
          <!-- Glow on hover -->
          <span class="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-30 blur-md transition duration-500"></span>
        </div>
        <a href="?logout=1" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">Logout</a>
      <?php else: ?>
        <a href="login.php">
          <img src="<?= $userPhoto ?>" alt="Login" class="w-10 h-10 rounded-full border object-cover cursor-pointer">
        </a>
      <?php endif; ?>

      <!-- Three-dot menu -->
      <div class="relative ml-4">
        <div id="dotsMenu" class="three-dots text-gray-800 dark:text-gray-200">
          <span></span><span></span><span></span>
        </div>
        <div id="dotsDropdown" class="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 hidden">
          <a href="service.php" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Service</a>
          <a href="users.php" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Dashboard</a>
          <a href="settings.php" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
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
    <a href="ipuIndex.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='ipuIndex.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">SyllabusT</a>
    <a href="contact.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='contact.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">RankOn</a>
    <a href="service.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='service.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">Service</a>
    <a href="users.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='users.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">Dashboard</a>

    <?php if ($isLoggedIn): ?>
      <div class="flex items-center gap-2 px-3 py-2 cursor-pointer" onclick="window.location.href='profile.php'">
        <img src="<?= $userPhoto ?>" class="w-8 h-8 rounded-full border object-cover">
        <span class="text-sm font-medium">Profile</span>
      </div>
      <a href="?logout=1" class="block px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-center transition">Logout</a>
    <?php else: ?>
      <a href="login.php" class="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 <?= $currentPage=='login.php'?'bg-gray-200 dark:bg-gray-700':'' ?>">Login</a>
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

// Three-dot dropdown
const dotsMenu = document.getElementById("dotsMenu");
const dotsDropdown = document.getElementById("dotsDropdown");
dotsMenu.addEventListener("click", () => { dotsDropdown.classList.toggle("hidden"); });
</script>

