import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Voetbal voorspellen | Gratis voetbalvoorspellingen",
  description:
    "Voorspel gratis voetbalwedstrijden bij VoetIQ. Speel mee met de Eredivisie, Premier League, Champions League en meer, verdien punten en daag je vrienden uit.",
  alternates: {
    canonical: "https://voetiq.nl/voetbal-voorspellen",
  },
  openGraph: {
    title: "Voetbal voorspellen | VoetIQ",
    description:
      "Voorspel gratis voetbalwedstrijden, verdien punten en speel tegen vrienden en andere voetbalfans.",
    url: "https://voetiq.nl/voetbal-voorspellen",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const competitions = [
  ["🇳🇱", "Eredivisie", "Voorspel wedstrijden van Ajax, PSV, Feyenoord en de andere clubs uit de Eredivisie."],
  ["🏴", "Premier League", "Test je voetbalkennis met wedstrijden uit de Engelse Premier League."],
  ["🏆", "Champions League", "Voorspel de grootste Europese wedstrijden in de Champions League."],
  ["🇪🇸", "La Liga", "Speel mee met voorspellingen uit de hoogste Spaanse voetbalcompetitie."],
  ["🇩🇪", "Bundesliga", "Voorspel wedstrijden uit de Bundesliga en verzamel punten."],
  ["🇮🇹", "Serie A", "Doe voorspellingen voor wedstrijden van de grootste Italiaanse clubs."],
];

export default function VoetbalVoorspellenPage() {
  return (
    <main style={styles.main}>
      <section style={styles.hero}>
        <div style={styles.container}>
          <Link href="/" style={styles.logo}>
            Voet<span style={{ color: "#42e985" }}>IQ</span>
          </Link>

          <div style={styles.badge}>⚽ GRATIS VOETBAL VOORSPELLEN</div>

          <h1 style={styles.h1}>Voetbal voorspellen met VoetIQ</h1>

          <p style={styles.intro}>
            Voorspel echte voetbalwedstrijden, verdien punten voor jouw
            voorspellingen en vergelijk jouw voetbalkennis met vrienden en
            andere spelers.
          </p>

          <div style={styles.actions}>
            <Link href="/registreren" style={styles.primaryButton}>
              Begin gratis →
            </Link>
            <Link href="/wedstrijden" style={styles.secondaryButton}>
              Bekijk wedstrijden
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.eyebrow}>HOE WERKT HET?</div>
          <h2 style={styles.h2}>Voorspel de uitslag en verdien punten</h2>
          <p style={styles.sectionText}>
            Bij VoetIQ kies je aankomende voetbalwedstrijden en vul je jouw
            voorspelling in. Na de wedstrijd worden punten toegekend op basis
            van jouw voorspelling. Vervolgens kun je jouw prestaties bekijken
            op de ranglijst.
          </p>

          <div style={styles.grid}>
            <Card
              icon="⚽"
              title="1. Kies een wedstrijd"
              text="Bekijk aankomende wedstrijden uit verschillende nationale en Europese competities."
            />
            <Card
              icon="🎯"
              title="2. Voorspel de score"
              text="Vul voor de aftrap in welke uitslag jij verwacht."
            />
            <Card
              icon="🏆"
              title="3. Verdien punten"
              text="Verzamel punten en probeer steeds hoger op de VoetIQ-ranglijst te komen."
            />
          </div>
        </div>
      </section>

      <section style={styles.altSection}>
        <div style={styles.container}>
          <div style={styles.eyebrow}>COMPETITIES</div>
          <h2 style={styles.h2}>Voetbalvoorspellingen voor populaire competities</h2>
          <p style={styles.sectionText}>
            Speel mee met wedstrijden uit bekende voetbalcompetities. Nieuwe
            wedstrijden kun je rechtstreeks via de wedstrijdpagina voorspellen.
          </p>

          <div style={styles.grid}>
            {competitions.map(([icon, name, text]) => (
              <Card key={name} icon={icon} title={name} text={text} />
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "30px" }}>
            <Link href="/wedstrijden" style={styles.primaryButton}>
              Bekijk alle wedstrijden →
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.eyebrow}>SAMEN SPELEN</div>
          <h2 style={styles.h2}>Daag je vrienden uit met voetbal voorspellen</h2>
          <p style={styles.sectionText}>
            Maak een poule, nodig vrienden uit en vergelijk jullie punten op
            een eigen ranglijst. Je kunt daarnaast op de algemene ranglijst
            zien hoe jouw score zich verhoudt tot andere VoetIQ-spelers.
          </p>

          <div style={styles.actions}>
            <Link href="/poules" style={styles.secondaryButton}>
              Bekijk poules
            </Link>
            <Link href="/ranglijst" style={styles.secondaryButton}>
              Bekijk ranglijst
            </Link>
          </div>
        </div>
      </section>

      <section style={styles.cta}>
        <div style={styles.container}>
          <div style={{ fontSize: "38px" }}>⚽</div>
          <h2 style={styles.h2}>Klaar om jouw voetbal-IQ te testen?</h2>
          <p style={styles.sectionText}>
            Maak gratis een account aan en begin met het voorspellen van
            voetbalwedstrijden.
          </p>
          <div style={{ marginTop: "28px" }}>
            <Link href="/registreren" style={styles.primaryButton}>
              Maak gratis een account →
            </Link>
          </div>
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <Link href="/" style={styles.logo}>
            Voet<span style={{ color: "#42e985" }}>IQ</span>
          </Link>

          <div style={styles.footerLinks}>
            <Link href="/" style={styles.footerLink}>Home</Link>
            <Link href="/wedstrijden" style={styles.footerLink}>Wedstrijden</Link>
            <Link href="/ranglijst" style={styles.footerLink}>Ranglijst</Link>
            <Link href="/contact" style={styles.footerLink}>Contact</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Card({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <article style={styles.card}>
      <div style={{ fontSize: "30px" }}>{icon}</div>
      <h3 style={styles.h3}>{title}</h3>
      <p style={styles.cardText}>{text}</p>
    </article>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background: "#020d08",
    color: "white",
  },
  hero: {
    padding: "70px 20px 85px",
    textAlign: "center",
    background:
      "radial-gradient(circle at 50% 20%, rgba(46,230,129,0.16), transparent 32%), linear-gradient(180deg, #061a10 0%, #020d08 100%)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
  },
  container: {
    width: "100%",
    maxWidth: "1050px",
    margin: "0 auto",
  },
  logo: {
    display: "inline-block",
    color: "white",
    textDecoration: "none",
    fontSize: "25px",
    fontWeight: 950,
    marginBottom: "40px",
  },
  badge: {
    width: "fit-content",
    margin: "0 auto",
    padding: "8px 14px",
    borderRadius: "999px",
    background: "rgba(46,230,129,0.09)",
    border: "1px solid rgba(46,230,129,0.17)",
    color: "#54ec94",
    fontSize: "12px",
    fontWeight: 900,
    letterSpacing: "0.8px",
  },
  h1: {
    maxWidth: "850px",
    margin: "24px auto 0",
    fontSize: "clamp(40px, 7vw, 72px)",
    lineHeight: 1.02,
    letterSpacing: "-2.5px",
    fontWeight: 950,
  },
  intro: {
    maxWidth: "720px",
    margin: "22px auto 0",
    color: "#a2b7aa",
    fontSize: "clamp(16px, 2vw, 19px)",
    lineHeight: 1.7,
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "30px",
  },
  primaryButton: {
    display: "inline-block",
    padding: "13px 20px",
    borderRadius: "11px",
    background: "#42e985",
    color: "#021108",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 900,
  },
  secondaryButton: {
    display: "inline-block",
    padding: "13px 20px",
    borderRadius: "11px",
    background: "rgba(255,255,255,0.035)",
    border: "1px solid rgba(255,255,255,0.10)",
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 900,
  },
  section: {
    padding: "75px 20px",
  },
  altSection: {
    padding: "75px 20px",
    background: "rgba(255,255,255,0.015)",
    borderTop: "1px solid rgba(255,255,255,0.05)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  eyebrow: {
    textAlign: "center",
    color: "#42e985",
    fontSize: "11px",
    fontWeight: 900,
    letterSpacing: "1px",
  },
  h2: {
    maxWidth: "800px",
    margin: "10px auto 0",
    textAlign: "center",
    fontSize: "clamp(29px, 4vw, 42px)",
    lineHeight: 1.1,
    letterSpacing: "-1px",
    fontWeight: 950,
  },
  sectionText: {
    maxWidth: "720px",
    margin: "16px auto 0",
    textAlign: "center",
    color: "#8da397",
    fontSize: "15px",
    lineHeight: 1.75,
  },
  grid: {
    marginTop: "38px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "16px",
  },
  card: {
    padding: "25px",
    borderRadius: "18px",
    background:
      "linear-gradient(145deg, rgba(8,35,23,0.96), rgba(3,18,11,0.96))",
    border: "1px solid rgba(75,255,153,0.10)",
  },
  h3: {
    margin: "15px 0 8px",
    fontSize: "18px",
    fontWeight: 900,
  },
  cardText: {
    margin: 0,
    color: "#83998c",
    fontSize: "13px",
    lineHeight: 1.65,
  },
  cta: {
    padding: "80px 20px",
    textAlign: "center",
    background:
      "radial-gradient(circle at 50% 0%, rgba(46,230,129,0.12), transparent 60%)",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    background: "#010905",
    padding: "28px 20px",
  },
  footerInner: {
    maxWidth: "1050px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "18px",
  },
  footerLinks: {
    display: "flex",
    flexWrap: "wrap",
    gap: "18px",
  },
  footerLink: {
    color: "#758a7e",
    textDecoration: "none",
    fontSize: "12px",
  },
};
