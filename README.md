# Discrete Math Quest (MathQuest)

One gamified React app that merges the three members' work:
- **Logic & Truth Dungeon** (Member 1): AND, OR, NOT, implication, truth tables, Modus Ponens, Modus Tollens, Resolution.
- **Graph Theory Pathfinder**: BFS, DFS, shortest paths, Eulerian and Hamiltonian paths, clickable graphs.
- **Hasse Diagram Builder**: partial orders and cover relations, drawn with React Flow.
- **Combinatorics Strategy Game** (Member 3): counting, permutations, combinations, pigeonhole, inclusion-exclusion.
- **Common game system**: score, XP and levels, lives, timers, hints, level unlocking, progress, achievements, LocalStorage.

67 challenges, three difficulty levels per game. See `docs/MERGE_NOTES.md` for who wrote what.

## Run it
```bash
npm install     # also creates package-lock.json
npm run dev     # open the address Vite prints
npm test        # 9 logic tests (Node 18+)
npm run docs    # regenerates docs/CHALLENGES.md
npm run build   # production build in dist/
```

## Structure
```
src/
  components/   Navbar, QuizRunner, Timer, Lives, Score, Progress, Toast, ErrorBoundary, GraphView, HasseDiagram, answers/*
  pages/        Home, GameSelection, GameLobby, GamePlay, Result, Achievements, Instructions
  games/        registry.js, checkAnswer.js, logic/, graph/, hasse/, combinatorics/
  services/     scoring.js, gameSystem.js, achievements.js, storage.js
  hooks/        useCountdown.js, useGameState.js
docs/           ARCHITECTURE.md, GAME_SYSTEM_API.md, MERGE_NOTES.md, CHALLENGES.md
tests/          game.test.js
```

## How to play
Choose a game and a difficulty. You have 3 lives per run. Multiple-choice questions allow one attempt and 30 seconds; number, graph and Hasse questions allow 2 to 3 attempts. Faster, first-try answers and streaks score more; hints cost 20%. Medium and Hard unlock as you solve earlier challenges.
