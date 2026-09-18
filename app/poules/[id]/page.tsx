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
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const parts = window.location.pathname
      .split("/")
      .filter(Boolean);

    const id = parts[1];

    if (!id) {
      setErrorMessage("Deze poule kon niet worden gevonden.");
      setLoading(false);
      return;
    }

    setPoolId(id);
    loadPool(id);
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
        "De gegevens van deze poule konden niet worden geladen."
      );
      setLoading(false);
      return;
    }

    if (!poolData) {
      setErrorMessage(
        "Deze poule bestaat niet of je hebt geen toegang."
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
        "Het pouleklassement kon niet worden geladen."
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

  function getMedal(index: number) {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";

    return `${index + 1}.`;
  }

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
            <p>Poule wordt geladen...</p>
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
                "Deze poule kon niet worden geladen."}
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
              ← Terug naar mijn poules
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
            ← Mijn poules
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
                  VOETIQ POULE
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
                  UITNODIGINGSCODE
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
                  {copied
                    ? "✓ Gekopieerd"
                    : "Code kopiëren"}
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
                leaderboard.length === 1
                  ? "Deelnemer"
                  : "Deelnemers"
              }
            />

            <StatCard
              icon="⚽"
              value={competition.name}
              label="Competitie"
            />

            <StatCard
              icon="🎯"
              value="10 / 5 / 0"
              label="Puntensysteem"
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
              ⚽ Voorspel wedstrijden
            </button>

            <button
              onClick={copyInviteCode}
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
              🔗 Vrienden uitnodigen
            </button>
          </div>

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
                🏆 Pouleklassement
              </h2>

              <p
                style={{
                  margin: "6px 0 0",
                  color: "#738078",
                  fontSize: "14px",
                }}
              >
                Alleen punten uit {competition.name} tellen
                mee voor deze poule.
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
                Er zijn nog geen deelnemers in deze poule.
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
                      {player.predictions_count} voorspellingen
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
                      exact
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
                      voorspeld
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
                      PUNTEN
                    </div>
                  </div>
                </div>
              ))
            )}
          </section>

          <div
            style={{
              marginTop: "20px",
              color: "#89958e",
              fontSize: "12px",
              textAlign: "center",
            }}
          >
            Poule-ID: {poolId}
          </div>
        </div>
      </main>
    </>
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
