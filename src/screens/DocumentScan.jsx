import React, { useState } from "react";
import { FileText } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { DocumentScannerService } from "@/services/hardware";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import ScanningArea from "@/components/kiosk/ScanningArea";
import SuccessBadge from "@/components/kiosk/SuccessBadge";

import KioskButton from "@/components/kiosk/KioskButton";

const DEMO_REF = "DEL-2026-00152";

export default function DocumentScan() {
  const { navigate, setIdentification } = useCheckInFlow();
  const { t } = useLanguage();
  const [state, setState] = useState("idle");
  const [data, setData] = useState(null);

  const handleSimulate = async () => {
    setState("scanning");
    const result = await DocumentScannerService.scanDocument();
    setData(result);
    setState("success");
  };

  const handleContinue = () => {
    setIdentification(DEMO_REF);
    navigate("deliveryLookup");
  };

  return (
    <ScreenLayout
      title={t("document.title")}
      subtitle={t("document.instruction")}
      footer={
        state === "success" ? (
          <KioskButton variant="success" size="xl" onClick={handleContinue}>
            {t("common.continue")}
          </KioskButton>
        ) : (
          <KioskButton variant="primary" size="lg" onClick={handleSimulate} disabled={state === "scanning"}>
            {t("document.simulate")}
          </KioskButton>
        )
      }
    >
      {state === "success" ? (
        <div className="flex flex-col items-center gap-8 w-full max-w-2xl">
          <SuccessBadge label={t("document.success")} size="xl" />
          {/* Fake scanned document preview */}
          <div className="w-full max-w-xl rounded-xl bg-white/95 p-8 shadow-2xl text-left">
            <div className="flex justify-between items-start border-b-2 border-slate-300 pb-4 mb-4">
              <div>
                <div className="text-lg font-bold text-slate-800">{data.transportCompany}</div>
                <div className="text-sm text-slate-500">Delivery Note</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Ref</div>
                <div className="text-lg font-mono font-bold text-slate-800">{data.deliveryReference}</div>
              </div>
            </div>
            <div className="space-y-2 text-slate-700">
              <div className="flex justify-between"><span>Order:</span><span className="font-mono font-semibold">{data.orderNumber}</span></div>
              <div className="flex justify-between"><span>Destination:</span><span className="font-semibold">{data.destination}</span></div>
            </div>
          </div>
        </div>
      ) : (
        <ScanningArea icon={FileText} label={t("document.waiting")} scanning={state === "scanning"} />
      )}
    </ScreenLayout>
  );
}