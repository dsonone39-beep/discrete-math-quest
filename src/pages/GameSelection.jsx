import React from "react";
import { Link } from "react-router-dom";
import gs from "../services/gameSystem.js";
import useGameState from "../hooks/useGameState.js";
import Progress from "../components/Progress.jsx";
import GameGlyph from "../components/GameGlyph.jsx";

export default function GameSelection() {
  useGameState();
  return (
    <section className="page">
      <div className="page-heading">
        <h1>Choose a game</h1>
        <p>Each game has three difficulty levels. Solve most Easy challenges to unlock Medium, then Medium to unlock Hard.</p>
      </div>

      <div className="tile-grid">
        {gs.GAMES.map((game) => {
          const p = gs.progress(game.id);
          return (
            <div className="tile static" key={game.id} style={{ "--game": game.color, "--tint": game.tint }}>
              <GameGlyph id={game.id} size={64} />
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
