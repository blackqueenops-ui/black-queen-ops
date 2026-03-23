import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Black Queen Ops",
  description:
    "Learn about Black Queen Ops, our mission, values, and the team behind our international fintech advisory firm.",
};

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
            About Us
          </p>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Building Trust in the{" "}
            <span className="text-gold">Digital Economy</span>
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl">
            Black Queen Ops is an international fintech advisory firm where
            expertise is valued and fairly rewarded. We create flexible, trusted
            pathways for entrepreneurs and partners worldwide.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-foreground/60 leading-relaxed">
              To create a space where expertise is valued and fairly
              compensated. We provide high-quality advisory services, respect
              contracts and obligations, and ensure every team member is rewarded
              based on merit.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
            <p className="text-foreground/60 leading-relaxed">
              To become the trusted benchmark for businesses navigating complex
              regulatory landscapes — standing at the intersection of markets
              and providing clients with both tactical and strategic
              perspectives for collaboration.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">
            What We Stand For
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Transparency",
                desc: "Long-term, transparent contracts with partners. No hidden fees, no surprises. We build relationships on trust.",
              },
              {
                title: "Fair Compensation",
                desc: "Every specialist receives fair reward for their expertise. Mentorship, bonuses, and growth opportunities for all team members.",
              },
              {
                title: "Excellence",
                desc: "SLA compliance above 95%, monthly reporting, response within 48 hours. We hold ourselves to the highest standards.",
              },
            ].map((v) => (
              <div
                key={v.title}
                className="bg-surface border border-border rounded-lg p-6"
              >
                <div className="w-8 h-1 bg-gold rounded mb-4" />
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-foreground/50 leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-20 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Our Roadmap</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                year: "Year 1",
                title: "Foundation",
                items: [
                  "Establish market presence",
                  "Build core advisory team",
                  "Launch mentorship programs",
                  "Secure partner contracts",
                ],
              },
              {
                year: "Year 2",
                title: "Scale",
                items: [
                  "Launch enterprise product",
                  "Build compliance team (3-5 specialists)",
                  "Create reserve fund",
                  "Expand service offerings",
                ],
              },
              {
                year: "Year 3",
                title: "Invest & Expand",
                items: [
                  "Invest in e-commerce & AI projects",
                  "ROI assessment model",
                  "International expansion",
                  "Full-service advisory firm",
                ],
              },
            ].map((phase) => (
              <div key={phase.year} className="relative">
                <div className="text-gold text-sm font-medium tracking-widest uppercase mb-1">
                  {phase.year}
                </div>
                <h3 className="text-xl font-bold mb-4">{phase.title}</h3>
                <ul className="space-y-2">
                  {phase.items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-foreground/50 flex gap-2"
                    >
                      <span className="text-gold mt-1">&#x2022;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to Work With Us?</h2>
          <p className="text-foreground/50 mb-8 max-w-lg mx-auto">
            Whether you&apos;re a potential client or a talented professional
            looking to join our team, we&apos;d love to hear from you.
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
