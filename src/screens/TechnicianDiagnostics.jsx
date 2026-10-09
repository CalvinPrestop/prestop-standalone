import React, { useState } from "react";
import {
  BookUser,
  FileText,
  ScanBarcode,
  CreditCard,
  Mic,
  Volume2,
  Monitor,
  CheckCircle2,
  Wrench,
  Loader2,
} from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  PassportReaderService,
  DocumentScannerService,
  BarcodeScannerService,
  RFIDReaderService,
  MicrophoneService,
  SpeakerService,
} from "@/services/hardware";
import KioskButton from "@/components/kiosk/KioskButton";


// Hidden technician / hardware diagnostics screen.
// Devices are explicitly marked SIMULATED here.
const buildDevices = (t) => [
  { key: "passport", icon: BookUser, name: t("technician.devices.passport"), test: () => PassportReaderService.scanPassport() },
  { key: "document", icon: FileText, name: t("technician.devices.document"), test: () => DocumentScannerService.scanDocument() },
  { key: "barcode", icon: ScanBarcode, name: t("technician.devices.barcode"), test: () => BarcodeScannerService.readBarcode() },
  { key: "rfid", icon: CreditCard, name: t("technician.devices.rfid"), test: () => RFIDReaderService.readRFID() },
  { key: "microphone", icon: Mic, name: t("technician.devices.microphone"), test: () => MicrophoneService.simulateVoiceDetection() },
  { key: "speaker", icon: Volume2, name: t("technician.devices.speaker"), test: () => SpeakerService.speakMessage("Test", "en") },
  { key: "touchscreen", icon: Monitor, name: t("technician.devices.touchscreen"), test: () => Promise.resolve(true) },
];

export default function TechnicianDiagnostics({ onExit }) {
  const { t } = useLanguage();
  const [results, setResults] = useState({}); // key -> 'testing' | 'pass'
  const [runningAll, setRunningAll] = useState(false);
  const devices = buildDevices(t);

  const runOne = async (key, test) => {
    setResults((r) => ({ ...r, [key]: "testing" }));
    await test();
    setResults((r) => ({ ...r, [key]: "pass" }));
  };

  const runAll = async () => {
    setRunningAll(true);
    setResults({});
    for (const d of devices) {
      setResults((r) => ({ ...r, [d.key]: "testing" }));
      await d.test();
      setResults((r) => ({ ...r, [d.key]: "pass" }));
    }
    setRunningAll(false);
  };

  const allPassed = devices.every((d) => results[d.key] === "pass");

  return (
    <div className="h-full w-full flex flex-col px-8 py-6 animate-fade-in overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-kiosk-warning/15 flex items-center justify-center">
            <Wrench className="w-8 h-8 text-kiosk-warning" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-white">{t("technician.title")}</h2>
            <p className="text-lg text-kiosk-muted">Technician Mode</p>
          </div>
        </div>
        <KioskButton variant="ghost" size="md" onClick={onExit}>
          {t("technician.exit")}
        </KioskButton>
      </div>

      <div className="flex justify-end mb-6">
        <KioskButton variant="primary" size="lg" onClick={runAll} disabled={runningAll} icon={runningAll ? Loader2 : undefined}>
          {runningAll ? t("technician.testing") : t("technician.runAll")}
        </KioskButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {devices.map((d) => {
          const status = results[d.key];
          return (
            <div key={d.key} className="bg-kiosk-surface border border-kiosk-border rounded-2xl p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-kiosk-accent/15 flex items-center justify-center">
                  <d.icon className="w-8 h-8 text-kiosk-accent" strokeWidth={2} />
                </div>
                {status === "pass" ? (
                  <CheckCircle2 className="w-9 h-9 text-kiosk-success" strokeWidth={2.5} />
                ) : status === "testing" ? (
                  <Loader2 className="w-9 h-9 text-kiosk-accent animate-spin" />
                ) : (
                  <span className="px-3 py-1 rounded-full bg-kiosk-warning/15 text-kiosk-warning text-sm font-bold">
                    {t("technician.simulated")}
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{d.name}</h3>
              <p className="text-base text-kiosk-muted mb-5">
                {status === "pass" ? t("technician.ready") : t("technician.simulated")} / {t("technician.ready")}
              </p>
              <KioskButton
                variant="dark"
                size="md"
                onClick={() => runOne(d.key, d.test)}
                disabled={status === "testing" || runningAll}
              >
                {t("technician.testDevice")}
              </KioskButton>
            </div>
          );
        })}
      </div>

      {allPassed && (
        <div className="mt-8 flex flex-col items-center gap-3 animate-scale-in">
          <div className="flex items-center gap-2 text-3xl font-extrabold text-kiosk-success">
            <CheckCircle2 className="w-9 h-9" strokeWidth={2.5} />
            {t("technician.allOperational")}
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xl text-white max-w-4xl">
            {devices.map((d) => (
              <span key={d.key} className="flex items-center gap-1">
                {d.name.toUpperCase()} <CheckCircle2 className="w-5 h-5 text-kiosk-success" />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}