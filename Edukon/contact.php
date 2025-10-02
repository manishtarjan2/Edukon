<?php include 'headerT.php'; ?>

<div class="container mx-auto px-4 py-10 space-y-12">

  <!-- Page Heading -->
  <div class="text-center">
    <h1 class="text-4xl font-extrabold text-sky-600 mb-3">Contact Us</h1>
    <p class="text-gray-600 dark:text-gray-300 text-lg">
      Get in touch with us for inquiries, admissions, or collaborations.
    </p>
  </div>

  <!-- Contact Information -->
  <section class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
      <h3 class="text-xl font-semibold mb-2 text-blue-600">📧 Email</h3>
      <p class="text-gray-700 dark:text-gray-300">
        <a href="mailto:manishtarjan2@gmail.com" class="hover:underline">
          manishtarjan2@gmail.com
        </a>
      </p>
    </div>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
      <h3 class="text-xl font-semibold mb-2 text-blue-600">📞 Phone</h3>
      <p class="text-gray-700 dark:text-gray-300">
        <a href="tel:+9199640374" class="hover:underline">+91 99640374</a>
      </p>
    </div>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-lg transition">
      <h3 class="text-xl font-semibold mb-2 text-blue-600">🏫 Address</h3>
      <p class="text-gray-700 dark:text-gray-300">
        Knowledge Hub, Sector 62, Noida, Uttar Pradesh, India
      </p>
    </div>
  </section>

  <!-- Contact Form -->
  <section>
    <h2 class="text-2xl font-bold mb-6 text-center">Send Us a Message</h2>
    <form action="#" method="POST" class="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow space-y-6">
      <div>
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
        <input type="text" name="name" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white">
      </div>
      <div>
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Your Email</label>
        <input type="email" name="email" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white">
      </div>
      <div>
        <label class="block text-gray-700 dark:text-gray-300 mb-2">Message</label>
        <textarea name="message" rows="5" required class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500 dark:bg-gray-700 dark:text-white"></textarea>
      </div>
      <button type="submit" class="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition">
        Send Message
      </button>
    </form>
  </section>

  <!-- Google Map -->
  <section>
    <h2 class="text-2xl font-bold mb-6 text-center">Find Us</h2>
    <div class="w-full h-80 rounded-lg shadow overflow-hidden">
      <iframe 
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.906606352408!2d77.361641!3d28.629903!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cef4a4ad0e5ed%3A0x7e2e49eab9aab2e3!2sSector%2062%2C%20Noida!5e0!3m2!1sen!2sin!4v1634567890!5m2!1sen!2sin" 
        width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </div>
  </section>

</div>

<?php include 'footerT.php'; ?>
