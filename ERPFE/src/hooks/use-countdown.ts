import { useEffect, useState } from "react";

const remaining = (target: number | null) =>
  target ? Math.max(0, Math.ceil((target - Date.now()) / 1000)) : 0;

export const formatClock = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export function useCountdown(target: number | null) {
  const [seconds, setSeconds] = useState(() => remaining(target));

  useEffect(() => {
    setSeconds(remaining(target));
    if (!target || target <= Date.now()) return;
    const id = window.setInterval(() => {
      const next = remaining(target);
      setSeconds(next);
      if (next === 0) window.clearInterval(id);
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  return seconds;
}