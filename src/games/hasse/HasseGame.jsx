import React from "react";
import QuizRunner from "../../components/QuizRunner.jsx";
import { getGame } from "../registry.js";

// Hasse Diagram Builder: questions live in the registry; the shared QuizRunner supplies timer, lives, score and progress.
export default function HasseGame({ difficulty, onFinish }) {
  return <QuizRunner game={getGame("hasse")} difficulty={difficulty} onFinish={onFinish} />;
}
