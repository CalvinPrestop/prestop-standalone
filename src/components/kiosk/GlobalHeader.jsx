import React from "react";
import { Truck } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import LanguageButton from "./LanguageButton";

export default function GlobalHeader({ onLogoTap }) {
  const { t } = useLanguage();
  return (
    <header className="h-20 shrink-0 bg-kiosk-header border-b border-kiosk-border flex items-center justify-between px-8 select-none">
      <button onClick={onLogoTap} className="flex items-center gap-3 active:scale-95 transition-transform">
        <div className="w-12 h-12 rounded-lg bg-kiosk-accent flex items-center justify-center shadow-lg shadow-kiosk-accent/30">
          <Truck className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="text-left leading-tight">
          <div className="text-2xl font-extrabold tracking-wider text-white">PRESTOP LOGISTICS</div>
          <div className="text-xs text-kiosk-muted tracking-[0.2em] uppercase font-semibold">{t("header.subtitle")}</div>
        </div>
      </button>
      <LanguageButton />
    </header>
  );
}