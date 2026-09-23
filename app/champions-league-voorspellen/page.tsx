import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Champions League voorspellen | Voorspel wedstrijden gratis",
  description:
    "Voorspel gratis Champions League-wedstrijden bij VoetIQ. Voorspel uitslagen uit de UEFA Champions League, verdien punten en klim op de ranglijst.",
  alternates: {
    canonical: "https://voetiq.nl/champions-league-voorspellen",
  },
  openGraph: {
    title: "Champions League voorspellen | VoetIQ",
    description:
      "Voorspel gratis Champions League-wedstrijden, verdien punten en vergelijk jouw voorspellingen met andere voetbalfans.",
    url: "https://voetiq.nl/champions-league-voorspellen",
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

  name: "Champions League voorspellen",
  url: "https://voetiq.nl/champions-league-voorspellen",

  description:
    "Voorspel gratis Champions League-wedstrijden bij VoetIQ, verdien punten en vergelijk jouw voorspellingen met andere voetbalfans.",

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
    name: "UEFA Champions League",
    sport: "Voetbal",
  },
};

export default function ChampionsLeagueVoorspellenPage() {
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
          🏆 CHAMPIONS LEAGUE VOORSPELLEN
        </div>

        <h1
          style={{
            margin: "16px 0",
            fontSize: "clamp(42px, 7vw, 72px)",
            lineHeight: 1,
            letterSpacing: "-2px",
          }}
        >
          Champions League wedstrijden voorspellen
        </h1>

        <p
          style={{
            maxWidth: "720px",
            color: "#a2b7aa",
            fontSize: "18px",
            lineHeight: 1.7,
          }}
        >
          Voorspel gratis Champions League-wedstrijden bij VoetIQ. Vul jouw
          voorspellingen voor de grootste Europese wedstrijden in, verdien
          punten en probeer zo hoog mogelijk op de ranglijst te eindigen.
        </p>

        <Link
          href="/wedstrijden?competition=CL"
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
          ⚽ Champions League voorspellen →
        </Link>

        <section style={{ marginTop: "80px" }}>
          <h2 style={headingStyle}>
            Hoe werkt Champions League voorspellen?
          </h2>

          <p style={textStyle}>
            Kies een aankomende Champions League-wedstrijd en vul vóór de
            aftrap jouw voorspelde uitslag in. Zodra de wedstrijd begint,
            wordt je voorspelling vastgezet.
          </p>

          <p style={textStyle}>
            Na afloop worden punten toegekend op basis van jouw voorspelling.
            Hoe nauwkeuriger je voorspelt, hoe meer punten je kunt verdienen.
          </p>
        </section>

        <section style={{ marginTop: "60px" }}>
          <h2 style={headingStyle}>
            Voorspel de grootste Europese wedstrijden
          </h2>

          <p style={textStyle}>
            Tijdens het Champions League-seizoen kun je bij VoetIQ
            wedstrijden uit de belangrijkste Europese clubcompetitie
            voorspellen en iedere speelronde opnieuw punten verzamelen.
          </p>

          <p style={textStyle}>
            Je voorspellingen tellen mee voor de VoetIQ-ranglijst, zodat je
            jouw prestaties kunt vergelijken met andere spelers.
          </p>
        </section>

        <section style={{ marginTop: "60px" }}>
          <h2 style={headingStyle}>Hoe verdien je punten?</h2>

          <p style={textStyle}>
            Een exacte voorspelling levert de meeste punten op. Heb je niet
            de exacte uitslag goed, maar wel het juiste wedstrijdresultaat
            voorspeld, dan kun je nog steeds punten verdienen.
          </p>

          <Link href="/hoe-werkt-het" style={linkStyle}>
            Bekijk het volledige puntensysteem →
          </Link>
        </section>

        <section style={{ marginTop: "60px" }}>
          <h2 style={headingStyle}>
            Champions League voorspellen met vrienden
          </h2>

          <p style={textStyle}>
            Maak gratis een VoetIQ-account en vergelijk jouw Champions
            League-voorspellingen met andere voetbalfans. Speel samen met
            vrienden en ontdek wie uiteindelijk de meeste punten verzamelt.
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
            Klaar om de Champions League te voorspellen?
          </h2>

          <p
            style={{
              ...textStyle,
              maxWidth: "600px",
              margin: "14px auto 0",
            }}
          >
            Voorspel aankomende wedstrijden, verzamel punten en test jouw
            kennis van de Champions League.
          </p>

          <Link
            href="/wedstrijden?competition=CL"
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

        <div
          style={{
            marginTop: "45px",
            textAlign: "center",
          }}
        >
          <Link href="/voetbal-voorspellen" style={linkStyle}>
            ← Bekijk alle voetbalcompetities
          </Link>
        </div>
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
