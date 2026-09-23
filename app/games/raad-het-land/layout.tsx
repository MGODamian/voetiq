import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raad het voetballand – Voetbalspel | VoetIQ",

  description:
    "Speel Raad het Voetballand gratis bij VoetIQ. Gebruik voetbalhints over clubs, spelers en competities om het juiste land te raden en verdien zoveel mogelijk punten.",

  alternates: {
    canonical: "https://voetiq.nl/games/raad-het-land",
  },

  openGraph: {
    title: "Raad het voetballand – Voetbalspel | VoetIQ",
    description:
      "Kun jij het juiste voetballand raden aan de hand van voetbalhints? Speel gratis bij VoetIQ en probeer de hoogste score te halen.",
    url: "https://voetiq.nl/games/raad-het-land",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RaadHetLandLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
