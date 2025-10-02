<?php
session_start();
$adminEmail = "admin@edukon.com";
$adminPassword = "admin123";

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["email"] ?? '';
    $password = $_POST["password"] ?? '';

    if ($email === $adminEmail && $password === $adminPassword) {
        $_SESSION["admin_logged_in"] = true;
        $_SESSION["email"] = $email;
        header("Location: users.php"); // Redirect to dashboard
        exit();
    } else {
        $error = "Invalid admin credentials.";
    }
}
?>

<?php include 'headerT.php'; ?>

<div class="flex justify-center my-10">
<body class="bg-gray-10 flex items-center justify-center min-h-screen">

    <div class="mx-50 bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 class="text-2xl font-bold text-center mb-6">Admin Login</h2>

        <?php if ($error): ?>
            <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
                <?= htmlspecialchars($error) ?>
            </div>
        <?php endif; ?>

        <form action="" method="POST">
            <div class="mb-4">
                <label class="block mb-1 font-semibold">Email</label>
                <input type="email" name="email" required class="w-full border border-gray-300 px-3 py-2 rounded" />
            </div>
            <div class="mb-4">
                <label class="block mb-1 font-semibold">Password</label>
                <input type="password" name="password" required class="w-full border border-gray-300 px-3 py-2 rounded" />
            </div>
            <button type="submit" class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">Login</button>
        </form>
    </div>
</div>

