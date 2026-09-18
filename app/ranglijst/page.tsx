"use client";

import { useEffect, useState } from "react";
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
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedCompetition, setSelectedCompetition] =
    useState("ALL");

  const [selectedMatchday, setSelectedMatchday] =
    useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadLeaderboard();
  }, [selectedCompetition, selectedMatchday]);

  async function loadLeaderboard() {
    setLoading(true);
    setErrorMessage("");

    if (selectedCompetition === "ALL") {
      const { data, error } =
        await supabase.rpc("get_leaderboard");

      if (error) {
        console.error("Ranglijst fout:", error);
        setErrorMessage(
          "De algemene ranglijst kon niet worden geladen."
        );
        setLoading(false);
        return;
      }

      const leaderboard: Player[] = (data || []).map(
        (player: {
          username: string;
          total_points: number;
        }) => ({
          username: player.username,
          total_points:
            Number(player.total_points) || 0,
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
        console.error(
          "Speelronderanglijst fout:",
          error
        );

        setErrorMessage(
          "De ranglijst van deze speelronde kon niet worden geladen."
        );

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

      setErrorMessage(
        "De ranglijst van deze competitie kon niet worden geladen."
      );

      setLoading(false);
      return;
    }

    setPlayers(mapCompetitionPlayers(data));
    setLoading(false);
  }

  function mapCompetitionPlayers(data: unknown) {
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
        total_points:
          Number(player.total_points) || 0,
        predictions_count:
          Number(player.predictions_count) || 0,
        exact_scores:
          Number(player.exact_scores) || 0,
      })
    );
  }

  function selectCompetition(code: string) {
    setSelectedCompetition(code);
    setSelectedMatchday(null);
  }

  const selected =
    competitions.find(
      (competition) =>
        competition.code === selectedCompetition
    ) || competitions[0];

  const matchdayOptions =
    selected.matchdays && selectedCompetition !== "ALL"
      ? Array.from(
          { length: selected.matchdays },
          (_, index) => index + 1
        )
      : [];

  const isCompetition =
    selectedCompetition !== "ALL";

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-gray-950 text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 ring-1 ring-green-400/20">
            🏆 VoetIQ
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Ranglijst
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-green-100/70">
            Bekijk wie de meeste punten heeft verzameld
            met zijn voetbalvoorspellingen.
          </p>
        </div>

        <div className="mx-auto mb-7 max-w-6xl">
          <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-green-300">
            Kies een klassement
          </p>

          <div className="flex flex-wrap justify-center gap-2">
            {competitions.map((competition) => {
              const active =
                selectedCompetition === competition.code;

              return (
                <button
                  key={competition.code}
                  onClick={() =>
                    selectCompetition(
                      competition.code
                    )
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

                  {competition.name}
                </button>
              );
            })}
          </div>
        </div>

        {isCompetition && (
          <div className="mx-auto mb-7 max-w-4xl">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-green-300">
              Kies totaal of speelronde
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  setSelectedMatchday(null)
                }
                className={`shrink-0 rounded-xl border px-5 py-3 text-sm font-black transition ${
                  selectedMatchday === null
                    ? "border-green-400 bg-green-500 text-green-950"
                    : "border-white/10 bg-white/5 text-green-100/70 hover:bg-white/10"
                }`}
              >
                🏆 Totaal
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
                    Ronde {matchday}
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
                Huidig klassement
              </p>

              <h2 className="mt-1 text-xl font-black">
                {selected.icon} {selected.name}

                {selectedMatchday !== null && (
                  <span className="text-green-300">
                    {" "}
                    · Speelronde {selectedMatchday}
                  </span>
                )}
              </h2>
            </div>

            <div className="text-sm text-green-100/60">
              {selectedCompetition === "ALL"
                ? "Punten uit alle competities"
                : selectedMatchday === null
                ? `Alle punten uit ${selected.name}`
                : `Alleen speelronde ${selectedMatchday}`}
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
            <span>Speler</span>

            {selectedCompetition !== "ALL" && (
              <>
                <span className="text-center">
                  Exact
                </span>

                <span className="text-center">
                  Voorspeld
                </span>
              </>
            )}

            <span className="text-right">
              Punten
            </span>
          </div>

          {loading && (
            <div className="px-6 py-12 text-center text-green-100/70">
              Ranglijst laden...
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
                Opnieuw proberen
              </button>
            </div>
          )}

          {!loading &&
            !errorMessage &&
            players.length === 0 && (
              <div className="px-6 py-12 text-center text-green-100/70">
                Er zijn nog geen spelers op deze
                ranglijst.
              </div>
            )}

          {!loading &&
            !errorMessage &&
            players.length > 0 &&
            players.map((player, index) => (
              <div
                key={
                  player.user_id ||
                  player.username
                }
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
                  <p className="font-bold text-white">
                    {player.username}
                  </p>

                  {index === 0 && (
                    <p className="mt-1 text-xs font-medium text-yellow-300">
                      Leider van het klassement
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
                        exact
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="font-black text-white">
                        {player.predictions_count || 0}
                      </div>

                      <div className="mt-1 text-[10px] text-green-100/40">
                        voorspellingen
                      </div>
                    </div>
                  </>
                )}

                <div className="text-right">
                  <span className="font-black text-green-300">
                    {player.total_points}
                  </span>

                  <span className="ml-1 text-sm text-green-100/60">
                    punten
                  </span>
                </div>
              </div>
            ))}
        </div>

        <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-sm leading-6 text-green-100/60">
            {selectedCompetition === "ALL"
              ? "💡 Dit klassement telt je punten uit alle VoetIQ-competities bij elkaar op."
              : selectedMatchday === null
              ? `💡 In dit klassement tellen alle voorspellingen uit ${selected.name} mee.`
              : `💡 Dit klassement telt alleen voorspellingen uit ${selected.name}, speelronde ${selectedMatchday}.`}
          </p>
        </div>
      </section>
    </main>
  );
}
