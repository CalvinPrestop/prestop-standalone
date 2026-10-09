import React from "react";
import { AlertTriangle } from "lucide-react";
import KioskButton from "./KioskButton";
import { useLanguage } from "@/i18n/LanguageContext";

// Full-screen overlay shown when the kiosk has been idle for too long.
export default function IdleWarning({ countdown, onContinue }) {
  const { t } = useLanguage();
  return (
    <div className="absolute inset-0 z-50 bg-kiosk-bg/95 backdrop-blur-sm flex flex-col items-center justify-center animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-kiosk-warning/20 flex items-center justify-center mb-8">
        <AlertTriangle className="w-14 h-14 text-kiosk-warning" strokeWidth={2.5} />
      </div>
      <h2 className="text-5xl font-extrabold text-white mb-4">{t("idle.title")}</h2>
      <p className="text-2xl text-kiosk-muted mb-2">{t("idle.message")}</p>
      <p className="text-2xl text-kiosk-warning font-semibold mb-10">
        {t("idle.ending")} {countdown}s
      </p>
      <KioskButton variant="warning" size="xl" onClick={onContinue}>
        {t("idle.continue")}
      </KioskButton>
    </div>
  );
}