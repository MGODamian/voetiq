import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "VoetIQ | Voorspel voetbalwedstrijden",
    template: "%s | VoetIQ",
  },
  description:
    "Voorspel voetbalwedstrijden, verdien punten, speel in poules en klim op de ranglijst bij VoetIQ.",
  applicationName: "VoetIQ",
  metadataBase: new URL("https://www.voetiq.nl"),
  openGraph: {
    title: "VoetIQ | Voorspel voetbalwedstrijden",
    description:
      "Voorspel voetbalwedstrijden, verdien punten, speel in poules en klim op de ranglijst bij VoetIQ.",
    url: "https://www.voetiq.nl",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
