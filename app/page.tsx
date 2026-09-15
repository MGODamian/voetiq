"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/app/Navbar";

type Match = {
  id: number;
  utcDate: string;
  status: string;
  competition?: {
    name: string;
  };
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
};

type Prediction = {
  home: string;
  away: string;
};

export default function Home() {
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<
    Record<number, Prediction>
  >({});
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUser();
    loadMatches();
  }, []);

  async function loadUser() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || "");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUserLoading(false);
    }
  }

  async function loadMatches() {
    try {
      const response = await fetch("/api/matches");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Kon wedstrijden niet laden."
        );
      }

      const upcomingMatches = (data.matches || [])
        .filter(
          (match: Match) =>
            match.status === "SCHEDULED" ||
            match.status === "TIMED"
        )
        .sort(
          (a: Match, b: Match) =>
            new Date(a.utcDate).getTime() -
            new Date(b.utcDate).getTime()
        )
        .slice(0, 6);

      setMatches(upcomingMatches);
    } catch (error) {
      console.error(error);
      setMessage("De wedstrijden konden niet worden geladen.");
    } finally {
      setLoading(false);
    }
  }

  function updatePrediction(
    matchId: number,
    type: "home" | "away",
    value: string
  ) {
    setPredictions((current) => {
      const existing = current[matchId] || {
        home: "",
        away: "",
      };

      return {
        ...current,
        [matchId]: {
          home:
            type === "home" ? value : existing.home,
          away:
            type === "away" ? value : existing.away,
        },
      };
    });
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

    const prediction = predictions[match.id];

    if (
      !prediction ||
      prediction.home === "" ||
      prediction.away === ""
    ) {
      setMessage("Vul beide scores in.");
      return;
    }

    const home = Number(prediction.home);
    const away = Number(prediction.away);

    if (
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0 ||
      home > 20 ||
      away > 20
    ) {
      setMessage("Gebruik geldige scores tussen 0 en 20.");
      return;
    }

    if (
      match.status !== "SCHEDULED" &&
      match.status !== "TIMED"
    ) {
      setMessage(
        "Deze wedstrijd is al begonnen. Voorspellen kan niet meer."
      );
      return;
    }

    const matchName = `${match.homeTeam.name}-${match.awayTeam.name}`;

    const { error } = await supabase
      .from("predictions")
      .insert({
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

    setMessage(
      `Voorspelling opgeslagen: ${match.homeTeam.name} ${home}-${away} ${match.awayTeam.name}`
    );

    setPredictions((current) => ({
      ...current,
      [match.id]: {
        home: "",
        away: "",
      },
    }));
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        color: "#ffffff",
        background:
          "radial-gradient(circle at 50% -10%, rgba(0,190,90,0.25), transparent 35%), linear-gradient(135deg, #03150d 0%, #061f14 45%, #020806 100%)",
        padding: "24px 16px 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: "rgba(0, 190, 90, 0.08)",
          filter: "blur(100px)",
          top: "-200px",
          right: "-150px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          width: "400px",
          height: "400px",
          borderRadius: "50%",
          background: "rgba(0, 255, 140, 0.05)",
          filter: "blur(100px)",
          bottom: "-150px",
          left: "-150px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          opacity: 0.035,
          pointerEvents: "none",
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          maskImage:
            "linear-gradient(to bottom, black, transparent 75%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black, transparent 75%)",
        }}
      />

      <div
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div style={{ marginBottom: "28px" }}>
          <Navbar />
        </div>

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "42px 28px",
            marginBottom: "22px",
            borderRadius: "24px",
            background:
              "linear-gradient(135deg, rgba(11,61,37,0.95), rgba(4,28,18,0.95))",
            border: "1px solid rgba(75,255,153,0.16)",
            boxShadow:
              "0 25px 70px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          <div
            style={{
              position: "absolute",
              width: "260px",
              height: "260px",
              border: "1px solid rgba(71,255,157,0.12)",
              borderRadius: "50%",
              right: "-80px",
              top: "-80px",
            }}
          />

          <div
            style={{
              position: "absolute",
              width: "160px",
              height: "160px",
              border: "1px solid rgba(71,255,157,0.08)",
              borderRadius: "50%",
              right: "-30px",
              top: "-30px",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "7px",
                background: "rgba(36,216,120,0.12)",
                border:
                  "1px solid rgba(36,216,120,0.2)",
                color: "#62efa0",
                padding: "7px 11px",
                borderRadius: "999px",
                fontSize: "12px",
                fontWeight: 800,
                marginBottom: "15px",
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              ⚽ Football predictions
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(38px, 7vw, 64px)",
                lineHeight: 0.98,
                letterSpacing: "-3px",
                fontWeight: 950,
                maxWidth: "700px",
              }}
            >
              Voorspel.
              <br />
              <span style={{ color: "#2ee681" }}>
                Scoor punten.
              </span>
            </h1>

            <p
              style={{
                color: "#a9c1b5",
                fontSize: "17px",
                lineHeight: 1.6,
                maxWidth: "600px",
                margin: "18px 0 0",
              }}
            >
              Voorspel echte voetbalwedstrijden, verdien
              punten en probeer bovenaan de VoetIQ-ranglijst
              te komen.
            </p>
          </div>
        </section>

        <section
          style={{
            background: "rgba(7, 28, 19, 0.78)",
            border:
              "1px solid rgba(255,255,255,0.07)",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "22px",
            backdropFilter: "blur(15px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "rgba(36,216,120,0.12)",
                fontSize: "20px",
              }}
            >
              👤
            </div>

            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                }}
              >
                {userLoading
                  ? "Account laden..."
                  : userEmail
                  ? "Je bent ingelogd"
                  : "Je bent niet ingelogd"}
              </div>

              <div
                style={{
                  fontSize: "12px",
                  color: "#789187",
                  marginTop: "3px",
                }}
              >
                {userLoading
                  ? "Even geduld..."
                  : userEmail
                  ? userEmail
                  : "Log in om mee te doen met VoetIQ."}
              </div>
            </div>
          </div>
        </section>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            marginBottom: "14px",
          }}
        >
          <div>
            <div
              style={{
                color: "#54e998",
                fontSize: "12px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "1px",
                marginBottom: "4px",
              }}
            >
              Upcoming
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "27px",
                letterSpacing: "-0.8px",
              }}
            >
              Wedstrijden
            </h2>
          </div>

          <div
            style={{
              color: "#6f837a",
              fontSize: "12px",
            }}
          >
            Max. 6 wedstrijden
          </div>
        </div>

        {loading && (
          <section
            style={{
              background:
                "rgba(7,28,19,0.78)",
              border:
                "1px solid rgba(255,255,255,0.07)",
              borderRadius: "18px",
              padding: "30px",
              textAlign: "center",
              color: "#8ca69a",
            }}
          >
            Wedstrijden laden...
          </section>
        )}

        {!loading && matches.length === 0 && (
          <section
            style={{
              background:
                "rgba(7,28,19,0.78)",
              border:
                "1px solid rgba(255,255,255,0.07)",
              borderRadius: "18px",
              padding: "35px",
              textAlign: "center",
              color: "#8ca69a",
            }}
          >
            Er zijn momenteel geen aankomende wedstrijden.
          </section>
        )}

        <div
          style={{
            display: "grid",
            gap: "14px",
          }}
        >
          {matches.map((match) => {
            const prediction =
              predictions[match.id] || {
                home: "",
                away: "",
              };

            const matchDate =
              new Date(match.utcDate);

            return (
              <section
                key={match.id}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  background:
                    "linear-gradient(145deg, rgba(10,38,25,0.94), rgba(5,21,14,0.94))",
                  border:
                    "1px solid rgba(255,255,255,0.075)",
                  borderRadius: "19px",
                  padding: "20px",
                  boxShadow:
                    "0 12px 35px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "3px",
                    background:
                      "linear-gradient(to bottom, #2ee681, rgba(46,230,129,0))",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "20px",
                  }}
                >
                  <div
                    style={{
                      color: "#759087",
                      fontSize: "12px",
                      fontWeight: 600,
                    }}
                  >
                    {match.competition?.name ||
                      "Voetbal"}
                  </div>

                  <div
                    style={{
                      color: "#91a69c",
                      fontSize: "12px",
                      background:
                        "rgba(255,255,255,0.04)",
                      padding: "6px 9px",
                      borderRadius: "8px",
                    }}
                  >
                    {matchDate.toLocaleDateString(
                      "nl-NL",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    )}{" "}
                    •{" "}
                    {matchDate.toLocaleTimeString(
                      "nl-NL",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr auto 1fr",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "right",
                      fontWeight: 800,
                      fontSize: "16px",
                      lineHeight: 1.25,
                    }}
                  >
                    {match.homeTeam.name}
                  </div>

                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "center",
                      background:
                        "rgba(36,216,120,0.09)",
                      border:
                        "1px solid rgba(36,216,120,0.16)",
                      color: "#57eb99",
                      fontSize: "11px",
                      fontWeight: 900,
                    }}
                  >
                    VS
                  </div>

                  <div
                    style={{
                      textAlign: "left",
                      fontWeight: 800,
                      fontSize: "16px",
                      lineHeight: 1.25,
                    }}
                  >
                    {match.awayTeam.name}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    paddingTop: "18px",
                    borderTop:
                      "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#71877d",
                      textTransform:
                        "uppercase",
                      letterSpacing: "0.8px",
                      fontWeight: 800,
                      marginBottom: "10px",
                    }}
                  >
                    Jouw voorspelling
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr auto 1fr",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={prediction.home}
                      onChange={(event) =>
                        updatePrediction(
                          match.id,
                          "home",
                          event.target.value
                        )
                      }
                      placeholder="0"
                      style={{
                        width: "100%",
                        boxSizing:
                          "border-box",
                        padding: "14px",
                        background:
                          "rgba(0,0,0,0.24)",
                        border:
                          "1px solid rgba(255,255,255,0.09)",
                        borderRadius: "11px",
                        color: "white",
                        outline: "none",
                        fontSize: "18px",
                        fontWeight: 800,
                        textAlign: "center",
                      }}
                    />

                    <span
                      style={{
                        color: "#6f837a",
                        fontWeight: 900,
                        fontSize: "14px",
                      }}
                    >
                      -
                    </span>

                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={prediction.away}
                      onChange={(event) =>
                        updatePrediction(
                          match.id,
                          "away",
                          event.target.value
                        )
                      }
                      placeholder="0"
                      style={{
                        width: "100%",
                        boxSizing:
                          "border-box",
                        padding: "14px",
                        background:
                          "rgba(0,0,0,0.24)",
                        border:
                          "1px solid rgba(255,255,255,0.09)",
                        borderRadius: "11px",
                        color: "white",
                        outline: "none",
                        fontSize: "18px",
                        fontWeight: 800,
                        textAlign: "center",
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      savePrediction(match)
                    }
                    style={{
                      width: "100%",
                      marginTop: "12px",
                      padding: "14px",
                      border: "none",
                      borderRadius: "11px",
                      background:
                        "linear-gradient(135deg, #2ee681, #18bd68)",
                      color: "#02150b",
                      fontSize: "14px",
                      fontWeight: 900,
                      cursor: "pointer",
                      boxShadow:
                        "0 8px 25px rgba(46,230,129,0.16)",
                    }}
                  >
                    Voorspelling opslaan
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        <section
          style={{
            marginTop: "24px",
            background:
              "rgba(7,28,19,0.78)",
            border:
              "1px solid rgba(255,255,255,0.07)",
            borderRadius: "18px",
            padding: "22px",
          }}
        >
          <div
            style={{
              color: "#54e998",
              fontSize: "12px",
              fontWeight: 800,
              textTransform:
                "uppercase",
              letterSpacing: "1px",
              marginBottom: "7px",
            }}
          >
            Puntentelling
          </div>

          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "22px",
            }}
          >
            Scoor punten met je voorspelling
          </h2>

          <div
            style={{
              display: "grid",
              gap: "9px",
              color: "#9bb0a5",
              fontSize: "14px",
              lineHeight: 1.5,
            }}
          >
            <div>
              🎯{" "}
              <strong
                style={{ color: "#ffffff" }}
              >
                10 punten
              </strong>{" "}
              voor de exacte uitslag.
            </div>

            <div>
              ⚽{" "}
              <strong
                style={{ color: "#ffffff" }}
              >
                5 punten
              </strong>{" "}
              voor de juiste winnaar of een
              correct gelijkspel.
            </div>

            <div>
              ❌{" "}
              <strong
                style={{ color: "#ffffff" }}
              >
                0 punten
              </strong>{" "}
              bij een verkeerde voorspelling.
            </div>
          </div>
        </section>

        <footer
          style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop:
              "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent:
              "space-between",
            gap: "15px",
            flexWrap: "wrap",
            color: "#62766d",
            fontSize: "11px",
          }}
        >
          <div>© 2026 VoetIQ</div>

          <div>
            Data provided by football-data.org
          </div>
        </footer>
      </div>
    </main>
  );
}
