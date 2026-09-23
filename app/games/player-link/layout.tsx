import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Player Link | Verbind de voetballers",

  description:
    "Speel Player Link bij VoetIQ. Vind de verbinding tussen voetballers en test hoe goed jij spelers, clubs en transfers kent.",

  alternates: {
    canonical: "https://voetiq.nl/games/player-link",
  },

  openGraph: {
    title: "Player Link | Verbind de voetballers | VoetIQ",
    description:
      "Vind de verbinding tussen voetballers en test jouw voetbalkennis met Player Link bij VoetIQ.",
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
