import React from "react";

/** Notation badge for each game, drawn from the maths itself: p→q, a graph, a Hasse diamond, C(n,k). */
export default function GameGlyph({ id, size = 56 }) {
  const dot = (cx, cy, r = 5) => <circle key={`${cx}-${cy}`} className="gl-dot" cx={cx} cy={cy} r={r} />;
  let art;
  if (id === "graph") {
    art = (
      <>
        <path className="gl-line" d="M12 41 L28 13 L44 41 Z M28 13 L28 31 M12 41 L28 31 M44 41 L28 31" />
        {[[12, 41], [28, 13], [44, 41], [28, 31]].map(([x, y]) => dot(x, y))}
      </>
    );
  } else if (id === "hasse") {
    art = (
      <>
        <path className="gl-line" d="M28 10 L11 28 L28 46 L45 28 Z" />
        {[[28, 10], [11, 28], [45, 28], [28, 46]].map(([x, y]) => dot(x, y))}
      </>
    );
  } else if (id === "combinatorics") {
    art = <text className="gl-text" x="28" y="34" textAnchor="middle" fontSize="16">C(n,k)</text>;
  } else {
    art = <text className="gl-text" x="28" y="35" textAnchor="middle" fontSize="20">p→q</text>;
  }
  return (
    <svg className="glyph" width={size} height={size} viewBox="0 0 56 56" aria-hidden="true">
      <rect className="gl-bg" x="2" y="2" width="52" height="52" rx="14" />
      {art}
    </svg>
  );
}
