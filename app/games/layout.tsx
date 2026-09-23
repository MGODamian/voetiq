import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voetbal spelletjes & voetbalquiz",

  description:
    "Speel gratis voetbal spelletjes bij VoetIQ. Test je voetbalkennis met Wie is de speler, Raad het stadion, de voetbalquiz, Player Link en meer.",

  alternates: {
    canonical: "https://voetiq.nl/games",
  },

  openGraph: {
    title: "Voetbal spelletjes & voetbalquiz | VoetIQ",
    description:
      "Test je voetbalkennis met gratis voetbalgames, quizzen en uitdagingen bij VoetIQ.",
    url: "https://voetiq.nl/games",
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
  "@type": "CollectionPage",
  name: "Voetbal spelletjes & voetbalquiz",
  url: "https://voetiq.nl/games",
  description:
    "Speel gratis voetbal spelletjes en quizzen bij VoetIQ en test jouw voetbalkennis.",
  inLanguage: "nl-NL",

  isPartOf: {
    "@type": "WebSite",
    name: "VoetIQ",
    url: "https://voetiq.nl/",
  },

  mainEntity: {
    "@type": "ItemList",
    name: "VoetIQ voetbalgames",
    numberOfItems: 5,

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Wie is de speler?",
        url: "https://voetiq.nl/games/wie-is-de-speler",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Raad het stadion",
        url: "https://voetiq.nl/games/raad-het-stadion",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Voetbalquiz",
        url: "https://voetiq.nl/games/voetbalquiz",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Player Link",
        url: "https://voetiq.nl/games/player-link",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Raad het voetballand",
        url: "https://voetiq.nl/games/raad-het-land",
      },
    ],
  },
};

export default function GamesLayout({
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
