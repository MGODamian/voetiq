import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbalquiz | Test je voetbalkennis",

  description:
    "Speel de gratis voetbalquiz van VoetIQ. Beantwoord voetbalvragen, test jouw voetbalkennis en probeer een zo hoog mogelijke score te halen.",

  alternates: {
    canonical: "https://voetiq.nl/games/voetbalquiz",
  },

  openGraph: {
    title: "Voetbalquiz | Test je voetbalkennis | VoetIQ",
    description:
      "Speel de gratis voetbalquiz van VoetIQ en ontdek hoe goed jouw voetbalkennis echt is.",
    url: "https://voetiq.nl/games/voetbalquiz",
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

  name: "Voetbalquiz",
  url: "https://voetiq.nl/games/voetbalquiz",

  description:
    "Een gratis voetbalquiz van VoetIQ waarin je voetbalvragen beantwoordt, jouw voetbalkennis test en probeert een zo hoog mogelijke score te halen.",

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

export default function VoetbalquizLayout({
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
