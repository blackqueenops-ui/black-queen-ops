import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Routevia",
};

export default function Privacy() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-16 bg-surface-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-8 text-text-on-dark">Privacy Policy</h1>
        <div className="space-y-6 text-text-muted-on-dark leading-relaxed">
          <p className="text-text-muted-on-dark">Last updated: March 2026</p>

          <h2 className="text-xl font-semibold text-text-on-dark mt-8 mb-3">1. Information We Collect</h2>
          <p>
            We collect information you provide directly, such as your name,
            email address, company name, and message content when you use our
            contact form or communicate with us.
          </p>

          <h2 className="text-xl font-semibold text-text-on-dark mt-8 mb-3">2. How We Use Your Information</h2>
          <p>
            We use the information to respond to your inquiries, provide our
            advisory services, improve our website, and communicate with you
            about our services.
          </p>

          <h2 className="text-xl font-semibold text-text-on-dark mt-8 mb-3">3. Data Sharing</h2>
          <p>
            We do not sell your personal information. We may share data with
            service providers who assist in operating our website and conducting
            our business, subject to confidentiality obligations.
          </p>

          <h2 className="text-xl font-semibold text-text-on-dark mt-8 mb-3">4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to
            protect your personal data against unauthorized access, alteration,
            disclosure, or destruction.
          </p>

          <h2 className="text-xl font-semibold text-text-on-dark mt-8 mb-3">5. Your Rights</h2>
          <p>
            Under GDPR, you have the right to access, rectify, erase, restrict
            processing, and port your data. To exercise these rights, contact us
            at welcome@routevia.io.
          </p>

          <h2 className="text-xl font-semibold text-text-on-dark mt-8 mb-3">6. Contact</h2>
          <p>
            For privacy-related questions, contact us at{" "}
            <a href="mailto:welcome@routevia.io" className="text-gold hover:text-gold-dark font-medium">
              welcome@routevia.io
            </a>.
          </p>
        </div>
      </div>
    </section>
  );
}
