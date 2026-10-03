import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="hero">
      <div className="hero-card">
        <span className="eyebrow">Gamified Discrete Mathematics</span>
        <h1>Discrete Math Quest</h1>
        <p>
          Learn and practice discrete mathematics through interactive
          challenges, levels, score, lives and progress.
        </p>
        <div className="button-row">
          <Link className="primary-btn" to="/games">Start Game</Link>
          <Link className="secondary-btn" to="/instructions">How to Play</Link>
        </div>
      </div>

      <div className="feature-grid">
        <div className="feature-card"><span>🧠</span><h3>Logic</h3><p>Truth tables and logical reasoning.</p></div>
        <div className="feature-card"><span>🔗</span><h3>Graphs</h3><p>Graph challenges by the team.</p></div>
        <div className="feature-card"><span>📊</span><h3>Hasse</h3><p>Relations and partial orders.</p></div>
        <div className="feature-card"><span>🔢</span><h3>Combinatorics</h3><p>Counting and strategy challenges.</p></div>
      </div>
    </section>
  );
}