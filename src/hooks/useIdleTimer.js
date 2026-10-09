import { useCallback, useEffect, useRef, useState } from "react";

// useIdleTimer — inactivity timer for a public self-service kiosk.
// After `idleMs` of no activity, enters a warning state with a `warningMs` countdown.
// If the countdown reaches zero, calls `onTimeout`. Any activity cancels the warning.
export function useIdleTimer({ idleMs = 60000, warningMs = 15000, onTimeout }) {
  const [warning, setWarning] = useState(false);
  const [countdown, setCountdown] = useState(Math.ceil(warningMs / 1000));

  const lastActivityRef = useRef(Date.now());
  const warningStartRef = useRef(0);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const bump = useCallback(() => {
    lastActivityRef.current = Date.now();
    setWarning((w) => {
      if (w) {
        warningStartRef.current = 0;
        return false;
      }
      return w;
    });
  }, []);

  useEffect(() => {
    const events = ["mousedown", "mousemove", "keydown", "touchstart", "touchmove", "pointerdown", "click", "wheel"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, bump));
  }, [bump]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setWarning((w) => {
        if (w) {
          const elapsed = now - warningStartRef.current;
          const left = Math.max(0, Math.ceil((warningMs - elapsed) / 1000));
          setCountdown(left);
          if (left <= 0) {
            warningStartRef.current = 0;
            lastActivityRef.current = now;
            onTimeoutRef.current?.();
            return false;
          }
          return w;
        }
        if (now - lastActivityRef.current >= idleMs) {
          warningStartRef.current = now;
          setCountdown(Math.ceil(warningMs / 1000));
          return true;
        }
        return w;
      });
    }, 250);
    return () => clearInterval(interval);
  }, [idleMs, warningMs]);

  const continueSession = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningStartRef.current = 0;
    setWarning(false);
  }, []);

  return { warning, countdown, continueSession };
}

export default useIdleTimer;