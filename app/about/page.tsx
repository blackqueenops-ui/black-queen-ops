"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import RouteBackground from "@/components/RouteBackground";
import SectionConnector from "@/components/SectionConnector";

export default function About() {
  const { t } = useLang();

  return (
    <>
      {/* Hero — dark */}
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-20 overflow-hidden bg-surface-dark">
        <RouteBackground variant="flow" theme="dark" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-text-on-dark">
            {t("about.title1")}{" "}
            <span className="text-text-on-dark">Route</span><span className="text-gold">via</span>
          </h1>
          <p className="text-lg text-text-muted-on-dark max-w-2xl">
            {t("about.desc")}
          </p>
        </div>
      </section>

      {/* Mission & Vision — dark */}
      <section className="py-16 bg-surface-dark border-y border-border-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-6 md:gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-text-on-dark">{t("about.mission.title")}</h2>
            <p className="text-text-muted-on-dark leading-relaxed">{t("about.mission.desc")}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-text-on-dark">{t("about.vision.title")}</h2>
            <p className="text-text-muted-on-dark leading-relaxed">{t("about.vision.desc")}</p>
          </div>
        </div>
      </section>

      <SectionConnector />

      {/* Values — dark */}
      <section className="relative py-14 md:py-28 overflow-hidden bg-background">
        <RouteBackground variant="sparse" theme="dark" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-on-dark">{t("about.values.title")}</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-dark border border-border-dark rounded-lg p-4 sm:p-6 shadow-sm">
                <div className="w-8 h-1 bg-gold rounded mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-text-on-dark">{t(`about.values.${i}.title`)}</h3>
                <p className="text-sm text-text-muted-on-dark leading-relaxed">{t(`about.values.${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionConnector />

      {/* How it works */}
      <section className="relative py-14 md:py-28 bg-surface-dark-alt overflow-hidden">
        <RouteBackground variant="dense" theme="dark" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-on-dark">{t("process.title")}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-surface-dark border border-border-dark rounded-lg p-4 sm:p-6">
                <span className="font-mono text-xs text-gold opacity-50 tracking-widest">
                  {String(i).padStart(2, "0")}
                </span>
                <h3 className="text-base sm:text-lg font-bold mt-2 mb-2 text-text-on-dark">
                  {t(`process.${i}.step`)}
                </h3>
                <p className="text-sm text-text-muted-on-dark leading-relaxed">
                  {t(`process.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SectionConnector />

      {/* CTA — dark */}
      <section className="py-14 md:py-28 bg-surface-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-text-on-dark">{t("about.cta.title")}</h2>
          <p className="text-text-muted-on-dark mb-8 max-w-lg mx-auto">{t("about.cta.desc")}</p>
          <Link
            href="/contact"
            className="inline-block bg-gold text-heading px-8 py-3 rounded font-medium hover:bg-gold-light transition-colors"
          >
            {t("nav.cta")}
          </Link>
        </div>
      </section>
    </>
  );
}
