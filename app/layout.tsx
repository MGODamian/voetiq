import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "VoetIQ | Voetbal voorspellen met vrienden",
    template: "%s | VoetIQ",
  },

  description:
    "Voorspel gratis voetbalwedstrijden bij VoetIQ. Verdien punten, speel met vrienden in poules en klim naar de top van de ranglijst.",

  applicationName: "VoetIQ",

  metadataBase: new URL("https://voetiq.nl"),

  alternates: {
    canonical: "https://voetiq.nl/",
  },

  openGraph: {
    title: "VoetIQ | Voetbal voorspellen met vrienden",
    description:
      "Voorspel gratis voetbalwedstrijden, verdien punten en daag je vrienden uit bij VoetIQ.",
    url: "https://voetiq.nl/",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },

  other: {
    "google-adsense-account": "ca-pub-6402610718526712",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6402610718526712"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>

      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
