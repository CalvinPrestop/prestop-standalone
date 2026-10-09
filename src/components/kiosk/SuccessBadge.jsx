import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SuccessBadge({ label, size = "lg" }) {
  const dim = size === "xl" ? "w-32 h-32" : "w-24 h-24";
  const icon = size === "xl" ? "w-20 h-20" : "w-16 h-16";
  return (
    <div className="flex flex-col items-center gap-4 animate-scale-in">
      <div className={cn("rounded-full bg-kiosk-success/15 flex items-center justify-center", dim)}>
        <CheckCircle2 className={cn(icon, "text-kiosk-success")} strokeWidth={2.5} />
      </div>
      {label && <p className="text-3xl font-bold text-kiosk-success">{label}</p>}
    </div>
  );
}