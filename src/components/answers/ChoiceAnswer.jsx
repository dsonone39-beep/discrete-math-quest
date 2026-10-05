import React, { useState } from "react";

export default function ChoiceAnswer({ question, locked, onSubmit }) {
  const [picked, setPicked] = useState(null);
  return (
    <div className="options">
      {question.options.map((option, i) => {
        let className = "option-btn";
        if (locked && i === question.answer) className += " correct";
        if (locked && i === picked && i !== question.answer) className += " wrong";
        return (
          <button key={i} className={className} disabled={locked} onClick={() => { setPicked(i); onSubmit(i); }}>
            <span className="option-letter">{String.fromCharCode(65 + i)}</span>
            <span>{option}</span>
          </button>
        );
      })}
    </div>
  );
}
