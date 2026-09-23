import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbal voorspellingen ranglijst",

  description:
    "Bekijk de VoetIQ-ranglijst en ontdek wie de meeste punten heeft verdiend met voetbalvoorspellingen. Vergelijk spelers per competitie en speelronde.",

  alternates: {
    canonical: "https://voetiq.nl/ranglijst",
  },

  openGraph: {
    title: "Voetbal voorspellingen ranglijst | VoetIQ",
    description:
      "Bekijk wie bovenaan staat bij VoetIQ. Vergelijk punten en voetbalvoorspellingen in het algemene klassement en per competitie.",
    url: "https://voetiq.nl/ranglijst",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RanglijstLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
