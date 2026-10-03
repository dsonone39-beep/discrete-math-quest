import React from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link className="brand" to="/">🧠 Discrete Math Quest</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/games">Games</Link>
        <Link to="/instructions">Instructions</Link>
      </div>
    </nav>
  );
}