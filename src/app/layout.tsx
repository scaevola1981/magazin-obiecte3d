import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Suspense } from "react";
import MobileNav from "@/components/MobileNav";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Printly • Print 3D la comandă",
  description: "Marketplace de printare 3D cu modele, materiale și comandă rapidă prin WhatsApp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased selection:bg-[#D394FF] selection:text-black`}
    >
      <body className="min-h-full flex flex-col bg-[#000000] text-white overflow-x-hidden relative">
        <Suspense fallback={null}>
          <MobileNav />
        </Suspense>
        {/* Grain Texture Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03] bg-[url('/noise.svg')] brightness-100 contrast-150"></div>
        {children}
      </body>
    </html>
  );
}
