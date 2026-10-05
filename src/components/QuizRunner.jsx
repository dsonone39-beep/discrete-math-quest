import React, { Suspense, lazy, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Timer from "./Timer.jsx";
import Score from "./Score.jsx";
import Lives from "./Lives.jsx";
import Progress from "./Progress.jsx";
import Toast from "./Toast.jsx";
import GameGlyph from "./GameGlyph.jsx";
import QuestionVisual from "./QuestionVisual.jsx";
import ChoiceAnswer from "./answers/ChoiceAnswer.jsx";
import NumberAnswer from "./answers/NumberAnswer.jsx";
import PathAnswer from "./answers/PathAnswer.jsx";
import useCountdown from "../hooks/useCountdown.js";
import gs from "../services/gameSystem.js";
import { DIFFICULTY, attemptsFor, timeLimitFor } from "../services/scoring.js";
import { questionsFor } from "../games/registry.js";
import { checkAnswer, describeAnswer } from "../games/checkAnswer.js";

// React Flow is only downloaded when a Hasse question appears.
const HasseAnswer = lazy(() => import("./answers/HasseAnswer.jsx"));
const WIDGETS = { choice: ChoiceAnswer, number: NumberAnswer, path: PathAnswer, hasse: HasseAnswer };

/**
 * The common game loop used by all four games: timer, lives, attempts, hints, score, XP, progress.
 * Each game module supplies its own questions; the widget for each question type does the interaction.
 */
export default function QuizRunner({ game, difficulty, onFinish }) {
  const navigate = useNavigate();
  const queue = useMemo(() => questionsFor(game.id, difficulty), [game.id, difficulty]);
  const sessionRef = useRef(null);
  if (!sessionRef.current) sessionRef.current = gs.createSession(game.id, difficulty, queue.length);
  const session = sessionRef.current;

  const [index, setIndex] = useState(0);
  const [locked, setLocked] = useState(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [hintShown, setHintShown] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [, refresh] = useReducer((n) => n + 1, 0);

  const q = queue[index];
  const qRef = useRef(q); qRef.current = q;
  const lockedRef = useRef(false);
  const attemptsRef = useRef(0);
  const hintRef = useRef(false);
  const toastId = useRef(0);

  const countdown = useCountdown(() => { if (!lockedRef.current) failQuestion("Time is up!"); });

  // Start the clock whenever a new question appears.
  useEffect(() => {
    lockedRef.current = false; attemptsRef.current = 0; hintRef.current = false;
    setLocked(false); setAttemptsUsed(0); setHintShown(false); setFeedback(null);
    countdown.start(timeLimitFor(qRef.current));
    return () => countdown.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  function pushToast(msg) {
    const id = ++toastId.current;
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }

  function lock() {
    lockedRef.current = true;
    setLocked(true);
    countdown.stop();
  }

  function failQuestion(reason) {
    const question = qRef.current;
    gs.loseLife(session);
    lock();
    setFeedback({ tone: "bad", text: `${reason} The answer is ${describeAnswer(question)}. ${question.explanation}` });
    refresh();
  }

  function solved() {
    const question = qRef.current;
    const r = gs.recordSolve(session, question, {
      timeLeft: countdown.getLeft(), timeLimit: timeLimitFor(question),
      attemptsUsed: attemptsRef.current, hintUsed: hintRef.current
    });
    lock();
    setFeedback({ tone: "ok", text: `Correct! +${r.score.total} points, +${r.xpGain} XP ${"★".repeat(r.stars)}. ${question.explanation}` });
    if (r.levelUp) pushToast(`Level up! You are now level ${r.levelUp}`);
    r.achievements.forEach((a) => pushToast(`Achievement unlocked: ${a.title}`));
    refresh();
  }

  function submit(value) {
    if (lockedRef.current || countdown.paused) return;
    const question = qRef.current;
    attemptsRef.current += 1;
    setAttemptsUsed(attemptsRef.current);
    const result = checkAnswer(question, value);
    if (result.ok) return solved();
    if (attemptsRef.current >= attemptsFor(question)) return failQuestion("Not correct.");
    setFeedback({ tone: "bad", text: result.hint ? `Not quite: ${result.hint} Try again.` : "Not quite. Try again." });
  }

  function showHint() {
    hintRef.current = true;
    setHintShown(true);
  }

  function next() {
    if (session.over || index + 1 >= queue.length) {
      countdown.stop();
      onFinish(gs.endSession(session));
      return;
    }
    setIndex(index + 1);
  }

  if (!q) return null;
  const Widget = WIDGETS[q.type];
  const attemptsTotal = attemptsFor(q);
  const secondsLeft = Math.ceil(countdown.left);

  return (
    <section className="page game-page" style={{ "--game": game.color, "--tint": game.tint }}>
      <div className="game-top">
        <div className="game-id">
          <GameGlyph id={game.id} size={48} />
          <div>
            <h1>{game.title}</h1>
            <p className="muted">{DIFFICULTY[difficulty].label} run</p>
          </div>
        </div>
        <div className="button-row tight">
          <button className="quit-btn" disabled={locked} onClick={() => (countdown.paused ? countdown.resume() : countdown.pause())}>
            {countdown.paused ? "Resume" : "Pause"}
          </button>
          <button className="quit-btn" onClick={() => navigate(`/games/${game.id}`)}>Exit</button>
        </div>
      </div>

      <div className="stats-row">
        <Score score={session.score} />
        <Lives lives={session.lives} max={gs.LIVES} />
        <div className="stat-pill">🔥 Streak {session.streak}</div>
        <Timer seconds={secondsLeft} low={secondsLeft <= 10 && !locked} />
      </div>
      <div className="timebar" aria-hidden="true">
        <i className={secondsLeft <= 10 ? "low" : ""} style={{ width: `${countdown.limit ? (countdown.left / countdown.limit) * 100 : 0}%` }} />
      </div>

      <Progress current={index + 1} total={queue.length} label="Question" />

      {countdown.paused ? (
        <div className="question-card paused">
          <h2>Paused</h2>
          <p>The question is hidden and the clock is stopped.</p>
          <button className="primary-btn" onClick={countdown.resume}>Resume</button>
        </div>
      ) : (
        <div className="question-card">
          <div className="q-head">
            <span className="topic-badge">{q.topic}</span>
            <span className="question-count">Question {index + 1} of {queue.length}</span>
          </div>
          <h2>{q.text}</h2>
          <QuestionVisual question={q} />
          <Suspense fallback={<p className="meta-line">Loading diagram editor…</p>}>
            <Widget key={q.id} question={q} locked={locked} onSubmit={submit} />
          </Suspense>

          {q.hint && !locked && !hintShown && (
            <button className="secondary-btn hint-btn" onClick={showHint}>Show hint (−20% score)</button>
          )}
          {hintShown && <p className="hint-box">Hint: {q.hint}</p>}
          {attemptsTotal > 1 && !locked && (
            <p className="meta-line">Attempts left: {attemptsTotal - attemptsUsed} of {attemptsTotal}</p>
          )}
          {feedback && <div className={`feedback ${feedback.tone === "ok" ? "success" : "warning"}`} role="status">{feedback.text}</div>}
          {locked && (
            <div className="button-row">
              <button className="primary-btn" autoFocus onClick={next}>
                {session.over ? "See results" : index + 1 >= queue.length ? "Finish run" : "Next challenge"}
              </button>
            </div>
          )}
        </div>
      )}
      <Toast toasts={toasts} />
    </section>
  );
}
