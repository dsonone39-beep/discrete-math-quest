import React from "react";

export default function Timer({ seconds }) {
  return <div className="stat-pill">⏱️ {seconds}s</div>;
}