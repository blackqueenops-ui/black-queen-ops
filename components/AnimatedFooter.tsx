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
      <div ref={footerRef} className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo + description */}
          <div className="md:col-span-2">
            <div
              className="flex items-center gap-2 mb-4"
              style={{
                opacity: show ? 1 : 0,
                transform: show ? "translateX(0)" : "translateX(-20px)",
                transition: `opacity 500ms ${ease}, transform 500ms ${ease}`,
              }}
            >
              <div className="w-7 h-7 bg-gold rounded-sm flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </div>
              <span className="font-semibold tracking-tight text-text-on-dark">
                Black Queen<span className="text-gold"> Ops</span>
              </span>
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

          {/* Company column */}
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

          {/* Legal column */}
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

        {/* Divider line */}
        <div className="mt-10 pt-6 text-center text-xs text-text-muted-on-dark">
          <div
            className="border-t border-border-dark mb-6"
            style={{
              transformOrigin: "left center",
              transform: show ? "scaleX(1)" : "scaleX(0)",
              transition: `transform 800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms`,
            }}
          />
          &copy; {new Date().getFullYear()} Black Queen Ops. {t("footer.copy")}
        </div>
      </div>
    </footer>
  );
}
