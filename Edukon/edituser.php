<?php include 'headerT.php'; ?>

<!-- this page to edit the user detail by the admin -->

<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "edukond";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM registration WHERE id=".$_GET['id'];
$result = $conn->query($sql);

if ($result->num_rows > 0) {
  // output data of each row
  $row = $result->fetch_assoc();
  //print_r($row);
$conn->close();
}
?>

<!-- ================== CSS Styling ================== -->
<style>
  body {
    background: #f3f4f6;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  .container {
    max-width: 700px;
    margin: 40px auto;
  }
  .panel {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    padding: 25px 30px;
  }
  .panel-heading {
    margin-bottom: 20px;
  }
  .panel-heading h1 {
    font-size: 28px;
    font-weight: bold;
    color: #2563eb;
  }
  fieldset {
    border: 2px solid #2563eb;
    border-radius: 8px;
    padding: 20px;
    margin-top: 15px;
  }
  legend {
    font-size: 18px;
    font-weight: bold;
    color: #1f2937;
  }
  .form-group {
    margin-bottom: 15px;
  }
  .form-group lable {
    font-weight: 600;
    color: #374151;
    display: block;
    margin-bottom: 6px;
  }
  .form-control {
    width: 100%;
    padding: 10px 12px;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    transition: border 0.2s, box-shadow 0.2s;
  }
  .form-control:focus {
    border: 1px solid #2563eb;
    box-shadow: 0 0 5px rgba(37,99,235,0.5);
    outline: none;
  }
  .radio-inline {
    margin-right: 15px;
    color: #374151;
    font-weight: 500;
  }
  .btn {
    background: #2563eb;
    border: none;
    padding: 10px 18px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    color: #fff;
    cursor: pointer;
    transition: background 0.3s;
  }
  .btn:hover {
    background: #1d4ed8;
  }
</style>

<div class="container">
  <div class="panel">
    <div class="panel-heading text-center">
      <h1>Registration Form</h1>
    </div>
    <div class="panel-body">
      <form action="conect.php" method="POST">
        <fieldset>
          <legend>Personal Details:</legend>

          <div class="form-group">
            <lable for="firstName">First Name:</lable>
            <input type="text" class="form-control" id="firstName" name="firstName" placeholder="Ram" />
          </div>

          <div class="form-group">
            <lable for="lastName">Last Name:</lable>
            <input type="text" class="form-control" id="firstName" name="lastName" placeholder="Shyam" />
          </div>

          <div class="form-group">
            <lable for="gender">Gender:</lable>
            <div>
              <lable for="male" class="radio-inline"></lable>
              <input type="radio" name="gender" id="male" value="m"> Male

              <lable for="female" class="radio-inline"></lable>
              <input type="radio" name="gender" id="Female" value="f"> Female

              <lable for="other" class="radio-inline"></lable>
              <input type="radio" name="gender" id="other" value="o"> Other
            </div>
          </div>

          <div class="form-group">
            <lable for="email">Email:</lable>
            <input type="text" class="form-control" name="email" id="email" value="email" placeholder="Email" />
          </div>

          <div class="form-group">
            <lable for="password">Password:</lable>
            <input type="text" class="form-control" name="password" id="password" value="password" placeholder="Pass@123" />
          </div>

          <div class="form-group">
            <lable for="number">Phone Number:</lable>
            <input type="text" class="form-control" name="phone" id="number" value="number" placeholder="000000000" />
          </div>

          <input type="submit" class="btn btn-primary" value="Update User">
        </fieldset>
      </form>
    </div>
  </div>
</div>

<?php include 'footerT.php'; ?>
