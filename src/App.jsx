import React from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import Home from "./pages/Home.jsx";
import GameSelection from "./pages/GameSelection.jsx";
import GameLobby from "./pages/GameLobby.jsx";
import GamePlay from "./pages/GamePlay.jsx";
import Instructions from "./pages/Instructions.jsx";
import Achievements from "./pages/Achievements.jsx";
import Result from "./pages/Result.jsx";

function NotFound() {
  return (
    <section className="page narrow">
      <div className="info-card">
        <h1>Page not found</h1>
        <Link className="primary-btn" to="/">Go home</Link>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<GameSelection />} />
            <Route path="/games/:gameId" element={<GameLobby />} />
            <Route path="/games/:gameId/play/:difficulty" element={<GamePlay />} />
            <Route path="/logic" element={<Navigate to="/games/logic" replace />} />
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/result" element={<Result />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <footer className="footer">Discrete Math Quest · Logic · Graphs · Hasse diagrams · Combinatorics</footer>
    </div>
  );
}
