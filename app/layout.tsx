import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./logo-animation.css";
import Header from "@/components/Header";
import AnimatedFooter from "@/components/AnimatedFooter";
import { LangProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Black Queen Ops — Merchant Onboarding & Payment Solutions",
  description:
    "Frontshop development, merchant onboarding, and payment infrastructure for digital goods, eSIM, and online education worldwide.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <LangProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <AnimatedFooter />
        </LangProvider>
      </body>
    </html>
  );
}
