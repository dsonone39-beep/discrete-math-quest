import React from "react";

export default function Toast({ toasts }) {
  if (!toasts.length) return null;
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => <div className="toast" key={t.id}>{t.msg}</div>)}
    </div>
  );
}
