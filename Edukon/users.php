<?php
session_start();
include 'headerT.php';
?>
<?php
// Database Connection
$conn = new mysqli("localhost", "root", "", "edukond");
if ($conn->connect_error) die("Connection failed: " . $conn->connect_error);

$sql    = "SELECT * FROM registration ORDER BY id DESC";
$result = $conn->query($sql);
?>

<div class="min-h-screen p-6 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">

  <!-- Top Section -->
  <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
    <h1 class="text-3xl font-bold">User Dashboard</h1>

    <div class="flex flex-wrap items-center gap-3">
      <!-- Search Input -->
      <input type="text" id="searchInput" onkeyup="filterTable()"
             placeholder="Search by name, email, or ID"
             class="border border-gray-300 dark:border-gray-600 rounded px-4 py-2 shadow-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200" />

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
    <div class="overflow-x-auto rounded-lg shadow-lg border border-gray-300 dark:border-gray-600">
      <table id="userTable" class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        
        <!-- Table Head -->
        <thead class="text-gray-800 dark:text-gray-200 border-b border-gray-300 dark:border-gray-600">
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
        <tbody class="text-gray-700 dark:text-gray-300">
          <?php while ($row = $result->fetch_assoc()): ?>
            <tr class="transition hover:bg-gray-100 dark:hover:bg-gray-800">
              
              <td class="py-3 px-4 border-b border-gray-300 dark:border-gray-600"><?= htmlspecialchars($row["id"]) ?></td>

              <td class="py-3 px-4 border-b border-gray-300 dark:border-gray-600">
                <?php $imgPath = !empty($row["photo_path"]) ? "uploads/".htmlspecialchars($row["photo_path"]) : "uploads/default.jpeg"; ?>
                <img src="<?= $imgPath ?>" alt="Profile" class="w-12 h-12 rounded-full object-cover border shadow-sm">
              </td>

              <td class="py-3 px-4 font-medium border-b border-gray-300 dark:border-gray-600"><?= htmlspecialchars($row["user_id"]) ?></td>

              <td class="py-3 px-4 border-b border-gray-300 dark:border-gray-600"><?= htmlspecialchars($row["firstName"] . " " . $row["lastName"]) ?></td>

              <td class="py-3 px-4 border-b border-gray-300 dark:border-gray-600 capitalize">
                <?php 
                  $gender = $row["gender"];
                  $genderBorder = $gender === 'm' ? 'border-blue-500 text-blue-500 dark:text-blue-400' : ($gender === 'f' ? 'border-pink-500 text-pink-500 dark:text-pink-400' : 'border-purple-500 text-purple-500 dark:text-purple-400');
                ?>
                <span class="px-2 py-1 rounded-full text-sm font-semibold border <?= $genderBorder ?>">
                  <?= $gender === 'm' ? 'Male' : ($gender === 'f' ? 'Female' : 'Other') ?>
                </span>
              </td>

              <td class="py-3 px-4 border-b border-gray-300 dark:border-gray-600"><?= htmlspecialchars($row["email"]) ?></td>

              <!-- Status Badge -->
              <td class="py-3 px-4 border-b border-gray-300 dark:border-gray-600">
                <span class="px-2 py-1 rounded-full text-sm font-medium border border-green-500 text-green-500 dark:text-green-400 dark:border-green-400">
                  Active
                </span>
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-center border-b border-gray-300 dark:border-gray-600">
                <a href="edituser.php?id=<?= $row["id"] ?>"
                   class="inline-block bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white px-4 py-2 rounded shadow transition">
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
  function filterTable() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    document.querySelectorAll("#userTable tbody tr").forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(input) ? "" : "none";
    });
  }

  async function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    doc.text("User Dashboard Export", 14, 10);

    const table = document.getElementById("userTable");
    const headers = [...table.querySelectorAll("thead th")].map(th => th.innerText.trim())
      .filter(h => !["Profile","Password","Action"].includes(h));

    const rows = [...table.querySelectorAll("tbody tr")].filter(tr => tr.style.display !== "none").map(tr => {
      const cells = [...tr.querySelectorAll("td")];
      return [cells[0].innerText, cells[2].innerText, cells[3].innerText, cells[4].innerText, cells[5].innerText, cells[6].innerText];
    });

    doc.autoTable({ head: [headers], body: rows, startY: 20, theme: 'grid' });
    doc.save("user_dashboard.pdf");
  }
</script>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.23/jspdf.plugin.autotable.min.js"></script>
