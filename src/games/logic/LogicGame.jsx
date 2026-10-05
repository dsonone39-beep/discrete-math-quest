import React from "react";
import QuizRunner from "../../components/QuizRunner.jsx";
import { getGame } from "../registry.js";

// Logic & Truth Dungeon: questions live in the registry; the shared QuizRunner supplies timer, lives, score and progress.
export default function LogicGame({ difficulty, onFinish }) {
  return <QuizRunner game={getGame("logic")} difficulty={difficulty} onFinish={onFinish} />;
}
