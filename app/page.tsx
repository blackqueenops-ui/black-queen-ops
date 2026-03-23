import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--gold)_0%,_transparent_60%)] opacity-[0.07]" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="max-w-3xl">
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
              Fintech Advisory &amp; Compliance
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Where Expertise Meets{" "}
              <span className="text-gold">Fair Reward</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground/60 mb-8 max-w-2xl">
              Black Queen Ops is an international advisory firm specializing in
              e-commerce compliance, payment solutions, and strategic consulting
              for digital businesses worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-gold text-black px-6 py-3 rounded font-medium hover:bg-gold-light transition-colors"
              >
                Schedule a Consultation
              </Link>
              <Link
                href="/services"
                className="border border-gold/40 text-gold px-6 py-3 rounded font-medium hover:bg-gold/10 transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface">
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "$10B+", label: "Risk & Compliance Market" },
            { value: "EU & UK", label: "Jurisdictions Covered" },
            { value: "95%+", label: "SLA Compliance" },
            { value: "120%+", label: "Campaign ROI Target" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gold">
                {stat.value}
              </div>
              <div className="text-sm text-foreground/50 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-2">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Advisory &amp; Compliance Services
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Compliance Consulting",
                desc: "Navigate complex regulatory landscapes across EU, UK, and global markets. We audit, advise, and build compliance frameworks tailored to your business.",
                icon: (
                  <path
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
              {
                title: "Payment Solutions",
                desc: "Storefronts and payment pathways for digital goods, eSIM, and online education. Flexible, trusted solutions for entrepreneurs and partners.",
                icon: (
                  <path
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
              {
                title: "Strategic Advisory",
                desc: "Risk assessment, contract strategy, and market positioning for e-commerce companies, marketplaces, exporters, and startups.",
                icon: (
                  <path
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ),
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-surface border border-border rounded-lg p-6 hover:border-gold/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-gold"
                  >
                    {s.icon}
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/services"
              className="text-gold text-sm hover:text-gold-light transition-colors"
            >
              View All Services &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-20 md:py-28 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-2">
              Why Black Queen
            </p>
            <h2 className="text-3xl md:text-4xl font-bold">
              Your Strategic Advantage
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Deep Fintech Expertise",
                desc: "Years of hands-on experience in e-commerce, payment processing, and regulatory compliance across multiple jurisdictions.",
              },
              {
                title: "Agile & Flexible",
                desc: "Unlike Big4 firms, we offer personalized attention, faster turnaround, and willingness to work with emerging market segments.",
              },
              {
                title: "Results-Driven Model",
                desc: "Our revenue share and performance-based pricing aligns our success with yours. We win when you win.",
              },
              {
                title: "International Reach",
                desc: "EU, UK, and global market coverage with local expertise. Multilingual team ready to support your cross-border operations.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-2 h-2 rounded-full bg-gold mt-2 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-foreground/50 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Scale Your Business?
          </h2>
          <p className="text-foreground/50 mb-8 max-w-lg mx-auto">
            Let&apos;s discuss how Black Queen Ops can help you navigate
            compliance, optimize payments, and grow globally.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gold text-black px-8 py-3 rounded font-medium hover:bg-gold-light transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
