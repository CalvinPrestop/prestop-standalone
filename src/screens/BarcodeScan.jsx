import React, { useState } from "react";
import { ScanBarcode } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { BarcodeScannerService } from "@/services/hardware";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import ScanningArea from "@/components/kiosk/ScanningArea";
import SuccessBadge from "@/components/kiosk/SuccessBadge";
import InfoCard, { InfoRow } from "@/components/kiosk/InfoCard";
import KioskButton from "@/components/kiosk/KioskButton";

export default function BarcodeScan() {
  const { navigate, setIdentification } = useCheckInFlow();
  const { t } = useLanguage();
  const [state, setState] = useState("idle");
  const [data, setData] = useState(null);

  const handleSimulate = async () => {
    setState("scanning");
    const result = await BarcodeScannerService.readBarcode();
    setData(result);
    setState("success");
  };

  const handleContinue = () => {
    setIdentification(data.deliveryReference);
    navigate("deliveryLookup");
  };

  return (
    <ScreenLayout
      title={t("barcode.title")}
      subtitle={t("barcode.instruction")}
      footer={
        state === "success" ? (
          <KioskButton variant="success" size="xl" onClick={handleContinue}>
            {t("common.continue")}
          </KioskButton>
        ) : (
          <KioskButton variant="primary" size="lg" onClick={handleSimulate} disabled={state === "scanning"}>
            {t("barcode.simulate")}
          </KioskButton>
        )
      }
    >
      {state === "success" ? (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
          <SuccessBadge label={t("barcode.success")} size="xl" />
          <InfoCard accent className="w-full">
            <InfoRow label={t("barcode.deliveryRef")} value={data.deliveryReference} mono />
            <InfoRow label={t("barcode.order")} value={data.order} mono />
            <InfoRow label={t("barcode.company")} value={data.company} />
            <InfoRow label={t("barcode.destination")} value={data.destination} />
          </InfoCard>
        </div>
      ) : (
        <ScanningArea icon={ScanBarcode} label={t("barcode.waiting")} scanning={state === "scanning"} />
      )}
    </ScreenLayout>
  );
}