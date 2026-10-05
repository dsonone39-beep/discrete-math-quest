# Architecture

```
USER INTERFACE        src/pages/        Home, GameSelection, GameLobby, GamePlay, Result, Achievements, Instructions
                      src/components/   Navbar, ErrorBoundary, Toast
                                        |
GAME MODULES          src/games/logic/          Logic & Truth Dungeon         (Modus Ponens, Tollens, Resolution)
                      src/games/graph/          Graph Theory Pathfinder       (BFS, DFS, Eulerian, Hamiltonian)
                      src/games/hasse/          Hasse Diagram Builder         (React Flow posets)
                      src/games/combinatorics/  Combinatorics Strategy Game   (Pigeonhole, Inclusion-Exclusion, Permutations)
                                        |
COMMON DATA & SERVICES  question banks: logicQuestions.js, graphQuestions.js, hasseQuestions.js, combinatoricsQuestions.js
                        src/games/registry.js, checkAnswer.js
                        src/services/scoring.js, gameSystem.js, achievements.js
                        src/components/Timer.jsx, Lives.jsx, Progress.jsx, Score.jsx, QuizRunner.jsx, answers/*
                                        |
PERSISTENCE LAYER     src/services/storage.js  <-->  LocalStorage
```

## How a run works
1. `GameSelection` → `GameLobby` (difficulty + locks) → `GamePlay` (`/games/:gameId/play/:difficulty`).
2. `GamePlay` renders the game module (`LogicGame`, `GraphGame`, ...). Each is a thin wrapper around `QuizRunner`.
3. `QuizRunner` owns the loop: countdown (`useCountdown`), lives, attempts, hints, score, XP and the toast messages. For each question it picks an answer widget by `question.type`.
4. `checkAnswer.js` grades the answer. `gameSystem.js` records the result and saves it through `storage.js`.
5. At the end `endSession()` returns a summary and the app navigates to `/result`.

## Adding a new game or question
- New question: add it to the game's question file (unique id, correct `type` and `difficulty`), then `npm test` and `npm run docs`.
- New game: add its question file, an entry in `registry.js`, a wrapper component and a line in `games/components.js`. Achievements, progress and the lobby pick it up automatically.
