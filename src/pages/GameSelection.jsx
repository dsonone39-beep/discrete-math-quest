import React from "react";
import { Link } from "react-router-dom";
import gs from "../services/gameSystem.js";
import useGameState from "../hooks/useGameState.js";
import Progress from "../components/Progress.jsx";

export default function GameSelection() {
  useGameState();
  return (
    <section className="page">
      <div className="page-heading">
        <span className="eyebrow">Choose your challenge</span>
        <h1>Game Selection</h1>
        <p>Four games, three difficulty levels each. Clear Easy challenges to unlock Medium, and Medium to unlock Hard.</p>
      </div>

      <div className="game-grid">
        {gs.GAMES.map((game) => {
          const p = gs.progress(game.id);
          return (
            <div className="game-card" key={game.id}>
              <div className="game-icon">{game.icon}</div>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <Progress current={p.solved} total={p.total} label="Solved" />
              <Link className="primary-btn full" to={`/games/${game.id}`}>{p.solved ? "Continue" : "Play"}</Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
