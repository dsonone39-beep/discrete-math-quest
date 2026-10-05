import React from "react";

export default function Lives({ lives, max = 3 }) {
  const hearts = "❤️".repeat(Math.max(0, lives)) + "🖤".repeat(Math.max(0, max - lives));
  return <div className="stat-pill" aria-label={`${lives} lives left`}>{hearts}</div>;
}
