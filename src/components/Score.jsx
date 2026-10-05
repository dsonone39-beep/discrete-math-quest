import React from "react";

export default function Score({ score }) {
  return <div className="stat-pill" aria-label="Score">⭐ {score.toLocaleString("en-US")}</div>;
}
