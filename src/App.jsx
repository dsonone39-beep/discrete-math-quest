import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import GameSelection from "./pages/GameSelection";
import Instructions from "./pages/Instructions";
import LogicGame from "./games/logic/LogicGame";
import Result from "./pages/Result";

export default function App() {
  const navigate = useNavigate();
  const [gameResult, setGameResult] = useState({
    score: 0,
    total: 0,
    correct: 0
  });

  function finishGame(result) {
    setGameResult(result);
    navigate("/result");
  }

  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<GameSelection />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/logic" element={<LogicGame onFinish={finishGame} />} />
          <Route path="/result" element={<Result result={gameResult} />} />
        </Routes>
      </main>
      <footer className="footer">Discrete Math Quest • Member 1 Module</footer>
    </div>
  );
}