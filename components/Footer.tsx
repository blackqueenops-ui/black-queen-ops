"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="bg-surface-dark border-t border-border-dark">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gold rounded-sm flex items-center justify-center">
                <span className="text-white font-bold">Q</span>
              </div>
              <span className="font-semibold tracking-tight text-text-on-dark">
                Black Queen<span className="text-gold"> Ops</span>
              </span>
            </div>
            <p className="text-sm text-text-muted-on-dark max-w-xs">
              {t("footer.desc")}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold mb-3">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-text-muted-on-dark">
              <li><Link href="/about" className="hover:text-gold transition-colors">{t("nav.about")}</Link></li>
              <li><Link href="/services" className="hover:text-gold transition-colors">{t("nav.services")}</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">{t("nav.contact")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gold mb-3">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm text-text-muted-on-dark">
              <li><Link href="/privacy" className="hover:text-gold transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition-colors">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border-dark mt-10 pt-6 text-center text-xs text-text-muted-on-dark">
          &copy; {new Date().getFullYear()} Black Queen Ops. {t("footer.copy")}
        </div>
      </div>
    </footer>
  );
}
