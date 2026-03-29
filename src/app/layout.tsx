import type { Metadata } from "next";
import { Syne, Instrument_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import MobileCTA from "@/components/MobileCTA";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LOVE3D • Digital Artifacts Lab",
  description: "Magazin online de obiecte 3D cu vizualizare interactivă și comandă directă pe WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${instrumentSans.variable} h-full antialiased selection:bg-black selection:text-white`}
    >
      <body className="min-h-full flex flex-col bg-white overflow-x-hidden relative">
        <Navbar />
        {/* Grain Texture Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
        {children}
        <MobileCTA />
      </body>
    </html>
  );
}
