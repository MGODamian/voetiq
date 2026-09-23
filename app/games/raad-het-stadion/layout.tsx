import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raad het stadion | Voetbalspel",

  description:
    "Speel Raad het stadion bij VoetIQ. Herken voetbalstadions aan de hand van foto's en hints en test gratis jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/raad-het-stadion",
  },

  openGraph: {
    title: "Raad het stadion | VoetIQ",
    description:
      "Herken voetbalstadions en test jouw voetbalkennis met Raad het stadion bij VoetIQ.",
    url: "https://voetiq.nl/games/raad-het-stadion",
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

  name: "Raad het stadion",
  url: "https://voetiq.nl/games/raad-het-stadion",

  description:
    "Een gratis voetbalspel van VoetIQ waarin je voetbalstadions probeert te herkennen aan de hand van foto's en hints.",

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

export default function RaadHetStadionLayout({
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
