// Graph Theory Pathfinder: algorithms and answer checking (BFS, DFS, shortest, Eulerian, Hamiltonian).
// A graph is { nodes: [{id, x, y}], edges: [[a, b], ...] } (undirected, simple).

export function adjacency(graph) {
  const adj = {};
  graph.nodes.forEach((n) => { adj[n.id] = []; });
  graph.edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  Object.values(adj).forEach((list) => list.sort());
  return adj;
}

export const hasEdge = (graph, a, b) =>
  graph.edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

export const edgeKey = (a, b) => [a, b].sort().join("-");

export function degrees(graph) {
  const adj = adjacency(graph);
  return Object.fromEntries(Object.entries(adj).map(([id, list]) => [id, list.length]));
}

/** Breadth-first visiting order; neighbours are taken in alphabetical order. */
export function bfsOrder(graph, start) {
  const adj = adjacency(graph);
  const seen = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length) {
    const v = queue.shift();
    order.push(v);
    adj[v].forEach((w) => { if (!seen.has(w)) { seen.add(w); queue.push(w); } });
  }
  return order;
}

/** Depth-first visiting order; neighbours are taken in alphabetical order. */
export function dfsOrder(graph, start) {
  const adj = adjacency(graph);
  const seen = new Set();
  const order = [];
  const visit = (v) => {
    seen.add(v);
    order.push(v);
    adj[v].forEach((w) => { if (!seen.has(w)) visit(w); });
  };
  visit(start);
  return order;
}

/** One shortest path from s to t (fewest edges), or null. */
export function shortestPath(graph, s, t) {
  const adj = adjacency(graph);
  const parent = { [s]: null };
  const queue = [s];
  while (queue.length) {
    const v = queue.shift();
    if (v === t) break;
    adj[v].forEach((w) => { if (!(w in parent)) { parent[w] = v; queue.push(w); } });
  }
  if (!(t in parent)) return null;
  const path = [];
  for (let v = t; v !== null; v = parent[v]) path.unshift(v);
  return path;
}

function brokenLink(graph, seq) {
  for (let i = 0; i < seq.length - 1; i++) {
    if (!hasEdge(graph, seq[i], seq[i + 1])) return `${seq[i]} and ${seq[i + 1]} are not joined by an edge.`;
  }
  return null;
}

function compareOrder(expected, seq) {
  if (seq.length === expected.length && seq.every((v, i) => v === expected[i])) return { ok: true };
  const k = seq.findIndex((v, i) => v !== expected[i]);
  if (k === -1) return { ok: false, hint: "the order is not complete yet." };
  return { ok: false, hint: `the order is different at position ${k + 1}.` };
}

/** Check a vertex sequence against a path question. Returns { ok, hint? }. */
export function checkPath(graph, q, seq) {
  if (!Array.isArray(seq) || seq.length === 0) return { ok: false, hint: "select some vertices first." };

  if (q.mode === "bfs") return compareOrder(bfsOrder(graph, q.start), seq);
  if (q.mode === "dfs") return compareOrder(dfsOrder(graph, q.start), seq);

  if (q.start && seq[0] !== q.start) return { ok: false, hint: `the walk must start at ${q.start}.` };
  const broken = brokenLink(graph, seq);
  if (broken) return { ok: false, hint: broken };

  if (q.mode === "shortest") {
    if (seq[seq.length - 1] !== q.end) return { ok: false, hint: `the path must end at ${q.end}.` };
    if (new Set(seq).size !== seq.length) return { ok: false, hint: "a path cannot repeat a vertex." };
    const best = shortestPath(graph, q.start, q.end).length;
    return seq.length === best ? { ok: true } : { ok: false, hint: "that path is valid but not the shortest." };
  }

  if (q.mode === "euler") {
    const used = new Set();
    for (let i = 0; i < seq.length - 1; i++) {
      const key = edgeKey(seq[i], seq[i + 1]);
      if (used.has(key)) return { ok: false, hint: "an edge is used twice." };
      used.add(key);
    }
    if (used.size !== graph.edges.length) return { ok: false, hint: "not every edge is used yet." };
    if (q.circuit && seq[seq.length - 1] !== seq[0]) return { ok: false, hint: "a circuit must end where it started." };
    return { ok: true };
  }

  if (q.mode === "hamilton") {
    if (q.cycle && (seq.length < 2 || seq[seq.length - 1] !== seq[0])) {
      return { ok: false, hint: "a cycle must return to its starting vertex." };
    }
    const body = q.cycle ? seq.slice(0, -1) : seq;
    if (new Set(body).size !== body.length) return { ok: false, hint: "a vertex is visited twice." };
    if (body.length !== graph.nodes.length) return { ok: false, hint: "every vertex must be visited exactly once." };
    return { ok: true };
  }

  return { ok: false, hint: "unknown question mode." };
}
