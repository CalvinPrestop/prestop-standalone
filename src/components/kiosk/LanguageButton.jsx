import React, { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/i18n/LanguageContext";

export default function LanguageButton() {
  const { lang, setLang, languages } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = languages.find((l) => l.code === lang);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-5 py-3 rounded-lg bg-kiosk-surface border border-kiosk-border hover:bg-kiosk-panel text-white text-lg transition-colors"
      >
        <Globe className="w-6 h-6 text-kiosk-muted" />
        <span className="text-2xl leading-none">{current.flag}</span>
        <ChevronDown className={cn("w-5 h-5 text-kiosk-muted transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-60 rounded-xl bg-kiosk-surface border border-kiosk-border overflow-hidden z-40 shadow-2xl">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-4 text-xl hover:bg-kiosk-panel transition-colors",
                  l.code === lang ? "text-kiosk-accent font-semibold" : "text-white"
                )}
              >
                <span className="text-2xl leading-none">{l.flag}</span>
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}