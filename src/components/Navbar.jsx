import React from "react";
import { Link, NavLink } from "react-router-dom";
import gs from "../services/gameSystem.js";
import useGameState from "../hooks/useGameState.js";

export default function Navbar() {
  useGameState();
  const info = gs.levelInfo();
  return (
    <nav className="navbar">
      <Link className="brand" to="/">
        <svg className="logo" viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <path d="M16 5 L6 16 L16 27 L26 16 Z" />
          {[[16, 5], [6, 16], [26, 16], [16, 27]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="3.6" />)}
        </svg>
        <span>Discrete Math Quest</span>
      </Link>
      <div className="navbar-right">
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/games">Games</NavLink>
          <NavLink to="/achievements">Achievements</NavLink>
          <NavLink to="/instructions">Instructions</NavLink>
        </div>
        <div className="level-chip" title={`${info.into}/${info.needed} XP to next level`}>
          <span>Level {info.level}</span>
          <div className="mini-bar"><i style={{ width: `${info.pct}%` }} /></div>
        </div>
      </div>
    </nav>
  );
}
