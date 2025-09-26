<?php
// Save the selected mode to the session
if (isset($_GET['mode'])) {
 echo $_SESSION['mode'] = $_GET['mode'];
} else {
    $_SESSION['mode'] = "defult";
}

// Get the current mode from session or use 'light' as default
$mode = $_SESSION['mode'] ?? 'defult';
?>




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

         <link rel="stylesheet" href="modes/<?php echo htmlspecialchars($mode); ?>.css">
</head>
<!--  -->
<body class="<?php echo $_SESSION['mode'];?>-container">  <!-- all are for mode likr dark blue light -->



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


<!--exp  -->

        <!-- Bar Icon -->
        <div class="menu-bar" onclick="toggleMenu('menu')">☰</div>

        <!-- mode -->
        <!-- Mini Toggle List -->
        <div class="menu" id="menu">
            <a href="#">Home</a>
            <a href="#">Profile</a>
            <a href="#" onclick="toggleMenu('submenu')">Settings</a>
            <a href="logout.php">Logout</a>
        </div>

        <div class="menu" id="submenu">
            <a href="http://localhost/gitproject/Edukon/Edukon/?mode=defult">Defult</a>
            <a href="http://localhost/gitproject/Edukon/Edukon/?mode=dark">Dark</a>
            <a href="http://localhost/gitproject/Edukon/Edukon/?mode=blue">Blue</a>
            <a href="http://localhost/gitproject/Edukon/Edukon/?mode=light">Light</a>
           
        </div>



        <script>
        function toggleMenu(id) {
            
            if(id==='menu'){
                document.getElementById(id).classList.toggle("show");
                document.getElementById('submenu').classList.toggle("hide");
            }
            if(id==='submenu'){
            
                document.getElementById('menu').classList.toggle("hide");
                document.getElementById(id).classList.toggle("show");
                
            }
        }
        </script>



    </header>