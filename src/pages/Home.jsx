import React from "react";
import { Link } from "react-router-dom";
import gs from "../services/gameSystem.js";
import useGameState from "../hooks/useGameState.js";
import Progress from "../components/Progress.jsx";
import GameGlyph from "../components/GameGlyph.jsx";

export default function Home() {
  useGameState();
  const info = gs.levelInfo();
  const overall = gs.overallProgress();
  const started = overall.solved > 0;

  return (
    <section className="hero">
      <div className="hero-copy">
        <h1>Discrete Math Quest</h1>
        <p className="hero-sub">∀ learners ∃ challenge</p>
        <p className="hero-text">
          Practice logic, graphs, Hasse diagrams and counting through timed challenges. You get three lives per run,
          earn XP for every solve, and unlock harder levels as you go.
        </p>
        <div className="button-row">
          <Link className="primary-btn" to="/games">{started ? "Continue playing" : "Start game"}</Link>
          <Link className="secondary-btn" to="/instructions">How to play</Link>
        </div>
        {started && (
          <div className="home-stats">
            <div className="stat-pill">Level {info.level}</div>
            <div className="stat-pill score">⭐ {gs.totalScore().toLocaleString("en-US")}</div>
            <div className="stat-pill">{overall.solved} of {overall.total} solved</div>
          </div>
        )}
      </div>

      {started && <Progress current={overall.solved} total={overall.total} label="Overall progress" />}

      <div className="tile-grid">
        {gs.GAMES.map((g) => (
          <Link className="tile" key={g.id} to={`/games/${g.id}`} style={{ "--game": g.color, "--tint": g.tint }}>
            <GameGlyph id={g.id} size={64} />
            <h3>{g.title}</h3>
            <p>{g.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
