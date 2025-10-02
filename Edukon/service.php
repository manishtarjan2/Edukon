<?php
session_start();

// --- Database connection (optional if needed for bookings) ---
$conn = new mysqli("localhost", "root", "", "edukond");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// --- Check login for profile icon ---
$isLoggedIn = isset($_SESSION['email']);
$userPhoto = 'uploads/default.png';

if ($isLoggedIn) {
    $stmt = $conn->prepare("SELECT photo_path FROM registration WHERE email=?");
    $stmt->bind_param("s", $_SESSION['email']);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($row = $result->fetch_assoc()) {
        $userPhoto = !empty($row['photo_path']) && file_exists("uploads/".$row['photo_path'])
                     ? "uploads/".htmlspecialchars($row['photo_path'])
                     : "uploads/default.png";
    }
    $stmt->close();
}

$currentPage = basename($_SERVER['PHP_SELF']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Edukon - Services</title>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={darkMode:'class'};</script>
</head>
<body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">

<!-- Header -->
<header class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50 shadow-sm">
  <div class="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
    <div class="flex items-center gap-3">
      <img src="https://img.icons8.com/color/48/school.png" class="h-10 w-10" alt="Logo">
      <span class="font-extrabold text-xl text-blue-600 dark:text-blue-400 select-none">Edukon</span>
    </div>

    <nav class="hidden md:flex items-center gap-6">
      <a href="index.php" class="hover:text-blue-600">Home</a>
      <a href="services.php" class="font-bold text-blue-600">Services</a>
      <a href="users.php" class="hover:text-blue-600">Dashboard</a>
      <?php if ($isLoggedIn): ?>
        <div class="flex items-center gap-2 ml-4">
          <a href="#profile"><img src="<?= $userPhoto ?>" alt="Profile" class="w-8 h-8 rounded-full border cursor-pointer"></a>
          <a href="?logout=1" class="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm">Logout</a>
        </div>
      <?php else: ?>
        <a href="login.php" class="ml-4"><img src="<?= $userPhoto ?>" alt="Login" class="w-8 h-8 rounded-full border cursor-pointer"></a>
      <?php endif; ?>
    </nav>

    <div class="flex md:hidden items-center gap-3">
      <button id="themeBtn" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">🌙</button>
      <button id="menuBtn" class="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
        <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>
    </div>
  </div>
</header>

<!-- Services Section -->
<main class="max-w-7xl mx-auto p-6">
  <h1 class="text-3xl font-bold text-center text-blue-600 mb-10">Our Services</h1>

  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Admission Service -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">College Admission</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">We guide you through college admission procedures, eligibility, and important deadlines.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enquire</button>
    </div>

    <!-- Branch Change Service -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">Branch Change</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Help in applying for branch transfer based on merit and availability.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enquire</button>
    </div>

    <!-- Roadmap & Paid Guidance -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">Roadmap & Paid Guidance</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Provide career roadmap and paid expert suggestions for academic improvement.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Book Now</button>
    </div>

    <!-- PG Accommodation -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">PG Accommodation</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Assistance in finding PG facilities near colleges with safe and secure options.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enquire</button>
    </div>

    <!-- Hostel Facilities -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">Hostel Facilities</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Get help to apply for hostels and manage room allocation.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enquire</button>
    </div>

    <!-- Custom Suggestions -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">Custom Suggestions</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Personalized academic and career advice with paid consultation.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Book Now</button>
    </div>
  </div>
</main>

<script>
// Theme toggle
const themeBtn = document.getElementById("themeBtn");
themeBtn.addEventListener("click", () => {
  const dark = !document.documentElement.classList.contains("dark");
  document.documentElement.classList.toggle("dark", dark);
  themeBtn.textContent = dark ? "☀️" : "🌙";
  localStorage.setItem("theme", dark ? "dark" : "light");
});
if(localStorage.getItem("theme")==="dark") document.documentElement.classList.add("dark");

// Mobile menu toggle
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.getElementById("mobileSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const overlay = document.getElementById("overlay");
menuBtn.addEventListener("click", () => { sidebar.classList.remove("translate-x-full"); overlay.classList.remove("hidden"); });
closeSidebar.addEventListener("click", () => { sidebar.classList.add("translate-x-full"); overlay.classList.add("hidden"); });
overlay.addEventListener("click", () => { sidebar.classList.add("translate-x-full"); overlay.classList.add("hidden"); });
</script>

</body>
</html>
