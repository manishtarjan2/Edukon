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


<div class="cointainer">
    <div class="row col-mid col-midoffset-3">
        <div class="panal panal-primary">
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
                            <input type="text" class="form-control" id="firstName" name="lastName"
                                placeholder="Shyam" />
                        </div>


                        <div class="form-group">
                            <lable for="gender">Gender:</lable>

                            <div>
                                <lable for="male" class="radio-inline"></lable>
                                <input type="radio" name="gender" id="male" value="m">Male:</lable>

                                <lable for="male" class="radio-inline"></lable>
                                <input type="radio" name="gender" id="Female" value="f">Female:</lable>

                                <lable for="male" class="radio-inline"></lable>
                                <input type="radio" name="gender" id="other" value="o">Other:</lable>
                            </div>
                        </div>

                        <div class="form-group">
                            <lable for="email">Email:</lable>
                            <input type="text" class="form-control" name="email" id="email" value="email"
                                placeholder="Email" />
                        </div>

                        <div class="form-group">
                            <lable for="password">Password:</lable>
                            <input type="text" class="form-control" name="password" id="password" value="password"
                                placeholder="Pass@123" />
                        </div>

                        <div class="form-group">
                            <lable for="number">Phone Number:</lable>
                            <input type="text" class="form-control" name="phone" id="number" value="number"
                                placeholder="000000000" />
                        </div>

                        <input type="submit" class="btn btn-primary">

                    </fieldset>

                </form>
            </div>


        </div>



        <?php include 'footerT.php'; ?>