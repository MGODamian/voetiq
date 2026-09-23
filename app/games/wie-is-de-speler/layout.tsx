import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wie is de speler? | Voetbalspel",

  description:
    "Speel Wie is de speler bij VoetIQ. Raad de voetballer met zo min mogelijk hints en test gratis jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/wie-is-de-speler",
  },

  openGraph: {
    title: "Wie is de speler? | VoetIQ",
    description:
      "Raad de voetballer met zo min mogelijk hints en test jouw voetbalkennis bij VoetIQ.",
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

export default function WieIsDeSpelerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
