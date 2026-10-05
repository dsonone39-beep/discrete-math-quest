import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import gs from "../services/gameSystem.js";
import useGameState from "../hooks/useGameState.js";
import Progress from "../components/Progress.jsx";
import GameGlyph from "../components/GameGlyph.jsx";
import { DIFFICULTY, DIFFICULTY_ORDER, CHOICE_TIME } from "../services/scoring.js";

export default function GameLobby() {
  useGameState();
  const { gameId } = useParams();
  const game = gs.getGame(gameId);
  if (!game) return <Navigate to="/games" replace />;
  const p = gs.progress(game.id);

  return (
    <section className="page" style={{ "--game": game.color, "--tint": game.tint }}>
      <div className="lobby-head">
        <GameGlyph id={game.id} size={84} />
        <div className="page-heading">
          <h1>{game.title}</h1>
          <p>{game.description}</p>
        </div>
      </div>
      <Progress current={p.solved} total={p.total} label="Challenges solved" />

      <div className="game-grid three">
        {DIFFICULTY_ORDER.map((d) => {
          const cfg = DIFFICULTY[d];
          const count = gs.questionsFor(game.id, d).length;
          const open = count > 0 && gs.isUnlocked(game.id, d);
          return (
            <div className={`game-card diff-card ${d}${open ? "" : " closed"}`} key={d}>
              <h2>{cfg.label}</h2>
              <p>{count} challenges, {gs.solvedBy(game.id, d)} solved</p>
              <p className="meta-line">Multiple choice gets {CHOICE_TIME} seconds. Other questions get {cfg.time} seconds and {cfg.attempts} attempts.</p>
              {open
                ? <Link className="primary-btn full" to={`/games/${game.id}/play/${d}`}>Start run</Link>
                : <button className="disabled-btn" disabled>🔒 {count ? gs.unlockText(game.id, d) : "No challenges yet"}</button>}
            </div>
          );
        })}
      </div>
      <div className="button-row"><Link className="secondary-btn" to="/games">All games</Link></div>
    </section>
  );
}
