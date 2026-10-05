# Common Game System (`src/services/`)

Shared by all four games. Member 3's original design, ported from `window.MQ` globals to ES modules.

| File | Role |
|---|---|
| `scoring.js` | Pure formulas and constants: score, XP, level, stars, time limit and attempts per question. |
| `storage.js` | Persistence layer: versioned LocalStorage (`mathquest.v2`), safe on corrupt data, imports Member 3's old `mathquest.v1` save. |
| `achievements.js` | Achievement definitions for every game. |
| `gameSystem.js` | State, sessions, lives, unlocking, progress. Default export `gs`. |

## `gs` API (`import gs from "../services/gameSystem.js"`)

| Function | Purpose |
|---|---|
| `createSession(gameId, difficulty, total)` | New run with 3 lives, score 0, streak 0. |
| `loseLife(session)` | Remove a life, reset streak, set `session.over` at 0 lives. |
| `recordSolve(session, question, {timeLeft, timeLimit, attemptsUsed, hintUsed})` | Calculates score and XP, saves progress, checks achievements. Returns `{score, xpGain, stars, levelUp, achievements}`. |
| `endSession(session)` | Counts the run, flags flawless runs, returns the summary the Result page shows. |
| `levelInfo()` / `totalScore()` | `{level, xp, into, needed, pct}` and the sum of best scores. |
| `isUnlocked(gameId, difficulty)` / `unlockText(...)` / `unlockRequirement(...)` | Level unlocking. |
| `progress(gameId)` / `overallProgress()` | `{solved, total, pct}`. |
| `solvedBy(gameId, difficulty)` / `isSolved(gameId, id)` | Counters. |
| `listAchievements()` | All achievements with an `unlocked` flag. |
| `subscribe(fn)` / `getSnapshot()` | Used by `useGameState()` (React `useSyncExternalStore`). |
| `reset()` / `reloadFromStorage()` | Clear all progress / re-read storage. |

## Formulas
- **Score** = (base + timeBonus − penalties) × streakMultiplier
  - base: Easy 100, Medium 200, Hard 300
  - timeBonus = 50% of base × (timeLeft / timeLimit)
  - penalties = 25% of base per extra attempt + 20% of base if a hint was used (minimum 10)
  - streakMultiplier = 1 + 10% per correct answer in a row, capped at +50%
- **XP** = score / 10 (rounded) + difficulty bonus (5 / 10 / 20). Re-solving a challenge gives 25% XP.
- **Level** = floor(√(XP / 50)) + 1 (XP to reach level L is 50·(L−1)²).
- **Stars**: 3 = first try without hint, 2 = first try or no hint, 1 = otherwise.
- **Lives**: 3 per run. A life is lost when time runs out or all attempts are used.
- **Time per question**: multiple choice 30 s; number and graph questions 90 / 75 / 60 s (Easy / Medium / Hard); Hasse questions +30 s.
- **Attempts**: multiple choice 1; other types 3 / 2 / 2 (Easy / Medium / Hard).
- **Unlocking**: Medium needs min(4, easy − 1) Easy challenges solved; Hard needs min(4, medium − 1) Medium challenges solved.

## Question format (`src/games/registry.js`)
Every question has `id` (unique per game), `type`, `difficulty`, `topic`, `text`, `explanation` and optionally `hint`.

| `type` | Extra fields | Answer widget | Checked by |
|---|---|---|---|
| `choice` | `options[]`, `answer` (index), optional `graph` or `poset` picture | `ChoiceAnswer` | `checkAnswer.js` |
| `number` | `answer` (number) | `NumberAnswer` | `checkAnswer.js` |
| `path` | `graph`, `mode` (`bfs` `dfs` `shortest` `euler` `hamilton`), `start`, `end`, `circuit` / `cycle`, `solution` | `PathAnswer` | `graphAlgorithms.js` |
| `hasse` | `poset` (`divides`, `subset` or `pairs`) | `HasseAnswer` (React Flow) | `hasseUtils.js` |

## Saved data (`localStorage["mathquest.v2"]`)
`{ version: 2, savedAt, data: { xp, achievements: {id: timestamp}, stats: {solved, bestStreak, fastSolves, sessions, flawless}, games: { <gameId>: { solved: { <questionId>: {difficulty, topic, bestScore, stars, at} } } } } }`
