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
        setMessage("Je hebt al een voorspelling voor deze wedstrijd.");
        return;
      }

      setMessage("Er ging iets mis bij het opslaan van je voorspelling.");
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
          "radial-gradient(circle at top, rgba(46,230,129,0.08), transparent 35%), #020e09",
        color: "white",
      }}
    >
      <Navbar />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "45px 20px 60px",
        }}
      >
        <section
          style={{
            textAlign: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "7px 12px",
              borderRadius: "999px",
              background: "rgba(46,230,129,0.08)",
              border: "1px solid rgba(46,230,129,0.14)",
              color: "#2ee681",
              fontSize: "12px",
              fontWeight: 800,
              marginBottom: "15px",
            }}
          >
            ⚽ VOORSPEL. SCOOR. WIN.
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(34px, 6vw, 60px)",
              lineHeight: 1,
              fontWeight: 950,
              letterSpacing: "-2px",
            }}
          >
            Voet<span style={{ color: "#2ee681" }}>IQ</span>
          </h1>

          <p
            style={{
              maxWidth: "650px",
              margin: "18px auto 0",
              color: "#9fb6a8",
              fontSize: "16px",
              lineHeight: 1.6,
            }}
          >
            Voorspel echte voetbalwedstrijden, verdien punten en klim omhoog
            op de ranglijst.
          </p>
        </section>

        <section
          style={{
            maxWidth: "650px",
            margin: "0 auto 35px",
            padding: "18px 20px",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.035)",
            border: "1px solid rgba(75,255,153,0.10)",
            textAlign: "center",
          }}
        >
          {userLoading ? (
            <div
              style={{
                color: "#8fa79a",
                fontSize: "14px",
              }}
            >
              Account laden...
            </div>
          ) : username ? (
            <>
              <div
                style={{
                  color: "#2ee681",
                  fontSize: "13px",
                  fontWeight: 800,
                  marginBottom: "4px",
                }}
              >
                👤 Je bent ingelogd
              </div>

              <div
                style={{
                  color: "white",
                  fontSize: "18px",
                  fontWeight: 900,
                }}
              >
                {username}
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  color: "#9fb6a8",
                  fontSize: "14px",
                  marginBottom: "10px",
                }}
              >
                Je bent niet ingelogd.
              </div>

              <button
                onClick={() => router.push("/inloggen")}
                style={{
                  border: "none",
                  borderRadius: "10px",
                  padding: "10px 16px",
                  background: "#2ee681",
                  color: "#03150b",
                  fontWeight: 900,
                  cursor: "pointer",
                }}
              >
                Inloggen
              </button>
            </>
          )}
        </section>

        <section>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              gap: "15px",
              marginBottom: "18px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "25px",
                  fontWeight: 900,
                }}
              >
                Wedstrijden
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#789183",
                  fontSize: "13px",
                }}
              >
                Voorspel de uitslag en verdien punten.
              </p>
            </div>
          </div>

          {loadingMatches ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "#8fa79a",
              }}
            >
              Wedstrijden laden...
            </div>
          ) : matches.length === 0 ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: "#8fa79a",
                background: "rgba(255,255,255,0.03)",
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
                      border: "1px solid rgba(75,255,153,0.10)",
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
                          updateHomeScore(match.id, e.target.value)
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
                          updateAwayScore(match.id, e.target.value)
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
                        background: "#2ee681",
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
            maxWidth: "700px",
            margin: "55px auto 0",
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
            <div>🎯 <strong style={{ color: "white" }}>10 punten</strong> — exacte uitslag goed</div>
            <div>✅ <strong style={{ color: "white" }}>5 punten</strong> — winnaar/gelijkspel goed</div>
            <div>❌ <strong style={{ color: "white" }}>0 punten</strong> — voorspelling fout</div>
          </div>
        </section>

        <footer
          style={{
            marginTop: "60px",
            textAlign: "center",
            color: "#52675b",
            fontSize: "12px",
          }}
        >
          Data provided by football-data.org
        </footer>
      </div>
    </main>
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
