import React from "react";
import { Truck, Package, RefreshCw } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import ScreenLayout from "@/components/kiosk/ScreenLayout";

export default function ReasonForVisit() {
  const { setReason, navigate } = useCheckInFlow();
  const { t } = useLanguage();

  const options = [
    { key: "deliver", icon: Truck, title: t("reason.deliver"), desc: t("reason.deliverDesc") },
    { key: "pickup", icon: Package, title: t("reason.pickup"), desc: t("reason.pickupDesc") },
    { key: "other", icon: RefreshCw, title: t("reason.other"), desc: t("reason.otherDesc") },
  ];

  const choose = (key) => {
    setReason(key);
    navigate("identification");
  };

  return (
    <ScreenLayout title={t("reason.title")}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        {options.map((o) => (
          <button
            key={o.key}
            onClick={() => choose(o.key)}
            className="group flex flex-col items-center text-center bg-kiosk-surface border-2 border-kiosk-border rounded-2xl p-10 hover:border-kiosk-accent hover:bg-kiosk-panel transition-all active:scale-[0.97] animate-slide-up"
          >
            <div className="w-28 h-28 rounded-2xl bg-kiosk-accent/15 group-hover:bg-kiosk-accent/25 flex items-center justify-center mb-6 transition-colors">
              <o.icon className="w-16 h-16 text-kiosk-accent" strokeWidth={1.75} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-3">{o.title}</h3>
            <p className="text-xl text-kiosk-muted">{o.desc}</p>
          </button>
        ))}
      </div>
    </ScreenLayout>
  );
}