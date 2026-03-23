"use client";

import { useLang } from "@/lib/i18n";

export default function LangSwitch() {
  const { lang, setLang } = useLang();

  return (
    <div className="flex items-center gap-1 border border-border-light rounded px-1 py-0.5">
      <button
        onClick={() => setLang("en")}
        className={`text-xs px-2 py-1 rounded transition-colors ${
          lang === "en"
            ? "bg-gold text-white font-medium"
            : "text-muted hover:text-heading"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLang("ru")}
        className={`text-xs px-2 py-1 rounded transition-colors ${
          lang === "ru"
            ? "bg-gold text-white font-medium"
            : "text-muted hover:text-heading"
        }`}
      >
        RU
      </button>
    </div>
  );
}
