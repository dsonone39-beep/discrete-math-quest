import React from "react";
import { Link } from "react-router-dom";

export default function Result({ result }) {
  const percent = result.total ? Math.round((result.correct / result.total) * 100) : 0;
  return (
    <section className="page narrow">
      <div className="result-card">
        <span className="eyebrow">Game Complete</span>
        <h1>🏆 Your Result</h1>
        <div className="result-number">{result.score}</div>
        <p>points</p>
        <div className="result-grid">
          <div><strong>{result.correct}</strong><span>Correct</span></div>
          <div><strong>{result.total - result.correct}</strong><span>Wrong</span></div>
          <div><strong>{percent}%</strong><span>Accuracy</span></div>
        </div>
        <div className="button-row center">
          <Link className="primary-btn" to="/logic">Play Again</Link>
          <Link className="secondary-btn" to="/games">All Games</Link>
        </div>
      </div>
    </section>
  );
}