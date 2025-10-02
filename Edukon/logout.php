<?php

//start session and get page 
session_start();

// close session means "log out"
session_destroy();
header("Location: login.php"); // direct go after log out in "login page"
exit();
?>