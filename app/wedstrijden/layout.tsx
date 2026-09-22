import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbalwedstrijden voorspellen",

  description:
    "Voorspel voetbalwedstrijden uit de Eredivisie, Premier League, Champions League en meer. Verdien punten en klim op de ranglijst bij VoetIQ.",

  alternates: {
    canonical: "https://voetiq.nl/wedstrijden",
  },

  openGraph: {
    title: "Voetbalwedstrijden voorspellen | VoetIQ",
    description:
      "Voorspel voetbalwedstrijden, verdien punten en speel mee met VoetIQ.",
    url: "https://voetiq.nl/wedstrijden",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function WedstrijdenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
