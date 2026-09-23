import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raad het voetbalstadion – Stadion quiz | VoetIQ",

  description:
    "Speel Raad het Stadion gratis bij VoetIQ. Herken beroemde voetbalstadions aan de hand van hints, verdien punten en test jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/raad-het-stadion",
  },

  openGraph: {
    title: "Raad het voetbalstadion – Stadion quiz | VoetIQ",
    description:
      "Hoeveel voetbalstadions herken jij? Gebruik de hints, raad beroemde stadions en haal de hoogste score bij VoetIQ.",
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
