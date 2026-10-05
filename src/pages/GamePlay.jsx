import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import gs from "../services/gameSystem.js";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { GAME_COMPONENTS } from "../games/components.js";
import { DIFFICULTY } from "../services/scoring.js";

export default function GamePlay() {
  const { gameId, difficulty } = useParams();
  const navigate = useNavigate();
  const game = gs.getGame(gameId);

  if (!game || !DIFFICULTY[difficulty]) return <Navigate to="/games" replace />;
  if (!gs.questionsFor(gameId, difficulty).length || !gs.isUnlocked(gameId, difficulty)) {
    return <Navigate to={`/games/${gameId}`} replace />;
  }

  const Game = GAME_COMPONENTS[gameId];
  return (
    <ErrorBoundary key={`${gameId}-${difficulty}`}>
      <Game difficulty={difficulty} onFinish={(summary) => navigate("/result", { state: summary })} />
    </ErrorBoundary>
  );
}
