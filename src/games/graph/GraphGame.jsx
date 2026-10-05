import React from "react";
import QuizRunner from "../../components/QuizRunner.jsx";
import { getGame } from "../registry.js";

// Graph Theory Pathfinder: questions live in the registry; the shared QuizRunner supplies timer, lives, score and progress.
export default function GraphGame({ difficulty, onFinish }) {
  return <QuizRunner game={getGame("graph")} difficulty={difficulty} onFinish={onFinish} />;
}
