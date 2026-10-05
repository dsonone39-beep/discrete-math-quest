import React from "react";
import QuizRunner from "../../components/QuizRunner.jsx";
import { getGame } from "../registry.js";

// Combinatorics Strategy Game: questions live in the registry; the shared QuizRunner supplies timer, lives, score and progress.
export default function CombinatoricsGame({ difficulty, onFinish }) {
  return <QuizRunner game={getGame("combinatorics")} difficulty={difficulty} onFinish={onFinish} />;
}
