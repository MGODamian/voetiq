import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raad het stadion | Voetbalspel",

  description:
    "Speel Raad het stadion bij VoetIQ. Herken voetbalstadions aan de hand van foto's en hints en test gratis jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/raad-het-stadion",
  },

  openGraph: {
    title: "Raad het stadion | VoetIQ",
    description:
      "Herken voetbalstadions en test jouw voetbalkennis met Raad het stadion bij VoetIQ.",
    url: "https://voetiq.nl/games/raad-het-stadion",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RaadHetStadionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
