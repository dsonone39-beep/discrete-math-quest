import { useSyncExternalStore } from "react";
import gs from "../services/gameSystem.js";

/** Re-renders the component whenever saved progress changes. Read values through the gs.* helpers. */
export default function useGameState() {
  return useSyncExternalStore(gs.subscribe, gs.getSnapshot);
}
