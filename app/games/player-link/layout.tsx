import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Player Link | Verbind de voetballers",

  description:
    "Speel Player Link bij VoetIQ. Vind de verbinding tussen voetballers en test hoe goed jij spelers, clubs en transfers kent.",

  alternates: {
    canonical: "https://voetiq.nl/games/player-link",
  },

  openGraph: {
    title: "Player Link | Verbind de voetballers | VoetIQ",
    description:
      "Vind de verbinding tussen voetballers en test jouw voetbalkennis met Player Link bij VoetIQ.",
    url: "https://voetiq.nl/games/player-link",
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

  name: "Player Link",
  url: "https://voetiq.nl/games/player-link",

  description:
    "Een gratis voetbalspel van VoetIQ waarin je verbindingen tussen voetballers probeert te vinden aan de hand van spelers, clubs en transfers.",

  inLanguage: "nl-NL",

  genre: ["Voetbal", "Puzzel", "Trivia"],

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

export default function PlayerLinkLayout({
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
