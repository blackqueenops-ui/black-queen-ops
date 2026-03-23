"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";
import ChessBackground from "@/components/ChessBackground";

export default function About() {
  const { t } = useLang();

  return (
    <>
      {/* Hero — dark */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden bg-surface-dark">
        <ChessBackground variant="strategy" theme="dark" />
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

      {/* Mission & Vision — light */}
      <section className="py-16 bg-white border-y border-border-light">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-heading">{t("about.mission.title")}</h2>
            <p className="text-foreground leading-relaxed">{t("about.mission.desc")}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 text-heading">{t("about.vision.title")}</h2>
            <p className="text-foreground leading-relaxed">{t("about.vision.desc")}</p>
          </div>
        </div>
      </section>

      {/* Values — light */}
      <section className="relative py-20 overflow-hidden bg-background">
        <ChessBackground variant="shield" theme="light" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <h2 className="text-3xl font-bold text-center mb-12 text-heading">{t("about.values.title")}</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white border border-border-light rounded-lg p-6 shadow-sm">
                <div className="w-8 h-1 bg-gold rounded mb-4" />
                <h3 className="font-semibold text-lg mb-2 text-heading">{t(`about.values.${i}.title`)}</h3>
                <p className="text-sm text-muted leading-relaxed">{t(`about.values.${i}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap — dark */}
      <section className="relative py-20 bg-surface-dark-alt overflow-hidden">
        <ChessBackground variant="speed" theme="dark" />
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

      {/* CTA — light */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-heading">{t("about.cta.title")}</h2>
          <p className="text-muted mb-8 max-w-lg mx-auto">{t("about.cta.desc")}</p>
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
