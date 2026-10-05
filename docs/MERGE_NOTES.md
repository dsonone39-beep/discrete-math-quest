# Merge notes

## What came from whom
| Part | Source | Change made while merging |
|---|---|---|
| Home, Navbar, GameSelection, Instructions, Result, styles | Member 1 | Result now works for any game; GameSelection is driven by the registry; Navbar shows level and XP; CSS extended, not replaced. |
| Logic & Truth Dungeon, 20 questions | Member 1 | `logicQuestions.js` is **unchanged**. The game loop moved into the shared `QuizRunner`; levels 1-2 map to Easy, 3-5 to Medium, 6 to Hard. |
| Timer, Lives, Score, Progress | Member 1 | Lives shows lost hearts; Timer can turn red; Progress takes a label. |
| Common game system, storage, achievements, scoring | Member 3 | Converted from `window.MQ` globals to ES modules; formulas unchanged. Storage is versioned (v2) and imports the old v1 save. |
| Combinatorics game, 18 challenges, mathUtils | Member 3 | Same challenges and computed answers; the UI is now React (typed-number widget). |
| Graph Theory Pathfinder | written during the merge | Member 2's `GraphGame.jsx` and `graphQuestions.js` arrived empty (0 bytes), so this module is new: 15 questions plus BFS, DFS, shortest-path, Eulerian and Hamiltonian checkers. |
| Hasse Diagram Builder | written during the merge | No Hasse files were received: 14 questions, a React Flow editor and the poset utilities are new. |

If Member 2 has real graph or Hasse code, replace the question files and keep the question format in `GAME_SYSTEM_API.md`.

## Extra requirements added
- React Router flow with lobby pages and difficulty locks; `/logic` redirects to `/games/logic`.
- One scoring, XP, level and achievements system for all games (replaces Member 1's flat 10 points).
- Versioned LocalStorage with safe reset; error boundary around every game; pause/resume that hides the question.
- Per-question attempts, hints, streak bonus and time rules by question type.
- Achievements page, per-game progress, "Try next difficulty" on the result page.
- Automated tests (`npm test`) and generated challenge list (`npm run docs`).

## Differences you may notice
- Member 3's standalone page (`index.html` with global scripts) is replaced by the React app; its logic lives in `src/services` and `src/games/combinatorics`.
- Member 1's `package.json` listed `vite` under dependencies and had no React plugin. It is now a dev dependency with `@vitejs/plugin-react`.
- `package-lock.json` is not included: run `npm install` once to create it, then commit it.
