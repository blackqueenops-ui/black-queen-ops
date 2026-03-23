import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-gold rounded-sm flex items-center justify-center">
                <span className="text-black font-bold">Q</span>
              </div>
              <span className="font-semibold tracking-tight">
                Black Queen<span className="text-gold"> Ops</span>
              </span>
            </div>
            <p className="text-sm text-foreground/50 max-w-xs">
              International fintech advisory firm. Expertise in e-commerce
              compliance, payment solutions, and strategic consulting.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li><Link href="/about" className="hover:text-gold transition-colors">About</Link></li>
              <li><Link href="/services" className="hover:text-gold transition-colors">Services</Link></li>
              <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/50">
              <li><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-gold transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-10 pt-6 text-center text-xs text-foreground/30">
          &copy; {new Date().getFullYear()} Black Queen Ops. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
