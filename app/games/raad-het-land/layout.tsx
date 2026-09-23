import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raad het voetballand | Voetbalspel",

  description:
    "Speel Raad het voetballand bij VoetIQ. Raad het juiste voetballand aan de hand van voetbalhints en test gratis jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/raad-het-land",
  },

  openGraph: {
    title: "Raad het voetballand | Voetbalspel | VoetIQ",
    description:
      "Raad het juiste voetballand aan de hand van hints en test jouw voetbalkennis bij VoetIQ.",
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
