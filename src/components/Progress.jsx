import React from "react";

export default function Progress({ current, total, label = "Progress" }) {
  const percent = total ? Math.round((current / total) * 100) : 0;
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label}</span>
        <span>{current}/{total}</span>
      </div>
      <div className="progress-track" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={current}>
        <div className="progress-bar" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
