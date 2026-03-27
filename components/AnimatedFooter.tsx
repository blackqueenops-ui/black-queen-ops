"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLang } from "@/lib/i18n";

export default function AnimatedFooter() {
  const { t } = useLang();
  const footerRef = useRef<HTMLDivElement>(null);
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
    const el = footerRef.current;
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

  return (
    <footer className="bg-surface-dark border-t border-border-dark">
      <div ref={footerRef} className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="md:col-span-2">
            <div
              className="flex items-center gap-2 mb-4"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? "translateX(0)" : "translateX(-20px)",
                transition: `opacity 500ms ${ease}, transform 500ms ${ease}`,
              }}
            >
              <div className="flex flex-col items-start leading-none">
                <span className="font-semibold tracking-tight text-text-on-dark">
                  Route<span className="text-gold">via</span>
                </span>
                <svg width="60" height="8" viewBox="0 0 72 10" fill="none" className="mt-0.5">
                  <path d="M8 1L3 5L8 9" stroke="#b8971f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                  <path d="M18 2L14 5L18 8" stroke="#b8971f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  <line x1="20" y1="5" x2="52" y2="5" stroke="#b8971f" strokeWidth="0.8" opacity="0.25" />
                  <circle cx="36" cy="5" r="2.2" fill="#b8971f" opacity="0.8" />
                  <path d="M54 2L58 5L54 8" stroke="#b8971f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
                  <path d="M64 1L69 5L64 9" stroke="#b8971f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                </svg>
              </div>
            </div>
            <p
              className="text-sm text-text-muted-on-dark max-w-xs"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? "translateX(0)" : "translateX(-20px)",
                transition: `opacity 500ms ${ease} 150ms, transform 500ms ${ease} 150ms`,
              }}
            >
              {t("footer.desc")}
            </p>
          </div>

          <div
            style={{
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 400ms ${ease} 200ms, transform 400ms ${ease} 200ms`,
            }}
          >
            <h4 className="text-sm font-semibold text-gold mb-3">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-text-muted-on-dark">
              <li><Link href="/about" className="footer-link">{t("nav.about")}</Link></li>
              <li><Link href="/services" className="footer-link">{t("nav.services")}</Link></li>
              <li><Link href="/contact" className="footer-link">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div
            style={{
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 400ms ${ease} 350ms, transform 400ms ${ease} 350ms`,
            }}
          >
            <h4 className="text-sm font-semibold text-gold mb-3">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm text-text-muted-on-dark">
              <li><Link href="/privacy" className="footer-link">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="footer-link">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 text-center text-xs text-text-muted-on-dark">
          <div
            className="border-t border-border-dark mb-6"
            style={{
              transformOrigin: "left center",
              transform: show ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms`,
            }}
          />
          &copy; {new Date().getFullYear()} Routevia. {t("footer.copy")}
        </div>
      </div>
    </footer>
  );
}
