import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbalwedstrijden voorspellen",
  description:
    "Voorspel voetbalwedstrijden uit de Eredivisie, Premier League, Champions League en meer. Verdien punten en klim op de ranglijst bij VoetIQ.",
  alternates: {
    canonical: "https://www.voetiq.nl/wedstrijden",
  },
  openGraph: {
    title: "Voetbalwedstrijden voorspellen | VoetIQ",
    description:
      "Voorspel voetbalwedstrijden, verdien punten en speel mee met VoetIQ.",
    url: "https://www.voetiq.nl/wedstrijden",
    type: "website",
  },
};

export default function WedstrijdenLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
