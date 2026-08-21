// test_engine.js — Regression & Unit Test Suite for Upward Execution Database
// Directly imports and executes functions from engine.js (no mock reimplementations).

'use strict';

const assert = require('assert');
const UpwardEngine = require('./engine.js');

console.log('====================================================');
console.log('  RUNNING UPWARD PERSONAL EXECUTION DATABASE TESTS  ');
console.log('====================================================\n');

let passed = 0;
let total = 0;

function test(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log(`✓ [PASS] ${name}`);
  } catch (err) {
    console.error(`✗ [FAIL] ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

// ─── 1. DATE & TIMEZONE SAFETY ───────────────────────────────────────────────

test('Date helper uses local date format YYYY-MM-DD without UTC drift', () => {
  const d = new Date(2026, 7, 21, 23, 45, 0); // Aug 21, 2026, 11:45 PM local
  const dateStr = UpwardEngine.getLocalDateStr(d);
  assert.strictEqual(dateStr, '2026-08-21', 'Local date must remain Aug 21 regardless of UTC offset');

  const morning = new Date(2026, 0, 1, 0, 15, 0); // Jan 1, 2026, 12:15 AM local
  assert.strictEqual(UpwardEngine.getLocalDateStr(morning), '2026-01-01');
});

// ─── 2. STREAK CALCULATION ───────────────────────────────────────────────────

test('Streak calculator handles active consecutive days correctly', () => {
  const refDate = new Date(2026, 7, 21); // 2026-08-21
  const activeDates = ['2026-08-21', '2026-08-20', '2026-08-19'];
  const streak = UpwardEngine.calculateStreak(activeDates, refDate);
  assert.strictEqual(streak, 3, 'Consecutive 3 days should return streak of 3');
});

test('Streak continues if today has no activity but yesterday did', () => {
  const refDate = new Date(2026, 7, 21); // 2026-08-21 (today)
  const activeDates = ['2026-08-20', '2026-08-19']; // only yesterday and day before
  const streak = UpwardEngine.calculateStreak(activeDates, refDate);
  assert.strictEqual(streak, 2, 'Should continue yesterday streak even if today is not yet logged');
});

test('Streak breaks on missed day', () => {
  const refDate = new Date(2026, 7, 21);
  const activeDates = ['2026-08-21', '2026-08-19']; // missed 2026-08-20
  const streak = UpwardEngine.calculateStreak(activeDates, refDate);
  assert.strictEqual(streak, 1, 'Gap in dates should stop streak at 1');
});

// ─── 3. TASK CREATION & COMPLETION ──────────────────────────────────────────

test('Task creation, completion, and canonical event generation work accurately', () => {
  const state = { tasks: [], events: [] };
  const task = UpwardEngine.createTaskRecord({
    title: 'Implement Hybrid Retrieval with BM25',
    category: 'AI / GenAI',
    priority: 'High',
    estimate: 45
  }, new Date(2026, 7, 21));

  state.tasks.push(task);
  assert.strictEqual(state.tasks.length, 1);
  assert.strictEqual(state.tasks[0].status, 'Planned');
  assert.strictEqual(state.events.length, 0);

  const { updatedTask, event } = UpwardEngine.completeTaskRecord(task, '2026-08-21');
  state.tasks[0] = updatedTask;
  state.events.push(event);

  assert.strictEqual(state.tasks[0].status, 'Completed');
  assert.strictEqual(state.tasks[0].completedDate, '2026-08-21');
  assert.strictEqual(state.events.length, 1);
  assert.strictEqual(state.events[0].taskId, task.id);
  assert.strictEqual(state.events[0].title, 'Implement Hybrid Retrieval with BM25');
  assert.strictEqual(state.events[0].category, 'AI / GenAI');
});

// ─── 4. REGRESSION: NO DSA DOUBLE-COUNTING IN HISTORY ─────────────────────────

test('Regression: DSA problem logged appears EXACTLY ONCE in history', () => {
  const state = {
    events: [],
    dsaLog: [],
    tasks: [],
    commLog: [],
    readingLog: [],
    contests: [],
    hackathons: [],
    journalEntries: []
  };

  const dsaProb = UpwardEngine.logDsaRecord({
    name: '3Sum',
    platform: 'LeetCode',
    topic: 'Two Pointers',
    difficulty: 'Medium',
    independent: 'Yes',
    notes: 'Sort first then 2-pointer sweep'
  }, new Date(2026, 7, 21));

  state.dsaLog.push(dsaProb);

  assert.strictEqual(state.events.length, 0, 'DSA logging must NOT push a duplicate into state.events');

  const historyItems = UpwardEngine.buildHistoryItems(state);
  assert.strictEqual(historyItems.length, 1, 'History must contain exactly 1 entry for 1 DSA solve');
  assert.strictEqual(historyItems[0].source, 'dsa');
  assert.strictEqual(historyItems[0].category, 'DSA');
  assert.strictEqual(historyItems[0].title, '3Sum (Medium)');
});

// ─── 5. CROSS-DOMAIN ISOLATION IN HISTORY ────────────────────────────────────

test('All domain logs aggregate cleanly in History without duplication', () => {
  const state = {
    events: [
      { id: 'e1', date: '2026-08-21', category: 'Projects', title: 'Refactored backend architecture', duration: 60 }
    ],
    dsaLog: [
      { id: 'd1', date: '2026-08-21', name: 'Course Schedule', difficulty: 'Medium', platform: 'LeetCode', topic: 'Graphs', independent: 'Yes' }
    ],
    commLog: [
      { id: 'c1', date: '2026-08-21', topic: 'Defending RAG Indexing', duration: 10, rating: 5, category: 'GenAI' }
    ],
    readingLog: [
      { id: 'r1', date: '2026-08-21', title: 'Designing Data-Intensive Applications', pagesOrMins: '30 mins', category: 'Book', status: 'Reading' }
    ],
    contests: [
      { id: 'ct1', date: '2026-08-21', platform: 'LeetCode', name: 'Biweekly Contest 137', solved: 3, attempted: 4, result: '+42' }
    ],
    hackathons: [],
    journalEntries: [
      { id: 'j1', date: '2026-08-21', learned: 'BM25 + Cross-Encoder is fast and accurate' }
    ],
    collegeItems: [
      { id: 'cl1', course: 'CS301', title: 'OS Lab Assignment', status: 'Completed', deadline: '2026-08-21' },
      { id: 'cl2', course: 'CS302', title: 'DBMS Exam', status: 'Planned', deadline: '2026-08-22' }
    ]
  };

  const history = UpwardEngine.buildHistoryItems(state);
  assert.strictEqual(history.length, 7, 'Should have exactly 7 distinct historical items (including completed college)');

  const sources = history.map(h => h.source);
  assert.deepStrictEqual(sources.sort(), ['college', 'comm', 'contest', 'dsa', 'event', 'journal', 'reading'].sort());
});

// ─── 6. HISTORY TIME FILTERING (INCLUDING YESTERDAY) ─────────────────────────

test('History filters work correctly for TODAY, YESTERDAY, WEEK, ALL, and Query', () => {
  const today = '2026-08-21';
  const yesterday = '2026-08-20';
  const lastWeek = '2026-08-15';
  const oldDate = '2025-12-01';

  const items = [
    { id: '1', date: today, category: 'DSA', title: 'Problem Today', notes: '' },
    { id: '2', date: yesterday, category: 'DSA', title: 'Problem Yesterday', notes: '' },
    { id: '3', date: lastWeek, category: 'ML', title: 'Training ResNet', notes: '' },
    { id: '4', date: oldDate, category: 'College', title: 'Semester Exam Prep', notes: '' }
  ];

  const refDate = new Date(2026, 7, 21); // 2026-08-21

  const todayFiltered = UpwardEngine.filterHistoryItems(items, 'TODAY', 'ALL', '', today, refDate);
  assert.strictEqual(todayFiltered.length, 1);
  assert.strictEqual(todayFiltered[0].id, '1');

  const yestFiltered = UpwardEngine.filterHistoryItems(items, 'YESTERDAY', 'ALL', '', today, refDate);
  assert.strictEqual(yestFiltered.length, 1);
  assert.strictEqual(yestFiltered[0].id, '2');

  const weekFiltered = UpwardEngine.filterHistoryItems(items, 'WEEK', 'ALL', '', today, refDate);
  assert.strictEqual(weekFiltered.length, 3, 'Today, yesterday, and 6-days-ago items belong in WEEK');

  const queryFiltered = UpwardEngine.filterHistoryItems(items, 'ALL', 'ALL', 'resnet', today, refDate);
  assert.strictEqual(queryFiltered.length, 1);
  assert.strictEqual(queryFiltered[0].title, 'Training ResNet');
});

// ─── 7. DERIVED METRICS ACCURACY ─────────────────────────────────────────────

test('calculateDerivedStats computes totals accurately from authoritative sources', () => {
  const state = {
    tasks: [
      { id: 't1', status: 'Completed', completedDate: '2026-08-21' },
      { id: 't2', status: 'Planned', date: '2026-08-21' }
    ],
    dsaLog: [
      { id: 'd1', name: 'Two Sum', independent: 'Yes', date: '2026-08-21' },
      { id: 'd2', name: '3Sum', independent: 'No', date: '2026-08-21' },
      { id: 'd3', name: '4Sum', independent: 'Yes', date: '2026-08-20' }
    ],
    events: [
      { id: 'e1', title: 'Project work', date: '2026-08-21' }
    ],
    journalEntries: []
  };

  const stats = UpwardEngine.calculateDerivedStats(state);
  assert.strictEqual(stats.totalTasks, 1, 'Only completed tasks counted');
  assert.strictEqual(stats.totalDsa, 3, 'All 3 DSA problems counted');
  assert.strictEqual(stats.independentDsa, 2, '2 independent solves counted');
  assert.strictEqual(stats.totalActivities, 1, '1 canonical activity counted');
  assert.strictEqual(stats.streak, 2, 'Streak across 2026-08-20 and 2026-08-21');
});

// ─── 8. BACKUP EXPORT, RESTORE & MIGRATION ───────────────────────────────────

test('exportStateToJson produces valid parseable backup with export metadata', () => {
  const state = {
    schemaVersion: 4,
    tasks: [{ id: 't1', title: 'Test Task', status: 'Planned' }],
    events: [],
    dsaLog: []
  };

  const jsonStr = UpwardEngine.exportStateToJson(state);
  const parsed = JSON.parse(jsonStr);
  assert(parsed._exportDate, 'Export must have _exportDate');
  assert(parsed._exportTimestamp, 'Export must have _exportTimestamp');
  assert.strictEqual(parsed.tasks[0].title, 'Test Task');
});

test('importStateFromJson validates schema and restores cleanly', () => {
  const defaultState = {
    schemaVersion: 4,
    tasks: [],
    events: [],
    dsaLog: [],
    collegeItems: []
  };

  const validJson = JSON.stringify({
    schemaVersion: 4,
    tasks: [{ id: 't100', title: 'Imported Task', status: 'Planned' }],
    events: [{ id: 'e100', title: 'Imported Event' }]
  });

  const restored = UpwardEngine.importStateFromJson(validJson, defaultState);
  assert.strictEqual(restored.tasks.length, 1);
  assert.strictEqual(restored.tasks[0].title, 'Imported Task');
  assert(Array.isArray(restored.collegeItems), 'Missing arrays must be migrated from defaultState');
});

test('importStateFromJson throws on invalid input', () => {
  const defaultState = { schemaVersion: 4, tasks: [], events: [] };
  assert.throws(() => UpwardEngine.importStateFromJson('{ invalid json', defaultState), /JSON parse error/);
  assert.throws(() => UpwardEngine.importStateFromJson(JSON.stringify({ otherData: 123 }), defaultState), /missing tasks or events/);
});

// ─── 9. EMPTY STATE HANDLING ─────────────────────────────────────────────────

test('Engine safely handles empty state without crashing', () => {
  const emptyState = {};
  const stats = UpwardEngine.calculateDerivedStats(emptyState);
  assert.strictEqual(stats.totalTasks, 0);
  assert.strictEqual(stats.totalDsa, 0);
  assert.strictEqual(stats.streak, 0);

  const history = UpwardEngine.buildHistoryItems(emptyState);
  assert.strictEqual(history.length, 0);
});

// ─── 10. CENTRALIZED ID GENERATION ───────────────────────────────────────────

test('generateId generates unique prefixes and values', () => {
  const id1 = UpwardEngine.generateId('task');
  const id2 = UpwardEngine.generateId('task');
  const id3 = UpwardEngine.generateId('evt');

  assert(id1.startsWith('task_'));
  assert(id3.startsWith('evt_'));
  assert.notStrictEqual(id1, id2, 'Sequential IDs must be unique');
});

// ─── SUMMARY ─────────────────────────────────────────────────────────────────

console.log('\n====================================================');
console.log(`  ALL ${passed}/${total} UNIT & REGRESSION TESTS PASSED SUCCESSFULLY!  `);
console.log('====================================================\n');
