import React, { useEffect, useRef, useState } from "react";

export default function NumberAnswer({ question, locked, onSubmit }) {
  const [value, setValue] = useState("");
  const [empty, setEmpty] = useState(false);
  const input = useRef(null);
  useEffect(() => { input.current?.focus(); }, [question.id]);

  function submit() {
    if (locked) return;
    if (value.trim() === "") { setEmpty(true); return; }
    setEmpty(false);
    onSubmit(Number(value));
    input.current?.select();
  }

  return (
    <>
      <div className="answer-row">
        <input ref={input} type="number" inputMode="numeric" autoComplete="off" placeholder="Your answer"
          aria-label="Your answer" value={value} disabled={locked}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(); }} />
        <button className="primary-btn" disabled={locked} onClick={submit}>Check answer</button>
      </div>
      {empty && <p className="meta-line">Enter a number first.</p>}
    </>
  );
}
