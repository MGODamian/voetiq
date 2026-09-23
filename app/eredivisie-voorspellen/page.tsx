import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Eredivisie voorspellen | Voorspel wedstrijden gratis",
  description:
    "Voorspel gratis Eredivisie-wedstrijden bij VoetIQ. Voorspel de uitslagen van Ajax, PSV, Feyenoord en andere Eredivisie-clubs, verdien punten en klim op de ranglijst.",
  alternates: {
    canonical: "https://voetiq.nl/eredivisie-voorspellen",
  },
  openGraph: {
    title: "Eredivisie voorspellen | VoetIQ",
    description:
      "Voorspel gratis Eredivisie-wedstrijden, verdien punten en vergelijk jouw voorspellingen met andere voetbalfans.",
    url: "https://voetiq.nl/eredivisie-voorspellen",
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
  "@type": "WebPage",

  name: "Eredivisie voorspellen",
  url: "https://voetiq.nl/eredivisie-voorspellen",

  description:
    "Voorspel gratis Eredivisie-wedstrijden bij VoetIQ, verdien punten en vergelijk jouw voorspellingen met andere voetbalfans.",

  inLanguage: "nl-NL",

  isPartOf: {
    "@type": "WebSite",
    name: "VoetIQ",
    url: "https://voetiq.nl/",
  },

  publisher: {
    "@type": "Organization",
    name: "VoetIQ",
    url: "https://voetiq.nl/",
  },

  about: {
    "@type": "SportsOrganization",
    name: "Eredivisie",
    sport: "Voetbal",
  },

  mainEntity: {
    "@type": "ItemList",
    name: "Eredivisie voetbalclubs",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Ajax",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "PSV",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Feyenoord",
      },
    ],
  },
};

export default function EredivisieVoorspellenPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(66,233,133,0.12), transparent 32%), #020d08",
        color: "white",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "100px 20px 80px",
        }}
      >
        <div
          style={{
            color: "#42e985",
            fontSize: "13px",
            fontWeight: 900,
            letterSpacing: "1px",
          }}
        >
          🇳🇱 EREDIVISIE VOORSPELLEN
        </div>

        <h1
          style={{
            margin: "16px 0",
            fontSize: "clamp(42px, 7vw, 72px)",
            lineHeight: 1,
            letterSpacing: "-2px",
          }}
        >
          Eredivisie wedstrijden voorspellen
        </h1>

        <p
          style={{
            maxWidth: "720px",
            color: "#a2b7aa",
            fontSize: "18px",
            lineHeight: 1.7,
          }}
        >
          Voorspel gratis de uitslagen van Eredivisie-wedstrijden bij
          VoetIQ. Doe voorspellingen voor wedstrijden van onder andere Ajax,
          PSV en Feyenoord, verdien punten en probeer zo hoog mogelijk op de
          ranglijst te eindigen.
        </p>

        <Link
          href="/wedstrijden?competition=DED"
          style={{
            display: "inline-block",
            marginTop: "25px",
            padding: "15px 22px",
            borderRadius: "12px",
            background: "#42e985",
            color: "#021108",
            textDecoration: "none",
            fontWeight: 900,
          }}
        >
          ⚽ Eredivisie voorspellen →
        </Link>

        <section style={{ marginTop: "80px" }}>
          <h2 style={headingStyle}>Hoe werkt Eredivisie voorspellen?</h2>

          <p style={textStyle}>
            Kies een aankomende Eredivisie-wedstrijd en vul vóór de aftrap
            jouw voorspelde uitslag in. Zodra de wedstrijd begint, wordt je
            voorspelling vastgezet.
          </p>

          <p style={textStyle}>
            Na afloop van de wedstrijd worden punten toegekend. Hoe
            nauwkeuriger jouw voorspelling is, hoe meer punten je kunt
            verdienen.
          </p>
        </section>

        <section style={{ marginTop: "60px" }}>
          <h2 style={headingStyle}>
            Voorspel wedstrijden van Ajax, PSV, Feyenoord en meer
          </h2>

          <p style={textStyle}>
            Bij VoetIQ kun je wedstrijden uit de Eredivisie voorspellen en
            jouw voetbalkennis testen. Iedere speelronde geeft je opnieuw de
            kans om punten te verzamelen.
          </p>

          <p style={textStyle}>
            Je voorspellingen tellen mee voor de VoetIQ-ranglijst, waardoor
            je jouw prestaties kunt vergelijken met andere spelers.
          </p>
        </section>

        <section style={{ marginTop: "60px" }}>
          <h2 style={headingStyle}>Hoe verdien je punten?</h2>

          <p style={textStyle}>
            Een exacte voorspelling levert de meeste punten op. Heb je niet
            de exacte uitslag goed, maar wel de juiste winnaar of het juiste
            gelijkspel voorspeld, dan kun je nog steeds punten verdienen.
          </p>

          <Link href="/hoe-werkt-het" style={linkStyle}>
            Bekijk het volledige puntensysteem →
          </Link>
        </section>

        <section style={{ marginTop: "60px" }}>
          <h2 style={headingStyle}>Eredivisie voorspellen met vrienden</h2>

          <p style={textStyle}>
            Maak een gratis VoetIQ-account en vergelijk jouw voorspellingen
            met andere voetbalfans. Je kunt ook samen met vrienden spelen en
            kijken wie uiteindelijk de meeste punten verzamelt.
          </p>
        </section>

        <section
          style={{
            marginTop: "70px",
            padding: "35px",
            borderRadius: "20px",
            textAlign: "center",
            background: "rgba(66,233,133,0.07)",
            border: "1px solid rgba(66,233,133,0.16)",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "30px",
            }}
          >
            Klaar om de Eredivisie te voorspellen?
          </h2>

          <p
            style={{
              ...textStyle,
              maxWidth: "600px",
              margin: "14px auto 0",
            }}
          >
            Voorspel aankomende wedstrijden, verzamel punten en ontdek hoe
            goed jouw voetbalkennis werkelijk is.
          </p>

          <Link
            href="/wedstrijden?competition=DED"
            style={{
              display: "inline-block",
              marginTop: "22px",
              padding: "15px 22px",
              borderRadius: "12px",
              background: "#42e985",
              color: "#021108",
              textDecoration: "none",
              fontWeight: 900,
            }}
          >
            Start met voorspellen →
          </Link>
        </section>
      </section>
    </main>
  );
}

const headingStyle: React.CSSProperties = {
  margin: "0 0 15px",
  fontSize: "30px",
  letterSpacing: "-0.5px",
};

const textStyle: React.CSSProperties = {
  color: "#9bb0a4",
  fontSize: "16px",
  lineHeight: 1.75,
};

const linkStyle: React.CSSProperties = {
  display: "inline-block",
  marginTop: "8px",
  color: "#42e985",
  textDecoration: "none",
  fontWeight: 800,
};
