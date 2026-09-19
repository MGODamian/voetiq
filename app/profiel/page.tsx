"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "../Navbar";

type Profile = {
  username: string;
  first_name: string;
  last_name: string;
};

type Prediction = {
  id: number;
  match_id: number;
  match_name: string;
  home_score: number;
  away_score: number;
  actual_home_score: number | null;
  actual_away_score: number | null;
  points: number;
  created_at: string;
  competition_code: string | null;
};

type CompetitionInfo = {
  name: string;
  icon: string;
};

const competitions: Record<string, CompetitionInfo> = {
  DED: {
    name: "Eredivisie",
    icon: "🇳🇱",
  },
  PL: {
    name: "Premier League",
    icon: "🏴",
  },
  PD: {
    name: "La Liga",
    icon: "🇪🇸",
  },
  BL1: {
    name: "Bundesliga",
    icon: "🇩🇪",
  },
  SA: {
    name: "Serie A",
    icon: "🇮🇹",
  },
  FL1: {
    name: "Ligue 1",
    icon: "🇫🇷",
  },
  PPL: {
    name: "Primeira Liga",
    icon: "🇵🇹",
  },
  CL: {
    name: "Champions League",
    icon: "🏆",
  },
};

const competitionOrder = [
  "DED",
  "PL",
  "PD",
  "BL1",
  "SA",
  "FL1",
  "PPL",
  "CL",
];


type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type FootballRank = {
  min: number;
  max: number | null;
  icon: string;
  names: Record<LanguageCode, string>;
};

const footballRanks: FootballRank[] = [
  { min: 0, max: 49, icon: "🟤", names: { nl:"Straatvoetballer", en:"Street Footballer", de:"Straßenfußballer", es:"Futbolista callejero", fr:"Footballeur de rue", it:"Calciatore di strada", pt:"Futebolista de rua" } },
  { min: 50, max: 99, icon: "🟢", names: { nl:"Jeugdspeler", en:"Youth Player", de:"Jugendspieler", es:"Jugador juvenil", fr:"Joueur junior", it:"Giocatore giovanile", pt:"Jogador juvenil" } },
  { min: 100, max: 199, icon: "🔵", names: { nl:"Academiespeler", en:"Academy Player", de:"Akademiespieler", es:"Jugador de academia", fr:"Joueur d’académie", it:"Giocatore dell’accademia", pt:"Jogador da academia" } },
  { min: 200, max: 349, icon: "⚪", names: { nl:"Selectiespeler", en:"Squad Player", de:"Kaderspieler", es:"Jugador de plantilla", fr:"Joueur de l’effectif", it:"Giocatore della rosa", pt:"Jogador do plantel" } },
  { min: 350, max: 549, icon: "🟡", names: { nl:"Basisspeler", en:"Starting Player", de:"Stammspieler", es:"Titular", fr:"Titulaire", it:"Titolare", pt:"Titular" } },
  { min: 550, max: 799, icon: "🟠", names: { nl:"Profvoetballer", en:"Professional Footballer", de:"Profifußballer", es:"Futbolista profesional", fr:"Footballeur professionnel", it:"Calciatore professionista", pt:"Futebolista profissional" } },
  { min: 800, max: 1099, icon: "🔥", names: { nl:"Sterspeler", en:"Star Player", de:"Starspieler", es:"Jugador estrella", fr:"Joueur vedette", it:"Giocatore stella", pt:"Jogador estrela" } },
  { min: 1100, max: 1499, icon: "⭐", names: { nl:"Topspeler", en:"Top Player", de:"Topspieler", es:"Jugador de élite", fr:"Joueur d’élite", it:"Top player", pt:"Jogador de elite" } },
  { min: 1500, max: 1999, icon: "🌟", names: { nl:"Wereldster", en:"World Star", de:"Weltstar", es:"Estrella mundial", fr:"Star mondiale", it:"Stella mondiale", pt:"Estrela mundial" } },
  { min: 2000, max: 2749, icon: "🏆", names: { nl:"Kampioen", en:"Champion", de:"Champion", es:"Campeón", fr:"Champion", it:"Campione", pt:"Campeão" } },
  { min: 2750, max: 3499, icon: "👑", names: { nl:"Ballon d'Or-niveau", en:"Ballon d'Or Level", de:"Ballon-d’Or-Niveau", es:"Nivel Balón de Oro", fr:"Niveau Ballon d’Or", it:"Livello Pallone d’Oro", pt:"Nível Bola de Ouro" } },
  { min: 3500, max: null, icon: "🐐", names: { nl:"VoetIQ GOAT", en:"VoetIQ GOAT", de:"VoetIQ GOAT", es:"VoetIQ GOAT", fr:"VoetIQ GOAT", it:"VoetIQ GOAT", pt:"VoetIQ GOAT" } },
];

const rankUi: Record<LanguageCode, {careerRank:string; current:string; next:string; needed:(n:number)=>string; highest:string; points:string}> = {
  nl:{careerRank:"Voetbalrang",current:"Huidige rang",next:"Volgende rang",needed:n=>`Nog ${n} punten nodig voor promotie`,highest:"Hoogste rang bereikt",points:"punten"},
  en:{careerRank:"Football rank",current:"Current rank",next:"Next rank",needed:n=>`${n} points needed for promotion`,highest:"Highest rank reached",points:"points"},
  de:{careerRank:"Fußballrang",current:"Aktueller Rang",next:"Nächster Rang",needed:n=>`Noch ${n} Punkte bis zum Aufstieg`,highest:"Höchster Rang erreicht",points:"Punkte"},
  es:{careerRank:"Rango de fútbol",current:"Rango actual",next:"Siguiente rango",needed:n=>`Faltan ${n} puntos para ascender`,highest:"Rango máximo alcanzado",points:"puntos"},
  fr:{careerRank:"Rang football",current:"Rang actuel",next:"Rang suivant",needed:n=>`Encore ${n} points pour être promu`,highest:"Rang maximal atteint",points:"points"},
  it:{careerRank:"Rango calcistico",current:"Rango attuale",next:"Rango successivo",needed:n=>`Mancano ${n} punti alla promozione`,highest:"Rango massimo raggiunto",points:"punti"},
  pt:{careerRank:"Nível futebolístico",current:"Nível atual",next:"Próximo nível",needed:n=>`Faltam ${n} pontos para subir de nível`,highest:"Nível máximo alcançado",points:"pontos"},
};

export default function ProfielPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(
    null
  );

  const [predictions, setPredictions] = useState<
    Prediction[]
  >([]);

  const [rankPosition, setRankPosition] = useState<
    number | null
  >(null);

  const [totalPlayers, setTotalPlayers] = useState(0);

  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>("nl");

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    loadProfile();

    const stored = window.localStorage.getItem("voetiq-language");
    if (stored && ["nl","en","de","es","fr","it","pt"].includes(stored)) {
      setLanguage(stored as LanguageCode);
    }

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language: LanguageCode }>;
      if (customEvent.detail?.language) setLanguage(customEvent.detail.language);
    }

    window.addEventListener("voetiq-language-change", handleLanguageChange);
    return () => window.removeEventListener("voetiq-language-change", handleLanguageChange);
  }, []);

  async function loadProfile() {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.push("/inloggen");
        return;
      }

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          "username, first_name, last_name"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        throw new Error(
          "Er is geen profiel gevonden voor dit account."
        );
      }

      const {
        data: predictionData,
        error: predictionError,
      } = await supabase
        .from("predictions")
        .select(
          "id, match_id, match_name, home_score, away_score, actual_home_score, actual_away_score, points, created_at, competition_code"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (predictionError) {
        throw predictionError;
      }

      const {
        data: rankingData,
        error: rankingError,
      } = await supabase.rpc("get_leaderboard");

      if (rankingError) {
        console.error(
          "Ranglijst fout:",
          rankingError
        );
      } else {
        const ranking = (rankingData || []) as {
          username: string;
          total_points: number;
        }[];

        setTotalPlayers(ranking.length);

        const currentPlayerIndex =
          ranking.findIndex(
            (player) =>
              player.username ===
              profileData.username
          );

        if (currentPlayerIndex !== -1) {
          setRankPosition(
            currentPlayerIndex + 1
          );
        }
      }

      setProfile(profileData);
      setPredictions(predictionData || []);
    } catch (error: unknown) {
      console.error("PROFIEL FOUT:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Onbekende fout bij het laden van je profiel.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  const totalPoints = predictions.reduce(
    (total, prediction) =>
      total + (prediction.points || 0),
    0
  );

  const currentFootballRankIndex = footballRanks.findIndex(
    (rank) => totalPoints >= rank.min && (rank.max === null || totalPoints <= rank.max)
  );
  const currentFootballRank = footballRanks[Math.max(0, currentFootballRankIndex)];
  const nextFootballRank =
    currentFootballRankIndex >= 0 && currentFootballRankIndex < footballRanks.length - 1
      ? footballRanks[currentFootballRankIndex + 1]
      : null;
  const rankStart = currentFootballRank.min;
  const rankEnd = nextFootballRank ? nextFootballRank.min : currentFootballRank.min;
  const rankProgress = nextFootballRank
    ? Math.min(100, Math.max(0, ((totalPoints - rankStart) / (rankEnd - rankStart)) * 100))
    : 100;
  const pointsNeeded = nextFootballRank ? Math.max(0, nextFootballRank.min - totalPoints) : 0;
  const rui = rankUi[language];

  const totalPredictions = predictions.length;

  const playedPredictions = predictions.filter(
    (prediction) =>
      prediction.actual_home_score !== null &&
      prediction.actual_away_score !== null
  );

  const exactPredictions =
    playedPredictions.filter(
      (prediction) =>
        prediction.home_score ===
          prediction.actual_home_score &&
        prediction.away_score ===
          prediction.actual_away_score
    ).length;

  const correctResults =
    playedPredictions.filter((prediction) => {
      const predictedResult =
        prediction.home_score ===
        prediction.away_score
          ? "draw"
          : prediction.home_score >
            prediction.away_score
          ? "home"
          : "away";

      const actualHomeScore =
        prediction.actual_home_score!;

      const actualAwayScore =
        prediction.actual_away_score!;

      const actualResult =
        actualHomeScore === actualAwayScore
          ? "draw"
          : actualHomeScore >
            actualAwayScore
          ? "home"
          : "away";

      return predictedResult === actualResult;
    }).length;

  const accuracy =
    playedPredictions.length > 0
      ? Math.round(
          (correctResults /
            playedPredictions.length) *
            100
        )
      : 0;

  const averagePoints =
    playedPredictions.length > 0
      ? (
          totalPoints /
          playedPredictions.length
        ).toFixed(1)
      : "0.0";

  const competitionStats =
    competitionOrder.map((code) => {
      const competitionPredictions =
        predictions.filter(
          (prediction) =>
            prediction.competition_code === code
        );

      const played =
        competitionPredictions.filter(
          (prediction) =>
            prediction.actual_home_score !== null &&
            prediction.actual_away_score !== null
        );

      const points =
        competitionPredictions.reduce(
          (total, prediction) =>
            total +
            (prediction.points || 0),
          0
        );

      const exact = played.filter(
        (prediction) =>
          prediction.home_score ===
            prediction.actual_home_score &&
          prediction.away_score ===
            prediction.actual_away_score
      ).length;

      return {
        code,
        ...competitions[code],
        predictions:
          competitionPredictions.length,
        played: played.length,
        points,
        exact,
      };
    });

  function formatDate(date: string) {
    return new Date(date).toLocaleString(
      "nl-NL",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function getPredictionStatus(
    prediction: Prediction
  ) {
    const hasResult =
      prediction.actual_home_score !== null &&
      prediction.actual_away_score !== null;

    if (!hasResult) {
      return {
        label: "⏳ Nog niet gespeeld",
        color: "#8fa99a",
        background:
          "rgba(255,255,255,0.05)",
      };
    }

    const isExact =
      prediction.home_score ===
        prediction.actual_home_score &&
      prediction.away_score ===
        prediction.actual_away_score;

    if (isExact) {
      return {
        label: "🎯 Exact",
        color: "#2ee681",
        background:
          "rgba(46,230,129,0.12)",
      };
    }

    if (prediction.points > 0) {
      return {
        label: "✅ Juiste uitslag",
        color: "#9ee7bd",
        background:
          "rgba(46,230,129,0.08)",
      };
    }

    return {
      label: "❌ Geen punten",
      color: "#a9aaa9",
      background:
        "rgba(255,255,255,0.04)",
    };
  }

  function getCompetition(
    code: string | null
  ) {
    if (!code || !competitions[code]) {
      return {
        name: "Onbekende competitie",
        icon: "⚽",
      };
    }

    return competitions[code];
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07110e_0%,#091713_50%,#050a08_100%)] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center text-green-100/70">
            Profiel laden...
          </div>
        )}

        {!loading && errorMessage && (
          <div className="mx-auto max-w-xl rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center">
            <div className="mb-3 text-4xl">
              ⚠️
            </div>

            <p className="font-semibold text-red-200">
              {errorMessage}
            </p>

            <button
              onClick={loadProfile}
              className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-500"
            >
              Opnieuw proberen
            </button>
          </div>
        )}

        {!loading &&
          !errorMessage &&
          profile && (
            <>
              <section className="overflow-hidden rounded-3xl border border-green-400/10 bg-gradient-to-br from-green-800/80 via-green-950/90 to-gray-950 shadow-2xl">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-500/15 text-4xl ring-1 ring-green-400/20">
                        ⚽
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                          Mijn profiel
                        </p>

                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                          {profile.username}
                        </h1>

                        <p className="mt-1 text-sm text-green-100/60">
                          {profile.first_name}{" "}
                          {profile.last_name}
                        </p>
                      </div>
                    </div>

                    {rankPosition !== null && (
                      <div className="rounded-2xl border border-green-400/20 bg-green-400/10 px-5 py-4 text-center sm:min-w-[180px]">
                        <p className="text-xs font-bold uppercase tracking-wide text-green-300">
                          Rang
                        </p>

                        <p className="mt-1 text-3xl font-black text-white">
                          #{rankPosition}
                        </p>

                        <p className="text-xs text-green-100/50">
                          van {totalPlayers} spelers
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
                  <ProfileHeaderStat
                    label="Punten"
                    value={totalPoints.toString()}
                  />

                  <ProfileHeaderStat
                    label="Voorspellingen"
                    value={totalPredictions.toString()}
                  />

                  <ProfileHeaderStat
                    label="Exact"
                    value={exactPredictions.toString()}
                  />

                  <ProfileHeaderStat
                    label="Accuracy"
                    value={`${accuracy}%`}
                  />
                </div>
              </section>

              <section className="mt-8 rounded-3xl border border-green-400/15 bg-gradient-to-br from-green-900/70 via-green-950/80 to-gray-950 p-6 sm:p-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">{rui.careerRank}</p>
                    <p className="mt-2 text-sm text-green-100/45">{rui.current}</p>
                    <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                      {currentFootballRank.icon} {currentFootballRank.names[language]}
                    </h2>
                  </div>

                  <div className="sm:text-right">
                    {nextFootballRank ? (
                      <>
                        <p className="text-xs text-green-100/45">{rui.next}</p>
                        <p className="mt-1 font-black text-green-300">
                          {nextFootballRank.icon} {nextFootballRank.names[language]}
                        </p>
                      </>
                    ) : (
                      <p className="font-black text-green-300">🐐 {rui.highest}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-green-100/55">
                      {totalPoints} {rui.points}
                    </span>
                    <span className="font-bold text-green-300">
                      {nextFootballRank ? `${nextFootballRank.min} ${rui.points}` : rui.highest}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-green-400 transition-all duration-500"
                      style={{ width: `${rankProgress}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-bold text-green-100/60">
                    {nextFootballRank ? rui.needed(pointsNeeded) : rui.highest}
                  </p>
                </div>
              </section>

              <section className="mt-8">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                    Performance
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Jouw voorspellingen
                  </h2>

                  <p className="mt-1 text-sm text-green-100/50">
                    Bekijk hoe je presteert als
                    voorspeller.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <PerformanceCard
                    icon="🎯"
                    label="Exacte scores"
                    value={exactPredictions.toString()}
                    description="Precies goed voorspeld"
                  />

                  <PerformanceCard
                    icon="✅"
                    label="Juiste uitslagen"
                    value={correctResults.toString()}
                    description="Winst, verlies of gelijk"
                  />

                  <PerformanceCard
                    icon="📈"
                    label="Accuracy"
                    value={`${accuracy}%`}
                    description={
                      playedPredictions.length > 0
                        ? `${playedPredictions.length} gespeelde wedstrijden`
                        : "Nog geen wedstrijden gespeeld"
                    }
                  />

                  <PerformanceCard
                    icon="⭐"
                    label="Gemiddeld"
                    value={averagePoints}
                    description="Punten per gespeelde wedstrijd"
                  />
                </div>
              </section>

              <section className="mt-10">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                    Competities
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Prestaties per competitie
                  </h2>

                  <p className="mt-1 text-sm text-green-100/50">
                    Bekijk hoeveel punten je in iedere
                    VoetIQ-competitie hebt verdiend.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {competitionStats.map(
                    (competition) => (
                      <div
                        key={competition.code}
                        className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-green-400/20 hover:bg-white/[0.07]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-2xl">
                            {competition.icon}
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-black text-green-300">
                              {competition.points}
                            </div>

                            <div className="text-[10px] font-bold uppercase tracking-wide text-green-100/35">
                              punten
                            </div>
                          </div>
                        </div>

                        <h3 className="mt-4 font-black text-white">
                          {competition.name}
                        </h3>

                        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
                          <div>
                            <p className="text-lg font-black">
                              {competition.predictions}
                            </p>

                            <p className="text-[10px] uppercase tracking-wide text-green-100/35">
                              Voorspeld
                            </p>
                          </div>

                          <div>
                            <p className="text-lg font-black">
                              {competition.exact}
                            </p>

                            <p className="text-[10px] uppercase tracking-wide text-green-100/35">
                              Exact
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>

              <section className="mt-10">
                <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                      Mijn geschiedenis
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      Voorspellingen
                    </h2>
                  </div>

                  <p className="text-sm text-green-100/40">
                    {totalPredictions} voorspelling
                    {totalPredictions === 1
                      ? ""
                      : "en"}
                  </p>
                </div>

                {predictions.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
                    <div className="text-4xl">
                      ⚽
                    </div>

                    <p className="mt-3 font-bold">
                      Je hebt nog geen voorspellingen
                      gedaan.
                    </p>

                    <p className="mt-1 text-sm text-green-100/50">
                      Ga naar Wedstrijden en doe je
                      eerste voorspelling.
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {predictions.map(
                    (prediction) => {
                      const status =
                        getPredictionStatus(
                          prediction
                        );

                      const competition =
                        getCompetition(
                          prediction.competition_code
                        );

                      const hasResult =
                        prediction.actual_home_score !==
                          null &&
                        prediction.actual_away_score !==
                          null;

                      return (
                        <article
                          key={prediction.id}
                          className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-green-400/20 hover:bg-white/[0.07]"
                        >
                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0">
                              <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-green-500/10 px-2.5 py-1 text-[11px] font-bold text-green-200 ring-1 ring-green-400/10">
                                <span>
                                  {
                                    competition.icon
                                  }
                                </span>

                                <span>
                                  {
                                    competition.name
                                  }
                                </span>
                              </div>

                              <p className="font-bold text-white">
                                {
                                  prediction.match_name
                                }
                              </p>

                              <p className="mt-1 text-xs text-green-100/40">
                                Voorspeld op{" "}
                                {formatDate(
                                  prediction.created_at
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <ScoreBox
                                label="Jouw voorspelling"
                                home={
                                  prediction.home_score
                                }
                                away={
                                  prediction.away_score
                                }
                              />

                              {hasResult && (
                                <>
                                  <span className="text-xl font-black text-green-100/20">
                                    →
                                  </span>

                                  <ScoreBox
                                    label="Uitslag"
                                    home={
                                      prediction.actual_home_score!
                                    }
                                    away={
                                      prediction.actual_away_score!
                                    }
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                            <span
                              className="rounded-lg px-3 py-1.5 text-xs font-bold"
                              style={{
                                color:
                                  status.color,
                                background:
                                  status.background,
                              }}
                            >
                              {status.label}
                            </span>

                            <span
                              className={`text-sm font-black ${
                                prediction.points > 0
                                  ? "text-green-300"
                                  : "text-green-100/40"
                              }`}
                            >
                              +
                              {prediction.points || 0}{" "}
                              punten
                            </span>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              </section>

              <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black">
                      🏆 Jouw VoetIQ-carrière
                    </p>

                    <p className="mt-1 text-sm text-green-100/45">
                      Blijf voorspellen, verbeter je
                      accuracy en klim op de
                      ranglijst.
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-500/10 px-4 py-3 text-center ring-1 ring-green-400/10">
                    <p className="text-xs text-green-100/50">
                      Totaalpunten
                    </p>

                    <p className="text-xl font-black text-green-300">
                      {totalPoints}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
      </section>
    </main>
  );
}

function ProfileHeaderStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-white/10 px-4 py-5 text-center last:border-r-0">
      <p className="text-xl font-black text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-green-100/40">
        {label}
      </p>
    </div>
  );
}

function PerformanceCard({
  icon,
  label,
  value,
  description,
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-green-400/20 hover:bg-white/[0.07]">
      <div className="flex items-center justify-between">
        <span className="text-2xl">
          {icon}
        </span>

        <span className="text-2xl font-black text-white">
          {value}
        </span>
      </div>

      <p className="mt-4 font-bold text-white">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-green-100/40">
        {description}
      </p>
    </div>
  );
}

function ScoreBox({
  label,
  home,
  away,
}: {
  label: string;
  home: number;
  away: number;
}) {
  return (
    <div className="min-w-[90px] text-center">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-green-100/35">
        {label}
      </p>

      <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2">
        <span className="text-xl font-black">
          {home} - {away}
        </span>
      </div>
    </div>
  );
}
