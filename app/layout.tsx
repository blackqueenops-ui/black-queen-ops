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
  title: "Routevia — Merchant Routing & Payment Infrastructure",
  description:
    "Routing infrastructure for merchant onboarding, frontshop systems, and payment flow architecture worldwide.",
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
