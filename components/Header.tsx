"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useLang } from "@/lib/i18n";
import LangSwitch from "./LangSwitch";

/* ─── Routevia Logo — Nested Brackets ─── */
function RouteviaLogo() {
  return (
    <div className="flex flex-col items-start leading-none">
      {/* Wordmark */}
      <span className="font-semibold text-lg tracking-tight text-text-on-dark">
        Route<span className="text-gold">via</span>
      </span>
      {/* Nested brackets with node underneath */}
      <svg width="72" height="10" viewBox="0 0 72 10" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-0.5">
        {/* Outer left bracket */}
        <path d="M8 1L3 5L8 9" stroke="#b8971f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
        {/* Inner left bracket */}
        <path d="M18 2L14 5L18 8" stroke="#b8971f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        {/* Center line */}
        <line x1="20" y1="5" x2="52" y2="5" stroke="#b8971f" strokeWidth="0.8" opacity="0.25" />
        {/* Center node */}
        <circle cx="36" cy="5" r="2.2" fill="#b8971f" opacity="0.8" />
        {/* Inner right bracket */}
        <path d="M54 2L58 5L54 8" stroke="#b8971f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
        {/* Outer right bracket */}
        <path d="M64 1L69 5L64 9" stroke="#b8971f" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
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
          : "bg-surface-dark/90 backdrop-blur-md border-b border-border-dark"
      }`}
    >
      <nav className={`max-w-6xl mx-auto px-6 flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-14" : "h-16"}`}>
        <Link href="/" className="flex items-center gap-2">
          <RouteviaLogo />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="nav-menu-link text-sm text-muted">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <LangSwitch />
          <Link
            href="/contact"
            className="btn-get-in-touch text-sm border border-gold/30 text-text-on-dark font-medium px-4 py-2 rounded hover:border-gold/60"
          >
            {t("nav.cta")}
          </Link>
        </div>

        {/* Mobile burger */}
        <div className="flex md:hidden items-center gap-3">
          <LangSwitch />
          <button
            className="text-text-on-dark"
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
        <div className="md:hidden bg-surface-dark border-b border-border-dark px-4 sm:px-6 py-4 max-h-[70vh] overflow-y-auto">
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
                className="btn-get-in-touch inline-block border border-gold/30 text-text-on-dark font-medium px-4 py-2 rounded text-sm"
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
