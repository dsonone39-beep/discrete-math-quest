import React from "react";

export default function Progress({ current, total }) {
  const percent = total ? Math.round((current / total) * 100) : 0;
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>Progress</span>
        <span>{current}/{total}</span>
      </div>
      <div className="progress-track">
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}