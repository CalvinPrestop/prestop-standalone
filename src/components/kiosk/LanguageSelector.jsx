import React from "react";
import { useLanguage } from "@/i18n/LanguageContext";
import { cn } from "@/lib/utils";

// Large language selector shown on the Welcome screen.
export default function LanguageSelector() {
  const { lang, setLang, languages } = useLanguage();
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-xl text-kiosk-muted uppercase tracking-widest">{t("welcome.selectLanguage")}</p>
      <div className="flex flex-wrap justify-center gap-4">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className={cn(
              "flex items-center gap-3 px-8 py-5 rounded-xl border-2 text-2xl font-semibold transition-all active:scale-95",
              l.code === lang
                ? "bg-kiosk-accent border-kiosk-accent text-white shadow-lg shadow-kiosk-accent/30"
                : "bg-kiosk-surface border-kiosk-border text-white hover:bg-kiosk-panel"
            )}
          >
            <span className="text-3xl leading-none">{l.flag}</span>
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}