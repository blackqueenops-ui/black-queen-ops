"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import RouteBackground from "@/components/RouteBackground";
import PricingSection from "@/components/PricingSection";
import SectionConnector from "@/components/SectionConnector";

export default function Services() {
  const { t } = useLang();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-20 overflow-hidden bg-surface-dark">
        <RouteBackground variant="flow" theme="dark" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
            {t("srvpage.tag")}
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-text-on-dark">
            {t("srvpage.title1")}{" "}
            <span className="text-gold">{t("srvpage.title2")}</span>
          </h1>
          <p className="text-lg text-text-muted-on-dark max-w-2xl">
            {t("srvpage.desc")}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-14 md:py-20 overflow-hidden bg-background">
        <RouteBackground variant="sparse" theme="dark" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-surface-dark-alt border border-border-dark rounded-lg p-5 sm:p-8 hover:border-gold/30 transition-colors"
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

      <SectionConnector />

      {/* Pricing */}
      <section className="py-14 md:py-20 bg-surface-dark-alt">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <PricingSection />
        </div>
      </section>

      <SectionConnector />

      {/* CTA */}
      <section className="relative py-14 md:py-20 overflow-hidden bg-surface-dark">
        <RouteBackground variant="default" theme="dark" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center relative">
          <h2 className="text-3xl font-bold mb-4 text-text-on-dark">{t("srvpage.cta.title")}</h2>
          <p className="text-text-muted-on-dark mb-8 max-w-lg mx-auto">{t("srvpage.cta.desc")}</p>
          <Link
            href="/contact"
            className="inline-block border border-white/20 bg-white/5 text-text-on-dark px-6 sm:px-8 py-3 rounded font-medium hover:bg-white/10 transition-colors"
          >
            {t("srvpage.cta.button")}
          </Link>
        </div>
      </section>
    </>
  );
}
