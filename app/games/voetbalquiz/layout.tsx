import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbalquiz | Test je voetbalkennis",

  description:
    "Speel de gratis voetbalquiz van VoetIQ. Beantwoord voetbalvragen, test jouw voetbalkennis en probeer een zo hoog mogelijke score te halen.",

  alternates: {
    canonical: "https://voetiq.nl/games/voetbalquiz",
  },

  openGraph: {
    title: "Voetbalquiz | Test je voetbalkennis | VoetIQ",
    description:
      "Speel de gratis voetbalquiz van VoetIQ en ontdek hoe goed jouw voetbalkennis echt is.",
    url: "https://voetiq.nl/games/voetbalquiz",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function VoetbalquizLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
