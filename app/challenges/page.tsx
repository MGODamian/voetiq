"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Challenge = {
  id: number;
  challenge_key: string;
  challenge_type: "daily" | "weekly";
  target: number;
  reward_points: number;
};

type ChallengeCompletion = {
  challenge_id: number;
  period_key: string;
};

const ui: Record<LanguageCode, any> = {
  nl:{eyebrow:"Challenges",title:"Dagelijkse & wekelijkse challenges",intro:"Voltooi uitdagingen met je VoetIQ-voorspellingen.",daily:"Vandaag",weekly:"Deze week",progress:"Voortgang",reward:"beloningspunten",complete:"Voltooid",loading:"Challenges laden...",empty:"Geen actieve challenges.",error:"Challenges konden niet worden geladen.",claimSuccess:"Challenge voltooid!",pointsEarned:"beloningspunten verdiend",daily_predict_2:"Doe 2 voorspellingen",daily_predict_3:"Doe 3 voorspellingen",daily_predict_5:"Doe 5 voorspellingen",daily_correct_1:"Voorspel 1 juiste uitslag",daily_correct_2:"Voorspel 2 juiste uitslagen",daily_score_10:"Verdien 10 punten",daily_score_20:"Verdien 20 punten",daily_score_30:"Verdien 30 punten",weekly_predict_5:"Doe 5 voorspellingen",weekly_predict_10:"Doe 10 voorspellingen",weekly_predict_15:"Doe 15 voorspellingen",weekly_predict_20:"Doe 20 voorspellingen",weekly_correct_3:"Voorspel 3 juiste uitslagen",weekly_correct_5:"Voorspel 5 juiste uitslagen",weekly_score_50:"Verdien 50 punten",weekly_score_100:"Verdien 100 punten"},
  en:{eyebrow:"Challenges",title:"Daily & weekly challenges",intro:"Complete challenges with your VoetIQ predictions.",daily:"Today",weekly:"This week",progress:"Progress",reward:"reward points",complete:"Completed",loading:"Loading challenges...",empty:"No active challenges.",error:"Challenges could not be loaded.",claimSuccess:"Challenge completed!",pointsEarned:"reward points earned",daily_predict_2:"Make 2 predictions",daily_predict_3:"Make 3 predictions",daily_predict_5:"Make 5 predictions",daily_correct_1:"Predict 1 correct result",daily_correct_2:"Predict 2 correct results",daily_score_10:"Earn 10 points",daily_score_20:"Earn 20 points",daily_score_30:"Earn 30 points",weekly_predict_5:"Make 5 predictions",weekly_predict_10:"Make 10 predictions",weekly_predict_15:"Make 15 predictions",weekly_predict_20:"Make 20 predictions",weekly_correct_3:"Predict 3 correct results",weekly_correct_5:"Predict 5 correct results",weekly_score_50:"Earn 50 points",weekly_score_100:"Earn 100 points"},
  de:{eyebrow:"Challenges",title:"Tägliche & wöchentliche Challenges",intro:"Schließe Herausforderungen mit deinen VoetIQ-Tipps ab.",daily:"Heute",weekly:"Diese Woche",progress:"Fortschritt",reward:"Belohnungspunkte",complete:"Abgeschlossen",loading:"Challenges werden geladen...",empty:"Keine aktiven Challenges.",error:"Challenges konnten nicht geladen werden.",claimSuccess:"Challenge abgeschlossen!",pointsEarned:"Belohnungspunkte verdient",daily_predict_2:"Gib 2 Tipps ab",daily_predict_3:"Gib 3 Tipps ab",daily_predict_5:"Gib 5 Tipps ab",daily_correct_1:"Tippe 1 richtigen Ausgang",daily_correct_2:"Tippe 2 richtige Ausgänge",daily_score_10:"Verdiene 10 Punkte",daily_score_20:"Verdiene 20 Punkte",daily_score_30:"Verdiene 30 Punkte",weekly_predict_5:"Gib 5 Tipps ab",weekly_predict_10:"Gib 10 Tipps ab",weekly_predict_15:"Gib 15 Tipps ab",weekly_predict_20:"Gib 20 Tipps ab",weekly_correct_3:"Tippe 3 richtige Ausgänge",weekly_correct_5:"Tippe 5 richtige Ausgänge",weekly_score_50:"Verdiene 50 Punkte",weekly_score_100:"Verdiene 100 Punkte"},
  es:{eyebrow:"Desafíos",title:"Desafíos diarios y semanales",intro:"Completa desafíos con tus predicciones de VoetIQ.",daily:"Hoy",weekly:"Esta semana",progress:"Progreso",reward:"puntos de recompensa",complete:"Completado",loading:"Cargando desafíos...",empty:"No hay desafíos activos.",error:"No se pudieron cargar los desafíos.",claimSuccess:"¡Desafío completado!",pointsEarned:"puntos de recompensa conseguidos",daily_predict_2:"Haz 2 predicciones",daily_predict_3:"Haz 3 predicciones",daily_predict_5:"Haz 5 predicciones",daily_correct_1:"Predice 1 resultado correcto",daily_correct_2:"Predice 2 resultados correctos",daily_score_10:"Consigue 10 puntos",daily_score_20:"Consigue 20 puntos",daily_score_30:"Consigue 30 puntos",weekly_predict_5:"Haz 5 predicciones",weekly_predict_10:"Haz 10 predicciones",weekly_predict_15:"Haz 15 predicciones",weekly_predict_20:"Haz 20 predicciones",weekly_correct_3:"Predice 3 resultados correctos",weekly_correct_5:"Predice 5 resultados correctos",weekly_score_50:"Consigue 50 puntos",weekly_score_100:"Consigue 100 puntos"},
  fr:{eyebrow:"Défis",title:"Défis quotidiens et hebdomadaires",intro:"Relève des défis avec tes pronostics VoetIQ.",daily:"Aujourd’hui",weekly:"Cette semaine",progress:"Progression",reward:"points de récompense",complete:"Terminé",loading:"Chargement des défis...",empty:"Aucun défi actif.",error:"Impossible de charger les défis.",claimSuccess:"Défi terminé !",pointsEarned:"points de récompense gagnés",daily_predict_2:"Fais 2 pronostics",daily_predict_3:"Fais 3 pronostics",daily_predict_5:"Fais 5 pronostics",daily_correct_1:"Pronostique 1 bon résultat",daily_correct_2:"Pronostique 2 bons résultats",daily_score_10:"Gagne 10 points",daily_score_20:"Gagne 20 points",daily_score_30:"Gagne 30 points",weekly_predict_5:"Fais 5 pronostics",weekly_predict_10:"Fais 10 pronostics",weekly_predict_15:"Fais 15 pronostics",weekly_predict_20:"Fais 20 pronostics",weekly_correct_3:"Pronostique 3 bons résultats",weekly_correct_5:"Pronostique 5 bons résultats",weekly_score_50:"Gagne 50 points",weekly_score_100:"Gagne 100 points"},
  it:{eyebrow:"Sfide",title:"Sfide giornaliere e settimanali",intro:"Completa le sfide con i tuoi pronostici VoetIQ.",daily:"Oggi",weekly:"Questa settimana",progress:"Progresso",reward:"punti premio",complete:"Completata",loading:"Caricamento sfide...",empty:"Nessuna sfida attiva.",error:"Impossibile caricare le sfide.",claimSuccess:"Sfida completata!",pointsEarned:"punti premio guadagnati",daily_predict_2:"Fai 2 pronostici",daily_predict_3:"Fai 3 pronostici",daily_predict_5:"Fai 5 pronostici",daily_correct_1:"Pronostica 1 esito corretto",daily_correct_2:"Pronostica 2 esiti corretti",daily_score_10:"Guadagna 10 punti",daily_score_20:"Guadagna 20 punti",daily_score_30:"Guadagna 30 punti",weekly_predict_5:"Fai 5 pronostici",weekly_predict_10:"Fai 10 pronostici",weekly_predict_15:"Fai 15 pronostici",weekly_predict_20:"Fai 20 pronostici",weekly_correct_3:"Pronostica 3 esiti corretti",weekly_correct_5:"Pronostica 5 esiti corretti",weekly_score_50:"Guadagna 50 punti",weekly_score_100:"Guadagna 100 punti"},
  pt:{eyebrow:"Desafios",title:"Desafios diários e semanais",intro:"Completa desafios com as tuas previsões VoetIQ.",daily:"Hoje",weekly:"Esta semana",progress:"Progresso",reward:"pontos de recompensa",complete:"Concluído",loading:"A carregar desafios...",empty:"Não há desafios ativos.",error:"Não foi possível carregar os desafios.",claimSuccess:"Desafio concluído!",pointsEarned:"pontos de recompensa ganhos",daily_predict_2:"Faz 2 previsões",daily_predict_3:"Faz 3 previsões",daily_predict_5:"Faz 5 previsões",daily_correct_1:"Prevê 1 resultado correto",daily_correct_2:"Prevê 2 resultados corretos",daily_score_10:"Ganha 10 pontos",daily_score_20:"Ganha 20 pontos",daily_score_30:"Ganha 30 pontos",weekly_predict_5:"Faz 5 previsões",weekly_predict_10:"Faz 10 previsões",weekly_predict_15:"Faz 15 previsões",weekly_predict_20:"Faz 20 previsões",weekly_correct_3:"Prevê 3 resultados corretos",weekly_correct_5:"Prevê 5 resultados corretos",weekly_score_50:"Ganha 50 pontos",weekly_score_100:"Ganha 100 pontos"}
};

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

function localDateKey() {
  const d = localDayStart();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function localWeekKey() {
  const d = localWeekStart();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function completionKey(challengeId: number, periodKey: string) {
  return `${challengeId}:${periodKey}`;
}

function periodKeyForChallenge(challenge: Challenge) {
  return challenge.challenge_type === "daily" ? localDateKey() : localWeekKey();
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function selectForPeriod(items: Challenge[], periodKey: string, amount = 2) {
  return [...items]
    .map((item) => ({
      item,
      score: hashString(`${periodKey}:${item.challenge_key}`),
    }))
    .sort((a, b) => a.score - b.score || a.item.id - b.item.id)
    .slice(0, amount)
    .map(({ item }) => item);
}

export default function ChallengesPage() {
  const router = useRouter();
  const [language,setLanguage] = useState<LanguageCode>("nl");
  const [challenges,setChallenges] = useState<Challenge[]>([]);
  const [progress,setProgress] = useState<Record<string,number>>({});
  const [completedChallenges,setCompletedChallenges] = useState<Set<string>>(new Set());
  const [claimingChallenges,setClaimingChallenges] = useState<Set<string>>(new Set());
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const [successMessage,setSuccessMessage] = useState<{title:string; reward:number} | null>(null);

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

    const [challengeResult,completionResult]=await Promise.all([
      supabase.from("challenges").select("id, challenge_key, challenge_type, target, reward_points").eq("active",true).order("id"),
      supabase.from("challenge_completions").select("challenge_id, period_key").eq("user_id",user.id)
    ]);

    if(challengeResult.error || completionResult.error){
      console.error(challengeResult.error || completionResult.error);
      setError(ui[language].error);
      setLoading(false);
      return;
    }

    const activeChallenges = (challengeResult.data || []) as Challenge[];
    setChallenges(activeChallenges);

    const completionKeys = new Set(
      ((completionResult.data || []) as ChallengeCompletion[]).map((item) =>
        completionKey(item.challenge_id, item.period_key)
      )
    );
    setCompletedChallenges(completionKeys);

    const progressResults = await Promise.all(
      activeChallenges.map(async (challenge) => {
        const periodKey = periodKeyForChallenge(challenge);
        const { data, error: progressError } = await supabase.rpc("get_challenge_progress", {
          requested_challenge_id: challenge.id,
          requested_period_key: periodKey,
        });

        if (progressError) {
          console.error(`Progress laden mislukt voor ${challenge.challenge_key}:`, progressError);
          return [challenge.challenge_key, 0] as const;
        }

        return [challenge.challenge_key, Number(data || 0)] as const;
      })
    );

    setProgress(Object.fromEntries(progressResults));
    setLoading(false);
  }

  const t=ui[language];

  const orderedChallenges = useMemo(() => {
    const dailyPool = challenges.filter((challenge) => challenge.challenge_type === "daily");
    const weeklyPool = challenges.filter((challenge) => challenge.challenge_type === "weekly");

    const selectedDaily = selectForPeriod(dailyPool, `daily:${localDateKey()}`, 2);
    const selectedWeekly = selectForPeriod(weeklyPool, `weekly:${localWeekKey()}`, 2);

    const sortCompletedFirst = (items: Challenge[]) =>
      [...items].sort((a,b) => {
        const aDone = (progress[a.challenge_key] || 0) >= a.target;
        const bDone = (progress[b.challenge_key] || 0) >= b.target;
        if (aDone !== bDone) return aDone ? -1 : 1;
        return a.id - b.id;
      });

    return [
      ...sortCompletedFirst(selectedDaily),
      ...sortCompletedFirst(selectedWeekly),
    ];
  }, [challenges, progress]);

  useEffect(() => {
    if (loading || error || orderedChallenges.length === 0) return;

    const claimable = orderedChallenges.filter((challenge) => {
      const value = progress[challenge.challenge_key] || 0;
      if (value < challenge.target) return false;

      const periodKey = periodKeyForChallenge(challenge);
      const key = completionKey(challenge.id, periodKey);

      return !completedChallenges.has(key) && !claimingChallenges.has(key);
    });

    if (claimable.length === 0) return;

    const keys = claimable.map((challenge) =>
      completionKey(challenge.id, periodKeyForChallenge(challenge))
    );

    setClaimingChallenges((current) => {
      const next = new Set(current);
      keys.forEach((key) => next.add(key));
      return next;
    });

    void (async () => {
      for (const challenge of claimable) {
        const periodKey = periodKeyForChallenge(challenge);
        const key = completionKey(challenge.id, periodKey);

        const { error: claimError } = await supabase.rpc("claim_challenge", {
          requested_challenge_id: challenge.id,
          requested_period_key: periodKey,
        });

        if (!claimError) {
          setSuccessMessage({
            title: t[challenge.challenge_key] || challenge.challenge_key,
            reward: challenge.reward_points,
          });

          window.setTimeout(() => {
            setSuccessMessage(null);
          }, 5000);

          setCompletedChallenges((current) => {
            const next = new Set(current);
            next.add(key);
            return next;
          });
        } else {
          console.error("Challenge claim failed:", claimError);
        }

        setClaimingChallenges((current) => {
          const next = new Set(current);
          next.delete(key);
          return next;
        });
      }
    })();
  }, [loading, error, orderedChallenges, progress, completedChallenges, claimingChallenges]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07110e_0%,#091713_50%,#050a08_100%)] text-white">
      <Navbar/>
      <section className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-green-400">{t.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">{t.title}</h1>
        <p className="mt-2 max-w-2xl text-sm text-green-100/50">{t.intro}</p>

        {successMessage && (
          <div className="mt-6 flex items-start gap-4 rounded-2xl border border-green-300/25 bg-green-400/10 p-4 shadow-[0_16px_40px_rgba(34,197,94,0.12)]">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-400/15 text-2xl">🎉</div>
            <div>
              <p className="font-black text-green-200">{t.claimSuccess}</p>
              <p className="mt-1 text-sm text-green-100/70">
                {successMessage.title} · <span className="font-black text-green-300">+{successMessage.reward}</span> {t.pointsEarned}
              </p>
            </div>
          </div>
        )}

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
              const periodKey=periodKeyForChallenge(ch);
              const stateKey=completionKey(ch.id,periodKey);
              const claimed=completedChallenges.has(stateKey);
              const claiming=claimingChallenges.has(stateKey);
              const title=t[ch.challenge_key] || ch.challenge_key;
              return (
                <article
                  key={ch.id}
                  className={`relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 ${
                    done
                      ? "border-green-300/30 bg-gradient-to-br from-green-800/55 via-green-950/80 to-[#050b09] shadow-[0_18px_50px_rgba(34,197,94,0.12)]"
                      : "border-green-400/15 bg-gradient-to-br from-[#123522]/90 via-[#0a1d14]/95 to-[#050b09] shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
                  }`}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-green-300/30 to-transparent" />

                  <div className="relative flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center rounded-lg border border-green-300/15 bg-green-400/[0.09] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.08em] text-green-300 shadow-sm">
                        {ch.challenge_type==="daily" ? `☀️ ${t.daily}` : `📅 ${t.weekly}`}
                      </span>
                      <h2 className="mt-4 text-xl font-black tracking-[-0.01em] text-white">{title}</h2>
                    </div>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.035] text-2xl shadow-inner">
                      {done ? "✅" : ch.challenge_type==="daily" ? "🎯" : "🔥"}
                    </div>
                  </div>

                  <div className="relative mt-7 flex items-end justify-between gap-4">
                    <span className="text-xs font-extrabold text-green-100/55">{t.progress}</span>
                    <span className={`text-xl font-black tabular-nums ${done ? "text-green-200" : "text-green-300"}`}>
                      {shown}<span className="text-green-100/45">/</span>{ch.target}
                    </span>
                  </div>
                  <div className="relative mt-2.5 h-3 overflow-hidden rounded-full border border-white/[0.04] bg-white/[0.09] shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-green-500 via-green-400 to-emerald-300 shadow-[0_0_14px_rgba(74,222,128,0.35)] transition-all duration-500"
                      style={{width:`${percentage}%`}}
                    />
                  </div>

                  <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                    <span className="text-sm font-semibold text-green-100/60">
                      🎁 <span className="font-black text-green-300">+{ch.reward_points}</span> {t.reward}
                    </span>
                    {done && (
                      <span className="rounded-lg border border-green-300/20 bg-green-400/10 px-3 py-1.5 text-xs font-black text-green-200 shadow-sm">
                        {claiming ? "..." : claimed ? `✓ ${t.complete}` : t.complete}
                      </span>
                    )}
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
