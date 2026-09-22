import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbal voorspellingen ranglijst",

  description:
    "Bekijk de VoetIQ-ranglijst en ontdek wie de meeste punten verdient met voetbalvoorspellingen. Voorspel wedstrijden, verzamel punten en strijd om de eerste plaats.",

  alternates: {
    canonical: "https://voetiq.nl/ranglijst",
  },

  openGraph: {
    title: "Voetbal voorspellingen ranglijst | VoetIQ",
    description:
      "Bekijk wie de meeste punten heeft verzameld met voetbalvoorspellingen op VoetIQ.",
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
