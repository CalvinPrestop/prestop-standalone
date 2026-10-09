import React from "react";
import { cn } from "@/lib/utils";

export function InfoRow({ label, value, highlight = false, mono = false }) {
  return (
    <div className="flex justify-between items-center py-4 border-b border-kiosk-border/40 last:border-0 gap-6">
      <span className="text-xl text-kiosk-muted whitespace-nowrap">{label}</span>
      <span
        className={cn(
          "text-xl font-semibold text-right",
          highlight ? "text-kiosk-success" : "text-white",
          mono && "font-mono tracking-wide"
        )}
      >
        {value}
      </span>
    </div>
  );
}

export default function InfoCard({ title = "", children, className = "", accent = false }) {
  return (
    <div
      className={cn(
        "w-full max-w-2xl rounded-2xl bg-kiosk-surface border border-kiosk-border p-8 shadow-2xl",
        accent && "border-kiosk-success/50",
        className
      )}
    >
      {title && <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}