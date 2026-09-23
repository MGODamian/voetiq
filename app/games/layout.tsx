import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbal spelletjes & voetbalquiz",

  description:
    "Speel gratis voetbal spelletjes bij VoetIQ. Test je voetbalkennis met Wie is de speler, Raad het stadion, de voetbalquiz, Player Link en meer.",

  alternates: {
    canonical: "https://voetiq.nl/games",
  },

  openGraph: {
    title: "Voetbal spelletjes & voetbalquiz | VoetIQ",
    description:
      "Test je voetbalkennis met gratis voetbalgames, quizzen en uitdagingen bij VoetIQ.",
    url: "https://voetiq.nl/games",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function GamesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
