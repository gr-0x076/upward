// UPWARD · PERSONAL EXECUTION DATABASE
// Clean, reliable, unopinionated execution log.
// No AI coach. No recommendations. No fabricated data.
// PLAN → DO → LOG → REVIEW.

(function() {
  'use strict';

  const STORAGE_KEY = 'upward-execution-db-v1';
  const generateId  = window.UpwardEngine.generateId;

  // ─── DATE HELPERS ─────────────────────────────────────────────────────────
  // Always use local date — never toISOString() which converts to UTC.

  function getTodayDateString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function getLocalDateStr(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // ─── DSA TOPICS ───────────────────────────────────────────────────────────

  const defaultDsaTopics = [
    'Arrays', 'Hashing', 'Strings', 'Two Pointers', 'Sliding Window', 'Prefix Sum',
    'Binary Search', 'Sorting', 'Linked Lists', 'Stack', 'Queue', 'Monotonic Stack',
    'Heap / Priority Queue', 'Recursion', 'Backtracking', 'Trees', 'BST', 'Trie',
    'Graphs', 'BFS', 'DFS', 'Topological Sort', 'Shortest Path', 'DSU', 'Greedy',
    'Dynamic Programming', 'Bit Manipulation', 'Intervals', 'Math', 'Other'
  ];

  // ─── IMPLEMENTATION LAB — ALL INITIALLY UNCHECKED ─────────────────────────

  const defaultImplabAlgorithms = [
    // DSA / CS
    { id: 'algo_bs',      domain: 'DSA', name: 'Binary Search',             understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_ms',      domain: 'DSA', name: 'Merge Sort',                understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_qs',      domain: 'DSA', name: 'Quick Sort',                understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_heap',    domain: 'DSA', name: 'Heap / Priority Queue',      understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_bfs',     domain: 'DSA', name: 'Graph BFS',                  understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_dfs',     domain: 'DSA', name: 'Graph DFS',                  understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_dijkstra',domain: 'DSA', name: 'Dijkstra Shortest Path',     understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_dsu',     domain: 'DSA', name: 'Disjoint Set Union (DSU)',    understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_topo',    domain: 'DSA', name: 'Topological Sort',           understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_trie',    domain: 'DSA', name: 'Trie (Prefix Tree)',          understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    // ML
    { id: 'algo_lr',      domain: 'ML',  name: 'Linear Regression',          understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_logr',    domain: 'ML',  name: 'Logistic Regression',        understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_knn',     domain: 'ML',  name: 'k-Nearest Neighbors',        understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_kmeans',  domain: 'ML',  name: 'k-Means Clustering',         understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_nb',      domain: 'ML',  name: 'Naive Bayes',                understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_dt',      domain: 'ML',  name: 'Decision Tree',              understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_rf',      domain: 'ML',  name: 'Random Forest',              understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_svm',     domain: 'ML',  name: 'Support Vector Machine',     understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' },
    { id: 'algo_pca',     domain: 'ML',  name: 'PCA',                        understood: false, implemented: false, tested: false, used: false, explained: false, proofUrl: '', githubUrl: '', notes: '' }
  ];

  // ─── CS FUNDAMENTALS CHECKLIST ────────────────────────────────────────────

  const defaultCsTopics = {
    'DBMS': [
      'Keys (Primary, Candidate, Foreign, Super)',
      'Functional Dependencies',
      'Normalization (1NF, 2NF, 3NF, BCNF)',
      'SQL Joins & Aggregations',
      'Subqueries & Window Functions',
      'Indexing (B-Trees vs Hash Indexes)',
      'ACID Properties & Transaction States',
      'Isolation Levels & Concurrency Anomalies',
      'Locking & Deadlock Handling',
      'Query Plan Optimization'
    ],
    'Operating Systems': [
      'Processes vs Threads & PCB',
      'Context Switching',
      'CPU Scheduling (Round Robin, FCFS, Priority)',
      'Mutex vs Semaphore',
      'Deadlock Conditions & Prevention',
      'Virtual Memory & Paging',
      'TLB & Page Replacement (LRU, FIFO)',
      'File Systems'
    ],
    'Computer Networks': [
      'OSI Model vs TCP/IP Stack',
      'IP Addressing & Subnetting',
      'TCP 3-Way Handshake & Teardown',
      'TCP Flow Control & Congestion Control',
      'UDP vs TCP',
      'DNS Resolution',
      'HTTP/1.1 vs HTTP/2 vs HTTP/3',
      'REST & Sockets'
    ],
    'OOP & Design': [
      'Classes, Objects & Memory Lifecycle',
      'Encapsulation & Data Hiding',
      'Abstraction & Interface Contracts',
      'Inheritance vs Composition',
      'Polymorphism (Compile-time vs Runtime)',
      'SOLID Principles',
      'Design Patterns Basics'
    ],
    'System Design': [
      'Client/Server & Microservices',
      'REST vs GraphQL vs gRPC',
      'SQL vs NoSQL Selection',
      'Caching Strategies & Redis',
      'Load Balancing & Consistent Hashing',
      'Authentication (JWT, OAuth2)',
      'Rate Limiting Algorithms',
      'Message Queues (Kafka, RabbitMQ)',
      'Scalability, Availability & CAP Theorem'
    ]
  };

  // ─── ML CHECKLIST ─────────────────────────────────────────────────────────

  const defaultMlTopics = {
    'Python & Data': [
      'NumPy Vectorization & Broadcasting',
      'Pandas DataFrame Manipulation',
      'Matplotlib & Seaborn Visualization',
      'Data Cleaning & Missing Values',
      'Outlier Detection',
      'Feature Engineering & Encoders',
      'Train / Validation / Test Splits',
      'Data Leakage Prevention'
    ],
    'Statistics & Probability': [
      'Descriptive Statistics (Mean, Variance, Skewness)',
      'Probability Distributions',
      'Correlation vs Covariance',
      'Bayes Theorem',
      'Hypothesis Testing & p-values',
      'Confidence Intervals & CLT'
    ],
    'Supervised Learning': [
      'Linear Regression & Cost Functions',
      'Logistic Regression & Sigmoid',
      'k-Nearest Neighbors',
      'Naive Bayes',
      'Decision Trees & Split Criteria',
      'Random Forest & Bagging',
      'Gradient Boosting (GBDT, XGBoost)',
      'Support Vector Machines & Kernel Trick'
    ],
    'Unsupervised Learning': [
      'k-Means Clustering & Elbow Method',
      'Hierarchical Clustering',
      'Principal Component Analysis (PCA)',
      'Anomaly Detection'
    ],
    'Evaluation & Validation': [
      'Accuracy, Precision, Recall & F1',
      'ROC Curve & AUC',
      'Confusion Matrix',
      'k-Fold Cross Validation',
      'Hyperparameter Tuning',
      'Threshold Selection & Calibration',
      'Class Imbalance (SMOTE, Class Weights)'
    ]
  };

  // ─── DEEP LEARNING CHECKLIST ──────────────────────────────────────────────

  const defaultDlTopics = {
    'Neural Network Fundamentals': [
      'Perceptron & Multi-Layer Perceptrons',
      'Forward Propagation & Computational Graphs',
      'Loss Functions (Cross-Entropy, MSE)',
      'Backpropagation & Chain Rule',
      'Gradient Descent Variants (SGD, Adam, AdamW)',
      'Activation Functions (ReLU, GELU, Sigmoid, Softmax)',
      'Regularization (Dropout, L2, Batch Normalization)'
    ],
    'PyTorch Foundations': [
      'PyTorch Tensors & Autograd',
      'Custom Dataset & DataLoader',
      'Model Definition with nn.Module',
      'Training Loop & Validation Loop',
      'Model Checkpointing & Loading',
      'Learning Rate Schedulers'
    ],
    'Architectures & Transformers': [
      'Convolutional Neural Networks (CNNs)',
      'Recurrent Neural Networks (RNN & LSTM)',
      'Self-Attention & Multi-Head Attention',
      'Transformer Architecture',
      'Transfer Learning & Pre-trained Models',
      'Fine-tuning & Evaluation'
    ]
  };

  // ─── GENAI / RAG CHECKLIST ────────────────────────────────────────────────

  const defaultGenAiTopics = {
    'LLM Fundamentals': [
      'Tokenization & Vocabulary (BPE, WordPiece)',
      'Context Windows & Attention Limits',
      'Prompt Engineering & In-Context Learning',
      'Structured Outputs & JSON Schema',
      'Function / Tool Calling',
      'Temperature, Top-p & Sampling'
    ],
    'Embeddings': [
      'Embedding Models & Vector Representations',
      'Cosine Similarity & Distance Metrics',
      'Semantic Search'
    ],
    'RAG Pipeline': [
      'Document Parsing & Text Ingestion',
      'Chunking Strategies & Chunk Overlap',
      'Vector Databases (Chroma, Qdrant, pgvector)',
      'Similarity Search',
      'Metadata Filtering',
      'BM25 & Hybrid Search',
      'Reranking',
      'Prompt Construction with Context',
      'Citations & Hallucination Mitigation'
    ],
    'RAG Evaluation': [
      'Golden Ground-Truth Dataset Creation',
      'Recall@k & Context Precision',
      'Faithfulness & Answer Relevance',
      'Latency & Cost Profiling'
    ],
    'Frameworks': [
      'LangChain Core Abstractions',
      'LangGraph Stateful Agents'
    ]
  };

  // ─── SOFTWARE ENGINEERING / DEVOPS CHECKLIST ──────────────────────────────

  const defaultEngTopics = {
    'Python': [
      'OOP & Object Lifecycle',
      'Generators, Decorators, Context Managers',
      'Type Hints & mypy',
      'Virtual Environments & Dependency Management',
      'Logging & Exception Handling',
      'Unit & Integration Testing (pytest)',
      'Async / Await'
    ],
    'Git & GitHub': [
      'init, clone, branch, commit, push/pull',
      'Merge vs Rebase',
      'Conflict Resolution',
      'Pull Requests & Code Review',
      'GitHub Actions CI/CD'
    ],
    'Backend & Databases': [
      'HTTP Protocols & Status Codes',
      'RESTful API Design & OpenAPI',
      'FastAPI Async Endpoints & Pydantic',
      'Authentication (JWT, OAuth2)',
      'PostgreSQL Schema Design',
      'SQL Queries, Indexing & ACID',
      'Redis Caching',
      'Background Jobs & Task Queues'
    ],
    'DevOps & Deployment': [
      'Linux CLI & Shell Scripting',
      'Docker Images & Dockerfile',
      'Docker Compose',
      'Environment Variables & Secrets',
      'Cloud Deployment & Container Hosting',
      'Health Checks, Logging & Monitoring'
    ]
  };

  // ─── DEFAULT PROJECTS — NO FABRICATED DATA ────────────────────────────────

  const defaultProjects = [
    {
      id: 'proj_ea',
      name: 'Enterprise AI Assistant',
      description: 'AI assistant project for enterprise knowledge retrieval.',
      status: 'Active',
      techStack: '',
      startDate: '',
      endDate: '',
      githubUrl: '',
      demoUrl: '',
      documentationUrl: '',
      objective: '',
      architecture: '',
      milestones: [],
      experiments: [],
      decisions: [],
      knownProblems: [],
      nextPlannedWork: '',
      learned: '',
      evidence: ''
    },
    {
      id: 'proj_sms',
      name: 'SMS Spam Classifier',
      description: 'Text classification project using classical ML.',
      status: 'Completed',
      techStack: '',
      startDate: '',
      endDate: '',
      githubUrl: '',
      demoUrl: '',
      documentationUrl: '',
      objective: '',
      architecture: '',
      milestones: [],
      experiments: [],
      decisions: [],
      knownProblems: [],
      nextPlannedWork: '',
      learned: '',
      evidence: ''
    },
    {
      id: 'proj_har',
      name: 'HAR Classifier (Human Activity Recognition)',
      description: 'Activity recognition from sensor time-series data.',
      status: 'Completed',
      techStack: '',
      startDate: '',
      endDate: '',
      githubUrl: '',
      demoUrl: '',
      documentationUrl: '',
      objective: '',
      architecture: '',
      milestones: [],
      experiments: [],
      decisions: [],
      knownProblems: [],
      nextPlannedWork: '',
      learned: '',
      evidence: ''
    },
    {
      id: 'proj_mad1',
      name: 'MAD-1 Trekking Management App',
      description: 'Fullstack web application for trek planning and booking.',
      status: 'Completed',
      techStack: '',
      startDate: '',
      endDate: '',
      githubUrl: '',
      demoUrl: '',
      documentationUrl: '',
      objective: '',
      architecture: '',
      milestones: [],
      experiments: [],
      decisions: [],
      knownProblems: [],
      nextPlannedWork: '',
      learned: '',
      evidence: ''
    }
  ];

  // ─── DEFAULT COMMUNICATION PROMPTS (editable, not mandatory) ──────────────

  const defaultCommPrompts = [
    { id: 'cp_1', category: 'Project Defense', title: 'Defend Your Project Architecture', prompt: 'Explain key architectural decisions in your project and the trade-offs you made.' },
    { id: 'cp_2', category: 'GenAI', title: 'Explain RAG Evaluation Metrics', prompt: 'Explain how you measure RAG retrieval recall vs generation faithfulness.' },
    { id: 'cp_3', category: 'DSA', title: 'Explain Binary Search Invariant', prompt: 'Explain why binary search requires checking mid against high in a rotated array.' },
    { id: 'cp_4', category: 'DSA', title: 'BFS vs DFS Trade-offs', prompt: 'Defend when to use BFS vs DFS for graph problems.' },
    { id: 'cp_5', category: 'ML', title: 'Defend Model Selection', prompt: 'Explain why you chose a particular model for a specific dataset.' },
    { id: 'cp_6', category: 'Backend', title: 'Database Indexing Mechanics', prompt: 'Explain why B-Trees are preferred over Hash Indexes for range queries.' },
    { id: 'cp_7', category: 'Behavioral', title: 'Biggest Technical Mistake', prompt: 'Describe a challenging bug or architecture misjudgment and the lesson learned.' }
  ];

  // ─── INITIAL STATE ────────────────────────────────────────────────────────

  const defaultState = {
    schemaVersion: 4,
    events: [],             // Canonical activity log (task completions, manual logs, OSS merges, etc.)
    tasks: [],              // User-created tasks (planned, completed, cancelled)
    dsaLog: [],             // Solved DSA problems — authoritative DSA record
    dsaTopics: defaultDsaTopics,
    implabAlgorithms: defaultImplabAlgorithms,
    csChecklists: defaultCsTopics,
    csChecked: {},          // { 'topic_name': { completed: bool, notes: '', date: '', link: '' } }
    mlChecklists: defaultMlTopics,
    mlChecked: {},
    dlChecklists: defaultDlTopics,
    dlChecked: {},
    genAiChecklists: defaultGenAiTopics,
    genAiChecked: {},
    engChecklists: defaultEngTopics,
    engChecked: {},
    projects: defaultProjects,
    ossLog: [],
    commLog: [],            // Communication sessions — authoritative record
    commPrompts: defaultCommPrompts,
    readingLog: [],         // Reading sessions — authoritative record
    contests: [],           // Contest records — authoritative record
    hackathons: [],
    applications: [],
    collegeItems: [],
    goals: [
      { id: 'g_dsa',  name: 'Solve DSA Problems',            target: 200, unit: 'problems', category: 'DSA',           deadline: '2026-12-31', notes: '' },
      { id: 'g_comm', name: 'Record Speaking Sessions',       target: 100, unit: 'sessions', category: 'Communication', deadline: '2026-12-31', notes: '' },
      { id: 'g_oss',  name: 'Merged OSS Contributions',      target: 5,   unit: 'PRs',      category: 'Open Source',   deadline: '2026-12-31', notes: '' }
    ],
    journalEntries: []
  };

  // ─── STATE LOAD / SAVE ────────────────────────────────────────────────────

  let state = loadState();

  function loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return window.UpwardEngine.migrateState(JSON.parse(stored), defaultState);
      }
    } catch (e) {
      console.error('Error loading state:', e);
    }
    return typeof structuredClone === 'function'
      ? structuredClone(defaultState)
      : JSON.parse(JSON.stringify(defaultState));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state:', e);
      showToast('Error saving to localStorage.');
    }
  }

  // ─── CANONICAL ACTIVITY LOGGER ────────────────────────────────────────────

  function appendEvent(eventData) {
    const evt = {
      id: generateId('evt'),
      timestamp: Date.now(),
      date: eventData.date || getTodayDateString(),
      category: eventData.category || 'Other',
      title: eventData.title || 'Untitled Activity',
      duration: Number(eventData.duration) || 0,
      output: eventData.output || '',
      related: eventData.related || '',
      proofUrl: eventData.proofUrl || '',
      notes: eventData.notes || '',
      taskId: eventData.taskId || null
    };
    state.events.push(evt);
    saveState();
    renderAll();
    showToast(`Logged: "${evt.title}"`);
    return evt;
  }

  function deleteEvent(id) {
    const idx = state.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      state.events.splice(idx, 1);
      saveState();
      renderAll();
      showToast('Activity deleted.');
    }
  }

  function editEventRecord(id, updates) {
    const evt = state.events.find(e => e.id === id);
    if (!evt) return;
    Object.assign(evt, updates);
    saveState();
    renderAll();
    showToast('Activity updated.');
  }

  // ─── DERIVED STATS ────────────────────────────────────────────────────────

  function calculateDerivedStats() {
    return window.UpwardEngine.calculateDerivedStats(state);
  }

  // ─── RENDER PIPELINE ──────────────────────────────────────────────────────

  function renderAll() {
    renderOverview();
    renderToday();
    renderTasks();
    renderDsa();
    renderImplab();
    renderChecklists();
    renderProjects();
    renderOss();
    renderCommunication();
    renderReading();
    renderContests();
    renderCareer();
    renderCollege();
    renderScoreboard();
    renderHistory();
    renderCalendar();
  }

  // ─── 1. OVERVIEW ──────────────────────────────────────────────────────────

  function renderOverview() {
    const stats = calculateDerivedStats();
    document.getElementById('statTasksCount').textContent = stats.totalTasks;
    document.getElementById('statDsaCount').textContent = stats.totalDsa;
    document.getElementById('statDsaIndependent').textContent = `${stats.independentDsa} solved independently`;
    document.getElementById('statEventsCount').textContent = stats.totalActivities;
    document.getElementById('statStreakDays').textContent = `${stats.streak} day${stats.streak === 1 ? '' : 's'}`;

    const today = getTodayDateString();
    const todayPlanned    = state.tasks.filter(t => t.date === today && t.status !== 'Completed');
    const todayDone       = state.tasks.filter(t => (t.completedDate === today || t.date === today) && t.status === 'Completed');
    const todayActivities = state.events.filter(e => e.date === today);

    const overviewTodayEl = document.getElementById('overviewTodayList');
    if (overviewTodayEl) {
      if (!todayPlanned.length && !todayDone.length && !todayActivities.length) {
        overviewTodayEl.innerHTML = '<p class="muted" style="font-size:0.85rem; padding:10px 0;">No tasks or activities logged for today yet.</p>';
      } else {
        let html = '';
        todayPlanned.forEach(t => {
          html += `<div class="checklist-item"><span><strong>[Planned]</strong> ${t.title}</span><span class="status-pill pill-neutral">${t.category}</span></div>`;
        });
        todayDone.forEach(t => {
          html += `<div class="checklist-item checked"><span><strong>[Done]</strong> ${t.title}</span><span class="status-pill pill-green">✓ Task</span></div>`;
        });
        todayActivities.forEach(a => {
          html += `<div class="checklist-item"><span><strong>[Activity]</strong> ${a.title}</span><span class="status-pill pill-blue">${a.category}</span></div>`;
        });
        overviewTodayEl.innerHTML = html;
      }
    }

    const recentEl = document.getElementById('overviewRecentEvents');
    if (recentEl) {
      const allHistory = window.UpwardEngine.buildHistoryItems(state);
      allHistory.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      const combined = allHistory.slice(0, 5);

      if (!combined.length) {
        recentEl.innerHTML = '<p class="muted" style="font-size:0.85rem; padding:10px 0;">No activities recorded yet. Use "+ Log Activity" above.</p>';
      } else {
        recentEl.innerHTML = combined.map(e => `
          <div class="checklist-item">
            <div>
              <strong>${e.title}</strong>
              <small class="muted mono" style="display:block;">${e.date} · ${e.category}${e.duration ? ` · ${e.duration} min` : ''}</small>
            </div>
            ${e.proofUrl ? `<a href="${e.proofUrl}" target="_blank" class="status-pill pill-blue">Proof ↗</a>` : ''}
          </div>
        `).join('');
      }
    }
  }

  // ─── 2. TODAY ─────────────────────────────────────────────────────────────

  function renderToday() {
    const today = getTodayDateString();
    const heading = document.getElementById('todayDateHeading');
    const liveDateLabel = document.getElementById('liveDateLabel');
    const formatted = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    if (heading) heading.textContent = formatted;
    if (liveDateLabel) liveDateLabel.textContent = formatted.toUpperCase();

    const plannedTasks    = state.tasks.filter(t => t.date === today && t.status === 'Planned');
    const completedTasks  = state.tasks.filter(t => (t.completedDate === today || (t.date === today && t.status === 'Completed')));
    const todayActivities = state.events.filter(e => e.date === today);

    document.getElementById('todayPlannedCount').textContent = plannedTasks.length;
    document.getElementById('todayCompletedCount').textContent = completedTasks.length;
    document.getElementById('sideTodayBadge').textContent = plannedTasks.length;

    const plannedEl   = document.getElementById('todayPlannedTasks');
    const completedEl = document.getElementById('todayCompletedTasks');
    const activityEl  = document.getElementById('todayActivityList');

    if (plannedEl) {
      plannedEl.innerHTML = plannedTasks.length ? plannedTasks.map(t => `
        <div class="task-item">
          <div class="task-top">
            <span class="task-title">${t.title}</span>
            <span class="status-pill ${t.priority === 'High' ? 'pill-red' : 'pill-neutral'}">${t.priority}</span>
          </div>
          <div class="task-meta">
            <span>🏷 ${t.category}</span>
            ${t.estimate ? `<span>⏱ ${t.estimate} min</span>` : ''}
            ${t.project ? `<span>📁 ${t.project}</span>` : ''}
          </div>
          <div class="task-actions">
            <button class="btn btn-sm btn-primary" onclick="window.UpwardApp.markTaskComplete('${t.id}')">✓ Mark Completed</button>
            <button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteTask('${t.id}')">Delete</button>
          </div>
        </div>
      `).join('') : '<p class="muted" style="padding:10px 0;">No tasks planned for today. Add a task to queue intentions.</p>';
    }

    if (completedEl) {
      completedEl.innerHTML = completedTasks.length ? completedTasks.map(t => `
        <div class="checklist-item checked">
          <div>
            <span class="item-title">${t.title}</span>
            <small class="muted mono" style="display:block;">${t.category}${t.estimate ? ` · ${t.estimate}m` : ''}</small>
          </div>
          <span class="status-pill pill-green">Completed</span>
        </div>
      `).join('') : '<p class="muted" style="padding:10px 0;">No tasks completed yet today.</p>';
    }

    if (activityEl) {
      activityEl.innerHTML = todayActivities.length ? todayActivities.map(a => `
        <div class="checklist-item">
          <div>
            <strong>${a.title}</strong>
            <small class="muted mono" style="display:block;">${a.category}${a.duration ? ` · ${a.duration} min` : ''}${a.output ? ` · ${a.output}` : ''}</small>
            ${a.notes ? `<small class="muted" style="display:block; margin-top:2px;">${a.notes}</small>` : ''}
          </div>
          ${a.proofUrl ? `<a href="${a.proofUrl}" target="_blank" class="status-pill pill-blue">Proof ↗</a>` : ''}
        </div>
      `).join('') : '<p class="muted" style="padding:10px 0;">No activities logged today. Use "+ Log Activity".</p>';
    }

    // Upcoming deadlines (next 14 days)
    const deadEl = document.getElementById('todayUpcomingDeadlines');
    if (deadEl) {
      const nowMs  = new Date(today).getTime();
      const in14Ms = nowMs + 14 * 24 * 3600 * 1000;
      const deadlines = [];

      state.collegeItems.filter(c => c.status !== 'Completed' && c.deadline).forEach(c => {
        const dMs = new Date(c.deadline).getTime();
        if (dMs >= nowMs && dMs <= in14Ms) deadlines.push({ name: `[College] ${c.course}: ${c.title}`, date: c.deadline, type: c.type });
      });
      state.contests.filter(c => c.date).forEach(c => {
        const dMs = new Date(c.date).getTime();
        if (dMs >= nowMs && dMs <= in14Ms) deadlines.push({ name: `[Contest] ${c.platform} ${c.name}`, date: c.date, type: 'Contest' });
      });
      state.hackathons.filter(h => h.deadline).forEach(h => {
        const dMs = new Date(h.deadline).getTime();
        if (dMs >= nowMs && dMs <= in14Ms) deadlines.push({ name: `[Hackathon] ${h.name}`, date: h.deadline, type: 'Hackathon' });
      });
      state.tasks.filter(t => t.status === 'Planned' && t.date && t.date !== today).forEach(t => {
        const dMs = new Date(t.date).getTime();
        if (dMs > nowMs && dMs <= in14Ms) deadlines.push({ name: `[Task] ${t.title}`, date: t.date, type: t.category });
      });

      deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));

      deadEl.innerHTML = deadlines.length ? deadlines.map(d => `
        <div class="checklist-item">
          <div>
            <strong>${d.name}</strong>
            <small class="muted mono" style="display:block;">${d.date}</small>
          </div>
          <span class="status-pill pill-yellow">${d.type}</span>
        </div>
      `).join('') : '<p class="muted" style="padding:10px 0;">No upcoming deadlines in the next 14 days.</p>';
    }
  }

  // ─── 3. TASKS ─────────────────────────────────────────────────────────────

  let activeTaskFilter   = 'ALL';
  let activeTaskCategory = 'ALL';

  function renderTasks() {
    const listEl = document.getElementById('tasksListContainer');
    const sideTaskBadge = document.getElementById('sideTaskBadge');
    if (!listEl) return;

    const uncompletedCount = state.tasks.filter(t => t.status === 'Planned').length;
    if (sideTaskBadge) sideTaskBadge.textContent = uncompletedCount;

    let filtered = [...state.tasks];
    const today = getTodayDateString();

    if (activeTaskFilter === 'PLANNED')   filtered = filtered.filter(t => t.status === 'Planned');
    if (activeTaskFilter === 'TODAY')     filtered = filtered.filter(t => t.date === today && t.status === 'Planned');
    if (activeTaskFilter === 'COMPLETED') filtered = filtered.filter(t => t.status === 'Completed');
    if (activeTaskCategory !== 'ALL')     filtered = filtered.filter(t => t.category === activeTaskCategory);

    if (!filtered.length) {
      listEl.innerHTML = '<div class="card"><p class="muted" style="text-align:center; padding:16px;">No tasks matching this filter.</p></div>';
      return;
    }

    listEl.innerHTML = filtered.map(t => {
      const isDone = t.status === 'Completed';
      const isCancelled = t.status === 'Cancelled';
      return `
        <div class="task-item ${isDone ? 'completed' : ''}">
          <div class="task-top">
            <span class="task-title" style="${isDone ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${t.title}</span>
            <span class="status-pill ${isDone ? 'pill-green' : isCancelled ? 'pill-red' : t.priority === 'High' ? 'pill-red' : 'pill-neutral'}">
              ${t.status}
            </span>
          </div>
          <div class="task-meta">
            <span>📅 ${t.date || 'No date'}</span>
            <span>🏷 ${t.category}</span>
            <span>⚡ ${t.priority}</span>
            ${t.estimate ? `<span>⏱ ${t.estimate} min</span>` : ''}
            ${t.project ? `<span>📁 ${t.project}</span>` : ''}
            ${t.goal ? `<span>🎯 ${t.goal}</span>` : ''}
          </div>
          ${t.notes ? `<div style="font-size:0.82rem; color:var(--text-muted);">${t.notes}</div>` : ''}
          ${t.proofUrl ? `<div><a href="${t.proofUrl}" target="_blank" class="status-pill pill-blue">Proof Link ↗</a></div>` : ''}
          <div class="task-actions">
            <div>
              ${!isDone ? `<button class="btn btn-sm btn-primary" onclick="window.UpwardApp.markTaskComplete('${t.id}')">✓ Mark Completed</button>` : ''}
              ${!isCancelled && !isDone ? `<button class="btn btn-sm btn-secondary" onclick="window.UpwardApp.setTaskStatus('${t.id}', 'Cancelled')">Cancel</button>` : ''}
            </div>
            <button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteTask('${t.id}')">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  }

  function markTaskComplete(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.status = 'Completed';
    task.completedDate = getTodayDateString();

    const { event } = window.UpwardEngine.completeTaskRecord(task, task.completedDate);
    state.events.push(event);

    saveState();
    renderAll();
    showToast(`Completed: "${task.title}"`);
  }

  function deleteTask(taskId) {
    const idx = state.tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      state.tasks.splice(idx, 1);
      saveState();
      renderAll();
      showToast('Task deleted.');
    }
  }

  function setTaskStatus(taskId, status) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.status = status;
    saveState();
    renderAll();
    showToast(`Task status: ${status}.`);
  }

  // ─── 4. DSA TRACKER ───────────────────────────────────────────────────────

  function renderDsa() {
    const sideBadge = document.getElementById('sideDsaBadge');
    if (sideBadge) sideBadge.textContent = state.dsaLog.length;

    const topicSelect = document.getElementById('dsaTopicFilter');
    if (topicSelect && topicSelect.options.length <= 1) {
      state.dsaTopics.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t; opt.textContent = t;
        topicSelect.appendChild(opt);
      });
    }

    const total       = state.dsaLog.length;
    const independent = state.dsaLog.filter(d => d.independent === 'Yes').length;
    const hard        = state.dsaLog.filter(d => d.difficulty === 'Hard').length;
    const medium      = state.dsaLog.filter(d => d.difficulty === 'Medium').length;
    const easy        = state.dsaLog.filter(d => d.difficulty === 'Easy').length;

    const statsEl = document.getElementById('dsaSummaryStats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="card metric-card">
          <span class="eyebrow">TOTAL SOLVED</span>
          <div class="val">${total}</div>
          <span class="target">${easy} Easy · ${medium} Med · ${hard} Hard</span>
        </div>
        <div class="card metric-card">
          <span class="eyebrow">INDEPENDENT SOLVES</span>
          <div class="val">${independent}</div>
          <span class="target">${total > 0 ? Math.round((independent / total) * 100) : 0}% without hints</span>
        </div>
        <div class="card metric-card">
          <span class="eyebrow">HARD PROBLEMS</span>
          <div class="val">${hard}</div>
          <span class="target">High challenge depth</span>
        </div>
        <div class="card metric-card">
          <span class="eyebrow">TOPICS COVERED</span>
          <div class="val">${new Set(state.dsaLog.map(d => d.topic)).size}</div>
          <span class="target">Distinct patterns</span>
        </div>
      `;
    }

    const tableBody = document.getElementById('dsaTableBody');
    if (!tableBody) return;

    const tFilter = document.getElementById('dsaTopicFilter')?.value || 'ALL';
    const dFilter = document.getElementById('dsaDifficultyFilter')?.value || 'ALL';
    const pFilter = document.getElementById('dsaPlatformFilter')?.value || 'ALL';

    let filtered = [...state.dsaLog].reverse();
    if (tFilter !== 'ALL') filtered = filtered.filter(d => d.topic === tFilter);
    if (dFilter !== 'ALL') filtered = filtered.filter(d => d.difficulty === dFilter);
    if (pFilter !== 'ALL') filtered = filtered.filter(d => d.platform === pFilter);

    if (!filtered.length) {
      tableBody.innerHTML = '<tr><td colspan="9" class="muted" style="text-align:center; padding:18px;">No problems logged yet. Click "+ Log Problem".</td></tr>';
      return;
    }

    tableBody.innerHTML = filtered.map(d => `
      <tr>
        <td class="mono" style="font-size:0.8rem;">${d.date}</td>
        <td>
          <strong>${d.name}</strong>
          ${d.url ? `<br><a href="${d.url}" target="_blank" class="muted" style="font-size:0.75rem;">Problem URL ↗</a>` : ''}
        </td>
        <td><span class="status-pill pill-neutral">${d.platform}</span></td>
        <td><span class="status-pill pill-neutral">${d.topic}</span></td>
        <td><span class="status-pill ${d.difficulty === 'Easy' ? 'pill-green' : d.difficulty === 'Hard' ? 'pill-red' : 'pill-yellow'}">${d.difficulty}</span></td>
        <td><span class="status-pill ${d.independent === 'Yes' ? 'pill-green' : d.independent === 'Partial' ? 'pill-yellow' : 'pill-neutral'}">${d.independent}</span></td>
        <td style="font-size:0.82rem;">${d.notes || '—'}</td>
        <td>${d.proofUrl ? `<a href="${d.proofUrl}" target="_blank" class="status-pill pill-blue">Proof ↗</a>` : '—'}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteDsaProblem('${d.id}')">Delete</button></td>
      </tr>
    `).join('');
  }

  function deleteDsaProblem(problemId) {
    const idx = state.dsaLog.findIndex(p => p.id === problemId);
    if (idx !== -1) {
      state.dsaLog.splice(idx, 1);
      saveState();
      renderAll();
      showToast('Problem deleted.');
    }
  }

  // ─── 5. IMPLEMENTATION LAB ────────────────────────────────────────────────

  let activeImplabDomain = 'ALL';

  function renderImplab() {
    const tableBody = document.getElementById('implabTableBody');
    if (!tableBody) return;

    let items = state.implabAlgorithms || [];
    if (activeImplabDomain !== 'ALL') items = items.filter(a => a.domain === activeImplabDomain);

    tableBody.innerHTML = items.map(a => `
      <tr>
        <td><strong>${a.name}</strong></td>
        <td><span class="status-pill pill-neutral">${a.domain}</span></td>
        <td><input type="checkbox" ${a.understood ? 'checked' : ''} onchange="window.UpwardApp.toggleImplabField('${a.id}', 'understood', this.checked)"></td>
        <td><input type="checkbox" ${a.implemented ? 'checked' : ''} onchange="window.UpwardApp.toggleImplabField('${a.id}', 'implemented', this.checked)"></td>
        <td><input type="checkbox" ${a.tested ? 'checked' : ''} onchange="window.UpwardApp.toggleImplabField('${a.id}', 'tested', this.checked)"></td>
        <td><input type="checkbox" ${a.used ? 'checked' : ''} onchange="window.UpwardApp.toggleImplabField('${a.id}', 'used', this.checked)"></td>
        <td><input type="checkbox" ${a.explained ? 'checked' : ''} onchange="window.UpwardApp.toggleImplabField('${a.id}', 'explained', this.checked)"></td>
        <td>
          ${a.githubUrl ? `<a href="${a.githubUrl}" target="_blank" class="status-pill pill-blue">GitHub ↗</a>` : '—'}
          <button class="btn btn-sm btn-secondary" style="margin-left:4px; padding:2px 6px;" onclick="window.UpwardApp.editImplabUrls('${a.id}')">Edit Link</button>
        </td>
        <td style="font-size:0.82rem;">${a.notes || '—'}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteImplabAlgo('${a.id}')">Delete</button></td>
      </tr>
    `).join('');
  }

  function toggleImplabField(id, field, value) {
    const algo = state.implabAlgorithms.find(a => a.id === id);
    if (!algo) return;
    algo[field] = value;
    if (field === 'implemented' && value) {
      algo.dateCompleted = getTodayDateString();
    }
    saveState();
    renderAll();
  }

  function editImplabUrls(id) {
    const algo = state.implabAlgorithms.find(a => a.id === id);
    if (!algo) return;
    const url = prompt('GitHub / Proof URL for ' + algo.name, algo.githubUrl || algo.proofUrl || '');
    if (url !== null) {
      algo.githubUrl = url;
      algo.proofUrl = url;
      saveState();
      renderAll();
      showToast('Link updated.');
    }
  }

  function deleteImplabAlgo(id) {
    const idx = state.implabAlgorithms.findIndex(a => a.id === id);
    if (idx !== -1) {
      state.implabAlgorithms.splice(idx, 1);
      saveState();
      renderAll();
      showToast('Algorithm removed.');
    }
  }

  // ─── 6. CHECKLISTS ────────────────────────────────────────────────────────

  function renderChecklists() {
    renderCsChecklist();
    renderMlChecklist();
    renderDlChecklist();
    renderGenAiChecklist();
    renderEngChecklist();
  }

  function renderCsChecklist() {
    const grid = document.getElementById('csChecklistsGrid');
    if (!grid) return;

    grid.innerHTML = Object.entries(state.csChecklists).map(([category, topics]) => `
      <div class="card">
        <div class="card-header" style="margin-bottom:8px;">
          <h3>${category}</h3>
          <span class="status-pill pill-neutral">${topics.filter(t => state.csChecked[t]?.completed).length}/${topics.length}</span>
        </div>
        <div class="checklist-grid">
          ${topics.map(t => {
            const data = state.csChecked[t] || {};
            const isDone = !!data.completed;
            return `
              <div class="checklist-item ${isDone ? 'checked' : ''}">
                <label class="checkbox-label" style="font-size:0.85rem;">
                  <input type="checkbox" ${isDone ? 'checked' : ''} onchange="window.UpwardApp.toggleCsTopic('${t.replace(/'/g,"\\'")}', this.checked)">
                  <span class="item-title">${t}</span>
                </label>
                <div style="display:flex; gap:4px; align-items:center;">
                  ${data.link ? `<a href="${data.link}" target="_blank" class="status-pill pill-blue">Link ↗</a>` : ''}
                  <button class="btn btn-sm btn-secondary" style="padding:2px 6px;" onclick="window.UpwardApp.editCsTopicNotes('${t.replace(/'/g,"\\'")}')">📝 Notes</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');
  }

  function toggleCsTopic(topic, completed) {
    if (!state.csChecked[topic]) state.csChecked[topic] = {};
    state.csChecked[topic].completed = completed;
    if (completed) {
      state.csChecked[topic].date = getTodayDateString();
    }
    saveState();
    renderAll();
  }

  function editCsTopicNotes(topic) {
    if (!state.csChecked[topic]) state.csChecked[topic] = {};
    const notes = prompt(`Notes for "${topic}":`, state.csChecked[topic].notes || '');
    if (notes !== null) {
      state.csChecked[topic].notes = notes;
      const link = prompt(`Proof / link for "${topic}":`, state.csChecked[topic].link || '');
      if (link !== null) state.csChecked[topic].link = link;
      saveState();
      renderAll();
      showToast('Notes updated.');
    }
  }

  // Generic 4-stage stepper renderer for ML, DL, GenAI, Engineering
  function renderStageChecklist(containerId, checklists, checkedStore, toggleFnName, editFnName) {
    const grid = document.getElementById(containerId);
    if (!grid) return;

    grid.innerHTML = Object.entries(checklists).map(([category, topics]) => `
      <div class="card">
        <div class="card-header" style="margin-bottom:8px;">
          <h3>${category}</h3>
        </div>
        <div class="checklist-grid">
          ${topics.map(t => {
            const data = checkedStore[t] || {};
            return `
              <div class="checklist-item" style="display:flex; flex-direction:column; align-items:flex-start; gap:6px;">
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                  <strong style="font-size:0.88rem;">${t}</strong>
                  <button class="btn btn-sm btn-secondary" style="padding:2px 6px;" onclick="window.UpwardApp.${editFnName}('${t.replace(/'/g,"\\'")}')">📝 Notes / Link</button>
                </div>
                <div class="stage-stepper">
                  <span class="stage-step ${data.understand ? 'active' : ''}" onclick="window.UpwardApp.${toggleFnName}('${t.replace(/'/g,"\\'")}', 'understand')">1. Understand</span>
                  <span class="stage-step ${data.implement ? 'active' : ''}" onclick="window.UpwardApp.${toggleFnName}('${t.replace(/'/g,"\\'")}', 'implement')">2. Implement</span>
                  <span class="stage-step ${data.use ? 'active' : ''}" onclick="window.UpwardApp.${toggleFnName}('${t.replace(/'/g,"\\'")}', 'use')">3. Use</span>
                  <span class="stage-step ${data.explain ? 'active' : ''}" onclick="window.UpwardApp.${toggleFnName}('${t.replace(/'/g,"\\'")}', 'explain')">4. Explain</span>
                </div>
                ${data.link ? `<div style="font-size:0.75rem;"><a href="${data.link}" target="_blank" class="status-pill pill-blue">Proof ↗</a></div>` : ''}
                ${data.notes ? `<div style="font-size:0.78rem; color:var(--text-muted);">${data.notes}</div>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `).join('');
  }

  function renderMlChecklist()    { renderStageChecklist('mlChecklistsGrid',          state.mlChecklists,    state.mlChecked,    'toggleMlStage',    'editMlTopicNotes'); }
  function renderDlChecklist()    { renderStageChecklist('dlChecklistsGrid',          state.dlChecklists,    state.dlChecked,    'toggleDlStage',    'editDlTopicNotes'); }
  function renderGenAiChecklist() { renderStageChecklist('genAiChecklistsGrid',       state.genAiChecklists, state.genAiChecked, 'toggleGenAiStage', 'editGenAiTopicNotes'); }
  function renderEngChecklist()   { renderStageChecklist('engineeringChecklistsGrid', state.engChecklists,   state.engChecked,   'toggleEngStage',   'editEngTopicNotes'); }

  function toggleGenericStage(store, topic, stage) {
    if (!store[topic]) store[topic] = {};
    store[topic][stage] = !store[topic][stage];
    saveState();
    renderAll();
  }

  function editGenericNotes(store, topic) {
    if (!store[topic]) store[topic] = {};
    const notes = prompt(`Notes for "${topic}":`, store[topic].notes || '');
    if (notes !== null) {
      store[topic].notes = notes;
      const link = prompt(`Proof / GitHub link for "${topic}":`, store[topic].link || '');
      if (link !== null) store[topic].link = link;
      saveState();
      renderAll();
      showToast('Notes & link updated.');
    }
  }

  // ─── 7. PROJECTS ──────────────────────────────────────────────────────────

  function renderProjects() {
    const container = document.getElementById('projectsListContainer');
    if (!container) return;

    container.innerHTML = state.projects.map(p => `
      <div class="card">
        <div class="card-header">
          <div>
            <span class="status-pill ${p.status === 'Active' ? 'pill-green' : p.status === 'Completed' ? 'pill-blue' : 'pill-neutral'}">${p.status}</span>
            <h2 style="margin-top:4px;">${p.name}</h2>
            <p class="muted" style="font-size:0.88rem; margin-top:2px;">${p.description}</p>
          </div>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-sm btn-secondary" onclick="window.UpwardApp.editProject('${p.id}')">Edit Project</button>
            <button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteProject('${p.id}')">Delete</button>
          </div>
        </div>

        <div class="grid-2" style="font-size:0.85rem; margin-top:10px;">
          <div>
            ${p.techStack ? `<strong>Tech Stack:</strong> <span class="mono">${p.techStack}</span><br>` : ''}
            ${p.objective ? `<strong>Objective:</strong> ${p.objective}<br>` : ''}
            ${p.architecture ? `<strong>Architecture:</strong> ${p.architecture}` : ''}
            ${!p.techStack && !p.objective && !p.architecture ? '<span class="muted">No details entered yet.</span>' : ''}
          </div>
          <div>
            <strong>GitHub:</strong> ${p.githubUrl ? `<a href="${p.githubUrl}" target="_blank">${p.githubUrl}</a>` : '—'}<br>
            <strong>Live Demo:</strong> ${p.demoUrl ? `<a href="${p.demoUrl}" target="_blank">${p.demoUrl}</a>` : '—'}<br>
            ${p.startDate ? `<strong>Started:</strong> ${p.startDate}` : ''}
          </div>
        </div>

        ${p.milestones && p.milestones.length ? `
          <div style="margin-top:14px; border-top:1px solid var(--border); padding-top:12px;">
            <h4>Milestones</h4>
            <div class="checklist-grid" style="margin-top:8px;">
              ${p.milestones.map((m, mIdx) => `
                <label class="checkbox-label" style="font-size:0.85rem;">
                  <input type="checkbox" ${m.done ? 'checked' : ''} onchange="window.UpwardApp.toggleProjectMilestone('${p.id}', ${mIdx}, this.checked)">
                  <span style="${m.done ? 'text-decoration:line-through; color:var(--text-muted);' : ''}">${m.name}</span>
                </label>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <div style="margin-top:12px; display:flex; gap:8px;">
          <button class="btn btn-sm btn-secondary" onclick="window.UpwardApp.addProjectMilestone('${p.id}')">+ Add Milestone</button>
          <button class="btn btn-sm btn-primary" onclick="window.UpwardApp.logProjectActivity('${p.name}')">+ Log Work Session</button>
        </div>
      </div>
    `).join('');
  }

  function editProject(projId) {
    const proj = state.projects.find(p => p.id === projId);
    if (!proj) return;
    openModal('project', {
      _editId: projId,
      name: proj.name,
      description: proj.description || '',
      status: proj.status,
      techStack: proj.techStack || '',
      startDate: proj.startDate || '',
      objective: proj.objective || '',
      architecture: proj.architecture || '',
      githubUrl: proj.githubUrl || '',
      demoUrl: proj.demoUrl || ''
    });
  }

  function toggleProjectMilestone(projId, milestoneIdx, done) {
    const proj = state.projects.find(p => p.id === projId);
    if (!proj || !proj.milestones[milestoneIdx]) return;
    proj.milestones[milestoneIdx].done = done;
    if (done) {
      appendEvent({
        category: 'Projects',
        title: `${proj.name}: Milestone "${proj.milestones[milestoneIdx].name}"`,
        related: proj.name,
        proofUrl: proj.githubUrl || ''
      });
    } else {
      saveState();
      renderAll();
    }
  }

  function addProjectMilestone(projId) {
    const proj = state.projects.find(p => p.id === projId);
    if (!proj) return;
    const name = prompt('Milestone title:');
    if (name) {
      if (!proj.milestones) proj.milestones = [];
      proj.milestones.push({ name, done: false });
      saveState();
      renderAll();
      showToast('Milestone added.');
    }
  }

  function logProjectActivity(projectName) {
    const title = prompt(`What did you work on for ${projectName}?`);
    if (title) {
      const duration = prompt('Duration in minutes:', '45');
      appendEvent({
        category: 'Projects',
        title: `${projectName}: ${title}`,
        duration: Number(duration) || 0,
        related: projectName
      });
    }
  }

  function deleteProject(projId) {
    const idx = state.projects.findIndex(p => p.id === projId);
    if (idx !== -1) {
      state.projects.splice(idx, 1);
      saveState();
      renderAll();
      showToast('Project deleted.');
    }
  }

  // ─── 8. OPEN SOURCE ───────────────────────────────────────────────────────

  function renderOss() {
    const statsGrid = document.getElementById('ossStatsGrid');
    const tableBody = document.getElementById('ossTableBody');
    if (!statsGrid || !tableBody) return;

    const merged = state.ossLog.filter(o => o.status === 'Merged').length;
    const open   = state.ossLog.filter(o => o.status === 'Open').length;
    const repos  = new Set(state.ossLog.map(o => o.repo)).size;

    statsGrid.innerHTML = `
      <div class="card metric-card"><span class="eyebrow">PRS MERGED</span><div class="val">${merged}</div><span class="target">Accepted contributions</span></div>
      <div class="card metric-card"><span class="eyebrow">PRS OPEN</span><div class="val">${open}</div><span class="target">In review</span></div>
      <div class="card metric-card"><span class="eyebrow">REPOSITORIES</span><div class="val">${repos}</div><span class="target">Distinct codebases</span></div>
    `;

    if (!state.ossLog.length) {
      tableBody.innerHTML = '<tr><td colspan="8" class="muted" style="text-align:center; padding:18px;">No open source contributions logged yet.</td></tr>';
      return;
    }

    tableBody.innerHTML = state.ossLog.map(o => `
      <tr>
        <td class="mono" style="font-size:0.8rem;">${o.date}</td>
        <td><strong>${o.repo}</strong></td>
        <td><span class="status-pill pill-neutral">${o.type}</span></td>
        <td>${o.description}</td>
        <td><span class="status-pill ${o.status === 'Merged' ? 'pill-green' : o.status === 'Closed' ? 'pill-red' : 'pill-yellow'}">${o.status}</span></td>
        <td>${o.prUrl ? `<a href="${o.prUrl}" target="_blank" class="status-pill pill-blue">PR ↗</a>` : '—'}</td>
        <td style="font-size:0.82rem;">${o.learnings || '—'}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteOssItem('${o.id}')">Delete</button></td>
      </tr>
    `).join('');
  }

  function deleteOssItem(id) {
    const idx = state.ossLog.findIndex(o => o.id === id);
    if (idx !== -1) { state.ossLog.splice(idx, 1); saveState(); renderAll(); showToast('OSS record deleted.'); }
  }

  // ─── 9. COMMUNICATION ─────────────────────────────────────────────────────

  function renderCommunication() {
    const statsGrid = document.getElementById('commStatsGrid');
    const tableBody = document.getElementById('commTableBody');
    if (!statsGrid || !tableBody) return;

    const totalSessions = state.commLog.length;
    const totalMinutes  = state.commLog.reduce((s, c) => s + (Number(c.duration) || 0), 0);
    const avgRating     = totalSessions > 0 ? (state.commLog.reduce((s, c) => s + (Number(c.rating) || 0), 0) / totalSessions).toFixed(1) : '—';

    statsGrid.innerHTML = `
      <div class="card metric-card"><span class="eyebrow">SESSIONS RECORDED</span><div class="val">${totalSessions}</div><span class="target">Speaking sessions</span></div>
      <div class="card metric-card"><span class="eyebrow">TOTAL TIME</span><div class="val">${totalMinutes} min</div><span class="target">Speaking volume</span></div>
      <div class="card metric-card"><span class="eyebrow">AVG SELF-RATING</span><div class="val">${avgRating} / 5</div><span class="target">Clarity & structure</span></div>
    `;

    if (!state.commLog.length) {
      tableBody.innerHTML = '<tr><td colspan="8" class="muted" style="text-align:center; padding:18px;">No sessions logged yet. Click "+ Log Session".</td></tr>';
      return;
    }

    tableBody.innerHTML = [...state.commLog].reverse().map(c => `
      <tr>
        <td class="mono" style="font-size:0.8rem;">${c.date}</td>
        <td><strong>${c.topic}</strong></td>
        <td><span class="status-pill pill-neutral">${c.category}</span></td>
        <td>${c.duration}</td>
        <td>⭐ ${c.rating || '—'}/5</td>
        <td>${c.link ? `<a href="${c.link}" target="_blank" class="status-pill pill-blue">Recording ↗</a>` : '—'}</td>
        <td style="font-size:0.82rem;">${c.notes || '—'}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteCommItem('${c.id}')">Delete</button></td>
      </tr>
    `).join('');
  }

  function deleteCommItem(id) {
    const idx = state.commLog.findIndex(c => c.id === id);
    if (idx !== -1) { state.commLog.splice(idx, 1); saveState(); renderAll(); showToast('Session deleted.'); }
  }

  // ─── 10. READING ──────────────────────────────────────────────────────────

  function renderReading() {
    const tableBody = document.getElementById('readingTableBody');
    if (!tableBody) return;

    if (!state.readingLog.length) {
      tableBody.innerHTML = '<tr><td colspan="8" class="muted" style="text-align:center; padding:18px;">No reading sessions logged yet.</td></tr>';
      return;
    }

    tableBody.innerHTML = [...state.readingLog].reverse().map(r => `
      <tr>
        <td class="mono" style="font-size:0.8rem;">${r.date}</td>
        <td><strong>${r.title}</strong></td>
        <td><span class="status-pill pill-neutral">${r.category}</span></td>
        <td>${r.pagesOrMins}</td>
        <td><span class="status-pill ${r.status === 'Completed' ? 'pill-green' : 'pill-yellow'}">${r.status}</span></td>
        <td style="font-size:0.82rem;">${r.notes || '—'}</td>
        <td>${r.link ? `<a href="${r.link}" target="_blank" class="status-pill pill-blue">Link ↗</a>` : '—'}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteReadingItem('${r.id}')">Delete</button></td>
      </tr>
    `).join('');
  }

  function deleteReadingItem(id) {
    const idx = state.readingLog.findIndex(r => r.id === id);
    if (idx !== -1) { state.readingLog.splice(idx, 1); saveState(); renderAll(); showToast('Reading log deleted.'); }
  }

  // ─── 11. CONTESTS & HACKATHONS ────────────────────────────────────────────

  function renderContests() {
    const contestBody   = document.getElementById('contestTableBody');
    const hackathonBody = document.getElementById('hackathonTableBody');

    if (contestBody) {
      contestBody.innerHTML = state.contests.length ? state.contests.map(c => `
        <tr>
          <td class="mono" style="font-size:0.8rem;">${c.date}</td>
          <td><strong>${c.platform}</strong><br><small class="muted">${c.name}</small></td>
          <td>${c.solved} / ${c.attempted}</td>
          <td><span class="status-pill pill-green">${c.result || '—'}</span></td>
          <td style="font-size:0.82rem;">${c.notes || '—'}</td>
          <td><button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteContestItem('${c.id}')">Delete</button></td>
        </tr>
      `).join('') : '<tr><td colspan="6" class="muted" style="text-align:center; padding:14px;">No contests logged yet.</td></tr>';
    }

    if (hackathonBody) {
      hackathonBody.innerHTML = state.hackathons.length ? state.hackathons.map(h => `
        <tr>
          <td><strong>${h.name}</strong></td>
          <td><span class="status-pill ${h.status === 'Submitted' ? 'pill-green' : 'pill-yellow'}">${h.status}</span></td>
          <td class="mono">${h.deadline}</td>
          <td style="font-size:0.82rem;">${h.idea}<br><small class="mono muted">${h.techStack}</small></td>
          <td>${h.submissionUrl ? `<a href="${h.submissionUrl}" target="_blank" class="status-pill pill-blue">Submission ↗</a>` : '—'}</td>
          <td><button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteHackathonItem('${h.id}')">Delete</button></td>
        </tr>
      `).join('') : '<tr><td colspan="6" class="muted" style="text-align:center; padding:14px;">No hackathons logged yet.</td></tr>';
    }
  }

  function deleteContestItem(id) {
    const idx = state.contests.findIndex(c => c.id === id);
    if (idx !== -1) { state.contests.splice(idx, 1); saveState(); renderAll(); showToast('Contest deleted.'); }
  }

  function deleteHackathonItem(id) {
    const idx = state.hackathons.findIndex(h => h.id === id);
    if (idx !== -1) { state.hackathons.splice(idx, 1); saveState(); renderAll(); showToast('Hackathon deleted.'); }
  }

  // ─── 12. CAREER ───────────────────────────────────────────────────────────

  function renderCareer() {
    const statsGrid = document.getElementById('careerStatsGrid');
    const tableBody = document.getElementById('careerTableBody');
    if (!statsGrid || !tableBody) return;

    const total     = state.applications.length;
    const oa        = state.applications.filter(a => a.stage === 'OA').length;
    const interview = state.applications.filter(a => a.stage === 'Technical' || a.stage === 'HR').length;
    const offers    = state.applications.filter(a => a.stage === 'Offer').length;

    statsGrid.innerHTML = `
      <div class="card metric-card"><span class="eyebrow">APPLICATIONS</span><div class="val">${total}</div><span class="target">Submitted</span></div>
      <div class="card metric-card"><span class="eyebrow">ONLINE ASSESSMENTS</span><div class="val">${oa}</div><span class="target">OAs received</span></div>
      <div class="card metric-card"><span class="eyebrow">INTERVIEWS</span><div class="val">${interview}</div><span class="target">Technical rounds</span></div>
      <div class="card metric-card"><span class="eyebrow">OFFERS</span><div class="val" style="color:var(--brand);">${offers}</div><span class="target">Offers</span></div>
    `;

    if (!state.applications.length) {
      tableBody.innerHTML = '<tr><td colspan="7" class="muted" style="text-align:center; padding:18px;">No applications logged yet.</td></tr>';
      return;
    }

    tableBody.innerHTML = state.applications.map(a => `
      <tr>
        <td><strong>${a.company}</strong><br><small class="muted">${a.role}</small></td>
        <td class="mono" style="font-size:0.8rem;">${a.dateApplied}</td>
        <td><span class="status-pill ${a.stage === 'Offer' ? 'pill-green' : a.stage === 'Rejected' ? 'pill-red' : 'pill-yellow'}">${a.stage}</span></td>
        <td>${a.resumeVer || '—'}</td>
        <td>${a.referral || '—'}</td>
        <td style="font-size:0.82rem;">${a.notes || '—'}</td>
        <td><button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteApplicationItem('${a.id}')">Delete</button></td>
      </tr>
    `).join('');
  }

  function deleteApplicationItem(id) {
    const idx = state.applications.findIndex(a => a.id === id);
    if (idx !== -1) { state.applications.splice(idx, 1); saveState(); renderAll(); showToast('Application deleted.'); }
  }

  // ─── 13. COLLEGE ──────────────────────────────────────────────────────────

  function renderCollege() {
    const tableBody = document.getElementById('collegeTableBody');
    if (!tableBody) return;

    if (!state.collegeItems.length) {
      tableBody.innerHTML = '<tr><td colspan="7" class="muted" style="text-align:center; padding:18px;">No college items logged yet. Click "+ Add Academic Item".</td></tr>';
      return;
    }

    tableBody.innerHTML = state.collegeItems.map(c => `
      <tr>
        <td><strong>${c.course}</strong></td>
        <td><span class="status-pill pill-neutral">${c.type}</span></td>
        <td><strong>${c.title}</strong><br><small class="muted">${c.description || ''}</small></td>
        <td class="mono" style="font-size:0.8rem;">${c.deadline || '—'}</td>
        <td>
          <span class="status-pill ${c.status === 'Completed' ? 'pill-green' : 'pill-yellow'}">${c.status}</span>
        </td>
        <td style="font-size:0.82rem;">
          ${c.notes || ''}
          ${c.link ? `<br><a href="${c.link}" target="_blank" class="status-pill pill-blue" style="margin-top:2px;">Link ↗</a>` : ''}
        </td>
        <td>
          ${c.status !== 'Completed' ? `<button class="btn btn-sm btn-primary" style="margin-bottom:2px;" onclick="window.UpwardApp.markCollegeComplete('${c.id}')">✓ Done</button>` : ''}
          <button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteCollegeItem('${c.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  function markCollegeComplete(id) {
    const item = state.collegeItems.find(c => c.id === id);
    if (!item) return;
    item.status = 'Completed';
    saveState();
    renderAll();
    showToast(`Completed: "${item.title}"`);
  }

  function deleteCollegeItem(id) {
    const idx = state.collegeItems.findIndex(c => c.id === id);
    if (idx !== -1) { state.collegeItems.splice(idx, 1); saveState(); renderAll(); showToast('College item deleted.'); }
  }

  // ─── 14. GOALS & SCOREBOARD ───────────────────────────────────────────────

  function renderScoreboard() {
    const goalsGrid   = document.getElementById('goalsCardsGrid');
    const numbersGrid = document.getElementById('scoreboardNumbersGrid');

    if (goalsGrid) {
      goalsGrid.innerHTML = state.goals.map(g => {
        let current = 0;
        if (g.category === 'DSA')           current = state.dsaLog.length;
        else if (g.category === 'Communication') current = state.commLog.length;
        else if (g.category === 'Open Source')   current = state.ossLog.filter(o => o.status === 'Merged').length;
        else current = state.events.filter(e => e.category === g.category).length;

        const pct = g.target > 0 ? Math.min(100, Math.round((current / g.target) * 100)) : 0;
        return `
          <div class="card metric-card">
            <div class="card-header" style="margin-bottom:4px;">
              <span class="eyebrow">${g.category}</span>
              ${g.deadline ? `<span class="mono muted" style="font-size:0.75rem;">Due ${g.deadline}</span>` : ''}
            </div>
            <h4>${g.name}</h4>
            <div class="val" style="margin-top:6px;">${current} <span class="target">/ ${g.target} ${g.unit}</span></div>
            <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">${pct}% of target</div>
            ${g.notes ? `<div style="font-size:0.78rem; color:var(--text-dim); margin-top:4px;">${g.notes}</div>` : ''}
          </div>
        `;
      }).join('');
    }

    if (numbersGrid) {
      const dsaTotal     = state.dsaLog.length;
      const dsaInd       = state.dsaLog.filter(d => d.independent === 'Yes').length;
      const dsaHard      = state.dsaLog.filter(d => d.difficulty === 'Hard').length;
      const dsaAlgoDone  = state.implabAlgorithms.filter(a => a.domain === 'DSA' && a.implemented).length;
      const mlAlgoDone   = state.implabAlgorithms.filter(a => a.domain === 'ML' && a.implemented).length;
      const csTopicsDone = Object.values(state.csChecked).filter(v => v.completed).length;
      const commSessions = state.commLog.length;
      const commMins     = state.commLog.reduce((s, c) => s + (Number(c.duration) || 0), 0);
      const ossMerged    = state.ossLog.filter(o => o.status === 'Merged').length;
      const apps         = state.applications.length;
      const contests     = state.contests.length;
      const readingCount = state.readingLog.length;
      const collegeDone  = state.collegeItems.filter(c => c.status === 'Completed').length;

      const numbers = [
        { label: 'DSA Problems Solved',     val: dsaTotal,     desc: 'Problems in log' },
        { label: 'Independent Solves',       val: dsaInd,       desc: 'Solved without hints' },
        { label: 'Hard Problems',            val: dsaHard,      desc: 'Hard difficulty' },
        { label: 'DSA Algos Implemented',    val: dsaAlgoDone,  desc: 'Scratch CS implementations' },
        { label: 'ML Algos Implemented',     val: mlAlgoDone,   desc: 'Scratch ML implementations' },
        { label: 'CS Topics Checked',        val: csTopicsDone, desc: 'Interview topics done' },
        { label: 'Speaking Sessions',        val: commSessions, desc: `${commMins} total minutes` },
        { label: 'OSS PRs Merged',           val: ossMerged,    desc: 'Accepted contributions' },
        { label: 'Job Applications',         val: apps,         desc: 'Submitted' },
        { label: 'Contests Participated',    val: contests,     desc: 'Competitive events' },
        { label: 'Reading Sessions',         val: readingCount, desc: 'Sessions logged' },
        { label: 'College Work Completed',   val: collegeDone,  desc: 'Academic items done' }
      ];

      numbersGrid.innerHTML = numbers.map(n => `
        <div class="card metric-card">
          <span class="eyebrow">${n.label}</span>
          <div class="val">${n.val}</div>
          <span class="target">${n.desc}</span>
        </div>
      `).join('');
    }
  }

  // ─── 15. HISTORY ──────────────────────────────────────────────────────────

  let activeHistoryTime     = 'ALL';
  let activeHistoryCategory = 'ALL';
  let activeHistoryQuery    = '';

  function renderHistory() {
    const tableBody = document.getElementById('historyTableBody');
    if (!tableBody) return;

    const todayStr = getTodayDateString();
    const now      = new Date();
    
    // Aggregation from engine.js
    const aggregatedItems = window.UpwardEngine.buildHistoryItems(state);
    
    // Filter and sort using engine logic
    let allItems = window.UpwardEngine.filterHistoryItems(
      aggregatedItems, activeHistoryTime, activeHistoryCategory, activeHistoryQuery, todayStr, now
    );

    if (!allItems.length) {
      tableBody.innerHTML = '<tr><td colspan="7" class="muted" style="text-align:center; padding:20px;">No records match the current filter.</td></tr>';
      return;
    }

    tableBody.innerHTML = allItems.map(item => `
      <tr>
        <td class="mono" style="font-size:0.8rem;">${item.date || '—'}</td>
        <td><span class="status-pill pill-neutral">${item.category}</span></td>
        <td>
          <strong>${item.title}</strong>
          ${item.isTaskEvent ? ' <span class="status-pill pill-green" style="font-size:0.7rem; padding:1px 5px;">✓ Task</span>' : ''}
        </td>
        <td>${item.duration ? `${item.duration}m` : '—'}</td>
        <td>${item.proofUrl ? `<a href="${item.proofUrl}" target="_blank" class="status-pill pill-blue">Proof ↗</a>` : '—'}</td>
        <td style="font-size:0.82rem; max-width:200px; word-break:break-word;">${item.notes || '—'}</td>
        <td style="white-space:nowrap;">
          ${item.source === 'event' ? `<button class="btn btn-sm btn-secondary" style="margin-bottom:2px;" onclick="window.UpwardApp.openEditEvent('${item.id}')">Edit</button>` : ''}
          <button class="btn btn-sm btn-outline-danger" onclick="window.UpwardApp.deleteHistoryItem('${item.id}', '${item.source}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  function deleteHistoryItem(id, source) {
    const sourceMap = {
      event:    { arr: state.events,        label: 'Activity' },
      dsa:      { arr: state.dsaLog,        label: 'DSA problem' },
      comm:     { arr: state.commLog,       label: 'Speaking session' },
      reading:  { arr: state.readingLog,    label: 'Reading entry' },
      contest:  { arr: state.contests,      label: 'Contest record' },
      hackathon:{ arr: state.hackathons,    label: 'Hackathon entry' },
      journal:  { arr: state.journalEntries,label: 'Journal entry' },
      college:  { arr: state.collegeItems,  label: 'College item' }
    };
    const target = sourceMap[source];
    if (!target) return;
    const idx = target.arr.findIndex(x => x.id === id);
    if (idx !== -1) {
      target.arr.splice(idx, 1);
      saveState();
      renderAll();
      showToast(`${target.label} deleted.`);
    }
  }

  function openEditEvent(id) {
    const evt = state.events.find(e => e.id === id);
    if (!evt) return;
    openModal('editEvent', {
      _editId: id,
      title: evt.title,
      date: evt.date,
      category: evt.category,
      duration: evt.duration || '',
      output: evt.output || '',
      related: evt.related || '',
      proofUrl: evt.proofUrl || '',
      notes: evt.notes || ''
    });
  }

  // ─── 16. CALENDAR ─────────────────────────────────────────────────────────

  let calendarMonth = new Date().getMonth();
  let calendarYear  = new Date().getFullYear();

  function renderCalendar() {
    const label = document.getElementById('calCurrentMonthLabel');
    const grid  = document.getElementById('calendarGridContainer');
    if (!grid || !label) return;

    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    label.textContent = `${monthNames[calendarMonth]} ${calendarYear}`;

    const firstDayIndex   = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth     = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(calendarYear, calendarMonth, 0).getDate();
    const todayStr        = getTodayDateString();

    const allHistory = window.UpwardEngine.buildHistoryItems(state);

    let html = '';
    ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(dh => {
      html += `<div class="cal-day-header">${dh}</div>`;
    });

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      html += `<div class="cal-day-cell other-month"><span class="cal-day-num">${daysInPrevMonth - i}</span></div>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dStr    = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isToday = dStr === todayStr;

      const dayItems = allHistory.filter(i => i.date === dStr);
      const totalCount = dayItems.length;

      let dotsHtml = '';
      const hasDsa = dayItems.some(i => i.category === 'DSA');
      const hasTask = dayItems.some(i => i.isTaskEvent);
      const hasJournal = dayItems.some(i => i.category === 'Journal');
      const hasOther = dayItems.some(i => i.category !== 'DSA' && !i.isTaskEvent && i.category !== 'Journal');

      if (hasOther)   dotsHtml += `<span class="cal-dot" title="Activities" style="background:#2563eb;"></span>`;
      if (hasDsa)     dotsHtml += `<span class="cal-dot" title="DSA solves" style="background:#16a34a;"></span>`;
      if (hasTask)    dotsHtml += `<span class="cal-dot" title="Tasks done" style="background:#d97706;"></span>`;
      if (hasJournal) dotsHtml += `<span class="cal-dot" title="Journal" style="background:#9333ea;"></span>`;

      html += `
        <div class="cal-day-cell ${isToday ? 'today' : ''}" onclick="window.UpwardApp.openDayDetails('${dStr}')">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="cal-day-num">${d}</span>
            ${totalCount > 0 ? `<small class="mono muted" style="font-size:0.7rem;">${totalCount}</small>` : ''}
          </div>
          <div class="cal-day-events">${dotsHtml}</div>
        </div>
      `;
    }

    grid.innerHTML = html;
  }

  function openDayDetails(dateStr) {
    const modal   = document.getElementById('dayDetailsModal');
    const title   = document.getElementById('dayModalDateTitle');
    const content = document.getElementById('dayModalContent');
    if (!modal || !title || !content) return;

    title.textContent = `Activities on ${dateStr}`;

    const dayItems = window.UpwardEngine.buildHistoryItems(state).filter(i => i.date === dateStr);
    const planned  = state.tasks.filter(t => t.date === dateStr && t.status === 'Planned');

    if (!dayItems.length && !planned.length) {
      content.innerHTML = '<p class="muted">No work recorded or planned on this date.</p>';
    } else {
      let html = '';

      const journals = dayItems.filter(i => i.category === 'Journal');
      if (journals.length) {
        html += '<h4>Journal</h4>';
        journals.forEach(j => {
          html += `<div class="checklist-item" style="display:block;">
            <div>${j.notes || 'Journal entry'}</div>
          </div>`;
        });
      }

      const completedTasks = dayItems.filter(i => i.isTaskEvent);
      if (completedTasks.length) {
        html += '<h4 style="margin-top:10px;">Completed Tasks</h4>';
        completedTasks.forEach(t => {
          html += `<div class="checklist-item checked"><span>${t.title}</span><span class="status-pill pill-green">${t.category}</span></div>`;
        });
      }

      if (planned.length) {
        html += '<h4 style="margin-top:10px;">Planned Tasks</h4>';
        planned.forEach(t => {
          html += `<div class="checklist-item"><span>${t.title}</span><span class="status-pill pill-neutral">${t.category}</span></div>`;
        });
      }

      const dsaSolves = dayItems.filter(i => i.category === 'DSA');
      if (dsaSolves.length) {
        html += '<h4 style="margin-top:10px;">DSA Problems</h4>';
        dsaSolves.forEach(d => {
          html += `<div class="checklist-item"><span><strong>${d.title}</strong></span><span class="status-pill pill-green">DSA</span></div>`;
        });
      }

      const others = dayItems.filter(i => i.category !== 'Journal' && i.category !== 'DSA' && !i.isTaskEvent);
      if (others.length) {
        html += '<h4 style="margin-top:10px;">Other Activities</h4>';
        others.forEach(o => {
          html += `<div class="checklist-item"><span><strong>[${o.category}]</strong> ${o.title} ${o.duration ? `(${o.duration}m)` : ''}</span><span class="status-pill pill-blue">${o.category}</span></div>`;
        });
      }

      content.innerHTML = html;
    }
    modal.showModal();
  }

  // ─── MODAL SCHEMAS ────────────────────────────────────────────────────────

  const TASK_CATEGORIES = ['DSA','ML','AI / GenAI','Backend / Software Engineering','CS Fundamentals','Open Source','Projects','Communication','Reading','Career','Hackathon','Contest','College','Personal','Other'];

  const modalSchemas = {
    task: {
      title: 'Create Task',
      fields: [
        ['title',    'Task Title',                   'text',   null, true],
        ['date',     'Date',                         'date',   null, false, getTodayDateString()],
        ['category', 'Category',                     'select', TASK_CATEGORIES],
        ['priority', 'Priority',                     'select', ['Medium','High','Low']],
        ['estimate', 'Estimated Duration (Minutes)', 'number', null, false, '30'],
        ['project',  'Related Project (Optional)',   'text'],
        ['goal',     'Related Goal (Optional)',       'text'],
        ['proofUrl', 'Proof Link (Optional)',         'url'],
        ['notes',    'Notes (Optional)',              'textarea']
      ]
    },
    dsa: {
      title: 'Log Solved DSA Problem',
      fields: [
        ['name',        'Problem Name',            'text',   null,              true],
        ['platform',    'Platform',                'select', ['LeetCode','Codeforces','CodeChef','Other']],
        ['url',         'Problem URL (Optional)',  'url'],
        ['topic',       'Topic / Pattern',         'select', defaultDsaTopics],
        ['difficulty',  'Difficulty',              'select', ['Medium','Easy','Hard']],
        ['date',        'Solved Date',             'date',   null,              false, getTodayDateString()],
        ['independent', 'Solved Independently?',   'select', ['Yes','No (Used Editorial / Hint)','Partial']],
        ['notes',       'Notes / Insight',         'textarea'],
        ['proofUrl',    'Solution URL (Optional)', 'url']
      ]
    },
    activity: {
      title: 'Log Activity',
      fields: [
        ['title',    'What I worked on',          'text',   null,            true],
        ['date',     'Date',                      'date',   null,            false, getTodayDateString()],
        ['category', 'Category',                  'select', TASK_CATEGORIES],
        ['duration', 'Duration (Minutes)',         'number', null,            false, '45'],
        ['output',   'Output / Result',           'text'],
        ['related',  'Related Project / Topic',   'text'],
        ['proofUrl', 'Proof Link (Optional)',      'url'],
        ['notes',    'Notes',                     'textarea']
      ]
    },
    editEvent: {
      title: 'Edit Activity Record',
      fields: [
        ['title',    'What I worked on',        'text',   null,            true],
        ['date',     'Date',                    'date',   null,            false],
        ['category', 'Category',                'select', TASK_CATEGORIES],
        ['duration', 'Duration (Minutes)',       'number'],
        ['output',   'Output / Result',         'text'],
        ['related',  'Related Project / Topic', 'text'],
        ['proofUrl', 'Proof Link (Optional)',    'url'],
        ['notes',    'Notes',                   'textarea']
      ]
    },
    journal: {
      title: 'Daily Journal Entry',
      fields: [
        ['date',    'Date',                               'date',     null, false, getTodayDateString()],
        ['well',    'What went well?',                    'textarea'],
        ['badly',   'What went badly / distracted you?',  'textarea'],
        ['learned', 'What did you learn?',                'textarea'],
        ['notes',   'Free-form Notes',                    'textarea']
      ]
    },
    addAlgo: {
      title: 'Add Algorithm to Implementation Lab',
      fields: [
        ['name',      'Algorithm Name',          'text',   null, true],
        ['domain',    'Domain',                  'select', ['DSA','ML']],
        ['githubUrl', 'GitHub / Code URL',       'url'],
        ['notes',     'Notes (Optional)',         'textarea']
      ]
    },
    addCsTopic:    { title: 'Add CS Topic',      fields: [['category','Category','select',['DBMS','Operating Systems','Computer Networks','OOP & Design','System Design']], ['name','Topic Name','text',null,true]] },
    addMlTopic:    { title: 'Add ML Topic',      fields: [['category','Category','select',['Python & Data','Statistics & Probability','Supervised Learning','Unsupervised Learning','Evaluation & Validation']], ['name','Topic Name','text',null,true]] },
    addDlTopic:    { title: 'Add DL Topic',      fields: [['category','Category','select',['Neural Network Fundamentals','PyTorch Foundations','Architectures & Transformers']], ['name','Topic Name','text',null,true]] },
    addGenAiTopic: { title: 'Add GenAI Topic',   fields: [['category','Category','select',['LLM Fundamentals','Embeddings','RAG Pipeline','RAG Evaluation','Frameworks']], ['name','Topic Name','text',null,true]] },
    addEngTopic:   { title: 'Add Backend Topic', fields: [['category','Category','select',['Python','Git & GitHub','Backend & Databases','DevOps & Deployment']], ['name','Topic Name','text',null,true]] },
    project: {
      title: 'Create Project',
      fields: [
        ['name',         'Project Name',              'text',    null, true],
        ['description',  'Short Description',         'textarea',null, true],
        ['status',       'Status',                    'select',  ['Active','Planned','Completed','Archived']],
        ['techStack',    'Tech Stack (Optional)',      'text'],
        ['startDate',    'Start Date (Optional)',      'date'],
        ['objective',    'Objective (Optional)',       'textarea'],
        ['architecture', 'Architecture (Optional)',    'textarea'],
        ['githubUrl',    'GitHub URL (Optional)',      'url'],
        ['demoUrl',      'Live Demo URL (Optional)',   'url']
      ]
    },
    oss: {
      title: 'Log OSS Contribution',
      fields: [
        ['repo',        'Repository (owner/repo)',    'text',   null, true],
        ['type',        'Type',                       'select', ['Bug Fix','Feature','Documentation','Refactor','Tests']],
        ['description', 'PR / Issue Description',    'text',   null, true],
        ['date',        'Date',                       'date',   null, false, getTodayDateString()],
        ['status',      'Status',                     'select', ['Open','Merged','Closed']],
        ['prUrl',       'Pull Request URL',           'url'],
        ['learnings',   'Learnings / Review Feedback','textarea']
      ]
    },
    communication: {
      title: 'Log Speaking Session',
      fields: [
        ['topic',    'Topic / Concept Defended',     'text',   null, true],
        ['category', 'Category',                     'select', ['DSA','ML','GenAI','Backend','Project defense','CS fundamentals','Behavioral','General speaking']],
        ['duration', 'Duration (Minutes)',            'number', null, false, '5'],
        ['rating',   'Self-Rating (1 to 5)',          'select', ['5','4','3','2','1']],
        ['date',     'Date',                         'date',   null, false, getTodayDateString()],
        ['link',     'Recording Link (Optional)',     'url'],
        ['notes',    'Notes / Self-Feedback',         'textarea']
      ]
    },
    reading: {
      title: 'Log Reading Session',
      fields: [
        ['title',      'Book / Paper / Resource Title', 'text',   null,  true],
        ['category',   'Category',                      'select', ['Book','Research Paper','Documentation','Article','Other']],
        ['pagesOrMins','Pages or Minutes Read',         'text',   null,  false, '20 mins'],
        ['date',       'Date',                          'date',   null,  false, getTodayDateString()],
        ['status',     'Status',                        'select', ['Reading','Completed','Backlog']],
        ['link',       'Resource Link (Optional)',       'url'],
        ['notes',      'Key Takeaway',                  'textarea']
      ]
    },
    contest: {
      title: 'Log Contest',
      fields: [
        ['platform',  'Platform',                'select', ['LeetCode','Codeforces','CodeChef','AtCoder','Other']],
        ['name',      'Contest Name',            'text',   null, true],
        ['date',      'Contest Date',            'date',   null, false, getTodayDateString()],
        ['solved',    'Problems Solved',         'number', null, false, '0'],
        ['attempted', 'Problems Attempted',      'number', null, false, '0'],
        ['result',    'Rating / Rank Change',    'text'],
        ['notes',     'Post-Contest Notes',      'textarea']
      ]
    },
    hackathon: {
      title: 'Add Hackathon',
      fields: [
        ['name',          'Hackathon Name',              'text',   null, true],
        ['organizer',     'Organizer (Optional)',         'text'],
        ['deadline',      'Registration Deadline',        'date',   null, false, getTodayDateString()],
        ['status',        'Status',                       'select', ['Registered','In Progress','Submitted','Winner']],
        ['techStack',     'Tech Stack',                   'text'],
        ['idea',          'Project Idea',                 'textarea'],
        ['submissionUrl', 'Submission / Demo Link',       'url']
      ]
    },
    application: {
      title: 'Add Job / Internship Application',
      fields: [
        ['company',    'Company Name',              'text',   null, true],
        ['role',       'Role',                      'text',   null, true],
        ['dateApplied','Date Applied',              'date',   null, false, getTodayDateString()],
        ['stage',      'Current Stage',             'select', ['Applied','OA','Technical','HR','Offer','Rejected']],
        ['resumeVer',  'Resume Version (Optional)', 'text'],
        ['referral',   'Referral / Source',         'text'],
        ['notes',      'Notes & Follow-up',         'textarea']
      ]
    },
    college: {
      title: 'Add College Item',
      fields: [
        ['course',   'Course Name',            'text',   null, true],
        ['type',     'Item Type',              'select', ['Assignment','Quiz','Exam','Project','Lecture','Lab']],
        ['title',    'Title & Details',        'text',   null, true],
        ['deadline', 'Deadline / Exam Date',   'date'],
        ['status',   'Status',                 'select', ['Planned','In Progress','Completed']],
        ['link',     'Portal / Link (Optional)','url'],
        ['notes',    'Notes',                  'textarea']
      ]
    },
    goal: {
      title: 'Add Goal',
      fields: [
        ['name',     'Goal Title',                          'text',   null, true],
        ['category', 'Category',                            'select', ['DSA','ML','AI / GenAI','Backend / SWE','CS Fundamentals','Open Source','Projects','Communication','Reading','Career','College','Personal']],
        ['target',   'Target Number',                       'number', null, true],
        ['unit',     'Unit (e.g. problems, sessions, PRs)', 'text',   null, true],
        ['deadline', 'Target Deadline',                     'date',   null, false, '2026-12-31'],
        ['notes',    'Notes',                               'textarea']
      ]
    }
  };

  // ─── MODAL OPEN / CLOSE ───────────────────────────────────────────────────

  function openModal(modalType, initialValues = {}) {
    const modal          = document.getElementById('entryModal');
    const titleEl        = document.getElementById('modalTitle');
    const fieldsContainer= document.getElementById('modalFields');
    const schema         = modalSchemas[modalType];
    if (!modal || !schema) return;

    modal.dataset.type   = modalType;
    modal.dataset.editId = initialValues._editId || '';

    const isEdit = !!initialValues._editId;
    titleEl.textContent  = isEdit
      ? schema.title.replace('Create', 'Edit').replace('Add', 'Edit').replace('Log', 'Edit')
      : schema.title;

    fieldsContainer.innerHTML = schema.fields.map(([name, label, type, options, required, defaultVal]) => {
      const val = (initialValues[name] !== undefined && initialValues[name] !== null)
        ? initialValues[name]
        : (defaultVal || '');
      if (type === 'select') {
        return `
          <label>${label}
            <select name="${name}" ${required ? 'required' : ''}>
              ${options.map(opt => `<option value="${opt}" ${opt === val ? 'selected' : ''}>${opt}</option>`).join('')}
            </select>
          </label>
        `;
      }
      if (type === 'textarea') {
        return `<label>${label}<textarea name="${name}" ${required ? 'required' : ''}>${val}</textarea></label>`;
      }
      return `<label>${label}<input name="${name}" type="${type}" value="${val}" ${required ? 'required' : ''} /></label>`;
    }).join('');

    modal.showModal();
  }

  // ─── ROUTING / NAVIGATION ─────────────────────────────────────────────────

  function showView(viewId) {
    document.querySelectorAll('.view-container').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const targetView = document.getElementById(`view-${viewId}`);
    const targetNav  = document.querySelector(`[data-nav="${viewId}"]`);
    if (targetView) targetView.classList.add('active');
    if (targetNav)  targetNav.classList.add('active');

    const titleEl = document.getElementById('viewTitle');
    if (titleEl) {
      const titles = {
        overview: 'Overview', today: 'Today', tasks: 'Task Manager',
        daily: 'Daily Log & Journal', dsa: 'DSA Tracker', implab: 'Implementation Lab',
        csfundamentals: 'CS Fundamentals', ml: 'Machine Learning', dl: 'Deep Learning',
        genai: 'GenAI / RAG', engineering: 'Backend & DevOps', projects: 'Projects',
        oss: 'Open Source', communication: 'Communication', reading: 'Reading',
        contests: 'Contests & Hackathons', career: 'Career Pipeline', college: 'College',
        scoreboard: 'Goals & Scoreboard', history: 'History', calendar: 'Calendar',
        settings: 'Backup & Data'
      };
      titleEl.textContent = titles[viewId] || 'Upward';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── TOAST ────────────────────────────────────────────────────────────────

  function showToast(msg) {
    const bar   = document.getElementById('toastBar');
    const msgEl = document.getElementById('toastMessage');
    if (!bar || !msgEl) return;
    msgEl.textContent = msg;
    bar.classList.add('visible');
    setTimeout(() => bar.classList.remove('visible'), 3000);
  }

  // ─── BACKUP & EXPORTS ─────────────────────────────────────────────────────

  function exportFullJson() {
    const data = window.UpwardEngine.exportStateToJson(state);
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `upward_backup_${getTodayDateString()}.json`;
    a.click();
    showToast('Full JSON backup exported.');
  }

  function restoreFullJson(file) {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        state = window.UpwardEngine.importStateFromJson(e.target.result, defaultState);
        saveState();
        renderAll();
        showToast('Database restored successfully.');
      } catch (err) {
        alert('Error parsing JSON backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function exportCsv(type) {
    let rows = [];
    if (type === 'dsa') {
      rows.push(['Date','Problem Name','Platform','Topic','Difficulty','Independent','Notes','Proof URL']);
      state.dsaLog.forEach(d => {
        rows.push([d.date, `"${d.name}"`, d.platform, d.topic, d.difficulty, d.independent, `"${d.notes||''}"`, `"${d.proofUrl||''}"`]);
      });
    } else if (type === 'tasks') {
      rows.push(['Date','Title','Category','Priority','Status','Estimate (min)','Project','Notes']);
      state.tasks.forEach(t => {
        rows.push([t.date||'', `"${t.title}"`, t.category, t.priority, t.status, t.estimate||'', `"${t.project||''}"`, `"${t.notes||''}"`]);
      });
    } else {
      rows.push(['Date','Category','Title','Duration (min)','Output','Related','Proof URL','Notes']);
      state.events.forEach(e => {
        rows.push([e.date, e.category, `"${e.title}"`, e.duration||'', `"${e.output||''}"`, `"${e.related||''}"`, `"${e.proofUrl||''}"`, `"${e.notes||''}"`]);
      });
    }
    const csv  = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `upward_${type}_${getTodayDateString()}.csv`;
    a.click();
    showToast(`${type.toUpperCase()} CSV exported.`);
  }

  // ─── LISTENERS ────────────────────────────────────────────────────────────

  function initListeners() {
    // Navigation
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.onclick = e => { e.preventDefault(); showView(el.dataset.nav); };
    });

    // Modal openers
    document.querySelectorAll('[data-modal]').forEach(btn => {
      btn.onclick = () => openModal(btn.dataset.modal);
    });

    const modalForm   = document.getElementById('modalForm');
    const modalDialog = document.getElementById('entryModal');
    const modalCancel = document.getElementById('modalCancelBtn');

    if (modalCancel) modalCancel.onclick = () => modalDialog.close();
    document.querySelector('.modal-close')?.addEventListener('click', () => modalDialog.close());

    if (modalForm) {
      modalForm.onsubmit = e => {
        e.preventDefault();
        const type     = modalDialog.dataset.type;
        const editId   = modalDialog.dataset.editId;
        const formData = Object.fromEntries(new FormData(modalForm));

        if (type === 'task') {
          state.tasks.push({
            id: generateId('task'),
            title: formData.title,
            date: formData.date || getTodayDateString(),
            category: formData.category,
            priority: formData.priority,
            estimate: Number(formData.estimate) || 30,
            project: formData.project || '',
            goal: formData.goal || '',
            status: 'Planned',
            notes: formData.notes || '',
            proofUrl: formData.proofUrl || ''
          });
          saveState();
          showToast('Task added.');

        } else if (type === 'dsa') {
          state.dsaLog.push({
            id: generateId('dsa'),
            name: formData.name,
            platform: formData.platform,
            url: formData.url || '',
            topic: formData.topic,
            difficulty: formData.difficulty,
            date: formData.date || getTodayDateString(),
            independent: formData.independent,
            notes: formData.notes || '',
            proofUrl: formData.proofUrl || ''
          });
          saveState();
          showToast(`DSA logged: "${formData.name}"`);

        } else if (type === 'activity') {
          appendEvent(formData);

        } else if (type === 'editEvent') {
          const evt = state.events.find(ev => ev.id === editId);
          if (evt) {
            Object.assign(evt, {
              title:    formData.title,
              date:     formData.date || getTodayDateString(),
              category: formData.category,
              duration: Number(formData.duration) || 0,
              output:   formData.output || '',
              related:  formData.related || '',
              proofUrl: formData.proofUrl || '',
              notes:    formData.notes || ''
            });
            saveState();
            showToast('Activity updated.');
          }

        } else if (type === 'journal') {
          state.journalEntries.push({
            id: generateId('j'),
            date: formData.date || getTodayDateString(),
            well: formData.well || '',
            badly: formData.badly || '',
            learned: formData.learned || '',
            notes: formData.notes || ''
          });
          saveState();
          showToast('Journal entry saved.');

        } else if (type === 'addAlgo') {
          state.implabAlgorithms.push({
            id: generateId('algo'),
            name: formData.name,
            domain: formData.domain,
            understood: false, implemented: false, tested: false, used: false, explained: false,
            proofUrl: '', githubUrl: formData.githubUrl || '', notes: formData.notes || ''
          });
          saveState();
          showToast('Algorithm added.');

        } else if (type === 'addCsTopic') {
          if (!state.csChecklists[formData.category]) state.csChecklists[formData.category] = [];
          state.csChecklists[formData.category].push(formData.name);
          saveState();
          showToast('CS topic added.');

        } else if (type === 'addMlTopic') {
          if (!state.mlChecklists[formData.category]) state.mlChecklists[formData.category] = [];
          state.mlChecklists[formData.category].push(formData.name);
          saveState();
          showToast('ML topic added.');

        } else if (type === 'addDlTopic') {
          if (!state.dlChecklists[formData.category]) state.dlChecklists[formData.category] = [];
          state.dlChecklists[formData.category].push(formData.name);
          saveState();
          showToast('DL topic added.');

        } else if (type === 'addGenAiTopic') {
          if (!state.genAiChecklists[formData.category]) state.genAiChecklists[formData.category] = [];
          state.genAiChecklists[formData.category].push(formData.name);
          saveState();
          showToast('GenAI topic added.');

        } else if (type === 'addEngTopic') {
          if (!state.engChecklists[formData.category]) state.engChecklists[formData.category] = [];
          state.engChecklists[formData.category].push(formData.name);
          saveState();
          showToast('Backend topic added.');

        } else if (type === 'project') {
          if (editId) {
            const proj = state.projects.find(p => p.id === editId);
            if (proj) {
              proj.name         = formData.name;
              proj.description  = formData.description;
              proj.status       = formData.status;
              proj.techStack    = formData.techStack || '';
              proj.startDate    = formData.startDate || '';
              proj.objective    = formData.objective || '';
              proj.architecture = formData.architecture || '';
              proj.githubUrl    = formData.githubUrl || '';
              proj.demoUrl      = formData.demoUrl || '';
            }
            saveState();
            showToast('Project updated.');
          } else {
            state.projects.push({
              id: generateId('proj'),
              name: formData.name,
              description: formData.description,
              status: formData.status,
              techStack: formData.techStack || '',
              startDate: formData.startDate || '',
              endDate: '',
              objective: formData.objective || '',
              architecture: formData.architecture || '',
              githubUrl: formData.githubUrl || '',
              demoUrl: formData.demoUrl || '',
              milestones: [], experiments: [], decisions: [], knownProblems: [],
              nextPlannedWork: '', learned: '', evidence: ''
            });
            saveState();
            showToast('Project created.');
          }

        } else if (type === 'oss') {
          state.ossLog.push({
            id: generateId('oss'),
            repo: formData.repo, type: formData.type, description: formData.description,
            date: formData.date || getTodayDateString(), status: formData.status,
            prUrl: formData.prUrl || '', learnings: formData.learnings || ''
          });
          if (formData.status === 'Merged') {
            appendEvent({
              category: 'Open Source',
              date: formData.date || getTodayDateString(),
              title: `Merged PR in ${formData.repo}: ${formData.description}`,
              proofUrl: formData.prUrl || ''
            });
          } else {
            saveState();
          }
          showToast('OSS contribution logged.');

        } else if (type === 'communication') {
          state.commLog.push({
            id: generateId('comm'),
            topic: formData.topic, category: formData.category,
            duration: Number(formData.duration) || 5,
            rating: Number(formData.rating) || 4,
            date: formData.date || getTodayDateString(),
            link: formData.link || '', notes: formData.notes || ''
          });
          saveState();
          showToast('Speaking session logged.');

        } else if (type === 'reading') {
          state.readingLog.push({
            id: generateId('read'),
            title: formData.title, category: formData.category,
            pagesOrMins: formData.pagesOrMins || '',
            date: formData.date || getTodayDateString(),
            status: formData.status, link: formData.link || '', notes: formData.notes || ''
          });
          saveState();
          showToast(`Reading logged: "${formData.title}"`);

        } else if (type === 'contest') {
          state.contests.push({
            id: generateId('c'),
            platform: formData.platform, name: formData.name,
            date: formData.date || getTodayDateString(),
            solved: Number(formData.solved) || 0,
            attempted: Number(formData.attempted) || 0,
            result: formData.result || '', notes: formData.notes || ''
          });
          saveState();
          showToast('Contest record saved.');

        } else if (type === 'hackathon') {
          state.hackathons.push({
            id: generateId('h'),
            name: formData.name, organizer: formData.organizer || '',
            deadline: formData.deadline || '', status: formData.status,
            techStack: formData.techStack || '', idea: formData.idea || '',
            submissionUrl: formData.submissionUrl || ''
          });
          saveState();
          showToast('Hackathon saved.');

        } else if (type === 'application') {
          state.applications.push({
            id: generateId('app'),
            company: formData.company, role: formData.role,
            dateApplied: formData.dateApplied || getTodayDateString(),
            stage: formData.stage, resumeVer: formData.resumeVer || '',
            referral: formData.referral || '', notes: formData.notes || ''
          });
          saveState();
          showToast('Application saved.');

        } else if (type === 'college') {
          state.collegeItems.push({
            id: generateId('col'),
            course: formData.course, type: formData.type, title: formData.title,
            deadline: formData.deadline || '', status: formData.status,
            link: formData.link || '', notes: formData.notes || ''
          });
          saveState();
          showToast('College item recorded.');

        } else if (type === 'goal') {
          state.goals.push({
            id: generateId('g'),
            name: formData.name, category: formData.category,
            target: Number(formData.target) || 10, unit: formData.unit,
            deadline: formData.deadline || '2026-12-31', notes: formData.notes || ''
          });
          saveState();
          showToast('Goal created.');
        }

        modalDialog.close();
        renderAll();
      };
    }

    // Daily page forms
    const actForm = document.getElementById('activityLogForm');
    if (actForm) {
      document.getElementById('activityDateInput').value = getTodayDateString();
      actForm.onsubmit = e => {
        e.preventDefault();
        const f = new FormData(actForm);
        appendEvent({
          date: f.get('date'), category: f.get('category'), title: f.get('title'),
          duration: Number(f.get('duration')) || 0, related: f.get('related'),
          output: f.get('output'), proofUrl: f.get('proofUrl'), notes: f.get('notes')
        });
        actForm.reset();
        document.getElementById('activityDateInput').value = getTodayDateString();
      };
    }

    const jForm = document.getElementById('journalForm');
    if (jForm) {
      document.getElementById('journalDateInput').value = getTodayDateString();
      jForm.onsubmit = e => {
        e.preventDefault();
        const f = new FormData(jForm);
        state.journalEntries.push({
          id: generateId('j'),
          date: f.get('date') || getTodayDateString(),
          well: f.get('well') || '', badly: f.get('badly') || '',
          learned: f.get('learned') || '', notes: f.get('notes') || ''
        });
        saveState(); renderAll(); showToast('Journal saved.');
        jForm.reset();
        document.getElementById('journalDateInput').value = getTodayDateString();
      };
    }

    // Task filters
    document.querySelectorAll('.task-filter-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.task-filter-btn').forEach(b => b.classList.replace('btn-primary', 'btn-secondary'));
        btn.classList.replace('btn-secondary', 'btn-primary');
        activeTaskFilter = btn.dataset.filter;
        renderTasks();
      };
    });
    document.getElementById('taskCategorySelect')?.addEventListener('change', e => {
      activeTaskCategory = e.target.value;
      renderTasks();
    });

    // Implab filter
    document.querySelectorAll('.implab-filter-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.implab-filter-btn').forEach(b => b.classList.replace('btn-primary', 'btn-secondary'));
        btn.classList.replace('btn-secondary', 'btn-primary');
        activeImplabDomain = btn.dataset.domain;
        renderImplab();
      };
    });

    // DSA filters
    document.getElementById('dsaTopicFilter')?.addEventListener('change', renderDsa);
    document.getElementById('dsaDifficultyFilter')?.addEventListener('change', renderDsa);
    document.getElementById('dsaPlatformFilter')?.addEventListener('change', renderDsa);

    // History filters
    document.querySelectorAll('.history-time-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.history-time-btn').forEach(b => b.classList.replace('btn-primary', 'btn-secondary'));
        btn.classList.replace('btn-secondary', 'btn-primary');
        activeHistoryTime = btn.dataset.time;
        renderHistory();
      };
    });
    document.getElementById('historyCategorySelect')?.addEventListener('change', e => {
      activeHistoryCategory = e.target.value;
      renderHistory();
    });
    document.getElementById('historySearchInput')?.addEventListener('input', e => {
      activeHistoryQuery = e.target.value.toLowerCase();
      renderHistory();
    });

    // Calendar navigation
    document.getElementById('calPrevMonthBtn')?.addEventListener('click', () => {
      calendarMonth--;
      if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
      renderCalendar();
    });
    document.getElementById('calNextMonthBtn')?.addEventListener('click', () => {
      calendarMonth++;
      if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
      renderCalendar();
    });

    // Day modal dismiss
    document.getElementById('dayModalCloseBtn')?.addEventListener('click', () => document.getElementById('dayDetailsModal')?.close());
    document.getElementById('dayModalDismiss')?.addEventListener('click', () => document.getElementById('dayDetailsModal')?.close());

    // Backup / Export
    document.getElementById('btnExportFullJson')?.addEventListener('click', exportFullJson);
    document.getElementById('importFullJsonInput')?.addEventListener('change', e => {
      if (e.target.files[0]) restoreFullJson(e.target.files[0]);
    });
    document.getElementById('btnExportDsaCsv')?.addEventListener('click', () => exportCsv('dsa'));
    document.getElementById('btnExportActivitiesCsv')?.addEventListener('click', () => exportCsv('activities'));
    document.getElementById('btnExportTasksCsv')?.addEventListener('click', () => exportCsv('tasks'));

    // Factory Reset
    document.getElementById('btnFactoryReset')?.addEventListener('click', () => {
      const first = confirm('⚠ This will permanently delete ALL your data. Are you sure?');
      if (!first) return;
      const second = confirm('Last chance — this cannot be undone. Delete everything?');
      if (!second) return;
      localStorage.removeItem('upward_state');
      showToast('All data cleared. Reloading...');
      setTimeout(() => location.reload(), 1200);
    });

    // DSA JSON / CSV import
    const dsaImportBtn  = document.getElementById('btnImportDsaJson');
    const dsaFileInput  = document.getElementById('dsaImportFile');
    if (dsaImportBtn && dsaFileInput) {
      dsaImportBtn.onclick = () => dsaFileInput.click();
      dsaFileInput.onchange = e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
          try {
            const content = ev.target.result;
            if (file.name.endsWith('.json')) {
              const items = JSON.parse(content);
              if (Array.isArray(items)) {
                let imported = 0;
                items.forEach(p => {
                  const importedName = (p.name || p.title || 'Untitled Problem').trim().toLowerCase();
                  const importedPlatform = (p.platform || 'LeetCode').trim().toLowerCase();
                  if (state.dsaLog.some(d => {
                    const existingName = (d.name || '').trim().toLowerCase();
                    const existingPlatform = (d.platform || 'LeetCode').trim().toLowerCase();
                    return existingName === importedName && existingPlatform === importedPlatform;
                  })) {
                    return;
                  }
                  state.dsaLog.push({
                    id: generateId('dsa'),
                    name: p.name || p.title || 'Untitled Problem',
                    platform: p.platform || 'LeetCode',
                    url: p.url || '',
                    topic: p.topic || p.pattern || 'Other',
                    difficulty: p.difficulty || 'Medium',
                    date: p.date || getTodayDateString(),
                    independent: p.independent !== undefined ? (p.independent === true || p.independent === 'Yes' ? 'Yes' : 'No') : 'Yes',
                    notes: p.notes || '',
                    proofUrl: p.proofUrl || ''
                  });
                  imported++;
                });
                saveState(); renderAll();
                showToast(`Imported ${imported} DSA problems (${items.length - imported} duplicates skipped).`);
              }
            } else {
              alert('JSON format expected: [{"name":"Two Sum","platform":"LeetCode","topic":"Arrays","difficulty":"Easy"}]');
            }
          } catch (err) {
            alert('Error parsing import file: ' + err.message);
          }
        };
        reader.readAsText(file);
      };
    }

    // Global Search (Ctrl+K)
    const searchDialog  = document.getElementById('searchDialog');
    const searchInput   = document.getElementById('globalSearchInput');
    const searchResults = document.getElementById('searchResultsList');
    const searchBtn     = document.getElementById('globalSearchBtn');

    function openSearch() {
      if (!searchDialog) return;
      searchDialog.showModal();
      searchInput.value = '';
      renderSearch('');
      searchInput.focus();
    }

    if (searchBtn) searchBtn.onclick = openSearch;

    window.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openSearch(); }
      if (e.key === 'Escape' && searchDialog?.open) searchDialog.close();
    });

    if (searchInput) {
      searchInput.oninput = () => renderSearch(searchInput.value.toLowerCase());
    }

    function renderSearch(q) {
      if (!searchResults) return;
      const matches = [];

      state.tasks.forEach(t => {
        if ((t.title + ' ' + (t.notes || '') + ' ' + t.category).toLowerCase().includes(q)) {
          matches.push({ type: 'Task', title: t.title, meta: `${t.category} · ${t.status}`, action: () => showView('tasks') });
        }
      });
      state.dsaLog.forEach(d => {
        if ((d.name + ' ' + (d.notes || '') + ' ' + d.topic).toLowerCase().includes(q)) {
          matches.push({ type: 'DSA', title: d.name, meta: `${d.platform} · ${d.topic} (${d.difficulty})`, action: () => showView('dsa') });
        }
      });
      state.events.forEach(e => {
        if ((e.title + ' ' + (e.notes || '') + ' ' + e.category).toLowerCase().includes(q)) {
          matches.push({ type: 'Activity', title: e.title, meta: `${e.date} · ${e.category}`, action: () => showView('history') });
        }
      });
      state.projects.forEach(p => {
        if ((p.name + ' ' + (p.description || '')).toLowerCase().includes(q)) {
          matches.push({ type: 'Project', title: p.name, meta: `${p.status}`, action: () => showView('projects') });
        }
      });
      state.commLog.forEach(c => {
        if ((c.topic + ' ' + (c.notes || '')).toLowerCase().includes(q)) {
          matches.push({ type: 'Communication', title: c.topic, meta: `${c.date} · Rating: ${c.rating}/5`, action: () => showView('communication') });
        }
      });

      if (!matches.length) {
        searchResults.innerHTML = '<p class="muted" style="padding:12px;">No matching records found.</p>';
        return;
      }

      searchResults.innerHTML = matches.slice(0, 10).map((m, i) => `
        <div class="checklist-item" style="cursor:pointer;" onclick="window.UpwardApp.executeSearchAction(${i})">
          <div>
            <strong>${m.title}</strong>
            <small class="muted mono" style="display:block;">${m.meta}</small>
          </div>
          <span class="status-pill pill-neutral">${m.type}</span>
        </div>
      `).join('');

      window._currentSearchMatches = matches;
    }
  }

  // ─── PUBLIC API ───────────────────────────────────────────────────────────

  window.UpwardApp = {
    state,
    appendEvent,
    deleteEvent,
    editEventRecord,
    markTaskComplete,
    deleteTask,
    setTaskStatus,
    deleteDsaProblem,
    toggleImplabField,
    editImplabUrls,
    deleteImplabAlgo,
    toggleCsTopic,
    editCsTopicNotes,
    toggleMlStage:    (t, stage) => toggleGenericStage(state.mlChecked,    t, stage),
    editMlTopicNotes:    t => editGenericNotes(state.mlChecked,    t),
    toggleDlStage:    (t, stage) => toggleGenericStage(state.dlChecked,    t, stage),
    editDlTopicNotes:    t => editGenericNotes(state.dlChecked,    t),
    toggleGenAiStage: (t, stage) => toggleGenericStage(state.genAiChecked, t, stage),
    editGenAiTopicNotes: t => editGenericNotes(state.genAiChecked, t),
    toggleEngStage:   (t, stage) => toggleGenericStage(state.engChecked,   t, stage),
    editEngTopicNotes:   t => editGenericNotes(state.engChecked,   t),
    toggleProjectMilestone,
    addProjectMilestone,
    logProjectActivity,
    editProject,
    deleteProject,
    deleteOssItem,
    deleteCommItem,
    deleteReadingItem,
    deleteContestItem,
    deleteHackathonItem,
    deleteApplicationItem,
    markCollegeComplete,
    deleteCollegeItem,
    deleteHistoryItem,
    openEditEvent,
    openDayDetails,
    showView,
    calculateDerivedStats,
    executeSearchAction: idx => {
      const match = window._currentSearchMatches?.[idx];
      if (match) {
        document.getElementById('searchDialog')?.close();
        match.action();
      }
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initListeners();
    renderAll();
  });

})();
