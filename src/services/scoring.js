// Common scoring rules shared by every game (Member 3 formulas, see docs/GAME_SYSTEM_API.md).
export const DIFFICULTY = {
  easy:   { label: "Easy",   base: 100, time: 90, attempts: 3, xpBonus: 5,  unlock: null },
  medium: { label: "Medium", base: 200, time: 75, attempts: 2, xpBonus: 10, unlock: { from: "easy" } },
  hard:   { label: "Hard",   base: 300, time: 60, attempts: 2, xpBonus: 20, unlock: { from: "medium" } }
};
export const DIFFICULTY_ORDER = ["easy", "medium", "hard"];

export const LIVES = 3;
export const HINT_PENALTY = 0.2;     // share of base score lost for using a hint
export const ATTEMPT_PENALTY = 0.25; // share of base score lost per extra attempt
export const STREAK_BONUS = 0.1;     // +10% per streak step, capped at +50%
export const REPLAY_XP_RATE = 0.25;  // XP multiplier when re-solving a solved challenge
export const CHOICE_TIME = 30;       // seconds for multiple-choice questions (Member 1 rule)

/** Seconds allowed for a question. Multiple choice is quick; building/drawing gets more time. */
export function timeLimitFor(question) {
  if (question.timeLimit) return question.timeLimit;
  const cfg = DIFFICULTY[question.difficulty];
  if (question.type === "choice") return CHOICE_TIME;
  if (question.type === "hasse") return cfg.time + 30;
  return cfg.time;
}

/** Multiple choice allows one attempt (otherwise it can be guessed); other types use the difficulty rule. */
export function attemptsFor(question) {
  return question.type === "choice" ? 1 : DIFFICULTY[question.difficulty].attempts;
}

export function calcScore({ difficulty, timeLeft, timeLimit, attemptsUsed = 1, hintUsed = false, streak = 0 }) {
  const base = DIFFICULTY[difficulty].base;
  const timeBonus = Math.round(base * 0.5 * Math.max(0, Math.min(1, timeLeft / timeLimit)));
  const penalty = Math.round(base * (ATTEMPT_PENALTY * (attemptsUsed - 1) + (hintUsed ? HINT_PENALTY : 0)));
  const subtotal = Math.max(10, base + timeBonus - penalty);
  const streakMult = 1 + Math.min(0.5, STREAK_BONUS * streak);
  return { base, timeBonus, penalty, streakMult, total: Math.round(subtotal * streakMult) };
}

export const calcXP = (score, difficulty) => Math.round(score / 10) + DIFFICULTY[difficulty].xpBonus;
export const calcStars = (attemptsUsed, hintUsed) =>
  attemptsUsed === 1 && !hintUsed ? 3 : attemptsUsed === 1 || !hintUsed ? 2 : 1;

export const xpForLevel = (level) => 50 * (level - 1) * (level - 1); // XP needed to reach `level`
export const levelFromXP = (xp) => Math.floor(Math.sqrt(xp / 50)) + 1;

export function levelProgress(xp) {
  const level = levelFromXP(xp);
  const cur = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return { level, xp, into: xp - cur, needed: next - cur, pct: Math.round(((xp - cur) / (next - cur)) * 100) };
}
