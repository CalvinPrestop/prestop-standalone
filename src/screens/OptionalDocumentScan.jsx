import React, { useState } from "react";
import { FileText } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { DocumentScannerService } from "@/services/hardware";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import ScanningArea from "@/components/kiosk/ScanningArea";
import SuccessBadge from "@/components/kiosk/SuccessBadge";
import KioskButton from "@/components/kiosk/KioskButton";

export default function OptionalDocumentScan() {
  const { navigate } = useCheckInFlow();
  const { t } = useLanguage();
  const [state, setState] = useState("idle"); // idle | scanning | success

  const handleScan = async () => {
    setState("scanning");
    await DocumentScannerService.scanDocument();
    setState("success");
  };

  const handleContinue = () => navigate("audio");

  return (
    <ScreenLayout
      title={t("optionalDoc.title")}
      subtitle={t("optionalDoc.instruction")}
      footer={
        state === "success" ? (
          <KioskButton variant="success" size="xl" onClick={handleContinue}>
            {t("common.continue")}
          </KioskButton>
        ) : (
          <div className="flex gap-4">
            <KioskButton variant="primary" size="lg" icon={FileText} onClick={handleScan} disabled={state === "scanning"}>
              {t("optionalDoc.scan")}
            </KioskButton>
            <KioskButton variant="ghost" size="lg" onClick={handleContinue}>
              {t("common.skip")}
            </KioskButton>
          </div>
        )
      }
    >
      {state === "success" ? (
        <SuccessBadge label={t("optionalDoc.scanned")} size="xl" />
      ) : (
        <ScanningArea icon={FileText} label={state === "scanning" ? t("document.waiting") : t("document.waiting")} scanning={state === "scanning"} />
      )}
    </ScreenLayout>
  );
}