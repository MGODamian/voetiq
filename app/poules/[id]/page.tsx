"use client";

import { useEffect, useState } from "react";
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

type TranslationKey =
  | "notFound" | "loadError" | "noAccess" | "leaderboardError" | "loading"
  | "backPools" | "poolLabel" | "inviteCode" | "copied" | "copyCode"
  | "participant" | "participants" | "competition" | "pointsSystem"
  | "predictMatches" | "inviteFriends" | "poolLeaderboard" | "onlyPoints"
  | "noParticipants" | "prediction" | "predictions" | "exact" | "predicted"
  | "points" | "poolId"
  | "predictionsIntro" | "participantsIntro";

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
    exact:"exact", predicted:"predicted", points:"POINTS", poolId:"Pool ID", tabLeaderboard:"Leaderboard", tabPredictions:"Predictions", tabParticipants:"Participants", predictionsTitle:"Predictions", predictionsIntro:"View or make your predictions for matches that count towards this pool.", participantsTitle:"Participants", participantsIntro:"See everyone who is taking part in this pool."
  },
  de: {
    notFound:"Diese Tipprunde konnte nicht gefunden werden.", loadError:"Die Daten dieser Tipprunde konnten nicht geladen werden.",
    noAccess:"Diese Tipprunde existiert nicht oder du hast keinen Zugriff.", leaderboardError:"Die Rangliste der Tipprunde konnte nicht geladen werden.",
    loading:"Tipprunde wird geladen...", backPools:"Meine Tipprunden", poolLabel:"VOETIQ TIPPRUNDE", inviteCode:"EINLADUNGSCODE",
    copied:"Kopiert", copyCode:"Code kopieren", participant:"Teilnehmer", participants:"Teilnehmer", competition:"Wettbewerb",
    pointsSystem:"Punktesystem", predictMatches:"Spiele tippen", inviteFriends:"Freunde einladen",
    poolLeaderboard:"Tipprunden-Rangliste", onlyPoints:"Für diese Tipprunde zählen nur Punkte aus {competition}.",
    noParticipants:"In dieser Tipprunde gibt es noch keine Teilnehmer.", prediction:"Tipp", predictions:"Tipps",
    exact:"exakt", predicted:"getippt", points:"PUNKTE", poolId:"Tipprunden-ID", tabLeaderboard:"Rangliste", tabPredictions:"Tipps", tabParticipants:"Teilnehmer", predictionsTitle:"Tipps", predictionsIntro:"Sieh dir deine Tipps für Spiele an oder gib neue Tipps ab, die für diese Tipprunde zählen.", participantsTitle:"Teilnehmer", participantsIntro:"Sieh dir alle Teilnehmer dieser Tipprunde an."
  },
  es: {
    notFound:"No se ha podido encontrar este grupo.", loadError:"No se han podido cargar los datos de este grupo.",
    noAccess:"Este grupo no existe o no tienes acceso.", leaderboardError:"No se ha podido cargar la clasificación del grupo.",
    loading:"Cargando grupo...", backPools:"Mis grupos", poolLabel:"GRUPO VOETIQ", inviteCode:"CÓDIGO DE INVITACIÓN",
    copied:"Copiado", copyCode:"Copiar código", participant:"Participante", participants:"Participantes", competition:"Competición",
    pointsSystem:"Sistema de puntos", predictMatches:"Pronosticar partidos", inviteFriends:"Invitar a amigos",
    poolLeaderboard:"Clasificación del grupo", onlyPoints:"Solo cuentan para este grupo los puntos de {competition}.",
    noParticipants:"Todavía no hay participantes en este grupo.", prediction:"pronóstico", predictions:"pronósticos",
    exact:"exactos", predicted:"pronosticados", points:"PUNTOS", poolId:"ID del grupo", tabLeaderboard:"Clasificación", tabPredictions:"Pronósticos", tabParticipants:"Participantes", predictionsTitle:"Pronósticos", predictionsIntro:"Consulta o realiza tus pronósticos para los partidos que cuentan para este grupo.", participantsTitle:"Participantes", participantsIntro:"Consulta quién participa en este grupo."
  },
  fr: {
    notFound:"Cette ligue est introuvable.", loadError:"Les informations de cette ligue n’ont pas pu être chargées.",
    noAccess:"Cette ligue n’existe pas ou vous n’y avez pas accès.", leaderboardError:"Le classement de la ligue n’a pas pu être chargé.",
    loading:"Chargement de la ligue...", backPools:"Mes ligues", poolLabel:"LIGUE VOETIQ", inviteCode:"CODE D’INVITATION",
    copied:"Copié", copyCode:"Copier le code", participant:"Participant", participants:"Participants", competition:"Compétition",
    pointsSystem:"Système de points", predictMatches:"Pronostiquer les matchs", inviteFriends:"Inviter des amis",
    poolLeaderboard:"Classement de la ligue", onlyPoints:"Seuls les points de {competition} comptent pour cette ligue.",
    noParticipants:"Il n’y a encore aucun participant dans cette ligue.", prediction:"pronostic", predictions:"pronostics",
    exact:"exacts", predicted:"pronostiqués", points:"POINTS", poolId:"ID de la ligue", tabLeaderboard:"Classement", tabPredictions:"Pronostics", tabParticipants:"Participants", predictionsTitle:"Pronostics", predictionsIntro:"Consultez ou faites vos pronostics pour les matchs qui comptent pour cette ligue.", participantsTitle:"Participants", participantsIntro:"Découvrez tous les participants de cette ligue."
  },
  it: {
    notFound:"Questo gruppo non è stato trovato.", loadError:"Non è stato possibile caricare i dati di questo gruppo.",
    noAccess:"Questo gruppo non esiste oppure non hai accesso.", leaderboardError:"Non è stato possibile caricare la classifica del gruppo.",
    loading:"Caricamento gruppo...", backPools:"I miei gruppi", poolLabel:"GRUPPO VOETIQ", inviteCode:"CODICE D’INVITO",
    copied:"Copiato", copyCode:"Copia codice", participant:"Partecipante", participants:"Partecipanti", competition:"Competizione",
    pointsSystem:"Sistema di punti", predictMatches:"Pronostica le partite", inviteFriends:"Invita amici",
    poolLeaderboard:"Classifica del gruppo", onlyPoints:"Per questo gruppo contano solo i punti di {competition}.",
    noParticipants:"Non ci sono ancora partecipanti in questo gruppo.", prediction:"pronostico", predictions:"pronostici",
    exact:"esatti", predicted:"pronosticati", points:"PUNTI", poolId:"ID gruppo", tabLeaderboard:"Classifica", tabPredictions:"Pronostici", tabParticipants:"Partecipanti", predictionsTitle:"Pronostici", predictionsIntro:"Visualizza o inserisci i pronostici per le partite valide per questo gruppo.", participantsTitle:"Partecipanti", participantsIntro:"Scopri chi partecipa a questo gruppo."
  },
  pt: {
    notFound:"Não foi possível encontrar este grupo.", loadError:"Não foi possível carregar os dados deste grupo.",
    noAccess:"Este grupo não existe ou não tens acesso.", leaderboardError:"Não foi possível carregar a classificação do grupo.",
    loading:"A carregar grupo...", backPools:"Os meus grupos", poolLabel:"GRUPO VOETIQ", inviteCode:"CÓDIGO DE CONVITE",
    copied:"Copiado", copyCode:"Copiar código", participant:"Participante", participants:"Participantes", competition:"Competição",
    pointsSystem:"Sistema de pontos", predictMatches:"Prever jogos", inviteFriends:"Convidar amigos",
    poolLeaderboard:"Classificação do grupo", onlyPoints:"Apenas os pontos de {competition} contam para este grupo.",
    noParticipants:"Ainda não há participantes neste grupo.", prediction:"previsão", predictions:"previsões",
    exact:"exatos", predicted:"previstos", points:"PONTOS", poolId:"ID do grupo", tabLeaderboard:"Classificação", tabPredictions:"Previsões", tabParticipants:"Participantes", predictionsTitle:"Previsões", predictionsIntro:"Vê ou faz as tuas previsões para os jogos que contam para este grupo.", participantsTitle:"Participantes", participantsIntro:"Vê quem participa neste grupo."
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

export default function PoolDetailPage() {
  const router = useRouter();

  const [poolId, setPoolId] = useState("");
  const [pool, setPool] = useState<Pool | null>(null);
  const [leaderboard, setLeaderboard] = useState<
    LeaderboardPlayer[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<PoolTab>("leaderboard");

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
      if (navigator.share) {
        await navigator.share({
          title: pool.name,
          text: `Doe mee met mijn VoetIQ-poule "${pool.name}"!`,
          url: inviteUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
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
            background: "#f4f7f5",
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
            background: "#f4f7f5",
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
          background: "#f4f7f5",
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
              color: "#08783e",
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
              background:
                "linear-gradient(135deg, #0d3d27 0%, #082b1c 100%)",
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
                border: "1px solid #d6dfd9",
                borderRadius: "11px",
                padding: "13px 18px",
                background: "white",
                color: "#183427",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              🔗 {t("inviteFriends")}
            </button>
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
              background: "white",
              borderRadius: "20px",
              overflow: "hidden",
              border: "1px solid #e3e9e5",
              boxShadow:
                "0 8px 30px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                padding: "22px 24px",
                borderBottom: "1px solid #e8eeea",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  color: "#10251a",
                  fontSize: "25px",
                }}
              >
                🏆 {t("poolLeaderboard")}
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#738078",
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
                        : "1px solid #edf1ee",
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
                      color: "#08783e",
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
            <section style={{ background: "white", borderRadius: "20px", border: "1px solid #e3e9e5", padding: "28px", boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
              <h2 style={{ margin: 0, color: "#10251a", fontSize: "25px" }}>⚽ {"Voorspellingen"}</h2>
              <p style={{ margin: "8px 0 22px", color: "#738078", fontSize: "14px", lineHeight: 1.6 }}>{t("predictionsIntro")}</p>
              <button onClick={() => router.push(`/wedstrijden?competition=${pool.competition_code}`)} style={{ border: 0, borderRadius: "11px", padding: "13px 18px", background: "#08783e", color: "white", fontWeight: 900, cursor: "pointer" }}>
                ⚽ {t("predictMatches")}
              </button>
            </section>
          )}

          {activeTab === "participants" && (
            <section style={{ background: "white", borderRadius: "20px", border: "1px solid #e3e9e5", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "22px 24px", borderBottom: "1px solid #e8eeea" }}>
                <h2 style={{ margin: 0, color: "#10251a", fontSize: "25px" }}>👥 {"Deelnemers"}</h2>
                <p style={{ margin: "6px 0 0", color: "#738078", fontSize: "14px" }}>{t("participantsIntro")}</p>
              </div>
              {leaderboard.map((player, index) => (
                <div key={player.user_id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "17px 24px", borderBottom: index === leaderboard.length - 1 ? "none" : "1px solid #edf1ee" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#e9f8ef", color: "#08783e", display: "grid", placeItems: "center", fontWeight: 900 }}>{player.username.slice(0, 1).toUpperCase()}</div>
                  <div style={{ flex: 1 }}><div style={{ color: "#10251a", fontWeight: 900 }}>{player.username}</div><div style={{ color: "#849088", fontSize: "12px", marginTop: "3px" }}>{player.predictions_count} {player.predictions_count === 1 ? t("prediction") : t("predictions")}</div></div>
                  <div style={{ color: "#08783e", fontWeight: 900 }}>{player.total_points} {t("points").toLowerCase()}</div>
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
    <button onClick={onClick} style={{ border: active ? "1px solid #08783e" : "1px solid #dbe4de", borderRadius: "11px", padding: "11px 16px", background: active ? "#08783e" : "white", color: active ? "white" : "#183427", fontWeight: 900, cursor: "pointer" }}>
      {children}
    </button>
  );
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
        background: "white",
        border: "1px solid #e3e9e5",
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
          color: "#10251a",
          fontSize: "19px",
          fontWeight: 900,
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#7a867f",
          fontSize: "12px",
          marginTop: "3px",
        }}
      >
        {label}
      </div>
    </div>
  );
}
