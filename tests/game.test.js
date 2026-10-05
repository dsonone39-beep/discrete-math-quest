import test from "node:test";
import assert from "node:assert/strict";

// In-memory localStorage so the persistence layer can be tested in Node.
const mem = {};
globalThis.localStorage = {
  getItem: (k) => (k in mem ? mem[k] : null),
  setItem: (k, v) => { mem[k] = String(v); },
  removeItem: (k) => { delete mem[k]; }
};

const { default: G } = await import("../src/services/gameSystem.js");
const S = await import("../src/services/scoring.js");
const storage = await import("../src/services/storage.js");
const { GAMES, questionsFor, getGame } = await import("../src/games/registry.js");
const { checkAnswer, describeAnswer } = await import("../src/games/checkAnswer.js");
const GA = await import("../src/games/graph/graphAlgorithms.js");
const HU = await import("../src/games/hasse/hasseUtils.js");

test("registry: four games, unique ids, valid questions", () => {
  assert.deepEqual(GAMES.map((g) => g.id), ["logic", "graph", "hasse", "combinatorics"]);
  const seen = new Set();
  for (const g of GAMES) {
    for (const d of ["easy", "medium", "hard"]) assert.ok(questionsFor(g.id, d).length >= 4, `${g.id} ${d} needs >= 4 questions`);
    for (const q of g.questions) {
      const key = `${g.id}:${q.id}`;
      assert.ok(!seen.has(key), `duplicate id ${key}`); seen.add(key);
      assert.ok(["choice", "number", "path", "hasse"].includes(q.type), key);
      assert.ok(q.text && q.explanation && S.DIFFICULTY[q.difficulty], key);
      if (q.type === "choice") assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, key);
      if (q.type === "choice") assert.equal(new Set(q.options).size, q.options.length, `${key} options must be unique`);
    }
  }
  assert.equal(getGame("logic").questions.length, 20);
  assert.equal(getGame("combinatorics").questions.length, 18);
});

test("combinatorics: Member 3 known answers", () => {
  const ans = Object.fromEntries(getGame("combinatorics").questions.map((c) => [c.id, c.answer]));
  assert.deepEqual([ans.c01, ans.c08, ans.c13, ans.c14, ans.c17, ans.c18], [24, 30, 34650, 286, 74, 457]);
});

test("every question accepts its own correct answer and rejects a wrong one", () => {
  for (const g of GAMES) for (const q of g.questions) {
    if (q.type === "choice") {
      assert.ok(checkAnswer(q, q.answer).ok, q.id);
      assert.ok(!checkAnswer(q, (q.answer + 1) % q.options.length).ok, q.id);
    } else if (q.type === "number") {
      assert.ok(checkAnswer(q, q.answer).ok && !checkAnswer(q, q.answer + 1).ok, q.id);
    } else if (q.type === "path") {
      const good = q.mode === "bfs" ? GA.bfsOrder(q.graph, q.start)
        : q.mode === "dfs" ? GA.dfsOrder(q.graph, q.start)
        : q.mode === "shortest" ? GA.shortestPath(q.graph, q.start, q.end) : q.solution;
      assert.ok(checkAnswer(q, good).ok, q.id);
      assert.ok(!checkAnswer(q, [q.graph.nodes[0].id]).ok, q.id);
    } else if (q.type === "hasse") {
      const poset = HU.buildPoset(q.poset);
      const good = HU.coverPairs(poset);
      assert.ok(checkAnswer(q, good).ok, q.id);
      assert.ok(checkAnswer(q, good.map(([a, b]) => [b, a])).ok, `${q.id}: direction must not matter`);
      assert.ok(!checkAnswer(q, good.slice(1)).ok, q.id);
    }
    assert.ok(describeAnswer(q).length > 0, q.id);
  }
});

test("graph algorithms", () => {
  const q = (id) => getGame("graph").questions.find((x) => x.id === id);
  assert.deepEqual(GA.bfsOrder(q("g07").graph, "A"), ["A", "B", "C", "D", "E", "F"]);
  assert.deepEqual(GA.dfsOrder(q("g08").graph, "A"), ["A", "B", "D", "E", "F", "C"]);
  assert.equal(GA.shortestPath(q("g04").graph, "A", "E").length, 4);
  assert.deepEqual(GA.degrees(q("g02").graph), { A: 2, B: 2, C: 2, D: 3, E: 1 });
  const euler = q("g10");
  assert.ok(!GA.checkPath(euler.graph, euler, ["A", "B", "C", "A"]).ok, "must use every edge");
  assert.ok(!GA.checkPath(euler.graph, euler, ["A", "B", "C", "D", "E", "C", "B"]).ok, "reused edge / not a circuit");
  const ham = q("g12");
  assert.ok(!GA.checkPath(ham.graph, ham, ["A", "B", "C", "D", "E", "F"]).ok, "cycle must return to start");
  assert.ok(!GA.checkPath(ham.graph, ham, ["A", "C"]).ok, "A and C are not adjacent");
});

test("hasse utilities", () => {
  const p12 = HU.buildPoset({ order: "divides", elements: [1, 2, 3, 4, 6, 12] });
  assert.equal(HU.coverPairs(p12).length, 7);
  assert.equal(HU.buildPoset({ order: "divides", elements: [1, 2, 3, 5, 6, 10, 15, 30] }).ids.length, 8);
  const p30 = HU.buildPoset({ order: "divides", elements: [1, 2, 3, 5, 6, 10, 15, 30] });
  assert.equal(HU.coverPairs(p30).length, 12);
  assert.equal(HU.longestChainSize(p30), 4);
  assert.equal(HU.maxAntichainSize(p30), 3);
  assert.deepEqual(HU.minimalElements(HU.buildPoset({ order: "divides", elements: [2, 3, 4, 6, 12] })), ["2", "3"]);
  const wrong = HU.checkHasse(p12, [["1", "12"]]);
  assert.ok(!wrong.ok && wrong.hint.length > 0);
  const { pos } = HU.layoutPoset(p12);
  assert.ok(pos["1"].y > pos["12"].y, "minimal element drawn below maximal element");
});

test("score, xp, level (Member 3 formulas)", () => {
  assert.equal(S.calcScore({ difficulty: "easy", timeLeft: 90, timeLimit: 90 }).total, 150);
  assert.ok(S.calcScore({ difficulty: "easy", timeLeft: 0, timeLimit: 90, attemptsUsed: 3, hintUsed: true }).total < 100);
  assert.deepEqual([0, 50, 200].map(S.levelFromXP), [1, 2, 3]);
  assert.equal(S.timeLimitFor({ type: "choice", difficulty: "hard" }), 30);
  assert.equal(S.attemptsFor({ type: "choice", difficulty: "easy" }), 1);
  assert.equal(S.attemptsFor({ type: "number", difficulty: "easy" }), 3);
});

test("session flow: lives, unlocking, persistence, achievements, reset", () => {
  G.reset();
  const easy = questionsFor("combinatorics", "easy");
  const session = G.createSession("combinatorics", "easy", easy.length);
  assert.equal(G.isUnlocked("combinatorics", "medium"), false);
  assert.equal(G.isUnlocked("logic", "easy"), true);
  easy.slice(0, 4).forEach((c) => G.recordSolve(session, c, { timeLeft: 80, attemptsUsed: 1, hintUsed: false }));
  assert.equal(G.isUnlocked("combinatorics", "medium"), true);
  assert.ok(G.getState().achievements.first_solve && G.getState().achievements.speed);
  assert.ok(G.getState().xp > 0 && G.totalScore() > 0);
  G.loseLife(session); G.loseLife(session); G.loseLife(session);
  assert.ok(session.over && session.lives === 0);
  const summary = G.endSession(session);
  assert.equal(summary.solved, 4);
  assert.equal(summary.answered, 7);
  assert.ok(summary.achievements.some((a) => a.id === "first_solve"));
  G.reloadFromStorage();
  assert.equal(G.solvedBy("combinatorics", "easy"), 4);
  assert.equal(G.progress("combinatorics").solved, 4);
  G.reset();
  assert.equal(G.getState().xp, 0);
  assert.equal(G.overallProgress().solved, 0);
});

test("replay gives reduced XP; completionist needs everything", () => {
  G.reset();
  const q = questionsFor("logic", "easy")[0];
  const s1 = G.createSession("logic", "easy", 1);
  const first = G.recordSolve(s1, q, { timeLeft: 20, timeLimit: 30, attemptsUsed: 1 });
  const s2 = G.createSession("logic", "easy", 1);
  const again = G.recordSolve(s2, q, { timeLeft: 20, timeLimit: 30, attemptsUsed: 1 });
  assert.ok(again.xpGain < first.xpGain);
  assert.ok(!G.getState().achievements.completionist);
  GAMES.forEach((g) => {
    const s = G.createSession(g.id, "easy", g.questions.length);
    g.questions.forEach((x) => G.recordSolve(s, x, { timeLeft: 10, timeLimit: 30 }));
  });
  assert.ok(G.getState().achievements.completionist && G.getState().achievements.explorer);
  assert.equal(G.overallProgress().pct, 100);
  G.reset();
});

test("storage: corrupt data, unknown version and v1 import", () => {
  storage.clear();
  mem[storage.KEY] = "{not json";
  assert.equal(storage.load(), null);
  mem[storage.KEY] = JSON.stringify({ version: 99, data: { xp: 5 } });
  assert.equal(storage.load(), null);
  delete mem[storage.KEY];
  mem[storage.LEGACY_KEY] = JSON.stringify({ xp: 120, games: {} });
  assert.equal(storage.load().xp, 120);
  storage.clear();
  assert.ok(storage.save({ xp: 7 }));
  assert.equal(storage.load().xp, 7);
  storage.clear();
});
