"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "../Navbar";

type Player = {
  username: string;
  total_points: number;
};

export default function Ranglijst() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    const { data, error } = await supabase.rpc("get_leaderboard");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const leaderboard = (data || []).map(
      (player: {
        username: string;
        total_points: number;
      }) => ({
        username: player.username,
        total_points: Number(player.total_points),
      })
    );

    setPlayers(leaderboard);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-gray-950 text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex rounded-full bg-green-500/10 px-4 py-2 text-sm font-semibold text-green-300 ring-1 ring-green-400/20">
            🏆 VoetIQ
          </div>

          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            Ranglijst
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-green-100/70">
            Bekijk wie de meeste punten heeft verzameld met zijn
            voetbalvoorspellingen.
          </p>
        </div>

        <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur">
          <div className="grid grid-cols-[70px_1fr_120px] bg-green-600/90 px-5 py-4 text-sm font-bold uppercase tracking-wide">
            <span>#</span>
            <span>Speler</span>
            <span className="text-right">Punten</span>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-green-100/70">
              Ranglijst laden...
            </div>
          ) : players.length === 0 ? (
            <div className="px-6 py-12 text-center text-green-100/70">
              Er zijn nog geen spelers op de ranglijst.
            </div>
          ) : (
            players.map((player, index) => (
              <div
                key={player.username}
                className={
                  "grid grid-cols-[70px_1fr_120px] items-center px-5 py-5 transition " +
                  (index < 3
                    ? "bg-white/10"
                    : "border-t border-white/5")
                }
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
                      Leider van de ranglijst
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <span className="font-black text-green-300">
```
