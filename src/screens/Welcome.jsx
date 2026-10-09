import React from "react";
import { ArrowRight, Check } from "lucide-react";
import { useCheckInFlow } from "@/context/CheckInFlowContext";
import { useLanguage } from "@/i18n/LanguageContext";
import KioskButton from "@/components/kiosk/KioskButton";
import LanguageSelector from "@/components/kiosk/LanguageSelector";
import { Image } from "@/components/ui/image";

// Illustrated logistics scene for the hero panel (generated, hosted on app storage).
const SCENE_URL =
  "https://media.base44.com/images/public/6ac6246fddc6e72453373b83/47584732a_generated_image.png";

// Faded full-screen background video: truck backing into the loading dock door.
const BG_VIDEO_URL =
  "https://media.base44.com/videos/public/6ac6246fddc6e72453373b83/4dc5e4eb1_Truck_backing_into_dock.mp4";

export default function Welcome() {
  const { startCheckIn } = useCheckInFlow();
  const { t } = useLanguage();

  const features = [
    { key: "fast", label: t("welcome.features.fast") },
    { key: "secure", label: t("welcome.features.secure") },
    { key: "touch", label: t("welcome.features.touch") },
  ];
  const steps = [
    t("welcome.steps.s1"),
    t("welcome.steps.s2"),
    t("welcome.steps.s3"),
    t("welcome.steps.s4"),
  ];

  return (
    <div className="relative h-full w-full overflow-hidden animate-fade-in">
      {/* Faded background video — truck backing into the dock, blended into the theme */}
      <div className="absolute inset-0 pointer-events-none">
        <video
          src={BG_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-kiosk-bg/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-kiosk-bg via-kiosk-bg/45 to-kiosk-bg/20" />
      </div>

      <div className="relative z-10 h-full w-full flex flex-col">
      {/* Hero — two columns */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 px-12 pt-8 pb-6 min-h-0">
        {/* Left: call to action */}
        <div className="flex flex-col justify-center max-w-2xl">
          <h1 className="text-7xl xl:text-8xl font-extrabold text-white tracking-tight leading-none mb-4">
            {t("welcome.title")}
          </h1>
          <p className="text-4xl xl:text-5xl text-kiosk-accent font-bold mb-6">{t("welcome.subtitle")}</p>
          <p className="text-2xl text-kiosk-muted mb-10 max-w-xl">{t("welcome.supporting")}</p>

          <KioskButton
            variant="primary"
            size="xl"
            icon={ArrowRight}
            iconRight
            onClick={startCheckIn}
            className="self-start px-16 py-10 text-4xl rounded-2xl"
          >
            {t("welcome.start")}
          </KioskButton>

          <p className="text-lg text-kiosk-muted/80 mt-6 max-w-xl">{t("welcome.helper")}</p>

          <div className="flex flex-wrap gap-x-6 gap-y-3 mt-8">
            {features.map((f) => (
              <div key={f.key} className="flex items-center gap-2 text-lg text-white/90">
                <span className="w-6 h-6 rounded-full bg-kiosk-success/20 flex items-center justify-center">
                  <Check className="w-4 h-4 text-kiosk-success" strokeWidth={3} />
                </span>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Right: logistics visual panel */}
        <div className="relative rounded-3xl overflow-hidden border border-kiosk-border shadow-2xl min-h-[320px]">
          <div className="absolute inset-0">
            <Image src={SCENE_URL} fittingType="fill" className="block w-full h-full" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a33] via-[#0a1a33]/30 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-kiosk-header/85 backdrop-blur-sm border border-kiosk-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2.5 h-2.5 rounded-full bg-kiosk-success animate-pulse" />
              <h3 className="text-xl font-extrabold text-white tracking-wider">{t("welcome.arrivingDriver")}</h3>
            </div>
            <ol className="grid grid-cols-2 gap-x-6 gap-y-2">
              {steps.map((s, i) => (
                <li key={i} className="flex items-center gap-3 text-lg text-white/90">
                  <span className="w-7 h-7 shrink-0 rounded-full bg-kiosk-accent flex items-center justify-center text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Language selection */}
      <div className="px-12 pb-5">
        <LanguageSelector />
      </div>

      </div>
    </div>
  );
}