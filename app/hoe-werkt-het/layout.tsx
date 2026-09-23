import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hoe werkt VoetIQ? | Voetbal voorspellen & punten",

  description:
    "Ontdek hoe VoetIQ werkt. Voorspel voetbalwedstrijden, verdien punten op basis van je voorspellingen en klim in de ranglijst.",

  alternates: {
    canonical: "https://voetiq.nl/hoe-werkt-het",
  },

  openGraph: {
    title: "Hoe werkt VoetIQ? | Voetbal voorspellen & punten",
    description:
      "Bekijk hoe je voetbalwedstrijden voorspelt, punten verdient en stijgt in de ranglijst bij VoetIQ.",
    url: "https://voetiq.nl/hoe-werkt-het",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function HoeWerktHetLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
