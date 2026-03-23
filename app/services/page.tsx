"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import ChessBackground from "@/components/ChessBackground";

export default function Services() {
  const { t } = useLang();

  return (
    <>
      {/* Hero — dark */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-surface-dark">
        <ChessBackground variant="strategy" theme="dark" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
            {t("srvpage.tag")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-on-dark">
            {t("srvpage.title1")}{" "}
            <span className="text-gold">{t("srvpage.title2")}</span>
          </h1>
          <p className="text-lg text-text-muted-on-dark max-w-2xl">
            {t("srvpage.desc")}
          </p>
        </div>
      </section>

      {/* Services Grid — light */}
      <section className="relative py-20 overflow-hidden bg-background">
        <ChessBackground variant="shield" theme="light" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white border border-border-light rounded-lg p-8 hover:border-gold transition-colors shadow-sm"
              >
                <h3 className="text-xl font-bold mb-3 text-heading">{t(`srvpage.s${i}.title`)}</h3>
                <p className="text-sm text-muted leading-relaxed mb-5">
                  {t(`srvpage.s${i}.desc`)}
                </p>
                <ul className="space-y-2">
                  {t(`srvpage.s${i}.f`).split("|").map((f) => (
                    <li key={f} className="text-sm text-foreground flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold shrink-0">
                        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — dark */}
      <section className="py-20 bg-surface-dark-alt">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-text-on-dark">{t("pricing.title")}</h2>
          <p className="text-text-muted-on-dark mb-10 max-w-lg mx-auto">{t("pricing.desc")}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border-dark rounded-lg p-6 hover:border-gold transition-colors">
                <div className="text-gold text-sm font-medium uppercase tracking-wider mb-2">
                  {t(`pricing.${i}.model`)}
                </div>
                <div className="text-2xl font-bold mb-3 text-text-on-dark">{t(`pricing.${i}.price`)}</div>
                <p className="text-sm text-text-muted-on-dark">{t(`pricing.${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — light */}
      <section className="relative py-20 overflow-hidden bg-white">
        <ChessBackground variant="default" theme="light" />
        <div className="max-w-6xl mx-auto px-6 text-center relative">
          <h2 className="text-3xl font-bold mb-4 text-heading">{t("srvpage.cta.title")}</h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">{t("srvpage.cta.desc")}</p>
          <Link
            href="/contact"
            className="inline-block bg-gold text-heading px-8 py-3 rounded font-medium hover:bg-gold-light transition-colors"
          >
            {t("srvpage.cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
