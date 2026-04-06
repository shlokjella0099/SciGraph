import type { Metadata } from "next";
import { IBM_Plex_Sans, Source_Serif_4, Geist_Mono } from "next/font/google";
import "./globals.css";

const ibm = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SciGraph — Scientific Knowledge Graph Platform",
  description:
    "GraphRAG discovery, MongoDB-backed knowledge triples, and evidence-ranked multi-hop reasoning for scientific literature.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${ibm.variable} ${sourceSerif.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="relative z-[1] min-h-full flex flex-col">{children}</body>
    </html>
  );
}
