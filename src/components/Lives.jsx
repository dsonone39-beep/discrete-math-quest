import React from "react";

export default function Lives({ lives }) {
  return <div className="stat-pill">❤️ {"❤️".repeat(Math.max(0, lives))}</div>;
}