"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Prediction = {
  id: number;
  points: number;
  created_at: string;
  actual_home_score: number | null;
  actual_away_score: number | null;
  home_score: number;
  away_score: number;
};

type Challenge = {
  id: number;
  challenge_key: string;
  challenge_type: "daily" | "weekly";
  target: number;
  reward_points: number;
};

const ui: Record<LanguageCode, any> = {
  nl:{eyebrow:"Challenges",title:"Dagelijkse & wekelijkse challenges",intro:"Voltooi uitdagingen met je VoetIQ-voorspellingen.",daily:"Vandaag",weekly:"Deze week",progress:"Voortgang",reward:"beloningspunten",complete:"Voltooid",loading:"Challenges laden...",empty:"Geen actieve challenges.",error:"Challenges konden niet worden geladen.",daily_predict_3:"Doe 3 voorspellingen",daily_correct_2:"Voorspel 2 juiste uitslagen",weekly_predict_10:"Doe 10 voorspellingen",weekly_score_50:"Verdien 50 punten"},
  en:{eyebrow:"Challenges",title:"Daily & weekly challenges",intro:"Complete challenges with your VoetIQ predictions.",daily:"Today",weekly:"This week",progress:"Progress",reward:"reward points",complete:"Completed",loading:"Loading challenges...",empty:"No active challenges.",error:"Challenges could not be loaded.",daily_predict_3:"Make 3 predictions",daily_correct_2:"Predict 2 correct results",weekly_predict_10:"Make 10 predictions",weekly_score_50:"Earn 50 points"},
  de:{eyebrow:"Challenges",title:"Tägliche & wöchentliche Challenges",intro:"Schließe Herausforderungen mit deinen VoetIQ-Tipps ab.",daily:"Heute",weekly:"Diese Woche",progress:"Fortschritt",reward:"Belohnungspunkte",complete:"Abgeschlossen",loading:"Challenges werden geladen...",empty:"Keine aktiven Challenges.",error:"Challenges konnten nicht geladen werden.",daily_predict_3:"Gib 3 Tipps ab",daily_correct_2:"Tippe 2 richtige Ausgänge",weekly_predict_10:"Gib 10 Tipps ab",weekly_score_50:"Verdiene 50 Punkte"},
  es:{eyebrow:"Desafíos",title:"Desafíos diarios y semanales",intro:"Completa desafíos con tus predicciones de VoetIQ.",daily:"Hoy",weekly:"Esta semana",progress:"Progreso",reward:"puntos de recompensa",complete:"Completado",loading:"Cargando desafíos...",empty:"No hay desafíos activos.",error:"No se pudieron cargar los desafíos.",daily_predict_3:"Haz 3 predicciones",daily_correct_2:"Predice 2 resultados correctos",weekly_predict_10:"Haz 10 predicciones",weekly_score_50:"Consigue 50 puntos"},
  fr:{eyebrow:"Défis",title:"Défis quotidiens et hebdomadaires",intro:"Relève des défis avec tes pronostics VoetIQ.",daily:"Aujourd’hui",weekly:"Cette semaine",progress:"Progression",reward:"points de récompense",complete:"Terminé",loading:"Chargement des défis...",empty:"Aucun défi actif.",error:"Impossible de charger les défis.",daily_predict_3:"Fais 3 pronostics",daily_correct_2:"Pronostique 2 bons résultats",weekly_predict_10:"Fais 10 pronostics",weekly_score_50:"Gagne 50 points"},
  it:{eyebrow:"Sfide",title:"Sfide giornaliere e settimanali",intro:"Completa le sfide con i tuoi pronostici VoetIQ.",daily:"Oggi",weekly:"Questa settimana",progress:"Progresso",reward:"punti premio",complete:"Completata",loading:"Caricamento sfide...",empty:"Nessuna sfida attiva.",error:"Impossibile caricare le sfide.",daily_predict_3:"Fai 3 pronostici",daily_correct_2:"Pronostica 2 esiti corretti",weekly_predict_10:"Fai 10 pronostici",weekly_score_50:"Guadagna 50 punti"},
  pt:{eyebrow:"Desafios",title:"Desafios diários e semanais",intro:"Completa desafios com as tuas previsões VoetIQ.",daily:"Hoje",weekly:"Esta semana",progress:"Progresso",reward:"pontos de recompensa",complete:"Concluído",loading:"A carregar desafios...",empty:"Não há desafios ativos.",error:"Não foi possível carregar os desafios.",daily_predict_3:"Faz 3 previsões",daily_correct_2:"Prevê 2 resultados corretos",weekly_predict_10:"Faz 10 previsões",weekly_score_50:"Ganha 50 pontos"}
};

function correctResult(p: Prediction) {
  if (p.actual_home_score === null || p.actual_away_score === null) return false;
  const predicted = p.home_score === p.away_score ? 0 : p.home_score > p.away_score ? 1 : -1;
  const actual = p.actual_home_score === p.actual_away_score ? 0 : p.actual_home_score > p.actual_away_score ? 1 : -1;
  return predicted === actual;
}

function localDayStart() {
  const d = new Date();
  d.setHours(0,0,0,0);
  return d;
}

function localWeekStart() {
  const d = localDayStart();
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diff);
  return d;
}

export default function ChallengesPage() {
  const router = useRouter();
  const [language,setLanguage] = useState<LanguageCode>("nl");
  const [challenges,setChallenges] = useState<Challenge[]>([]);
  const [predictions,setPredictions] = useState<Prediction[]>([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("voetiq-language");
    if (stored && ["nl","en","de","es","fr","it","pt"].includes(stored)) setLanguage(stored as LanguageCode);
    const change = (e:Event) => {
      const ce=e as CustomEvent<{language:LanguageCode}>;
      if (ce.detail?.language) setLanguage(ce.detail.language);
    };
    window.addEventListener("voetiq-language-change",change);
    void load();
    return ()=>window.removeEventListener("voetiq-language-change",change);
  },[]);

  async function load() {
    setLoading(true);
    setError("");
    const {data:{user}}=await supabase.auth.getUser();
    if(!user){ router.push("/inloggen"); return; }

    const [challengeResult,predictionResult]=await Promise.all([
      supabase.from("challenges").select("id, challenge_key, challenge_type, target, reward_points").eq("active",true).order("id"),
      supabase.from("predictions").select("id, points, created_at, actual_home_score, actual_away_score, home_score, away_score").eq("user_id",user.id).order("created_at",{ascending:false})
    ]);

    if(challengeResult.error || predictionResult.error){
      console.error(challengeResult.error || predictionResult.error);
      setError(ui[language].error);
    } else {
      setChallenges((challengeResult.data || []) as Challenge[]);
      setPredictions((predictionResult.data || []) as Prediction[]);
    }
    setLoading(false);
  }

  const progress = useMemo(()=>{
    const today=localDayStart().getTime();
    const week=localWeekStart().getTime();
    const daily=predictions.filter(p=>new Date(p.created_at).getTime()>=today);
    const weekly=predictions.filter(p=>new Date(p.created_at).getTime()>=week);
    return {
      daily_predict_3: daily.length,
      daily_correct_2: daily.filter(correctResult).length,
      weekly_predict_10: weekly.length,
      weekly_score_50: weekly.reduce((n,p)=>n+Number(p.points||0),0)
    } as Record<string,number>;
  },[predictions]);

  const t=ui[language];

  const orderedChallenges = useMemo(() => {
    return [...challenges].sort((a,b) => {
      if (a.challenge_type !== b.challenge_type) {
        return a.challenge_type === "daily" ? -1 : 1;
      }

      const aDone = (progress[a.challenge_key] || 0) >= a.target;
      const bDone = (progress[b.challenge_key] || 0) >= b.target;
      if (aDone !== bDone) return aDone ? -1 : 1;

      return a.id - b.id;
    });
  }, [challenges, progress]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07110e_0%,#091713_50%,#050a08_100%)] text-white">
      <Navbar/>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">{t.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">{t.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-green-100/50">{t.intro}</p>

        {loading && <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center text-green-100/60">{t.loading}</div>}
        {!loading && error && <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-500/10 p-6 text-red-200">{error}</div>}
        {!loading && !error && challenges.length===0 && <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.035] p-8 text-center text-green-100/60">{t.empty}</div>}

        {!loading && !error && challenges.length>0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {orderedChallenges.map(ch=>{
              const value=progress[ch.challenge_key] || 0;
              const shown=Math.min(value,ch.target);
              const percentage=Math.min(100,(value/ch.target)*100);
              const done=value>=ch.target;
              const title=t[ch.challenge_key] || ch.challenge_key;
              return (
                <article key={ch.id} className="rounded-3xl border border-green-400/15 bg-gradient-to-br from-green-900/60 via-green-950/70 to-gray-950 p-6 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex rounded-lg bg-green-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-green-300 ring-1 ring-green-400/10">
                        {ch.challenge_type==="daily" ? `☀️ ${t.daily}` : `📅 ${t.weekly}`}
                      </span>
                      <h2 className="mt-4 text-xl font-black">{title}</h2>
                    </div>
                    <div className="text-3xl">{done ? "✅" : ch.challenge_type==="daily" ? "🎯" : "🔥"}</div>
                  </div>

                  <div className="mt-6 flex items-end justify-between">
                    <span className="text-xs font-bold text-green-100/45">{t.progress}</span>
                    <span className="text-lg font-black text-green-300">{shown}/{ch.target}</span>
                  </div>
                  <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-green-400 transition-all duration-500" style={{width:`${percentage}%`}}/>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                    <span className="text-sm text-green-100/45">🎁 +{ch.reward_points} {t.reward}</span>
                    {done && <span className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-black text-green-300 ring-1 ring-green-400/15">{t.complete}</span>}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
