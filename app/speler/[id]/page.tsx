"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../Navbar";
import { supabase } from "@/lib/supabase";

type PublicProfile = {
  user_id: string;
  username: string;
  total_points: number;
  predictions_count: number;
  exact_scores: number;
  correct_results: number;
};

export default function PublicPlayerProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const userId = parts[1];

    if (!userId) {
      setError("Deze speler kon niet worden gevonden.");
      setLoading(false);
      return;
    }

    loadProfile(userId);
  }, []);

  async function loadProfile(userId: string) {
    setLoading(true);
    setError("");

    const { data, error: profileError } = await supabase.rpc(
      "get_public_profile",
      {
        requested_user_id: userId,
      }
    );

    if (profileError) {
      console.error(profileError);
      setError("Het spelersprofiel kon niet worden geladen.");
      setLoading(false);
      return;
    }

    const player = data?.[0] as PublicProfile | undefined;

    if (!player) {
      setError("Deze speler heeft nog geen openbaar VoetIQ-profiel.");
      setLoading(false);
      return;
    }

    setProfile(player);
    setLoading(false);
  }

  const averagePoints =
    profile && profile.predictions_count > 0
      ? (profile.total_points / profile.predictions_count).toFixed(1)
      : "0.0";

  const correctPercentage =
    profile && profile.predictions_count > 0
      ? Math.round(
          (profile.correct_results / profile.predictions_count) * 100
        )
      : 0;

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 50% 0%, rgba(15,122,70,0.20) 0%, transparent 32%), linear-gradient(180deg, #00170e 0%, #00110a 48%, #000d08 100%)",
          color: "white",
          padding: "38px 20px 80px",
        }}
      >
        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={() => router.back()}
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
            ← Terug
          </button>

          {loading ? (
            <section style={cardStyle}>
              <div style={{ color: "#a9bbb0" }}>
                Spelersprofiel laden...
              </div>
            </section>
          ) : error || !profile ? (
            <section
              style={{
                ...cardStyle,
                border: "1px solid rgba(255,100,100,0.22)",
              }}
            >
              <div
                style={{
                  color: "#ffb4b4",
                  fontWeight: 800,
                }}
              >
                {error || "Deze speler kon niet worden gevonden."}
              </div>
            </section>
          ) : (
            <>
              <section
                style={{
                  ...cardStyle,
                  padding: "30px",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "18px",
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      width: "74px",
                      height: "74px",
                      borderRadius: "50%",
                      background: "#0b3523",
                      border: "2px solid rgba(65,229,139,0.28)",
                      display: "grid",
                      placeItems: "center",
                      color: "#41e58b",
                      fontSize: "30px",
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    {profile.username.slice(0, 1).toUpperCase()}
                  </div>

                  <div>
                    <div
                      style={{
                        color: "#83e7ae",
                        fontSize: "12px",
                        fontWeight: 900,
                        letterSpacing: "1px",
                        marginBottom: "6px",
                      }}
                    >
                      VOETIQ SPELER
                    </div>

                    <h1
                      style={{
                        margin: 0,
                        fontSize: "34px",
                        lineHeight: 1.15,
                      }}
                    >
                      {profile.username}
                    </h1>

                    <p
                      style={{
                        margin: "8px 0 0",
                        color: "#a9bbb0",
                        fontSize: "14px",
                      }}
                    >
                      Openbaar spelersprofiel
                    </p>
                  </div>
                </div>
              </section>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(180px, 1fr))",
                  gap: "14px",
                  marginBottom: "18px",
                }}
              >
                <StatCard
                  icon="🏆"
                  value={profile.total_points}
                  label="Totaal punten"
                />

                <StatCard
                  icon="⚽"
                  value={profile.predictions_count}
                  label="Voorspellingen"
                />

                <StatCard
                  icon="🎯"
                  value={profile.exact_scores}
                  label="Exacte scores"
                />

                <StatCard
                  icon="✅"
                  value={profile.correct_results}
                  label="Juiste uitslagen"
                />
              </div>

              <section style={cardStyle}>
                <h2
                  style={{
                    margin: "0 0 18px",
                    fontSize: "22px",
                  }}
                >
                  📊 Statistieken
                </h2>

                <StatRow
                  label="Gemiddeld aantal punten per voorspelling"
                  value={averagePoints}
                />

                <StatRow
                  label="Juiste uitslagen"
                  value={`${correctPercentage}%`}
                />

                <StatRow
                  label="Exacte scores"
                  value={String(profile.exact_scores)}
                  last
                />
              </section>
            </>
          )}
        </div>
      </main>
    </>
  );
}

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
  border: "1px solid rgba(80,190,130,0.20)",
  borderRadius: "20px",
  padding: "24px",
};

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
    <div style={cardStyle}>
      <div
        style={{
          fontSize: "22px",
          marginBottom: "8px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: "25px",
          fontWeight: 900,
          color: "white",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#a9bbb0",
          fontSize: "12px",
          marginTop: "4px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

function StatRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "20px",
        padding: "14px 0",
        borderBottom: last
          ? "none"
          : "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <span
        style={{
          color: "#a9bbb0",
          fontSize: "14px",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#41e58b",
          fontSize: "16px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}
