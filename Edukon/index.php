<?php include 'headerT.php'; ?>

<div class="container mx-auto px-4 py-12 space-y-20">

  <!-- Hero Section -->
  <div class="text-center space-y-4">
    <h1 class="text-5xl font-extrabold text-sky-600 mb-4 animate-bounce hover:text-sky-800 transition duration-500">
      <a href="registration.php" class="hover:underline">Join Your Dream College!</a>
    </h1>
    <p class="text-gray-600 dark:text-gray-300 text-lg md:text-xl max-w-2xl mx-auto animate-fadeIn opacity-90">
      Discover top colleges, register easily, and stay ahead with the latest updates. Your future starts here!
    </p>
    <a href="registration.php" class="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-500">Register Now</a>
  </div>

  <!-- College Carousel -->
  <section class="relative">
    <h2 class="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400 animate-fadeInUp">🌟 Featured Colleges</h2>
    <div class="overflow-hidden relative rounded-3xl shadow-2xl">
      <div id="collegeCarousel" class="flex transition-transform duration-700">
        <!-- Slide 1 -->
        <div class="min-w-full relative group overflow-hidden cursor-pointer">
          <a href="https://delhitechnicalcampus.ac.in/" target="_blank" class="block relative">
            <img src="https://static.vecteezy.com/system/resources/previews/000/388/024/original/illustration-of-university-graduates-vector.jpg" 
                 alt="Delhi Technical Campus" 
                 class="w-full h-80 md:h-96 object-cover transform group-hover:scale-110 transition duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            <p class="absolute bottom-4 left-4 text-white text-2xl md:text-3xl font-extrabold drop-shadow-lg">Delhi Technical Campus</p>
            <span class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">Featured</span>
          </a>
        </div>
        <!-- Slide 2 -->
        <div class="min-w-full relative group overflow-hidden cursor-pointer">
          <a href="https://www.gniotgroup.edu.in/" target="_blank" class="block relative">
            <img src="https://img.freepik.com/premium-photo/college-campus-with-eco-friendly-landscaping-plan-created-with-generative-ai-technology_964851-2336.jpg?w=2000"
                 alt="GNIOT Campus" 
                 class="w-full h-80 md:h-96 object-cover transform group-hover:scale-110 transition duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <p class="absolute bottom-4 left-4 text-white text-2xl md:text-3xl font-extrabold drop-shadow-lg">GNIOT Group of Institutions</p>
            <span class="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">Top Choice</span>
          </a>
        </div>
        <!-- Slide 3 -->
        <div class="min-w-full relative group overflow-hidden cursor-pointer">
          <a href="#" class="block relative">
            <img src="https://cache.careers360.mobi/media/article_images/2022/2/15/featured-image-iit-kharagpur.jpg"
                 alt="Sample College" 
                 class="w-full h-80 md:h-96 object-cover transform group-hover:scale-110 transition duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            <p class="absolute bottom-4 left-4 text-white text-2xl md:text-3xl font-extrabold drop-shadow-lg">Sample College</p>
            <span class="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">New</span>
          </a>
        </div>
      </div>

      <!-- Controls -->
      <button id="prevBtn" class="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/50 text-white px-5 py-2 rounded-full hover:bg-black/80 shadow-lg transition">❮</button>
      <button id="nextBtn" class="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/50 text-white px-5 py-2 rounded-full hover:bg-black/80 shadow-lg transition">❯</button>
    </div>
  </section>

  <!-- About Colleges Section -->
  <section class="space-y-8">
    <h2 class="text-3xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400 animate-fadeInUp">Why Choose These Colleges?</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <article class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl hover:shadow-4xl transform hover:-translate-y-3 transition-all duration-500">
        <h3 class="text-2xl font-bold mb-3 text-sky-600">Delhi Technical Campus</h3>
        <p class="text-gray-700 dark:text-gray-300 text-lg">
          Explore cutting-edge labs, experienced faculty, and a vibrant campus life. DTC ensures excellent placements and growth opportunities for every student.
        </p>
      </article>
      <article class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-2xl hover:shadow-4xl transform hover:-translate-y-3 transition-all duration-500">
        <h3 class="text-2xl font-bold mb-3 text-sky-600">GNIOT Group of Institutions</h3>
        <p class="text-gray-700 dark:text-gray-300 text-lg">
          GNIOT emphasizes academic excellence and industry readiness. With a wide range of courses, students are prepared for the challenges of tomorrow.
        </p>
      </article>
    </div>
  </section>

  <!-- Notice Board -->
  <section>
    <h2 class="text-3xl font-bold mb-6 text-center text-yellow-600 animate-fadeInUp">📢 Notice Board</h2>
    <div class="bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100 p-6 rounded-3xl shadow-lg space-y-3">
      <ul class="list-disc list-inside text-lg">
        <li>Admissions for 2025 are now open. Apply before <strong>31st October</strong>.</li>
        <li>Annual Tech Fest scheduled for <strong>15th November</strong> with exciting events.</li>
        <li>Mid-semester exams begin from <strong>20th November</strong>. Prepare well!</li>
      </ul>
    </div>
  </section>

</div>

<!-- Carousel JS -->
<script>
  const carousel = document.getElementById('collegeCarousel');
  const slides = carousel.children.length;
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let index = 0;

  function showSlide(i) {
    index = (i + slides) % slides;
    carousel.style.transform = `translateX(-${index * 100}%)`;
  }

  prevBtn.addEventListener('click', () => showSlide(index - 1));
  nextBtn.addEventListener('click', () => showSlide(index + 1));

  setInterval(() => showSlide(index + 1), 6000); // auto-slide
</script>

<?php include 'footerT.php'; ?>
