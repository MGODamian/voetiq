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

  useEffect(() => {
    loadUser();
  }, []);

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
          minHeight: "620px",
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
            padding: "80px 20px",
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
            ⚽ DE VOETBAL VOORSPELLINGSGAME
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
            Voorspel. Scoor. Klim.
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
            Voorspel echte voetbalwedstrijden, verdien punten
            en neem het op tegen andere voetbalfans.
          </p>

          {!userLoading && username && (
            <div
              style={{
                marginTop: "18px",
                color: "#bcebd0",
                fontSize: "14px",
              }}
            >
              Welkom terug,{" "}
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
                ? "Begin met voorspellen →"
                : "Begin gratis →"}
            </button>

            {!username && !userLoading && (
              <button
                onClick={() => router.push("/inloggen")}
                style={secondaryButtonStyle}
              >
                Inloggen
              </button>
            )}

            {username && (
              <button
                onClick={() => router.push("/ranglijst")}
                style={secondaryButtonStyle}
              >
                🏆 Bekijk ranglijst
              </button>
            )}
          </div>

          <div
            style={{
              maxWidth: "760px",
              margin: "55px auto 0",
              paddingTop: "26px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "20px",
            }}
          >
            <HeroStat
              value="10 → 32+"
              label="Meer goals = meer punten"
            />

            <HeroStat
              value="-2"
              label="Per doelpunt afwijking"
            />

            <HeroStat
              value="100%"
              label="Gratis spelen"
            />
          </div>
        </div>
      </section>

      {/* COMPETITIONS */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "70px 20px",
        }}
      >
        <SectionHeading
          eyebrow="Kies je competitie"
          title="Populaire competities"
          description="Kies een competitie en begin direct met het voorspellen van wedstrijden."
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
              description={competition.description}
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
            Bekijk alle wedstrijden →
          </button>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom:
            "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.018)",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            padding: "70px 20px",
          }}
        >
          <SectionHeading
            eyebrow="Simpel en gratis"
            title="Hoe werkt VoetIQ?"
            description="Kies wedstrijden, voorspel de score en verdien meer punten naarmate jouw voorspelling nauwkeuriger is."
          />

          <div
            style={{
              marginTop: "38px",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "16px",
            }}
          >
            <StepCard
              number="01"
              icon="👤"
              title="Maak een account"
              text="Registreer gratis en maak je eigen VoetIQ-profiel."
            />

            <StepCard
              number="02"
              icon="⚽"
              title="Voorspel"
              text="Vul jouw voorspelling in voor aankomende voetbalwedstrijden."
            />

            <StepCard
              number="03"
              icon="⭐"
              title="Verdien punten"
              text="Hoe nauwkeuriger je voorspelling, hoe meer punten je verdient."
            />

            <StepCard
              number="04"
              icon="🏆"
              title="Klim omhoog"
              text="Vergelijk je score met andere spelers op de ranglijst."
            />
          </div>
        </div>
      </section>

      {/* POINTS */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "70px 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "22px",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              padding: "32px",
              borderRadius: "22px",
              background:
                "linear-gradient(145deg, rgba(11,44,29,0.95), rgba(4,22,13,0.95))",
              border:
                "1px solid rgba(75,255,153,0.12)",
            }}
          >
            <div
              style={{
                color: "#42e985",
                fontSize: "11px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Puntentelling
            </div>

            <h2
              style={{
                margin: "9px 0 10px",
                fontSize: "28px",
                fontWeight: 950,
              }}
            >
              Iedere voorspelling telt.
            </h2>

            <p
              style={{
                margin: 0,
                color: "#899f92",
                lineHeight: 1.65,
                fontSize: "14px",
              }}
            >
              Hoe nauwkeuriger jouw voorspelling, hoe meer
              punten je verdient. Een moeilijke hoge score die
              je exact voorspelt kan dus veel opleveren.
            </p>

            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <PointsRow
                icon="🎯"
                points="10 + goals × 2"
                text="Exact goed: meer goals betekent meer punten"
              />

              <PointsRow
                icon="📉"
                points="-2 punten"
                text="Per doelpunt dat je van de echte uitslag af zit"
              />

              <PointsRow
                icon="🔥"
                points="32 punten"
                text="Voorbeeld: 6-5 exact voorspeld"
              />

              <PointsRow
                icon="❌"
                points="0 punten"
                text="Verkeerde winnaar of verkeerd gelijkspel"
              />
            </div>
          </div>

          <div
            style={{
              padding: "32px",
              borderRadius: "22px",
              background:
                "linear-gradient(145deg, rgba(8,31,21,0.95), rgba(3,17,10,0.95))",
              border:
                "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                color: "#42e985",
                fontSize: "11px",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Ranglijsten
            </div>

            <h2
              style={{
                margin: "9px 0 10px",
                fontSize: "28px",
                fontWeight: 950,
              }}
            >
              Wie heeft de meeste voetbal-IQ?
            </h2>

            <p
              style={{
                margin: 0,
                color: "#899f92",
                lineHeight: 1.65,
                fontSize: "14px",
              }}
            >
              Verzamel punten, volg je prestaties en probeer
              steeds hoger op de VoetIQ-ranglijst te komen.
            </p>

            <button
              onClick={() => router.push("/ranglijst")}
              style={{
                ...secondaryButtonStyle,
                marginTop: "27px",
              }}
            >
              🏆 Bekijk de ranglijst →
            </button>
          </div>
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
            Speel tegen je vrienden
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
            Maak een eigen poule, nodig je vrienden uit en
            strijd samen om de hoogste plek op jullie eigen
            ranglijst.
          </p>

          <button
            onClick={() => router.push("/poules")}
            style={{
              ...secondaryButtonStyle,
              marginTop: "22px",
            }}
          >
            👥 Bekijk poules →
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
            Klaar om jouw voetbal-IQ te testen?
          </h2>

          <p
            style={{
              margin: "0 auto",
              color: "#8da397",
              lineHeight: 1.65,
            }}
          >
            Doe mee, voorspel wedstrijden en kijk hoe hoog jij
            op de ranglijst kunt komen.
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
              ? "Ga naar wedstrijden →"
              : "Maak gratis een account →"}
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
              label="Wedstrijden"
              onClick={() => router.push("/wedstrijden")}
            />

            <FooterButton
              label="Ranglijst"
              onClick={() => router.push("/ranglijst")}
            />

            <FooterButton
              label="Voorwaarden"
              onClick={() => router.push("/voorwaarden")}
            />

            <FooterButton
              label="Privacy"
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
  onPlay,
}: {
  flag: string;
  name: string;
  description: string;
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
            Predictor
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
        Voorspel nu →
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
