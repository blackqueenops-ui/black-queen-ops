"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import ChessBackground from "@/components/ChessBackground";

export default function Home() {
  const { t } = useLang();

  return (
    <>
      {/* Hero — dark section */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden bg-surface-dark">
        <ChessBackground variant="strategy" theme="dark" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
              {t("hero.tag")}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-text-on-dark">
              {t("hero.title1")}{" "}
              <span className="text-gold">{t("hero.title2")}</span>
            </h1>
            <p className="text-lg md:text-xl text-text-muted-on-dark mb-8 max-w-2xl">
              {t("hero.desc")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-gold text-heading px-6 py-3 rounded font-medium hover:bg-gold-light transition-colors"
              >
                {t("hero.cta1")}
              </Link>
              <Link
                href="/services"
                className="border border-gold text-gold px-6 py-3 rounded font-medium hover:bg-gold hover:text-heading transition-colors"
              >
                {t("hero.cta2")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats — light */}
      <section className="border-y border-border-light bg-white">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold">
                {t(`stats.${i}.value`)}
              </div>
              <div className="text-sm text-muted mt-1">
                {t(`stats.${i}.label`)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Preview — light */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-background">
        <ChessBackground variant="shield" theme="light" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-14">
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-2">
              {t("services.tag")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-heading">
              {t("services.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => {
              const icons = [
                <path key="1" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" strokeLinecap="round" strokeLinejoin="round" />,
                <path key="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" />,
                <path key="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />,
              ];
              return (
                <div
                  key={i}
                  className="bg-white border border-border-light rounded-lg p-6 hover:border-gold transition-colors group shadow-sm"
                >
                  <div className="w-10 h-10 rounded bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
                      {icons[i - 1]}
                    </svg>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-heading">{t(`services.${i}.title`)}</h3>
                  <p className="text-sm text-muted leading-relaxed">{t(`services.${i}.desc`)}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/services" className="text-gold text-sm font-medium hover:text-gold-dark transition-colors">
              {t("services.more")} &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us — dark */}
      <section className="relative py-20 md:py-28 bg-surface-dark-alt overflow-hidden">
        <ChessBackground variant="speed" theme="dark" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-14">
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-2">
              {t("why.tag")}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-text-on-dark">
              {t("why.title")}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1 text-text-on-dark">{t(`why.${i}.title`)}</h3>
                  <p className="text-sm text-text-muted-on-dark leading-relaxed">{t(`why.${i}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — light */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-white">
        <ChessBackground variant="default" theme="light" />
        <div className="max-w-6xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-heading">
            {t("cta.title")}
          </h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">
            {t("cta.desc")}
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gold text-heading px-8 py-3 rounded font-medium hover:bg-gold-light transition-colors"
          >
            {t("cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
