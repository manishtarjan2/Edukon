<?php include 'headerT.php'; ?>

<div class="max-w-3xl mx-auto p-8  rounded-3xl shadow-2xl mt-10 border-t-8 border-blue-600">

  <h2 class="text-4xl font-extrabold text-center text-blue-700 mb-8 animate-pulse">Registration Form</h2>

  <!-- Step Indicator -->
  <div class="flex justify-between mb-8">
    <div id="indicator1" class="w-1/2 h-2 bg-blue-500 rounded-l-full transition-all duration-500"></div>
    <div id="indicator2" class="w-1/2 h-2 bg-gray-300 rounded-r-full transition-all duration-500"></div>
  </div>

  <form id="regForm" action="conect.php" method="POST" enctype="multipart/form-data" class="space-y-6">
    
    <!-- Step 1: Personal Details -->
    <div id="step1" class="step">
      <h3 class="text-2xl font-semibold text-gray-800 mb-4">Step 1: Personal Details</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="user_id" class="block text-gray-700 font-medium mb-1">User ID</label>
          <input type="text" id="user_id" name="user_id" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Edukon" required>
        </div>

        <div>
          <label for="firstName" class="block text-gray-700 font-medium mb-1">First Name</label>
          <input type="text" id="firstName" name="firstName" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Ram" required>
        </div>

        <div>
          <label for="lastName" class="block text-gray-700 font-medium mb-1">Last Name</label>
          <input type="text" id="lastName" name="lastName" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Shyam" required>
        </div>

        <div>
          <label class="block text-gray-700 font-medium mb-1">Gender</label>
          <div class="flex gap-4 mt-1">
            <label class="inline-flex items-center cursor-pointer">
              <input type="radio" name="gender" value="m" class="form-radio text-blue-500" required>
              <span class="ml-2">Male</span>
            </label>
            <label class="inline-flex items-center cursor-pointer">
              <input type="radio" name="gender" value="f" class="form-radio text-pink-500">
              <span class="ml-2">Female</span>
            </label>
            <label class="inline-flex items-center cursor-pointer">
              <input type="radio" name="gender" value="o" class="form-radio text-purple-500">
              <span class="ml-2">Other</span>
            </label>
          </div>
        </div>

        <div>
          <label for="email" class="block text-gray-700 font-medium mb-1">Email</label>
          <input type="email" id="email" name="email" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="example@email.com" required>
        </div>

        <div>
          <label for="password" class="block text-gray-700 font-medium mb-1">Password</label>
          <input type="password" id="password" name="password" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="Pass@123" required>
        </div>

        <div>
          <label for="phone" class="block text-gray-700 font-medium mb-1">Phone Number</label>
          <input type="text" id="phone" name="phone" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" placeholder="1234567890" required>
        </div>

        <div class="md:col-span-2">
          <label for="photo_path" class="block text-gray-700 font-medium mb-1">Upload Photo</label>
          <input type="file" name="photo_path" id="photo_path" accept="image/jpeg,image/png,image/webp" class="w-full border rounded-lg px-4 py-2" required>
        </div>
      </div>

      <div class="text-right mt-6">
        <button type="button" onclick="nextStep(2)" class="bg-gradient-to-r from-blue-600 to-sky-500 text-white px-6 py-2 rounded-lg shadow hover:shadow-xl hover:from-sky-500 hover:to-blue-600 transition">
          Next ➡️
        </button>
      </div>
    </div>

    <!-- Step 2: Education Details -->
    <div id="step2" class="step hidden">
      <h3 class="text-2xl font-semibold text-gray-800 mb-4">Step 2: Education Details</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="college" class="block text-gray-700 font-medium mb-1">Select College</label>
          <select id="college" name="college" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
            <option value="">-- Choose College --</option>
            <option value="College A">College A</option>
            <option value="College B">College B</option>
            <option value="College C">College C</option>
            <option value="College D">College D</option>
          </select>
        </div>

        <div>
          <label for="course" class="block text-gray-700 font-medium mb-1">Select Course / Branch</label>
          <select id="course" name="course" class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" required>
            <option value="">-- Choose Course/Branch --</option>
            <option value="B.Tech - Computer Science">B.Tech - Computer Science</option>
            <option value="B.Tech - Mechanical">B.Tech - Mechanical</option>
            <option value="B.Com - Finance">B.Com - Finance</option>
            <option value="BBA - Marketing">BBA - Marketing</option>
          </select>
        </div>
      </div>

      <div class="flex justify-between mt-6">
        <button type="button" onclick="prevStep(1)" class="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition">
          ⬅️ Back
        </button>
        <button type="submit" class="bg-gradient-to-r from-green-600 to-emerald-500 text-white px-6 py-2 rounded-lg shadow hover:shadow-xl hover:from-emerald-500 hover:to-green-600 transition">
          ✅ Submit Registration
        </button>
      </div>
    </div>

  </form>
</div>

<script>
  function nextStep(step) {
    document.querySelectorAll(".step").forEach(div => div.classList.add("hidden"));
    document.getElementById("step" + step).classList.remove("hidden");
    updateIndicator(step);
  }

  function prevStep(step) {
    document.querySelectorAll(".step").forEach(div => div.classList.add("hidden"));
    document.getElementById("step" + step).classList.remove("hidden");
    updateIndicator(step);
  }

  function updateIndicator(step){
    document.getElementById("indicator1").className = step >= 1 ? "w-1/2 h-2 bg-blue-500 rounded-l-full transition-all duration-500" : "w-1/2 h-2 bg-gray-300 rounded-l-full transition-all duration-500";
    document.getElementById("indicator2").className = step == 2 ? "w-1/2 h-2 bg-blue-500 rounded-r-full transition-all duration-500" : "w-1/2 h-2 bg-gray-300 rounded-r-full transition-all duration-500";
  }

  document.getElementById("regForm").addEventListener("submit", function(e){
    e.preventDefault();
    alert("✅ Successfully Registered!");
    this.submit();
  });
</script>

<?php include 'footerT.php'; ?>
