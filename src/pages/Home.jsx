import React from "react";
import { Link } from "react-router-dom";
import gs from "../services/gameSystem.js";
import useGameState from "../hooks/useGameState.js";
import Progress from "../components/Progress.jsx";

export default function Home() {
  useGameState();
  const info = gs.levelInfo();
  const overall = gs.overallProgress();
  const started = overall.solved > 0;

  return (
    <section className="hero">
      <div className="hero-card">
        <span className="eyebrow">Gamified Discrete Mathematics</span>
        <h1>Discrete Math Quest</h1>
        <p>
          Learn and practice discrete mathematics through interactive challenges: logic, graphs, Hasse diagrams and
          combinatorics, with score, XP, lives, levels and achievements.
        </p>
        <div className="button-row">
          <Link className="primary-btn" to="/games">{started ? "Continue playing" : "Start game"}</Link>
          <Link className="secondary-btn" to="/instructions">How to play</Link>
        </div>
        {started && (
          <div className="home-stats">
            <div className="stat-pill">Level {info.level}</div>
            <div className="stat-pill">⭐ {gs.totalScore().toLocaleString("en-US")}</div>
            <div className="stat-pill">{overall.solved}/{overall.total} solved</div>
          </div>
        )}
      </div>

      {started && <Progress current={overall.solved} total={overall.total} label="Overall progress" />}

      <div className="feature-grid">
        {gs.GAMES.map((g) => (
          <Link className="feature-card" key={g.id} to={`/games/${g.id}`}>
            <span>{g.icon}</span>
            <h3>{g.shortTitle}</h3>
            <p>{g.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
