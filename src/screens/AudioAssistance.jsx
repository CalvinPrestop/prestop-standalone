import React, { useEffect, useRef, useState } from "react";
import { Volume2, Mic } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import { SpeakerService, MicrophoneService } from "@/services/hardware";
import ScreenLayout from "@/components/kiosk/ScreenLayout";
import SuccessBadge from "@/components/kiosk/SuccessBadge";
import KioskButton from "@/components/kiosk/KioskButton";
import { cn } from "@/lib/utils";

export default function AudioAssistance() {
  const { navigate, delivery } = useCheckInFlow();
  const { t, lang } = useLanguage();

  const [speaking, setSpeaking] = useState(false);
  const [micState, setMicState] = useState("idle"); // idle | listening | denied | detected
  const [level, setLevel] = useState(0);
  const micRef = useRef(null);
  const micAttempt = useRef(0);

  useEffect(() => {
    return () => {
      micAttempt.current += 1;
      micRef.current?.stop();
      SpeakerService.stop();
    };
  }, []);

  const handlePlay = async () => {
    setSpeaking(true);
    await SpeakerService.speakMessage(t("audio.spoken", { dock: String(Number(delivery?.dock ?? 4)) }), lang);
    setSpeaking(false);
  };

  const handleStartMic = async () => {
    const attempt = ++micAttempt.current;
    setMicState("listening");
    try {
      const controller = await MicrophoneService.detectMicrophone((lvl) => {
        if (attempt !== micAttempt.current) return;
        setLevel(lvl);
        if (lvl > 0.12) {
          // Visually confirm detection after a brief moment of real input.
          setMicState("detected");
          micRef.current?.stop();
        }
      });
      if (attempt !== micAttempt.current) controller.stop();
      else micRef.current = controller;
    } catch {
      if (attempt !== micAttempt.current) return;
      setMicState("denied");
    }
  };

  const handleSimulateVoice = async () => {
    const attempt = ++micAttempt.current;
    setMicState("listening");
    micRef.current?.stop();
    micRef.current = null;
    await MicrophoneService.simulateVoiceDetection();
    if (attempt !== micAttempt.current) return;
    setMicState("detected");
  };

  const handleContinue = () => navigate("complete");

  return (
    <ScreenLayout
      title={t("audio.title")}
      footer={
        <KioskButton variant="success" size="xl" onClick={handleContinue} >
          {t("common.continue")}
        </KioskButton>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
        {/* Speaker test */}
        <div className="bg-kiosk-surface border border-kiosk-border rounded-2xl p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-kiosk-accent/15 flex items-center justify-center mb-5">
            <Volume2 className={cn("w-12 h-12 text-kiosk-accent", speaking && "animate-pulse")} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">{t("audio.speakerTest")}</h3>
          <KioskButton variant="primary" size="md" onClick={handlePlay} disabled={speaking}>
            {t("audio.playInstruction")}
          </KioskButton>
          {speaking && (
            <p className="mt-5 text-lg text-kiosk-muted italic max-w-xs">"{t("audio.spoken", { dock: String(Number(delivery?.dock ?? 4)) })}"</p>
          )}
        </div>

        {/* Microphone test */}
        <div className="bg-kiosk-surface border border-kiosk-border rounded-2xl p-8 flex flex-col items-center text-center">
          {micState === "detected" ? (
            <SuccessBadge label={t("audio.voiceDetected")} />
          ) : (
            <>
              <div className="w-20 h-20 rounded-2xl bg-kiosk-accent/15 flex items-center justify-center mb-5">
                <Mic className={cn("w-12 h-12 text-kiosk-accent", micState === "listening" && "animate-pulse")} strokeWidth={2} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t("audio.micTest")}</h3>
              <p className="text-lg text-kiosk-muted mb-4">{t("audio.micInstruction")}</p>

              {micState === "listening" && (
                <div className="flex items-end gap-1 h-12 mb-4">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div
                      key={i}
                      className="w-2 rounded-full bg-kiosk-accent transition-all duration-100"
                      style={{ height: `${Math.max(8, Math.min(100, level * 320 * (1 - Math.abs(i - 3.5) / 4)))}%` }}
                    />
                  ))}
                </div>
              )}
              {micState === "listening" && <p className="text-xl text-kiosk-accent font-semibold mb-4">{t("audio.listening")}</p>}
              {micState === "denied" && <p className="text-base text-kiosk-warning mb-4 max-w-xs">{t("audio.micDenied")}</p>}

              <div className="flex flex-col gap-3">
                <KioskButton variant="primary" size="md" onClick={handleStartMic} disabled={micState === "listening"}>
                  {t("audio.startMic")}
                </KioskButton>
                <KioskButton variant="ghost" size="md" onClick={handleSimulateVoice}>
                  {t("audio.simulateVoice")}
                </KioskButton>
              </div>
            </>
          )}
        </div>
      </div>
    </ScreenLayout>
  );
}