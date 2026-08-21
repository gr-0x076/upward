# Upward · Personal Execution Database

A local-first personal execution tracker. Log what you actually do, not what you planned to do.

**Philosophy:** PLAN → DO → LOG → REVIEW

No AI coach. No recommendations. No gamification. Just an accurate database of your work.

---

## Features

| Section | Purpose |
|---|---|
| **Overview** | Quick stats — streak, DSA count, tasks done, recent logged work |
| **Today** | Today's pending tasks |
| **Tasks** | Full task manager — add, complete, delete, filter |
| **Daily Log & Journal** | Freeform log entries + daily retrospective journal |
| **History** | Full chronological log of everything — filterable by TODAY / YESTERDAY / WEEK / ALL |
| **Calendar** | Month view with dots per day; click any day to see its activities |
| **DSA Tracker** | Log solved problems with platform, topic, difficulty, notes |
| **Implementation Lab** | Track algorithm implementations through understand → code → test → review stages |
| **CS Fundamentals** | Checklist for core CS topics |
| **Machine Learning** | ML topic checklist with stage-by-stage progress |
| **Deep Learning** | DL topic checklist |
| **GenAI / RAG** | GenAI topic checklist |
| **Backend & DevOps** | Backend engineering topic checklist |
| **Projects** | Track your projects with status, links, and notes |
| **Open Source** | Log OSS contributions |
| **Communication** | Log speaking / explanation practice sessions |
| **Reading** | Log books and articles |
| **Contests & Hackathons** | Log competitive programming and hackathon results |
| **Applications** | Job / internship application tracker |
| **Scoreboard** | Goal progress vs targets |
| **College** | Course assignments and deadlines |
| **Backup & Data** | JSON export/import, CSV exports, factory reset |

---

## Running Locally

No build step. Open `index.html` directly or serve with any static server:

```bash
python -m http.server 8080
# → http://localhost:8080
```

Or with Node:

```bash
npx serve .
# → http://localhost:3000
```

---

## Data

All data is stored in **`localStorage`** under the key `upward_state`. Nothing is sent to any server.

Use **Backup & Data → Export Full JSON Backup** to save your data before clearing browser storage.

---

## Architecture

```
index.html      ← Structure & all view HTML
styles.css      ← All styling (dark theme, CSS variables)
engine.js       ← Pure functions: state migration, ID generation, history aggregation,
                   streaks, stats, export/import (loaded first)
app.js          ← UI layer: render functions, event listeners, modal logic
test_engine.js  ← 14 unit/regression tests (run with: node test_engine.js)
```

Engine functions are available globally as `window.UpwardEngine` and are shared between the browser app and the Node.js test suite.

---

## Tests

```bash
node test_engine.js
# → 14/14 PASS
```

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Framework preset: **Other** (static)
4. No build command, output directory: `.`

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # select your project, set public dir to "."
firebase deploy
```

---

## License

MIT — personal use.
