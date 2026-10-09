import React, { useState } from "react";
import { BookUser } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { PassportReaderService } from "@/services/hardware";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import ScanningArea from "@/components/kiosk/ScanningArea";
import SuccessBadge from "@/components/kiosk/SuccessBadge";
import InfoCard, { InfoRow } from "@/components/kiosk/InfoCard";
import KioskButton from "@/components/kiosk/KioskButton";

const DEMO_REF = "DEL-2026-00152";

export default function PassportScan() {
  const { navigate, setIdentification } = useCheckInFlow();
  const { t } = useLanguage();
  const [state, setState] = useState("idle"); // idle | scanning | success
  const [data, setData] = useState(null);

  const handleSimulate = async () => {
    setState("scanning");
    const result = await PassportReaderService.scanPassport();
    setData(result);
    setState("success");
  };

  const handleContinue = () => {
    setIdentification(DEMO_REF, {
      nationality: data.nationality,
      documentType: data.documentType,
      documentNumber: data.documentNumber,
      dateOfBirth: data.dateOfBirth,
    });
    navigate("deliveryLookup");
  };

  return (
    <ScreenLayout
      title={t("passport.title")}
      subtitle={t("passport.instruction")}
      footer={
        state === "success" ? (
          <KioskButton variant="success" size="xl" onClick={handleContinue}>
            {t("common.continue")}
          </KioskButton>
        ) : (
          <KioskButton variant="primary" size="lg" onClick={handleSimulate} disabled={state === "scanning"}>
            {t("passport.simulate")}
          </KioskButton>
        )
      }
    >
      {state === "success" ? (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
          <SuccessBadge label={t("passport.success")} size="xl" />
          <InfoCard accent className="w-full">
            <InfoRow label={t("passport.name")} value={data.name} />
            <InfoRow label={t("passport.nationality")} value={data.nationality} />
            <InfoRow label={t("passport.documentType")} value={data.documentType} />
            <InfoRow label={t("passport.documentNumber")} value={data.documentNumber} mono />
            <InfoRow label={t("passport.dateOfBirth")} value={data.dateOfBirth} />
          </InfoCard>
          <p className="text-2xl font-bold text-kiosk-success">{t("passport.verified")} ✓</p>
        </div>
      ) : (
        <ScanningArea icon={BookUser} label={state === "scanning" ? t("passport.waiting") : t("passport.waiting")} scanning={state === "scanning"} />
      )}
    </ScreenLayout>
  );
}