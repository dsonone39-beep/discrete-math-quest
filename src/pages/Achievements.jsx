import React from "react";
import gs from "../services/gameSystem.js";
import useGameState from "../hooks/useGameState.js";
import Progress from "../components/Progress.jsx";

export default function Achievements() {
  const state = useGameState();
  const list = gs.listAchievements();
  const info = gs.levelInfo();
  const overall = gs.overallProgress();

  function resetAll() {
    if (window.confirm("Delete all saved progress, XP and achievements?")) gs.reset();
  }

  return (
    <section className="page">
      <div className="page-heading">
        <h1>Achievements</h1>
        <p>You are level {info.level}, with {info.into} of {info.needed} XP towards the next one and {gs.totalScore().toLocaleString("en-US")} points in total.</p>
      </div>

      <Progress current={overall.solved} total={overall.total} label="Challenges solved across all games" />
      <div className="stats-row">
        {gs.GAMES.map((g) => {
          const p = gs.progress(g.id);
          return <div className="stat-pill" key={g.id}>{g.icon} {p.solved}/{p.total}</div>;
        })}
        <div className="stat-pill">Runs played {state.stats.sessions}</div>
        <div className="stat-pill">Best streak {state.stats.bestStreak}</div>
      </div>

      <ul className="ach-grid">
        {list.map((a) => (
          <li key={a.id} className={a.unlocked ? "" : "locked"}>
            <span className="ico">{a.icon}</span>
            <span><b>{a.title}</b><small>{a.desc}</small></span>
          </li>
        ))}
      </ul>

      <div className="button-row"><button className="secondary-btn" onClick={resetAll}>Reset all progress</button></div>
    </section>
  );
}
