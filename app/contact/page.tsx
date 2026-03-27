"use client";

import { useLang } from "@/lib/i18n";
import RouteBackground from "@/components/RouteBackground";

export default function Contact() {
  const { t } = useLang();

  return (
    <>
      {/* Hero area — dark */}
      <section className="relative pt-24 pb-12 md:pt-40 md:pb-20 overflow-hidden bg-surface-dark">
        <RouteBackground variant="flow" theme="dark" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
              {t("contact.tag")}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-text-on-dark">
              {t("contact.title1")}{" "}
              <span className="text-gold">{t("contact.title2")}</span>
            </h1>
            <p className="text-lg text-text-muted-on-dark">{t("contact.desc")}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-12 max-w-4xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-bold mb-6 text-text-on-dark">{t("contact.info.title")}</h2>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gold font-medium mb-1">{t("contact.email")}</div>
                  <a href="mailto:info@routevia.com" className="text-text-muted-on-dark hover:text-gold transition-colors">
                    info@routevia.com
                  </a>
                </div>
                <div>
                  <div className="text-sm text-gold font-medium mb-1">{t("contact.telegram")}</div>
                  <a href="https://t.me/routevia" className="text-text-muted-on-dark hover:text-gold transition-colors">
                    @routevia
                  </a>
                </div>
                <div>
                  <div className="text-sm text-gold font-medium mb-1">{t("contact.linkedin")}</div>
                  <a href="https://linkedin.com/company/routevia" className="text-text-muted-on-dark hover:text-gold transition-colors">
                    Routevia
                  </a>
                </div>
                <div>
                  <div className="text-sm text-gold font-medium mb-1">{t("contact.location")}</div>
                  <p className="text-text-muted-on-dark">
                    {t("contact.location.value")}
                    <br />
                    <span className="text-text-muted-on-dark text-sm">{t("contact.location.sub")}</span>
                  </p>
                </div>
              </div>

              <div className="mt-10 p-5 bg-surface-dark-alt border border-border-dark rounded-lg">
                <h3 className="font-semibold mb-2 text-text-on-dark">{t("contact.response.title")}</h3>
                <p className="text-sm text-text-muted-on-dark">{t("contact.response.desc")}</p>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="text-xl font-bold mb-6 text-text-on-dark">{t("contact.form.title")}</h2>
              <form className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-text-muted-on-dark mb-1">{t("contact.form.name")}</label>
                  <input type="text" id="name" className="w-full bg-surface-dark-alt border border-border-dark rounded px-4 py-3 text-text-on-dark placeholder:text-text-muted-on-dark/50 focus:outline-none focus:border-gold transition-colors" placeholder={t("contact.form.name.ph")} />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-text-muted-on-dark mb-1">{t("contact.form.email")}</label>
                  <input type="email" id="email" className="w-full bg-surface-dark-alt border border-border-dark rounded px-4 py-3 text-text-on-dark placeholder:text-text-muted-on-dark/50 focus:outline-none focus:border-gold transition-colors" placeholder={t("contact.form.email.ph")} />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm text-text-muted-on-dark mb-1">{t("contact.form.company")}</label>
                  <input type="text" id="company" className="w-full bg-surface-dark-alt border border-border-dark rounded px-4 py-3 text-text-on-dark placeholder:text-text-muted-on-dark/50 focus:outline-none focus:border-gold transition-colors" placeholder={t("contact.form.company.ph")} />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm text-text-muted-on-dark mb-1">{t("contact.form.message")}</label>
                  <textarea id="message" rows={5} className="w-full bg-surface-dark-alt border border-border-dark rounded px-4 py-3 text-text-on-dark placeholder:text-text-muted-on-dark/50 focus:outline-none focus:border-gold transition-colors resize-none" placeholder={t("contact.form.message.ph")} />
                </div>
                <button type="submit" className="w-full bg-gold text-heading py-3 rounded font-medium hover:bg-gold-light transition-colors">
                  {t("contact.form.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
