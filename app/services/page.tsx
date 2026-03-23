import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services — Black Queen Ops",
  description:
    "Compliance consulting, payment solutions, strategic advisory, and more for digital businesses worldwide.",
};

export default function Services() {
  const services = [
    {
      title: "Compliance Consulting",
      desc: "Full-cycle compliance advisory: regulatory audits, framework development, risk assessment, and ongoing monitoring. We help you meet requirements across EU, UK, and global jurisdictions.",
      features: [
        "Regulatory landscape analysis",
        "Compliance framework design",
        "Risk assessment & mitigation",
        "Ongoing compliance monitoring",
        "Audit preparation & support",
      ],
    },
    {
      title: "Payment Solutions",
      desc: "Building storefronts and payment pathways for digital goods, eSIM, and online education platforms. We design flexible, trusted payment infrastructure for your business.",
      features: [
        "Payment gateway integration",
        "Storefront architecture",
        "Multi-currency support",
        "Fraud prevention strategy",
        "PSP & acquirer selection",
      ],
    },
    {
      title: "Strategic Advisory",
      desc: "High-level consulting on market positioning, contract strategy, and business development for e-commerce companies, marketplaces, and startups entering new markets.",
      features: [
        "Market entry strategy",
        "Contract & deal structuring",
        "Competitive positioning",
        "Partnership development",
        "Revenue optimization",
      ],
    },
    {
      title: "E-Commerce Consulting",
      desc: "End-to-end advisory for online businesses: from platform selection and merchant account setup to scaling operations and managing cross-border transactions.",
      features: [
        "Platform & tech stack advisory",
        "Merchant account optimization",
        "Cross-border operations",
        "Chargeback management",
        "Conversion optimization",
      ],
    },
    {
      title: "Risk Management",
      desc: "Comprehensive risk identification, assessment, and mitigation strategies. We protect your business from regulatory, financial, operational, and reputational threats.",
      features: [
        "Risk identification & mapping",
        "Financial risk controls",
        "Operational risk procedures",
        "Reputational risk management",
        "Insurance advisory (E&O, D&O, Cyber)",
      ],
    },
    {
      title: "Training & Education",
      desc: "Custom training programs, templates, and courses for your team on compliance, risk management, and fintech best practices.",
      features: [
        "Team compliance training",
        "Compliance templates & toolkits",
        "Industry best practices workshops",
        "Onboarding programs",
        "Knowledge base development",
      ],
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
            Our Services
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Comprehensive <span className="text-gold">Advisory</span> Solutions
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl">
            From compliance audits to payment infrastructure — we provide
            end-to-end support for digital businesses navigating complex
            regulatory environments.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((s) => (
              <div
                key={s.title}
                className="bg-surface border border-border rounded-lg p-8 hover:border-gold/30 transition-colors"
              >
                <h3 className="text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed mb-5">
                  {s.desc}
                </p>
                <ul className="space-y-2">
                  {s.features.map((f) => (
                    <li
                      key={f}
                      className="text-sm text-foreground/70 flex items-center gap-2"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gold shrink-0"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Model */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Flexible Pricing</h2>
          <p className="text-foreground/50 mb-10 max-w-lg mx-auto">
            We offer multiple engagement models to fit your business needs and
            budget.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                model: "Retainer",
                price: "From €3K/mo",
                desc: "Ongoing advisory and compliance support with dedicated team access.",
              },
              {
                model: "Project-Based",
                price: "Custom Quote",
                desc: "Fixed-scope engagements for audits, setups, and strategic initiatives.",
              },
              {
                model: "Revenue Share",
                price: "5-10%",
                desc: "Performance-aligned model where our success is tied to yours.",
              },
            ].map((p) => (
              <div
                key={p.model}
                className="border border-border rounded-lg p-6"
              >
                <div className="text-gold text-sm font-medium uppercase tracking-wider mb-2">
                  {p.model}
                </div>
                <div className="text-2xl font-bold mb-3">{p.price}</div>
                <p className="text-sm text-foreground/50">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Let&apos;s Discuss Your Needs
          </h2>
          <p className="text-foreground/50 mb-8 max-w-lg mx-auto">
            Every business is unique. Reach out and we&apos;ll craft a solution
            tailored to your specific requirements.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-gold text-black px-8 py-3 rounded font-medium hover:bg-gold-light transition-colors"
          >
            Request a Proposal
          </Link>
        </div>
      </section>
    </>
  );
}
