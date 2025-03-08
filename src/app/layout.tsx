import type { Metadata } from "next";
import { Poppins, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Configure Poppins font with more specific options
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  fallback: ["system-ui", "arial"],
  preload: true,
  adjustFontFallback: true,
});

// Configure Roboto Mono font with more specific options
const robotoMono = Roboto_Mono({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
  fallback: ["monospace"],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "MUHIUM - Online File & Media Conversion Suite",
  description: "The ultimate online conversion tools for PDF, images, documents, audio, and video files.",
  keywords: "file converter, PDF merger, video editor, format converter, audio converter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${robotoMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
