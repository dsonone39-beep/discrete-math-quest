// Persistence layer: versioned LocalStorage wrapper. Safe when storage is blocked or the data is corrupt.
export const KEY = "mathquest.v2";
export const LEGACY_KEY = "mathquest.v1"; // Member 3 original (unversioned) save, imported once
export const SCHEMA_VERSION = 2;

function store() {
  try { return globalThis.localStorage ?? null; } catch { return null; }
}

/** Returns the saved game state, or null when nothing usable is stored. */
export function load() {
  const ls = store();
  if (!ls) return null;
  try {
    const raw = ls.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed && parsed.version === SCHEMA_VERSION && parsed.data ? parsed.data : null; // unknown version => safe reset
    }
    const legacy = ls.getItem(LEGACY_KEY);
    if (legacy) return JSON.parse(legacy);
  } catch { /* corrupt data: ignore */ }
  return null;
}

export function save(data) {
  const ls = store();
  if (!ls) return false;
  try {
    ls.setItem(KEY, JSON.stringify({ version: SCHEMA_VERSION, savedAt: Date.now(), data }));
    return true;
  } catch { return false; }
}

export function clear() {
  const ls = store();
  if (!ls) return;
  try { ls.removeItem(KEY); ls.removeItem(LEGACY_KEY); } catch { /* ignore */ }
}
