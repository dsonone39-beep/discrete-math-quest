import React from "react";

export default function Timer({ seconds, low = false }) {
  return <div className={`stat-pill timer${low ? " low" : ""}`} aria-label="Time left">⏱️ {seconds}s</div>;
}
