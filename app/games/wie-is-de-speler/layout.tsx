import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wie is de speler? | Voetbalspel",

  description:
    "Speel Wie is de speler bij VoetIQ. Raad de voetballer met zo min mogelijk hints en test gratis jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/wie-is-de-speler",
  },

  openGraph: {
    title: "Wie is de speler? | VoetIQ",
    description:
      "Raad de voetballer met zo min mogelijk hints en test jouw voetbalkennis bij VoetIQ.",
    url: "https://voetiq.nl/games/wie-is-de-speler",
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

  name: "Wie is de speler?",
  url: "https://voetiq.nl/games/wie-is-de-speler",

  description:
    "Een gratis voetbalspel van VoetIQ waarin je een voetballer probeert te raden met zo min mogelijk hints.",

  inLanguage: "nl-NL",

  genre: [
    "Voetbal",
    "Quiz",
    "Trivia",
  ],

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

export default function WieIsDeSpelerLayout({
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
