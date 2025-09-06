<?php

//start session and get page 
session_start();


session_destroy();
header("Location: login.php");
exit();
?>
