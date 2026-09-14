"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Player = {
  name: string;
  points: number;
};

export default function Ranglijst() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  async function loadLeaderboard() {
    const { data, error } = await supabase
      .from("predictions")
      .select("player_name, points");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const totals: Record<string, number> = {};

    data.forEach((prediction) => {
      const name = prediction.player_name || "Gast";
      totals[name] = (totals[name] || 0) + (prediction.points || 0);
    });

    const leaderboard = Object.entries(totals)
      .map(([name, points]) => ({
        name,
        points,
      }))
      .sort((a, b) => b.points - a.points);

    setPlayers(leaderboard);
    setLoading(false);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7f6",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#0b8f4d",
          color: "white",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>VoetIQ</h1>

          <nav style={{ display: "flex", gap: "20px" }}>
            <a
              href="/"
              style={{ color: "white", textDecoration: "none" }}
            >
              Home
            </a>

            <a
              href="/wedstrijden"
              style={{ color: "white", textDecoration: "none" }}
            >
              Wedstrijden
            </a>

            <a
              href="/ranglijst"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Ranglijst
            </a>
          </nav>
        </div>
      </header>

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "50px 20px",
        }}
      >
        <h2 style={{ fontSize: "36px", marginBottom: "10px" }}>
          🏆 Ranglijst
        </h2>

        <p style={{ color: "#666", marginBottom: "30px" }}>
          Wie scoort de meeste punten?
        </p>

        <div
          style={{
            background: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "80px 1fr 120px",
              padding: "18px 20px",
              background: "#0b8f4d",
              color: "white",
              fontWeight: "bold",
            }}
          >
            <span>#</span>
            <span>Speler</span>
            <span>Punten</span>
          </div>

          {loading ? (
            <div style={{ padding: "25px", textAlign: "center" }}>
              Ranglijst laden...
            </div>
          ) : players.length === 0 ? (
            <div style={{ padding: "25px", textAlign: "center" }}>
              Nog geen spelers op de ranglijst.
            </div>
          ) : (
            players.map((player, index) => (
              <div
                key={player.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "80px 1fr 120px",
                  padding: "18px 20px",
                  borderBottom: "1px solid #eee",
                  alignItems: "center",
                }}
              >
                <strong>
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : index + 1}
                </strong>

                <span>{player.name}</span>

                <strong>{player.points} punten</strong>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
