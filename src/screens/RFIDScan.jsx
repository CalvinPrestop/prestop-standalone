import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { RFIDReaderService } from "@/services/hardware";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import ScanningArea from "@/components/kiosk/ScanningArea";
import SuccessBadge from "@/components/kiosk/SuccessBadge";
import InfoCard, { InfoRow } from "@/components/kiosk/InfoCard";
import KioskButton from "@/components/kiosk/KioskButton";

const DEMO_REF = "DEL-2026-00152";

export default function RFIDScan() {
  const { navigate, setIdentification } = useCheckInFlow();
  const { t } = useLanguage();
  const [state, setState] = useState("idle");
  const [data, setData] = useState(null);

  const handleSimulate = async () => {
    setState("scanning");
    const result = await RFIDReaderService.readRFID();
    setData(result);
    setState("success");
  };

  const handleContinue = () => {
    setIdentification(DEMO_REF, { cardId: data.cardId });
    navigate("deliveryLookup");
  };

  return (
    <ScreenLayout
      title={t("rfid.title")}
      subtitle={t("rfid.instruction")}
      footer={
        state === "success" ? (
          <KioskButton variant="success" size="xl" onClick={handleContinue}>
            {t("common.continue")}
          </KioskButton>
        ) : (
          <KioskButton variant="primary" size="lg" onClick={handleSimulate} disabled={state === "scanning"}>
            {t("rfid.simulate")}
          </KioskButton>
        )
      }
    >
      {state === "success" ? (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
          <SuccessBadge label={t("rfid.success")} size="xl" />
          <InfoCard accent className="w-full">
            <InfoRow label={t("rfid.cardId")} value={data.cardId} mono />
            <InfoRow label={t("rfid.driver")} value={data.driver} />
            <InfoRow label={t("rfid.company")} value={data.company} />
          </InfoCard>
        </div>
      ) : (
        <div className="relative w-full max-w-3xl aspect-[16/9] rounded-2xl border-4 border-kiosk-border bg-kiosk-header/60 overflow-hidden flex flex-col items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            {state === "scanning" && (
              <>
                <div className="absolute w-40 h-40 rounded-full border-4 border-kiosk-accent/40 animate-pulse-ring" />
                <div className="absolute w-40 h-40 rounded-full border-4 border-kiosk-accent/40 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
              </>
            )}
          </div>
          <CreditCard className="w-32 h-32 text-kiosk-muted/60" strokeWidth={1.5} />
          <p className="mt-6 text-2xl text-kiosk-muted font-medium">{t("rfid.waiting")}</p>
        </div>
      )}
    </ScreenLayout>
  );
}