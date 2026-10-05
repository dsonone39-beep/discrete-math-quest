// Data-only registry of the four games (no React here, so services and Node tests can import it).
import { logicQuestions } from "./logic/logicQuestions.js";
import { graphQuestions } from "./graph/graphQuestions.js";
import { hasseQuestions } from "./hasse/hasseQuestions.js";
import { combinatoricsQuestions } from "./combinatorics/combinatoricsQuestions.js";

// Member 1's logic questions keep their own file; levels 1-2 => easy, 3-5 => medium, 6 => hard.
const logicDifficulty = (level) => (level <= 2 ? "easy" : level <= 5 ? "medium" : "hard");

const logic = logicQuestions.map((q) => ({
  ...q,
  id: `l${String(q.id).padStart(2, "0")}`,
  type: "choice",
  text: q.question,
  difficulty: logicDifficulty(q.level)
}));

// Member 3's challenges already use { id, topic, difficulty, text, answer, hint, explanation }.
const combinatorics = combinatoricsQuestions.map((q) => ({ ...q, type: "number" }));

export const GAMES = [
  { id: "logic", title: "Logic & Truth Dungeon", shortTitle: "Logic", icon: "🧠",
    description: "Propositional logic, truth tables, Modus Ponens, Modus Tollens and Resolution.",
    owner: "Member 1", color: "#A68DFF", tint: "#E7E0FF", questions: logic },
  { id: "graph", title: "Graph Theory Pathfinder", shortTitle: "Graph", icon: "🔵",
    description: "Degrees, BFS, DFS, shortest paths, Eulerian and Hamiltonian paths on interactive graphs.",
    owner: "Member 2", color: "#2EC4B6", tint: "#D3F5F1", questions: graphQuestions },
  { id: "hasse", title: "Hasse Diagram Builder", shortTitle: "Hasse", icon: "📊",
    description: "Partial orders, cover relations and drawing Hasse diagrams with React Flow.",
    owner: "Member 2", color: "#FF9F55", tint: "#FFE6D2", questions: hasseQuestions },
  { id: "combinatorics", title: "Combinatorics Strategy Game", shortTitle: "Combinatorics", icon: "🔢",
    description: "Counting, permutations, combinations, pigeonhole and inclusion-exclusion.",
    owner: "Member 3", color: "#FF7EB0", tint: "#FFDCEA", questions: combinatorics }
];

export const getGame = (id) => GAMES.find((g) => g.id === id) ?? null;
export const questionsFor = (gameId, difficulty) =>
  (getGame(gameId)?.questions ?? []).filter((q) => !difficulty || q.difficulty === difficulty);
