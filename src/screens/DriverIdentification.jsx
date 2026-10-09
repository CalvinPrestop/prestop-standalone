import React from "react";
import { BookUser, CreditCard, ScanBarcode, FileText } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import ScreenLayout from "@/components/kiosk/ScreenLayout";

export default function DriverIdentification() {
  const { navigate } = useCheckInFlow();
  const { t } = useLanguage();

  const options = [
    { key: "passport", icon: BookUser, title: t("identification.passport"), desc: t("identification.passportDesc"), screen: "passport" },
    { key: "rfid", icon: CreditCard, title: t("identification.rfid"), desc: t("identification.rfidDesc"), screen: "rfid" },
    { key: "barcode", icon: ScanBarcode, title: t("identification.barcode"), desc: t("identification.barcodeDesc"), screen: "barcode" },
    { key: "document", icon: FileText, title: t("identification.document"), desc: t("identification.documentDesc"), screen: "document" },
  ];

  return (
    <ScreenLayout title={t("identification.title")} subtitle={t("identification.instruction")}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-4xl">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => navigate(o.screen)}
            className="group flex items-center gap-6 text-left bg-kiosk-surface border-2 border-kiosk-border rounded-2xl p-8 hover:border-kiosk-accent hover:bg-kiosk-panel transition-all active:scale-[0.98] animate-slide-up"
          >
            <div className="w-24 h-24 shrink-0 rounded-2xl bg-kiosk-accent/15 group-hover:bg-kiosk-accent/25 flex items-center justify-center transition-colors">
              <o.icon className="w-14 h-14 text-kiosk-accent" strokeWidth={1.75} />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-2">{o.title}</h3>
              <p className="text-xl text-kiosk-muted">{o.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </ScreenLayout>
  );
}