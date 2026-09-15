```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "../Navbar";

type Profile = {
  username: string;
  first_name: string;
  last_name: string;
};

type Prediction = {
  id: number;
  match_id: number;
  match_name: string;
  home_score: number;
  away_score: number;
  actual_home_score: number | null;
  actual_away_score: number | null;
  points: number;
  created_at: string;
};

export default function ProfielPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setErrorMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        router.push("/inloggen");
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("username, first_name, last_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      const { data: predictionData, error: predictionError } = await supabase
        .from("predictions")
        .select(
          `
          id,
          match_id,
          match_name,
          home_score,
          away_score,
          actual_home_score,
          actual_away_score,
          points,
          created_at
        `
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (predictionError) {
        throw predictionError;
      }

      setProfile(profileData);
      setPredictions(predictionData || []);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        "Je profiel kon niet worden geladen. Probeer het opnieuw."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalPoints = predictions.reduce(
    (total, prediction) => total + (prediction.points || 0),
    0
  );

  const totalPredictions = predictions.length;

  const exactPredictions = predictions.filter(
    (prediction) =>
      prediction.actual_home_score !== null &&
      prediction.actual_away_score !== null &&
      prediction.home_score === prediction.actual_home_score &&
      prediction.away_score === prediction.actual_away_score
  ).length;

  const correctResults = predictions.filter((prediction) => {
    if (
      prediction.actual_home_score === null ||
      prediction.actual_away_score === null
    ) {
      return false;
    }

    const predictionResult =
      prediction.home_score === prediction.away_score
        ? "draw"
        : prediction.home_score > prediction.away_score
          ? "home"
          : "away";

    const actualResult =
      prediction.actual_home_score === prediction.actual_away_score
        ? "draw"
        : prediction.actual_home_score > prediction.actual_away_score
          ? "home"
          : "away";

    return predictionResult === actualResult;
  }).length;

  function formatDate(date: string) {
    return new Date(date).toLocaleString("nl-NL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #020e09 0%, #04150d 45%, #071b12 100%)",
        color: "white",
      }}
    >
      <Navbar />

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 20px 60px",
        }}
      >
        {loading && (
          <div
            style={{
              padding: "50px 20px",
              textAlign: "center",
              color: "#a9c5b5",
            }}
          >
            Profiel laden...
          </div>
        )}

        {!loading && errorMessage && (
          <div
            style={{
              maxWidth: "600px",
              margin: "50px auto",
              padding: "25px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              textAlign: "center",
            }}
          >
            <p style={{ marginBottom: "20px", color: "#ffb4b4" }}>
              {errorMessage}
            </p>

            <button
              onClick={loadProfile}
              style={{
                border: "none",
                borderRadius: "10px",
                padding: "12px 20px",
                background: "#2ee681",
                color: "#03150c",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Opnieuw proberen
            </button>
          </div>
        )}

        {!loading && !errorMessage && profile && (
          <>
            <div
              style={{
                marginBottom: "30px",
                padding: "30px",
                borderRadius: "22px",
                background:
                  "linear-gradient(145deg, rgba(13,50,31,0.95), rgba(4,21,13,0.95))",
                border: "1px solid rgba(75,255,153,0.12)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#2ee681",
                  fontSize: "13px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Mijn profiel
              </p>

              <h1
                style={{
                  margin: "8px 0 5px",
                  fontSize: "34px",
                  fontWeight: 900,
                }}
              >
                {profile.username}
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#a9c5b5",
                  fontSize: "14px",
                }}
              >
                {profile.first_name} {profile.last_name}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "15px",
                marginBottom: "35px",
              }}
            >
              <StatCard
                icon="⭐"
                label="Totaal punten"
                value={totalPoints.toString()}
              />

              <StatCard
                icon="⚽"
                label="Voorspellingen"
                value={totalPredictions.toString()}
              />

              <StatCard
                icon="🎯"
                label="Exact"
                value={exactPredictions.toString()}
              />

              <StatCard
                icon="✅"
                label="Juiste uitslag"
                value={correctResults.toString()}
              />
            </div>

            <section>
              <div style={{ marginBottom: "18px" }}>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "24px",
                    fontWeight: 900,
                  }}
                >
                  Voorspellingsgeschiedenis
                </h2>

                <p
                  style={{
                    margin: "6px 0 0",
                    color: "#8fa99a",
                    fontSize: "14px",
                  }}
                >
                  Een overzicht van jouw voorspellingen en behaalde punten.
                </p>
              </div>

              {predictions.length === 0 && (
                <div
                  style={{
                    padding: "35px 20px",
                    borderRadius: "18px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    textAlign: "center",
                    color: "#8fa99a",
                  }}
                >
                  Je hebt nog geen voorspellingen gedaan.
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {predictions.map((prediction) => {
                  const hasResult =
                    prediction.actual_home_score !== null &&
                    prediction.actual_away_score !== null;

                  const isExact =
                    hasResult &&
                    prediction.home_score ===
                      prediction.actual_home_score &&
                    prediction.away_score === prediction.actual_away_score;

                  return (
                    <div
                      key={prediction.id}
                      style={{
                        padding: "20px",
                        borderRadius: "17px",
                        background: "rgba(255,255,255,0.045)",
                        border: "1px solid rgba(255,255,255,0.07)",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "15px",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: 0,
                              fontWeight: 800,
                              fontSize: "16px",
                            }}
                          >
                            {prediction.match_name}
                          </p>

                          <p
                            style={{
                              margin: "6px 0 0",
                              color: "#718d7d",
                              fontSize: "12px",
                            }}
                          >
                            Voorspeld op {formatDate(prediction.created_at)}
                          </p>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div style={{ textAlign: "center" }}>
                            <span
                              style={{
                                display: "block",
                                color: "#718d7d",
                                fontSize: "11px",
                                marginBottom: "4px",
                              }}
                            >
                              Jouw voorspelling
                            </span>

                            <strong style={{ fontSize: "22px" }}>
                              {prediction.home_score} -{" "}
                              {prediction.away_score}
                            </strong>
                          </div>

                          {hasResult && (
                            <>
                              <span
                                style={{
                                  color: "#50695a",
                                  fontWeight: 800,
                                }}
                              >
                                →
                              </span>

                              <div style={{ textAlign: "center" }}>
                                <span
                                  style={{
                                    display: "block",
                                    color: "#718d7d",
                                    fontSize: "11px",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Uitslag
                                </span>

                                <strong style={{ fontSize: "22px" }}>
                                  {prediction.actual_home_score} -{" "}
                                  {prediction.actual_away_score}
                                </strong>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div
                        style={{
                          marginTop: "15px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "6px 10px",
                            borderRadius: "8px",
                            background: hasResult
                              ? isExact
                                ? "rgba(46,230,129,0.12)"
                                : "rgba(255,255,255,0.05)"
                              : "rgba(255,255,255,0.05)",
                            color: hasResult
                              ? isExact
                                ? "#2ee681"
                                : "#b6c8bd"
                              : "#8fa99a",
                            fontSize: "12px",
                            fontWeight: 800,
                          }}
                        >
                          {hasResult
                            ? isExact
                              ? "🎯 Exact voorspeld"
                              : "⚽ Wedstrijd gespeeld"
                            : "⏳ Nog niet gespeeld"}
                        </span>

                        <span
                          style={{
                            fontWeight: 900,
                            color:
                              prediction.points > 0
                                ? "#2ee681"
                                : "#8fa99a",
                          }}
                        >
                          {prediction.points || 0} punten
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: "22px",
        borderRadius: "17px",
        background: "rgba(255,255,255,0.045)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div style={{ fontSize: "22px", marginBottom: "12px" }}>{icon}</div>

      <div
        style={{
          fontSize: "27px",
          fontWeight: 900,
          color: "white",
        }}
      >
        {value}
      </div>

      <div
        style={{
          marginTop: "3px",
          color: "#8fa99a",
          fontSize: "13px",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  );
}
```
