// Hasse Diagram Builder: posets, cover relations, layout and answer checking.
// A poset spec is one of:
//   { order: "divides", elements: [1, 2, 3, 6] }
//   { order: "subset",  elements: [[], ["a"], ["b"], ["a", "b"]] }
//   { order: "pairs",   elements: ["a", "b", "c"], pairs: [["a", "b"], ["b", "c"]] }  (closed under reflexivity/transitivity)

export const pairKey = (a, b) => [String(a), String(b)].sort().join("|");

export function buildPoset(spec) {
  let items;
  if (spec.order === "divides") {
    items = spec.elements.map((n) => ({ id: String(n), label: String(n), value: n }));
  } else if (spec.order === "subset") {
    items = spec.elements.map((s) => ({ id: s.length ? s.join("") : "empty", label: s.length ? `{${s.join(",")}}` : "∅", value: s }));
  } else {
    items = spec.elements.map((e) => ({ id: String(e), label: String(e), value: e }));
  }
  const ids = items.map((i) => i.id);
  const rel = new Set();
  const add = (a, b) => rel.add(`${a}>${b}`);

  if (spec.order === "divides") {
    items.forEach((a) => items.forEach((b) => { if (b.value % a.value === 0) add(a.id, b.id); }));
  } else if (spec.order === "subset") {
    items.forEach((a) => items.forEach((b) => { if (a.value.every((x) => b.value.includes(x))) add(a.id, b.id); }));
  } else {
    ids.forEach((a) => add(a, a));
    spec.pairs.forEach(([a, b]) => add(String(a), String(b)));
    ids.forEach((k) => ids.forEach((i) => ids.forEach((j) => { if (rel.has(`${i}>${k}`) && rel.has(`${k}>${j}`)) add(i, j); })));
  }
  return { items, ids, leq: (a, b) => rel.has(`${a}>${b}`), spec };
}

export const labelOf = (poset, id) => poset.items.find((i) => i.id === id)?.label ?? id;

/** [lower, upper] pairs where upper covers lower (nothing strictly between). */
export function coverPairs(poset) {
  const { ids, leq } = poset;
  const result = [];
  ids.forEach((a) => ids.forEach((b) => {
    if (a !== b && leq(a, b) && !ids.some((c) => c !== a && c !== b && leq(a, c) && leq(c, b))) result.push([a, b]);
  }));
  return result;
}

/** Height of each element = length of the longest chain below it (minimal elements have height 0). */
export function heights(poset) {
  const memo = {};
  const h = (x) => {
    if (x in memo) return memo[x];
    let best = 0;
    poset.ids.forEach((y) => { if (y !== x && poset.leq(y, x)) best = Math.max(best, h(y) + 1); });
    return (memo[x] = best);
  };
  poset.ids.forEach(h);
  return memo;
}

/** Centre positions (x right, y down). Minimal elements are at the bottom. */
export function layoutPoset(poset, { gapX = 90, gapY = 80, pad = 40 } = {}) {
  const hs = heights(poset);
  const maxH = Math.max(...Object.values(hs));
  const rows = [];
  poset.ids.forEach((id) => { (rows[hs[id]] = rows[hs[id]] || []).push(id); });
  const maxCols = Math.max(...rows.map((r) => r.length));
  const width = Math.max(pad * 2, pad * 2 + (maxCols - 1) * gapX);
  const height = pad * 2 + maxH * gapY;
  const pos = {};
  rows.forEach((row, level) => row.forEach((id, i) => {
    pos[id] = { x: width / 2 + (i - (row.length - 1) / 2) * gapX, y: pad + (maxH - level) * gapY };
  }));
  return { pos, width, height };
}

export const minimalElements = (poset) =>
  poset.ids.filter((x) => !poset.ids.some((y) => y !== x && poset.leq(y, x)));
export const maximalElements = (poset) =>
  poset.ids.filter((x) => !poset.ids.some((y) => y !== x && poset.leq(x, y)));

export function longestChainSize(poset) {
  return Math.max(...Object.values(heights(poset))) + 1;
}

/** Size of the largest antichain (brute force; posets here have at most ~10 elements). */
export function maxAntichainSize(poset) {
  const { ids, leq } = poset;
  let best = 0;
  for (let mask = 1; mask < 1 << ids.length; mask++) {
    const pick = ids.filter((_, i) => mask & (1 << i));
    const anti = pick.every((a) => pick.every((b) => a === b || (!leq(a, b) && !leq(b, a))));
    if (anti) best = Math.max(best, pick.length);
  }
  return best;
}

/** Compare the user's drawn edges (any direction) with the true cover relation. */
export function checkHasse(poset, userPairs) {
  const expected = new Set(coverPairs(poset).map(([a, b]) => pairKey(a, b)));
  const got = new Set((userPairs || []).map(([a, b]) => pairKey(a, b)));
  const missing = [...expected].filter((k) => !got.has(k)).length;
  const extra = [...got].filter((k) => !expected.has(k)).length;
  if (!missing && !extra) return { ok: true };
  const parts = [];
  if (extra) parts.push(`${extra} edge${extra > 1 ? "s are" : " is"} not a cover relation (nothing may lie strictly between the two ends)`);
  if (missing) parts.push(`${missing} edge${missing > 1 ? "s are" : " is"} still missing`);
  return { ok: false, hint: parts.join(" and ") + "." };
}
