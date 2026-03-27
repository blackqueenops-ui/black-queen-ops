"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import RouteBackground from "@/components/RouteBackground";
import RouteHero from "@/components/RouteHero";
import OnboardingPipeline from "@/components/OnboardingPipeline";
import StatsCounter from "@/components/StatsCounter";
import CardReveal from "@/components/CardReveal";
import ServiceDemos from "@/components/ServiceDemos";
import StrategicSection from "@/components/StrategicSection";
import CTASection from "@/components/CTASection";
import SectionConnector from "@/components/SectionConnector";

export default function Home() {
  const { t } = useLang();

  return (
    <>
      {/* Hero */}
      <section className="relative pt-24 pb-16 md:pt-44 md:pb-32 overflow-hidden bg-[#0b0b0c]" style={{ minHeight: 'min(90vh, 800px)' }}>
        <RouteHero />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <p className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase mb-3 md:mb-4">
                {t("hero.tag")}
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 md:mb-6 text-text-on-dark">
                {t("hero.title1")}{" "}
                <span className="text-gold">{t("hero.title2")}</span>
              </h1>
              <p className="text-base md:text-lg lg:text-xl text-text-muted-on-dark mb-6 md:mb-8 max-w-xl">
                {t("hero.desc")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/contact"
                  className="border border-white/20 bg-white/5 text-text-on-dark px-5 sm:px-6 py-3 rounded font-medium hover:bg-white/10 transition-colors text-center text-sm sm:text-base"
                >
                  {t("hero.cta1")}
                </Link>
                <Link
                  href="/services"
                  className="border border-gold/30 text-gold px-5 sm:px-6 py-3 rounded font-medium hover:border-gold/60 transition-colors text-center text-sm sm:text-base"
                >
                  {t("hero.cta2")}
                </Link>
              </div>
            </div>

            {/* Pipeline — hidden on mobile */}
            <div className="hidden md:block h-[420px] lg:h-[520px]">
              <OnboardingPipeline />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border-dark bg-surface-dark">
        <StatsCounter
          labels={[
            t("stats.1.label"),
            t("stats.2.label"),
            t("stats.3.label"),
            t("stats.4.label"),
          ]}
        />
      </section>

      <SectionConnector />

      {/* Services Preview */}
      <section className="relative py-14 md:py-28 overflow-hidden bg-background">
        <RouteBackground variant="sparse" theme="dark" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-8 md:mb-14">
            <p className="text-gold text-xs sm:text-sm font-medium tracking-widest uppercase mb-2">
              {t("services.tag")}
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-heading">
              {t("services.title")}
            </h2>
          </div>

          <ServiceDemos
            titles={[
              t("services.1.title"),
              t("services.2.title"),
              t("services.3.title"),
            ] as [string, string, string]}
            descriptions={[
              t("services.1.desc"),
              t("services.2.desc"),
              t("services.3.desc"),
            ] as [string, string, string]}
          />

          <div className="text-center mt-8 md:mt-10">
            <Link href="/services" className="text-gold text-sm font-medium hover:text-gold-light transition-colors">
              {t("services.more")} &rarr;
            </Link>
          </div>
        </div>
      </section>

      <SectionConnector />

      {/* Why Us */}
      <section className="relative py-14 md:py-28 overflow-hidden" style={{ background: "linear-gradient(180deg, #18181c 0%, #141418 50%, #18181c 100%)" }}>
        <RouteBackground variant="flow" theme="dark" />
        {/* Subtle dot grid texture */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(rgba(184,151,31,0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />
        {/* Radial vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 0%, rgba(0,0,0,0.3) 100%)",
        }} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative" style={{ zIndex: 2 }}>
          <StrategicSection
            tag={t("why.tag")}
            title={t("why.title")}
            items={[1, 2, 3, 4].map((i) => ({
              title: t(`why.${i}.title`),
              desc: t(`why.${i}.desc`),
            }))}
          />
        </div>
      </section>

      <SectionConnector />

      {/* CTA */}
      <section className="relative py-14 md:py-28 overflow-hidden bg-surface-dark">
        <RouteBackground variant="default" theme="dark" />
        <CTASection
          title={t("cta.title")}
          desc={t("cta.desc")}
          buttonText={t("cta.button")}
        />
      </section>
    </>
  );
}
