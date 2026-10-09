import React, { createContext, useContext, useState, useCallback } from "react";
import { findDelivery } from "@/data/deliveries";

const CheckInFlowContext = createContext(null);

export function CheckInFlowProvider({ children }) {
  const [screen, setScreen] = useState("welcome");
  const [history, setHistory] = useState(["welcome"]);
  const [reason, setReason] = useState(null);
  const [driver, setDriver] = useState(null);
  const [delivery, setDelivery] = useState(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  const navigate = useCallback((next) => {
    setScreen(next);
    setHistory((h) => [...h, next]);
  }, []);

  const goBack = useCallback(() => {
    setHistory((h) => {
      if (h.length <= 1) return h;
      const next = h.slice(0, -1);
      setScreen(next[next.length - 1]);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setScreen("welcome");
    setHistory(["welcome"]);
    setReason(null);
    setDriver(null);
    setDelivery(null);
    setCancelOpen(false);
  }, []);

  const startCheckIn = useCallback(() => {
    setReason(null);
    setDriver(null);
    setDelivery(null);
    setScreen("reason");
    setHistory(["welcome", "reason"]);
  }, []);

  // Sets the matched delivery and driver info after a successful identification.
  const setIdentification = useCallback((deliveryRef, extraDriver = {}) => {
    const d = findDelivery(deliveryRef);
    if (!d) throw new Error(`Unknown demo delivery: ${deliveryRef}`);
    setDelivery(d);
    setDriver({ name: d.driver, ...extraDriver });
  }, []);

  const requestHome = useCallback(() => {
    setCancelOpen(true);
  }, []);
  const closeCancel = useCallback(() => setCancelOpen(false), []);
  const confirmCancel = useCallback(() => {
    setCancelOpen(false);
    reset();
  }, [reset]);

  const value = {
    screen,
    reason,
    driver,
    delivery,
    cancelOpen,
    navigate,
    goBack,
    reset,
    startCheckIn,
    setReason,
    setIdentification,
    setDelivery,
    setDriver,
    requestHome,
    closeCancel,
    confirmCancel,
  };

  return <CheckInFlowContext.Provider value={value}>{children}</CheckInFlowContext.Provider>;
}

export function useCheckInFlow() {
  const ctx = useContext(CheckInFlowContext);
  if (!ctx) throw new Error("useCheckInFlow must be used within CheckInFlowProvider");
  return ctx;
}

export default CheckInFlowContext;