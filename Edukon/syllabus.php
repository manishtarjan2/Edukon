<?php
if (session_status() === PHP_SESSION_NONE) session_start();

// Handle AJAX request to save progress (must be before any output)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['save_progress'])) {
  $data = json_decode(file_get_contents("php://input"), true);
  if ($data) $_SESSION['progress'] = $data;
  // success
  http_response_code(204);
  exit;
}

// Include shared header (contains opening <html>/<head>/<body> and tailwind)
include 'headerT.php';
?>

<main class="min-h-screen px-8 py-10 max-w-[1200px] mx-auto text-page">

  <!-- Top header row -->
  <header class="flex items-center gap-6 mb-8">
    <div class="flex items-center gap-3">
      <!-- logo -->
      <div class="w-10 h-10 rounded-md overflow-hidden">
        <img src="uploads/default.jpeg" alt="logo" class="w-full h-full object-cover">
      </div>
  <div class="text-2xl font-extrabold text-page">EdukonX</div>
    </div>
<!-- 
  <nav class="ml-6 flex gap-4 text-sm muted">
      <a class="hover:text-white" href="#">Courses</a>
      <a class="hover:text-white" href="#">Datesheet</a>
      <a class="hover:text-white" href="#">Change Log</a>
    </nav> -->
      <div class="ml-auto flex items-center gap-3">
      <div class="relative">
        <input id="search" placeholder="Search subject..." class="selector text-sm px-3 py-2 rounded-md w-64 border focus:ring-1 focus:ring-blue-400" />
  <div class="absolute right-2 top-1/2 -translate-y-1/2 muted text-sm">⌘K</div>
      </div>
      <button title="settings" class="w-10 h-10 rounded-md selector flex items-center justify-center">⚙️</button>
    </div>
  </header>

  <!-- Top selection / subjects area -->
  <section class="grid grid-cols-1 lg:grid-cols-3 gap-6">
  <!-- Course & selectors -->
  <div id="courseCard" class="glass-card outline-thin page-card p-6 rounded-2xl">
  <h3 class="text-lg font-semibold text-page mb-2">BTech Courses</h3>
  <p class="text-sm muted mb-4">Who needs sleep when you can engineer dreams?</p>

      <div class="space-y-4">
        <div>
          <label class="text-xs muted block mb-2">Course</label>
          <select id="course" onchange="updateBranches(); updateSubjects();" class="selector w-full px-4 py-3 rounded-lg">
            <option value="B.Tech">B.Tech</option>
            <option value="MBA">MBA</option>
            <option value="MCA">MCA</option>
          </select>
        </div>

        <div>
          <label class="text-xs muted block mb-2">Branch</label>
          <select id="branch" onchange="updateSubjects()" class="selector w-full px-4 py-3 rounded-lg"></select>
        </div>

        <div>
          <label class="text-xs muted block mb-2">Semester</label>
          <select id="semester" onchange="updateSubjects()" class="selector w-full px-4 py-3 rounded-lg">
            <?php for ($i = 1; $i <= 8; $i++): ?>
              <option value="Semester <?= $i ?>">Semester <?= $i ?></option>
            <?php endfor; ?>
          </select>
        </div>
      </div>
    </div>

  <!-- Subjects search / history (big) -->
  <div id="subjectsCard" class="glass-card outline-thin col-span-1 lg:col-span-2 page-card p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold text-page">Subjects</h3>
        <div class="text-sm muted">Choose your subject</div>
      </div>

      <div class="grid grid-cols-1 gap-3">
        <div class="flex items-center gap-3">
          <input id="subjectSearch" placeholder="Search subject..." class="flex-1 px-4 py-3 rounded-lg selector" />
          <button onclick="applySubjectSearch()" class="px-4 py-2 rounded-lg btn-primary font-semibold">→</button>
        </div>

        <div class="pt-3 flex gap-2 flex-wrap">
          <span class="subject-pill px-3 py-2 rounded-lg text-sm">Next Generation Web</span>
          <span class="subject-pill px-3 py-2 rounded-lg text-sm">Big Data Analytics</span>
          <span class="subject-pill px-3 py-2 rounded-lg text-sm">Data Warehousing</span>
          <span class="subject-pill px-3 py-2 rounded-lg text-sm">DBMS</span>
        </div>

        <div>
          <label class="text-xs muted block mb-2">Subject</label>
          <select id="subject" onchange="showSubjectUnits()" class="selector w-full px-4 py-3 rounded-lg">
            <option value="">-- Select Subject --</option>
          </select>
        </div>
      </div>
    </div>
  </section>

  <!-- Main content: left big subject units + right subject details -->
  <section class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
    <!-- Left: Subject Units (large) -->
  <div class="lg:col-span-2 glass-card outline-thin page-card p-6 rounded-2xl">
      <div class="flex items-center justify-between mb-4">
  <h2 id="subjectTitle" class="text-2xl font-bold text-accent">Next Generation Web</h2>
  <div class="text-sm muted">Collapse / expand units</div>
      </div>

      <!-- tabs -->
      <div class="flex gap-2 mb-6">
        <button class="px-4 py-2 rounded-md selector border text-sm font-semibold">Theory</button>
        <button class="px-4 py-2 rounded-md selector border text-sm">Lab</button>
        <button class="px-4 py-2 rounded-md selector border text-sm">Notes</button>
        <button class="px-4 py-2 rounded-md selector border text-sm">PYQs</button>
      </div>

      <div id="unitsContainer" class="space-y-4">
        <!-- units are injected by JS -->
      </div>
    </div>

    <!-- Right: Subject Details -->
  <aside class="glass-card outline-thin page-card p-6 rounded-2xl">
      <h3 class="text-xl font-semibold mb-4">Subject Details</h3>

      <div class="space-y-3">
        <div class="flex justify-between items-center px-3 py-3 card-content rounded-lg border">
          <div class="text-sm muted font-semibold">Theory Code</div>
          <div class="text-sm text-page">CIE-413T</div>
        </div>

        <div class="flex justify-between items-center px-3 py-3 card-content rounded-lg border">
          <div class="text-sm muted font-semibold">Theory Credits</div>
          <div class="text-sm text-page">3</div>
        </div>

        <div class="flex justify-between items-center px-3 py-3 card-content rounded-lg border">
          <div class="text-sm muted font-semibold">Lab Code</div>
          <div class="text-sm text-page">CIE-413P</div>
        </div>

        <div class="flex justify-between items-center px-3 py-3 card-content rounded-lg border">
          <div class="text-sm muted font-semibold">Lab Credits</div>
          <div class="text-sm text-page">1</div>
        </div>
      </div>

      <div class="mt-6">
  <div class="text-xs muted mb-1">Overall</div>
        <div class="w-full card-content rounded-full h-3 border">
          <div id="overallProgress" class="h-3 rounded-full w-0" style="background:var(--accent)"></div>
        </div>
  <div class="mt-2 text-right text-accent font-semibold" id="overallPercent">0%</div>
      </div>
    </aside>
  </section>
</main>

<script>
  // --- Session-saved progress from PHP ---
  const savedProgress = <?php echo json_encode($_SESSION['progress'] ?? []); ?>;

  // --- Branch update ---
  function updateBranches() {
    const course = document.getElementById("course").value;
    const branchElem = document.getElementById("branch");
    branchElem.innerHTML = "";
    let branches = [];

    if (course === "B.Tech") branches = ["CSE", "AIML", "AIDS", "CST", "IT", "ECE", "ME", "CIVIL"];
    else if (course === "MBA") branches = ["HR", "Finance", "Marketing", "Operations"];
    else if (course === "MCA") branches = ["General", "Data Science", "Cyber Security"];

    branches.forEach(b => {
      const opt = document.createElement("option");
      opt.value = b;
      opt.textContent = b;
      branchElem.appendChild(opt);
    });
  }

  // --- Subjects per branch/semester (simplified example) ---
  const courseSubjects = {
    "B.Tech": {
      // CSE subjects: updated to include the 6 requested subjects
      "CSE": [
        "Data Science Using R",
        "Big Data Analytics",
        "Business Intelligence",
        "Next Generation Web",
        "Data Warehousing And Data Mining",
        "Principles Of Entrepreneurship Mindset"
      ],
      "AIML": ["Python Programming", "Machine Learning", "AI Ethics", "Deep Learning", "Data Science"],
      "ECE": ["Electronics", "Digital Circuits", "Microprocessors", "Communication Systems", "Control Systems"]
    },
    "MBA": {
      "HR": ["Organizational Behavior", "Leadership", "HR Analytics"],
      "Finance": ["Accounting", "Investment Analysis", "Corporate Finance"]
    },
    "MCA": {
      "General": ["Java", "DBMS", "Web Technology", "Cloud Computing"],
      "Data Science": ["Python", "Statistics", "AI Foundations"]
    }
  };

  function updateSubjects() {
    const course = document.getElementById("course").value;
    const branch = document.getElementById("branch").value;
    const semester = document.getElementById("semester").value;
    const subject = document.getElementById("subject");
    subject.innerHTML = '<option value="">-- Select Subject --</option>';

    if (courseSubjects[course] && courseSubjects[course][branch]) {
      courseSubjects[course][branch].forEach(s => {
        const opt = document.createElement("option");
        opt.value = s + " - " + semester;
        opt.textContent = s + " (" + semester + ")";
        subject.appendChild(opt);
      });
    }
  }

  // --- Example syllabus data (per subject) ---
  const subjects = {
    "Mathematics": [
      ["Limits & Continuity", "Differentiation", "Integration", "Applications of Derivatives"],
      ["Definite Integrals", "Differential Equations", "Series", "Laplace Transform"],
      ["Vectors", "Matrices", "Determinants", "Eigenvalues"],
      ["Probability", "Statistics", "Binomial Distribution", "Poisson Distribution"]
    ],
    "Data Structures": [
      ["Arrays", "Linked Lists", "Stacks", "Queues"],
      ["Trees", "Binary Search Trees", "Heaps", "Graphs"],
      ["Sorting", "Searching", "Hashing", "Recursion"],
      ["Complexity", "Applications", "Memory Management", "Implementation"]
    ],
    "Operating Systems": [
      ["Basics", "Processes", "Threads", "Deadlocks"],
      ["CPU Scheduling", "Semaphores", "Paging", "Synchronization"],
      ["Memory Management", "Segmentation", "File Systems", "Virtual Memory"],
      ["Security", "Shell Scripting", "Case Studies", "I/O Systems"]
    ],
    "Next Generation Web": [
      ["Modern HTML & CSS", "Responsive Design", "Advanced JS", "Progressive Web Apps"],
      ["Frameworks (React/Vue)", "State Management", "Build Tools", "APIs and Fetch"],
      ["Performance", "Security", "Accessibility", "SEO Basics"],
      ["Deployment", "Edge & Serverless", "Web Workers", "Future Web APIs"]
    ]
    ,
    "Data Science Using R": [
      ["R Basics", "Data Types & Structures", "Data Import/Export", "Data Visualization with ggplot2"],
      ["Data Wrangling with dplyr", "Data Transformation", "Handling Dates & Strings", "Tidy Data"],
      ["Statistical Analysis", "Hypothesis Testing", "Regression Modeling", "ANOVA"],
      ["Time Series", "Machine Learning Basics", "Model Evaluation", "Shiny & Reporting"]
    ],
    "Big Data Analytics": [
      [
        "Introduction to Big Data",
        "Big Data characteristics",
        "Challenges of Conventional System",
        "Types of Big Data",
        "Intelligent data analysis",
        "Traditional vs. Big Data business approach",
        "Case Study of Big Data Solutions"
      ],
      ["Spark Basics", "RDDs & DataFrames", "Spark SQL", "Spark Streaming"],
      ["NoSQL Databases", "Cassandra", "HBase", "MongoDB"],
      ["Data Lakes", "ETL Pipelines", "Scalable ML", "Security & Governance"]
    ],
    "Business Intelligence": [
      ["BI Concepts", "Data Warehousing Intro", "Star & Snowflake Schema", "ETL Fundamentals"],
      ["OLAP & Data Cubes", "Reporting Tools", "Dashboard Design", "KPIs"],
      ["Data Modeling", "Dimensional Modeling", "Data Quality", "Performance Tuning"],
      ["BI Tools (Power BI/Tableau)", "Advanced Visualizations", "Data Storytelling", "Case Studies"]
    ],
    "Data Warehousing And Data Mining": [
      ["Data Warehouse Architecture", "ETL Processes", "Data Integration", "Dimensional Modeling"],
      ["OLAP Operations", "Data Cube", "Star Schema", "ETL Tools"],
      ["Introduction to Data Mining", "Association Rules", "Classification", "Clustering"],
      ["DM Techniques", "Evaluation Metrics", "Big Data Mining", "Applications & Case Studies"]
    ],
    "Principles Of Entrepreneurship Mindset": [
      ["Entrepreneurship Overview", "Idea Generation", "Opportunity Recognition", "Market Research"],
      ["Business Models", "Value Proposition", "Lean Startup", "Customer Development"],
      ["Financing & Funding", "Pitching", "Financial Planning", "Legal & IP"],
      ["Scaling", "Leadership", "Growth Strategies", "Case Studies & Ethics"]
    ]
  };

  // --- Build units UI when subject selected ---
  function showSubjectUnits() {
    const subjectSelect = document.getElementById("subject").value;
    const subject = subjectSelect.split(" - ")[0] || "Next Generation Web";
    const container = document.getElementById("unitsContainer");
    const title = document.getElementById("subjectTitle");

    title.textContent = subject + " - Units";
    container.innerHTML = "";

    const data = subjects[subject] || [];

    if (!data.length) {
      const p = document.createElement("p");
      p.className = "muted text-center py-6";
      p.textContent = "No syllabus data available.";
      container.appendChild(p);
      updateProgress(); // ensure progress 0
      return;
    }

    data.forEach((topics, i) => {
      // unit wrapper (panel)
  const unit = document.createElement("div");
  unit.className = "unit-panel page-card";

      // header
  const header = document.createElement("div");
  header.className = "unit-header";
  header.innerHTML = `<span class="font-semibold">Unit ${i+1}</span><span class="toggle-icon">➕</span>`;

      // content
  const content = document.createElement("div");
  content.className = "unit-content hidden";

      // list of items
  topics.forEach((t, j) => {
    const item = document.createElement('div');
    item.className = 'unit-item';
    const chkId = `u${i}t${j}`;
    item.innerHTML = `<input id="${chkId}" type="checkbox" class="u${i}"> <span>${t}</span>`;
    content.appendChild(item);
  });

      // percent label (right aligned badge)
  const percentLabel = document.createElement("div");
  percentLabel.id = `unitTopPercent${i}`;
  percentLabel.className = "text-sm font-semibold text-accent unit-badge px-2";
  percentLabel.textContent = "0%";

      // toggle behavior
  header.addEventListener("click", () => {
    const icon = header.querySelector('.toggle-icon');
    const isHidden = content.classList.toggle('hidden');
    icon.textContent = isHidden ? '➕' : '➖';
  });

  unit.appendChild(header);
  unit.appendChild(content);
  unit.appendChild(percentLabel);
  container.appendChild(unit);
    });

    // restore checkboxes if saved
    const allCheckboxes = container.querySelectorAll("input[type='checkbox']");
    allCheckboxes.forEach((cb, idx) => {
      if (savedProgress && typeof savedProgress[idx] !== 'undefined') {
        cb.checked = !!savedProgress[idx];
      }
    });

    // listen for change
    container.addEventListener("change", updateProgress);
    updateProgress();
  }

  // --- Save progress to session via AJAX ---
  function saveProgressToSession() {
    const progress = {};
    const inputs = document.querySelectorAll("#unitsContainer input[type='checkbox']");
    inputs.forEach((cb, idx) => progress[idx] = cb.checked);

    navigator.sendBeacon // use sendBeacon when possible for performance
      ? navigator.sendBeacon("?save_progress=1", JSON.stringify(progress))
      : fetch("?save_progress=1", { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(progress) });
  }

  // --- Update progress bars & percentages ---
  function updateProgress() {
    const allCheckboxes = document.querySelectorAll("#unitsContainer input[type='checkbox']");
    const checked = document.querySelectorAll("#unitsContainer input[type='checkbox']:checked");
    const percent = allCheckboxes.length ? (checked.length / allCheckboxes.length) * 100 : 0;

    document.getElementById("overallProgress").style.width = Math.round(percent) + "%";
    document.getElementById("overallPercent").textContent = Math.round(percent) + "%";

    // per-unit progress
    for (let i = 0; i < 8; i++) {
      const unitChecks = document.querySelectorAll(`.u${i}`);
      if (!unitChecks.length) continue;
      const unitChecked = document.querySelectorAll(`.u${i}:checked`);
      const unitPercent = unitChecks.length ? (unitChecked.length / unitChecks.length) * 100 : 0;
      const topBar = document.getElementById(`unitTopProgress${i}`);
      const topText = document.getElementById(`unitTopPercent${i}`);
      if (topBar) topBar.style.width = Math.round(unitPercent) + "%";
      if (topText) topText.textContent = Math.round(unitPercent) + "%";
    }

    saveProgressToSession();
  }

  // --- Search helper (simple) ---
  function applySubjectSearch(){
    const q = document.getElementById('subjectSearch').value.trim().toLowerCase();
    if(!q) return;
    // naive search across courseSubjects
    let found = null;
    Object.keys(courseSubjects).forEach(course => {
      Object.keys(courseSubjects[course]).forEach(branch => {
        courseSubjects[course][branch].forEach(s => {
          if(s.toLowerCase().includes(q)) found = s;
        });
      });
    });
    if(found){
      // set subject select and show
      const opt = Array.from(document.getElementById('subject').options).find(o => o.value.startsWith(found));
      if(opt){ document.getElementById('subject').value = opt.value; showSubjectUnits(); }
      else {
        // add a temporary option
        const sel = document.getElementById('subject');
        const newOpt = document.createElement('option');
        newOpt.value = found + " - Semester 1";
        newOpt.text = found + " (Semester 1)";
        sel.appendChild(newOpt);
        sel.value = newOpt.value;
        showSubjectUnits();
      }
    } else {
      alert('No match found in example data.');
    }
  }

  // init defaults
  updateBranches();
  updateSubjects();
    // Update course/subject card theme based on selected course
    function updateCourseTheme() {
      const course = document.getElementById('course').value;
      const courseCard = document.getElementById('courseCard');
      const subjectsCard = document.getElementById('subjectsCard');

      // mapping course -> gradient/background
      const map = {
        'B.Tech': { light: 'linear-gradient(90deg,#ecfccb,#bbf7d0)', dark: 'linear-gradient(90deg,#064e3b,#065f46)' },
        'MBA': { light: 'linear-gradient(90deg,#ffedd5,#fed7aa)', dark: 'linear-gradient(90deg,#7c2d12,#92400e)' },
        'MCA': { light: 'linear-gradient(90deg,#e0f2fe,#bae6fd)', dark: 'linear-gradient(90deg,#075985,#0369a1)' }
      };

      const theme = map[course] || map['B.Tech'];

      // For strict black/white theme, make cards inherit page background and ensure selectors/pills are neutral
      const pills = document.querySelectorAll('.subject-pill');
      const selectors = document.querySelectorAll('.selector');

      [courseCard, subjectsCard].forEach(el => {
        if (el) { el.style.background = 'transparent'; el.style.color = 'var(--text-color)'; el.style.borderColor = 'var(--border-color)'; }
      });

      pills.forEach(p => { p.style.background = 'transparent'; p.style.borderColor = 'var(--border-color)'; p.style.color = 'var(--text-color)'; });
      selectors.forEach(s => { s.style.background = 'transparent'; s.style.borderColor = 'var(--border-color)'; s.style.color = 'var(--text-color)'; });
    }

    document.getElementById('course').addEventListener('change', () => { updateBranches(); updateSubjects(); updateCourseTheme(); });
  // preload a nice default subject
  setTimeout(()=> {
    // pick first subject if present
    const sel = document.getElementById('subject');
    if(sel.options.length > 1) sel.selectedIndex = 1;
    showSubjectUnits();
    updateCourseTheme();
  }, 80);
</script>

<?php
// Include shared footer (contains closing tags)
include 'footerT.php';
?>
