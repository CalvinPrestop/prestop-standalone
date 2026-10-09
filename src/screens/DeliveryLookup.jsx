import React from "react";
import { MapPin, Truck } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import InfoCard, { InfoRow } from "@/components/kiosk/InfoCard";
import KioskButton from "@/components/kiosk/KioskButton";

export default function DeliveryLookup() {
  const { delivery, navigate } = useCheckInFlow();
  const { t } = useLanguage();

  if (!delivery) return null;

  return (
    <ScreenLayout
      title={t("deliveryLookup.title")}
      footer={
        <KioskButton variant="success" size="xl" icon={Truck} iconRight onClick={() => navigate("optionalDoc")}>
          {t("deliveryLookup.confirm")}
        </KioskButton>
      }
    >
      <InfoCard accent className="max-w-2xl">
        <InfoRow label={t("deliveryLookup.driver")} value={delivery.driver} />
        <InfoRow label={t("deliveryLookup.transportCompany")} value={delivery.company} />
        <InfoRow label={t("deliveryLookup.deliveryRef")} value={delivery.reference} mono />
        <InfoRow label={t("deliveryLookup.purchaseOrder")} value={delivery.order} mono />
        <InfoRow label={t("deliveryLookup.destination")} value={delivery.warehouse} />
        <div className="flex justify-between items-center py-4 mt-2 border-t-2 border-kiosk-border/60">
          <span className="text-xl text-kiosk-muted">{t("deliveryLookup.assignedDock")}</span>
          <span className="flex items-center gap-2 text-3xl font-extrabold text-kiosk-success">
            <MapPin className="w-8 h-8" />
            {t("complete.dock")} {delivery.dock}
          </span>
        </div>
        <InfoRow label={t("deliveryLookup.status")} value={t("deliveryLookup.expected")} highlight />
      </InfoCard>
    </ScreenLayout>
  );
}