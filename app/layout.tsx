export const metadata: Metadata = {
  title: {
    default: "VoetIQ | Voetbal voorspellen met vrienden",
    template: "%s | VoetIQ",
  },

  description:
    "Voorspel gratis voetbalwedstrijden bij VoetIQ. Verdien punten, speel met vrienden in poules en klim naar de top van de ranglijst.",

  applicationName: "VoetIQ",

  metadataBase: new URL("https://voetiq.nl"),

  alternates: {
    canonical: "https://voetiq.nl/",
  },

  openGraph: {
    title: "VoetIQ | Voetbal voorspellen met vrienden",
    description:
      "Voorspel gratis voetbalwedstrijden, verdien punten en daag je vrienden uit bij VoetIQ.",
    url: "https://voetiq.nl/",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};
