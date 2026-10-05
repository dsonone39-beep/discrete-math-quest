import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import gs from "../services/gameSystem.js";
import { DIFFICULTY, DIFFICULTY_ORDER } from "../services/scoring.js";

export default function Result() {
  const { state: r } = useLocation();
  if (!r) return <Navigate to="/games" replace />;

  const game = gs.getGame(r.gameId);
  const nextIndex = DIFFICULTY_ORDER.indexOf(r.difficulty) + 1;
  const nextDifficulty = DIFFICULTY_ORDER[nextIndex];
  const canAdvance = nextDifficulty && gs.questionsFor(r.gameId, nextDifficulty).length > 0 && gs.isUnlocked(r.gameId, nextDifficulty);

  return (
    <section className="page narrow" style={{ "--game": game.color, "--tint": game.tint }}>
      <div className="result-card">
        <div className="tag-row">
          <span className="tag">{game.title}</span>
          <span className="tag">{DIFFICULTY[r.difficulty].label}</span>
        </div>
        <h1>{r.over ? "Out of lives. Try again!" : r.flawless ? "Flawless run!" : "Run complete"}</h1>
        <div className="result-number">{r.score.toLocaleString("en-US")}</div>
        <p>points, and {r.xp} XP earned</p>

        <div className="result-grid">
          <div><strong>{r.solved}/{r.total}</strong><span>Solved</span></div>
          <div><strong>{r.accuracy}%</strong><span>Accuracy</span></div>
          <div><strong>{r.bestStreak}</strong><span>Best streak</span></div>
        </div>

        {r.levelAfter > r.levelBefore && <p className="feedback success">Level up! You reached level {r.levelAfter}.</p>}
        {r.achievements.length > 0 && (
          <ul className="result-ach">
            {r.achievements.map((a) => <li key={a.id}><span className="ico">{a.icon}</span> {a.title}</li>)}
          </ul>
        )}

        <div className="button-row center">
          <Link className="primary-btn" to={`/games/${r.gameId}/play/${r.difficulty}`}>Play again</Link>
          {canAdvance && <Link className="primary-btn" to={`/games/${r.gameId}/play/${nextDifficulty}`}>Try {DIFFICULTY[nextDifficulty].label}</Link>}
          <Link className="secondary-btn" to={`/games/${r.gameId}`}>Levels</Link>
          <Link className="secondary-btn" to="/games">All games</Link>
        </div>
      </div>
    </section>
  );
}
