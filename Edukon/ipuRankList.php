<?php
include 'header.php'; // header
?>

<div class="max-w-6xl mx-auto bg-white p-6 rounded shadow">
  <!-- Search + Filters -->
  <div class="flex flex-wrap gap-3 mb-4">
    <input type="text" id="search" placeholder="Search by name / roll / branch..."
      class="border px-3 py-2 rounded w-72">
    <select id="branchFilter" class="border px-3 py-2 rounded">
      <option value="">All Branches</option>
      <option value="CSE">CSE</option>
      <option value="CE">CE</option>
      <option value="EE">EE</option>
    </select>
  </div>

  <!-- Ranklist Table -->
  <div class="overflow-x-auto">
    <table class="min-w-full border" id="rankTable">
      <thead class="bg-gray-200">
        <tr>
          <th class="px-3 py-2">#</th>
          <th class="px-3 py-2 cursor-pointer" onclick="sortTable(1)">Name</th>
          <th class="px-3 py-2">Roll</th>
          <th class="px-3 py-2">Course</th>
          <th class="px-3 py-2">Branch</th>
          <th class="px-3 py-2">Year</th>
          <th class="px-3 py-2 cursor-pointer" onclick="sortTable(6)">Rank</th>
          <th class="px-3 py-2 cursor-pointer" onclick="sortTable(7)">CGPA</th>
        </tr>
      </thead>
      <tbody>
        <?php $i=1; while($row = $result->fetch_assoc()): ?>
        <tr class="border-t">
          <td class="px-3 py-2"><?= $i++ ?></td>
          <td class="px-3 py-2"><?= $row['name'] ?></td>
          <td class="px-3 py-2"><?= $row['roll'] ?></td>
          <td class="px-3 py-2"><?= $row['course'] ?></td>
          <td class="px-3 py-2"><?= $row['branch'] ?></td>
          <td class="px-3 py-2"><?= $row['year'] ?></td>
          <td class="px-3 py-2"><?= $row['rank'] ?></td>
          <td class="px-3 py-2"><?= $row['cgpa'] ?></td>
        </tr>
        <?php endwhile; ?>
      </tbody>
    </table>
  </div>
</div>

<?php
include 'footer.php'; // footer
?>
