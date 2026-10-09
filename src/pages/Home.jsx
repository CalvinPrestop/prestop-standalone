import React, { useState } from "react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { CheckInFlowProvider, useCheckInFlow } from "@/context/CheckInFlowContext";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import GlobalHeader from "@/components/kiosk/GlobalHeader";
import IdleWarning from "@/components/kiosk/IdleWarning";
import CancelDialog from "@/components/kiosk/CancelDialog";

import Welcome from "@/screens/Welcome";
import ReasonForVisit from "@/screens/ReasonForVisit";
import DriverIdentification from "@/screens/DriverIdentification";
import PassportScan from "@/screens/PassportScan";
import RFIDScan from "@/screens/RFIDScan";
import BarcodeScan from "@/screens/BarcodeScan";
import DocumentScan from "@/screens/DocumentScan";
import DeliveryLookup from "@/screens/DeliveryLookup";
import OptionalDocumentScan from "@/screens/OptionalDocumentScan";
import AudioAssistance from "@/screens/AudioAssistance";
import CheckInComplete from "@/screens/CheckInComplete";
import TechnicianDiagnostics from "@/screens/TechnicianDiagnostics";

const SCREENS = {
  welcome: Welcome,
  reason: ReasonForVisit,
  identification: DriverIdentification,
  passport: PassportScan,
  rfid: RFIDScan,
  barcode: BarcodeScan,
  document: DocumentScan,
  deliveryLookup: DeliveryLookup,
  optionalDoc: OptionalDocumentScan,
  audio: AudioAssistance,
  complete: CheckInComplete,
};

function KioskShell() {
  const { screen, reset, cancelOpen, closeCancel, confirmCancel } = useCheckInFlow();
  const [technician, setTechnician] = useState(false);
  const [logoTaps, setLogoTaps] = useState([]);

  const { warning, countdown, continueSession } = useIdleTimer({
    idleMs: 60000,
    warningMs: 15000,
    onTimeout: () => {
      reset();
      setTechnician(false);
    },
  });

  const handleLogoTap = () => {
    const now = Date.now();
    setLogoTaps((prev) => {
      const recent = [...prev, now].filter((t) => now - t < 2500);
      if (recent.length >= 5) {
        setTechnician(true);
        return [];
      }
      return recent;
    });
  };

  const Screen = technician ? (
    <TechnicianDiagnostics onExit={() => setTechnician(false)} />
  ) : (
    (() => {
      const Comp = SCREENS[screen] || Welcome;
      return <Comp />;
    })()
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-kiosk-bg text-white overflow-hidden">
      <GlobalHeader onLogoTap={handleLogoTap} />
      <main className="flex-1 relative overflow-hidden">{Screen}</main>
      {warning && <IdleWarning countdown={countdown} onContinue={continueSession} />}
      {cancelOpen && <CancelDialog onContinue={closeCancel} onCancel={confirmCancel} />}
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <CheckInFlowProvider>
        <KioskShell />
      </CheckInFlowProvider>
    </LanguageProvider>
  );
}