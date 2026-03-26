"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLang } from "@/lib/i18n";
import LangSwitch from "./LangSwitch";

/* ─── Animated Logo ─── */
function AnimatedLogo() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const alreadyAnimated = sessionStorage.getItem("logo_animated");
    if (alreadyAnimated) {
      el.classList.add("logo-no-animate");
      return;
    }

    const timer = setTimeout(() => {
      el.classList.add("logo-animated");

      const cleanup = setTimeout(() => {
        el.querySelectorAll<HTMLElement>("[class*='logo-']").forEach((node) => {
          node.style.willChange = "auto";
        });
        sessionStorage.setItem("logo_animated", "true");
      }, 1800);

      return () => clearTimeout(cleanup);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  const blackLetters = "BLACK".split("");
  const queenLetters = "QUEEN".split("");

  return (
    <div ref={wrapRef} className="logo-wrap">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 300 64"
        width="150"
        height="32"
        aria-label="Black Queen Ops"
        role="img"
      >
        <polygon className="logo-chevron" points="0,32 40,4 40,16 8,32 40,48 40,60 0,44" fill="#b8971f" />
        <polygon className="logo-chevron2" points="14,32 54,4 54,16 22,32 54,48 54,60 14,44" fill="#b8971f" opacity="0.32" />
        <line className="logo-line" x1="68" y1="32" x2="290" y2="32" stroke="#b8971f" strokeWidth="0.8" />
        <g fontFamily="Arial Narrow, Arial, sans-serif" fontWeight="700" fontSize="26">
          {blackLetters.map((ch, i) => (
            <text key={`b${i}`} className="logo-letter-black" x={68 + i * 20} y="18" dominantBaseline="central" fill="#0d0d0d">{ch}</text>
          ))}
        </g>
        <g fontFamily="Arial Narrow, Arial, sans-serif" fontWeight="700" fontSize="26">
          {queenLetters.map((ch, i) => (
            <text key={`q${i}`} className="logo-letter-queen" x={68 + i * 20} y="46" dominantBaseline="central" fill="#b8971f">{ch}</text>
          ))}
        </g>
        <text className="logo-ops" x="69" y="59" dominantBaseline="central" fill="#666666" fontFamily="Arial Narrow, Arial, sans-serif" fontSize="9" letterSpacing="10">OPS</text>
      </svg>
    </div>
  );
}

/* ─── Header ─── */
export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLang();

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 80);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "nav-scrolled"
          : "bg-white/90 backdrop-blur-md border-b border-border-light"
      }`}
    >
      <nav className={`max-w-6xl mx-auto px-6 flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-14" : "h-16"}`}>
        <Link href="/" className="flex items-center gap-2">
          <AnimatedLogo />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="nav-menu-link text-sm text-muted"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <LangSwitch />
          <Link
            href="/contact"
            className="btn-get-in-touch text-sm bg-gold text-heading font-medium px-4 py-2 rounded"
          >
            {t("nav.cta")}
          </Link>
        </div>

        {/* Mobile burger */}
        <div className="flex md:hidden items-center gap-3">
          <LangSwitch />
          <button
            className="text-heading"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-b border-border-light px-6 py-4">
          <ul className="flex flex-col gap-4">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-muted text-sm"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="btn-get-in-touch inline-block bg-gold text-heading font-medium px-4 py-2 rounded text-sm"
                onClick={() => setOpen(false)}
              >
                {t("nav.cta")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
