import React from "react";
import { ArrowLeft, Home } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import KioskButton from "./KioskButton";

// Floating Back / Home controls shown on every workflow screen (not on Welcome).
export default function NavButtons({ showBack = true, showHome = true }) {
  const { goBack, requestHome, screen } = useCheckInFlow();
  const { t } = useLanguage();

  if (screen === "welcome") return null;

  return (
    <div className="absolute top-6 left-8 flex gap-4 z-20">
      {showBack && (
        <KioskButton variant="ghost" size="md" icon={ArrowLeft} onClick={goBack}>
          {t("common.back")}
        </KioskButton>
      )}
      {showHome && (
        <KioskButton variant="ghost" size="md" icon={Home} onClick={requestHome}>
          {t("common.home")}
        </KioskButton>
      )}
    </div>
  );
}