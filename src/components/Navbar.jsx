import React from "react";
import { Link, NavLink } from "react-router-dom";
import gs from "../services/gameSystem.js";
import useGameState from "../hooks/useGameState.js";

export default function Navbar() {
  useGameState();
  const info = gs.levelInfo();
  return (
    <nav className="navbar">
      <Link className="brand" to="/">🧠 Discrete Math Quest</Link>
      <div className="navbar-right">
        <div className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/games">Games</NavLink>
          <NavLink to="/achievements">Achievements</NavLink>
          <NavLink to="/instructions">Instructions</NavLink>
        </div>
        <div className="level-chip" title={`${info.into}/${info.needed} XP to next level`}>
          <span>Lv {info.level}</span>
          <div className="mini-bar"><i style={{ width: `${info.pct}%` }} /></div>
        </div>
      </div>
    </nav>
  );
}
