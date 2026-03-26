"use client";

import { useLang } from "@/lib/i18n";

export default function LangSwitch() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 border border-border-light rounded px-1 py-0.5">
      <button
        onClick={() => setLang("en")}
        className={`lang-btn text-xs px-2 py-1 rounded ${
          lang === "en"
            ? "lang-btn-active bg-gold text-white font-medium"
            : "lang-btn-inactive text-muted"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ru")}
        className={`lang-btn text-xs px-2 py-1 rounded ${
          lang === "ru"
            ? "lang-btn-active bg-gold text-white font-medium"
            : "lang-btn-inactive text-muted"
        }`}
      >
        RU
      </button>
    </div>
  );
}
