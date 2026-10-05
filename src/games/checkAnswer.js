// One place that knows how to grade each question type and how to describe the correct answer.
import { checkPath, bfsOrder, dfsOrder, shortestPath } from "./graph/graphAlgorithms.js";
import { buildPoset, checkHasse, coverPairs, labelOf } from "./hasse/hasseUtils.js";

/** Returns { ok, hint? }. `value` depends on type: option index, number, vertex list or edge pairs. */
export function checkAnswer(q, value) {
  switch (q.type) {
    case "choice": return { ok: value === q.answer };
    case "number": return { ok: Number(value) === q.answer };
    case "path":   return checkPath(q.graph, q, value);
    case "hasse":  return checkHasse(buildPoset(q.poset), value);
    default:       return { ok: false };
  }
}

/** Human-readable correct answer, shown after a failed question. */
export function describeAnswer(q) {
  switch (q.type) {
    case "choice": return q.options[q.answer];
    case "number": return q.answer.toLocaleString("en-US");
    case "path":
      if (q.mode === "bfs") return bfsOrder(q.graph, q.start).join(" → ");
      if (q.mode === "dfs") return dfsOrder(q.graph, q.start).join(" → ");
      if (q.mode === "shortest") return shortestPath(q.graph, q.start, q.end).join(" → ");
      return q.solution.join(" → ");
    case "hasse": {
      const poset = buildPoset(q.poset);
      return coverPairs(poset).map(([a, b]) => `${labelOf(poset, a)}–${labelOf(poset, b)}`).join(", ");
    }
    default: return "";
  }
}
