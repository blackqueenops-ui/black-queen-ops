import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Black Queen Ops",
  description:
    "Get in touch with Black Queen Ops for fintech advisory, compliance consulting, and payment solutions.",
};

export default function Contact() {
  return (
    <>
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-4">
              Contact Us
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Let&apos;s Start a{" "}
              <span className="text-gold">Conversation</span>
            </h1>
            <p className="text-lg text-foreground/60">
              Ready to navigate compliance, optimize payments, or scale your
              business? We&apos;re here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div>
                  <div className="text-sm text-gold font-medium mb-1">
                    Email
                  </div>
                  <a
                    href="mailto:info@blackqueenops.com"
                    className="text-foreground/70 hover:text-gold transition-colors"
                  >
                    info@blackqueenops.com
                  </a>
                </div>
                <div>
                  <div className="text-sm text-gold font-medium mb-1">
                    Telegram
                  </div>
                  <a
                    href="https://t.me/blackqueenops"
                    className="text-foreground/70 hover:text-gold transition-colors"
                  >
                    @blackqueenops
                  </a>
                </div>
                <div>
                  <div className="text-sm text-gold font-medium mb-1">
                    LinkedIn
                  </div>
                  <a
                    href="https://linkedin.com/company/blackqueenops"
                    className="text-foreground/70 hover:text-gold transition-colors"
                  >
                    Black Queen Ops
                  </a>
                </div>
                <div>
                  <div className="text-sm text-gold font-medium mb-1">
                    Location
                  </div>
                  <p className="text-foreground/70">
                    European Union
                    <br />
                    <span className="text-foreground/40 text-sm">
                      Remote-first company
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-10 p-5 bg-surface border border-border rounded-lg">
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-sm text-foreground/50">
                  We respond to all inquiries within 48 hours. For urgent
                  matters, reach out via Telegram for fastest response.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-bold mb-6">Send a Message</h2>
              <form className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm text-foreground/70 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-surface border border-border rounded px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm text-foreground/70 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-surface border border-border rounded px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm text-foreground/70 mb-1"
                  >
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full bg-surface border border-border rounded px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors"
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-foreground/70 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full bg-surface border border-border rounded px-4 py-2.5 text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-gold/50 transition-colors resize-none"
                    placeholder="Tell us about your project or inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gold text-black py-3 rounded font-medium hover:bg-gold-light transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
