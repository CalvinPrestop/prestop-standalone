import React, { useEffect, useRef, useState } from "react";
import { CheckCircle2, Volume2 } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { SpeakerService } from "@/services/hardware";
import InfoCard, { InfoRow } from "@/components/kiosk/InfoCard";
import KioskButton from "@/components/kiosk/KioskButton";

export default function CheckInComplete() {
  const { delivery, reset } = useCheckInFlow();
  const { t, lang } = useLanguage();
  const [speaking, setSpeaking] = useState(false);
  const timerRef = useRef(null);

  // Auto-return to Welcome after ~15 seconds.
  useEffect(() => {
    timerRef.current = setTimeout(() => reset(), 15000);
    return () => {
      clearTimeout(timerRef.current);
      SpeakerService.stop();
    };
  }, [reset]);

  if (!delivery) return null;

  const dockWord = String(Number(delivery.dock));

  const handlePlayDirections = async () => {
    setSpeaking(true);
    await SpeakerService.speakMessage(t("complete.spoken", { dock: dockWord }), lang);
    setSpeaking(false);
  };

  return (
    <div className="h-full w-full overflow-y-auto flex flex-col items-center px-8 py-4 animate-fade-in">
      <div className="flex flex-col items-center gap-2 mb-4">
        <div className="w-16 h-16 rounded-full bg-kiosk-success/15 flex items-center justify-center animate-scale-in">
          <CheckCircle2 className="w-10 h-10 text-kiosk-success" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-extrabold text-kiosk-success tracking-tight">{t("complete.title")}</h1>
      </div>

      <div className="mb-4 text-center">
        <div className="text-xl text-kiosk-muted uppercase tracking-widest mb-2">{t("complete.dock")}</div>
        <div className="text-6xl font-extrabold text-white leading-none">{delivery.dock}</div>
      </div>

      <p className="text-2xl text-white font-semibold mb-4 text-center max-w-3xl">
        {t("complete.proceed", { warehouse: delivery.warehouse, dock: delivery.dock })}
      </p>

      <InfoCard className="max-w-4xl mb-4 p-4 completion-details">
        <InfoRow label={t("complete.driver")} value={delivery.driver} />
        <InfoRow label={t("complete.company")} value={delivery.company} />
        <InfoRow label={t("complete.delivery")} value={delivery.reference} mono />
        <InfoRow label={t("complete.dockLabel")} value={delivery.dock} highlight />
      </InfoCard>

      <div className="flex flex-col items-center gap-3">
        <KioskButton variant="primary" size="md" icon={Volume2} onClick={handlePlayDirections} disabled={speaking}>
          {t("complete.playDirections")}
        </KioskButton>
        <p className="text-lg text-kiosk-muted">{t("complete.thankYou")}</p>
        <KioskButton variant="ghost" size="md" onClick={reset}>
          {t("complete.finish")}
        </KioskButton>
      </div>
    </div>
  );
}