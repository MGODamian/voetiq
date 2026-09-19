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

type CompetitionStats = {
  competition_code: string;
  total_points: number;
  predictions_count: number;
  exact_scores: number;
  correct_results: number;
};

type RecentPrediction = {
  match_id: number;
  match_name: string;
  competition_code: string;
  home_score: number;
  away_score: number;
  actual_home_score: number | null;
  actual_away_score: number | null;
  points: number;
  kickoff_at: string;
};

type ProfileRank = {
  rank: number;
  total_players: number;
};

const competitionInfo: Record<string, { name: string; icon: string }> = {
  DED: { name: "Eredivisie", icon: "🇳🇱" },
  PL: { name: "Premier League", icon: "🏴" },
  PD: { name: "La Liga", icon: "🇪🇸" },
  BL1: { name: "Bundesliga", icon: "🇩🇪" },
  SA: { name: "Serie A", icon: "🇮🇹" },
  FL1: { name: "Ligue 1", icon: "🇫🇷" },
  PPL: { name: "Primeira Liga", icon: "🇵🇹" },
  CL: { name: "Champions League", icon: "🏆" },
};

export default function PublicPlayerProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [competitions, setCompetitions] = useState<CompetitionStats[]>([]);
  const [recentPredictions, setRecentPredictions] = useState<RecentPrediction[]>([]);
  const [profileRank, setProfileRank] = useState<ProfileRank | null>(null);
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

    const [profileResult, competitionResult, recentResult, rankResult] = await Promise.all([
      supabase.rpc("get_public_profile", {
        requested_user_id: userId,
      }),
      supabase.rpc("get_public_profile_competitions", {
        requested_user_id: userId,
      }),
      supabase.rpc("get_public_recent_predictions", {
        requested_user_id: userId,
      }),
      supabase.rpc("get_public_profile_rank", {
        requested_user_id: userId,
      }),
    ]);

    if (profileResult.error) {
      console.error(profileResult.error);
      setError("Het spelersprofiel kon niet worden geladen.");
      setLoading(false);
      return;
    }

    const player = profileResult.data?.[0] as PublicProfile | undefined;

    if (!player) {
      setError("Deze speler heeft nog geen openbaar VoetIQ-profiel.");
      setLoading(false);
      return;
    }

    if (competitionResult.error) {
      console.error(competitionResult.error);
    }

    if (recentResult.error) {
      console.error(recentResult.error);
    }

    if (rankResult.error) {
      console.error(rankResult.error);
    }

    const competitionRows = (
      (competitionResult.data || []) as CompetitionStats[]
    ).map((competition) => ({
      ...competition,
      total_points: Number(competition.total_points) || 0,
      predictions_count: Number(competition.predictions_count) || 0,
      exact_scores: Number(competition.exact_scores) || 0,
      correct_results: Number(competition.correct_results) || 0,
    }));

    setProfile({
      ...player,
      total_points: Number(player.total_points) || 0,
      predictions_count: Number(player.predictions_count) || 0,
      exact_scores: Number(player.exact_scores) || 0,
      correct_results: Number(player.correct_results) || 0,
    });
    setCompetitions(competitionRows);
    setRecentPredictions(
      ((recentResult.data || []) as RecentPrediction[]).map((prediction) => ({
        ...prediction,
        match_id: Number(prediction.match_id),
        home_score: Number(prediction.home_score),
        away_score: Number(prediction.away_score),
        actual_home_score:
          prediction.actual_home_score === null
            ? null
            : Number(prediction.actual_home_score),
        actual_away_score:
          prediction.actual_away_score === null
            ? null
            : Number(prediction.actual_away_score),
        points: Number(prediction.points) || 0,
      }))
    );
    const rankRow = rankResult.data?.[0] as ProfileRank | undefined;

    setProfileRank(
      rankRow
        ? {
            rank: Number(rankRow.rank) || 0,
            total_players: Number(rankRow.total_players) || 0,
          }
        : null
    );

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

                <StatCard
                  icon="🥇"
                  value={
                    profileRank
                      ? `#${profileRank.rank}`
                      : "-"
                  }
                  label={
                    profileRank
                      ? `Algemeen · van ${profileRank.total_players} spelers`
                      : "Algemene ranglijst"
                  }
                />
              </div>

              <section
                style={{
                  ...cardStyle,
                  marginBottom: "18px",
                }}
              >
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

              <section style={{ ...cardStyle, marginBottom: "18px" }}>
                <div style={{ marginBottom: "18px" }}>
                  <h2
                    style={{
                      margin: 0,
                      fontSize: "22px",
                    }}
                  >
                    🏟️ Prestaties per competitie
                  </h2>

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#a9bbb0",
                      fontSize: "13px",
                    }}
                  >
                    Bekijk waar {profile.username} zijn punten heeft verdiend.
                  </p>
                </div>

                {competitions.length === 0 ? (
                  <div
                    style={{
                      padding: "18px 0 4px",
                      color: "#a9bbb0",
                      fontSize: "14px",
                    }}
                  >
                    Nog geen competitiegegevens beschikbaar.
                  </div>
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(240px, 1fr))",
                      gap: "12px",
                    }}
                  >
                    {competitions.map((competition) => {
                      const info =
                        competitionInfo[competition.competition_code] || {
                          name: competition.competition_code,
                          icon: "⚽",
                        };

                      const percentage =
                        competition.predictions_count > 0
                          ? Math.round(
                              (competition.correct_results /
                                competition.predictions_count) *
                                100
                            )
                          : 0;

                      return (
                        <div
                          key={competition.competition_code}
                          style={{
                            background:
                              "linear-gradient(145deg, rgba(11,53,35,0.78) 0%, rgba(0,23,14,0.92) 100%)",
                            border:
                              "1px solid rgba(65,229,139,0.14)",
                            borderRadius: "16px",
                            padding: "18px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              marginBottom: "16px",
                            }}
                          >
                            <span style={{ fontSize: "24px" }}>
                              {info.icon}
                            </span>

                            <strong
                              style={{
                                fontSize: "16px",
                                color: "white",
                              }}
                            >
                              {info.name}
                            </strong>
                          </div>

                          <div
                            style={{
                              fontSize: "27px",
                              fontWeight: 900,
                              color: "#41e58b",
                              marginBottom: "3px",
                            }}
                          >
                            {competition.total_points}
                          </div>

                          <div
                            style={{
                              color: "#a9bbb0",
                              fontSize: "12px",
                              marginBottom: "15px",
                            }}
                          >
                            punten
                          </div>

                          <MiniStat
                            label="Voorspellingen"
                            value={competition.predictions_count}
                          />
                          <MiniStat
                            label="Exacte scores"
                            value={competition.exact_scores}
                          />
                          <MiniStat
                            label="Juiste uitslagen"
                            value={`${competition.correct_results} (${percentage}%)`}
                            last
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section style={cardStyle}>
                <div style={{ marginBottom: "18px" }}>
                  <h2 style={{ margin: 0, fontSize: "22px" }}>
                    🕘 Recente voorspellingen
                  </h2>
                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#a9bbb0",
                      fontSize: "13px",
                    }}
                  >
                    Alleen voorspellingen van wedstrijden die al zijn begonnen zijn zichtbaar.
                  </p>
                </div>

                {recentPredictions.length === 0 ? (
                  <div
                    style={{
                      padding: "18px 0 4px",
                      color: "#a9bbb0",
                      fontSize: "14px",
                    }}
                  >
                    Nog geen openbare voorspellingen beschikbaar.
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "10px" }}>
                    {recentPredictions.map((prediction) => {
                      const info =
                        competitionInfo[prediction.competition_code] || {
                          name: prediction.competition_code,
                          icon: "⚽",
                        };

                      const hasResult =
                        prediction.actual_home_score !== null &&
                        prediction.actual_away_score !== null;

                      return (
                        <div
                          key={`${prediction.match_id}-${prediction.kickoff_at}`}
                          style={{
                            background:
                              "linear-gradient(145deg, rgba(11,53,35,0.78) 0%, rgba(0,23,14,0.92) 100%)",
                            border: "1px solid rgba(65,229,139,0.14)",
                            borderRadius: "16px",
                            padding: "17px 18px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              gap: "16px",
                              flexWrap: "wrap",
                            }}
                          >
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div
                                style={{
                                  color: "#83e7ae",
                                  fontSize: "11px",
                                  fontWeight: 800,
                                  marginBottom: "6px",
                                }}
                              >
                                {info.icon} {info.name} ·{" "}
                                {new Date(prediction.kickoff_at).toLocaleDateString(
                                  "nl-NL",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </div>

                              <div
                                style={{
                                  color: "white",
                                  fontWeight: 900,
                                  fontSize: "15px",
                                }}
                              >
                                {prediction.match_name}
                              </div>
                            </div>

                            <div
                              style={{
                                color: "#41e58b",
                                fontWeight: 900,
                                fontSize: "15px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              +{prediction.points} punten
                            </div>
                          </div>

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(150px, 1fr))",
                              gap: "10px",
                              marginTop: "14px",
                            }}
                          >
                            <PredictionValue
                              label="Voorspelling"
                              value={`${prediction.home_score} - ${prediction.away_score}`}
                            />
                            <PredictionValue
                              label="Uitslag"
                              value={
                                hasResult
                                  ? `${prediction.actual_home_score} - ${prediction.actual_away_score}`
                                  : "Bezig"
                              }
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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

function MiniStat({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string | number;
  last?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "14px",
        padding: "9px 0",
        borderBottom: last
          ? "none"
          : "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <span
        style={{
          color: "#a9bbb0",
          fontSize: "12px",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "white",
          fontSize: "13px",
        }}
      >
        {value}
      </strong>
    </div>
  );
}

function PredictionValue({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        background: "rgba(0, 13, 8, 0.55)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "12px",
        padding: "11px 13px",
      }}
    >
      <div
        style={{
          color: "#a9bbb0",
          fontSize: "10px",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.7px",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <strong style={{ color: "white", fontSize: "16px" }}>{value}</strong>
    </div>
  );
}
