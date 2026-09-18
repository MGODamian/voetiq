"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "./Navbar";

const competitions = [
  {
    code: "DED",
    flag: "🇳🇱",
    name: "Eredivisie",
    description:
      "Voorspel wedstrijden van Ajax, PSV, Feyenoord en de rest van de Eredivisie.",
  },
  {
    code: "PL",
    flag: "🏴",
    name: "Premier League",
    description:
      "Test je voetbalkennis in één van de grootste competities ter wereld.",
  },
  {
    code: "PD",
    flag: "🇪🇸",
    name: "La Liga",
    description:
      "Voorspel de wedstrijden uit de hoogste Spaanse voetbalcompetitie.",
  },
  {
    code: "BL1",
    flag: "🇩🇪",
    name: "Bundesliga",
    description:
      "Neem het op tegen andere voorspellers met wedstrijden uit Duitsland.",
  },
  {
    code: "SA",
    flag: "🇮🇹",
    name: "Serie A",
    description:
      "Doe voorspellingen voor de grootste clubs uit het Italiaanse voetbal.",
  },
  {
    code: "CL",
    flag: "🏆",
    name: "Champions League",
    description:
      "Voorspel de grootste Europese wedstrijden en verdien punten.",
  },
];

export default function Home() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [userLoading, setUserLoading] = useState(true);
  const [language, setLanguage] = useState("nl");

  useEffect(() => {
    loadUser();

    const savedLanguage = window.localStorage.getItem("voetiq-language") || "nl";
    setLanguage(savedLanguage);

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language: string }>;
      setLanguage(customEvent.detail?.language || "nl");
    }

    window.addEventListener("voetiq-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("voetiq-language-change", handleLanguageChange);
    };
  }, []);

  function tr(text: string) {
    return translateHome(language, text);
  }

  async function loadUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUsername("");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Profiel fout:", error);
        return;
      }

      setUsername(profile?.username || "");
    } catch (error) {
      console.error(error);
    } finally {
      setUserLoading(false);
    }
  }

  function openCompetition(code: string) {
    router.push(`/wedstrijden?competition=${code}`);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#020d08",
        color: "white",
      }}
    >
      <Navbar />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          minHeight: "680px",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background:
            "radial-gradient(circle at 50% 38%, rgba(46,230,129,0.16), transparent 28%), linear-gradient(180deg, #061a10 0%, #03130b 55%, #020d08 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.35,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
            maskImage:
              "linear-gradient(to bottom, black, transparent)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "62px 20px 48px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(46,230,129,0.09)",
              border: "1px solid rgba(46,230,129,0.17)",
              color: "#54ec94",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.8px",
            }}
          >
            ⚽ {tr("DE VOETBAL VOORSPELLINGSGAME")}
          </div>

          <h1
            style={{
              margin: "24px 0 0",
              fontSize: "clamp(62px, 9vw, 105px)",
              lineHeight: 0.9,
              fontWeight: 950,
              letterSpacing: "-5px",
            }}
          >
            Voet<span style={{ color: "#42e985" }}>IQ</span>
          </h1>

          <h2
            style={{
              margin: "26px 0 0",
              fontSize: "clamp(25px, 4vw, 42px)",
              fontWeight: 900,
              letterSpacing: "-1px",
            }}
          >
            {tr("Voorspel. Beleef. Win punten.")}
          </h2>

          <p
            style={{
              maxWidth: "700px",
              margin: "17px auto 0",
              color: "#a2b7aa",
              fontSize: "clamp(15px, 2vw, 18px)",
              lineHeight: 1.7,
            }}
          >
            {tr("Voorspel echte voetbalwedstrijden, verzamel punten en strijd met vrienden en andere voetbalfans.")}
          </p>

          {!userLoading && username && (
            <div
              style={{
                marginTop: "18px",
                color: "#bcebd0",
                fontSize: "14px",
              }}
            >
              {tr("Welkom terug")},{" "}
              <strong style={{ color: "#42e985" }}>
                {username}
              </strong>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "30px",
            }}
          >
            <button
              onClick={() =>
                router.push(
                  username ? "/wedstrijden" : "/registreren"
                )
              }
              style={primaryButtonStyle}
            >
              {username
                ? tr("Begin met voorspellen →")
                : tr("Begin gratis →")}
            </button>

            {!username && !userLoading && (
              <button
                onClick={() => router.push("/inloggen")}
                style={secondaryButtonStyle}
              >
                {tr("Inloggen")}
              </button>
            )}

            {username && (
              <button
                onClick={() => router.push("/ranglijst")}
                style={secondaryButtonStyle}
              >
                🏆 {tr("Bekijk ranglijst")}
              </button>
            )}
          </div>

          <div
            style={{
              maxWidth: "760px",
              margin: "38px auto 0",
              paddingTop: "26px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "20px",
            }}
          >
            <HeroStat
              value="⚽"
              label={tr("Echte wedstrijden")}
            />

            <HeroStat
              value="🏆"
              label={tr("Wereldwijde ranglijst")}
            />

            <HeroStat
              value="👥"
              label={tr("Speel met vrienden")}
            />
          </div>
        </div>
        <button
          onClick={() =>
            document
              .getElementById("competities")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label={tr("Ontdek de competities")}
          style={{
            position: "absolute",
            left: "50%",
            bottom: "18px",
            transform: "translateX(-50%)",
            border: "none",
            background: "transparent",
            color: "#7fa18e",
            fontSize: "12px",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {tr("Ontdek de competities")} ↓
        </button>
      </section>

      {/* COMPETITIONS */}
      <section
        id="competities"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "48px 20px 70px",
        }}
      >
        <SectionHeading
          eyebrow={tr("Kies je competitie")}
          title={tr("Populaire competities")}
          description={tr("Kies een competitie en begin direct met het voorspellen van wedstrijden.")}
        />

        <div
          style={{
            marginTop: "32px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "16px",
          }}
        >
          {competitions.map((competition) => (
            <CompetitionCard
              key={competition.code}
              flag={competition.flag}
              name={competition.name}
              description={tr(competition.description)}
              predictorLabel={tr("Predictor")}
              predictNowLabel={tr("Voorspel nu →")}
              onPlay={() =>
                openCompetition(competition.code)
              }
            />
          ))}
        </div>

        <div
          style={{
            marginTop: "25px",
            textAlign: "center",
          }}
        >
          <button
            onClick={() => router.push("/wedstrijden")}
            style={{
              border: "none",
              background: "transparent",
              color: "#42e985",
              fontSize: "14px",
              fontWeight: 900,
              cursor: "pointer",
            }}
          >
            {tr("Bekijk alle wedstrijden →")}
          </button>
        </div>
      </section>

      {/* DISCOVER */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 20px 70px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          <button
            onClick={() => router.push("/hoe-het-werkt")}
            style={discoverCardStyle}
          >
            <span style={{ fontSize: "30px" }}>🎯</span>
            <span style={{ flex: 1 }}>
              <strong style={discoverTitleStyle}>{tr("Hoe werkt VoetIQ?")}</strong>
              <span style={discoverTextStyle}>
                {tr("Bekijk de puntentelling en ontdek hoe jouw voorspellingen worden beloond.")}
              </span>
            </span>
            <span style={{ color: "#42e985", fontSize: "22px" }}>→</span>
          </button>

          <button
            onClick={() => router.push("/ranglijst")}
            style={discoverCardStyle}
          >
            <span style={{ fontSize: "30px" }}>🏆</span>
            <span style={{ flex: 1 }}>
              <strong style={discoverTitleStyle}>{tr("Bekijk ranglijst")}</strong>
              <span style={discoverTextStyle}>
                {tr("Bekijk wie de meeste punten heeft en klim zelf naar de top.")}
              </span>
            </span>
            <span style={{ color: "#42e985", fontSize: "22px" }}>→</span>
          </button>
        </div>
      </section>

      {/* FRIENDS */}
      <section
        style={{
          padding: "0 20px 70px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "45px 30px",
            borderRadius: "24px",
            textAlign: "center",
            background:
              "radial-gradient(circle at 50% 0%, rgba(46,230,129,0.13), transparent 60%), rgba(255,255,255,0.025)",
            border:
              "1px solid rgba(75,255,153,0.10)",
          }}
        >
          <div style={{ fontSize: "36px" }}>👥</div>

          <h2
            style={{
              margin: "15px 0 10px",
              fontSize: "30px",
              fontWeight: 950,
            }}
          >
            {tr("Speel tegen je vrienden")}
          </h2>

          <p
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              color: "#8ca095",
              lineHeight: 1.65,
              fontSize: "14px",
            }}
          >
            {tr("Maak een eigen poule, nodig je vrienden uit en strijd samen om de hoogste plek op jullie eigen ranglijst.")}
          </p>

          <button
            onClick={() => router.push("/poules")}
            style={{
              ...secondaryButtonStyle,
              marginTop: "22px",
            }}
          >
            👥 {tr("Bekijk poules →")}
          </button>
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          padding: "70px 20px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          background:
            "linear-gradient(180deg, rgba(5,29,17,0.8), #020d08)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: "35px" }}>⚽</div>

          <h2
            style={{
              margin: "15px 0 10px",
              fontSize: "clamp(30px, 5vw, 45px)",
              fontWeight: 950,
              letterSpacing: "-1px",
            }}
          >
            {tr("Klaar om jouw voetbal-IQ te testen?")}
          </h2>

          <p
            style={{
              margin: "0 auto",
              color: "#8da397",
              lineHeight: 1.65,
            }}
          >
            {tr("Doe mee, voorspel wedstrijden en kijk hoe hoog jij op de ranglijst kunt komen.")}
          </p>

          <button
            onClick={() =>
              router.push(
                username ? "/wedstrijden" : "/registreren"
              )
            }
            style={{
              ...primaryButtonStyle,
              marginTop: "26px",
            }}
          >
            {username
              ? tr("Ga naar wedstrijden →")
              : tr("Maak gratis een account →")}
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          background: "#010905",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "30px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "20px",
                fontWeight: 950,
              }}
            >
              Voet<span style={{ color: "#42e985" }}>IQ</span>
            </div>

            <div
              style={{
                marginTop: "5px",
                color: "#52675b",
                fontSize: "11px",
              }}
            >
              © 2026 VoetIQ
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
              fontSize: "12px",
            }}
          >
            <FooterButton
              label={tr("Wedstrijden")}
              onClick={() => router.push("/wedstrijden")}
            />

            <FooterButton
              label={tr("Ranglijst")}
              onClick={() => router.push("/ranglijst")}
            />

            <FooterButton
              label={tr("Voorwaarden")}
              onClick={() => router.push("/voorwaarden")}
            />

            <FooterButton
              label={tr("Privacy")}
              onClick={() => router.push("/privacy")}
            />
          </div>
        </div>
      </footer>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          color: "#42e985",
          fontSize: "11px",
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {eyebrow}
      </div>

      <h2
        style={{
          margin: "8px 0 0",
          fontSize: "clamp(28px, 4vw, 38px)",
          fontWeight: 950,
          letterSpacing: "-1px",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          maxWidth: "600px",
          margin: "10px auto 0",
          color: "#82988b",
          fontSize: "14px",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  );
}

function CompetitionCard({
  flag,
  name,
  description,
  predictorLabel,
  predictNowLabel,
  onPlay,
}: {
  flag: string;
  name: string;
  description: string;
  predictorLabel: string;
  predictNowLabel: string;
  onPlay: () => void;
}) {
  return (
    <article
      style={{
        padding: "22px",
        borderRadius: "18px",
        background:
          "linear-gradient(145deg, rgba(8,35,23,0.96), rgba(3,18,11,0.96))",
        border: "1px solid rgba(75,255,153,0.10)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "13px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "13px",
            background: "rgba(255,255,255,0.05)",
            fontSize: "25px",
          }}
        >
          {flag}
        </div>

        <div>
          <div
            style={{
              color: "#70877a",
              fontSize: "10px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.7px",
            }}
          >
            {predictorLabel}
          </div>

          <h3
            style={{
              margin: "3px 0 0",
              fontSize: "18px",
              fontWeight: 900,
            }}
          >
            {name}
          </h3>
        </div>
      </div>

      <p
        style={{
          minHeight: "62px",
          margin: "18px 0",
          color: "#83998c",
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>

      <button
        onClick={onPlay}
        style={{
          width: "100%",
          padding: "11px",
          border: "none",
          borderRadius: "10px",
          background: "#42e985",
          color: "#021108",
          fontWeight: 900,
          cursor: "pointer",
        }}
      >
        {predictNowLabel}
      </button>
    </article>
  );
}

function StepCard({
  number,
  icon,
  title,
  text,
}: {
  number: string;
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        padding: "25px",
        borderRadius: "18px",
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.065)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "17px",
          color: "rgba(66,233,133,0.25)",
          fontSize: "22px",
          fontWeight: 950,
        }}
      >
        {number}
      </div>

      <div style={{ fontSize: "27px" }}>{icon}</div>

      <h3
        style={{
          margin: "16px 0 7px",
          fontSize: "16px",
          fontWeight: 900,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#7f9588",
          fontSize: "13px",
          lineHeight: 1.6,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function PointsRow({
  icon,
  points,
  text,
}: {
  icon: string;
  points: string;
  text: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 14px",
        borderRadius: "11px",
        background: "rgba(255,255,255,0.035)",
      }}
    >
      <span>{icon}</span>

      <strong
        style={{
          minWidth: "75px",
          color: "#42e985",
          fontSize: "13px",
        }}
      >
        {points}
      </strong>

      <span
        style={{
          color: "#a1b3a8",
          fontSize: "13px",
        }}
      >
        {text}
      </span>
    </div>
  );
}

function HeroStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div>
      <div
        style={{
          color: "white",
          fontSize: "24px",
          fontWeight: 950,
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: "4px",
          color: "#70877a",
          fontSize: "11px",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function FooterButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: 0,
        border: "none",
        background: "transparent",
        color: "#758a7e",
        fontSize: "12px",
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}


type HomeLanguage = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

const homeTranslations: Record<HomeLanguage, Record<string, string>> = {
  nl: {},
  en: {
    'Voorspel. Beleef. Win punten.': 'Predict. Experience. Earn points.',
    'Voorspel echte voetbalwedstrijden, verzamel punten en strijd met vrienden en andere voetbalfans.': 'Predict real football matches, collect points and compete with friends and other football fans.',
    'Echte wedstrijden': 'Real matches',
    'Wereldwijde ranglijst': 'Global leaderboard',
    'Speel met vrienden': 'Play with friends',
    'Ontdek de competities': 'Discover the competitions',
    'Bekijk de puntentelling en ontdek hoe jouw voorspellingen worden beloond.': 'View the scoring system and discover how your predictions are rewarded.',
    'Bekijk wie de meeste punten heeft en klim zelf naar de top.': 'See who has the most points and climb to the top yourself.',
    "DE VOETBAL VOORSPELLINGSGAME":"THE FOOTBALL PREDICTION GAME","Voorspel. Scoor. Klim.":"Predict. Score. Climb.","Voorspel echte voetbalwedstrijden, verdien punten en neem het op tegen andere voetbalfans.":"Predict real football matches, earn points and compete with other football fans.","Welkom terug":"Welcome back","Begin met voorspellen →":"Start predicting →","Begin gratis →":"Start for free →","Inloggen":"Log in","Bekijk ranglijst":"View leaderboard","Meer goals = meer punten":"More goals = more points","Per doelpunt afwijking":"Per goal difference","Gratis spelen":"Free to play","Kies je competitie":"Choose your competition","Populaire competities":"Popular competitions","Kies een competitie en begin direct met het voorspellen van wedstrijden.":"Choose a competition and start predicting matches right away.","Bekijk alle wedstrijden →":"View all matches →","Simpel en gratis":"Simple and free","Hoe werkt VoetIQ?":"How does VoetIQ work?","Kies wedstrijden, voorspel de score en verdien meer punten naarmate jouw voorspelling nauwkeuriger is.":"Choose matches, predict the score and earn more points the more accurate your prediction is.","Maak een account":"Create an account","Registreer gratis en maak je eigen VoetIQ-profiel.":"Sign up for free and create your own VoetIQ profile.","Voorspel":"Predict","Vul jouw voorspelling in voor aankomende voetbalwedstrijden.":"Enter your prediction for upcoming football matches.","Verdien punten":"Earn points","Hoe nauwkeuriger je voorspelling, hoe meer punten je verdient.":"The more accurate your prediction, the more points you earn.","Klim omhoog":"Climb the rankings","Vergelijk je score met andere spelers op de ranglijst.":"Compare your score with other players on the leaderboard.","Puntentelling":"Scoring","Iedere voorspelling telt.":"Every prediction counts.","Hoe nauwkeuriger jouw voorspelling, hoe meer punten je verdient. Een moeilijke hoge score die je exact voorspelt kan dus veel opleveren.":"The more accurate your prediction, the more points you earn. Predicting a difficult high-scoring result exactly can therefore earn you a lot.","Exact goed: meer goals betekent meer punten":"Exact score: more goals means more points","-2 punten":"-2 points","Per doelpunt dat je van de echte uitslag af zit":"For each goal your prediction differs from the actual score","32 punten":"32 points","Voorbeeld: 6-5 exact voorspeld":"Example: exact 6-5 prediction","0 punten":"0 points","Verkeerde winnaar of verkeerd gelijkspel":"Wrong winner or incorrectly predicted draw","Ranglijsten":"Leaderboards","Wie heeft de meeste voetbal-IQ?":"Who has the highest football IQ?","Verzamel punten, volg je prestaties en probeer steeds hoger op de VoetIQ-ranglijst te komen.":"Collect points, track your performance and climb the VoetIQ leaderboard.","Bekijk de ranglijst →":"View the leaderboard →","Speel tegen je vrienden":"Play against your friends","Maak een eigen poule, nodig je vrienden uit en strijd samen om de hoogste plek op jullie eigen ranglijst.":"Create your own pool, invite your friends and compete for the top spot on your own leaderboard.","Bekijk poules →":"View pools →","Klaar om jouw voetbal-IQ te testen?":"Ready to test your football IQ?","Doe mee, voorspel wedstrijden en kijk hoe hoog jij op de ranglijst kunt komen.":"Join in, predict matches and see how high you can climb on the leaderboard.","Ga naar wedstrijden →":"Go to matches →","Maak gratis een account →":"Create a free account →","Wedstrijden":"Matches","Ranglijst":"Leaderboard","Voorwaarden":"Terms","Privacy":"Privacy","Predictor":"Predictor","Voorspel nu →":"Predict now →",
    "Voorspel wedstrijden van Ajax, PSV, Feyenoord en de rest van de Eredivisie.":"Predict matches featuring Ajax, PSV, Feyenoord and the rest of the Eredivisie.","Test je voetbalkennis in één van de grootste competities ter wereld.":"Test your football knowledge in one of the world's biggest leagues.","Voorspel de wedstrijden uit de hoogste Spaanse voetbalcompetitie.":"Predict matches from Spain's top football league.","Neem het op tegen andere voorspellers met wedstrijden uit Duitsland.":"Compete with other predictors on matches from Germany.","Doe voorspellingen voor de grootste clubs uit het Italiaanse voetbal.":"Predict matches involving the biggest clubs in Italian football.","Voorspel de grootste Europese wedstrijden en verdien punten.":"Predict Europe's biggest matches and earn points."
  },
  de: {
    'Voorspel. Beleef. Win punten.': 'Tippen. Mitfiebern. Punkte sammeln.',
    'Voorspel echte voetbalwedstrijden, verzamel punten en strijd met vrienden en andere voetbalfans.': 'Tippe echte Fußballspiele, sammle Punkte und tritt gegen Freunde und andere Fußballfans an.',
    'Echte wedstrijden': 'Echte Spiele',
    'Wereldwijde ranglijst': 'Globale Rangliste',
    'Speel met vrienden': 'Mit Freunden spielen',
    'Ontdek de competities': 'Wettbewerbe entdecken',
    'Bekijk de puntentelling en ontdek hoe jouw voorspellingen worden beloond.': 'Sieh dir das Punktesystem an und erfahre, wie deine Tipps belohnt werden.',
    'Bekijk wie de meeste punten heeft en klim zelf naar de top.': 'Sieh, wer die meisten Punkte hat, und kämpfe dich selbst an die Spitze.',
    "DE VOETBAL VOORSPELLINGSGAME":"DAS FUSSBALL-TIPPSPIEL","Voorspel. Scoor. Klim.":"Tippen. Punkten. Aufsteigen.","Voorspel echte voetbalwedstrijden, verdien punten en neem het op tegen andere voetbalfans.":"Tippe echte Fußballspiele, sammle Punkte und tritt gegen andere Fußballfans an.","Welkom terug":"Willkommen zurück","Begin met voorspellen →":"Jetzt tippen →","Begin gratis →":"Kostenlos starten →","Inloggen":"Anmelden","Bekijk ranglijst":"Rangliste ansehen","Meer goals = meer punten":"Mehr Tore = mehr Punkte","Per doelpunt afwijking":"Pro Tor Abweichung","Gratis spelen":"Kostenlos spielen","Kies je competitie":"Wähle deinen Wettbewerb","Populaire competities":"Beliebte Wettbewerbe","Kies een competitie en begin direct met het voorspellen van wedstrijden.":"Wähle einen Wettbewerb und tippe direkt die nächsten Spiele.","Bekijk alle wedstrijden →":"Alle Spiele ansehen →","Simpel en gratis":"Einfach und kostenlos","Hoe werkt VoetIQ?":"Wie funktioniert VoetIQ?","Kies wedstrijden, voorspel de score en verdien meer punten naarmate jouw voorspelling nauwkeuriger is.":"Wähle Spiele aus, tippe das Ergebnis und sammle umso mehr Punkte, je genauer dein Tipp ist.","Maak een account":"Konto erstellen","Registreer gratis en maak je eigen VoetIQ-profiel.":"Registriere dich kostenlos und erstelle dein eigenes VoetIQ-Profil.","Voorspel":"Tippen","Vul jouw voorspelling in voor aankomende voetbalwedstrijden.":"Gib deinen Tipp für kommende Fußballspiele ab.","Verdien punten":"Punkte sammeln","Hoe nauwkeuriger je voorspelling, hoe meer punten je verdient.":"Je genauer dein Tipp, desto mehr Punkte bekommst du.","Klim omhoog":"Aufsteigen","Vergelijk je score met andere spelers op de ranglijst.":"Vergleiche deine Punkte mit anderen Spielern in der Rangliste.","Puntentelling":"Punktesystem","Iedere voorspelling telt.":"Jeder Tipp zählt.","Hoe nauwkeuriger jouw voorspelling, hoe meer punten je verdient. Een moeilijke hoge score die je exact voorspelt kan dus veel opleveren.":"Je genauer dein Tipp, desto mehr Punkte bekommst du. Ein exakt getipptes torreiches Ergebnis kann daher besonders viele Punkte bringen.","Exact goed: meer goals betekent meer punten":"Exakter Tipp: Mehr Tore bedeuten mehr Punkte","-2 punten":"-2 Punkte","Per doelpunt dat je van de echte uitslag af zit":"Für jedes Tor Abweichung vom tatsächlichen Ergebnis","32 punten":"32 Punkte","Voorbeeld: 6-5 exact voorspeld":"Beispiel: 6:5 exakt getippt","0 punten":"0 Punkte","Verkeerde winnaar of verkeerd gelijkspel":"Falscher Sieger oder fälschlich auf Unentschieden getippt","Ranglijsten":"Ranglisten","Wie heeft de meeste voetbal-IQ?":"Wer hat den höchsten Fußball-IQ?","Verzamel punten, volg je prestaties en probeer steeds hoger op de VoetIQ-ranglijst te komen.":"Sammle Punkte, verfolge deine Leistung und steige in der VoetIQ-Rangliste immer weiter auf.","Bekijk de ranglijst →":"Rangliste ansehen →","Speel tegen je vrienden":"Spiele gegen deine Freunde","Maak een eigen poule, nodig je vrienden uit en strijd samen om de hoogste plek op jullie eigen ranglijst.":"Erstelle eine eigene Tipprunde, lade deine Freunde ein und kämpft um Platz eins in eurer Rangliste.","Bekijk poules →":"Tipprunden ansehen →","Klaar om jouw voetbal-IQ te testen?":"Bereit, deinen Fußball-IQ zu testen?","Doe mee, voorspel wedstrijden en kijk hoe hoog jij op de ranglijst kunt komen.":"Mach mit, tippe Spiele und finde heraus, wie weit du in der Rangliste nach oben kommst.","Ga naar wedstrijden →":"Zu den Spielen →","Maak gratis een account →":"Kostenloses Konto erstellen →","Wedstrijden":"Spiele","Ranglijst":"Rangliste","Voorwaarden":"Nutzungsbedingungen","Privacy":"Datenschutz","Predictor":"Tippspiel","Voorspel nu →":"Jetzt tippen →",
    "Voorspel wedstrijden van Ajax, PSV, Feyenoord en de rest van de Eredivisie.":"Tippe Spiele von Ajax, PSV, Feyenoord und den übrigen Teams der Eredivisie.","Test je voetbalkennis in één van de grootste competities ter wereld.":"Teste dein Fußballwissen in einer der größten Ligen der Welt.","Voorspel de wedstrijden uit de hoogste Spaanse voetbalcompetitie.":"Tippe die Spiele der höchsten spanischen Fußballliga.","Neem het op tegen andere voorspellers met wedstrijden uit Duitsland.":"Tritt bei Spielen aus Deutschland gegen andere Tipper an.","Doe voorspellingen voor de grootste clubs uit het Italiaanse voetbal.":"Tippe die Spiele der größten Vereine im italienischen Fußball.","Voorspel de grootste Europese wedstrijden en verdien punten.":"Tippe die größten europäischen Spiele und sammle Punkte."
  },
  es: {}, fr: {}, it: {}, pt: {}
};

const fallbackTranslations: Record<Exclude<HomeLanguage, "nl" | "en" | "de">, Record<string, string>> = {
  es: {
    "DE VOETBAL VOORSPELLINGSGAME":"EL JUEGO DE PRONÓSTICOS DE FÚTBOL","Voorspel. Scoor. Klim.":"Pronostica. Puntúa. Sube.","Welkom terug":"Bienvenido de nuevo","Begin met voorspellen →":"Empezar a pronosticar →","Begin gratis →":"Empezar gratis →","Inloggen":"Iniciar sesión","Bekijk ranglijst":"Ver clasificación","Meer goals = meer punten":"Más goles = más puntos","Per doelpunt afwijking":"Por cada gol de diferencia","Gratis spelen":"Jugar gratis","Kies je competitie":"Elige tu competición","Populaire competities":"Competiciones populares","Bekijk alle wedstrijden →":"Ver todos los partidos →","Simpel en gratis":"Fácil y gratis","Hoe werkt VoetIQ?":"¿Cómo funciona VoetIQ?","Maak een account":"Crea una cuenta","Voorspel":"Pronostica","Verdien punten":"Gana puntos","Klim omhoog":"Sube en la clasificación","Puntentelling":"Sistema de puntos","Iedere voorspelling telt.":"Cada pronóstico cuenta.","Ranglijsten":"Clasificaciones","Wie heeft de meeste voetbal-IQ?":"¿Quién tiene el mayor IQ futbolístico?","Bekijk de ranglijst →":"Ver la clasificación →","Speel tegen je vrienden":"Juega contra tus amigos","Bekijk poules →":"Ver grupos →","Klaar om jouw voetbal-IQ te testen?":"¿Listo para poner a prueba tu IQ futbolístico?","Ga naar wedstrijden →":"Ir a los partidos →","Maak gratis een account →":"Crear una cuenta gratis →","Wedstrijden":"Partidos","Ranglijst":"Clasificación","Voorwaarden":"Términos","Privacy":"Privacidad","Predictor":"Pronósticos","Voorspel nu →":"Pronosticar ahora →","-2 punten":"-2 puntos","32 punten":"32 puntos","0 punten":"0 puntos"
  },
  fr: {
    "DE VOETBAL VOORSPELLINGSGAME":"LE JEU DE PRONOSTICS FOOTBALL","Voorspel. Scoor. Klim.":"Pronostiquez. Marquez. Grimpez.","Welkom terug":"Bon retour","Begin met voorspellen →":"Commencer à pronostiquer →","Begin gratis →":"Commencer gratuitement →","Inloggen":"Se connecter","Bekijk ranglijst":"Voir le classement","Meer goals = meer punten":"Plus de buts = plus de points","Per doelpunt afwijking":"Par but d'écart","Gratis spelen":"Jouer gratuitement","Kies je competitie":"Choisissez votre compétition","Populaire competities":"Compétitions populaires","Bekijk alle wedstrijden →":"Voir tous les matchs →","Simpel en gratis":"Simple et gratuit","Hoe werkt VoetIQ?":"Comment fonctionne VoetIQ ?","Maak een account":"Créer un compte","Voorspel":"Pronostiquez","Verdien punten":"Gagnez des points","Klim omhoog":"Grimpez au classement","Puntentelling":"Système de points","Iedere voorspelling telt.":"Chaque pronostic compte.","Ranglijsten":"Classements","Wie heeft de meeste voetbal-IQ?":"Qui a le meilleur QI football ?","Bekijk de ranglijst →":"Voir le classement →","Speel tegen je vrienden":"Jouez contre vos amis","Bekijk poules →":"Voir les ligues →","Klaar om jouw voetbal-IQ te testen?":"Prêt à tester votre QI football ?","Ga naar wedstrijden →":"Voir les matchs →","Maak gratis een account →":"Créer un compte gratuit →","Wedstrijden":"Matchs","Ranglijst":"Classement","Voorwaarden":"Conditions","Privacy":"Confidentialité","Predictor":"Pronostics","Voorspel nu →":"Pronostiquer →","-2 punten":"-2 points","32 punten":"32 points","0 punten":"0 point"
  },
  it: {
    "DE VOETBAL VOORSPELLINGSGAME":"IL GIOCO DEI PRONOSTICI DI CALCIO","Voorspel. Scoor. Klim.":"Pronostica. Segna. Sali.","Welkom terug":"Bentornato","Begin met voorspellen →":"Inizia a pronosticare →","Begin gratis →":"Inizia gratis →","Inloggen":"Accedi","Bekijk ranglijst":"Vedi classifica","Meer goals = meer punten":"Più gol = più punti","Per doelpunt afwijking":"Per ogni gol di differenza","Gratis spelen":"Gioca gratis","Kies je competitie":"Scegli la competizione","Populaire competities":"Competizioni popolari","Bekijk alle wedstrijden →":"Vedi tutte le partite →","Simpel en gratis":"Semplice e gratuito","Hoe werkt VoetIQ?":"Come funziona VoetIQ?","Maak een account":"Crea un account","Voorspel":"Pronostica","Verdien punten":"Guadagna punti","Klim omhoog":"Sali in classifica","Puntentelling":"Sistema di punteggio","Iedere voorspelling telt.":"Ogni pronostico conta.","Ranglijsten":"Classifiche","Wie heeft de meeste voetbal-IQ?":"Chi ha il QI calcistico più alto?","Bekijk de ranglijst →":"Vedi la classifica →","Speel tegen je vrienden":"Gioca contro i tuoi amici","Bekijk poules →":"Vedi i gruppi →","Klaar om jouw voetbal-IQ te testen?":"Pronto a mettere alla prova il tuo QI calcistico?","Ga naar wedstrijden →":"Vai alle partite →","Maak gratis een account →":"Crea un account gratuito →","Wedstrijden":"Partite","Ranglijst":"Classifica","Voorwaarden":"Termini","Privacy":"Privacy","Predictor":"Pronostici","Voorspel nu →":"Pronostica ora →","-2 punten":"-2 punti","32 punten":"32 punti","0 punten":"0 punti"
  },
  pt: {
    "DE VOETBAL VOORSPELLINGSGAME":"O JOGO DE PALPITES DE FUTEBOL","Voorspel. Scoor. Klim.":"Prevê. Pontua. Sobe.","Welkom terug":"Bem-vindo de volta","Begin met voorspellen →":"Começar a prever →","Begin gratis →":"Começar grátis →","Inloggen":"Iniciar sessão","Bekijk ranglijst":"Ver classificação","Meer goals = meer punten":"Mais golos = mais pontos","Per doelpunt afwijking":"Por cada golo de diferença","Gratis spelen":"Jogar grátis","Kies je competitie":"Escolhe a competição","Populaire competities":"Competições populares","Bekijk alle wedstrijden →":"Ver todos os jogos →","Simpel en gratis":"Simples e grátis","Hoe werkt VoetIQ?":"Como funciona o VoetIQ?","Maak een account":"Criar uma conta","Voorspel":"Prevê","Verdien punten":"Ganha pontos","Klim omhoog":"Sobe na classificação","Puntentelling":"Sistema de pontos","Iedere voorspelling telt.":"Cada palpite conta.","Ranglijsten":"Classificações","Wie heeft de meeste voetbal-IQ?":"Quem tem o maior QI futebolístico?","Bekijk de ranglijst →":"Ver a classificação →","Speel tegen je vrienden":"Joga contra os teus amigos","Bekijk poules →":"Ver grupos →","Klaar om jouw voetbal-IQ te testen?":"Pronto para testar o teu QI futebolístico?","Ga naar wedstrijden →":"Ir para os jogos →","Maak gratis een account →":"Criar uma conta grátis →","Wedstrijden":"Jogos","Ranglijst":"Classificação","Voorwaarden":"Termos","Privacy":"Privacidade","Predictor":"Palpites","Voorspel nu →":"Prever agora →","-2 punten":"-2 pontos","32 punten":"32 pontos","0 punten":"0 pontos"
  }
};
Object.assign(homeTranslations.es, fallbackTranslations.es);
Object.assign(homeTranslations.fr, fallbackTranslations.fr);
Object.assign(homeTranslations.it, fallbackTranslations.it);
Object.assign(homeTranslations.pt, fallbackTranslations.pt);
Object.assign(homeTranslations.es, {"Voorspel echte voetbalwedstrijden, verdien punten en neem het op tegen andere voetbalfans.": "Pronostica partidos de fútbol reales, gana puntos y compite contra otros aficionados.", "Kies een competitie en begin direct met het voorspellen van wedstrijden.": "Elige una competición y empieza a pronosticar partidos de inmediato.", "Kies wedstrijden, voorspel de score en verdien meer punten naarmate jouw voorspelling nauwkeuriger is.": "Elige partidos, pronostica el resultado y gana más puntos cuanto más preciso sea tu pronóstico.", "Registreer gratis en maak je eigen VoetIQ-profiel.": "Regístrate gratis y crea tu propio perfil de VoetIQ.", "Vul jouw voorspelling in voor aankomende voetbalwedstrijden.": "Introduce tu pronóstico para los próximos partidos de fútbol.", "Hoe nauwkeuriger je voorspelling, hoe meer punten je verdient.": "Cuanto más preciso sea tu pronóstico, más puntos ganarás.", "Vergelijk je score met andere spelers op de ranglijst.": "Compara tu puntuación con la de otros jugadores en la clasificación.", "Hoe nauwkeuriger jouw voorspelling, hoe meer punten je verdient. Een moeilijke hoge score die je exact voorspelt kan dus veel opleveren.": "Cuanto más preciso sea tu pronóstico, más puntos ganarás. Acertar exactamente un resultado difícil con muchos goles puede darte muchos puntos.", "Exact goed: meer goals betekent meer punten": "Resultado exacto: más goles significan más puntos", "Per doelpunt dat je van de echte uitslag af zit": "Por cada gol de diferencia respecto al resultado real", "Voorbeeld: 6-5 exact voorspeld": "Ejemplo: 6-5 pronosticado exactamente", "Verkeerde winnaar of verkeerd gelijkspel": "Ganador incorrecto o empate pronosticado erróneamente", "Verzamel punten, volg je prestaties en probeer steeds hoger op de VoetIQ-ranglijst te komen.": "Acumula puntos, sigue tu rendimiento e intenta subir cada vez más en la clasificación de VoetIQ.", "Maak een eigen poule, nodig je vrienden uit en strijd samen om de hoogste plek op jullie eigen ranglijst.": "Crea tu propio grupo, invita a tus amigos y competid por el primer puesto de vuestra clasificación.", "Doe mee, voorspel wedstrijden en kijk hoe hoog jij op de ranglijst kunt komen.": "Participa, pronostica partidos y descubre hasta dónde puedes subir en la clasificación.", "Voorspel wedstrijden van Ajax, PSV, Feyenoord en de rest van de Eredivisie.": "Pronostica los partidos del Ajax, PSV, Feyenoord y el resto de la Eredivisie.", "Test je voetbalkennis in één van de grootste competities ter wereld.": "Pon a prueba tus conocimientos de fútbol en una de las ligas más importantes del mundo.", "Voorspel de wedstrijden uit de hoogste Spaanse voetbalcompetitie.": "Pronostica los partidos de la máxima categoría del fútbol español.", "Neem het op tegen andere voorspellers met wedstrijden uit Duitsland.": "Compite contra otros jugadores con partidos del fútbol alemán.", "Doe voorspellingen voor de grootste clubs uit het Italiaanse voetbal.": "Haz pronósticos para los partidos de los clubes más importantes del fútbol italiano.", "Voorspel de grootste Europese wedstrijden en verdien punten.": "Pronostica los grandes partidos europeos y gana puntos."});
Object.assign(homeTranslations.fr, {"Voorspel echte voetbalwedstrijden, verdien punten en neem het op tegen andere voetbalfans.": "Pronostiquez de vrais matchs de football, gagnez des points et affrontez d’autres fans de football.", "Kies een competitie en begin direct met het voorspellen van wedstrijden.": "Choisissez une compétition et commencez immédiatement à pronostiquer les matchs.", "Kies wedstrijden, voorspel de score en verdien meer punten naarmate jouw voorspelling nauwkeuriger is.": "Choisissez des matchs, pronostiquez le score et gagnez davantage de points lorsque votre pronostic est plus précis.", "Registreer gratis en maak je eigen VoetIQ-profiel.": "Inscrivez-vous gratuitement et créez votre propre profil VoetIQ.", "Vul jouw voorspelling in voor aankomende voetbalwedstrijden.": "Saisissez votre pronostic pour les prochains matchs de football.", "Hoe nauwkeuriger je voorspelling, hoe meer punten je verdient.": "Plus votre pronostic est précis, plus vous gagnez de points.", "Vergelijk je score met andere spelers op de ranglijst.": "Comparez votre score à celui des autres joueurs dans le classement.", "Hoe nauwkeuriger jouw voorspelling, hoe meer punten je verdient. Een moeilijke hoge score die je exact voorspelt kan dus veel opleveren.": "Plus votre pronostic est précis, plus vous gagnez de points. Pronostiquer exactement un score élevé et difficile peut donc rapporter beaucoup de points.", "Exact goed: meer goals betekent meer punten": "Score exact : plus il y a de buts, plus vous gagnez de points", "Per doelpunt dat je van de echte uitslag af zit": "Pour chaque but d’écart avec le score réel", "Voorbeeld: 6-5 exact voorspeld": "Exemple : score de 6-5 pronostiqué exactement", "Verkeerde winnaar of verkeerd gelijkspel": "Mauvais vainqueur ou match nul pronostiqué à tort", "Verzamel punten, volg je prestaties en probeer steeds hoger op de VoetIQ-ranglijst te komen.": "Cumulez des points, suivez vos performances et tentez de grimper dans le classement VoetIQ.", "Maak een eigen poule, nodig je vrienden uit en strijd samen om de hoogste plek op jullie eigen ranglijst.": "Créez votre propre ligue, invitez vos amis et disputez-vous la première place de votre classement.", "Doe mee, voorspel wedstrijden en kijk hoe hoog jij op de ranglijst kunt komen.": "Participez, pronostiquez des matchs et voyez jusqu’où vous pouvez monter dans le classement.", "Voorspel wedstrijden van Ajax, PSV, Feyenoord en de rest van de Eredivisie.": "Pronostiquez les matchs de l’Ajax, du PSV, de Feyenoord et des autres clubs d’Eredivisie.", "Test je voetbalkennis in één van de grootste competities ter wereld.": "Testez vos connaissances footballistiques dans l’un des plus grands championnats au monde.", "Voorspel de wedstrijden uit de hoogste Spaanse voetbalcompetitie.": "Pronostiquez les matchs du championnat espagnol de première division.", "Neem het op tegen andere voorspellers met wedstrijden uit Duitsland.": "Affrontez d’autres pronostiqueurs sur les matchs du championnat allemand.", "Doe voorspellingen voor de grootste clubs uit het Italiaanse voetbal.": "Pronostiquez les matchs des plus grands clubs du football italien.", "Voorspel de grootste Europese wedstrijden en verdien punten.": "Pronostiquez les plus grands matchs européens et gagnez des points."});
Object.assign(homeTranslations.it, {"Voorspel echte voetbalwedstrijden, verdien punten en neem het op tegen andere voetbalfans.": "Pronostica vere partite di calcio, guadagna punti e sfida altri appassionati di calcio.", "Kies een competitie en begin direct met het voorspellen van wedstrijden.": "Scegli una competizione e inizia subito a pronosticare le partite.", "Kies wedstrijden, voorspel de score en verdien meer punten naarmate jouw voorspelling nauwkeuriger is.": "Scegli le partite, pronostica il risultato e guadagna più punti quanto più preciso è il tuo pronostico.", "Registreer gratis en maak je eigen VoetIQ-profiel.": "Registrati gratuitamente e crea il tuo profilo VoetIQ.", "Vul jouw voorspelling in voor aankomende voetbalwedstrijden.": "Inserisci il tuo pronostico per le prossime partite di calcio.", "Hoe nauwkeuriger je voorspelling, hoe meer punten je verdient.": "Più preciso è il tuo pronostico, più punti guadagni.", "Vergelijk je score met andere spelers op de ranglijst.": "Confronta il tuo punteggio con quello degli altri giocatori in classifica.", "Hoe nauwkeuriger jouw voorspelling, hoe meer punten je verdient. Een moeilijke hoge score die je exact voorspelt kan dus veel opleveren.": "Più preciso è il tuo pronostico, più punti guadagni. Indovinare esattamente un risultato difficile con molti gol può quindi valere molti punti.", "Exact goed: meer goals betekent meer punten": "Risultato esatto: più gol significano più punti", "Per doelpunt dat je van de echte uitslag af zit": "Per ogni gol di differenza rispetto al risultato reale", "Voorbeeld: 6-5 exact voorspeld": "Esempio: 6-5 pronosticato esattamente", "Verkeerde winnaar of verkeerd gelijkspel": "Vincitore sbagliato o pareggio pronosticato erroneamente", "Verzamel punten, volg je prestaties en probeer steeds hoger op de VoetIQ-ranglijst te komen.": "Accumula punti, segui le tue prestazioni e prova a salire sempre più in alto nella classifica VoetIQ.", "Maak een eigen poule, nodig je vrienden uit en strijd samen om de hoogste plek op jullie eigen ranglijst.": "Crea il tuo gruppo, invita i tuoi amici e sfidatevi per il primo posto nella vostra classifica.", "Doe mee, voorspel wedstrijden en kijk hoe hoog jij op de ranglijst kunt komen.": "Partecipa, pronostica le partite e scopri quanto puoi salire in classifica.", "Voorspel wedstrijden van Ajax, PSV, Feyenoord en de rest van de Eredivisie.": "Pronostica le partite di Ajax, PSV, Feyenoord e delle altre squadre di Eredivisie.", "Test je voetbalkennis in één van de grootste competities ter wereld.": "Metti alla prova le tue conoscenze calcistiche in uno dei campionati più importanti al mondo.", "Voorspel de wedstrijden uit de hoogste Spaanse voetbalcompetitie.": "Pronostica le partite della massima divisione spagnola.", "Neem het op tegen andere voorspellers met wedstrijden uit Duitsland.": "Sfida altri giocatori pronosticando le partite del campionato tedesco.", "Doe voorspellingen voor de grootste clubs uit het Italiaanse voetbal.": "Pronostica le partite dei più grandi club del calcio italiano.", "Voorspel de grootste Europese wedstrijden en verdien punten.": "Pronostica le più grandi partite europee e guadagna punti."});
Object.assign(homeTranslations.pt, {"Voorspel echte voetbalwedstrijden, verdien punten en neem het op tegen andere voetbalfans.": "Prevê resultados de jogos de futebol reais, ganha pontos e compete com outros adeptos.", "Kies een competitie en begin direct met het voorspellen van wedstrijden.": "Escolhe uma competição e começa já a prever os resultados dos jogos.", "Kies wedstrijden, voorspel de score en verdien meer punten naarmate jouw voorspelling nauwkeuriger is.": "Escolhe jogos, prevê o resultado e ganha mais pontos quanto mais precisa for a tua previsão.", "Registreer gratis en maak je eigen VoetIQ-profiel.": "Regista-te gratuitamente e cria o teu próprio perfil VoetIQ.", "Vul jouw voorspelling in voor aankomende voetbalwedstrijden.": "Introduz a tua previsão para os próximos jogos de futebol.", "Hoe nauwkeuriger je voorspelling, hoe meer punten je verdient.": "Quanto mais precisa for a tua previsão, mais pontos ganhas.", "Vergelijk je score met andere spelers op de ranglijst.": "Compara a tua pontuação com a dos outros jogadores na classificação.", "Hoe nauwkeuriger jouw voorspelling, hoe meer punten je verdient. Een moeilijke hoge score die je exact voorspelt kan dus veel opleveren.": "Quanto mais precisa for a tua previsão, mais pontos ganhas. Acertar exatamente num resultado difícil com muitos golos pode, por isso, valer muitos pontos.", "Exact goed: meer goals betekent meer punten": "Resultado exato: mais golos significam mais pontos", "Per doelpunt dat je van de echte uitslag af zit": "Por cada golo de diferença em relação ao resultado real", "Voorbeeld: 6-5 exact voorspeld": "Exemplo: resultado 6-5 previsto exatamente", "Verkeerde winnaar of verkeerd gelijkspel": "Vencedor errado ou empate previsto incorretamente", "Verzamel punten, volg je prestaties en probeer steeds hoger op de VoetIQ-ranglijst te komen.": "Acumula pontos, acompanha o teu desempenho e tenta subir cada vez mais na classificação do VoetIQ.", "Maak een eigen poule, nodig je vrienden uit en strijd samen om de hoogste plek op jullie eigen ranglijst.": "Cria o teu próprio grupo, convida os teus amigos e disputa o primeiro lugar da vossa classificação.", "Doe mee, voorspel wedstrijden en kijk hoe hoog jij op de ranglijst kunt komen.": "Participa, prevê resultados e vê até onde consegues subir na classificação.", "Voorspel wedstrijden van Ajax, PSV, Feyenoord en de rest van de Eredivisie.": "Prevê os resultados dos jogos do Ajax, PSV, Feyenoord e das restantes equipas da Eredivisie.", "Test je voetbalkennis in één van de grootste competities ter wereld.": "Testa os teus conhecimentos de futebol numa das maiores ligas do mundo.", "Voorspel de wedstrijden uit de hoogste Spaanse voetbalcompetitie.": "Prevê os resultados dos jogos da principal liga espanhola.", "Neem het op tegen andere voorspellers met wedstrijden uit Duitsland.": "Compete com outros jogadores nos jogos do campeonato alemão.", "Doe voorspellingen voor de grootste clubs uit het Italiaanse voetbal.": "Faz previsões para os jogos dos maiores clubes do futebol italiano.", "Voorspel de grootste Europese wedstrijden en verdien punten.": "Prevê os maiores jogos europeus e ganha pontos."});

Object.assign(homeTranslations.es, {'Voorspel. Beleef. Win punten.': 'Pronostica. Vive. Gana puntos.', 'Voorspel echte voetbalwedstrijden, verzamel punten en strijd met vrienden en andere voetbalfans.': 'Pronostica partidos de fútbol reales, acumula puntos y compite con amigos y otros aficionados.', 'Echte wedstrijden': 'Partidos reales', 'Wereldwijde ranglijst': 'Clasificación mundial', 'Speel met vrienden': 'Juega con amigos', 'Ontdek de competities': 'Descubre las competiciones', 'Bekijk de puntentelling en ontdek hoe jouw voorspellingen worden beloond.': 'Consulta el sistema de puntos y descubre cómo se premian tus pronósticos.', 'Bekijk wie de meeste punten heeft en klim zelf naar de top.': 'Descubre quién tiene más puntos y sube tú también hasta lo más alto.'});
Object.assign(homeTranslations.fr, {'Voorspel. Beleef. Win punten.': 'Pronostiquez. Vibrez. Gagnez des points.', 'Voorspel echte voetbalwedstrijden, verzamel punten en strijd met vrienden en andere voetbalfans.': 'Pronostiquez de vrais matchs de football, cumulez des points et affrontez vos amis et d’autres fans.', 'Echte wedstrijden': 'Vrais matchs', 'Wereldwijde ranglijst': 'Classement mondial', 'Speel met vrienden': 'Jouez avec vos amis', 'Ontdek de competities': 'Découvrez les compétitions', 'Bekijk de puntentelling en ontdek hoe jouw voorspellingen worden beloond.': 'Consultez le système de points et découvrez comment vos pronostics sont récompensés.', 'Bekijk wie de meeste punten heeft en klim zelf naar de top.': 'Découvrez qui a le plus de points et grimpez vous-même jusqu’au sommet.'});
Object.assign(homeTranslations.it, {'Voorspel. Beleef. Win punten.': 'Pronostica. Vivi. Guadagna punti.', 'Voorspel echte voetbalwedstrijden, verzamel punten en strijd met vrienden en andere voetbalfans.': 'Pronostica vere partite di calcio, accumula punti e sfida amici e altri appassionati.', 'Echte wedstrijden': 'Partite reali', 'Wereldwijde ranglijst': 'Classifica mondiale', 'Speel met vrienden': 'Gioca con gli amici', 'Ontdek de competities': 'Scopri le competizioni', 'Bekijk de puntentelling en ontdek hoe jouw voorspellingen worden beloond.': 'Scopri il sistema di punteggio e come vengono premiati i tuoi pronostici.', 'Bekijk wie de meeste punten heeft en klim zelf naar de top.': 'Scopri chi ha più punti e scala anche tu la classifica.'});
Object.assign(homeTranslations.pt, {'Voorspel. Beleef. Win punten.': 'Prevê. Vive. Ganha pontos.', 'Voorspel echte voetbalwedstrijden, verzamel punten en strijd met vrienden en andere voetbalfans.': 'Prevê jogos de futebol reais, acumula pontos e compete com amigos e outros adeptos.', 'Echte wedstrijden': 'Jogos reais', 'Wereldwijde ranglijst': 'Classificação mundial', 'Speel met vrienden': 'Joga com amigos', 'Ontdek de competities': 'Descobre as competições', 'Bekijk de puntentelling en ontdek hoe jouw voorspellingen worden beloond.': 'Consulta o sistema de pontos e descobre como as tuas previsões são recompensadas.', 'Bekijk wie de meeste punten heeft en klim zelf naar de top.': 'Vê quem tem mais pontos e sobe também até ao topo.'});

function translateHome(language: string, text: string) {
  if (language === "nl") return text;
  const lang = language as HomeLanguage;
  return homeTranslations[lang]?.[text] || homeTranslations.en[text] || text;
}


const discoverCardStyle = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  padding: "22px",
  borderRadius: "18px",
  border: "1px solid rgba(75,255,153,0.10)",
  background: "linear-gradient(145deg, rgba(8,35,23,0.96), rgba(3,18,11,0.96))",
  color: "white",
  textAlign: "left" as const,
  cursor: "pointer",
};

const discoverTitleStyle = {
  display: "block",
  fontSize: "17px",
  fontWeight: 900,
};

const discoverTextStyle = {
  display: "block",
  marginTop: "5px",
  color: "#83998c",
  fontSize: "13px",
  lineHeight: 1.5,
};

const primaryButtonStyle = {
  padding: "14px 24px",
  border: "none",
  borderRadius: "11px",
  background: "#42e985",
  color: "#021108",
  fontSize: "14px",
  fontWeight: 900,
  cursor: "pointer",
};

const secondaryButtonStyle = {
  padding: "14px 24px",
  borderRadius: "11px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.035)",
  color: "white",
  fontSize: "14px",
  fontWeight: 800,
  cursor: "pointer",
};
