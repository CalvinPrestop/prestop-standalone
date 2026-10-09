import React from "react";
import { cn } from "@/lib/utils";

// Animated scanning area used by the passport / RFID / barcode / document demos.
export default function ScanningArea({ icon: Icon, label, scanning, className, children }) {
  return (
    <div
      className={cn(
        "relative w-full max-w-3xl aspect-[16/9] rounded-2xl border-4 border-kiosk-border bg-kiosk-header/60 overflow-hidden flex flex-col items-center justify-center",
        className
      )}
    >
      {/* Corner markers */}
      <div className="absolute top-4 left-4 w-10 h-10 border-l-4 border-t-4 border-kiosk-accent/70 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-10 h-10 border-r-4 border-t-4 border-kiosk-accent/70 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-10 h-10 border-l-4 border-b-4 border-kiosk-accent/70 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-10 h-10 border-r-4 border-b-4 border-kiosk-accent/70 rounded-br-lg" />

      {Icon && (
        <Icon
          className={cn("w-32 h-32 text-kiosk-muted transition-opacity duration-300", scanning ? "opacity-30" : "opacity-60")}
          strokeWidth={1.5}
        />
      )}
      {label && <p className="mt-6 text-2xl text-kiosk-muted font-medium">{label}</p>}
      {children}

      {scanning && (
        <>
          <div className="absolute inset-0 bg-kiosk-accent/5" />
          <div
            className="absolute left-6 right-6 h-1 rounded-full bg-kiosk-accent shadow-[0_0_24px_6px_rgba(37,99,235,0.7)] animate-scan-line"
            style={{ top: "0%" }}
          />
        </>
      )}
    </div>
  );
}