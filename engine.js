// engine.js — Pure engine functions for Upward Personal Execution Database
// Usable in Node.js (require) and browser (window.UpwardEngine)
// All functions are pure: no DOM access, no localStorage, no side effects
// These functions mirror the logic in app.js and are the authoritative test target.

'use strict';

// ─── ID GENERATION ───────────────────────────────────────────────────────────

/** Safe ID generator utilizing crypto.randomUUID() when available, falling back to time + random. */
function generateId(prefix) {
  const p = prefix ? `${prefix}_` : '';
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return p + crypto.randomUUID();
  }
  // Safe fallback
  const rand = Math.random().toString(36).substr(2, 9);
  return `${p}${Date.now()}_${rand}`;
}

// ─── DATE HELPERS ────────────────────────────────────────────────────────────

/** Return YYYY-MM-DD using local timezone (avoids UTC shift from toISOString). */
function getTodayDateString(now) {
  const d = now || new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/** Same as getTodayDateString but explicitly named for clarity. */
function getLocalDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// ─── STREAK ──────────────────────────────────────────────────────────────────

/**
 * Calculate consecutive daily streak.
 * activeDates: Set or iterable of 'YYYY-MM-DD' strings.
 * referenceDate: Date object representing "today" (defaults to new Date()).
 */
function calculateStreak(activeDates, referenceDate) {
  const dateSet = new Set(activeDates);
  const ref = referenceDate || new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(ref);
    d.setDate(d.getDate() - i);
    const k = getLocalDateStr(d);
    if (dateSet.has(k)) {
      streak++;
    } else if (i === 0) {
      // Today not yet logged is fine — streak continues if yesterday was logged
      continue;
    } else {
      break;
    }
  }
  return streak;
}

// ─── EVENTS ──────────────────────────────────────────────────────────────────

/**
 * Create a canonical activity event object. Does NOT mutate state.
 * Returns the event object to push to state.events.
 */
function createEventRecord(eventData, now) {
  const today = getTodayDateString(now);
  return {
    id: generateId('evt'),
    timestamp: Date.now(),
    date: eventData.date || today,
    category: eventData.category || 'Other',
    title: eventData.title || 'Untitled Activity',
    duration: Number(eventData.duration) || 0,
    output: eventData.output || '',
    related: eventData.related || '',
    proofUrl: eventData.proofUrl || '',
    notes: eventData.notes || '',
    taskId: eventData.taskId || null
  };
}

// ─── TASKS ───────────────────────────────────────────────────────────────────

/** Create a new task record from form fields. */
function createTaskRecord(fields, now) {
  const today = getTodayDateString(now);
  return {
    id: generateId('task'),
    title: fields.title,
    date: fields.date || today,
    category: fields.category || 'Other',
    priority: fields.priority || 'Medium',
    estimate: Number(fields.estimate) || 30,
    project: fields.project || '',
    goal: fields.goal || '',
    status: 'Planned',
    notes: fields.notes || '',
    proofUrl: fields.proofUrl || ''
  };
}

/**
 * Complete a task. Returns { updatedTask, event }.
 * Does NOT mutate state — caller must apply the updates.
 */
function completeTaskRecord(task, today) {
  const updatedTask = { ...task, status: 'Completed', completedDate: today };
  const event = {
    id: generateId('evt'),
    timestamp: Date.now(),
    date: today,
    category: task.category || 'Other',
    title: task.title,
    duration: task.estimate || 30,
    output: '',
    related: task.project || task.goal || '',
    proofUrl: task.proofUrl || '',
    notes: task.notes || '',
    taskId: task.id
  };
  return { updatedTask, event };
}

// ─── DSA ─────────────────────────────────────────────────────────────────────

/** Create a DSA problem log record from form fields. */
function logDsaRecord(fields, now) {
  const today = getTodayDateString(now);
  return {
    id: generateId('dsa'),
    name: fields.name,
    platform: fields.platform || 'LeetCode',
    url: fields.url || '',
    topic: fields.topic || 'Other',
    difficulty: fields.difficulty || 'Medium',
    date: fields.date || today,
    independent: fields.independent || 'Yes',
    notes: fields.notes || '',
    proofUrl: fields.proofUrl || ''
  };
}

// ─── DERIVED STATS ────────────────────────────────────────────────────────────

/** Calculate derived statistics from state. Pure — reads state, returns object. */
function calculateDerivedStats(state) {
  const totalTasks = (state.tasks || []).filter(t => t.status === 'Completed').length;
  const totalDsa = (state.dsaLog || []).length;
  const independentDsa = (state.dsaLog || []).filter(d => d.independent === 'Yes').length;
  const totalActivities = (state.events || []).length;

  const activeDateSet = new Set([
    ...(state.events || []).map(e => e.date).filter(Boolean),
    ...(state.dsaLog || []).map(d => d.date).filter(Boolean),
    ...(state.tasks || []).filter(t => t.status === 'Completed').map(t => t.completedDate || t.date).filter(Boolean),
    ...(state.journalEntries || []).map(j => j.date).filter(Boolean)
  ]);

  const streak = calculateStreak(activeDateSet, new Date());

  return { totalTasks, totalDsa, independentDsa, totalActivities, streak };
}

// ─── HISTORY AGGREGATION ─────────────────────────────────────────────────────

/**
 * Build a flat, unified list of history items from all domain logs.
 * Each item has: { id, date, category, title, duration, proofUrl, notes, source, isTaskEvent }
 * NO double-counting: each record appears exactly once from its authoritative source.
 */
function buildHistoryItems(state) {
  const items = [];

  // 1. Canonical activity events (task completions, manual activity logs, OSS merges, implab, checklists)
  //    DSA, Comm, Reading, Contest do NOT generate events anymore — they appear via their domain logs below.
  (state.events || []).forEach(e => items.push({
    id: e.id,
    date: e.date,
    category: e.category,
    title: e.title,
    duration: e.duration || 0,
    proofUrl: e.proofUrl || '',
    notes: e.notes || '',
    source: 'event',
    isTaskEvent: !!e.taskId
  }));

  // 2. DSA problem log (authoritative source — no duplicate event)
  (state.dsaLog || []).forEach(d => items.push({
    id: d.id,
    date: d.date,
    category: 'DSA',
    title: `${d.name} (${d.difficulty})`,
    duration: 0,
    proofUrl: d.proofUrl || d.url || '',
    notes: [d.platform, d.topic, `Independent: ${d.independent}`, d.notes].filter(Boolean).join(' · '),
    source: 'dsa'
  }));

  // 3. Communication sessions
  (state.commLog || []).forEach(c => items.push({
    id: c.id,
    date: c.date,
    category: 'Communication',
    title: c.topic,
    duration: c.duration || 0,
    proofUrl: c.link || '',
    notes: [`Rating: ${c.rating}/5`, c.notes].filter(Boolean).join(' · '),
    source: 'comm'
  }));

  // 4. Reading sessions
  (state.readingLog || []).forEach(r => items.push({
    id: r.id,
    date: r.date,
    category: 'Reading',
    title: r.title,
    duration: 0,
    proofUrl: r.link || '',
    notes: [r.pagesOrMins, r.status, r.notes].filter(Boolean).join(' · '),
    source: 'reading'
  }));

  // 5. Contests
  (state.contests || []).forEach(c => items.push({
    id: c.id,
    date: c.date,
    category: 'Contest',
    title: `${c.platform}: ${c.name}`,
    duration: 0,
    proofUrl: '',
    notes: [`Solved ${c.solved}/${c.attempted}`, c.result, c.notes].filter(Boolean).join(' · '),
    source: 'contest'
  }));

  // 6. Hackathons
  (state.hackathons || []).forEach(h => items.push({
    id: h.id,
    date: h.deadline || '',
    category: 'Hackathon',
    title: h.name,
    duration: 0,
    proofUrl: h.submissionUrl || '',
    notes: [`Status: ${h.status}`, h.idea].filter(Boolean).join(' · '),
    source: 'hackathon'
  }));

  // 7. Journal entries
  (state.journalEntries || []).forEach(j => items.push({
    id: j.id,
    date: j.date,
    category: 'Journal',
    title: 'Daily Journal',
    duration: 0,
    proofUrl: '',
    notes: j.learned ? `Learned: ${j.learned}` : (j.well || j.notes || ''),
    source: 'journal'
  }));

  // 8. College Completed Work
  (state.collegeItems || []).filter(c => c.status === 'Completed').forEach(c => items.push({
    id: c.id,
    date: c.deadline || '',
    category: 'College',
    title: `${c.course}: ${c.title}`,
    duration: 0,
    proofUrl: c.link || '',
    notes: c.notes || '',
    source: 'college'
  }));

  return items;
}

/**
 * Filter and sort history items.
 * timeFilter: 'ALL' | 'TODAY' | 'YESTERDAY' | 'WEEK' | 'MONTH' | 'YEAR'
 * categoryFilter: category string or 'ALL'
 * query: search string (case-insensitive)
 * todayStr: 'YYYY-MM-DD' string for today
 * now: Date object (defaults to new Date())
 */
function filterHistoryItems(items, timeFilter, categoryFilter, query, todayStr, now) {
  const ref = now || new Date();
  let filtered = [...items];

  if (timeFilter === 'TODAY') {
    filtered = filtered.filter(i => i.date === todayStr);
  } else if (timeFilter === 'YESTERDAY') {
    const yest = new Date(ref);
    yest.setDate(yest.getDate() - 1);
    const yesterdayStr = getLocalDateStr(yest);
    filtered = filtered.filter(i => i.date === yesterdayStr);
  } else if (timeFilter === 'WEEK') {
    const weekAgo = new Date(ref);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekAgoStr = getLocalDateStr(weekAgo);
    filtered = filtered.filter(i => i.date >= weekAgoStr && i.date <= todayStr);
  } else if (timeFilter === 'MONTH') {
    const startOfMonth = `${ref.getFullYear()}-${String(ref.getMonth() + 1).padStart(2, '0')}-01`;
    filtered = filtered.filter(i => i.date >= startOfMonth && i.date <= todayStr);
  } else if (timeFilter === 'YEAR') {
    const startOfYear = `${ref.getFullYear()}-01-01`;
    filtered = filtered.filter(i => i.date >= startOfYear && i.date <= todayStr);
  }

  if (categoryFilter && categoryFilter !== 'ALL') {
    filtered = filtered.filter(i => i.category === categoryFilter);
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(i =>
      (i.title + ' ' + (i.notes || '') + ' ' + i.category).toLowerCase().includes(q)
    );
  }

  filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return filtered;
}

// ─── BACKUP / RESTORE ────────────────────────────────────────────────────────

/** Serialize state to JSON string with export metadata. */
function exportStateToJson(state) {
  return JSON.stringify({
    ...state,
    _exportDate: getTodayDateString(),
    _exportTimestamp: Date.now()
  }, null, 2);
}

/**
 * Parse and validate an imported JSON backup.
 * Throws if the JSON is invalid or missing required keys.
 * Returns merged state (imported values override defaultState).
 */
function importStateFromJson(jsonString, defaultState) {
  let parsed;
  try {
    parsed = JSON.parse(jsonString);
  } catch (e) {
    throw new Error('JSON parse error: ' + e.message);
  }
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid backup: not an object');
  }
  if (!Array.isArray(parsed.tasks) && !Array.isArray(parsed.events)) {
    throw new Error('Invalid backup schema: missing tasks or events array');
  }
  return migrateState(parsed, defaultState);
}

/**
 * Merge raw (potentially incomplete) stored state with defaultState.
 * Ensures all required arrays exist. Safe for schema migrations.
 */
function migrateState(raw, defaultState) {
  if (!raw || typeof raw !== 'object') {
    return typeof structuredClone === 'function'
      ? structuredClone(defaultState)
      : JSON.parse(JSON.stringify(defaultState));
  }
  const merged = { ...defaultState, ...raw };
  const arrayKeys = [
    'events', 'tasks', 'dsaLog', 'implabAlgorithms', 'ossLog',
    'commLog', 'readingLog', 'contests', 'hackathons', 'applications',
    'collegeItems', 'goals', 'journalEntries'
  ];
  arrayKeys.forEach(k => {
    if (!Array.isArray(merged[k])) merged[k] = (defaultState && Array.isArray(defaultState[k])) ? [...defaultState[k]] : [];
  });
  return merged;
}

// ─── EXPORT ──────────────────────────────────────────────────────────────────

const UpwardEngine = {
  generateId,
  getTodayDateString,
  getLocalDateStr,
  calculateStreak,
  createEventRecord,
  createTaskRecord,
  completeTaskRecord,
  logDsaRecord,
  calculateDerivedStats,
  buildHistoryItems,
  filterHistoryItems,
  exportStateToJson,
  importStateFromJson,
  migrateState
};

// Node.js (test_engine.js)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UpwardEngine;
}

// Browser
if (typeof window !== 'undefined') {
  window.UpwardEngine = UpwardEngine;
}
