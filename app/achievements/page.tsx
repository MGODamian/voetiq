"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import { supabase } from "@/lib/supabase";

type AchievementStats = {
  total_points: number;
  predictions_count: number;
  played_predictions: number;
  exact_scores: number;
  correct_results: number;
  competitions_played: number;
  best_correct_streak: number;
  best_exact_streak: number;
  best_competition_correct_results: number;
};

type ProfileRank = {
  rank: number;
  total_players: number;
};

type Achievement = {
  icon: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unlocked?: boolean;
};

export default function AchievementsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [rank, setRank] = useState<ProfileRank | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAchievements();
  }, []);

  async function loadAchievements() {
    setLoading(true);
    setError("");

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      router.replace("/inloggen");
      return;
    }

    const [statsResult, rankResult, profileResult] = await Promise.all([
      supabase.rpc("get_public_achievement_stats", {
        requested_user_id: user.id,
      }),
      supabase.rpc("get_public_profile_rank", {
        requested_user_id: user.id,
      }),
      supabase.from("profiles").select("username").eq("id", user.id).maybeSingle(),
    ]);

    if (statsResult.error) {
      console.error(statsResult.error);
      setError("Je achievements konden niet worden geladen.");
      setLoading(false);
      return;
    }

    const row = statsResult.data?.[0] as AchievementStats | undefined;
    if (row) {
      setStats({
        total_points: Number(row.total_points) || 0,
        predictions_count: Number(row.predictions_count) || 0,
        played_predictions: Number(row.played_predictions) || 0,
        exact_scores: Number(row.exact_scores) || 0,
        correct_results: Number(row.correct_results) || 0,
        competitions_played: Number(row.competitions_played) || 0,
        best_correct_streak: Number(row.best_correct_streak) || 0,
        best_exact_streak: Number(row.best_exact_streak) || 0,
        best_competition_correct_results:
          Number(row.best_competition_correct_results) || 0,
      });
    }

    const rankRow = rankResult.data?.[0] as ProfileRank | undefined;
    if (rankRow) {
      setRank({
        rank: Number(rankRow.rank) || 0,
        total_players: Number(rankRow.total_players) || 0,
      });
    }

    if (!profileResult.error && profileResult.data?.username) {
      setUsername(profileResult.data.username);
    }

    setLoading(false);
  }

  const achievements = useMemo<Achievement[]>(() => {
    const s = stats || {
      total_points: 0,
      predictions_count: 0,
      played_predictions: 0,
      exact_scores: 0,
      correct_results: 0,
      competitions_played: 0,
      best_correct_streak: 0,
      best_exact_streak: 0,
      best_competition_correct_results: 0,
    };

    return [
      { icon: "🎯", title: "Scherpschutter", description: "Voorspel 1 exacte score.", progress: s.exact_scores, target: 1 },
      { icon: "🎯", title: "Precisieschutter", description: "Voorspel 5 exacte scores.", progress: s.exact_scores, target: 5 },
      { icon: "🧙", title: "Scoremeester", description: "Voorspel 10 exacte scores.", progress: s.exact_scores, target: 10 },
      { icon: "🔮", title: "Voorspelkoning", description: "Voorspel 25 exacte scores.", progress: s.exact_scores, target: 25 },
      { icon: "✅", title: "Goed gezien", description: "Voorspel 1 juiste uitslag.", progress: s.correct_results, target: 1 },
      { icon: "⚽", title: "Voetbalkenner", description: "Voorspel 10 juiste uitslagen.", progress: s.correct_results, target: 10 },
      { icon: "🧠", title: "Kenner", description: "Voorspel 25 juiste uitslagen.", progress: s.correct_results, target: 25 },
      { icon: "👑", title: "Voetbalorakel", description: "Voorspel 50 juiste uitslagen.", progress: s.correct_results, target: 50 },
      { icon: "🌱", title: "Debutant", description: "Plaats je eerste voorspelling.", progress: s.predictions_count, target: 1 },
      { icon: "📋", title: "Vaste voorspeller", description: "Plaats 10 voorspellingen.", progress: s.predictions_count, target: 10 },
      { icon: "💪", title: "Doorgewinterd", description: "Plaats 50 voorspellingen.", progress: s.predictions_count, target: 50 },
      { icon: "💯", title: "Honderdclub", description: "Plaats 100 voorspellingen.", progress: s.predictions_count, target: 100 },
      { icon: "🪙", title: "Eerste punten", description: "Verdien je eerste punt.", progress: s.total_points, target: 1 },
      { icon: "💯", title: "100-puntenclub", description: "Verdien 100 punten.", progress: s.total_points, target: 100 },
      { icon: "🚀", title: "250-puntenclub", description: "Verdien 250 punten.", progress: s.total_points, target: 250 },
      { icon: "💎", title: "500-puntenclub", description: "Verdien 500 punten.", progress: s.total_points, target: 500 },
      { icon: "🏆", title: "1000-puntenclub", description: "Verdien 1000 punten.", progress: s.total_points, target: 1000 },
      { icon: "🔥", title: "In vorm", description: "Voorspel 3 juiste uitslagen op rij.", progress: s.best_correct_streak, target: 3 },
      { icon: "🔥", title: "Niet te stoppen", description: "Voorspel 5 juiste uitslagen op rij.", progress: s.best_correct_streak, target: 5 },
      { icon: "⚡", title: "Perfecte reeks", description: "Voorspel 3 exacte scores op rij.", progress: s.best_exact_streak, target: 3 },
      { icon: "🥉", title: "Podium", description: "Bereik de top 3 van VoetIQ.", progress: rank && rank.rank <= 3 ? 1 : 0, target: 1, unlocked: !!rank && rank.rank <= 3 },
      { icon: "🥇", title: "Koploper", description: "Bereik plek #1 van VoetIQ.", progress: rank?.rank === 1 ? 1 : 0, target: 1, unlocked: rank?.rank === 1 },
      { icon: "🌍", title: "Wereldreiziger", description: "Voorspel in 3 verschillende competities.", progress: s.competitions_played, target: 3 },
      { icon: "🌐", title: "Alleskenner", description: "Voorspel in alle 8 VoetIQ-competities.", progress: s.competitions_played, target: 8 },
      { icon: "🏟️", title: "Competitiespecialist", description: "Voorspel 10 juiste uitslagen in één competitie.", progress: s.best_competition_correct_results, target: 10 },
      { icon: "💚", title: "VoetIQ-veteraan", description: "Plaats 250 voorspellingen.", progress: s.predictions_count, target: 250 },
    ];
  }, [stats, rank]);

  const unlockedCount = achievements.filter(
    (a) => a.unlocked ?? a.progress >= a.target
  ).length;

  return (
    <>
      <Navbar />
      <main style={pageStyle}>
        <div style={{ maxWidth: "1120px", margin: "0 auto" }}>
          <section style={{ ...cardStyle, padding: "30px", marginBottom: "18px" }}>
            <div style={{ color: "#83e7ae", fontSize: "12px", fontWeight: 900, letterSpacing: "1px", marginBottom: "7px" }}>
              VOETIQ CARRIÈRE
            </div>
            <h1 style={{ margin: 0, fontSize: "34px" }}>🏅 Achievements</h1>
            <p style={{ color: "#a9bbb0", margin: "9px 0 0", fontSize: "14px" }}>
              {username ? `${username}, bekijk` : "Bekijk"} je prestaties en werk toe naar het volledig uitspelen van VoetIQ.
            </p>
          </section>

          {loading ? (
            <section style={cardStyle}>Achievements laden...</section>
          ) : error ? (
            <section style={cardStyle}><strong style={{ color: "#ffb4b4" }}>{error}</strong></section>
          ) : (
            <>
              <section style={{ ...cardStyle, marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontSize: "29px", fontWeight: 950, color: "#41e58b" }}>
                      {unlockedCount} / {achievements.length}
                    </div>
                    <div style={{ color: "#a9bbb0", fontSize: "13px", marginTop: "3px" }}>
                      achievements behaald
                    </div>
                  </div>
                  <div style={{ flex: "1 1 300px", maxWidth: "600px" }}>
                    <ProgressBar value={unlockedCount} target={achievements.length} done={unlockedCount === achievements.length} />
                  </div>
                </div>
              </section>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "13px" }}>
                {achievements.map((achievement) => {
                  const done = achievement.unlocked ?? achievement.progress >= achievement.target;
                  return (
                    <article
                      key={achievement.title}
                      style={{
                        ...cardStyle,
                        padding: "19px",
                        opacity: done ? 1 : 0.72,
                        border: done
                          ? "1px solid rgba(65,229,139,0.30)"
                          : "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: "11px" }}>
                          <span style={{ fontSize: "25px" }}>{achievement.icon}</span>
                          <div>
                            <strong style={{ fontSize: "15px", color: done ? "#83e7ae" : "white" }}>
                              {achievement.title}
                            </strong>
                            <div style={{ color: "#a9bbb0", fontSize: "12px", marginTop: "5px", lineHeight: 1.45 }}>
                              {achievement.description}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: "18px" }}>{done ? "✅" : "🔒"}</span>
                      </div>

                      <div style={{ marginTop: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#a9bbb0", fontSize: "11px", marginBottom: "7px" }}>
                          <span>Voortgang</span>
                          <strong style={{ color: done ? "#41e58b" : "#c8d5ce" }}>
                            {Math.min(achievement.progress, achievement.target)} / {achievement.target}
                          </strong>
                        </div>
                        <ProgressBar value={achievement.progress} target={achievement.target} done={done} />
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}

function ProgressBar({ value, target, done }: { value: number; target: number; done: boolean }) {
  const percentage = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div style={{ height: "8px", borderRadius: "999px", overflow: "hidden", background: "rgba(255,255,255,0.08)" }}>
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          borderRadius: "999px",
          background: done ? "#41e58b" : "#1e8f58",
          transition: "width .25s ease",
        }}
      />
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at 50% 0%, rgba(15,122,70,0.20) 0%, transparent 32%), linear-gradient(180deg, #00170e 0%, #00110a 48%, #000d08 100%)",
  color: "white",
  padding: "38px 20px 80px",
};

const cardStyle: React.CSSProperties = {
  background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
  border: "1px solid rgba(80,190,130,0.20)",
  borderRadius: "20px",
  padding: "24px",
};
