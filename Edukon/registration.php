<?php include 'headerT.php'; ?>


   
                    
                    <form action="conect.php" method="POST">


                        <fieldset>
                          <legend>Personal Details:</legend>

                            <div class="form-group">
                            <lable for="user_id">user_id:</lable>
                            <input type="text" class="form-control" id="user_id" name="user_id"  placeholder="Edukon"/>
                            
                        </div>


                        <div class="form-group">
                            <lable for="firstName">First Name:</lable>
                            <input type="text" class="form-control" id="firstName" name="firstName"  placeholder="Ram"/>
                            
                        </div>

                         <div class="form-group">
                            <lable for="lastName">Last Name:</lable>
                            <input type="text" class="form-control" id="firstName" name="lastName"   placeholder="Shyam"/>
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
                            <input type="text" class="form-control" name="email" id="email" value="email"   placeholder="Email"/>
                        </div>

                         <div class="form-group">
                            <lable for="password">Password:</lable>
                            <input type="text" class="form-control" name="password" id="password" value="password"   placeholder="Pass@123"/>
                        </div>

                         <div class="form-group">
                            <lable for="number">Phone Number:</lable>
                            <input type="text" class="form-control" name="phone" id="number"  value="number"   placeholder="000000000"/>
                        </div>

                        <input type="submit" class="btn btn-primary">

</fieldset>

                    </form>
                </div>

              
    </div>
    
<?php include 'footerT.php'; ?>