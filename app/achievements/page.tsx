"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";
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
  const [language, setLanguage] = useState<LanguageCode>("nl");

  useEffect(() => {
    loadAchievements();

    const stored = window.localStorage.getItem("voetiq-language");
    if (stored && ["nl","en","de","es","fr","it","pt"].includes(stored)) {
      setLanguage(stored as LanguageCode);
    }

    function onLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language: LanguageCode }>;
      if (customEvent.detail?.language) setLanguage(customEvent.detail.language);
    }

    window.addEventListener("voetiq-language-change", onLanguageChange);
    return () => window.removeEventListener("voetiq-language-change", onLanguageChange);
  }, []);

  const ui = translations[language];

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
      setError(translations[language].loadError);
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

    const definitions = achievementTranslations[language];

    const values = [
      [s.exact_scores,1],[s.exact_scores,5],[s.exact_scores,10],[s.exact_scores,25],
      [s.correct_results,1],[s.correct_results,10],[s.correct_results,25],[s.correct_results,50],
      [s.predictions_count,1],[s.predictions_count,10],[s.predictions_count,50],[s.predictions_count,100],
      [s.total_points,1],[s.total_points,100],[s.total_points,250],[s.total_points,500],[s.total_points,1000],
      [s.best_correct_streak,3],[s.best_correct_streak,5],[s.best_exact_streak,3],
      [rank && rank.rank <= 3 ? 1 : 0,1],[rank?.rank === 1 ? 1 : 0,1],
      [s.competitions_played,3],[s.competitions_played,8],
      [s.best_competition_correct_results,10],[s.predictions_count,250],
    ];

    const icons = ["🎯","🎯","🧙","🔮","✅","⚽","🧠","👑","🌱","📋","💪","💯","🪙","💯","🚀","💎","🏆","🔥","🔥","⚡","🥉","🥇","🌍","🌐","🏟️","💚"];

    return definitions.map((item, index) => ({
      icon: icons[index],
      title: item[0],
      description: item[1],
      progress: Number(values[index][0]) || 0,
      target: Number(values[index][1]),
      ...(index === 20 ? { unlocked: !!rank && rank.rank <= 3 } : {}),
      ...(index === 21 ? { unlocked: rank?.rank === 1 } : {}),
    }));
  }, [stats, rank, language]);

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
              {ui.career}
            </div>
            <h1 style={{ margin: 0, fontSize: "34px" }}>🏅 {ui.title}</h1>
            <p style={{ color: "#a9bbb0", margin: "9px 0 0", fontSize: "14px" }}>
              {username ? `${username}, ${ui.introNamed}` : ui.intro}
            </p>
          </section>

          {loading ? (
            <section style={cardStyle}>{ui.loading}</section>
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
                      {ui.unlocked}
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
                          <span>{ui.progress}</span>
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

const translations: Record<LanguageCode, {
  career:string; title:string; introNamed:string; intro:string; loading:string; unlocked:string; progress:string; loadError:string;
}> = {
  nl:{career:"VOETIQ CARRIÈRE",title:"Achievements",introNamed:"bekijk je prestaties en werk toe naar het volledig uitspelen van VoetIQ.",intro:"Bekijk je prestaties en werk toe naar het volledig uitspelen van VoetIQ.",loading:"Achievements laden...",unlocked:"achievements behaald",progress:"Voortgang",loadError:"Je achievements konden niet worden geladen."},
  en:{career:"VOETIQ CAREER",title:"Achievements",introNamed:"view your achievements and work towards completing VoetIQ.",intro:"View your achievements and work towards completing VoetIQ.",loading:"Loading achievements...",unlocked:"achievements unlocked",progress:"Progress",loadError:"Your achievements could not be loaded."},
  de:{career:"VOETIQ-KARRIERE",title:"Erfolge",introNamed:"sieh dir deine Erfolge an und arbeite daran, VoetIQ vollständig abzuschließen.",intro:"Sieh dir deine Erfolge an und arbeite daran, VoetIQ vollständig abzuschließen.",loading:"Erfolge werden geladen...",unlocked:"Erfolge freigeschaltet",progress:"Fortschritt",loadError:"Deine Erfolge konnten nicht geladen werden."},
  es:{career:"CARRERA VOETIQ",title:"Logros",introNamed:"consulta tus logros y avanza hasta completar VoetIQ.",intro:"Consulta tus logros y avanza hasta completar VoetIQ.",loading:"Cargando logros...",unlocked:"logros conseguidos",progress:"Progreso",loadError:"No se pudieron cargar tus logros."},
  fr:{career:"CARRIÈRE VOETIQ",title:"Succès",introNamed:"consulte tes succès et progresse pour terminer VoetIQ.",intro:"Consulte tes succès et progresse pour terminer VoetIQ.",loading:"Chargement des succès...",unlocked:"succès débloqués",progress:"Progression",loadError:"Tes succès n’ont pas pu être chargés."},
  it:{career:"CARRIERA VOETIQ",title:"Obiettivi",introNamed:"guarda i tuoi obiettivi e continua fino a completare VoetIQ.",intro:"Guarda i tuoi obiettivi e continua fino a completare VoetIQ.",loading:"Caricamento obiettivi...",unlocked:"obiettivi sbloccati",progress:"Progresso",loadError:"Impossibile caricare i tuoi obiettivi."},
  pt:{career:"CARREIRA VOETIQ",title:"Conquistas",introNamed:"vê as tuas conquistas e avança até completares o VoetIQ.",intro:"Vê as tuas conquistas e avança até completares o VoetIQ.",loading:"A carregar conquistas...",unlocked:"conquistas desbloqueadas",progress:"Progresso",loadError:"Não foi possível carregar as tuas conquistas."},
};

const achievementTranslations: Record<LanguageCode, [string,string][]> = {
  nl:[
    ["Scherpschutter","Voorspel 1 exacte score."],["Precisieschutter","Voorspel 5 exacte scores."],["Scoremeester","Voorspel 10 exacte scores."],["Voorspelkoning","Voorspel 25 exacte scores."],
    ["Goed gezien","Voorspel 1 juiste uitslag."],["Voetbalkenner","Voorspel 10 juiste uitslagen."],["Kenner","Voorspel 25 juiste uitslagen."],["Voetbalorakel","Voorspel 50 juiste uitslagen."],
    ["Debutant","Plaats je eerste voorspelling."],["Vaste voorspeller","Plaats 10 voorspellingen."],["Doorgewinterd","Plaats 50 voorspellingen."],["Honderdclub","Plaats 100 voorspellingen."],
    ["Eerste punten","Verdien je eerste punt."],["100-puntenclub","Verdien 100 punten."],["250-puntenclub","Verdien 250 punten."],["500-puntenclub","Verdien 500 punten."],["1000-puntenclub","Verdien 1000 punten."],
    ["In vorm","Voorspel 3 juiste uitslagen op rij."],["Niet te stoppen","Voorspel 5 juiste uitslagen op rij."],["Perfecte reeks","Voorspel 3 exacte scores op rij."],
    ["Podium","Bereik de top 3 van VoetIQ."],["Koploper","Bereik plek #1 van VoetIQ."],["Wereldreiziger","Voorspel in 3 verschillende competities."],["Alleskenner","Voorspel in alle 8 VoetIQ-competities."],["Competitiespecialist","Voorspel 10 juiste uitslagen in één competitie."],["VoetIQ-veteraan","Plaats 250 voorspellingen."]
  ],
  en:[
    ["Sharpshooter","Predict 1 exact score."],["Precision Shooter","Predict 5 exact scores."],["Score Master","Predict 10 exact scores."],["Prediction King","Predict 25 exact scores."],
    ["Good Call","Predict 1 correct result."],["Football Expert","Predict 10 correct results."],["Expert","Predict 25 correct results."],["Football Oracle","Predict 50 correct results."],
    ["Debutant","Make your first prediction."],["Regular Predictor","Make 10 predictions."],["Seasoned Predictor","Make 50 predictions."],["Century Club","Make 100 predictions."],
    ["First Points","Earn your first point."],["100 Point Club","Earn 100 points."],["250 Point Club","Earn 250 points."],["500 Point Club","Earn 500 points."],["1000 Point Club","Earn 1000 points."],
    ["In Form","Predict 3 correct results in a row."],["Unstoppable","Predict 5 correct results in a row."],["Perfect Streak","Predict 3 exact scores in a row."],
    ["Podium","Reach the VoetIQ top 3."],["Leader","Reach #1 on VoetIQ."],["World Traveller","Predict in 3 different competitions."],["All-Round Expert","Predict in all 8 VoetIQ competitions."],["Competition Specialist","Predict 10 correct results in one competition."],["VoetIQ Veteran","Make 250 predictions."]
  ],
  de:[
    ["Scharfschütze","Tippe 1 exaktes Ergebnis."],["Präzisionsschütze","Tippe 5 exakte Ergebnisse."],["Ergebnismeister","Tippe 10 exakte Ergebnisse."],["Tippkönig","Tippe 25 exakte Ergebnisse."],
    ["Gut getippt","Tippe 1 richtigen Ausgang."],["Fußballexperte","Tippe 10 richtige Ausgänge."],["Kenner","Tippe 25 richtige Ausgänge."],["Fußballorakel","Tippe 50 richtige Ausgänge."],
    ["Debütant","Gib deinen ersten Tipp ab."],["Stammtipper","Gib 10 Tipps ab."],["Erfahrener Tipper","Gib 50 Tipps ab."],["Hunderterclub","Gib 100 Tipps ab."],
    ["Erste Punkte","Verdiene deinen ersten Punkt."],["100-Punkte-Club","Verdiene 100 Punkte."],["250-Punkte-Club","Verdiene 250 Punkte."],["500-Punkte-Club","Verdiene 500 Punkte."],["1000-Punkte-Club","Verdiene 1000 Punkte."],
    ["In Form","Tippe 3 richtige Ausgänge in Folge."],["Unaufhaltsam","Tippe 5 richtige Ausgänge in Folge."],["Perfekte Serie","Tippe 3 exakte Ergebnisse in Folge."],
    ["Podium","Erreiche die Top 3 von VoetIQ."],["Spitzenreiter","Erreiche Platz #1 bei VoetIQ."],["Weltenbummler","Tippe in 3 verschiedenen Wettbewerben."],["Alleskönner","Tippe in allen 8 VoetIQ-Wettbewerben."],["Wettbewerbsspezialist","Tippe 10 richtige Ausgänge in einem Wettbewerb."],["VoetIQ-Veteran","Gib 250 Tipps ab."]
  ],
  es:[
    ["Francotirador","Acierta 1 marcador exacto."],["Tirador de precisión","Acierta 5 marcadores exactos."],["Maestro del marcador","Acierta 10 marcadores exactos."],["Rey de las predicciones","Acierta 25 marcadores exactos."],
    ["Bien visto","Acierta 1 resultado."],["Experto en fútbol","Acierta 10 resultados."],["Conocedor","Acierta 25 resultados."],["Oráculo del fútbol","Acierta 50 resultados."],
    ["Debutante","Haz tu primera predicción."],["Pronosticador habitual","Haz 10 predicciones."],["Experimentado","Haz 50 predicciones."],["Club de los 100","Haz 100 predicciones."],
    ["Primeros puntos","Consigue tu primer punto."],["Club de 100 puntos","Consigue 100 puntos."],["Club de 250 puntos","Consigue 250 puntos."],["Club de 500 puntos","Consigue 500 puntos."],["Club de 1000 puntos","Consigue 1000 puntos."],
    ["En forma","Acierta 3 resultados seguidos."],["Imparable","Acierta 5 resultados seguidos."],["Racha perfecta","Acierta 3 marcadores exactos seguidos."],
    ["Podio","Alcanza el top 3 de VoetIQ."],["Líder","Alcanza el puesto #1 de VoetIQ."],["Trotamundos","Pronostica en 3 competiciones diferentes."],["Experto total","Pronostica en las 8 competiciones de VoetIQ."],["Especialista de competición","Acierta 10 resultados en una competición."],["Veterano de VoetIQ","Haz 250 predicciones."]
  ],
  fr:[
    ["Tireur d’élite","Trouve 1 score exact."],["Tireur de précision","Trouve 5 scores exacts."],["Maître du score","Trouve 10 scores exacts."],["Roi des pronostics","Trouve 25 scores exacts."],
    ["Bien vu","Trouve 1 bon résultat."],["Expert football","Trouve 10 bons résultats."],["Connaisseur","Trouve 25 bons résultats."],["Oracle du football","Trouve 50 bons résultats."],
    ["Débutant","Fais ton premier pronostic."],["Pronostiqueur régulier","Fais 10 pronostics."],["Expérimenté","Fais 50 pronostics."],["Club des 100","Fais 100 pronostics."],
    ["Premiers points","Gagne ton premier point."],["Club des 100 points","Gagne 100 points."],["Club des 250 points","Gagne 250 points."],["Club des 500 points","Gagne 500 points."],["Club des 1000 points","Gagne 1000 points."],
    ["En forme","Trouve 3 bons résultats de suite."],["Inarrêtable","Trouve 5 bons résultats de suite."],["Série parfaite","Trouve 3 scores exacts de suite."],
    ["Podium","Atteins le top 3 de VoetIQ."],["Leader","Atteins la place #1 de VoetIQ."],["Globe-trotter","Pronostique dans 3 compétitions différentes."],["Expert complet","Pronostique dans les 8 compétitions VoetIQ."],["Spécialiste d’une compétition","Trouve 10 bons résultats dans une compétition."],["Vétéran VoetIQ","Fais 250 pronostics."]
  ],
  it:[
    ["Cecchino","Indovina 1 risultato esatto."],["Tiratore di precisione","Indovina 5 risultati esatti."],["Maestro del risultato","Indovina 10 risultati esatti."],["Re dei pronostici","Indovina 25 risultati esatti."],
    ["Ben visto","Indovina 1 esito corretto."],["Esperto di calcio","Indovina 10 esiti corretti."],["Intenditore","Indovina 25 esiti corretti."],["Oracolo del calcio","Indovina 50 esiti corretti."],
    ["Debuttante","Fai il tuo primo pronostico."],["Pronosticatore abituale","Fai 10 pronostici."],["Esperto","Fai 50 pronostici."],["Club dei 100","Fai 100 pronostici."],
    ["Primi punti","Guadagna il tuo primo punto."],["Club dei 100 punti","Guadagna 100 punti."],["Club dei 250 punti","Guadagna 250 punti."],["Club dei 500 punti","Guadagna 500 punti."],["Club dei 1000 punti","Guadagna 1000 punti."],
    ["In forma","Indovina 3 esiti corretti di fila."],["Inarrestabile","Indovina 5 esiti corretti di fila."],["Serie perfetta","Indovina 3 risultati esatti di fila."],
    ["Podio","Raggiungi la top 3 di VoetIQ."],["Capolista","Raggiungi il posto #1 su VoetIQ."],["Girammondo","Pronostica in 3 competizioni diverse."],["Tuttologo","Pronostica in tutte le 8 competizioni VoetIQ."],["Specialista di competizione","Indovina 10 esiti corretti in una competizione."],["Veterano VoetIQ","Fai 250 pronostici."]
  ],
  pt:[
    ["Atirador certeiro","Acerta 1 resultado exato."],["Atirador de precisão","Acerta 5 resultados exatos."],["Mestre do resultado","Acerta 10 resultados exatos."],["Rei das previsões","Acerta 25 resultados exatos."],
    ["Boa previsão","Acerta 1 resultado."],["Especialista em futebol","Acerta 10 resultados."],["Conhecedor","Acerta 25 resultados."],["Oráculo do futebol","Acerta 50 resultados."],
    ["Estreante","Faz a tua primeira previsão."],["Prognosticador regular","Faz 10 previsões."],["Experiente","Faz 50 previsões."],["Clube dos 100","Faz 100 previsões."],
    ["Primeiros pontos","Ganha o teu primeiro ponto."],["Clube dos 100 pontos","Ganha 100 pontos."],["Clube dos 250 pontos","Ganha 250 pontos."],["Clube dos 500 pontos","Ganha 500 pontos."],["Clube dos 1000 pontos","Ganha 1000 pontos."],
    ["Em forma","Acerta 3 resultados seguidos."],["Imparável","Acerta 5 resultados seguidos."],["Série perfeita","Acerta 3 resultados exatos seguidos."],
    ["Pódio","Chega ao top 3 do VoetIQ."],["Líder","Chega ao lugar #1 do VoetIQ."],["Viajante do mundo","Faz previsões em 3 competições diferentes."],["Especialista total","Faz previsões nas 8 competições do VoetIQ."],["Especialista da competição","Acerta 10 resultados numa competição."],["Veterano VoetIQ","Faz 250 previsões."]
  ],
};

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
