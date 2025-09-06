<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link href="https://unpkg.com/tailwindcss@1.9.6/dist/tailwind.min.css">


    <link rel="stylesheet" type="text/css" href="style.css">
    <link rel="stylesheet" type="text/css"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css">
</head>

<body>



    <header>
        <p class="company">Edukon</p>
        <p2>
            <!-- <<input type="search" placeholder="Search here..."> &puncsp; -->

            <a href="index.php">Home</a> &puncsp;
            <a href="profile.php">Profile </a> &puncsp;
            <a href="login.php"></a> &puncsp;
            <a href="Registration.php">Registration</a> &puncsp;
            <a href="users.php">Dashboard </a> &puncsp;
            <a href="logout.php"></a> &puncsp;
<div style="margin-right:20px;">
<?php
echo @$_SESSION['email'];?>
</div>
        </p2>
<?php /*echo
        <select>
            <option value="light">🌞</option>
            <option value="dark">🌙</option>
            <option value="blue">🔵</option>
        </select>
*/?>
        <!-- Bar Icon -->
        <div class="menu-bar" onclick="toggleMenu()">☰</div>

        <!-- Mini Toggle List -->
        <div class="menu" id="menu">
            <a href="#">Home</a>
            <a href="#">Profile</a>
            <a href="#">Settings</a>
            <a href="logout.php">Logout</a>
        </div>
        <script>
        function toggleMenu() {
            document.getElementById("menu").classList.toggle("show");
        }
        </script>

    </header>