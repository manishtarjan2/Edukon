<?php
session_start();

$targetDir = __DIR__ . '/uploads';
if (!is_dir($targetDir)) mkdir($targetDir, 0775, true);

if (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
  die('Upload failed.');
}

$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime  = $finfo->file($_FILES['photo']['tmp_name']);
$allowed = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];

if (!isset($allowed[$mime])) {
  die('Only JPG, PNG, WEBP allowed.');
}

$basename = bin2hex(random_bytes(8)) . '.' . $allowed[$mime];
$target   = $targetDir . '/' . $edukond;

if (!move_uploaded_file($_FILES['photo']['tmp_name'], $target)) {
  die('Could not save file.');
}

// Save the public path (adjust if behind a CDN)
$_SESSION['profile_photo'] = 'uploads/' . $edukond;
header('Location: index.php');
