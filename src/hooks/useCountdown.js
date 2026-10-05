import { useCallback, useEffect, useRef, useState } from "react";

/** Deadline-based countdown (drift-free) with pause/resume. `onExpire` is called once when time runs out. */
export default function useCountdown(onExpire) {
  const [left, setLeft] = useState(0);
  const [limit, setLimit] = useState(0);
  const [paused, setPaused] = useState(false);
  const deadline = useRef(0);
  const remaining = useRef(0);
  const timer = useRef(null);
  const pausedRef = useRef(false);
  const expire = useRef(onExpire);
  expire.current = onExpire;

  const clear = () => { clearInterval(timer.current); timer.current = null; };

  const tick = useCallback(() => {
    const t = Math.max(0, (deadline.current - Date.now()) / 1000);
    setLeft(t);
    if (t <= 0) { clear(); expire.current?.(); }
  }, []);

  const start = useCallback((seconds) => {
    clear();
    pausedRef.current = false;
    setPaused(false);
    setLimit(seconds);
    setLeft(seconds);
    deadline.current = Date.now() + seconds * 1000;
    timer.current = setInterval(tick, 200);
  }, [tick]);

  const stop = useCallback(() => { clear(); }, []);

  const pause = useCallback(() => {
    if (!timer.current) return;
    remaining.current = Math.max(0, (deadline.current - Date.now()) / 1000);
    clear();
    pausedRef.current = true;
    setPaused(true);
  }, []);

  const resume = useCallback(() => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    setPaused(false);
    deadline.current = Date.now() + remaining.current * 1000;
    timer.current = setInterval(tick, 200);
  }, [tick]);

  /** Exact seconds left right now (use when scoring an answer). */
  const getLeft = useCallback(
    () => (pausedRef.current ? remaining.current : Math.max(0, (deadline.current - Date.now()) / 1000)),
    []
  );

  useEffect(() => clear, []);

  return { left, limit, paused, start, stop, pause, resume, getLeft };
}
