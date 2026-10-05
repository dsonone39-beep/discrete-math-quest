// Common game system (Member 3), shared by all four games: score, XP, lives, unlocking, progress, achievements.
// State lives in one object persisted through storage.js; React reads it with subscribe/getSnapshot.
import { DIFFICULTY, LIVES, REPLAY_XP_RATE, calcScore, calcXP, calcStars, levelFromXP, levelProgress, xpForLevel, timeLimitFor } from "./scoring.js";
import * as storage from "./storage.js";
import { ACHIEVEMENTS } from "./achievements.js";
import { GAMES, getGame, questionsFor } from "../games/registry.js";

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

const defaultState = () => ({
  xp: 0,
  achievements: {}, // id -> unlock timestamp
  stats: { solved: 0, bestStreak: 0, fastSolves: 0, sessions: 0, flawless: {} },
  games: {}         // gameId -> { solved: { questionId: { difficulty, topic, bestScore, stars, at } } }
});

function hydrate(saved) {
  const base = defaultState();
  if (!isObj(saved)) return base;
  const stats = isObj(saved.stats) ? saved.stats : {};
  return {
    xp: Number.isFinite(saved.xp) ? saved.xp : 0,
    achievements: isObj(saved.achievements) ? saved.achievements : {},
    stats: { ...base.stats, ...stats, flawless: isObj(stats.flawless) ? stats.flawless : {} },
    games: isObj(saved.games) ? saved.games : {}
  };
}

let state = hydrate(storage.load());
let snapshot = { ...state };
const listeners = new Set();

function commit() {
  storage.save(state);
  snapshot = { ...state };
  listeners.forEach((fn) => fn());
}
const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const getSnapshot = () => snapshot;
const getState = () => state;

function reloadFromStorage() { state = hydrate(storage.load()); snapshot = { ...state }; listeners.forEach((fn) => fn()); }
function reset() { state = defaultState(); storage.clear(); snapshot = { ...state }; listeners.forEach((fn) => fn()); }

const solvedMap = (gameId) => (isObj(state.games[gameId]?.solved) ? state.games[gameId].solved : {});
function gameRecord(gameId) {
  if (!isObj(state.games[gameId]) || !isObj(state.games[gameId].solved)) state.games[gameId] = { solved: {} };
  return state.games[gameId];
}

// ---- Level / totals --------------------------------------------------------------------------
const levelInfo = () => levelProgress(state.xp);
const totalScore = () =>
  Object.values(state.games).reduce((sum, g) => sum + Object.values(g?.solved ?? {}).reduce((s, r) => s + (r.bestScore || 0), 0), 0);

// ---- Progress / unlocking ----------------------------------------------------------------------
const isSolved = (gameId, questionId) => !!solvedMap(gameId)[questionId];
const solvedBy = (gameId, difficulty) => questionsFor(gameId, difficulty).filter((q) => isSolved(gameId, q.id)).length;

function progress(gameId) {
  const list = questionsFor(gameId);
  const solved = list.filter((q) => isSolved(gameId, q.id)).length;
  return { solved, total: list.length, pct: list.length ? Math.round((solved / list.length) * 100) : 0 };
}
function overallProgress() {
  const parts = GAMES.map((g) => progress(g.id));
  const solved = parts.reduce((s, p) => s + p.solved, 0);
  const total = parts.reduce((s, p) => s + p.total, 0);
  return { solved, total, pct: total ? Math.round((solved / total) * 100) : 0 };
}

/** How many challenges of the previous tier must be solved (up to 4, always leaving one spare). */
function unlockRequirement(gameId, difficulty) {
  const rule = DIFFICULTY[difficulty].unlock;
  if (!rule) return 0;
  return Math.min(4, Math.max(0, questionsFor(gameId, rule.from).length - 1));
}
function isUnlocked(gameId, difficulty) {
  const rule = DIFFICULTY[difficulty].unlock;
  return !rule || solvedBy(gameId, rule.from) >= unlockRequirement(gameId, difficulty);
}
function unlockText(gameId, difficulty) {
  const rule = DIFFICULTY[difficulty].unlock;
  return rule ? `Solve ${unlockRequirement(gameId, difficulty)} ${DIFFICULTY[rule.from].label} challenges to unlock` : "";
}

// ---- Achievements ----------------------------------------------------------------------------------
function checkAchievements(ctx = {}) {
  const fresh = [];
  ACHIEVEMENTS.forEach((a) => {
    if (!state.achievements[a.id] && a.check(state, ctx, api)) {
      state.achievements[a.id] = Date.now();
      fresh.push({ id: a.id, title: a.title, icon: a.icon });
    }
  });
  if (ctx.session) ctx.session.newAchievements.push(...fresh);
  return fresh;
}
const listAchievements = () => ACHIEVEMENTS.map((a) => ({ id: a.id, icon: a.icon, title: a.title, desc: a.desc, unlocked: !!state.achievements[a.id] }));

// ---- Sessions (one run of one game at one difficulty) ------------------------------------------------
function createSession(gameId, difficulty, total) {
  return { gameId, difficulty, total, lives: LIVES, score: 0, xp: 0, streak: 0, bestStreak: 0,
           solved: 0, answered: 0, livesLost: 0, over: false, finished: false,
           levelStart: levelFromXP(state.xp), newAchievements: [] };
}

function loseLife(session) {
  session.lives = Math.max(0, session.lives - 1);
  session.livesLost += 1;
  session.answered += 1;
  session.streak = 0;
  if (session.lives === 0) session.over = true;
  return session.lives;
}

function recordSolve(session, question, { timeLeft, timeLimit = timeLimitFor(question), attemptsUsed = 1, hintUsed = false }) {
  session.streak += 1;
  session.bestStreak = Math.max(session.bestStreak, session.streak);
  const score = calcScore({ difficulty: question.difficulty, timeLeft, timeLimit, attemptsUsed, hintUsed, streak: session.streak - 1 });
  const rec = gameRecord(session.gameId);
  const prev = rec.solved[question.id];
  const levelBefore = levelFromXP(state.xp);
  const fullXP = calcXP(score.total, question.difficulty);
  const xpGain = prev ? Math.round(fullXP * REPLAY_XP_RATE) : fullXP;
  const stars = calcStars(attemptsUsed, hintUsed);

  rec.solved[question.id] = {
    difficulty: question.difficulty, topic: question.topic,
    bestScore: Math.max(score.total, prev ? prev.bestScore : 0),
    stars: Math.max(stars, prev ? prev.stars : 0), at: Date.now()
  };
  state.xp += xpGain;
  state.stats.solved += 1;
  state.stats.bestStreak = Math.max(state.stats.bestStreak, session.bestStreak);
  if (timeLeft / timeLimit >= 0.8) state.stats.fastSolves += 1;
  session.score += score.total; session.xp += xpGain; session.solved += 1; session.answered += 1;

  const levelAfter = levelFromXP(state.xp);
  const achievements = checkAchievements({ session, question });
  commit();
  return { score, xpGain, stars, levelUp: levelAfter > levelBefore ? levelAfter : null, achievements };
}

/** Ends a run, saves it and returns the summary shown on the Result page. */
function endSession(session) {
  session.finished = true;
  state.stats.sessions += 1;
  const flawless = session.solved === session.total && session.livesLost === 0;
  if (flawless) state.stats.flawless[`${session.gameId}:${session.difficulty}`] = true;
  checkAchievements({ session, ended: true });
  commit();
  return {
    gameId: session.gameId, difficulty: session.difficulty,
    score: session.score, xp: session.xp, solved: session.solved, answered: session.answered, total: session.total,
    accuracy: session.answered ? Math.round((session.solved / session.answered) * 100) : 0,
    bestStreak: session.bestStreak, livesLost: session.livesLost, over: session.over, flawless,
    levelBefore: session.levelStart, levelAfter: levelFromXP(state.xp),
    achievements: session.newAchievements
  };
}

const api = {
  DIFFICULTY, LIVES, GAMES, getGame, questionsFor,
  subscribe, getSnapshot, getState, reloadFromStorage, reset,
  calcScore, calcXP, calcStars, xpForLevel, levelFromXP, levelInfo, totalScore,
  createSession, loseLife, recordSolve, endSession,
  isSolved, solvedBy, progress, overallProgress, isUnlocked, unlockText, unlockRequirement,
  checkAchievements, listAchievements
};
export default api;
