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

const competitionThemes: Record<
  string,
  {
    hero: string;
    card: string;
    accent: string;
    glow: string;
  }
> = {
  DED: {
    hero: "radial-gradient(circle at 82% 18%, rgba(38,103,255,0.55) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(0,181,255,0.24) 0%, transparent 28%), linear-gradient(135deg, #03132f 0%, #082d73 55%, #0757c9 100%)",
    card: "linear-gradient(135deg, #071d45 0%, #0a4ba8 100%)",
    accent: "#8ac5ff",
    glow: "rgba(31,112,255,0.30)",
  },
  PL: {
    hero: "radial-gradient(circle at 82% 18%, rgba(216,0,255,0.35) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(0,255,209,0.18) 0%, transparent 28%), linear-gradient(135deg, #170020 0%, #37003c 55%, #5b075f 100%)",
    card: "linear-gradient(135deg, #24002b 0%, #52005c 100%)",
    accent: "#ef8cff",
    glow: "rgba(181,36,202,0.28)",
  },
  PD: {
    hero: "radial-gradient(circle at 82% 20%, rgba(255,126,38,0.42) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(255,43,43,0.22) 0%, transparent 28%), linear-gradient(135deg, #1b0808 0%, #641616 55%, #a52b12 100%)",
    card: "linear-gradient(135deg, #3b0c0c 0%, #9a2915 100%)",
    accent: "#ffad78",
    glow: "rgba(231,76,35,0.27)",
  },
  BL1: {
    hero: "radial-gradient(circle at 80% 20%, rgba(255,70,70,0.42) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(255,255,255,0.09) 0%, transparent 28%), linear-gradient(135deg, #190404 0%, #650909 55%, #a20e0e 100%)",
    card: "linear-gradient(135deg, #3d0606 0%, #9e1010 100%)",
    accent: "#ff8b8b",
    glow: "rgba(220,25,25,0.27)",
  },
  SA: {
    hero: "radial-gradient(circle at 80% 20%, rgba(36,131,255,0.45) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(72,205,255,0.18) 0%, transparent 28%), linear-gradient(135deg, #041326 0%, #073c78 55%, #0967b5 100%)",
    card: "linear-gradient(135deg, #062a55 0%, #0874bd 100%)",
    accent: "#8bd1ff",
    glow: "rgba(28,126,219,0.27)",
  },
  FL1: {
    hero: "radial-gradient(circle at 82% 18%, rgba(216,255,0,0.22) 0%, transparent 30%), radial-gradient(circle at 15% 80%, rgba(39,82,255,0.22) 0%, transparent 28%), linear-gradient(135deg, #071124 0%, #101f4b 55%, #19327b 100%)",
    card: "linear-gradient(135deg, #0c1837 0%, #1c3474 100%)",
    accent: "#d8ff49",
    glow: "rgba(97,119,255,0.24)",
  },
  PPL: {
    hero: "radial-gradient(circle at 82% 20%, rgba(225,32,50,0.34) 0%, transparent 31%), radial-gradient(circle at 15% 80%, rgba(31,190,102,0.25) 0%, transparent 28%), linear-gradient(135deg, #061a11 0%, #0a5130 55%, #12693f 100%)",
    card: "linear-gradient(135deg, #082f1d 0%, #12653d 100%)",
    accent: "#76ecad",
    glow: "rgba(26,166,91,0.25)",
  },
  CL: {
    hero: "radial-gradient(circle at 82% 18%, rgba(93,110,255,0.42) 0%, transparent 32%), radial-gradient(circle at 18% 80%, rgba(42,58,180,0.30) 0%, transparent 30%), linear-gradient(135deg, #030514 0%, #0b1240 55%, #171e68 100%)",
    card: "linear-gradient(135deg, #070b2b 0%, #192365 100%)",
    accent: "#aeb7ff",
    glow: "rgba(76,91,220,0.28)",
  },
};

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

  const [savingMatchId, setSavingMatchId] = useState<
    number | null
  >(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedMatchday, setSelectedMatchday] =
    useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

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

  async function loadCompetition(
    competitionCode: string
  ) {
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
        throw new Error(
          "Kon wedstrijden niet ophalen"
        );
      }

      const data = await response.json();

      const upcomingMatches: Match[] = (
        data.matches || []
      )
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
        setSelectedMatchday(
          Math.min(...matchdays)
        );
      }

      await loadSavedPredictions(
        upcomingMatches
      );
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
      .select(
        "match_id, home_score, away_score"
      )
      .eq("user_id", user.id)
      .in("match_id", matchIds);

    if (error) {
      console.error(
        "Kon opgeslagen voorspellingen niet laden:",
        error
      );
      return;
    }

    const predictionMap: Record<
      number,
      Prediction
    > = {};

    const storedIds = new Set<number>();

    ((data || []) as StoredPrediction[]).forEach(
      (prediction) => {
        predictionMap[prediction.match_id] = {
          home: String(
            prediction.home_score
          ),
          away: String(
            prediction.away_score
          ),
        };

        storedIds.add(
          prediction.match_id
        );
      }
    );

    setPredictions(predictionMap);
    setSavedMatchIds(storedIds);
  }

  const availableMatchdays = useMemo(() => {
    return Array.from(
      new Set(
        matches
          .map(
            (match: Match) =>
              match.matchday
          )
          .filter(
            (
              matchday:
                | number
                | undefined
            ): matchday is number =>
              typeof matchday ===
              "number"
          )
      )
    ).sort((a, b) => a - b);
  }, [matches]);

  const currentMatchdayIndex =
    selectedMatchday !== null
      ? availableMatchdays.indexOf(
          selectedMatchday
        )
      : -1;

  const currentMatches = matches.filter(
    (match) =>
      match.matchday === selectedMatchday
  );

  const selectedCompetitionData =
    competitions.find(
      (competition) =>
        competition.code ===
        selectedCompetition
    ) || competitions[1];

  const activeTheme =
    competitionThemes[selectedCompetition] ||
    competitionThemes.DED;

  const savedPredictionsThisRound =
    currentMatches.filter((match) =>
      savedMatchIds.has(match.id)
    ).length;

  function changeCompetition(
    code: string
  ) {
    setSelectedCompetition(code);

    const url = new URL(
      window.location.href
    );

    url.searchParams.set(
      "competition",
      code
    );

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
        home:
          current[matchId]?.home || "",
        away:
          current[matchId]?.away || "",
        [type]: value,
      },
    }));
  }

  async function savePrediction(
    match: Match
  ) {
    if (savingMatchId !== null) {
      return;
    }

    const prediction =
      predictions[match.id];

    if (
      !prediction ||
      prediction.home === "" ||
      prediction.away === ""
    ) {
      setMessage(
        "Vul eerst een volledige uitslag in."
      );
      return;
    }

    const home = Number(
      prediction.home
    );

    const away = Number(
      prediction.away
    );

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

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {
      setMessage(
        "Je moet ingelogd zijn om een voorspelling op te slaan."
      );
      return;
    }

    setSavingMatchId(match.id);
    setMessage("");

    try {
      const response = await fetch(
        "/api/predictions",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            accessToken:
              session.access_token,
            matchId: match.id,
            competition:
              selectedCompetition,
            homeScore: home,
            awayScore: away,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          result.error ||
            "Je voorspelling kon niet worden opgeslagen."
        );
        return;
      }

      setSavedMatchIds(
        (current) => {
          const next =
            new Set(current);

          next.add(match.id);

          return next;
        }
      );

      setMessage(
        result.message ||
          "Je voorspelling is opgeslagen."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        "Er ging iets mis bij het opslaan van je voorspelling."
      );
    } finally {
      setSavingMatchId(null);
    }
  }

  function changeMatchday(
    direction: "previous" | "next"
  ) {
    if (
      currentMatchdayIndex === -1
    ) {
      return;
    }

    const newIndex =
      direction === "previous"
        ? currentMatchdayIndex - 1
        : currentMatchdayIndex + 1;

    if (
      newIndex >= 0 &&
      newIndex <
        availableMatchdays.length
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
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          background: activeTheme.hero,
          position: "relative",
          overflow: "hidden",
          boxShadow: `inset 0 -50px 80px ${activeTheme.glow}`,
          color: "white",
          padding:
            "48px 20px 44px",
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
              display:
                "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 12px",
              borderRadius:
                "999px",
              background:
                "rgba(255,255,255,0.10)",
              border:
                "1px solid rgba(255,255,255,0.18)",
              color: activeTheme.accent,
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing:
                "0.4px",
              marginBottom:
                "15px",
            }}
          >
            ⚽ VOETIQ MATCH CENTER
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: 900,
              letterSpacing:
                "-1.5px",
            }}
          >
            Wedstrijden
          </h1>

          <p
            style={{
              margin:
                "10px 0 0",
              color: "rgba(255,255,255,0.72)",
              fontSize: "15px",
            }}
          >
            Voorspel de uitslagen en
            verdien punten.
          </p>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1050px",
          margin: "0 auto",
          padding:
            "28px 20px 70px",
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
            marginBottom:
              "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "6px",
              minWidth:
                "max-content",
            }}
          >
            {competitions.map(
              (competition) => {
                const active =
                  selectedCompetition ===
                  competition.code;

                return (
                  <button
                    key={
                      competition.code
                    }
                    onClick={() =>
                      changeCompetition(
                        competition.code
                      )
                    }
                    style={{
                      display:
                        "flex",
                      alignItems:
                        "center",
                      gap: "7px",
                      padding:
                        "10px 13px",
                      borderRadius:
                        "10px",
                      border: active
                        ? "1px solid rgba(11,143,77,0.18)"
                        : "1px solid transparent",
                      background:
                        active
                          ? "#e9faf1"
                          : "transparent",
                      color: active
                        ? "#08763e"
                        : "#52605a",
                      fontSize:
                        "13px",
                      fontWeight:
                        active
                          ? 800
                          : 600,
                      cursor:
                        "pointer",
                      whiteSpace:
                        "nowrap",
                    }}
                  >
                    <span>
                      {
                        competition.flag
                      }
                    </span>

                    {
                      competition.name
                    }
                  </button>
                );
              }
            )}
          </div>
        </div>

        <div
          style={{
            background: activeTheme.card,
            borderRadius: "18px",
            padding:
              "22px 24px",
            color: "white",
            marginBottom: "16px",
            boxShadow:
              `0 12px 34px ${activeTheme.glow}`,
            display: "flex",
            justifyContent:
              "space-between",
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
                borderRadius:
                  "13px",
                background:
                  "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize: "25px",
              }}
            >
              {
                selectedCompetitionData.flag
              }
            </div>

            <div>
              <div
                style={{
                  color:
                    activeTheme.accent,
                  fontSize:
                    "10px",
                  fontWeight: 900,
                  textTransform:
                    "uppercase",
                  letterSpacing:
                    "0.9px",
                }}
              >
                Competitie
              </div>

              <h2
                style={{
                  margin:
                    "3px 0 0",
                  fontSize:
                    "25px",
                }}
              >
                {
                  selectedCompetitionData.name
                }
              </h2>
            </div>
          </div>

          {!loading &&
            currentMatches.length >
              0 && (
              <div
                style={{
                  background:
                    "rgba(255,255,255,0.08)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius:
                    "12px",
                  padding:
                    "10px 15px",
                  textAlign:
                    "center",
                }}
              >
                <div
                  style={{
                    color:
                      "#70f0aa",
                    fontSize:
                      "10px",
                    fontWeight:
                      900,
                    textTransform:
                      "uppercase",
                  }}
                >
                  Ingevuld
                </div>

                <div
                  style={{
                    marginTop:
                      "3px",
                    fontSize:
                      "17px",
                    fontWeight:
                      900,
                  }}
                >
                  {
                    savedPredictionsThisRound
                  }{" "}
                  /{" "}
                  {
                    currentMatches.length
                  }
                </div>
              </div>
            )}
        </div>

        {loading && (
          <div style={emptyCardStyle}>
            <div
              style={{
                fontSize: "32px",
                marginBottom:
                  "10px",
              }}
            >
              ⚽
            </div>

            <strong>
              Wedstrijden laden...
            </strong>
          </div>
        )}

        {!loading &&
          availableMatchdays.length ===
            0 && (
            <div style={emptyCardStyle}>
              <div
                style={{
                  fontSize: "34px",
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
                Geen komende
                wedstrijden
              </strong>

              <p
                style={{
                  color:
                    "#78827d",
                  margin:
                    "8px 0 0",
                }}
              >
                Er zijn momenteel
                geen aankomende
                wedstrijden
                beschikbaar voor
                deze competitie.
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
                    "15px",
                  padding: "10px",
                  display: "grid",
                  gridTemplateColumns:
                    "1fr auto 1fr",
                  alignItems:
                    "center",
                  marginBottom:
                    "15px",
                  boxShadow:
                    "0 6px 22px rgba(0,0,0,0.055)",
                }}
              >
                <div>
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
                    style={navigationButtonStyle(
                      currentMatchdayIndex <=
                        0
                    )}
                  >
                    ← Vorige
                  </button>
                </div>

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
                        "10px",
                      fontWeight:
                        900,
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.6px",
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

                <div
                  style={{
                    textAlign:
                      "right",
                  }}
                >
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
                    style={navigationButtonStyle(
                      currentMatchdayIndex ===
                        availableMatchdays.length -
                          1
                    )}
                  >
                    Volgende →
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "12px",
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

                    const isSaved =
                      savedMatchIds.has(
                        match.id
                      );

                    const isSaving =
                      savingMatchId ===
                      match.id;

                    const locked =
                      date.getTime() <=
                      Date.now();

                    return (
                      <div
                        key={match.id}
                        style={{
                          background:
                            "white",
                          borderRadius:
                            "17px",
                          border:
                            isSaved
                              ? "1px solid rgba(11,143,77,0.25)"
                              : "1px solid #edf1ee",
                          overflow:
                            "hidden",
                          boxShadow:
                            "0 7px 24px rgba(0,0,0,0.055)",
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
                            padding:
                              "11px 18px",
                            background:
                              isSaved
                                ? "#f3fcf7"
                                : "#fafcfb",
                            borderBottom:
                              "1px solid #edf1ee",
                            color:
                              "#7d8982",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          <span>
                            {date.toLocaleDateString(
                              "nl-NL",
                              {
                                weekday:
                                  "short",
                                day: "numeric",
                                month:
                                  "short",
                              }
                            )}
                          </span>

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "12px",
                            }}
                          >
                            {isSaved && (
                              <span
                                style={{
                                  color:
                                    "#0b8f4d",
                                  fontSize:
                                    "11px",
                                  fontWeight:
                                    900,
                                }}
                              >
                                ✓ Voorspeld
                              </span>
                            )}

                            <span>
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
                        </div>

                        <div
                          style={{
                            padding:
                              "23px 22px 21px",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "minmax(0,1fr) 150px minmax(0,1fr)",
                              alignItems:
                                "center",
                              gap: "18px",
                            }}
                          >
                            <Team
                              name={
                                match
                                  .homeTeam
                                  .name
                              }
                              crest={
                                match
                                  .homeTeam
                                  .crest
                              }
                              side="home"
                            />

                            <div
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  "center",
                                alignItems:
                                  "center",
                                gap: "8px",
                              }}
                            >
                              <input
                                type="number"
                                min="0"
                                max="20"
                                disabled={
                                  locked
                                }
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
                                style={{
                                  ...scoreInputStyle,
                                  opacity:
                                    locked
                                      ? 0.6
                                      : 1,
                                }}
                              />

                              <span
                                style={{
                                  fontWeight:
                                    900,
                                  color:
                                    "#9ca7a1",
                                }}
                              >
                                -
                              </span>

                              <input
                                type="number"
                                min="0"
                                max="20"
                                disabled={
                                  locked
                                }
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
                                style={{
                                  ...scoreInputStyle,
                                  opacity:
                                    locked
                                      ? 0.6
                                      : 1,
                                }}
                              />
                            </div>

                            <Team
                              name={
                                match
                                  .awayTeam
                                  .name
                              }
                              crest={
                                match
                                  .awayTeam
                                  .crest
                              }
                              side="away"
                            />
                          </div>

                          <button
                            onClick={() =>
                              savePrediction(
                                match
                              )
                            }
                            disabled={
                              isSaving ||
                              locked
                            }
                            style={{
                              marginTop:
                                "21px",
                              width: "100%",
                              padding:
                                "12px",
                              background:
                                locked
                                  ? "#aeb8b2"
                                  : isSaved
                                    ? "#075f35"
                                    : "#0b8f4d",
                              color:
                                "white",
                              border:
                                "none",
                              borderRadius:
                                "10px",
                              fontSize:
                                "14px",
                              fontWeight:
                                800,
                              cursor:
                                locked ||
                                isSaving
                                  ? "default"
                                  : "pointer",
                              opacity:
                                isSaving
                                  ? 0.75
                                  : 1,
                            }}
                          >
                            {locked
                              ? "Voorspelling gesloten"
                              : isSaving
                                ? "Opslaan..."
                                : isSaved
                                  ? "Voorspelling wijzigen"
                                  : "Voorspelling opslaan"}
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
              marginTop: "18px",
              padding:
                "14px 17px",
              background:
                "#e9faf1",
              border:
                "1px solid rgba(11,143,77,0.15)",
              borderRadius:
                "12px",
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
          Data provided by
          football-data.org
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
        flexDirection: home
          ? "row"
          : "row-reverse",
        alignItems: "center",
        justifyContent:
          "flex-end",
        gap: "13px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          textAlign: home
            ? "right"
            : "left",
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
          border:
            "1px solid #edf0ee",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          padding: "7px",
          boxSizing:
            "border-box",
        }}
      >
        {crest ? (
          <img
            src={crest}
            alt={`${name} logo`}
            style={{
              width: "100%",
              height: "100%",
              objectFit:
                "contain",
            }}
          />
        ) : (
          <span
            style={{
              fontSize: "20px",
            }}
          >
            ⚽
          </span>
        )}
      </div>
    </div>
  );
}

const scoreInputStyle = {
  width: "55px",
  height: "52px",
  boxSizing:
    "border-box" as const,
  border:
    "1px solid #dce3df",
  borderRadius: "11px",
  textAlign:
    "center" as const,
  fontSize: "20px",
  fontWeight: 900,
  outline: "none",
  background: "#fbfcfb",
};

const emptyCardStyle = {
  background: "white",
  borderRadius: "17px",
  padding: "45px 25px",
  textAlign:
    "center" as const,
  boxShadow:
    "0 7px 24px rgba(0,0,0,0.055)",
};

function navigationButtonStyle(
  disabled: boolean
) {
  return {
    border: "none",
    background: disabled
      ? "#f1f3f2"
      : "#e9faf1",
    color: disabled
      ? "#a1aaa5"
      : "#08763e",
    borderRadius: "9px",
    padding: "10px 14px",
    fontWeight: 800,
    cursor: disabled
      ? "default"
      : "pointer",
  };
}
