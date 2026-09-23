import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbaltoernooien voorspellen",

  description:
    "Voorspel complete voetbaltoernooien bij VoetIQ. Vul wedstrijduitslagen in, volg poules en standen en verzamel punten tijdens grote voetbaltoernooien.",

  alternates: {
    canonical: "https://voetiq.nl/toernooien",
  },

  openGraph: {
    title: "Voetbaltoernooien voorspellen | VoetIQ",
    description:
      "Voorspel complete voetbaltoernooien, volg de poules en standen en verzamel punten bij VoetIQ.",
    url: "https://voetiq.nl/toernooien",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function ToernooienLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
