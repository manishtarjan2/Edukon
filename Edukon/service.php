<?php
session_start();
include 'headerT.php';
?>

<!-- Services Section -->
<main class="max-w-7xl mx-auto p-6">
  <h1 class="text-3xl font-bold text-center text-blue-600 mb-10">Our Services</h1>

  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Admission Service -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">College Admission</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">We guide you through college admission procedures, eligibility, and important deadlines.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enquire</button>
    </div>

    <!-- Branch Change Service -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">Branch Change</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Help in applying for branch transfer based on merit and availability.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enquire</button>
    </div>

    <!-- Roadmap & Paid Guidance -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">Roadmap & Paid Guidance</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Provide career roadmap and paid expert suggestions for academic improvement.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Book Now</button>
    </div>

    <!-- PG Accommodation -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">PG Accommodation</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Assistance in finding PG facilities near colleges with safe and secure options.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enquire</button>
    </div>

    <!-- Hostel Facilities -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">Hostel Facilities</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Get help to apply for hostels and manage room allocation.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Enquire</button>
    </div>

    <!-- Custom Suggestions -->
    <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow hover:shadow-lg transition">
      <h2 class="text-xl font-bold mb-2">Custom Suggestions</h2>
      <p class="text-gray-700 dark:text-gray-300 mb-4">Personalized academic and career advice with paid consultation.</p>
      <button class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Book Now</button>
    </div>
  </div>
</main>

<?php
include 'footerT.php';
?>
