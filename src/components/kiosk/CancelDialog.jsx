import React from "react";
import { X } from "lucide-react";
import KioskButton from "./KioskButton";
import { useLanguage } from "@/i18n/LanguageContext";

// Confirmation dialog shown when a driver taps Home during an active check-in.
export default function CancelDialog({ onContinue, onCancel }) {
  const { t } = useLanguage();
  return (
    <div className="absolute inset-0 z-50 bg-kiosk-bg/90 backdrop-blur-sm flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-2xl mx-8 rounded-2xl bg-kiosk-surface border border-kiosk-border p-10 text-center shadow-2xl">
        <div className="w-20 h-20 rounded-full bg-kiosk-danger/15 flex items-center justify-center mx-auto mb-6">
          <X className="w-12 h-12 text-kiosk-danger" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-4">{t("cancel.title")}</h2>
        <p className="text-2xl text-kiosk-muted mb-10">{t("cancel.message")}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <KioskButton variant="primary" size="lg" onClick={onContinue}>
            {t("cancel.continueCheckIn")}
          </KioskButton>
          <KioskButton variant="danger" size="lg" onClick={onCancel}>
            {t("cancel.cancelHome")}
          </KioskButton>
        </div>
      </div>
    </div>
  );
}