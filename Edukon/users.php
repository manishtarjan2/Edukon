<?php include 'headerT.php'; ?>

<?php
// ------------------- Database Connection -------------------
$servername = "localhost";
$username   = "root";
$password   = "";
$dbname     = "edukond";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

// Fetch all users
$sql    = "SELECT * FROM registration ORDER BY id DESC";
$result = $conn->query($sql);
?>

<div class="bg-gray-50 min-h-screen p-6">

  <!-- Top Section -->
  <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
    <h1 class="text-3xl font-bold text-gray-800">User Dashboard</h1>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Search Input -->
      <input type="text" id="searchInput" onkeyup="filterTable()"
             placeholder="Search by name, email, or ID"
             class="border border-gray-300 rounded px-4 py-2 shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500" />

      <!-- PDF Export -->
      <button onclick="downloadPDF()"
              class="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow transition">
        <i class="fas fa-file-pdf"></i> Export PDF
      </button>

      <!-- Logout -->
      <a href="logout.php"
         class="bg-gray-800 hover:bg-black text-white px-4 py-2 rounded shadow transition">
        Logout
      </a>
    </div>
  </div>

  <!-- User Table -->
  <?php if ($result->num_rows > 0): ?>
    <div class="overflow-x-auto rounded-lg shadow-lg">
      <table id="userTable" class="min-w-full bg-white divide-y divide-gray-200">
        
        <!-- Table Head -->
        <thead class="bg-blue-600 text-white">
          <tr>
            <th class="py-3 px-4 text-left">ID</th>
            <th class="py-3 px-4 text-left">Profile</th>
            <th class="py-3 px-4 text-left">User ID</th>
            <th class="py-3 px-4 text-left">Full Name</th>
            <th class="py-3 px-4 text-left">Gender</th>
            <th class="py-3 px-4 text-left">Email</th>
            <th class="py-3 px-4 text-left">Status</th>
            <th class="py-3 px-4 text-center">Action</th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="bg-white divide-y divide-gray-200 text-gray-700">
          <?php while ($row = $result->fetch_assoc()): ?>
            <tr class="hover:bg-gray-100 transition">
              
              <td class="py-3 px-4"><?= htmlspecialchars($row["id"]) ?></td>

              <td class="py-3 px-4">
                <?php $imgPath = !empty($row["photo_path"]) ? "uploads/".htmlspecialchars($row["photo_path"]) : "uploads/default.png"; ?>
                <img src="<?= $imgPath ?>" alt="Profile" class="w-12 h-12 rounded-full object-cover border shadow-sm">
              </td>

              <td class="py-3 px-4 font-medium"><?= htmlspecialchars($row["user_id"]) ?></td>

              <td class="py-3 px-4"><?= htmlspecialchars($row["firstName"] . " " . $row["lastName"]) ?></td>

              <td class="py-3 px-4 capitalize">
                <?php 
                  $gender = $row["gender"];
                  $genderColor = $gender === 'm' ? 'bg-blue-200 text-blue-800' : ($gender === 'f' ? 'bg-pink-200 text-pink-800' : 'bg-purple-200 text-purple-800');
                ?>
                <span class="px-2 py-1 rounded-full text-sm font-semibold <?= $genderColor ?>">
                  <?= $gender === 'm' ? 'Male' : ($gender === 'f' ? 'Female' : 'Other') ?>
                </span>
              </td>

              <td class="py-3 px-4"><?= htmlspecialchars($row["email"]) ?></td>

              <!-- Status Badge -->
              <td class="py-3 px-4">
                <span class="px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium shadow-inner">
                  Active
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-center">
                <a href="edituser.php?id=<?= $row["id"] ?>"
                   class="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow transition">
                  Edit
                </a>
              </td>
            </tr>
          <?php endwhile; ?>
        </tbody>
      </table>
    </div>
  <?php else: ?>
    <p class="text-center text-red-500 text-lg mt-10">No users found.</p>
  <?php endif; ?>

</div>

<?php 
$conn->close(); 
include 'footerT.php'; 
?>

<!-- ================== JavaScript ================== -->
<script>
  // 🔍 Filter Table Rows
  function filterTable() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#userTable tbody tr");

    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(input) ? "" : "none";
    });
  }

  // 📄 Export PDF
  async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');

    doc.text("User Dashboard Export", 14, 10);

    const table = document.getElementById("userTable");
    const headers = [...table.querySelectorAll("thead th")]
      .map(th => th.innerText.trim())
      .filter(h => h !== "Profile" && h !== "Password" && h !== "Action");

    const rows = [...table.querySelectorAll("tbody tr")]
      .filter(tr => tr.style.display !== "none")
      .map(tr => {
        const cells = [...tr.querySelectorAll("td")];
        return [
          cells[0].innerText.trim(),
          cells[2].innerText.trim(),
          cells[3].innerText.trim(),
          cells[4].innerText.trim(),
          cells[5].innerText.trim(),
          cells[6].innerText.trim()
        ];
      });

    doc.autoTable({
      head: [headers],
      body: rows,
      startY: 20,
      theme: 'grid'
    });

    doc.save("user_dashboard.pdf");
  }
</script>

<!-- jsPDF & AutoTable Libraries -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
