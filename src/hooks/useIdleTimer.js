import { useCallback, useEffect, useRef, useState } from "react";

export function useIdleTimer({ idleMs = 90000, warningMs = 15000, onTimeout, enabled = true }) {
  const [warning, setWarning] = useState(false);
  const [countdown, setCountdown] = useState(Math.ceil(warningMs / 1000));
  const lastActivity = useRef(Date.now());
  const warningStart = useRef(0);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const continueSession = useCallback(() => {
    lastActivity.current = Date.now();
    warningStart.current = 0;
    setWarning(false);
  }, []);

  useEffect(() => {
    continueSession();
    if (!enabled) return;
    const events = ["pointerdown", "pointermove", "keydown", "touchstart", "wheel"];
    events.forEach((event) => window.addEventListener(event, continueSession, { passive: true }));
    const interval = setInterval(() => {
      const now = Date.now();
      if (warningStart.current) {
        const left = Math.max(0, Math.ceil((warningMs - (now - warningStart.current)) / 1000));
        setCountdown(left);
        if (left === 0) {
          continueSession();
          onTimeoutRef.current?.();
        }
      } else if (now - lastActivity.current >= idleMs) {
        warningStart.current = now;
        setCountdown(Math.ceil(warningMs / 1000));
        setWarning(true);
      }
    }, 250);
    return () => {
      clearInterval(interval);
      events.forEach((event) => window.removeEventListener(event, continueSession));
    };
  }, [enabled, idleMs, warningMs, continueSession]);

  return { warning, countdown, continueSession };
}

export default useIdleTimer;
