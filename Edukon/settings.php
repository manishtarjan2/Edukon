<?php include 'headerT.php'; ?>

<main class="bg-gray-50 min-h-screen p-6">
  <!-- 🔹 Top Navigation -->
  <div class="flex justify-between items-center mb-8">
    <a href="syllabus_dashboard.php" 
       class="px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow transition">
       ← Back to Dashboard
    </a>
    <button onclick="saveChanges()" 
       class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow transition">
       💾 Save / Update Changes
    </button>
  </div>

  <h1 class="text-4xl font-bold mb-6 text-center text-blue-700">⚙️ Syllabus Settings</h1>

  <!-- Course Section -->
  <div class="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">🎓 Courses</h2>
    <div class="flex gap-3 mb-3">
      <input type="text" id="newCourse" class="border rounded px-3 py-2 w-full" placeholder="Enter new course name">
      <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onclick="addCourse()">Add</button>
    </div>
    <ul id="courseList" class="space-y-2 text-gray-700 list-disc pl-6"></ul>
  </div>

  <!-- Branch Section -->
  <div class="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">🌿 Branches</h2>
    <select id="courseForBranch" class="border rounded px-3 py-2 mb-3 w-full" onchange="updateBranchList()"></select>
    <div class="flex gap-3 mb-3">
      <input type="text" id="newBranch" class="border rounded px-3 py-2 w-full" placeholder="Enter new branch name">
      <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onclick="addBranch()">Add</button>
    </div>
    <ul id="branchList" class="space-y-2 text-gray-700 list-disc pl-6"></ul>
  </div>

  <!-- Subject Section -->
  <div class="bg-white rounded-xl shadow p-6 mb-6 border border-gray-200">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">📘 Subjects</h2>
    <select id="courseForSubject" class="border rounded px-3 py-2 mb-3 w-full" onchange="updateSubjectBranchList()"></select>
    <select id="branchForSubject" class="border rounded px-3 py-2 mb-3 w-full" onchange="updateSubjectList()"></select>
    <div class="flex gap-3 mb-3">
      <input type="text" id="newSubject" class="border rounded px-3 py-2 w-full" placeholder="Enter new subject name">
      <button class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600" onclick="addSubject()">Add</button>
    </div>
    <ul id="subjectList" class="space-y-2 text-gray-700 list-disc pl-6"></ul>
  </div>

  <!-- Units Section -->
  <div class="bg-white rounded-xl shadow p-6 border border-gray-200">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">📚 Units</h2>
    <select id="courseForUnit" class="border rounded px-3 py-2 mb-3 w-full" onchange="updateUnitBranchList()"></select>
    <select id="branchForUnit" class="border rounded px-3 py-2 mb-3 w-full" onchange="updateUnitSubjectList()"></select>
    <select id="subjectForUnit" class="border rounded px-3 py-2 mb-3 w-full" onchange="updateUnitList()"></select>
    <div class="flex gap-3 mb-3">
      <input type="text" id="newUnit" class="border rounded px-3 py-2 w-full" placeholder="Enter new unit name">
      <button class="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600" onclick="addUnit()">Add</button>
    </div>
    <ul id="unitList" class="space-y-2 text-gray-700 list-disc pl-6"></ul>
  </div>
</main>

<script>
  // ---- Load from localStorage or default ----
  let syllabus = JSON.parse(localStorage.getItem("syllabusData")) || {
    "B.Tech": { "CSE": ["Mathematics","Data Structures"] },
    "MBA": { "HR": ["Organizational Behavior"] },
    "MCA": { "General": ["Java"] }
  };

  let units = JSON.parse(localStorage.getItem("unitData")) || {
    "Mathematics": ["Limits","Differentiation"],
    "Data Structures": ["Arrays","Linked Lists"],
    "Organizational Behavior": ["Intro","Leadership"],
    "Java": ["Syntax","OOP"]
  };

  // ---- Dropdown Updaters ----
  function updateCourseDropdowns() {
    ["courseForBranch","courseForSubject","courseForUnit"].forEach(id=>{
      const sel=document.getElementById(id);
      sel.innerHTML="";
      Object.keys(syllabus).forEach(c=>{
        const opt=document.createElement("option");
        opt.value=c; opt.textContent=c;
        sel.appendChild(opt);
      });
    });
    updateBranchList();
    updateSubjectBranchList();
    updateUnitBranchList();
  }

  // ---- Courses ----
  function addCourse() {
    const val=document.getElementById("newCourse").value.trim();
    if(!val||syllabus[val]) return alert("Invalid or duplicate course");
    syllabus[val]={};
    document.getElementById("newCourse").value="";
    updateCourseDropdowns(); updateCourseList();
  }
  function updateCourseList() {
    const ul=document.getElementById("courseList"); ul.innerHTML="";
    Object.keys(syllabus).forEach(c=>{
      const li=document.createElement("li");
      li.textContent=c;
      ul.appendChild(li);
    });
  }

  // ---- Branches ----
  function updateBranchList() {
    const course=document.getElementById("courseForBranch").value;
    const ul=document.getElementById("branchList"); ul.innerHTML="";
    Object.keys(syllabus[course]||{}).forEach(b=>{
      const li=document.createElement("li"); li.textContent=b; ul.appendChild(li);
    });
  }
  function addBranch() {
    const course=document.getElementById("courseForBranch").value;
    const branch=document.getElementById("newBranch").value.trim();
    if(!branch) return;
    if(!syllabus[course][branch]) syllabus[course][branch]=[];
    document.getElementById("newBranch").value="";
    updateBranchList(); updateSubjectBranchList(); updateUnitBranchList();
  }

  // ---- Subjects ----
  function updateSubjectBranchList() {
    const course=document.getElementById("courseForSubject").value;
    const branchSel=document.getElementById("branchForSubject");
    branchSel.innerHTML="";
    Object.keys(syllabus[course]||{}).forEach(b=>{
      const opt=document.createElement("option"); opt.value=b; opt.textContent=b; branchSel.appendChild(opt);
    });
    updateSubjectList();
  }
  function updateSubjectList() {
    const course=document.getElementById("courseForSubject").value;
    const branch=document.getElementById("branchForSubject").value;
    const ul=document.getElementById("subjectList"); ul.innerHTML="";
    (syllabus[course][branch]||[]).forEach(s=>{
      const li=document.createElement("li"); li.textContent=s; ul.appendChild(li);
    });
  }
  function addSubject() {
    const course=document.getElementById("courseForSubject").value;
    const branch=document.getElementById("branchForSubject").value;
    const sub=document.getElementById("newSubject").value.trim();
    if(!sub) return;
    if(!syllabus[course][branch].includes(sub)) syllabus[course][branch].push(sub);
    document.getElementById("newSubject").value="";
    updateSubjectList(); updateUnitSubjectList();
  }

  // ---- Units ----
  function updateUnitBranchList() {
    const course=document.getElementById("courseForUnit").value;
    const branchSel=document.getElementById("branchForUnit"); branchSel.innerHTML="";
    Object.keys(syllabus[course]||{}).forEach(b=>{
      const opt=document.createElement("option"); opt.value=b; opt.textContent=b; branchSel.appendChild(opt);
    });
    updateUnitSubjectList();
  }
  function updateUnitSubjectList() {
    const course=document.getElementById("courseForUnit").value;
    const branch=document.getElementById("branchForUnit").value;
    const sel=document.getElementById("subjectForUnit"); sel.innerHTML="";
    (syllabus[course][branch]||[]).forEach(s=>{
      const opt=document.createElement("option"); opt.value=s; opt.textContent=s; sel.appendChild(opt);
    });
    updateUnitList();
  }
  function updateUnitList() {
    const subj=document.getElementById("subjectForUnit").value;
    const ul=document.getElementById("unitList"); ul.innerHTML="";
    (units[subj]||[]).forEach(u=>{
      const li=document.createElement("li"); li.textContent=u; ul.appendChild(li);
    });
  }
  function addUnit() {
    const subj=document.getElementById("subjectForUnit").value;
    const unit=document.getElementById("newUnit").value.trim();
    if(!unit) return;
    if(!units[subj]) units[subj]=[];
    if(!units[subj].includes(unit)) units[subj].push(unit);
    document.getElementById("newUnit").value="";
    updateUnitList();
  }

  // ---- Save to localStorage ----
  function saveChanges() {
    localStorage.setItem("syllabusData", JSON.stringify(syllabus));
    localStorage.setItem("unitData", JSON.stringify(units));
    alert("✅ Changes saved successfully!");
  }

  // ---- Initialize ----
  updateCourseDropdowns();
  updateCourseList();
  updateBranchList();
  updateSubjectBranchList();
  updateSubjectList();
  updateUnitBranchList();
  updateUnitSubjectList();
  updateUnitList();
</script>

<?php include 'footerT.php'; ?>
