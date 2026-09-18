"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "./Navbar";

type Match = {
  id: number;
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  utcDate: string;
};

export default function Home() {
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  const [userLoading, setUserLoading] = useState(true);
  const [username, setUsername] = useState("");

  const [homeScores, setHomeScores] = useState<Record<number, string>>({});
  const [awayScores, setAwayScores] = useState<Record<number, string>>({});
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadMatches();
    loadUser();
  }, []);

  async function loadMatches() {
    try {
      const response = await fetch("/api/matches");

      if (!response.ok) {
        throw new Error("Wedstrijden konden niet worden geladen.");
      }

      const data = await response.json();

      const upcomingMatches = (data.matches || [])
        .filter(
          (match: Match) =>
            match.homeTeam?.name &&
            match.awayTeam?.name &&
            new Date(match.utcDate).getTime() > Date.now()
        )
        .slice(0, 6);

      setMatches(upcomingMatches);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMatches(false);
    }
  }

  async function loadUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUsername("");
        setUserLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        setUsername("");
      } else {
        setUsername(profile?.username || "");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserLoading(false);
    }
  }

  function updateHomeScore(matchId: number, value: string) {
    setHomeScores((previous) => ({
      ...previous,
      [matchId]: value,
    }));
  }

  function updateAwayScore(matchId: number, value: string) {
    setAwayScores((previous) => ({
      ...previous,
      [matchId]: value,
    }));
  }

  async function savePrediction(match: Match) {
    setMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(
        "Je moet ingelogd zijn om een voorspelling te plaatsen."
      );
      router.push("/inloggen");
      return;
    }

    const homeValue = homeScores[match.id];
    const awayValue = awayScores[match.id];

    if (homeValue === undefined || awayValue === undefined) {
      setMessage("Vul beide uitslagen in.");
      return;
    }

    const home = Number(homeValue);
    const away = Number(awayValue);

    if (
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0 ||
      home > 20 ||
      away > 20
    ) {
      setMessage("Gebruik geldige uitslagen tussen 0 en 20.");
      return;
    }

    const matchName = `${match.homeTeam.name}-${match.awayTeam.name}`;

    const { error } = await supabase.from("predictions").insert({
      user_id: user.id,
      user_email: user.email || "",
      match_id: match.id,
      match_name: matchName,
      home_score: home,
      away_score: away,
    });

    if (error) {
      console.error(error);

      if (error.code === "23505") {
        setMessage(
          "Je hebt al een voorspelling voor deze wedstrijd."
        );
        return;
      }

      setMessage(
        "Er ging iets mis bij het opslaan van je voorspelling."
      );
      return;
    }

    setMessage("Voorspelling opgeslagen! ⚽");

    setHomeScores((previous) => ({
      ...previous,
      [match.id]: "",
    }));

    setAwayScores((previous) => ({
      ...previous,
      [match.id]: "",
    }));
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% 0%, rgba(46,230,129,0.10), transparent 32%), #020d08",
        color: "white",
      }}
    >
      <Navbar />

      {/* HERO */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 40%, rgba(46,230,129,0.12), transparent 38%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "75px 20px 55px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 13px",
              borderRadius: "999px",
              background: "rgba(46,230,129,0.08)",
              border: "1px solid rgba(46,230,129,0.15)",
              color: "#5cf19b",
              fontSize: "12px",
              fontWeight: 900,
              letterSpacing: "0.7px",
            }}
          >
            ⚽ VOORSPEL. SCOOR. KLIM.
          </div>

          <h1
            style={{
              margin: "20px 0 0",
              fontSize: "clamp(52px, 8vw, 86px)",
              lineHeight: 0.95,
              fontWeight: 950,
              letterSpacing: "-4px",
            }}
          >
            Voet<span style={{ color: "#42e985" }}>IQ</span>
          </h1>

          <p
            style={{
              maxWidth: "660px",
              margin: "22px auto 0",
              color: "#a5baae",
              fontSize: "clamp(15px, 2vw, 18px)",
              lineHeight: 1.65,
            }}
          >
            Voorspel echte voetbalwedstrijden, verdien punten
            en daag je vrienden uit.
          </p>

          {!userLoading && username && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                marginTop: "18px",
                color: "#c6f6d9",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              👤 Welkom terug,{" "}
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
              marginTop: "28px",
            }}
          >
            <button
              onClick={() => router.push("/wedstrijden")}
              style={{
                padding: "14px 23px",
                border: "none",
                borderRadius: "11px",
                background: "#42e985",
                color: "#021108",
                fontSize: "14px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              Begin met voorspellen →
            </button>

            <button
              onClick={() => router.push("/ranglijst")}
              style={{
                padding: "14px 23px",
                borderRadius: "11px",
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.035)",
                color: "white",
                fontSize: "14px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              🏆 Bekijk ranglijst
            </button>
          </div>

          {!userLoading && !username && (
            <p
              style={{
                margin: "16px 0 0",
                color: "#71897b",
                fontSize: "13px",
              }}
            >
              Nog geen account?{" "}
              <button
                onClick={() => router.push("/registreren")}
                style={{
                  padding: 0,
                  border: "none",
                  background: "transparent",
                  color: "#42e985",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Gratis registreren
              </button>
            </p>
          )}

          <div
            style={{
              maxWidth: "760px",
              margin: "42px auto 0",
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              paddingTop: "25px",
              gap: "15px",
            }}
          >
            <HeroFeature
              icon="⚽"
              title="Echte wedstrijden"
              text="Voorspel echte voetbalduels"
            />

            <HeroFeature
              icon="🏆"
              title="Ranglijsten"
              text="Klim boven andere spelers"
            />

            <HeroFeature
              icon="🌍"
              title="Topcompetities"
              text="Voorspel meerdere competities"
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "48px 20px 60px",
        }}
      >
        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              flexWrap: "wrap",
              gap: "15px",
              marginBottom: "20px",
            }}
          >
            <div>
              <div
                style={{
                  color: "#42e985",
                  fontSize: "11px",
                  fontWeight: 900,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "7px",
                }}
              >
                Voorspel nu
              </div>

              <h2
                style={{
                  margin: 0,
                  fontSize: "28px",
                  fontWeight: 950,
                }}
              >
                Aankomende wedstrijden
              </h2>

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#789183",
                  fontSize: "13px",
                }}
              >
                Voorspel de uitslag en verdien punten.
              </p>
            </div>

            <button
              onClick={() => router.push("/wedstrijden")}
              style={{
                padding: 0,
                border: "none",
                background: "transparent",
                color: "#42e985",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Bekijk alle wedstrijden →
            </button>
          </div>

          {loadingMatches ? (
            <div
              style={{
                padding: "40px",
                textAlign: "center",
                color: "#8fa79a",
              }}
            >
              Wedstrijden laden...
            </div>
          ) : matches.length === 0 ? (
            <div
              style={{
                padding: "35px",
                textAlign: "center",
                color: "#8fa79a",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
              }}
            >
              Er zijn momenteel geen aankomende wedstrijden gevonden.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {matches.map((match) => {
                const date = new Date(match.utcDate);

                return (
                  <div
                    key={match.id}
                    style={{
                      padding: "20px",
                      borderRadius: "18px",
                      background:
                        "linear-gradient(145deg, rgba(8,36,24,0.96), rgba(4,21,13,0.96))",
                      border:
                        "1px solid rgba(75,255,153,0.10)",
                    }}
                  >
                    <div
                      style={{
                        color: "#789183",
                        fontSize: "12px",
                        textAlign: "center",
                        marginBottom: "16px",
                      }}
                    >
                      {date.toLocaleDateString("nl-NL", {
                        day: "numeric",
                        month: "long",
                      })}{" "}
                      •{" "}
                      {date.toLocaleTimeString("nl-NL", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <div
                        style={{
                          textAlign: "right",
                          fontWeight: 800,
                          fontSize: "14px",
                        }}
                      >
                        {match.homeTeam.name}
                      </div>

                      <div
                        style={{
                          color: "#60776a",
                          fontWeight: 900,
                        }}
                      >
                        -
                      </div>

                      <div
                        style={{
                          textAlign: "left",
                          fontWeight: 800,
                          fontSize: "14px",
                        }}
                      >
                        {match.awayTeam.name}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "20px",
                      }}
                    >
                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={homeScores[match.id] ?? ""}
                        onChange={(e) =>
                          updateHomeScore(
                            match.id,
                            e.target.value
                          )
                        }
                        style={scoreInputStyle}
                        aria-label={`Score ${match.homeTeam.name}`}
                      />

                      <span
                        style={{
                          color: "#60776a",
                          fontWeight: 900,
                        }}
                      >
                        -
                      </span>

                      <input
                        type="number"
                        min="0"
                        max="20"
                        value={awayScores[match.id] ?? ""}
                        onChange={(e) =>
                          updateAwayScore(
                            match.id,
                            e.target.value
                          )
                        }
                        style={scoreInputStyle}
                        aria-label={`Score ${match.awayTeam.name}`}
                      />
                    </div>

                    <button
                      onClick={() => savePrediction(match)}
                      style={{
                        width: "100%",
                        marginTop: "16px",
                        padding: "12px",
                        border: "none",
                        borderRadius: "11px",
                        background: "#42e985",
                        color: "#03150b",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      Voorspelling opslaan
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {message && (
          <div
            style={{
              maxWidth: "650px",
              margin: "25px auto 0",
              padding: "13px 15px",
              borderRadius: "12px",
              background: "rgba(46,230,129,0.07)",
              border: "1px solid rgba(46,230,129,0.13)",
              color: "#bceccc",
              textAlign: "center",
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <section
          style={{
            marginTop: "45px",
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "15px",
          }}
        >
          <InfoCard
            icon="📈"
            title="Klim in de ranglijst"
            text="Verdien punten met je voorspellingen en vergelijk jezelf met andere voetbalfans."
          />

          <InfoCard
            icon="👥"
            title="Speel met vrienden"
            text="Binnenkort kun je eigen leagues maken en vrienden uitdagen."
          />

          <InfoCard
            icon="⭐"
            title="Echte competities"
            text="Voorspel wedstrijden uit verschillende grote voetbalcompetities."
          />

          <InfoCard
            icon="📱"
            title="Altijd en overal"
            text="VoetIQ werkt op computer, tablet en telefoon."
          />
        </section>

        <section
          style={{
            maxWidth: "700px",
            margin: "45px auto 0",
            padding: "25px",
            borderRadius: "18px",
            background: "rgba(255,255,255,0.025)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <h2
            style={{
              margin: "0 0 15px",
              fontSize: "20px",
              fontWeight: 900,
            }}
          >
            Hoe werkt de puntentelling?
          </h2>

          <div
            style={{
              display: "grid",
              gap: "10px",
              color: "#a9bcb0",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            <div>
              🎯{" "}
              <strong style={{ color: "white" }}>
                10 punten
              </strong>{" "}
              — exacte uitslag goed
            </div>

            <div>
              ✅{" "}
              <strong style={{ color: "white" }}>
                5 punten
              </strong>{" "}
              — winnaar/gelijkspel goed
            </div>

            <div>
              ❌{" "}
              <strong style={{ color: "white" }}>
                0 punten
              </strong>{" "}
              — voorspelling fout
            </div>
          </div>
        </section>

        <footer
          style={{
            marginTop: "60px",
            paddingTop: "25px",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            textAlign: "center",
            color: "#52675b",
            fontSize: "12px",
          }}
        >
          © 2026 VoetIQ · Data provided by football-data.org
        </footer>
      </div>
    </main>
  );
}

function HeroFeature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div style={{ fontSize: "22px" }}>{icon}</div>

      <div
        style={{
          marginTop: "7px",
          fontSize: "14px",
          fontWeight: 900,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: "3px",
          color: "#71887b",
          fontSize: "12px",
        }}
      >
        {text}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: "22px",
        borderRadius: "17px",
        background:
          "linear-gradient(145deg, rgba(8,31,21,0.9), rgba(3,18,11,0.9))",
        border: "1px solid rgba(75,255,153,0.09)",
      }}
    >
      <div
        style={{
          fontSize: "23px",
          marginBottom: "13px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: "15px",
          fontWeight: 900,
        }}
      >
        {title}
      </div>

      <p
        style={{
          margin: "7px 0 0",
          color: "#82998c",
          fontSize: "13px",
          lineHeight: 1.55,
        }}
      >
        {text}
      </p>
    </div>
  );
}

const scoreInputStyle = {
  width: "52px",
  height: "46px",
  boxSizing: "border-box" as const,
  textAlign: "center" as const,
  borderRadius: "10px",
  border: "1px solid rgba(75,255,153,0.14)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontSize: "18px",
  fontWeight: 900,
  outline: "none",
};
