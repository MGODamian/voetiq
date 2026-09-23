import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbalquiz – Test je voetbalkennis | VoetIQ",

  description:
    "Speel de gratis voetbalquiz van VoetIQ. Beantwoord vragen over clubs, spelers, competities, het WK, EK en meer en test jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/voetbalquiz",
  },

  openGraph: {
    title: "Voetbalquiz – Test je voetbalkennis | VoetIQ",
    description:
      "Hoe goed ken jij voetbal? Speel 10 willekeurige voetbalvragen en probeer de hoogste score te halen.",
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
