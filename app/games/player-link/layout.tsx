import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Player Link – Verbind voetballers | VoetIQ",

  description:
    "Speel Player Link gratis bij VoetIQ. Verbind bekende voetballers via clubs waarvoor ze hebben gespeeld en probeer de route in zo weinig mogelijk stappen te vinden.",

  alternates: {
    canonical: "https://voetiq.nl/games/player-link",
  },

  openGraph: {
    title: "Player Link – Verbind voetballers | VoetIQ",
    description:
      "Kun jij twee voetballers met elkaar verbinden via hun clubs? Speel Player Link gratis bij VoetIQ en test jouw voetbalkennis.",
    url: "https://voetiq.nl/games/player-link",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function PlayerLinkLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
