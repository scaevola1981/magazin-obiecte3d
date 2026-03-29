import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import MobileCTA from "@/components/MobileCTA";
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
  title: "LOVE3D • Digital Lab",
  description: "Futuristic 3D printing and digital artifacts marketplace.",
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
        <Navbar />
        {/* Grain Texture Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150"></div>
        {children}
        <MobileCTA />
      </body>
    </html>
  );
}
