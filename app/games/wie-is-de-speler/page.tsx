import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wie is de speler? – Raad de voetballer | VoetIQ",

  description:
    "Speel Wie is de speler gratis bij VoetIQ. Raad bekende voetballers aan de hand van hints, verdien punten en test jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/wie-is-de-speler",
  },

  openGraph: {
    title: "Wie is de speler? – Raad de voetballer | VoetIQ",
    description:
      "Kun jij de voetballer raden met zo min mogelijk hints? Speel Wie is de speler gratis bij VoetIQ.",
    url: "https://voetiq.nl/games/wie-is-de-speler",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function WhoIsThePlayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
