"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";
type Filter = "all" | "upcoming" | "played" | "exact";

type Prediction = {
  id: number;
  match_name: string;
  home_score: number;
  away_score: number;
  actual_home_score: number | null;
  actual_away_score: number | null;
  points: number | null;
  created_at: string;
  competition_code: string | null;
  kickoff_at: string | null;
};

type Translation = {
  kicker: string;
  title: string;
  subtitle: string;
  total: string;
  upcoming: string;
  played: string;
  exact: string;
  points: string;
  all: string;
  predicted: string;
  result: string;
  waiting: string;
  noPredictions: string;
  noResults: string;
  loading: string;
  loginRequired: string;
  competition: string;
};

const translations: Record<LanguageCode, Translation> = {
  nl: {
    kicker: "JOUW VOETIQ",
    title: "Mijn voorspellingen",
    subtitle:
      "Bekijk al je voorspellingen, resultaten en verdiende punten op één plek.",
    total: "Voorspellingen",
    upcoming: "Nog te spelen",
    played: "Gespeeld",
    exact: "Exact",
    points: "Punten",
    all: "Alles",
    predicted: "Jouw voorspelling",
    result: "Eindstand",
    waiting: "Nog te spelen",
    noPredictions: "Je hebt nog geen voorspellingen geplaatst.",
    noResults: "Geen voorspellingen gevonden voor dit filter.",
    loading: "Voorspellingen laden...",
    loginRequired: "Je moet ingelogd zijn om je voorspellingen te bekijken.",
    competition: "Competitie",
  },
  en: {
    kicker: "YOUR VOETIQ",
    title: "My predictions",
    subtitle:
      "View all your predictions, results and earned points in one place.",
    total: "Predictions",
    upcoming: "Upcoming",
    played: "Played",
    exact: "Exact",
    points: "Points",
    all: "All",
    predicted: "Your prediction",
    result: "Final score",
    waiting: "Upcoming",
    noPredictions: "You haven't made any predictions yet.",
    noResults: "No predictions found for this filter.",
    loading: "Loading predictions...",
    loginRequired: "You need to be logged in to view your predictions.",
    competition: "Competition",
  },
  de: {
    kicker: "DEIN VOETIQ",
    title: "Meine Tipps",
    subtitle:
      "Sieh dir alle deine Tipps, Ergebnisse und verdienten Punkte an einem Ort an.",
    total: "Tipps",
    upcoming: "Noch zu spielen",
    played: "Gespielt",
    exact: "Exakt",
    points: "Punkte",
    all: "Alle",
    predicted: "Dein Tipp",
    result: "Endstand",
    waiting: "Noch zu spielen",
    noPredictions: "Du hast noch keine Tipps abgegeben.",
    noResults: "Keine Tipps für diesen Filter gefunden.",
    loading: "Tipps werden geladen...",
    loginRequired: "Du musst angemeldet sein, um deine Tipps anzusehen.",
    competition: "Wettbewerb",
  },
  es: {
    kicker: "TU VOETIQ",
    title: "Mis pronósticos",
    subtitle:
      "Consulta todos tus pronósticos, resultados y puntos obtenidos en un solo lugar.",
    total: "Pronósticos",
    upcoming: "Por jugar",
    played: "Jugados",
    exact: "Exactos",
    points: "Puntos",
    all: "Todos",
    predicted: "Tu pronóstico",
    result: "Resultado final",
    waiting: "Por jugar",
    noPredictions: "Todavía no has realizado ningún pronóstico.",
    noResults: "No se encontraron pronósticos para este filtro.",
    loading: "Cargando pronósticos...",
    loginRequired:
      "Debes iniciar sesión para consultar tus pronósticos.",
    competition: "Competición",
  },
  fr: {
    kicker: "TON VOETIQ",
    title: "Mes pronostics",
    subtitle:
      "Retrouve tous tes pronostics, résultats et points gagnés au même endroit.",
    total: "Pronostics",
    upcoming: "À venir",
    played: "Joués",
    exact: "Exacts",
    points: "Points",
    all: "Tous",
    predicted: "Ton pronostic",
    result: "Score final",
    waiting: "À venir",
    noPredictions: "Tu n'as encore fait aucun pronostic.",
    noResults: "Aucun pronostic trouvé pour ce filtre.",
    loading: "Chargement des pronostics...",
    loginRequired:
      "Tu dois être connecté pour consulter tes pronostics.",
    competition: "Compétition",
  },
  it: {
    kicker: "IL TUO VOETIQ",
    title: "I miei pronostici",
    subtitle:
      "Visualizza tutti i tuoi pronostici, risultati e punti guadagnati in un unico posto.",
    total: "Pronostici",
    upcoming: "Da giocare",
    played: "Giocate",
    exact: "Esatti",
    points: "Punti",
    all: "Tutti",
    predicted: "Il tuo pronostico",
    result: "Risultato finale",
    waiting: "Da giocare",
    noPredictions: "Non hai ancora effettuato pronostici.",
    noResults: "Nessun pronostico trovato per questo filtro.",
    loading: "Caricamento pronostici...",
    loginRequired:
      "Devi effettuare l'accesso per vedere i tuoi pronostici.",
    competition: "Competizione",
  },
  pt: {
    kicker: "O TEU VOETIQ",
    title: "Os meus prognósticos",
    subtitle:
      "Vê todos os teus prognósticos, resultados e pontos ganhos num só lugar.",
    total: "Prognósticos",
    upcoming: "Por jogar",
    played: "Jogados",
    exact: "Exatos",
    points: "Pontos",
    all: "Todos",
    predicted: "O teu prognóstico",
    result: "Resultado final",
    waiting: "Por jogar",
    noPredictions: "Ainda não fizeste nenhum prognóstico.",
    noResults: "Não foram encontrados prognósticos para este filtro.",
    loading: "A carregar prognósticos...",
    loginRequired:
      "Tens de iniciar sessão para veres os teus prognósticos.",
    competition: "Competição",
  },
};

const competitionNames: Record<string, string> = {
  DED: "🇳🇱 Eredivisie",
  PL: "🏴 Premier League",
  PD: "🇪🇸 La Liga",
  BL1: "🇩🇪 Bundesliga",
  SA: "🇮🇹 Serie A",
  FL1: "🇫🇷 Ligue 1",
  PPL: "🇵🇹 Primeira Liga",
  CL: "🏆 Champions League",
  EL: "🏆 Europa League",
  ECL: "🏆 Conference League",
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return (
    value === "nl" ||
    value === "en" ||
    value === "de" ||
    value === "es" ||
    value === "fr" ||
    value === "it" ||
    value === "pt"
  );
}

function isPlayed(prediction: Prediction) {
  return (
    prediction.actual_home_score !== null &&
    prediction.actual_away_score !== null
  );
}

function isExact(prediction: Prediction) {
  return (
    isPlayed(prediction) &&
    prediction.home_score === prediction.actual_home_score &&
    prediction.away_score === prediction.actual_away_score
  );
}

export default function MyPredictionsPage() {
  const router = useRouter();

  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [competitionFilter, setCompetitionFilter] = useState("all");

  const t = translations[language];

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("voetiq-language");

    if (isLanguageCode(storedLanguage)) {
      setLanguage(storedLanguage);
    }

    function handleLanguageChange() {
      const newLanguage = window.localStorage.getItem("voetiq-language");

      if (isLanguageCode(newLanguage)) {
        setLanguage(newLanguage);
      }
    }

    window.addEventListener(
      "voetiq-language-change",
      handleLanguageChange
    );

    void loadPredictions();

    return () => {
      window.removeEventListener(
        "voetiq-language-change",
        handleLanguageChange
      );
    };
  }, []);

  async function loadPredictions() {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/inloggen?redirect=/mijn-voorspellingen");
      return;
    }

    const { data, error: predictionError } = await supabase
      .from("predictions")
      .select(
        "id, match_name, home_score, away_score, actual_home_score, actual_away_score, points, created_at, competition_code, kickoff_at"
      )
      .eq("user_id", user.id)
      .order("kickoff_at", { ascending: false });

    if (predictionError) {
      console.error(predictionError);
      setError(predictionError.message);
      setLoading(false);
      return;
    }

    setPredictions((data || []) as Prediction[]);
    setLoading(false);
  }

  const stats = useMemo(() => {
    const played = predictions.filter(isPlayed);
    const upcoming = predictions.filter((prediction) => !isPlayed(prediction));
    const exact = played.filter(isExact);

    const points = played.reduce(
      (total, prediction) => total + Number(prediction.points || 0),
      0
    );

    return {
      total: predictions.length,
      upcoming: upcoming.length,
      played: played.length,
      exact: exact.length,
      points,
    };
  }, [predictions]);

  const availableCompetitions = useMemo(() => {
    return Array.from(
      new Set(
        predictions
          .map((prediction) => prediction.competition_code)
          .filter((code): code is string => Boolean(code))
      )
    );
  }, [predictions]);

  const filteredPredictions = useMemo(() => {
    return predictions.filter((prediction) => {
      if (
        competitionFilter !== "all" &&
        prediction.competition_code !== competitionFilter
      ) {
        return false;
      }

      if (filter === "upcoming") {
        return !isPlayed(prediction);
      }

      if (filter === "played") {
        return isPlayed(prediction);
      }

      if (filter === "exact") {
        return isExact(prediction);
      }

      return true;
    });
  }, [predictions, filter, competitionFilter]);

  const locale =
    language === "nl"
      ? "nl-NL"
      : language === "en"
        ? "en-GB"
        : language === "de"
          ? "de-DE"
          : language === "es"
            ? "es-ES"
            : language === "fr"
              ? "fr-FR"
              : language === "it"
                ? "it-IT"
                : "pt-PT";

  function formatDate(date: string | null) {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toLocaleString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <>
      <Navbar />

      <main className="predictions-page">
        <div className="predictions-container">
          <section className="hero">
            <div className="hero-kicker">{t.kicker}</div>
            <h1>⚽ {t.title}</h1>
            <p>{t.subtitle}</p>
          </section>

          {loading ? (
            <div className="state-card">{t.loading}</div>
          ) : error ? (
            <div className="error-card">{error}</div>
          ) : predictions.length === 0 ? (
            <div className="empty-card">
              <div className="empty-icon">⚽</div>
              <strong>{t.noPredictions}</strong>

              <button onClick={() => router.push("/wedstrijden")}>
                {translations[language].upcoming} →
              </button>
            </div>
          ) : (
            <>
              <section className="stats-grid">
                <StatCard
                  icon="📋"
                  value={stats.total}
                  label={t.total}
                />

                <StatCard
                  icon="⏳"
                  value={stats.upcoming}
                  label={t.upcoming}
                />

                <StatCard
                  icon="✅"
                  value={stats.played}
                  label={t.played}
                />

                <StatCard
                  icon="🎯"
                  value={stats.exact}
                  label={t.exact}
                />

                <StatCard
                  icon="⭐"
                  value={stats.points}
                  label={t.points}
                />
              </section>

              <section className="filters">
                <div className="filter-buttons">
                  <FilterButton
                    active={filter === "all"}
                    onClick={() => setFilter("all")}
                    label={t.all}
                  />

                  <FilterButton
                    active={filter === "upcoming"}
                    onClick={() => setFilter("upcoming")}
                    label={`⏳ ${t.upcoming}`}
                  />

                  <FilterButton
                    active={filter === "played"}
                    onClick={() => setFilter("played")}
                    label={`✅ ${t.played}`}
                  />

                  <FilterButton
                    active={filter === "exact"}
                    onClick={() => setFilter("exact")}
                    label={`🎯 ${t.exact}`}
                  />
                </div>

                {availableCompetitions.length > 1 && (
                  <select
                    value={competitionFilter}
                    onChange={(event) =>
                      setCompetitionFilter(event.target.value)
                    }
                  >
                    <option value="all">
                      {t.competition}: {t.all}
                    </option>

                    {availableCompetitions.map((code) => (
                      <option key={code} value={code}>
                        {competitionNames[code] || code}
                      </option>
                    ))}
                  </select>
                )}
              </section>

              {filteredPredictions.length === 0 ? (
                <div className="state-card">{t.noResults}</div>
              ) : (
                <section className="prediction-list">
                  {filteredPredictions.map((prediction) => {
                    const played = isPlayed(prediction);
                    const exact = isExact(prediction);
                    const points = Number(prediction.points || 0);

                    return (
                      <article
                        key={prediction.id}
                        className={`prediction-card ${
                          exact ? "exact-card" : ""
                        }`}
                      >
                        <div className="prediction-top">
                          <div>
                            <span className="competition">
                              {prediction.competition_code
                                ? competitionNames[
                                    prediction.competition_code
                                  ] || prediction.competition_code
                                : "⚽ VoetIQ"}
                            </span>

                            {prediction.kickoff_at && (
                              <span className="date">
                                {formatDate(prediction.kickoff_at)}
                              </span>
                            )}
                          </div>

                          {played ? (
                            <span
                              className={`status ${
                                exact ? "exact-status" : "played-status"
                              }`}
                            >
                              {exact ? `🎯 ${t.exact}` : `✓ ${t.played}`}
                            </span>
                          ) : (
                            <span className="status upcoming-status">
                              ⏳ {t.waiting}
                            </span>
                          )}
                        </div>

                        <h2>{prediction.match_name}</h2>

                        <div className="score-area">
                          <div className="score-block">
                            <span>{t.predicted}</span>
                            <strong>
                              {prediction.home_score} -{" "}
                              {prediction.away_score}
                            </strong>
                          </div>

                          {played && (
                            <>
                              <div className="score-divider">→</div>

                              <div className="score-block">
                                <span>{t.result}</span>
                                <strong>
                                  {prediction.actual_home_score} -{" "}
                                  {prediction.actual_away_score}
                                </strong>
                              </div>
                            </>
                          )}

                          {played && (
                            <div
                              className={`points ${
                                points > 0 ? "points-earned" : ""
                              }`}
                            >
                              +{points} {t.points}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </section>
              )}
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        .predictions-page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(15, 122, 70, 0.2) 0%,
              transparent 32%
            ),
            linear-gradient(
              180deg,
              #00170e 0%,
              #00110a 48%,
              #000d08 100%
            );
          color: white;
          padding: 42px 20px 90px;
        }

        .predictions-container {
          max-width: 1050px;
          margin: 0 auto;
        }

        .hero {
          margin-bottom: 26px;
        }

        .hero-kicker {
          color: #41e58b;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 1.2px;
          margin-bottom: 8px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(30px, 5vw, 44px);
          line-height: 1.1;
        }

        .hero p {
          margin: 12px 0 0;
          max-width: 680px;
          color: #9fb5a9;
          line-height: 1.6;
          font-size: 15px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
          margin-bottom: 22px;
        }

        .filters {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }

        .filter-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        select {
          background: #06271a;
          color: #eaf8f0;
          border: 1px solid rgba(65, 229, 139, 0.2);
          border-radius: 10px;
          padding: 10px 12px;
          font-weight: 800;
          outline: none;
        }

        .prediction-list {
          display: grid;
          gap: 12px;
        }

        .prediction-card {
          background:
            linear-gradient(
              145deg,
              rgba(6, 39, 26, 0.97),
              rgba(0, 23, 14, 0.98)
            );
          border: 1px solid rgba(80, 190, 130, 0.18);
          border-radius: 18px;
          padding: 20px;
          transition:
            transform 0.15s ease,
            border 0.15s ease;
        }

        .prediction-card:hover {
          transform: translateY(-1px);
          border-color: rgba(65, 229, 139, 0.34);
        }

        .exact-card {
          border-color: rgba(250, 204, 21, 0.28);
          background:
            linear-gradient(
              145deg,
              rgba(51, 43, 8, 0.55),
              rgba(0, 23, 14, 0.98)
            );
        }

        .prediction-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .prediction-top > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .competition {
          color: #75dfa4;
          font-size: 11px;
          font-weight: 900;
        }

        .date {
          color: #718b7d;
          font-size: 11px;
          font-weight: 700;
        }

        .prediction-card h2 {
          margin: 17px 0;
          font-size: 20px;
        }

        .status {
          flex-shrink: 0;
          border-radius: 999px;
          padding: 6px 9px;
          font-size: 10px;
          font-weight: 950;
        }

        .upcoming-status {
          background: rgba(59, 130, 246, 0.1);
          color: #93c5fd;
          border: 1px solid rgba(59, 130, 246, 0.18);
        }

        .played-status {
          background: rgba(65, 229, 139, 0.09);
          color: #83e7ae;
          border: 1px solid rgba(65, 229, 139, 0.16);
        }

        .exact-status {
          background: rgba(250, 204, 21, 0.1);
          color: #fde047;
          border: 1px solid rgba(250, 204, 21, 0.2);
        }

        .score-area {
          display: flex;
          align-items: center;
          gap: 16px;
          background: rgba(0, 10, 6, 0.35);
          border-radius: 12px;
          padding: 13px 15px;
        }

        .score-block {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .score-block span {
          color: #799486;
          font-size: 10px;
          font-weight: 850;
        }

        .score-block strong {
          font-size: 20px;
        }

        .score-divider {
          color: #466557;
          font-weight: 900;
        }

        .points {
          margin-left: auto;
          color: #899d92;
          font-size: 14px;
          font-weight: 950;
        }

        .points-earned {
          color: #41e58b;
        }

        .state-card,
        .error-card,
        .empty-card {
          background:
            linear-gradient(
              145deg,
              #06271a 0%,
              #00170e 100%
            );
          border: 1px solid rgba(80, 190, 130, 0.2);
          border-radius: 18px;
          padding: 30px;
          text-align: center;
          color: #a9bbb0;
        }

        .error-card {
          background: #2a1114;
          border-color: rgba(255, 100, 100, 0.25);
          color: #ffb4b4;
        }

        .empty-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .empty-icon {
          font-size: 38px;
        }

        .empty-card button {
          border: 0;
          border-radius: 10px;
          padding: 11px 16px;
          background: #08783e;
          color: white;
          font-weight: 900;
          cursor: pointer;
        }

        @media (max-width: 800px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters {
            align-items: stretch;
            flex-direction: column;
          }

          select {
            width: 100%;
          }
        }

        @media (max-width: 560px) {
          .predictions-page {
            padding: 28px 14px 70px;
          }

          .stats-grid {
            gap: 8px;
          }

          .prediction-card {
            padding: 16px;
          }

          .prediction-card h2 {
            font-size: 17px;
          }

          .score-area {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .points {
            width: 100%;
            margin-left: 0;
            padding-top: 7px;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
          }
        }
      `}</style>
    </>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: number;
  label: string;
}) {
  return (
    <div className="stat-card">
      <span>{icon}</span>
      <strong>{value}</strong>
      <small>{label}</small>

      <style jsx>{`
        .stat-card {
          min-width: 0;
          background:
            linear-gradient(
              145deg,
              rgba(6, 39, 26, 0.98),
              rgba(0, 23, 14, 0.98)
            );
          border: 1px solid rgba(80, 190, 130, 0.18);
          border-radius: 15px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        span {
          font-size: 18px;
          margin-bottom: 3px;
        }

        strong {
          font-size: 24px;
          line-height: 1;
          color: white;
        }

        small {
          margin-top: 3px;
          color: #81998c;
          font-size: 10px;
          font-weight: 850;
        }
      `}</style>
    </div>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "filter active" : "filter"}
    >
      {label}

      <style jsx>{`
        .filter {
          border: 1px solid rgba(80, 190, 130, 0.18);
          background: #06271a;
          color: #9eb5a9;
          border-radius: 9px;
          padding: 9px 12px;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .filter:hover {
          color: white;
          border-color: rgba(65, 229, 139, 0.35);
        }

        .filter.active {
          background: #08783e;
          color: white;
          border-color: #159858;
        }
      `}</style>
    </button>
  );
}
