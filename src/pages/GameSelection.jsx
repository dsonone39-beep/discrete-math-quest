import React from "react";
import { Link } from "react-router-dom";

const games = [
  { icon: "🧠", title: "Logic & Truth Dungeon", description: "Propositional logic, truth tables, Modus Ponens, Modus Tollens and Resolution.", path: "/logic", available: true },
  { icon: "🔵", title: "Graph Theory Pathfinder", description: "Vertices, edges, paths, subgraphs and graph algorithms.", path: "#", available: false },
  { icon: "📊", title: "Hasse Diagram Builder", description: "Relations, partial orders and cover relations.", path: "#", available: false },
  { icon: "🔢", title: "Combinatorics Strategy Game", description: "Counting, permutations, combinations and principles.", path: "#", available: false }
];

export default function GameSelection() {
  return (
    <section className="page">
      <div className="page-heading">
        <span className="eyebrow">Choose your challenge</span>
        <h1>Game Selection</h1>
        <p>Member 1's Logic & Truth Dungeon is ready to play. Other modules can be connected during final integration.</p>
      </div>

      <div className="game-grid">
        {games.map((game) => (
          <div className="game-card" key={game.title}>
            <div className="game-icon">{game.icon}</div>
            <h2>{game.title}</h2>
            <p>{game.description}</p>
            {game.available ? (
              <Link className="primary-btn full" to={game.path}>Play</Link>
            ) : (
              <button className="disabled-btn" disabled>Coming Soon</button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}