import React from "react";

export default function Instructions() {
  return (
    <section className="page narrow">
      <div className="page-heading">
        <span className="eyebrow">Instructions</span>
        <h1>How to Play</h1>
      </div>
      <div className="info-card">
        <ol className="instruction-list">
          <li>Select a game from the Game Selection page.</li>
          <li>In Logic & Truth Dungeon, choose an answer for each question.</li>
          <li>A correct answer adds 10 points and moves to the next question.</li>
          <li>A wrong answer removes one life and moves to the next question.</li>
          <li>You start with 3 lives and have a timer for each question.</li>
          <li>Complete the questions to see your final result.</li>
        </ol>
        <p className="small-note">The common score, lives, timer and level rules can be adjusted by the team before final integration.</p>
      </div>
    </section>
  );
}