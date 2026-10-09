import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations, languages } from "./translations";

const LanguageContext = createContext(null);

function resolve(obj, path) {
  return path.split(".").reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // t("path.to.key", { var: value }) — supports {var} interpolation. Falls back to English, then to the key.
  const t = useCallback(
    (key, vars) => {
      let str = resolve(translations[lang], key) ?? resolve(translations.en, key) ?? key;
      if (vars) {
        Object.entries(vars).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, "g"), v);
        });
      }
      return str;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}

export default LanguageContext;