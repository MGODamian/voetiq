"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Match = {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number;
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  competition: {
    name: string;
  };
};

type Prediction = {
  home: string;
  away: string;
};

type Competition = {
  code: string;
  name: string;
  flag: string;
};

const competitions: Competition[] = [
  {
    code: "PL",
    name: "Premier League",
    flag: "🏴",
  },
  {
    code: "DED",
    name: "Eredivisie",
    flag: "🇳🇱",
  },
  {
    code: "PD",
    name: "La Liga",
    flag: "🇪🇸",
  },
  {
    code: "BL1",
    name: "Bundesliga",
    flag: "🇩🇪",
  },
  {
    code: "SA",
    name: "Serie A",
    flag: "🇮🇹",
  },
  {
    code: "FL1",
    name: "Ligue 1",
    flag: "🇫🇷",
  },
  {
    code: "PPL",
    name: "Primeira Liga",
    flag: "🇵🇹",
  },
  {
    code: "CL",
    name: "Champions League",
    flag: "🏆",
  },
];

export default function Wedstrijden() {
  const [selectedCompetition, setSelectedCompetition] =
    useState("DED");

  const [matches, setMatches] = useState<Match[]>([]);

  const [predictions, setPredictions] = useState<
    Record<number, Prediction>
  >({});

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedMatchday, setSelectedMatchday] =
    useState<number | null>(null);

  useEffect(() => {
    loadMatches(selectedCompetition);
  }, [selectedCompetition]);

  async function loadMatches(competitionCode: string) {
    setLoading(true);
    setMessage("");
    setMatches([]);
    setSelectedMatchday(null);

    try {
      const response = await fetch(
        `/api/matches?competition=${competitionCode}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error("Kon wedstrijden niet ophalen");
      }

      const data = await response.json();

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
        );

      setMatches(upcomingMatches);

      const matchdays = upcomingMatches
        .map((match: Match) => match.matchday)
        .filter(
          (matchday): matchday is number =>
            typeof matchday === "number"
        );

      if (matchdays.length > 0) {
        setSelectedMatchday(Math.min(...matchdays));
      }
    } catch (error) {
      console.error(error);
      setMessage(
        "De wedstrijden konden niet worden opgehaald."
      );
    } finally {
      setLoading(false);
    }
  }

  const availableMatchdays = useMemo(() => {
    return Array.from(
      new Set(
        matches
          .map((match) => match.matchday)
          .filter(
            (matchday): matchday is number =>
              typeof matchday === "number"
          )
      )
    ).sort((a, b) => a - b);
  }, [matches]);

  const currentMatchdayIndex =
    selectedMatchday !== null
      ? availableMatchdays.indexOf(selectedMatchday)
      : -1;

  const currentMatches = matches.filter(
    (match) => match.matchday === selectedMatchday
  );

  const selectedCompetitionData =
    competitions.find(
      (competition) =>
        competition.code === selectedCompetition
    ) || competitions[1];

  function updatePrediction(
    matchId: number,
    type: "home" | "away",
    value: string
  ) {
    setPredictions((current) => ({
      ...current,
      [matchId]: {
        home: current[matchId]?.home || "",
        away: current[matchId]?.away || "",
        [type]: value,
      },
    }));
  }

  async function savePrediction(match: Match) {
    if (
      match.status !== "SCHEDULED" &&
      match.status !== "TIMED"
    ) {
      setMessage(
        "Deze wedstrijd is al begonnen. Voorspellen kan niet meer."
      );
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(
        "Je moet ingelogd zijn om een voorspelling op te slaan."
      );
      return;
    }

    const prediction = predictions[match.id];

    if (
      !prediction ||
      prediction.home === "" ||
      prediction.away === ""
    ) {
      setMessage("Vul eerst een volledige uitslag in.");
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
      setMessage(
        "Vul een geldige uitslag in van 0 t/m 20."
      );
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
      console.error(profileError);
      setMessage(
        "Je profiel kon niet worden geladen."
      );
      return;
    }

    const matchName = `${match.homeTeam.name} - ${match.awayTeam.name}`;

    const { error } = await supabase
      .from("predictions")
      .insert({
        user_id: user.id,
        user_email: user.email || "",
        player_name: profile?.username || "Speler",
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
      } else {
        setMessage(
          "Er ging iets mis met het opslaan van je voorspelling."
        );
      }

      return;
    }

    setMessage(
      `Voorspelling opgeslagen voor ${matchName}!`
    );

    setPredictions((current) => ({
      ...current,
      [match.id]: {
        home: "",
        away: "",
      },
    }));
  }

  function changeMatchday(direction: "previous" | "next") {
    if (currentMatchdayIndex === -1) {
      return;
    }

    const newIndex =
      direction === "previous"
        ? currentMatchdayIndex - 1
        : currentMatchdayIndex + 1;

    if (
      newIndex >= 0 &&
      newIndex < availableMatchdays.length
    ) {
      setSelectedMatchday(
        availableMatchdays[newIndex]
      );
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f7f5",
        color: "#111",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(135deg, #03140c 0%, #082b1a 100%)",
          color: "white",
          padding:
            "45px 20px 40px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding:
                "7px 12px",
              borderRadius: "999px",
              background:
                "rgba(46,230,129,0.12)",
              border:
                "1px solid rgba(46,230,129,0.2)",
              color: "#70f0aa",
              fontSize: "12px",
              fontWeight: 800,
              marginBottom: "15px",
            }}
          >
            ⚽ VOETIQ MATCH CENTER
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: 900,
              letterSpacing: "-1.5px",
            }}
          >
            Wedstrijden
          </h1>

          <p
            style={{
              margin:
                "10px 0 0",
              color: "#a9bbb2",
              fontSize: "16px",
            }}
          >
            Kies je competitie en voorspel de wedstrijden.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding:
            "30px 20px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "18px",
              padding: "12px",
              boxShadow:
                "0 8px 25px rgba(0,0,0,0.07)",
              overflowX: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "7px",
                minWidth: "max-content",
              }}
            >
              {competitions.map(
                (competition) => {
                  const active =
                    selectedCompetition ===
                    competition.code;

                  return (
                    <button
                      key={competition.code}
                      onClick={() =>
                        setSelectedCompetition(
                          competition.code
                        )
                      }
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding:
                          "11px 15px",
                        borderRadius:
                          "11px",
                        border: active
                          ? "1px solid rgba(46,230,129,0.35)"
                          : "1px solid transparent",
                        background: active
                          ? "#e9faf1"
                          : "transparent",
                        color: active
                          ? "#08763e"
                          : "#52605a",
                        fontSize: "14px",
                        fontWeight:
                          active
                            ? 800
                            : 600,
                        cursor: "pointer",
                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "19px",
                        }}
                      >
                        {competition.flag}
                      </span>

                      {competition.name}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0, 1fr)",
              gap: "20px",
            }}
          >
            <div>
              <div
                style={{
                  background:
                    "linear-gradient(135deg, #0a2a1b, #0b3b25)",
                  borderRadius: "20px",
                  padding: "24px",
                  color: "white",
                  marginBottom:
                    "20px",
                  boxShadow:
                    "0 12px 35px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems:
                      "center",
                    gap: "13px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "34px",
                    }}
                  >
                    {
                      selectedCompetitionData.flag
                    }
                  </span>

                  <div>
                    <div
                      style={{
                        color:
                          "#70f0aa",
                        fontSize:
                          "11px",
                        fontWeight:
                          800,
                        textTransform:
                          "uppercase",
                        letterSpacing:
                          "0.8px",
                      }}
                    >
                      Competitie
                    </div>

                    <h2
                      style={{
                        margin:
                          "4px 0 0",
                        fontSize:
                          "27px",
                      }}
                    >
                      {
                        selectedCompetitionData.name
                      }
                    </h2>
                  </div>
                </div>
              </div>

              {loading && (
                <div
                  style={{
                    background:
                      "white",
                    borderRadius:
                      "18px",
                    padding:
                      "45px",
                    textAlign:
                      "center",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.07)",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        "30px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    ⚽
                  </div>

                  <div
                    style={{
                      color:
                        "#66736c",
                      fontWeight:
                        600,
                    }}
                  >
                    Wedstrijden laden...
                  </div>
                </div>
              )}

              {!loading &&
                availableMatchdays.length ===
                  0 && (
                  <div
                    style={{
                      background:
                        "white",
                      borderRadius:
                        "18px",
                      padding:
                        "45px 25px",
                      textAlign:
                        "center",
                      boxShadow:
                        "0 8px 25px rgba(0,0,0,0.07)",
                    }}
                  >
                    <div
                      style={{
                        fontSize:
                          "35px",
                        marginBottom:
                          "10px",
                      }}
                    >
                      📅
                    </div>

                    <strong
                      style={{
                        fontSize:
                          "17px",
                      }}
                    >
                      Geen komende wedstrijden
                    </strong>

                    <p
                      style={{
                        color:
                          "#777",
                        marginBottom:
                          0,
                      }}
                    >
                      Er zijn momenteel geen
                      aankomende wedstrijden
                      beschikbaar voor deze
                      competitie.
                    </p>
                  </div>
                )}

              {!loading &&
                availableMatchdays.length >
                  0 && (
                  <>
                    <div
                      style={{
                        background:
                          "white",
                        borderRadius:
                          "18px",
                        padding:
                          "12px",
                        display:
                          "flex",
                        alignItems:
                          "center",
                        justifyContent:
                          "space-between",
                        gap: "10px",
                        marginBottom:
                          "20px",
                        boxShadow:
                          "0 8px 25px rgba(0,0,0,0.07)",
                      }}
                    >
                      <button
                        onClick={() =>
                          changeMatchday(
                            "previous"
                          )
                        }
                        disabled={
                          currentMatchdayIndex <=
                          0
                        }
                        style={{
                          border:
                            "none",
                          background:
                            currentMatchdayIndex <=
                            0
                              ? "#f1f3f2"
                              : "#e9faf1",
                          color:
                            currentMatchdayIndex <=
                            0
                              ? "#a1aaa5"
                              : "#08763e",
                          borderRadius:
                            "10px",
                          padding:
                            "11px 15px",
                          fontWeight:
                            800,
                          cursor:
                            currentMatchdayIndex <=
                            0
                              ? "default"
                              : "pointer",
                        }}
                      >
                        ← Vorige
                      </button>

                      <div
                        style={{
                          textAlign:
                            "center",
                        }}
                      >
                        <div
                          style={{
                            color:
                              "#89958e",
                            fontSize:
                              "11px",
                            fontWeight:
                              800,
                            textTransform:
                              "uppercase",
                          }}
                        >
                          Speelronde
                        </div>

                        <strong
                          style={{
                            fontSize:
                              "20px",
                          }}
                        >
                          {
                            selectedMatchday
                          }
                        </strong>
                      </div>

                      <button
                        onClick={() =>
                          changeMatchday(
                            "next"
                          )
                        }
                        disabled={
                          currentMatchdayIndex ===
                          availableMatchdays.length -
                            1
                        }
                        style={{
                          border:
                            "none",
                          background:
                            currentMatchdayIndex ===
                            availableMatchdays.length -
                              1
                              ? "#f1f3f2"
                              : "#e9faf1",
                          color:
                            currentMatchdayIndex ===
                            availableMatchdays.length -
                              1
                              ? "#a1aaa5"
                              : "#08763e",
                          borderRadius:
                            "10px",
                          padding:
                            "11px 15px",
                          fontWeight:
                            800,
                          cursor:
                            currentMatchdayIndex ===
                            availableMatchdays.length -
                              1
                              ? "default"
                              : "pointer",
                        }}
                      >
                        Volgende →
                      </button>
                    </div>

                    <div
                      style={{
                        display:
                          "flex",
                        flexDirection:
                          "column",
                        gap: "14px",
                      }}
                    >
                      {currentMatches.map(
                        (match) => {
                          const prediction =
                            predictions[
                              match.id
                            ] || {
                              home: "",
                              away: "",
                            };

                          const date =
                            new Date(
                              match.utcDate
                            );

                          return (
                            <div
                              key={
                                match.id
                              }
                              style={{
                                background:
                                  "white",
                                borderRadius:
                                  "18px",
                                padding:
                                  "20px",
                                boxShadow:
                                  "0 8px 25px rgba(0,0,0,0.07)",
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    "flex",
                                  justifyContent:
                                    "space-between",
                                  alignItems:
                                    "center",
                                  marginBottom:
                                    "18px",
                                }}
                              >
                                <span
                                  style={{
                                    color:
                                      "#849089",
                                    fontSize:
                                      "13px",
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {date.toLocaleDateString(
                                    "nl-NL",
                                    {
                                      weekday:
                                        "short",
                                      day:
                                        "numeric",
                                      month:
                                        "short",
                                    }
                                  )}
                                </span>

                                <span
                                  style={{
                                    color:
                                      "#849089",
                                    fontSize:
                                      "13px",
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {date.toLocaleTimeString(
                                    "nl-NL",
                                    {
                                      hour:
                                        "2-digit",
                                      minute:
                                        "2-digit",
                                    }
                                  )}
                                </span>
                              </div>

                              <div
                                style={{
                                  display:
                                    "grid",
                                  gridTemplateColumns:
                                    "1fr auto 1fr",
                                  alignItems:
                                    "center",
                                  gap: "15px",
                                }}
                              >
                                <div
                                  style={{
                                    textAlign:
                                      "right",
                                    fontWeight:
                                      800,
                                    fontSize:
                                      "16px",
                                  }}
                                >
                                  {
                                    match
                                      .homeTeam
                                      .name
                                  }
                                </div>

                                <div
                                  style={{
                                    color:
                                      "#a0aaa4",
                                    fontWeight:
                                      900,
                                    fontSize:
                                      "12px",
                                  }}
                                >
                                  VS
                                </div>

                                <div
                                  style={{
                                    textAlign:
                                      "left",
                                    fontWeight:
                                      800,
                                    fontSize:
                                      "16px",
                                  }}
                                >
                                  {
                                    match
                                      .awayTeam
                                      .name
                                  }
                                </div>
                              </div>

                              <div
                                style={{
                                  marginTop:
                                    "18px",
                                  paddingTop:
                                    "18px",
                                  borderTop:
                                    "1px solid #edf0ee",
                                }}
                              >
                                <div
                                  style={{
                                    display:
                                      "flex",
                                    alignItems:
                                      "center",
                                    justifyContent:
                                      "center",
                                    gap: "10px",
                                  }}
                                >
                                  <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={
                                      prediction.home
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updatePrediction(
                                        match.id,
                                        "home",
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                    placeholder="0"
                                    style={{
                                      width:
                                        "60px",
                                      height:
                                        "48px",
                                      border:
                                        "1px solid #dce3df",
                                      borderRadius:
                                        "10px",
                                      textAlign:
                                        "center",
                                      fontSize:
                                        "20px",
                                      fontWeight:
                                        800,
                                      outline:
                                        "none",
                                    }}
                                  />

                                  <span
                                    style={{
                                      fontSize:
                                        "20px",
                                      fontWeight:
                                        800,
                                      color:
                                        "#a0aaa4",
                                    }}
                                  >
                                    -
                                  </span>

                                  <input
                                    type="number"
                                    min="0"
                                    max="20"
                                    value={
                                      prediction.away
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updatePrediction(
                                        match.id,
                                        "away",
                                        e
                                          .target
                                          .value
                                      )
                                    }
                                    placeholder="0"
                                    style={{
                                      width:
                                        "60px",
                                      height:
                                        "48px",
                                      border:
                                        "1px solid #dce3df",
                                      borderRadius:
                                        "10px",
                                      textAlign:
                                        "center",
                                      fontSize:
                                        "20px",
                                      fontWeight:
                                        800,
                                      outline:
                                        "none",
                                    }}
                                  />
                                </div>

                                <button
                                  onClick={() =>
                                    savePrediction(
                                      match
                                    )
                                  }
                                  style={{
                                    marginTop:
                                      "15px",
                                    width:
                                      "100%",
                                    padding:
                                      "13px",
                                    background:
                                      "#0b8f4d",
                                    color:
                                      "white",
                                    border:
                                      "none",
                                    borderRadius:
                                      "10px",
                                    fontSize:
                                      "15px",
                                    fontWeight:
                                      800,
                                    cursor:
                                      "pointer",
                                  }}
                                >
                                  Voorspelling opslaan
                                </button>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </>
                )}

              {message && (
                <div
                  style={{
                    marginTop:
                      "20px",
                    padding:
                      "15px 18px",
                    background:
                      "#e9faf1",
                    border:
                      "1px solid rgba(11,143,77,0.15)",
                    borderRadius:
                      "12px",
                    color:
                      "#08763e",
                    fontWeight:
                      700,
                  }}
                >
                  {message}
                </div>
              )}

              <p
                style={{
                  marginTop:
                    "30px",
                  fontSize:
                    "12px",
                  color:
                    "#8a948f",
                  textAlign:
                    "center",
                }}
              >
                Data provided by football-data.org
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
