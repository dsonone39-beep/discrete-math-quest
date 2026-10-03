import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "../../components/Timer";
import Score from "../../components/Score";
import Lives from "../../components/Lives";
import Progress from "../../components/Progress";
import { logicQuestions } from "./logicQuestions";

const TIME_PER_QUESTION = 30;
const STARTING_LIVES = 3;
const POINTS_PER_CORRECT = 10;

export default function LogicGame({ onFinish }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [seconds, setSeconds] = useState(TIME_PER_QUESTION);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [feedback, setFeedback] = useState("");

  const question = useMemo(() => logicQuestions[index], [index]);

  useEffect(() => {
    if (locked) return;

    if (seconds <= 0) {
      submitAnswer(null, true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, locked]);

  function submitAnswer(optionIndex, timedOut = false) {
    if (locked) return;

    setLocked(true);
    setSelected(optionIndex);

    const isCorrect = optionIndex === question.answer;

    if (isCorrect) {
      setScore((s) => s + POINTS_PER_CORRECT);
      setCorrect((c) => c + 1);
      setFeedback(`Correct! +${POINTS_PER_CORRECT} points. ${question.explanation}`);
    } else {
      setLives((l) => l - 1);
      setFeedback(
        timedOut
          ? `Time's up! The correct answer was "${question.options[question.answer]}".`
          : `Wrong. The correct answer was "${question.options[question.answer]}".`
      );
    }

    setTimeout(() => {
      const nextIndex = index + 1;
      const nextLives = isCorrect ? lives : lives - 1;

      if (nextIndex >= logicQuestions.length || nextLives <= 0) {
        const finalScore = score + (isCorrect ? POINTS_PER_CORRECT : 0);
        const finalCorrect = correct + (isCorrect ? 1 : 0);
        onFinish({
          score: finalScore,
          total: logicQuestions.length,
          correct: finalCorrect
        });
      } else {
        setIndex(nextIndex);
        setSelected(null);
        setFeedback("");
        setLocked(false);
        setSeconds(TIME_PER_QUESTION);
      }
    }, 1300);
  }

  function quitGame() {
    navigate("/games");
  }

  return (
    <section className="page game-page">
      <div className="game-top">
        <div>
          <span className="eyebrow">Logic & Truth Dungeon</span>
          <h1>Level {question.level}</h1>
        </div>
        <button className="quit-btn" onClick={quitGame}>Exit</button>
      </div>

      <div className="stats-row">
        <Score score={score} />
        <Lives lives={lives} />
        <Timer seconds={seconds} />
      </div>

      <Progress current={index + 1} total={logicQuestions.length} />

      <div className="question-card">
        <div className="topic-badge">{question.topic}</div>
        <p className="question-count">Question {index + 1} of {logicQuestions.length}</p>
        <h2>{question.question}</h2>

        <div className="options">
          {question.options.map((option, i) => {
            let className = "option-btn";
            if (locked && i === question.answer) className += " correct";
            if (locked && i === selected && i !== question.answer) className += " wrong";

            return (
              <button
                key={option}
                className={className}
                disabled={locked}
                onClick={() => submitAnswer(i)}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}</span>
                <span>{option}</span>
              </button>
            );
          })}
        </div>

        {feedback && (
          <div className={`feedback ${selected === question.answer ? "success" : "warning"}`}>
            {feedback}
          </div>
        )}
      </div>
    </section>
  );
}