import React from "react";

export default function Instructions() {
  return (
    <section className="page narrow">
      <div className="page-heading">
        <h1>How to Play</h1>
      </div>
      <div className="info-card">
        <ol className="instruction-list">
          <li>Pick a game, then a difficulty. Medium unlocks after you solve most Easy challenges, and Hard after Medium.</li>
          <li>Every run gives you 3 lives. A wrong final answer or a timeout costs one life.</li>
          <li>Multiple-choice questions allow one attempt and 30 seconds. Number, graph and Hasse questions give more time and 2 to 3 attempts.</li>
          <li>Graph questions: click the vertices in order. Hasse questions: drag between the dots on two elements to draw an edge.</li>
          <li>Faster answers, first-try answers and streaks score more. A hint costs 20% of the base score.</li>
          <li>Score, XP, level, progress and achievements are saved automatically in your browser.</li>
          <li>Use Pause if you need a break. The question is hidden while the clock is stopped.</li>
        </ol>
        <p className="small-note">Score = (base + time bonus − penalties) × streak multiplier. Re-solving a challenge gives 25% XP.</p>
      </div>
    </section>
  );
}
