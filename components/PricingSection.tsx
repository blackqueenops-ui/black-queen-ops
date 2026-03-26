"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

const FEATURES_KEYS = [
  ["pricing.1.f1", "pricing.1.f2", "pricing.1.f3", "pricing.1.f4"],
  ["pricing.2.f1", "pricing.2.f2", "pricing.2.f3", "pricing.2.f4"],
  ["pricing.3.f1", "pricing.3.f2", "pricing.3.f3", "pricing.3.f4"],
];

const CTA_KEYS = ["pricing.1.cta", "pricing.2.cta", "pricing.3.cta"];

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-gold shrink-0"
    >
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PricingSection() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      if (entries[0].isIntersecting) {
        setStarted(true);
        observer.disconnect();
      }
    },
    []
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.15,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const show = started || reduced;
  const ease = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

  function fadeUp(delay: number) {
    return show
      ? {
          opacity: 1,
          transform: "translateY(0)",
          transition: `opacity 500ms ${ease} ${delay}ms, transform 500ms ${ease} ${delay}ms`,
        }
      : {
          opacity: 0,
          transform: "translateY(20px)",
        };
  }

  const cards = [
    { key: 1, featured: false },
    { key: 2, featured: true },
    { key: 3, featured: false },
  ];

  // Header animation finishes around 400ms, cards start after
  const headerDone = 400;

  return (
    <div ref={sectionRef}>
      {/* Header */}
      <div className="text-center mb-14">
        <p
          className="text-gold text-sm font-medium tracking-widest uppercase mb-2"
          style={fadeUp(0)}
        >
          {t("pricing.tag")}
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold text-text-on-dark mb-4"
          style={fadeUp(100)}
        >
          {t("pricing.title")}
        </h2>
        <p
          className="text-text-muted-on-dark max-w-lg mx-auto"
          style={fadeUp(200)}
        >
          {t("pricing.desc")}
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {cards.map((card, i) => (
          <div
            key={card.key}
            className={`relative rounded-lg p-6 flex flex-col ${
              card.featured
                ? "border-2 border-gold bg-surface-dark"
                : "border border-border-dark bg-surface-dark-alt"
            } hover:border-gold transition-colors duration-250`}
            style={fadeUp(headerDone + i * 100)}
          >
            {/* Most popular badge */}
            {card.featured && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-heading text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                {t("pricing.popular")}
              </div>
            )}

            {/* Tag */}
            <div className="text-gold text-xs font-medium uppercase tracking-widest mb-3">
              {t(`pricing.${card.key}.tag`)}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-text-on-dark mb-2">
              {t(`pricing.${card.key}.title`)}
            </h3>

            {/* Description */}
            <p className="text-sm text-text-muted-on-dark mb-6">
              {t(`pricing.${card.key}.desc`)}
            </p>

            {/* Features */}
            <ul className="space-y-3 mb-8 flex-1">
              {FEATURES_KEYS[i].map((fk) => (
                <li
                  key={fk}
                  className="text-sm text-text-on-dark flex items-center gap-2"
                >
                  <CheckIcon />
                  {t(fk)}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/contact"
              className={`block text-center text-sm font-medium px-4 py-2.5 rounded transition-all duration-200 ${
                card.featured
                  ? "bg-gold text-heading hover:brightness-110"
                  : "border border-gold/40 text-gold hover:bg-gold/10"
              }`}
            >
              {t(CTA_KEYS[i])}
            </Link>
          </div>
        ))}
      </div>

      {/* Footer note */}
      <p
        className="text-center text-sm text-text-muted-on-dark max-w-lg mx-auto"
        style={fadeUp(headerDone + 300)}
      >
        {t("pricing.footer")}
      </p>
    </div>
  );
}
