import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raad het voetballand | Voetbalspel",

  description:
    "Speel Raad het voetballand bij VoetIQ. Raad het juiste voetballand aan de hand van voetbalhints en test gratis jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/raad-het-land",
  },

  openGraph: {
    title: "Raad het voetballand | Voetbalspel | VoetIQ",
    description:
      "Raad het juiste voetballand aan de hand van hints en test jouw voetbalkennis bij VoetIQ.",
    url: "https://voetiq.nl/games/raad-het-land",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "VideoGame",

  name: "Raad het voetballand",
  url: "https://voetiq.nl/games/raad-het-land",

  description:
    "Een gratis voetbalspel van VoetIQ waarin je het juiste voetballand probeert te raden aan de hand van voetbalhints.",

  inLanguage: "nl-NL",

  genre: ["Voetbal", "Quiz", "Trivia"],

  gamePlatform: "Web Browser",

  applicationCategory: "Game",

  operatingSystem: "Web Browser",

  isAccessibleForFree: true,

  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
    availability: "https://schema.org/InStock",
  },

  publisher: {
    "@type": "Organization",
    name: "VoetIQ",
    url: "https://voetiq.nl/",
  },

  isPartOf: {
    "@type": "WebSite",
    name: "VoetIQ",
    url: "https://voetiq.nl/",
  },
};

export default function RaadHetLandLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      {children}
    </>
  );
}
