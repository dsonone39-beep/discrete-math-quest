// Achievement definitions for all games. check(state, ctx, api) runs after every solve and at the end of a run.
import { GAMES } from "../games/registry.js";

const solvedIds = (state, gameId) => Object.keys(state.games[gameId]?.solved ?? {});
const solvedAll = (state, game, difficulty) => {
  const list = game.questions.filter((q) => !difficulty || q.difficulty === difficulty);
  return list.length > 0 && list.every((q) => solvedIds(state, game.id).includes(q.id));
};

export const ACHIEVEMENTS = [
  { id: "first_solve", icon: "1", title: "First step", desc: "Solve your first challenge.",
    check: (s) => s.stats.solved >= 1 },
  { id: "streak_5", icon: "5", title: "On a roll", desc: "Get 5 correct answers in a row in one run.",
    check: (s) => s.stats.bestStreak >= 5 },
  { id: "speed", icon: "⚡", title: "Quick thinker", desc: "Solve a challenge with 80% of the time left.",
    check: (s) => s.stats.fastSolves >= 1 },
  { id: "flawless", icon: "♥", title: "Flawless run", desc: "Finish a whole run without losing a life.",
    check: (s) => Object.values(s.stats.flawless).some(Boolean) },
  { id: "explorer", icon: "🧭", title: "Explorer", desc: "Solve at least one challenge in every game.",
    check: (s) => GAMES.every((g) => solvedIds(s, g.id).length > 0) },
  ...GAMES.map((g) => ({
    id: `master_${g.id}`, icon: g.icon, title: `${g.shortTitle} master`, desc: `Solve every ${g.shortTitle} challenge.`,
    check: (s) => solvedAll(s, g)
  })),
  { id: "hard_cleared", icon: "★", title: "Hard mode cleared", desc: "Solve all Hard challenges of one game.",
    check: (s) => GAMES.some((g) => solvedAll(s, g, "hard")) },
  { id: "level_5", icon: "L5", title: "Level 5", desc: "Reach player level 5.",
    check: (s, ctx, api) => api.levelFromXP(s.xp) >= 5 },
  { id: "completionist", icon: "🏆", title: "Completionist", desc: "Solve every challenge in every game.",
    check: (s) => GAMES.every((g) => solvedAll(s, g)) }
];
