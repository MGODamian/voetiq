"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../Navbar";
import { supabase } from "@/lib/supabase";

type Pool = {
  id: string;
  name: string;
  competition_code: string;
  invite_code: string;
  owner_id: string;
  created_at: string;
};

type LeaderboardPlayer = {
  user_id: string;
  username: string;
  total_points: number;
  predictions_count: number;
  exact_scores: number;
};


type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type PoolTab = "leaderboard" | "predictions" | "participants";

type Match = {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number;
  homeTeam: { name: string; crest?: string };
  awayTeam: { name: string; crest?: string };
};

type Prediction = {
  home: string;
  away: string;
};

type StoredPrediction = {
  match_id: number;
  home_score: number;
  away_score: number;
};

type PoolMatchPrediction = {
  user_id: string;
  username: string;
  home_score: number;
  away_score: number;
  points: number;
};

type TranslationKey =
  | "notFound" | "loadError" | "noAccess" | "leaderboardError" | "loading"
  | "backPools" | "poolLabel" | "inviteCode" | "copied" | "copyCode"
  | "participant" | "participants" | "competition" | "pointsSystem"
  | "predictMatches" | "inviteFriends" | "poolLeaderboard" | "onlyPoints"
  | "noParticipants" | "prediction" | "predictions" | "exact" | "predicted"
  | "points" | "poolId"
 ;

const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  nl: {
    notFound:"Deze poule kon niet worden gevonden.", loadError:"De gegevens van deze poule konden niet worden geladen.",
    noAccess:"Deze poule bestaat niet of je hebt geen toegang.", leaderboardError:"Het pouleklassement kon niet worden geladen.",
    loading:"Poule wordt geladen...", backPools:"Mijn poules", poolLabel:"VOETIQ POULE", inviteCode:"UITNODIGINGSCODE",
    copied:"Gekopieerd", copyCode:"Code kopiëren", participant:"Deelnemer", participants:"Deelnemers", competition:"Competitie",
    pointsSystem:"Puntensysteem", predictMatches:"Voorspel wedstrijden", inviteFriends:"Vrienden uitnodigen",
    poolLeaderboard:"Pouleklassement", onlyPoints:"Alleen punten uit {competition} tellen mee voor deze poule.",
    noParticipants:"Er zijn nog geen deelnemers in deze poule.", prediction:"voorspelling", predictions:"voorspellingen",
    exact:"exact", predicted:"voorspeld", points:"PUNTEN", poolId:"Poule-ID"
  },
  en: {
    notFound:"This pool could not be found.", loadError:"The details for this pool could not be loaded.",
    noAccess:"This pool does not exist or you do not have access.", leaderboardError:"The pool leaderboard could not be loaded.",
    loading:"Loading pool...", backPools:"My pools", poolLabel:"VOETIQ POOL", inviteCode:"INVITATION CODE",
    copied:"Copied", copyCode:"Copy code", participant:"Participant", participants:"Participants", competition:"Competition",
    pointsSystem:"Points system", predictMatches:"Predict matches", inviteFriends:"Invite friends",
    poolLeaderboard:"Pool leaderboard", onlyPoints:"Only points from {competition} count towards this pool.",
    noParticipants:"There are no participants in this pool yet.", prediction:"prediction", predictions:"predictions",
    exact:"exact", predicted:"predicted", points:"POINTS", poolId:"Pool ID"
  },
  de: {
    notFound:"Diese Tipprunde konnte nicht gefunden werden.", loadError:"Die Daten dieser Tipprunde konnten nicht geladen werden.",
    noAccess:"Diese Tipprunde existiert nicht oder du hast keinen Zugriff.", leaderboardError:"Die Rangliste der Tipprunde konnte nicht geladen werden.",
    loading:"Tipprunde wird geladen...", backPools:"Meine Tipprunden", poolLabel:"VOETIQ TIPPRUNDE", inviteCode:"EINLADUNGSCODE",
    copied:"Kopiert", copyCode:"Code kopieren", participant:"Teilnehmer", participants:"Teilnehmer", competition:"Wettbewerb",
    pointsSystem:"Punktesystem", predictMatches:"Spiele tippen", inviteFriends:"Freunde einladen",
    poolLeaderboard:"Tipprunden-Rangliste", onlyPoints:"Für diese Tipprunde zählen nur Punkte aus {competition}.",
    noParticipants:"In dieser Tipprunde gibt es noch keine Teilnehmer.", prediction:"Tipp", predictions:"Tipps",
    exact:"exakt", predicted:"getippt", points:"PUNKTE", poolId:"Tipprunden-ID"
  },
  es: {
    notFound:"No se ha podido encontrar este grupo.", loadError:"No se han podido cargar los datos de este grupo.",
    noAccess:"Este grupo no existe o no tienes acceso.", leaderboardError:"No se ha podido cargar la clasificación del grupo.",
    loading:"Cargando grupo...", backPools:"Mis grupos", poolLabel:"GRUPO VOETIQ", inviteCode:"CÓDIGO DE INVITACIÓN",
    copied:"Copiado", copyCode:"Copiar código", participant:"Participante", participants:"Participantes", competition:"Competición",
    pointsSystem:"Sistema de puntos", predictMatches:"Pronosticar partidos", inviteFriends:"Invitar a amigos",
    poolLeaderboard:"Clasificación del grupo", onlyPoints:"Solo cuentan para este grupo los puntos de {competition}.",
    noParticipants:"Todavía no hay participantes en este grupo.", prediction:"pronóstico", predictions:"pronósticos",
    exact:"exactos", predicted:"pronosticados", points:"PUNTOS", poolId:"ID del grupo"
  },
  fr: {
    notFound:"Cette ligue est introuvable.", loadError:"Les informations de cette ligue n’ont pas pu être chargées.",
    noAccess:"Cette ligue n’existe pas ou vous n’y avez pas accès.", leaderboardError:"Le classement de la ligue n’a pas pu être chargé.",
    loading:"Chargement de la ligue...", backPools:"Mes ligues", poolLabel:"LIGUE VOETIQ", inviteCode:"CODE D’INVITATION",
    copied:"Copié", copyCode:"Copier le code", participant:"Participant", participants:"Participants", competition:"Compétition",
    pointsSystem:"Système de points", predictMatches:"Pronostiquer les matchs", inviteFriends:"Inviter des amis",
    poolLeaderboard:"Classement de la ligue", onlyPoints:"Seuls les points de {competition} comptent pour cette ligue.",
    noParticipants:"Il n’y a encore aucun participant dans cette ligue.", prediction:"pronostic", predictions:"pronostics",
    exact:"exacts", predicted:"pronostiqués", points:"POINTS", poolId:"ID de la ligue"
  },
  it: {
    notFound:"Questo gruppo non è stato trovato.", loadError:"Non è stato possibile caricare i dati di questo gruppo.",
    noAccess:"Questo gruppo non esiste oppure non hai accesso.", leaderboardError:"Non è stato possibile caricare la classifica del gruppo.",
    loading:"Caricamento gruppo...", backPools:"I miei gruppi", poolLabel:"GRUPPO VOETIQ", inviteCode:"CODICE D’INVITO",
    copied:"Copiato", copyCode:"Copia codice", participant:"Partecipante", participants:"Partecipanti", competition:"Competizione",
    pointsSystem:"Sistema di punti", predictMatches:"Pronostica le partite", inviteFriends:"Invita amici",
    poolLeaderboard:"Classifica del gruppo", onlyPoints:"Per questo gruppo contano solo i punti di {competition}.",
    noParticipants:"Non ci sono ancora partecipanti in questo gruppo.", prediction:"pronostico", predictions:"pronostici",
    exact:"esatti", predicted:"pronosticati", points:"PUNTI", poolId:"ID gruppo"
  },
  pt: {
    notFound:"Não foi possível encontrar este grupo.", loadError:"Não foi possível carregar os dados deste grupo.",
    noAccess:"Este grupo não existe ou não tens acesso.", leaderboardError:"Não foi possível carregar a classificação do grupo.",
    loading:"A carregar grupo...", backPools:"Os meus grupos", poolLabel:"GRUPO VOETIQ", inviteCode:"CÓDIGO DE CONVITE",
    copied:"Copiado", copyCode:"Copiar código", participant:"Participante", participants:"Participantes", competition:"Competição",
    pointsSystem:"Sistema de pontos", predictMatches:"Prever jogos", inviteFriends:"Convidar amigos",
    poolLeaderboard:"Classificação do grupo", onlyPoints:"Apenas os pontos de {competition} contam para este grupo.",
    noParticipants:"Ainda não há participantes neste grupo.", prediction:"previsão", predictions:"previsões",
    exact:"exatos", predicted:"previstos", points:"PONTOS", poolId:"ID do grupo"
  }
};

function isLanguageCode(value: string): value is LanguageCode {
  return ["nl","en","de","es","fr","it","pt"].includes(value);
}

const competitions: Record<
  string,
  { name: string; flag: string }
> = {
  DED: { name: "Eredivisie", flag: "🇳🇱" },
  PL: { name: "Premier League", flag: "🏴" },
  PD: { name: "La Liga", flag: "🇪🇸" },
  BL1: { name: "Bundesliga", flag: "🇩🇪" },
  SA: { name: "Serie A", flag: "🇮🇹" },
  FL1: { name: "Ligue 1", flag: "🇫🇷" },
  PPL: { name: "Primeira Liga", flag: "🇵🇹" },
  CL: { name: "Champions League", flag: "🏆" },
};

const competitionThemes: Record<
  string,
  { hero: string; card: string; accent: string; glow: string }
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
    hero: "linear-gradient(135deg, #1b0808 0%, #641616 55%, #a52b12 100%)",
    card: "linear-gradient(135deg, #3b0c0c 0%, #9a2915 100%)",
    accent: "#ffad78",
    glow: "rgba(231,76,35,0.27)",
  },
  BL1: {
    hero: "linear-gradient(135deg, #190404 0%, #650909 55%, #a20e0e 100%)",
    card: "linear-gradient(135deg, #3d0606 0%, #9e1010 100%)",
    accent: "#ff8b8b",
    glow: "rgba(220,25,25,0.27)",
  },
  SA: {
    hero: "linear-gradient(135deg, #041326 0%, #073c78 55%, #0967b5 100%)",
    card: "linear-gradient(135deg, #062a55 0%, #0874bd 100%)",
    accent: "#8bd1ff",
    glow: "rgba(28,126,219,0.27)",
  },
  FL1: {
    hero: "linear-gradient(135deg, #071124 0%, #101f4b 55%, #19327b 100%)",
    card: "linear-gradient(135deg, #0c1837 0%, #1c3474 100%)",
    accent: "#d8ff49",
    glow: "rgba(97,119,255,0.24)",
  },
  PPL: {
    hero: "linear-gradient(135deg, #061a11 0%, #0a5130 55%, #12693f 100%)",
    card: "linear-gradient(135deg, #082f1d 0%, #12653d 100%)",
    accent: "#76ecad",
    glow: "rgba(26,166,91,0.25)",
  },
  CL: {
    hero: "linear-gradient(135deg, #030514 0%, #0b1240 55%, #171e68 100%)",
    card: "linear-gradient(135deg, #070b2b 0%, #192365 100%)",
    accent: "#aeb7ff",
    glow: "rgba(76,91,220,0.28)",
  },
};

export default function PoolDetailPage() {
  const router = useRouter();

  const [poolId, setPoolId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [pool, setPool] = useState<Pool | null>(null);
  const [leaderboard, setLeaderboard] = useState<
    LeaderboardPlayer[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<PoolTab>("leaderboard");
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<Record<number, Prediction>>({});
  const [savedMatchIds, setSavedMatchIds] = useState<Set<number>>(new Set());
  const [selectedMatchday, setSelectedMatchday] = useState<number | null>(null);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesMessage, setMatchesMessage] = useState("");
  const [openMatchId, setOpenMatchId] = useState<number | null>(null);
  const [poolMatchPredictions, setPoolMatchPredictions] = useState<
    PoolMatchPrediction[]
  >([]);
  const [poolPredictionsLoading, setPoolPredictionsLoading] = useState(false);
  const [poolPredictionsMessage, setPoolPredictionsMessage] = useState("");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("voetiq-language");
    const initialLanguage: LanguageCode =
      savedLanguage && isLanguageCode(savedLanguage) ? savedLanguage : "nl";

    setLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const nextLanguage = customEvent.detail?.language;
      if (nextLanguage && isLanguageCode(nextLanguage)) {
        setLanguage(nextLanguage);
        document.documentElement.lang = nextLanguage;
      }
    }

    window.addEventListener("voetiq-language-change", handleLanguageChange);

    const parts = window.location.pathname
      .split("/")
      .filter(Boolean);

    const id = parts[1];

    if (!id) {
      setErrorMessage(translations[initialLanguage].notFound);
      setLoading(false);
      return;
    }

    setPoolId(id);
    loadPool(id);

    return () => {
      window.removeEventListener("voetiq-language-change", handleLanguageChange);
    };
  }, []);

  async function loadPool(id: string) {
    setLoading(true);
    setErrorMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/inloggen");
      return;
    }

    setCurrentUserId(user.id);

    const { data: poolData, error: poolError } =
      await supabase
        .from("pools")
        .select(
          "id, name, competition_code, invite_code, owner_id, created_at"
        )
        .eq("id", id)
        .maybeSingle();

    if (poolError) {
      console.error(poolError);
      setErrorMessage(
        translations[language]["loadError"]
      );
      setLoading(false);
      return;
    }

    if (!poolData) {
      setErrorMessage(
        translations[language]["noAccess"]
      );
      setLoading(false);
      return;
    }

    setPool(poolData);
    await loadPoolMatches(poolData.competition_code);

    const { data: leaderboardData, error: leaderboardError } =
      await supabase.rpc("get_pool_leaderboard", {
        requested_pool_id: id,
      });

    if (leaderboardError) {
      console.error(leaderboardError);
      setErrorMessage(
        translations[language]["leaderboardError"]
      );
      setLoading(false);
      return;
    }

    setLeaderboard(leaderboardData || []);
    setLoading(false);
  }


  async function loadPoolMatches(competitionCode: string) {
    setMatchesLoading(true);
    setMatchesMessage("");

    try {
      const response = await fetch(
        `/api/matches?competition=${competitionCode}`,
        { cache: "no-store" }
      );

      if (!response.ok) throw new Error("Kon wedstrijden niet ophalen");

      const data = await response.json();
      const competitionMatches: Match[] = (data.matches || [])
        .sort(
          (a: Match, b: Match) =>
            new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime()
        );

      setMatches(competitionMatches);

      const matchdays = competitionMatches
        .map((match) => match.matchday)
        .filter((matchday): matchday is number => typeof matchday === "number");

      if (matchdays.length > 0) {
        const now = Date.now();
        const nextMatch = competitionMatches.find(
          (match) => new Date(match.utcDate).getTime() >= now
        );
        const latestStartedMatch = [...competitionMatches]
          .reverse()
          .find((match) => new Date(match.utcDate).getTime() < now);

        setSelectedMatchday(
          nextMatch?.matchday ??
            latestStartedMatch?.matchday ??
            Math.min(...matchdays)
        );
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && competitionMatches.length > 0) {
        const matchIds = competitionMatches.map((match) => match.id);
        const { data: stored } = await supabase
          .from("predictions")
          .select("match_id, home_score, away_score")
          .eq("user_id", user.id)
          .in("match_id", matchIds);

        const predictionMap: Record<number, Prediction> = {};
        const storedIds = new Set<number>();

        ((stored || []) as StoredPrediction[]).forEach((prediction) => {
          predictionMap[prediction.match_id] = {
            home: String(prediction.home_score),
            away: String(prediction.away_score),
          };
          storedIds.add(prediction.match_id);
        });

        setPredictions(predictionMap);
        setSavedMatchIds(storedIds);
      }
    } catch (error) {
      console.error(error);
      setMatchesMessage("De wedstrijden konden niet worden geladen.");
    } finally {
      setMatchesLoading(false);
    }
  }

  const availableMatchdays = useMemo(
    () =>
      Array.from(
        new Set(
          matches
            .map((match) => match.matchday)
            .filter((matchday): matchday is number => typeof matchday === "number")
        )
      ).sort((a, b) => a - b),
    [matches]
  );

  const currentMatches = matches.filter(
    (match) => match.matchday === selectedMatchday
  );

  function changePoolMatchday(direction: "previous" | "next") {
    if (selectedMatchday === null) return;
    const index = availableMatchdays.indexOf(selectedMatchday);
    const nextIndex = direction === "previous" ? index - 1 : index + 1;

    if (nextIndex >= 0 && nextIndex < availableMatchdays.length) {
      setSelectedMatchday(availableMatchdays[nextIndex]);
    }
  }

  async function togglePoolPredictions(match: Match) {
    const kickoff = new Date(match.utcDate).getTime();

    if (Date.now() < kickoff) {
      setOpenMatchId(match.id);
      setPoolMatchPredictions([]);
      setPoolPredictionsMessage(
        "Voorspellingen van andere deelnemers worden zichtbaar zodra de wedstrijd is begonnen."
      );
      return;
    }

    if (openMatchId === match.id) {
      setOpenMatchId(null);
      setPoolMatchPredictions([]);
      setPoolPredictionsMessage("");
      return;
    }

    setOpenMatchId(match.id);
    setPoolMatchPredictions([]);
    setPoolPredictionsMessage("");
    setPoolPredictionsLoading(true);

    const { data, error } = await supabase.rpc(
      "get_pool_match_predictions",
      {
        requested_pool_id: poolId,
        requested_match_id: match.id,
      }
    );

    if (error) {
      console.error(error);
      setPoolPredictionsMessage(
        error.message ||
          "De voorspellingen konden niet worden geladen."
      );
      setPoolPredictionsLoading(false);
      return;
    }

    setPoolMatchPredictions((data || []) as PoolMatchPrediction[]);

    if (!data || data.length === 0) {
      setPoolPredictionsMessage(
        "Niemand in deze poule heeft voor deze wedstrijd een voorspelling opgeslagen."
      );
    }

    setPoolPredictionsLoading(false);
  }

  async function copyInviteCode() {
    if (!pool) return;

    try {
      await navigator.clipboard.writeText(pool.invite_code);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  }

  async function inviteFriends() {
    if (!pool) return;

    const inviteUrl = `${window.location.origin}/poules/join/${encodeURIComponent(
      pool.invite_code
    )}`;

    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2500);
    } catch (error) {
      console.error(error);
    }
  }

  function getMedal(index: number) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";

    return `${index + 1}.`;
  }

  const t = (key: TranslationKey) =>
    translations[language][key] || translations.nl[key];

  const format = (key: TranslationKey, values: Record<string, string>) =>
    Object.entries(values).reduce(
      (text, [name, value]) => text.replace(`{${name}}`, value),
      t(key)
    );

  if (loading) {
    return (
      <>
        <Navbar />

        <main
          style={{
            minHeight: "100vh",
            background: "radial-gradient(circle at 50% 0%, rgba(15, 122, 70, 0.20) 0%, transparent 32%), linear-gradient(180deg, #00170e 0%, #00110a 48%, #000d08 100%)",
            padding: "60px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            <p>{t("loading")}</p>
          </div>
        </main>
      </>
    );
  }

  if (errorMessage || !pool) {
    return (
      <>
        <Navbar />

        <main
          style={{
            minHeight: "100vh",
            background: "radial-gradient(circle at 50% 0%, rgba(15, 122, 70, 0.20) 0%, transparent 32%), linear-gradient(180deg, #00170e 0%, #00110a 48%, #000d08 100%)",
            padding: "60px 20px",
          }}
        >
          <div
            style={{
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                background: "#fee2e2",
                color: "#991b1b",
                padding: "20px",
                borderRadius: "14px",
                fontWeight: 700,
                marginBottom: "20px",
              }}
            >
              {errorMessage ||
                t("loadError")}
            </div>

            <button
              onClick={() => router.push("/poules")}
              style={{
                border: 0,
                borderRadius: "10px",
                padding: "12px 18px",
                background: "#08783e",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              ← {t("backPools")}
            </button>
          </div>
        </main>
      </>
    );
  }

  const competition =
    competitions[pool.competition_code] || {
      name: pool.competition_code,
      flag: "⚽",
    };

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at 50% 0%, rgba(15, 122, 70, 0.20) 0%, transparent 32%), linear-gradient(180deg, #00170e 0%, #00110a 48%, #000d08 100%)",
          padding: "38px 20px 80px",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={() => router.push("/poules")}
            style={{
              border: 0,
              background: "transparent",
              color: "#41e58b",
              fontWeight: 800,
              cursor: "pointer",
              padding: 0,
              marginBottom: "22px",
              fontSize: "14px",
            }}
          >
            ← {t("backPools")}
          </button>

          <section
            style={{
              background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
              color: "white",
              borderRadius: "24px",
              padding: "32px",
              marginBottom: "22px",
              boxShadow:
                "0 12px 35px rgba(13,61,39,0.16)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    color: "#83e7ae",
                    fontWeight: 900,
                    fontSize: "13px",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                  }}
                >
                  {t("poolLabel")}
                </div>

                <h1
                  style={{
                    margin: 0,
                    fontSize: "38px",
                  }}
                >
                  {pool.name}
                </h1>

                <div
                  style={{
                    marginTop: "10px",
                    color: "#cce5d7",
                    fontSize: "16px",
                  }}
                >
                  {competition.flag} {competition.name}
                </div>
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border:
                    "1px solid rgba(255,255,255,0.10)",
                  borderRadius: "16px",
                  padding: "15px 18px",
                  minWidth: "210px",
                }}
              >
                <div
                  style={{
                    color: "#a8c8b7",
                    fontSize: "12px",
                    fontWeight: 800,
                    marginBottom: "5px",
                  }}
                >
                  {t("inviteCode")}
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                  }}
                >
                  {pool.invite_code}
                </div>

                <button
                  onClick={copyInviteCode}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    border: 0,
                    borderRadius: "9px",
                    padding: "9px",
                    background: "#2ee681",
                    color: "#052c1b",
                    fontWeight: 900,
                    cursor: "pointer",
                  }}
                >
                  {copied ? `✓ ${t("copied")}` : t("copyCode")}
                </button>
              </div>
            </div>
          </section>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "14px",
              marginBottom: "24px",
            }}
          >
            <StatCard
              icon="👥"
              value={leaderboard.length}
              label={
                leaderboard.length === 1 ? t("participant") : t("participants")
              }
            />

            <StatCard
              icon="⚽"
              value={competition.name}
              label={t("competition")}
            />

            <StatCard
              icon="🎯"
              value="10+ / 2 / 0"
              label={t("pointsSystem")}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "28px",
            }}
          >
            <button
              onClick={() =>
                router.push(
                  `/wedstrijden?competition=${pool.competition_code}`
                )
              }
              style={{
                border: 0,
                borderRadius: "11px",
                padding: "13px 18px",
                background: "#08783e",
                color: "white",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              ⚽ {t("predictMatches")}
            </button>

            <button
              onClick={inviteFriends}
              style={{
                border: "1px solid rgba(80,190,130,0.25)",
                borderRadius: "11px",
                padding: "13px 18px",
                background: "#00170e",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              🔗 {copied ? "Uitnodigingslink gekopieerd!" : t("inviteFriends")}
            </button>

            {currentUserId === pool.owner_id && (
              <button
                onClick={() => router.push(`/poules/${pool.id}/beheer`)}
                style={{
                  border: "1px solid rgba(80,190,130,0.25)",
                  borderRadius: "11px",
                  padding: "13px 18px",
                  background: "#0b3523",
                  color: "white",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                ⚙️ Poule beheren
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
            <TabButton active={activeTab === "leaderboard"} onClick={() => setActiveTab("leaderboard")}>
              🏆 {"Klassement"}
            </TabButton>
            <TabButton active={activeTab === "predictions"} onClick={() => setActiveTab("predictions")}>
              ⚽ {"Voorspellingen"}
            </TabButton>
            <TabButton active={activeTab === "participants"} onClick={() => setActiveTab("participants")}>
              👥 {"Deelnemers"}
            </TabButton>
          </div>

          {activeTab === "leaderboard" && (
          <section
            style={{
              background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid rgba(80,190,130,0.20)",
              boxShadow:
                "0 8px 30px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                padding: "22px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "white",
                  fontSize: "25px",
                }}
              >
                🏆 {t("poolLeaderboard")}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#a9bbb0",
                  fontSize: "14px",
                }}
              >
                {format("onlyPoints", { competition: competition.name })}
              </p>
            </div>

            {leaderboard.length === 0 ? (
              <div
                style={{
                  padding: "35px 24px",
                  textAlign: "center",
                  color: "#738078",
                }}
              >
                {t("noParticipants")}
              </div>
            ) : (
              leaderboard.map((player, index) => (
                <div
                  key={player.user_id}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "55px minmax(140px, 1fr) 100px 100px 90px",
                    alignItems: "center",
                    gap: "10px",
                    padding: "17px 24px",
                    borderBottom:
                      index === leaderboard.length - 1
                        ? "none"
                        : "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      fontSize:
                        index < 3 ? "23px" : "16px",
                      fontWeight: 900,
                    }}
                  >
                    {getMedal(index)}
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#10251a",
                        fontWeight: 900,
                      }}
                    >
                      {player.username}
                    </div>

                    <div
                      style={{
                        color: "#849088",
                        fontSize: "12px",
                        marginTop: "3px",
                      }}
                    >
                      {player.predictions_count}{" "}{player.predictions_count === 1 ? t("prediction") : t("predictions")}
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 900,
                        color: "#10251a",
                      }}
                    >
                      {player.exact_scores}
                    </div>
                    <div
                      style={{
                        color: "#849088",
                        fontSize: "11px",
                      }}
                    >
                      {t("exact")}
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 900,
                        color: "#10251a",
                      }}
                    >
                      {player.predictions_count}
                    </div>
                    <div
                      style={{
                        color: "#849088",
                        fontSize: "11px",
                      }}
                    >
                      {t("predicted")}
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      color: "#41e58b",
                      fontSize: "20px",
                      fontWeight: 900,
                    }}
                  >
                    {player.total_points}
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#849088",
                        fontWeight: 700,
                      }}
                    >
                      {t("points")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>
          )}

          {activeTab === "predictions" && (
            <section
              style={{
                background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
                borderRadius: "20px",
                border: "1px solid #e3e9e5",
                overflow: "hidden",
                boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  padding: "22px 24px",
                  color: "white",
                  background:
                    (competitionThemes[pool.competition_code] ||
                      competitionThemes.DED).card,
                }}
              >
                <h2 style={{ margin: 0, fontSize: "25px" }}>
                  ⚽ Voorspellingen
                </h2>
                <p
                  style={{
                    margin: "6px 0 0",
                    color: "rgba(255,255,255,0.75)",
                    fontSize: "14px",
                  }}
                >
                  {competition.flag} Alleen wedstrijden uit {competition.name} tellen mee.
                </p>
              </div>

              <div style={{ padding: "20px 24px 24px" }}>
                {matchesLoading ? (
                  <div style={{ padding: "35px 0", textAlign: "center", color: "#738078" }}>
                    ⚽ Wedstrijden laden...
                  </div>
                ) : availableMatchdays.length === 0 ? (
                  <div style={{ padding: "35px 0", textAlign: "center", color: "#738078" }}>
                    {matchesMessage || "Er zijn momenteel geen komende wedstrijden beschikbaar."}
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr auto 1fr",
                        alignItems: "center",
                        padding: "10px",
                        borderRadius: "14px",
                        background: "#00170e",
                        marginBottom: "15px",
                      }}
                    >
                      <button
                        onClick={() => changePoolMatchday("previous")}
                        disabled={availableMatchdays.indexOf(selectedMatchday ?? -1) <= 0}
                        style={poolNavigationButton(
                          availableMatchdays.indexOf(selectedMatchday ?? -1) <= 0
                        )}
                      >
                        ← Vorige
                      </button>

                      <div style={{ textAlign: "center" }}>
                        <div style={{ color: "#89958e", fontSize: "10px", fontWeight: 900 }}>
                          SPEELRONDE
                        </div>
                        <strong style={{ fontSize: "20px" }}>{selectedMatchday}</strong>
                      </div>

                      <div style={{ textAlign: "right" }}>
                        <button
                          onClick={() => changePoolMatchday("next")}
                          disabled={
                            availableMatchdays.indexOf(selectedMatchday ?? -1) ===
                            availableMatchdays.length - 1
                          }
                          style={poolNavigationButton(
                            availableMatchdays.indexOf(selectedMatchday ?? -1) ===
                              availableMatchdays.length - 1
                          )}
                        >
                          Volgende →
                        </button>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {currentMatches.map((match) => {
                        const date = new Date(match.utcDate);
                        const prediction = predictions[match.id];
                        const isSaved = savedMatchIds.has(match.id);
                        const hasStarted = Date.now() >= date.getTime();
                        const isOpen = openMatchId === match.id;

                        return (
                          <div
                            key={match.id}
                            style={{
                              border: isSaved
                                ? "1px solid rgba(11,143,77,0.28)"
                                : "1px solid #e8eeea",
                              borderRadius: "15px",
                              overflow: "hidden",
                              background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                padding: "10px 15px",
                                background: "#06271a",
                                color: "#b7c9bf",
                                fontSize: "12px",
                                fontWeight: 700,
                              }}
                            >
                              <span>
                                {date.toLocaleDateString("nl-NL", {
                                  weekday: "short",
                                  day: "numeric",
                                  month: "short",
                                })}
                              </span>
                              <span>
                                {isSaved ? "✓ Voorspeld · " : ""}
                                {date.toLocaleTimeString("nl-NL", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>

                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "minmax(0,1fr) auto minmax(0,1fr)",
                                alignItems: "center",
                                gap: "14px",
                                padding: "18px",
                              }}
                            >
                              <PoolTeam
                                name={match.homeTeam.name}
                                crest={match.homeTeam.crest}
                                side="home"
                              />

                              <div
                                style={{
                                  minWidth: "86px",
                                  textAlign: "center",
                                  fontWeight: 900,
                                  color: isSaved ? "#08783e" : "#849088",
                                  fontSize: isSaved ? "19px" : "14px",
                                }}
                              >
                                {prediction
                                  ? `${prediction.home} - ${prediction.away}`
                                  : "Nog invullen"}
                              </div>

                              <PoolTeam
                                name={match.awayTeam.name}
                                crest={match.awayTeam.crest}
                                side="away"
                              />
                            </div>

                            <div
                              style={{
                                padding: "0 15px 15px",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <button
                                onClick={() => togglePoolPredictions(match)}
                                style={{
                                  border: "1px solid rgba(65,229,139,0.16)",
                                  borderRadius: "9px",
                                  padding: "9px 13px",
                                  background: hasStarted ? "#0b3523" : "#06271a",
                                  color: hasStarted ? "#41e58b" : "#a9bbb0",
                                  fontWeight: 800,
                                  cursor: "pointer",
                                }}
                              >
                                {hasStarted
                                  ? isOpen
                                    ? "Verberg poulevoorspellingen ↑"
                                    : "Bekijk poulevoorspellingen ↓"
                                  : "🔒 Poulevoorspellingen na aftrap"}
                              </button>
                            </div>

                            {isOpen && (
                              <div
                                style={{
                                  borderTop: "1px solid rgba(65,229,139,0.12)",
                                  background: "#06271a",
                                  padding: "15px",
                                }}
                              >
                                {poolPredictionsLoading ? (
                                  <div
                                    style={{
                                      color: "#738078",
                                      textAlign: "center",
                                      padding: "8px",
                                    }}
                                  >
                                    Voorspellingen laden...
                                  </div>
                                ) : poolMatchPredictions.length > 0 ? (
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "8px",
                                    }}
                                  >
                                    {poolMatchPredictions.map((item) => (
                                      <div
                                        key={item.user_id}
                                        style={{
                                          display: "grid",
                                          gridTemplateColumns: "1fr auto auto",
                                          gap: "14px",
                                          alignItems: "center",
                                          background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
                                          border: "1px solid #e7ece9",
                                          borderRadius: "10px",
                                          padding: "10px 12px",
                                        }}
                                      >
                                        <strong style={{ color: "#173528" }}>
                                          {item.username}
                                        </strong>
                                        <strong
                                          style={{
                                            color: "#41e58b",
                                            fontSize: "16px",
                                          }}
                                        >
                                          {item.home_score} - {item.away_score}
                                        </strong>
                                        <span
                                          style={{
                                            color: "#b7c9bf",
                                            fontSize: "12px",
                                            minWidth: "54px",
                                            textAlign: "right",
                                          }}
                                        >
                                          {item.points} pt
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div
                                    style={{
                                      color: "#738078",
                                      textAlign: "center",
                                      lineHeight: 1.5,
                                      padding: "8px",
                                    }}
                                  >
                                    {poolPredictionsMessage}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() =>
                        router.push(`/wedstrijden?competition=${pool.competition_code}`)
                      }
                      style={{
                        marginTop: "18px",
                        width: "100%",
                        border: 0,
                        borderRadius: "11px",
                        padding: "13px 18px",
                        background: "#08783e",
                        color: "white",
                        fontWeight: 900,
                        cursor: "pointer",
                      }}
                    >
                      ⚽ {t("predictMatches")}
                    </button>
                  </>
                )}
              </div>
            </section>
          )}

          {activeTab === "participants" && (
            <section style={{ background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)", borderRadius: "20px", border: "1px solid #e3e9e5", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "22px 24px", borderBottom: "1px solid #e8eeea" }}>
                <h2 style={{ margin: 0, color: "#10251a", fontSize: "25px" }}>👥 {"Deelnemers"}</h2>
                <p style={{ margin: "6px 0 0", color: "#738078", fontSize: "14px" }}>{"Bekijk de deelnemers van deze poule."}</p>
              </div>
              {leaderboard.map((player, index) => (
                <div key={player.user_id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "17px 24px", borderBottom: index === leaderboard.length - 1 ? "none" : "1px solid #edf1ee" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#e9f8ef", color: "#41e58b", display: "grid", placeItems: "center", fontWeight: 900 }}>{player.username.slice(0, 1).toUpperCase()}</div>
                  <div style={{ flex: 1 }}><div style={{ color: "#10251a", fontWeight: 900 }}>{player.username}</div><div style={{ color: "#849088", fontSize: "12px", marginTop: "3px" }}>{player.predictions_count} {player.predictions_count === 1 ? t("prediction") : t("predictions")}</div></div>
                  <div style={{ color: "#41e58b", fontWeight: 900 }}>{player.total_points} {t("points").toLowerCase()}</div>
                </div>
              ))}
            </section>
          )}

          <div
            style={{
              marginTop: "20px",
              color: "#89958e",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            {t("poolId")}: {poolId}
          </div>
        </div>
      </main>
    </>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ border: active ? "1px solid #21b66f" : "1px solid rgba(80,190,130,0.22)", borderRadius: "11px", padding: "11px 16px", background: active ? "#08783e" : "#0b3523", color: "white", fontWeight: 900, cursor: "pointer" }}>
      {children}
    </button>
  );
}


function PoolTeam({
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
        gap: "10px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          textAlign: home ? "right" : "left",
          fontWeight: 800,
          fontSize: "14px",
        }}
      >
        {name}
      </div>

      <div
        style={{
          width: "40px",
          height: "40px",
          flexShrink: 0,
          borderRadius: "10px",
          background: "#0b3523",
          border: "1px solid rgba(65,229,139,0.12)",
          display: "grid",
          placeItems: "center",
          padding: "6px",
          boxSizing: "border-box",
        }}
      >
        {crest ? (
          <img
            src={crest}
            alt={`${name} logo`}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          "⚽"
        )}
      </div>
    </div>
  );
}

function poolNavigationButton(disabled: boolean) {
  return {
    border: "none",
    background: disabled ? "#06271a" : "#0b3523",
    color: disabled ? "#6f8177" : "#41e58b",
    borderRadius: "9px",
    padding: "9px 12px",
    fontWeight: 800,
    cursor: disabled ? "default" : "pointer",
  };
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <div
      style={{
        background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
        border: "1px solid rgba(80,190,130,0.20)",
        borderRadius: "16px",
        padding: "18px",
      }}
    >
      <div
        style={{
          fontSize: "22px",
          marginBottom: "7px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "white",
          fontSize: "19px",
          fontWeight: 900,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#a9bbb0",
          fontSize: "12px",
          marginTop: "3px",
        }}
      >
        {label}
      </div>
    </div>
  );
}
