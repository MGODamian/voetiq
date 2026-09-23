import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nations League voorspellen 2026/27",

  description:
    "Voorspel de UEFA Nations League 2026/27 bij VoetIQ. Vul wedstrijduitslagen in, volg de poules en standen en verzamel punten met jouw voorspellingen.",

  alternates: {
    canonical: "https://voetiq.nl/toernooien/nations-league",
  },

  openGraph: {
    title: "Nations League voorspellen 2026/27 | VoetIQ",
    description:
      "Voorspel wedstrijden van de UEFA Nations League 2026/27, volg de poules en standen en speel mee bij VoetIQ.",
    url: "https://voetiq.nl/toernooien/nations-league",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function NationsLeagueLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
