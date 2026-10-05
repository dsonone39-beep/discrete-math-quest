import LogicGame from "./logic/LogicGame.jsx";
import GraphGame from "./graph/GraphGame.jsx";
import HasseGame from "./hasse/HasseGame.jsx";
import CombinatoricsGame from "./combinatorics/CombinatoricsGame.jsx";

// gameId -> React component. Add a new game here and in registry.js.
export const GAME_COMPONENTS = {
  logic: LogicGame,
  graph: GraphGame,
  hasse: HasseGame,
  combinatorics: CombinatoricsGame
};
