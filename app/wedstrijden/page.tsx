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
    crest?: string;
  };
  awayTeam: {
    name: string;
    crest?: string;
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

type StoredPrediction = {
  match_id: number;
  home_score: number;
  away_score: number;
};

const competitions: Competition[] = [
  { code: "PL", name: "Premier League", flag: "🏴" },
  { code: "DED", name: "Eredivisie", flag: "🇳🇱" },
  { code: "PD", name: "La Liga", flag: "🇪🇸" },
  { code: "BL1", name: "Bundesliga", flag: "🇩🇪" },
  { code: "SA", name: "Serie A", flag: "🇮🇹" },
  { code: "FL1", name: "Ligue 1", flag: "🇫🇷" },
  { code: "PPL", name: "Primeira Liga", flag: "🇵🇹" },
  { code: "CL", name: "Champions League", flag: "🏆" },
];

export default function Wedstrijden() {
  const [selectedCompetition, setSelectedCompetition] =
    useState("DED");

  const [matches, setMatches] = useState<Match[]>([]);

  const [predictions, setPredictions] = useState<
    Record<number, Prediction>
  >({});

  const [savedMatchIds, setSavedMatchIds] = useState<
    Set<number>
  >(new Set());

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedMatchday, setSelectedMatchday] =
    useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const competitionFromUrl =
      params.get("competition")?.toUpperCase() || "DED";

    const isValidCompetition = competitions.some(
      (competition) =>
        competition.code === competitionFromUrl
    );

    if (isValidCompetition) {
      setSelectedCompetition(competitionFromUrl);
    }
  }, []);

  useEffect(() => {
    loadCompetition(selectedCompetition);
  }, [selectedCompetition]);

  async function loadCompetition(competitionCode: string) {
    setLoading(true);
    setMessage("");
    setMatches([]);
    setPredictions({});
    setSavedMatchIds(new Set());
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

      const upcomingMatches: Match[] = (data.matches || [])
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
          (
            matchday: number | undefined
          ): matchday is number =>
            typeof matchday === "number"
        );

      if (matchdays.length > 0) {
        setSelectedMatchday(Math.min(...matchdays));
      }

      await loadSavedPredictions(upcomingMatches);
    } catch (error) {
      console.error(error);

      setMessage(
        "De wedstrijden konden niet worden opgehaald."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadSavedPredictions(
    upcomingMatches: Match[]
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || upcomingMatches.length === 0) {
      return;
    }

    const matchIds = upcomingMatches.map(
      (match) => match.id
    );

    const { data, error } = await supabase
      .from("predictions")
      .select("match_id, home_score, away_score")
      .eq("user_id", user.id)
      .in("match_id", matchIds);

    if (error) {
      console.error(
        "Kon opgeslagen voorspellingen niet laden:",
        error
      );
      return;
    }

    const predictionMap: Record<number, Prediction> = {};
    const storedIds = new Set<number>();

    ((data || []) as StoredPrediction[]).forEach(
      (prediction) => {
        predictionMap[prediction.match_id] = {
          home: String(prediction.home_score),
          away: String(prediction.away_score),
        };

        storedIds.add(prediction.match_id);
      }
    );

    setPredictions(predictionMap);
    setSavedMatchIds(storedIds);
  }

  const availableMatchdays = useMemo(() => {
    return Array.from(
      new Set(
        matches
          .map((match: Match) => match.matchday)
          .filter(
            (
              matchday: number | undefined
            ): matchday is number =>
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

  const savedPredictionsThisRound =
    currentMatches.filter((match) =>
      savedMatchIds.has(match.id)
    ).length;

  function changeCompetition(code: string) {
    setSelectedCompetition(code);

    const url = new URL(window.location.href);
    url.searchParams.set("competition", code);

    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}`
    );
  }

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
    const kickoff = new Date(match.utcDate);

    if (kickoff.getTime() <= Date.now()) {
      setMessage(
        "Deze wedstrijd is al begonnen. Je voorspelling kan niet meer worden gewijzigd."
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

    const matchName = `${match.homeTeam.name} - ${match.awayTeam.name}`;

    if (savedMatchIds.has(match.id)) {
      const { error } = await supabase
        .from("predictions")
        .update({
          home_score: home,
          away_score: away,
        })
        .eq("user_id", user.id)
        .eq("match_id", match.id);

      if (error) {
        console.error(error);

        setMessage(
          "Er ging iets mis met het wijzigen van je voorspelling."
        );

        return;
      }

      setMessage(
        `Voorspelling gewijzigd: ${match.homeTeam.name} ${home} - ${away} ${match.awayTeam.name}`
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
        await loadSavedPredictions(matches);

        setMessage(
          "Deze voorspelling bestond al en is opnieuw geladen."
        );
      } else {
        setMessage(
          "Er ging iets mis met het opslaan van je voorspelling."
        );
      }

      return;
    }

    setSavedMatchIds((current) => {
      const next = new Set(current);
      next.add(match.id);
      return next;
    });

    setMessage(
      `Voorspelling opgeslagen: ${match.homeTeam.name} ${home} - ${away} ${match.awayTeam.name}`
    );
  }

  function changeMatchday(
    direction: "previous" | "next"
  ) {
    if (currentMatchdayIndex === -1) return;

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

      setMessage("");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f3f6f4",
        color: "#111",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(135deg, #03140c 0%, #0a2b1b 100%)",
          color: "white",
          padding: "48px 20px 44px",
        }}
      >
        <div
          style={{
            maxWidth: "1050px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 12px",
              borderRadius: "999px",
              background: "rgba(46,230,129,0.12)",
              border:
                "1px solid rgba(46,230,129,0.2)",
              color: "#70f0aa",
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing: "0.4px",
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
              margin: "10px 0 0",
              color: "#a9bbb2",
              fontSize: "15px",
            }}
          >
            Voorspel de uitslagen en verdien punten.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding: "28px 20px 70px",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "10px",
            boxShadow:
              "0 8px 28px rgba(0,0,0,0.06)",
            overflowX: "auto",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "6px",
              minWidth: "max-content",
            }}
          >
            {competitions.map((competition) => {
              const active =
                selectedCompetition === competition.code;

              return (
                <button
                  key={competition.code}
                  onClick={() =>
                    changeCompetition(competition.code)
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    padding: "10px 13px",
                    borderRadius: "10px",
                    border: active
                      ? "1px solid rgba(11,143,77,0.18)"
                      : "1px solid transparent",
                    background: active
                      ? "#e9faf1"
                      : "transparent",
                    color: active
                      ? "#08763e"
                      : "#52605a",
                    fontSize: "13px",
                    fontWeight: active ? 800 : 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span>{competition.flag}</span>
                  {competition.name}
                </button>
              );
            })}
          </div>
        </div>

        <div
          style={{
            background:
              "linear-gradient(135deg, #082b1a, #104b2d)",
            borderRadius: "18px",
            padding: "22px 24px",
            color: "white",
            marginBottom: "16px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
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
                borderRadius: "13px",
                background: "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "25px",
              }}
            >
              {selectedCompetitionData.flag}
            </div>

            <div>
              <div
                style={{
                  color: "#70f0aa",
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                  letterSpacing: "0.9px",
                }}
              >
                Competitie
              </div>

              <h2
                style={{
                  margin: "3px 0 0",
                  fontSize: "25px",
                }}
              >
                {selectedCompetitionData.name}
              </h2>
            </div>
          </div>

          {!loading && currentMatches.length > 0 && (
            <div
              style={{
                background: "rgba(255,255,255,0.08)",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                borderRadius: "12px",
                padding: "10px 15px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  color: "#70f0aa",
                  fontSize: "10px",
                  fontWeight: 900,
                  textTransform: "uppercase",
                }}
              >
                Ingevuld
              </div>

              <div
                style={{
                  marginTop: "3px",
                  fontSize: "17px",
                  fontWeight: 900,
                }}
              >
                {savedPredictionsThisRound} /{" "}
                {currentMatches.length}
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div style={emptyCardStyle}>
            <div
              style={{
                fontSize: "32px",
                marginBottom: "10px",
              }}
            >
              ⚽
            </div>

            <strong>Wedstrijden laden...</strong>
          </div>
        )}

        {!loading &&
          availableMatchdays.length === 0 && (
            <div style={emptyCardStyle}>
              <div
                style={{
                  fontSize: "34px",
                  marginBottom: "10px",
                }}
              >
                📅
              </div>

              <strong style={{ fontSize: "17px" }}>
                Geen komende wedstrijden
              </strong>

              <p
                style={{
                  color: "#78827d",
                  margin: "8px 0 0",
                }}
              >
                Er zijn momenteel geen aankomende wedstrijden
                beschikbaar voor deze competitie.
              </p>
            </div>
          )}

        {!loading &&
          availableMatchdays.length > 0 && (
            <>
              <div
                style={{
                  background: "white",
                  borderRadius: "15px",
                  padding: "10px",
                  display: "grid",
                  gridTemplateColumns: "1fr auto 1fr",
                  alignItems: "center",
                  marginBottom: "15px",
                  boxShadow:
                    "0 6px 22px rgba(0,0,0,0.055)",
                }}
              >
                <div>
                  <button
                    onClick={() =>
                      changeMatchday("previous")
                    }
                    disabled={currentMatchdayIndex <= 0}
                    style={navigationButtonStyle(
                      currentMatchdayIndex <= 0
                    )}
                  >
                    ← Vorige
                  </button>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      color: "#89958e",
                      fontSize: "10px",
                      fontWeight: 900,
                      textTransform: "uppercase",
                      letterSpacing: "0.6px",
                    }}
                  >
                    Speelronde
                  </div>

                  <strong style={{ fontSize: "20px" }}>
                    {selectedMatchday}
                  </strong>
                </div>

                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={() =>
                      changeMatchday("next")
                    }
                    disabled={
                      currentMatchdayIndex ===
                      availableMatchdays.length - 1
                    }
                    style={navigationButtonStyle(
                      currentMatchdayIndex ===
                        availableMatchdays.length - 1
                    )}
                  >
                    Volgende →
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {currentMatches.map((match) => {
                  const prediction =
                    predictions[match.id] || {
                      home: "",
                      away: "",
                    };

                  const date = new Date(match.utcDate);
                  const isSaved =
                    savedMatchIds.has(match.id);

                  return (
                    <div
                      key={match.id}
                      style={{
                        background: "white",
                        borderRadius: "17px",
                        border: isSaved
                          ? "1px solid rgba(11,143,77,0.25)"
                          : "1px solid #edf1ee",
                        overflow: "hidden",
                        boxShadow:
                          "0 7px 24px rgba(0,0,0,0.055)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "11px 18px",
                          background: isSaved
                            ? "#f3fcf7"
                            : "#fafcfb",
                          borderBottom:
                            "1px solid #edf1ee",
                          color: "#7d8982",
                          fontSize: "12px",
                          fontWeight: 700,
                        }}
                      >
                        <span>
                          {date.toLocaleDateString(
                            "nl-NL",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                            }
                          )}
                        </span>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          {isSaved && (
                            <span
                              style={{
                                color: "#0b8f4d",
                                fontSize: "11px",
                                fontWeight: 900,
                              }}
                            >
                              ✓ Voorspeld
                            </span>
                          )}

                          <span>
                            {date.toLocaleTimeString(
                              "nl-NL",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <div
                        style={{
                          padding: "23px 22px 21px",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "minmax(0,1fr) 150px minmax(0,1fr)",
                            alignItems: "center",
                            gap: "18px",
                          }}
                        >
                          <Team
                            name={match.homeTeam.name}
                            crest={match.homeTeam.crest}
                            side="home"
                          />

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={prediction.home}
                              onChange={(e) =>
                                updatePrediction(
                                  match.id,
                                  "home",
                                  e.target.value
                                )
                              }
                              style={scoreInputStyle}
                            />

                            <span
                              style={{
                                fontWeight: 900,
                                color: "#9ca7a1",
                              }}
                            >
                              -
                            </span>

                            <input
                              type="number"
                              min="0"
                              max="20"
                              value={prediction.away}
                              onChange={(e) =>
                                updatePrediction(
                                  match.id,
                                  "away",
                                  e.target.value
                                )
                              }
                              style={scoreInputStyle}
                            />
                          </div>

                          <Team
                            name={match.awayTeam.name}
                            crest={match.awayTeam.crest}
                            side="away"
                          />
                        </div>

                        <button
                          onClick={() =>
                            savePrediction(match)
                          }
                          style={{
                            marginTop: "21px",
                            width: "100%",
                            padding: "12px",
                            background: isSaved
                              ? "#075f35"
                              : "#0b8f4d",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "14px",
                            fontWeight: 800,
                            cursor: "pointer",
                          }}
                        >
                          {isSaved
                            ? "Voorspelling wijzigen"
                            : "Voorspelling opslaan"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

        {message && (
          <div
            style={{
              marginTop: "18px",
              padding: "14px 17px",
              background: "#e9faf1",
              border:
                "1px solid rgba(11,143,77,0.15)",
              borderRadius: "12px",
              color: "#08763e",
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <p
          style={{
            marginTop: "28px",
            fontSize: "11px",
            color: "#929b96",
            textAlign: "center",
          }}
        >
          Data provided by football-data.org
        </p>
      </section>
    </main>
  );
}

function Team({
  name,
  crest,
  side,
}: {
  name: string;
  crest?: string;
  side: "home" | "away";
}) {
  const home = side === "home";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: home ? "row" : "row-reverse",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "13px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          textAlign: home ? "right" : "left",
          fontWeight: 800,
          fontSize: "15px",
          lineHeight: 1.25,
        }}
      >
        {name}
      </div>

      <div
        style={{
          width: "48px",
          height: "48px",
          flexShrink: 0,
          borderRadius: "12px",
          background: "#f6f8f7",
          border: "1px solid #edf0ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "7px",
          boxSizing: "border-box",
        }}
      >
        {crest ? (
          <img
            src={crest}
            alt={`${name} logo`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ fontSize: "20px" }}>⚽</span>
        )}
      </div>
    </div>
  );
}

const scoreInputStyle = {
  width: "55px",
  height: "52px",
  boxSizing: "border-box" as const,
  border: "1px solid #dce3df",
  borderRadius: "11px",
  textAlign: "center" as const,
  fontSize: "20px",
  fontWeight: 900,
  outline: "none",
  background: "#fbfcfb",
};

const emptyCardStyle = {
  background: "white",
  borderRadius: "17px",
  padding: "45px 25px",
  textAlign: "center" as const,
  boxShadow: "0 7px 24px rgba(0,0,0,0.055)",
};

function navigationButtonStyle(disabled: boolean) {
  return {
    border: "none",
    background: disabled ? "#f1f3f2" : "#e9faf1",
    color: disabled ? "#a1aaa5" : "#08763e",
    borderRadius: "9px",
    padding: "10px 14px",
    fontWeight: 800,
    cursor: disabled ? "default" : "pointer",
  };
}
