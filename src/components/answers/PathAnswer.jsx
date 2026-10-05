import React, { useState } from "react";
import GraphView from "../GraphView.jsx";

/** Graph questions: click vertices in order to build a path, walk or traversal order. */
export default function PathAnswer({ question, locked, onSubmit }) {
  const [seq, setSeq] = useState([]);
  const add = (id) => { if (!locked) setSeq((s) => (s[s.length - 1] === id ? s : [...s, id])); };

  return (
    <>
      <GraphView graph={question.graph} path={seq} start={question.start} onNodeClick={add} disabled={locked} />
      <div className="chips" aria-live="polite">
        {seq.length
          ? seq.map((id, i) => <span className="chip" key={i}>{id}</span>)
          : <span className="muted">Click the vertices in order…</span>}
      </div>
      <div className="button-row">
        <button className="secondary-btn" disabled={locked || !seq.length} onClick={() => setSeq((s) => s.slice(0, -1))}>Undo</button>
        <button className="secondary-btn" disabled={locked || !seq.length} onClick={() => setSeq([])}>Clear</button>
        <button className="primary-btn" disabled={locked || !seq.length} onClick={() => onSubmit(seq)}>Check answer</button>
      </div>
    </>
  );
}
