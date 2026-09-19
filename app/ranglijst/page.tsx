"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "../Navbar";

type Player = {
  user_id?: string;
  username: string;
  total_points: number;
  predictions_count?: number;
  exact_scores?: number;
};

type Competition = {
  code: string;
  name: string;
  icon: string;
  matchdays?: number;
};

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Translation = {
  general: string;
  title: string;
  subtitle: string;
  choose: string;
  chooseRound: string;
  total: string;
  round: string;
  matchday: string;
  current: string;
  allCompetitions: string;
  allFrom: string;
  onlyRound: string;
  player: string;
  exact: string;
  predicted: string;
  points: string;
  loading: string;
  retry: string;
  empty: string;
  leader: string;
  predictions: string;
  allTip: string;
  compTip: string;
  roundTip: string;
  generalError: string;
  roundError: string;
  compError: string;
};

const ui: Record<LanguageCode, Translation> = {
  nl: {
    general: "Algemeen",
    title: "Ranglijst",
    subtitle:
      "Bekijk wie de meeste punten heeft verzameld met zijn voetbalvoorspellingen.",
    choose: "Kies een klassement",
    chooseRound: "Kies totaal of speelronde",
    total: "Totaal",
    round: "Speelronde",
    matchday: "Speelronde",
    current: "Huidig klassement",
    allCompetitions: "Punten uit alle competities",
    allFrom: "Alle punten uit",
    onlyRound: "Alleen speelronde",
    player: "Speler",
    exact: "Exact",
    predicted: "Voorspeld",
    points: "Punten",
    loading: "Ranglijst laden...",
    retry: "Opnieuw proberen",
    empty: "Er zijn nog geen spelers op deze ranglijst.",
    leader: "Leider van het klassement",
    predictions: "voorspellingen",
    allTip:
      "💡 Dit klassement telt je punten uit alle VoetIQ-competities bij elkaar op.",
    compTip:
      "💡 In dit klassement tellen alle voorspellingen uit {competition} mee.",
    roundTip:
      "💡 Dit klassement telt alleen voorspellingen uit {competition}, speelronde {round}.",
    generalError: "De algemene ranglijst kon niet worden geladen.",
    roundError: "De ranglijst van deze speelronde kon niet worden geladen.",
    compError: "De ranglijst van deze competitie kon niet worden geladen.",
  },

  en: {
    general: "Overall",
    title: "Leaderboard",
    subtitle:
      "See who has earned the most points with their football predictions.",
    choose: "Choose a leaderboard",
    chooseRound: "Choose overall or matchday",
    total: "Overall",
    round: "Matchday",
    matchday: "Matchday",
    current: "Current leaderboard",
    allCompetitions: "Points from all competitions",
    allFrom: "All points from",
    onlyRound: "Matchday only",
    player: "Player",
    exact: "Exact",
    predicted: "Predicted",
    points: "Points",
    loading: "Loading leaderboard...",
    retry: "Try again",
    empty: "There are no players on this leaderboard yet.",
    leader: "Leaderboard leader",
    predictions: "predictions",
    allTip:
      "💡 This leaderboard combines your points from all VoetIQ competitions.",
    compTip:
      "💡 All predictions from {competition} count towards this leaderboard.",
    roundTip:
      "💡 This leaderboard only counts predictions from {competition}, matchday {round}.",
    generalError: "The overall leaderboard could not be loaded.",
    roundError: "The leaderboard for this matchday could not be loaded.",
    compError: "The leaderboard for this competition could not be loaded.",
  },

  de: {
    general: "Gesamt",
    title: "Rangliste",
    subtitle:
      "Sieh, wer mit seinen Fußballtipps die meisten Punkte gesammelt hat.",
    choose: "Rangliste auswählen",
    chooseRound: "Gesamt oder Spieltag wählen",
    total: "Gesamt",
    round: "Spieltag",
    matchday: "Spieltag",
    current: "Aktuelle Rangliste",
    allCompetitions: "Punkte aus allen Wettbewerben",
    allFrom: "Alle Punkte aus",
    onlyRound: "Nur Spieltag",
    player: "Spieler",
    exact: "Exakt",
    predicted: "Getippt",
    points: "Punkte",
    loading: "Rangliste wird geladen...",
    retry: "Erneut versuchen",
    empty: "Noch keine Spieler in dieser Rangliste.",
    leader: "Führender der Rangliste",
    predictions: "Tipps",
    allTip:
      "💡 Diese Rangliste addiert deine Punkte aus allen VoetIQ-Wettbewerben.",
    compTip:
      "💡 In dieser Rangliste zählen alle Tipps aus {competition}.",
    roundTip:
      "💡 Diese Rangliste zählt nur Tipps aus {competition}, Spieltag {round}.",
    generalError: "Die Gesamtrangliste konnte nicht geladen werden.",
    roundError: "Die Rangliste dieses Spieltags konnte nicht geladen werden.",
    compError: "Die Rangliste dieses Wettbewerbs konnte nicht geladen werden.",
  },

  es: {
    general: "General",
    title: "Clasificación",
    subtitle:
      "Descubre quién ha conseguido más puntos con sus pronósticos de fútbol.",
    choose: "Elige una clasificación",
    chooseRound: "Elige total o jornada",
    total: "Total",
    round: "Jornada",
    matchday: "Jornada",
    current: "Clasificación actual",
    allCompetitions: "Puntos de todas las competiciones",
    allFrom: "Todos los puntos de",
    onlyRound: "Solo jornada",
    player: "Jugador",
    exact: "Exactos",
    predicted: "Pronósticos",
    points: "Puntos",
    loading: "Cargando clasificación...",
    retry: "Intentar de nuevo",
    empty: "Todavía no hay jugadores en esta clasificación.",
    leader: "Líder de la clasificación",
    predictions: "pronósticos",
    allTip:
      "💡 Esta clasificación suma tus puntos de todas las competiciones de VoetIQ.",
    compTip:
      "💡 En esta clasificación cuentan todos los pronósticos de {competition}.",
    roundTip:
      "💡 Esta clasificación solo cuenta los pronósticos de {competition}, jornada {round}.",
    generalError: "No se ha podido cargar la clasificación general.",
    roundError: "No se ha podido cargar la clasificación de esta jornada.",
    compError: "No se ha podido cargar la clasificación de esta competición.",
  },

  fr: {
    general: "Général",
    title: "Classement",
    subtitle:
      "Découvrez qui a obtenu le plus de points grâce à ses pronostics de football.",
    choose: "Choisir un classement",
    chooseRound: "Choisir le total ou la journée",
    total: "Total",
    round: "Journée",
    matchday: "Journée",
    current: "Classement actuel",
    allCompetitions: "Points de toutes les compétitions",
    allFrom: "Tous les points de",
    onlyRound: "Journée uniquement",
    player: "Joueur",
    exact: "Exacts",
    predicted: "Pronostics",
    points: "Points",
    loading: "Chargement du classement...",
    retry: "Réessayer",
    empty: "Il n’y a encore aucun joueur dans ce classement.",
    leader: "Leader du classement",
    predictions: "pronostics",
    allTip:
      "💡 Ce classement additionne vos points de toutes les compétitions VoetIQ.",
    compTip:
      "💡 Tous les pronostics de {competition} comptent dans ce classement.",
    roundTip:
      "💡 Ce classement compte uniquement les pronostics de {competition}, journée {round}.",
    generalError: "Le classement général n’a pas pu être chargé.",
    roundError: "Le classement de cette journée n’a pas pu être chargé.",
    compError: "Le classement de cette compétition n’a pas pu être chargé.",
  },

  it: {
    general: "Generale",
    title: "Classifica",
    subtitle:
      "Scopri chi ha conquistato più punti con i propri pronostici calcistici.",
    choose: "Scegli una classifica",
    chooseRound: "Scegli totale o giornata",
    total: "Totale",
    round: "Giornata",
    matchday: "Giornata",
    current: "Classifica attuale",
    allCompetitions: "Punti di tutte le competizioni",
    allFrom: "Tutti i punti di",
    onlyRound: "Solo giornata",
    player: "Giocatore",
    exact: "Esatti",
    predicted: "Pronostici",
    points: "Punti",
    loading: "Caricamento classifica...",
    retry: "Riprova",
    empty: "Non ci sono ancora giocatori in questa classifica.",
    leader: "Leader della classifica",
    predictions: "pronostici",
    allTip:
      "💡 Questa classifica somma i tuoi punti di tutte le competizioni VoetIQ.",
    compTip:
      "💡 In questa classifica contano tutti i pronostici di {competition}.",
    roundTip:
      "💡 Questa classifica conta solo i pronostici di {competition}, giornata {round}.",
    generalError: "Non è stato possibile caricare la classifica generale.",
    roundError:
      "Non è stato possibile caricare la classifica di questa giornata.",
    compError:
      "Non è stato possibile caricare la classifica di questa competizione.",
  },

  pt: {
    general: "Geral",
    title: "Classificação",
    subtitle:
      "Vê quem conquistou mais pontos com as suas previsões de futebol.",
    choose: "Escolhe uma classificação",
    chooseRound: "Escolhe total ou jornada",
    total: "Total",
    round: "Jornada",
    matchday: "Jornada",
    current: "Classificação atual",
    allCompetitions: "Pontos de todas as competições",
    allFrom: "Todos os pontos de",
    onlyRound: "Apenas jornada",
    player: "Jogador",
    exact: "Exatos",
    predicted: "Previsões",
    points: "Pontos",
    loading: "A carregar classificação...",
    retry: "Tentar novamente",
    empty: "Ainda não há jogadores nesta classificação.",
    leader: "Líder da classificação",
    predictions: "previsões",
    allTip:
      "💡 Esta classificação soma os teus pontos de todas as competições VoetIQ.",
    compTip:
      "💡 Nesta classificação contam todas as previsões de {competition}.",
    roundTip:
      "💡 Esta classificação conta apenas as previsões de {competition}, jornada {round}.",
    generalError: "Não foi possível carregar a classificação geral.",
    roundError: "Não foi possível carregar a classificação desta jornada.",
    compError: "Não foi possível carregar a classificação desta competição.",
  },
};

function isLanguageCode(value: string): value is LanguageCode {
  return ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value);
}

const competitions: Competition[] = [
  { code: "ALL", name: "Algemeen", icon: "🌍" },
  { code: "DED", name: "Eredivisie", icon: "🇳🇱", matchdays: 34 },
  { code: "PL", name: "Premier League", icon: "🏴", matchdays: 38 },
  { code: "PD", name: "La Liga", icon: "🇪🇸", matchdays: 38 },
  { code: "BL1", name: "Bundesliga", icon: "🇩🇪", matchdays: 34 },
  { code: "SA", name: "Serie A", icon: "🇮🇹", matchdays: 38 },
  { code: "FL1", name: "Ligue 1", icon: "🇫🇷", matchdays: 34 },
  { code: "PPL", name: "Primeira Liga", icon: "🇵🇹", matchdays: 34 },
  { code: "CL", name: "Champions League", icon: "🏆", matchdays: 8 },
];

export default function Ranglijst() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCompetition, setSelectedCompetition] = useState("ALL");
  const [selectedMatchday, setSelectedMatchday] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [errorMessage, setErrorMessage] = useState("");

  const t = ui[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("voetiq-language");
    const initial: LanguageCode =
      saved && isLanguageCode(saved) ? saved : "nl";

    setLanguage(initial);
    document.documentElement.lang = initial;

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const next = customEvent.detail?.language;

      if (next && isLanguageCode(next)) {
        setLanguage(next);
        document.documentElement.lang = next;
      }
    }

    window.addEventListener(
      "voetiq-language-change",
      handleLanguageChange
    );

    return () =>
      window.removeEventListener(
        "voetiq-language-change",
        handleLanguageChange
      );
  }, []);

  useEffect(() => {
    loadLeaderboard();
  }, [selectedCompetition, selectedMatchday, language]);

  useEffect(() => {
    function refreshLeaderboard() {
      if (document.visibilityState === "visible") {
        loadLeaderboard();
      }
    }

    window.addEventListener("focus", refreshLeaderboard);
    document.addEventListener("visibilitychange", refreshLeaderboard);

    return () => {
      window.removeEventListener("focus", refreshLeaderboard);
      document.removeEventListener("visibilitychange", refreshLeaderboard);
    };
  }, [selectedCompetition, selectedMatchday, language]);

  async function loadLeaderboard() {
    setLoading(true);
    setErrorMessage("");

    if (selectedCompetition === "ALL") {
      const { data, error } = await supabase.rpc("get_leaderboard");

      if (error) {
        console.error("Ranglijst fout:", error);
        setErrorMessage(ui[language].generalError);
        setLoading(false);
        return;
      }

      const generalRows = data || [];

      const usernames = generalRows.map(
        (player: { username: string }) => player.username
      );

      const { data: profiles } =
        usernames.length > 0
          ? await supabase
              .from("profiles")
              .select("id, username")
              .in("username", usernames)
          : { data: [] };

      const profileIds = new Map(
        (profiles || []).map((profile) => [
          profile.username,
          profile.id,
        ])
      );

      const leaderboard: Player[] = generalRows.map(
        (player: {
          username: string;
          total_points: number;
        }) => ({
          user_id: profileIds.get(player.username),
          username: player.username,
          total_points: Number(player.total_points) || 0,
        })
      );

      setPlayers(leaderboard);
      setLoading(false);
      return;
    }

    if (selectedMatchday !== null) {
      const { data, error } = await supabase.rpc(
        "get_matchday_leaderboard",
        {
          selected_competition: selectedCompetition,
          selected_matchday: selectedMatchday,
        }
      );

      if (error) {
        console.error("Speelronderanglijst fout:", error);
        setErrorMessage(ui[language].roundError);
        setLoading(false);
        return;
      }

      setPlayers(mapCompetitionPlayers(data));
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc(
      "get_competition_leaderboard",
      {
        selected_competition: selectedCompetition,
      }
    );

    if (error) {
      console.error("Competitieranglijst fout:", error);
      setErrorMessage(ui[language].compError);
      setLoading(false);
      return;
    }

    setPlayers(mapCompetitionPlayers(data));
    setLoading(false);
  }

  function mapCompetitionPlayers(data: unknown): Player[] {
    const rows = Array.isArray(data) ? data : [];

    return rows.map(
      (player: {
        user_id: string;
        username: string;
        total_points: number;
        predictions_count: number;
        exact_scores: number;
      }): Player => ({
        user_id: player.user_id,
        username: player.username,
        total_points: Number(player.total_points) || 0,
        predictions_count: Number(player.predictions_count) || 0,
        exact_scores: Number(player.exact_scores) || 0,
      })
    );
  }

  function selectCompetition(code: string) {
    setSelectedCompetition(code);
    setSelectedMatchday(null);
  }

  const selected =
    competitions.find(
      (competition) => competition.code === selectedCompetition
    ) || competitions[0];

  const matchdayOptions =
    selected.matchdays && selectedCompetition !== "ALL"
      ? Array.from(
          { length: selected.matchdays },
          (_, index) => index + 1
        )
      : [];

  const isCompetition = selectedCompetition !== "ALL";

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-gray-950 text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 ring-1 ring-green-400/20">
            🏆 VoetIQ
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            {t.title}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-green-100/70">
            {t.subtitle}
          </p>
        </div>

        <div className="mx-auto mb-7 max-w-6xl">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-green-300">
            {t.choose}
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {competitions.map((competition) => {
              const active =
                selectedCompetition === competition.code;

              return (
                <button
                  key={competition.code}
                  onClick={() =>
                    selectCompetition(competition.code)
                  }
                  className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
                    active
                      ? "border-green-400 bg-green-500 text-green-950 shadow-lg shadow-green-950/30"
                      : "border-white/10 bg-white/5 text-green-100/70 hover:border-green-400/30 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="mr-2">
                    {competition.icon}
                  </span>

                  {competition.code === "ALL"
                    ? t.general
                    : competition.name}
                </button>
              );
            })}
          </div>
        </div>

        {isCompetition && (
          <div className="mx-auto mb-7 max-w-4xl">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-green-300">
              {t.chooseRound}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedMatchday(null)}
                className={`shrink-0 rounded-xl border px-5 py-3 text-sm font-black transition ${
                  selectedMatchday === null
                    ? "border-green-400 bg-green-500 text-green-950"
                    : "border-white/10 bg-white/5 text-green-100/70 hover:bg-white/10"
                }`}
              >
                🏆 {t.total}
              </button>

              <div className="flex flex-1 gap-2 overflow-x-auto pb-2">
                {matchdayOptions.map((matchday) => (
                  <button
                    key={matchday}
                    onClick={() =>
                      setSelectedMatchday(matchday)
                    }
                    className={`shrink-0 rounded-xl border px-4 py-3 text-sm font-bold transition ${
                      selectedMatchday === matchday
                        ? "border-green-400 bg-green-500 text-green-950"
                        : "border-white/10 bg-white/5 text-green-100/70 hover:border-green-400/30 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {t.round} {matchday}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto mb-4 max-w-4xl">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-green-300">
                {t.current}
              </p>

              <h2 className="mt-1 text-xl font-black">
                {selected.icon}{" "}
                {selected.code === "ALL"
                  ? t.general
                  : selected.name}

                {selectedMatchday !== null && (
                  <span className="text-green-300">
                    {" "}
                    · {t.matchday} {selectedMatchday}
                  </span>
                )}
              </h2>
            </div>

            <div className="text-sm text-green-100/60">
              {selectedCompetition === "ALL"
                ? t.allCompetitions
                : selectedMatchday === null
                ? `${t.allFrom} ${selected.name}`
                : `${t.onlyRound} ${selectedMatchday}`}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <div
            className={`grid px-5 py-4 text-sm font-bold uppercase tracking-wide ${
              selectedCompetition === "ALL"
                ? "grid-cols-[60px_1fr_120px] bg-green-600/90 sm:grid-cols-[80px_1fr_140px]"
                : "grid-cols-[55px_1fr_90px_90px_110px] bg-green-600/90"
            }`}
          >
            <span>#</span>
            <span>{t.player}</span>

            {selectedCompetition !== "ALL" && (
              <>
                <span className="text-center">
                  {t.exact}
                </span>

                <span className="text-center">
                  {t.predicted}
                </span>
              </>
            )}

            <span className="text-right">
              {t.points}
            </span>
          </div>

          {loading && (
            <div className="px-6 py-12 text-center text-green-100/70">
              {t.loading}
            </div>
          )}

          {!loading && errorMessage && (
            <div className="px-6 py-12 text-center">
              <p className="font-semibold text-red-300">
                {errorMessage}
              </p>

              <button
                onClick={loadLeaderboard}
                className="mt-4 rounded-lg bg-green-600 px-5 py-2 font-semibold text-white transition hover:bg-green-500"
              >
                {t.retry}
              </button>
            </div>
          )}

          {!loading &&
            !errorMessage &&
            players.length === 0 && (
              <div className="px-6 py-12 text-center text-green-100/70">
                {t.empty}
              </div>
            )}

          {!loading &&
            !errorMessage &&
            players.length > 0 &&
            players.map((player, index) => (
              <div
                key={player.user_id || player.username}
                className={`grid items-center px-5 py-5 transition ${
                  selectedCompetition === "ALL"
                    ? "grid-cols-[60px_1fr_120px] sm:grid-cols-[80px_1fr_140px]"
                    : "grid-cols-[55px_1fr_90px_90px_110px]"
                } ${
                  index < 3
                    ? "bg-white/10"
                    : "border-t border-white/5"
                }`}
              >
                <div className="text-xl font-bold">
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : index + 1}
                </div>

                <div>
                  {player.user_id ? (
                    <button
                      onClick={() => router.push(`/speler/${player.user_id}`)}
                      className="font-bold text-green-300 transition hover:text-green-200 hover:underline"
                    >
                      {player.username}
                    </button>
                  ) : (
                    <p className="font-bold text-white">
                      {player.username}
                    </p>
                  )}

                  {index === 0 && (
                    <p className="mt-1 text-xs font-medium text-yellow-300">
                      {t.leader}
                    </p>
                  )}
                </div>

                {selectedCompetition !== "ALL" && (
                  <>
                    <div className="text-center">
                      <div className="font-black text-white">
                        {player.exact_scores || 0}
                      </div>

                      <div className="mt-1 text-[10px] text-green-100/40">
                        {t.exact.toLowerCase()}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-black text-white">
                        {player.predictions_count || 0}
                      </div>

                      <div className="mt-1 text-[10px] text-green-100/40">
                        {t.predictions}
                      </div>
                    </div>
                  </>
                )}

                <div className="text-right">
                  <span className="font-black text-green-300">
                    {player.total_points}
                  </span>

                  <span className="ml-1 text-sm text-green-100/60">
                    {t.points.toLowerCase()}
                  </span>
                </div>
              </div>
            ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-sm leading-6 text-green-100/60">
            {selectedCompetition === "ALL"
              ? t.allTip
              : selectedMatchday === null
              ? t.compTip.replace(
                  "{competition}",
                  selected.name
                )
              : t.roundTip
                  .replace("{competition}", selected.name)
                  .replace(
                    "{round}",
                    String(selectedMatchday)
                  )}
          </p>
        </div>
      </section>
    </main>
  );
}
