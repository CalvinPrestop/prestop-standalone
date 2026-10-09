import React from "react";
import { cn } from "@/lib/utils";
import NavButtons from "./NavButtons";

// Standard layout for workflow screens: centered title/subtitle with floating nav controls.
export default function ScreenLayout({ title, subtitle = "", children, footer = null, showNav = true, className = "" }) {
  return (
    <div className="h-full w-full overflow-y-auto flex flex-col px-8 pt-6 pb-8 animate-fade-in">
      {showNav && <NavButtons />}
      <div className={cn("flex-1 flex flex-col items-center justify-center text-center gap-3 py-4", className)}>
        {title && <h2 className="text-5xl font-extrabold text-white mb-3 tracking-tight">{title}</h2>}
        {subtitle && <p className="text-2xl text-kiosk-muted mb-10 max-w-3xl">{subtitle}</p>}
        {children}
      </div>
      {footer && <div className="flex justify-center pb-2">{footer}</div>}
    </div>
  );
}