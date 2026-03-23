import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Black Queen Ops",
};

export default function Terms() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h1 className="text-4xl font-bold mb-8 text-heading">Terms of Service</h1>
        <div className="space-y-6 text-foreground leading-relaxed">
          <p className="text-muted">Last updated: March 2026</p>

          <h2 className="text-xl font-semibold text-heading mt-8 mb-3">1. Services</h2>
          <p>
            Black Queen Ops provides fintech advisory, compliance consulting,
            merchant onboarding, and frontshop development services. Specific terms
            for each engagement are defined in individual service agreements.
          </p>

          <h2 className="text-xl font-semibold text-heading mt-8 mb-3">2. Use of Website</h2>
          <p>
            This website is provided for informational purposes. You agree not
            to use it for any unlawful purpose or in any way that could damage
            or impair the website.
          </p>

          <h2 className="text-xl font-semibold text-heading mt-8 mb-3">3. Intellectual Property</h2>
          <p>
            All content on this website, including text, graphics, logos, and
            design, is the property of Black Queen Ops and is protected by
            intellectual property laws.
          </p>

          <h2 className="text-xl font-semibold text-heading mt-8 mb-3">4. Limitation of Liability</h2>
          <p>
            Black Queen Ops shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of this website or our
            services, except as required by applicable law.
          </p>

          <h2 className="text-xl font-semibold text-heading mt-8 mb-3">5. Governing Law</h2>
          <p>
            These terms are governed by the laws of the European Union. Any
            disputes shall be resolved in the competent courts of the applicable
            jurisdiction.
          </p>

          <h2 className="text-xl font-semibold text-heading mt-8 mb-3">6. Contact</h2>
          <p>
            Questions about these terms? Contact us at{" "}
            <a href="mailto:info@blackqueenops.com" className="text-gold hover:text-gold-dark font-medium">
              info@blackqueenops.com
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
