"use client";

import Link from "next/link";
import { useState } from "react";
import { useLang } from "@/lib/i18n";
import LangSwitch from "./LangSwitch";

export default function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/services", label: t("nav.services") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-light">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gold rounded-sm flex items-center justify-center">
            <span className="text-white font-bold text-lg">Q</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-heading">
            Black Queen<span className="text-gold"> Ops</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-8">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-muted hover:text-gold transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <LangSwitch />
          <Link
            href="/contact"
            className="text-sm bg-gold text-heading font-medium px-4 py-2 rounded hover:bg-gold-light transition-colors"
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
                  className="text-muted hover:text-gold transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact"
                className="inline-block bg-gold text-heading font-medium px-4 py-2 rounded hover:bg-gold-light transition-colors"
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
