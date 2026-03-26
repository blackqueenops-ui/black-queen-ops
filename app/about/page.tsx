"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import RouteBackground from "@/components/RouteBackground";

export default function About() {
  const { t } = useLang();

  return (
    <>
      {/* Hero — dark */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-surface-dark">
        <RouteBackground variant="flow" theme="dark" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
            {t("about.tag")}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-on-dark">
            {t("about.title1")}{" "}
            <span className="text-gold">{t("about.title2")}</span>
          </h1>
          <p className="text-lg text-text-muted-on-dark max-w-2xl">
            {t("about.desc")}
          </p>
        </div>
      </section>

      {/* Mission & Vision — dark */}
      <section className="py-16 bg-surface-dark border-y border-border-dark">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
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

      {/* Values — dark */}
      <section className="relative py-20 overflow-hidden bg-background">
        <RouteBackground variant="sparse" theme="dark" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-on-dark">{t("about.values.title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-dark border border-border-dark rounded-lg p-6 shadow-sm">
                <div className="w-8 h-1 bg-gold rounded mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-text-on-dark">{t(`about.values.${i}.title`)}</h3>
                <p className="text-sm text-text-muted-on-dark leading-relaxed">{t(`about.values.${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap — dark */}
      <section className="relative py-20 bg-surface-dark-alt overflow-hidden">
        <RouteBackground variant="dense" theme="dark" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-on-dark">{t("roadmap.title")}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="text-gold text-sm font-medium tracking-widest uppercase mb-1">
                  {t(`roadmap.${i}.year`)}
                </div>
                <h3 className="text-xl font-bold mb-4 text-text-on-dark">{t(`roadmap.${i}.title`)}</h3>
                <ul className="space-y-2">
                  {t(`roadmap.${i}.items`).split("|").map((item) => (
                    <li key={item} className="text-sm text-text-muted-on-dark flex gap-2">
                      <span className="text-gold mt-0.5">&#x2022;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — dark */}
      <section className="py-20 bg-surface-dark">
        <div className="max-w-6xl mx-auto px-6 text-center">
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
