<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edukond";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) { die("Connection failed: " . $conn->connect_error); }

$id = $_POST['id'];
$payment_id = $_POST['payment_id'];

// Update user payment status
$stmt = $conn->prepare("UPDATE registration SET payment_status='paid', razorpay_id=? WHERE id=?");
$stmt->bind_param("si", $payment_id, $id);
$stmt->execute();
$stmt->close();
$conn->close();
?>
