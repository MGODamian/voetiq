"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../Navbar";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Profile = {
  username: string;
  first_name: string;
  last_name: string;
  is_premium: boolean;
  premium_expires_at: string | null;
};

type Prediction = {
  id: number;
  match_name: string;
  home_score: number;
  away_score: number;
  actual_home_score: number | null;
  actual_away_score: number | null;
  points: number | null;
  created_at: string;
  competition_code: string | null;
  kickoff_at: string | null;
};

type AchievementStats = {
  total_points:number; predictions_count:number; played_predictions:number; exact_scores:number; correct_results:number;
  competitions_played:number; best_correct_streak:number; best_exact_streak:number; best_competition_correct_results:number;
};

type ProfileRank = { rank:number; total_players:number };

type Pool = {
  id: string;
  name: string;
  competition_code: string;
  created_at: string;
};

type Challenge = {
  id: number;
  challenge_key: string;
  challenge_type: "daily" | "weekly";
  target: number;
  reward_points: number;
};

type FootballRank = {
  min: number;
  max: number | null;
  icon: string;
  names: Record<LanguageCode, string>;
};

const footballRanks: FootballRank[] = [
  { min:0,max:49,icon:"🟤",names:{nl:"Straatvoetballer",en:"Street Footballer",de:"Straßenfußballer",es:"Futbolista callejero",fr:"Footballeur de rue",it:"Calciatore di strada",pt:"Futebolista de rua"}},
  { min:50,max:99,icon:"🟢",names:{nl:"Jeugdspeler",en:"Youth Player",de:"Jugendspieler",es:"Jugador juvenil",fr:"Joueur junior",it:"Giocatore giovanile",pt:"Jogador juvenil"}},
  { min:100,max:199,icon:"🔵",names:{nl:"Academiespeler",en:"Academy Player",de:"Akademiespieler",es:"Jugador de academia",fr:"Joueur d’académie",it:"Giocatore dell’accademia",pt:"Jogador da academia"}},
  { min:200,max:349,icon:"⚪",names:{nl:"Selectiespeler",en:"Squad Player",de:"Kaderspieler",es:"Jugador de plantilla",fr:"Joueur de l’effectif",it:"Giocatore della rosa",pt:"Jogador do plantel"}},
  { min:350,max:549,icon:"🟡",names:{nl:"Basisspeler",en:"Starting Player",de:"Stammspieler",es:"Titular",fr:"Titulaire",it:"Titolare",pt:"Titular"}},
  { min:550,max:799,icon:"🟠",names:{nl:"Profvoetballer",en:"Professional Footballer",de:"Profifußballer",es:"Futbolista profesional",fr:"Footballeur professionnel",it:"Calciatore professionista",pt:"Futebolista profissional"}},
  { min:800,max:1099,icon:"🔥",names:{nl:"Sterspeler",en:"Star Player",de:"Starspieler",es:"Jugador estrella",fr:"Joueur vedette",it:"Giocatore stella",pt:"Jogador estrela"}},
  { min:1100,max:1499,icon:"⭐",names:{nl:"Topspeler",en:"Top Player",de:"Topspieler",es:"Jugador de élite",fr:"Joueur d’élite",it:"Top player",pt:"Jogador de elite"}},
  { min:1500,max:1999,icon:"🌟",names:{nl:"Wereldster",en:"World Star",de:"Weltstar",es:"Estrella mundial",fr:"Star mondiale",it:"Stella mondiale",pt:"Estrela mundial"}},
  { min:2000,max:2749,icon:"🏆",names:{nl:"Kampioen",en:"Champion",de:"Champion",es:"Campeón",fr:"Champion",it:"Campione",pt:"Campeão"}},
  { min:2750,max:3499,icon:"👑",names:{nl:"Ballon d'Or-niveau",en:"Ballon d'Or Level",de:"Ballon-d’Or-Niveau",es:"Nivel Balón de Oro",fr:"Niveau Ballon d’Or",it:"Livello Pallone d’Oro",pt:"Nível Bola de Ouro"}},
  { min:3500,max:null,icon:"🐐",names:{nl:"VoetIQ GOAT",en:"VoetIQ GOAT",de:"VoetIQ GOAT",es:"VoetIQ GOAT",fr:"VoetIQ GOAT",it:"VoetIQ GOAT",pt:"VoetIQ GOAT"}},
];

const ui = {
  nl:{kicker:"JOUW VOETIQ",title:"Dashboard",hello:"Welkom terug",subtitle:"Alles wat belangrijk is voor jouw VoetIQ-carrière op één plek.",points:"Totaalpunten",rank:"Voetbalrang",leaderboard:"Ranglijst",predictions:"Voorspellingen",of:"van",players:"spelers",next:"Volgende rang",needed:"punten nodig",upcoming:"Eerstvolgende voorspellingen",recent:"Recente resultaten",noneUpcoming:"Je hebt geen komende voorspellingen.",noneRecent:"Nog geen gespeelde voorspellingen.",viewPredictions:"Alle voorspellingen",makePrediction:"Voorspel wedstrijden",viewLeaderboard:"Bekijk ranglijst",pools:"Poules",poolsText:"Speel samen met vrienden en bekijk je poules.",challenges:"Challenges",challengesText:"Bekijk je dagelijkse en wekelijkse uitdagingen.",achievements:"Achievements",achievementsText:"Bekijk welke mijlpalen je al hebt bereikt.",open:"Openen",yourPrediction:"Jouw voorspelling",result:"Eindstand",pointsShort:"pt",premium:"Premium",active:"Actief",onboardingTitle:"Zo werkt VoetIQ",onboardingText:"Begin hier en bouw stap voor stap aan je VoetIQ-carrière.",onboardingPrediction:"Doe je eerste voorspelling",onboardingPoints:"Verdien je eerste punten",onboardingPool:"Word lid van een poule",onboardingRank:"Klim op de ranglijst",onboardingDone:"Klaar",onboardingStart:"Start",loading:"Dashboard laden...",error:"Dashboard kon niet worden geladen."},
  en:{kicker:"YOUR VOETIQ",title:"Dashboard",hello:"Welcome back",subtitle:"Everything that matters for your VoetIQ career in one place.",points:"Total points",rank:"Football rank",leaderboard:"Leaderboard",predictions:"Predictions",of:"of",players:"players",next:"Next rank",needed:"points needed",upcoming:"Next predictions",recent:"Recent results",noneUpcoming:"You have no upcoming predictions.",noneRecent:"No played predictions yet.",viewPredictions:"All predictions",makePrediction:"Predict matches",viewLeaderboard:"View leaderboard",pools:"Pools",poolsText:"Play with friends and view your pools.",challenges:"Challenges",challengesText:"View your daily and weekly challenges.",achievements:"Achievements",achievementsText:"See which milestones you have reached.",open:"Open",yourPrediction:"Your prediction",result:"Final score",pointsShort:"pts",premium:"Premium",active:"Active",onboardingTitle:"How VoetIQ works",onboardingText:"Start here and build your VoetIQ career step by step.",onboardingPrediction:"Make your first prediction",onboardingPoints:"Earn your first points",onboardingPool:"Join a pool",onboardingRank:"Climb the leaderboard",onboardingDone:"Done",onboardingStart:"Start",loading:"Loading dashboard...",error:"Dashboard could not be loaded."},
  de:{kicker:"DEIN VOETIQ",title:"Dashboard",hello:"Willkommen zurück",subtitle:"Alles Wichtige für deine VoetIQ-Karriere an einem Ort.",points:"Gesamtpunkte",rank:"Fußballrang",leaderboard:"Rangliste",predictions:"Tipps",of:"von",players:"Spielern",next:"Nächster Rang",needed:"Punkte benötigt",upcoming:"Nächste Tipps",recent:"Letzte Ergebnisse",noneUpcoming:"Du hast keine kommenden Tipps.",noneRecent:"Noch keine gespielten Tipps.",viewPredictions:"Alle Tipps",makePrediction:"Spiele tippen",viewLeaderboard:"Rangliste ansehen",pools:"Pools",poolsText:"Spiele mit Freunden und sieh deine Pools.",challenges:"Challenges",challengesText:"Sieh deine täglichen und wöchentlichen Challenges.",achievements:"Erfolge",achievementsText:"Sieh deine erreichten Meilensteine.",open:"Öffnen",yourPrediction:"Dein Tipp",result:"Endstand",pointsShort:"Pkt.",premium:"Premium",active:"Aktiv",onboardingTitle:"So funktioniert VoetIQ",onboardingText:"Starte hier und baue deine VoetIQ-Karriere Schritt für Schritt auf.",onboardingPrediction:"Gib deinen ersten Tipp ab",onboardingPoints:"Verdiene deine ersten Punkte",onboardingPool:"Tritt einer Tipprunde bei",onboardingRank:"Steige in der Rangliste",onboardingDone:"Erledigt",onboardingStart:"Start",loading:"Dashboard wird geladen...",error:"Dashboard konnte nicht geladen werden."},
  es:{kicker:"TU VOETIQ",title:"Panel",hello:"Bienvenido de nuevo",subtitle:"Todo lo importante de tu carrera en VoetIQ en un solo lugar.",points:"Puntos totales",rank:"Rango de fútbol",leaderboard:"Clasificación",predictions:"Pronósticos",of:"de",players:"jugadores",next:"Siguiente rango",needed:"puntos necesarios",upcoming:"Próximos pronósticos",recent:"Resultados recientes",noneUpcoming:"No tienes próximos pronósticos.",noneRecent:"Aún no hay pronósticos jugados.",viewPredictions:"Todos los pronósticos",makePrediction:"Pronosticar partidos",viewLeaderboard:"Ver clasificación",pools:"Ligas",poolsText:"Juega con amigos y consulta tus ligas.",challenges:"Desafíos",challengesText:"Consulta tus desafíos diarios y semanales.",achievements:"Logros",achievementsText:"Consulta los hitos que has alcanzado.",open:"Abrir",yourPrediction:"Tu pronóstico",result:"Resultado final",pointsShort:"pts",premium:"Premium",active:"Activo",onboardingTitle:"Así funciona VoetIQ",onboardingText:"Empieza aquí y construye tu carrera en VoetIQ paso a paso.",onboardingPrediction:"Haz tu primer pronóstico",onboardingPoints:"Consigue tus primeros puntos",onboardingPool:"Únete a una liga",onboardingRank:"Sube en la clasificación",onboardingDone:"Hecho",onboardingStart:"Empezar",loading:"Cargando panel...",error:"No se pudo cargar el panel."},
  fr:{kicker:"TON VOETIQ",title:"Tableau de bord",hello:"Bon retour",subtitle:"Tout ce qui compte pour ta carrière VoetIQ au même endroit.",points:"Points totaux",rank:"Rang football",leaderboard:"Classement",predictions:"Pronostics",of:"sur",players:"joueurs",next:"Rang suivant",needed:"points nécessaires",upcoming:"Prochains pronostics",recent:"Résultats récents",noneUpcoming:"Tu n’as aucun pronostic à venir.",noneRecent:"Aucun pronostic joué pour le moment.",viewPredictions:"Tous les pronostics",makePrediction:"Pronostiquer",viewLeaderboard:"Voir le classement",pools:"Poules",poolsText:"Joue avec tes amis et consulte tes poules.",challenges:"Challenges",challengesText:"Consulte tes défis quotidiens et hebdomadaires.",achievements:"Succès",achievementsText:"Découvre les étapes que tu as déjà franchies.",open:"Ouvrir",yourPrediction:"Ton pronostic",result:"Score final",pointsShort:"pts",premium:"Premium",active:"Actif",onboardingTitle:"Comment fonctionne VoetIQ",onboardingText:"Commence ici et construis ta carrière VoetIQ étape par étape.",onboardingPrediction:"Fais ton premier pronostic",onboardingPoints:"Gagne tes premiers points",onboardingPool:"Rejoins une poule",onboardingRank:"Monte au classement",onboardingDone:"Terminé",onboardingStart:"Commencer",loading:"Chargement du tableau de bord...",error:"Impossible de charger le tableau de bord."},
  it:{kicker:"IL TUO VOETIQ",title:"Dashboard",hello:"Bentornato",subtitle:"Tutto ciò che conta per la tua carriera VoetIQ in un unico posto.",points:"Punti totali",rank:"Rango calcistico",leaderboard:"Classifica",predictions:"Pronostici",of:"su",players:"giocatori",next:"Rango successivo",needed:"punti necessari",upcoming:"Prossimi pronostici",recent:"Risultati recenti",noneUpcoming:"Non hai pronostici futuri.",noneRecent:"Nessun pronostico giocato.",viewPredictions:"Tutti i pronostici",makePrediction:"Pronostica partite",viewLeaderboard:"Vedi classifica",pools:"Gironi",poolsText:"Gioca con gli amici e visualizza i tuoi gironi.",challenges:"Sfide",challengesText:"Visualizza le sfide giornaliere e settimanali.",achievements:"Obiettivi",achievementsText:"Scopri i traguardi che hai raggiunto.",open:"Apri",yourPrediction:"Il tuo pronostico",result:"Risultato finale",pointsShort:"pt",premium:"Premium",active:"Attivo",onboardingTitle:"Come funziona VoetIQ",onboardingText:"Inizia qui e costruisci la tua carriera VoetIQ passo dopo passo.",onboardingPrediction:"Fai il tuo primo pronostico",onboardingPoints:"Guadagna i tuoi primi punti",onboardingPool:"Unisciti a un girone",onboardingRank:"Sali in classifica",onboardingDone:"Fatto",onboardingStart:"Inizia",loading:"Caricamento dashboard...",error:"Impossibile caricare la dashboard."},
  pt:{kicker:"O TEU VOETIQ",title:"Dashboard",hello:"Bem-vindo de volta",subtitle:"Tudo o que importa para a tua carreira VoetIQ num só lugar.",points:"Pontos totais",rank:"Nível futebolístico",leaderboard:"Classificação",predictions:"Previsões",of:"de",players:"jogadores",next:"Próximo nível",needed:"pontos necessários",upcoming:"Próximas previsões",recent:"Resultados recentes",noneUpcoming:"Não tens previsões futuras.",noneRecent:"Ainda não há previsões jogadas.",viewPredictions:"Todas as previsões",makePrediction:"Prever jogos",viewLeaderboard:"Ver classificação",pools:"Grupos",poolsText:"Joga com amigos e consulta os teus grupos.",challenges:"Desafios",challengesText:"Consulta os teus desafios diários e semanais.",achievements:"Conquistas",achievementsText:"Vê os marcos que já alcançaste.",open:"Abrir",yourPrediction:"A tua previsão",result:"Resultado final",pointsShort:"pts",premium:"Premium",active:"Ativo",onboardingTitle:"Como funciona o VoetIQ",onboardingText:"Começa aqui e constrói a tua carreira VoetIQ passo a passo.",onboardingPrediction:"Faz a tua primeira previsão",onboardingPoints:"Ganha os teus primeiros pontos",onboardingPool:"Entra num grupo",onboardingRank:"Sobe na classificação",onboardingDone:"Concluído",onboardingStart:"Começar",loading:"A carregar dashboard...",error:"Não foi possível carregar o dashboard."},
} satisfies Record<LanguageCode, Record<string,string>>;

function validLanguage(value:string|null): value is LanguageCode {
  return ["nl","en","de","es","fr","it","pt"].includes(value || "");
}

function played(p:Prediction) {
  return p.actual_home_score !== null && p.actual_away_score !== null;
}

const competitionInfo: Record<string,{name:string;flag:string}> = {
  DED:{name:"Eredivisie",flag:"🇳🇱"}, PL:{name:"Premier League",flag:"🏴"}, PD:{name:"La Liga",flag:"🇪🇸"},
  BL1:{name:"Bundesliga",flag:"🇩🇪"}, SA:{name:"Serie A",flag:"🇮🇹"}, FL1:{name:"Ligue 1",flag:"🇫🇷"},
  PPL:{name:"Primeira Liga",flag:"🇵🇹"}, CL:{name:"Champions League",flag:"🏆"}
};

export default function DashboardPage() {
  const router = useRouter();
  const [language,setLanguage] = useState<LanguageCode>("nl");
  const [profile,setProfile] = useState<Profile|null>(null);
  const [predictions,setPredictions] = useState<Prediction[]>([]);
  const [challenges,setChallenges] = useState<Challenge[]>([]);
  const [pools,setPools] = useState<Pool[]>([]);
  const [achievementStats,setAchievementStats] = useState<AchievementStats|null>(null);
  const [achievementRank,setAchievementRank] = useState<ProfileRank|null>(null);
  const [rankPosition,setRankPosition] = useState<number|null>(null);
  const [totalPlayers,setTotalPlayers] = useState(0);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");
  const t = ui[language];

  useEffect(() => {
    const stored = localStorage.getItem("voetiq-language");
    if (validLanguage(stored)) setLanguage(stored);
    const change = () => {
      const next = localStorage.getItem("voetiq-language");
      if (validLanguage(next)) setLanguage(next);
    };
    window.addEventListener("voetiq-language-change",change);
    void loadDashboard();
    return () => window.removeEventListener("voetiq-language-change",change);
  },[]);

  async function loadDashboard() {
    setLoading(true); setError("");
    try {
      const {data:{user},error:userError} = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) { router.replace("/inloggen?redirect=/dashboard"); return; }

      const membershipResult = await supabase.from("pool_members").select("pool_id").eq("user_id",user.id);
      const poolIds = (membershipResult.data || []).map((row:{pool_id:string})=>row.pool_id);

      const [profileResult,predictionResult,leaderboardResult,challengeResult,poolResult,achievementStatsResult,achievementRankResult] = await Promise.all([
        supabase.from("profiles").select("username, first_name, last_name, is_premium, premium_expires_at").eq("id",user.id).maybeSingle(),
        supabase.from("predictions").select("id, match_name, home_score, away_score, actual_home_score, actual_away_score, points, created_at, competition_code, kickoff_at").eq("user_id",user.id).order("kickoff_at",{ascending:false}),
        supabase.rpc("get_leaderboard"),
        supabase.from("challenges").select("id, challenge_key, challenge_type, target, reward_points").eq("active",true).order("id"),
        poolIds.length > 0
          ? supabase.from("pools").select("id, name, competition_code, created_at").in("id",poolIds).order("created_at",{ascending:false})
          : Promise.resolve({data:[],error:null}),
        supabase.rpc("get_public_achievement_stats",{requested_user_id:user.id}),
        supabase.rpc("get_public_profile_rank",{requested_user_id:user.id}),
      ]);
      if (profileResult.error) throw profileResult.error;
      if (predictionResult.error) throw predictionResult.error;
      if (!profileResult.data) throw new Error("Profile not found");

      const loadedProfile = profileResult.data as Profile;

      setProfile(loadedProfile);
      setPredictions((predictionResult.data || []) as Prediction[]);
      if (!challengeResult.error) setChallenges((challengeResult.data || []) as Challenge[]);
      if (!poolResult.error) setPools((poolResult.data || []) as Pool[]);
      if (!achievementStatsResult.error && achievementStatsResult.data?.[0]) setAchievementStats(achievementStatsResult.data[0] as AchievementStats);
      if (!achievementRankResult.error && achievementRankResult.data?.[0]) setAchievementRank(achievementRankResult.data[0] as ProfileRank);

      if (!leaderboardResult.error) {
        const ranking = (leaderboardResult.data || []) as {username:string;total_points:number}[];
        setTotalPlayers(ranking.length);
        const index = ranking.findIndex(x => x.username === loadedProfile.username);
        setRankPosition(index >= 0 ? index + 1 : null);
      }
    } catch(e) {
      console.error("DASHBOARD FOUT:",e);
      setError(e instanceof Error ? e.message : t.error);
    } finally { setLoading(false); }
  }

  const totalPoints = useMemo(() => predictions.reduce((sum,p)=>sum+Number(p.points||0),0),[predictions]);
  const rankIndex = Math.max(0,footballRanks.findIndex(r=>totalPoints>=r.min&&(r.max===null||totalPoints<=r.max)));
  const currentRank = footballRanks[rankIndex];
  const nextRank = rankIndex < footballRanks.length-1 ? footballRanks[rankIndex+1] : null;
  const progress = nextRank ? Math.min(100,Math.max(0,((totalPoints-currentRank.min)/(nextRank.min-currentRank.min))*100)) : 100;

  const upcoming = useMemo(()=>[...predictions].filter(p=>!played(p)).sort((a,b)=>new Date(a.kickoff_at||0).getTime()-new Date(b.kickoff_at||0).getTime()).slice(0,3),[predictions]);
  const recent = useMemo(()=>[...predictions].filter(played).sort((a,b)=>new Date(b.kickoff_at||b.created_at).getTime()-new Date(a.kickoff_at||a.created_at).getTime()).slice(0,3),[predictions]);
  const challengeProgress = useMemo(() => {
    const dayStart = new Date(); dayStart.setHours(0,0,0,0);
    const weekStart = new Date(dayStart); const day = weekStart.getDay(); weekStart.setDate(weekStart.getDate() - (day === 0 ? 6 : day - 1));
    const correct = (p:Prediction) => {
      if (!played(p)) return false;
      const predicted = p.home_score === p.away_score ? 0 : p.home_score > p.away_score ? 1 : -1;
      const actual = p.actual_home_score === p.actual_away_score ? 0 : Number(p.actual_home_score) > Number(p.actual_away_score) ? 1 : -1;
      return predicted === actual;
    };
    const daily = predictions.filter(p => new Date(p.created_at).getTime() >= dayStart.getTime());
    const weekly = predictions.filter(p => new Date(p.created_at).getTime() >= weekStart.getTime());
    return {
      daily_predict_3: daily.length,
      daily_correct_2: daily.filter(correct).length,
      weekly_predict_10: weekly.length,
      weekly_score_50: weekly.reduce((n,p)=>n+Number(p.points||0),0),
    } as Record<string,number>;
  },[predictions]);

  const achievementUnlockedCount = useMemo(() => {
    if (!achievementStats) return 0;
    const a=achievementStats;
    const values:[number,number][]=[
      [a.exact_scores,1],[a.exact_scores,5],[a.exact_scores,10],[a.exact_scores,25],
      [a.correct_results,1],[a.correct_results,10],[a.correct_results,25],[a.correct_results,50],
      [a.predictions_count,1],[a.predictions_count,10],[a.predictions_count,50],[a.predictions_count,100],
      [a.total_points,1],[a.total_points,100],[a.total_points,250],[a.total_points,500],[a.total_points,1000],
      [a.best_correct_streak,3],[a.best_correct_streak,5],[a.best_exact_streak,3],
      [achievementRank && achievementRank.rank<=3?1:0,1],[achievementRank?.rank===1?1:0,1],
      [a.competitions_played,3],[a.competitions_played,8],[a.best_competition_correct_results,10],[a.predictions_count,250]
    ];
    return values.filter(([v,target])=>Number(v)>=target).length;
  },[achievementStats,achievementRank]);
  const achievementTotal = 26;

  const premiumActive = Boolean(profile?.is_premium && (!profile.premium_expires_at || new Date(profile.premium_expires_at).getTime()>Date.now()));
  const onboardingSteps = [
    {icon:"⚽",label:t.onboardingPrediction,done:predictions.length>0,href:"/wedstrijden"},
    {icon:"🎯",label:t.onboardingPoints,done:totalPoints>0,href:"/wedstrijden"},
    {icon:"👥",label:t.onboardingPool,done:pools.length>0,href:"/poules"},
    {icon:"🏆",label:t.onboardingRank,done:totalPoints>0,href:"/ranglijst"},
  ];
  const onboardingComplete = onboardingSteps.every(step=>step.done);

  const challengeNames: Record<LanguageCode,Record<string,string>> = {
    nl:{daily_predict_3:"Doe 3 voorspellingen",daily_correct_2:"Voorspel 2 juiste uitslagen",weekly_predict_10:"Doe 10 voorspellingen",weekly_score_50:"Verdien 50 punten"},
    en:{daily_predict_3:"Make 3 predictions",daily_correct_2:"Predict 2 correct results",weekly_predict_10:"Make 10 predictions",weekly_score_50:"Earn 50 points"},
    de:{daily_predict_3:"Gib 3 Tipps ab",daily_correct_2:"Tippe 2 richtige Ausgänge",weekly_predict_10:"Gib 10 Tipps ab",weekly_score_50:"Verdiene 50 Punkte"},
    es:{daily_predict_3:"Haz 3 predicciones",daily_correct_2:"Predice 2 resultados correctos",weekly_predict_10:"Haz 10 predicciones",weekly_score_50:"Consigue 50 puntos"},
    fr:{daily_predict_3:"Fais 3 pronostics",daily_correct_2:"Pronostique 2 bons résultats",weekly_predict_10:"Fais 10 pronostics",weekly_score_50:"Gagne 50 points"},
    it:{daily_predict_3:"Fai 3 pronostici",daily_correct_2:"Pronostica 2 esiti corretti",weekly_predict_10:"Fai 10 pronostici",weekly_score_50:"Guadagna 50 punti"},
    pt:{daily_predict_3:"Faz 3 previsões",daily_correct_2:"Prevê 2 resultados corretos",weekly_predict_10:"Faz 10 previsões",weekly_score_50:"Ganha 50 pontos"}
  };

  const locale = language==="nl"?"nl-NL":language==="en"?"en-GB":language==="de"?"de-DE":language==="es"?"es-ES":language==="fr"?"fr-FR":language==="it"?"it-IT":"pt-PT";
  const date = (value:string|null) => value ? new Date(value).toLocaleString(locale,{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}) : "";

  return <>
    <Navbar />
    <main className="page"><div className="wrap">
      {loading ? <div className="state">{t.loading}</div> : error ? <div className="state error">{error}</div> : profile && <>
        <section className="hero">
          <div><div className="kicker">{t.kicker}</div><h1>{t.hello}, {profile.first_name || profile.username} 👋</h1><p>{t.subtitle}</p></div>
          {premiumActive && <div className="premium">👑 {t.premium} · {t.active}</div>}
        </section>

        {!onboardingComplete && <section className="onboarding">
          <div className="onboardingIntro"><div><h2>👋 {t.onboardingTitle}</h2><p>{t.onboardingText}</p></div><strong>{onboardingSteps.filter(step=>step.done).length}/4</strong></div>
          <div className="onboardingSteps">
            {onboardingSteps.map((step,index)=><button key={step.label} className={step.done?"onboardingStep done":"onboardingStep"} onClick={()=>router.push(step.href)}>
              <span className="stepNumber">{step.done?"✓":index+1}</span><span className="stepIcon">{step.icon}</span><b>{step.label}</b><small>{step.done?t.onboardingDone:t.onboardingStart} →</small>
            </button>)}
          </div>
        </section>}

        <section className="stats">
          <button onClick={()=>router.push("/profiel")}><span>⭐</span><strong>{totalPoints}</strong><small>{t.points}</small></button>
          <button onClick={()=>router.push("/profiel")}><span>{currentRank.icon}</span><strong>{currentRank.names[language]}</strong><small>{t.rank}</small></button>
          <button onClick={()=>router.push("/ranglijst")}><span>🏆</span><strong>{rankPosition ? `#${rankPosition}` : "—"}</strong><small>{t.leaderboard}{totalPlayers ? ` · ${t.of} ${totalPlayers}` : ""}</small></button>
          <button onClick={()=>router.push("/mijn-voorspellingen")}><span>⚽</span><strong>{predictions.length}</strong><small>{t.predictions}</small></button>
        </section>

        <section className="rankCard">
          <div className="rankTop"><div><b>{currentRank.icon} {currentRank.names[language]}</b>{nextRank && <small>{t.next}: {nextRank.icon} {nextRank.names[language]}</small>}</div>{nextRank && <strong>{nextRank.min-totalPoints} {t.needed}</strong>}</div>
          <div className="bar"><i style={{width:`${progress}%`}} /></div>
        </section>

        <div className="two">
          <DashboardList title={`⏳ ${t.upcoming}`} empty={t.noneUpcoming} action={t.viewPredictions} onAction={()=>router.push("/mijn-voorspellingen")}>
            {upcoming.map(p=><div className="match" key={p.id}><div><b>{p.match_name}</b><small>{date(p.kickoff_at)}</small></div><div className="score"><small>{t.yourPrediction}</small><strong>{p.home_score} - {p.away_score}</strong></div></div>)}
          </DashboardList>
          <DashboardList title={`✅ ${t.recent}`} empty={t.noneRecent} action={t.viewPredictions} onAction={()=>router.push("/mijn-voorspellingen")}>
            {recent.map(p=><div className="match" key={p.id}><div><b>{p.match_name}</b><small>{t.result}: {p.actual_home_score} - {p.actual_away_score}</small></div><div className="earned">+{Number(p.points||0)} {t.pointsShort}</div></div>)}
          </DashboardList>
        </div>

        {pools.length > 0 && <section className="poolBox">
          <div className="challengeHead"><h2>👥 {t.pools}</h2><button onClick={()=>router.push("/poules")}>{t.open} →</button></div>
          <div className="poolGrid">
            {pools.slice(0,4).map(pool=>{
              const comp=competitionInfo[pool.competition_code] || {name:pool.competition_code,flag:"⚽"};
              return <button key={pool.id} className="poolCard" onClick={()=>router.push(`/poules/${pool.id}`)}>
                <span>{comp.flag}</span><div><b>{pool.name}</b><small>{comp.name}</small></div><strong>→</strong>
              </button>
            })}
          </div>
        </section>}

        {challenges.length > 0 && <section className="challengeBox">
          <div className="challengeHead"><h2>🎯 {t.challenges}</h2><button onClick={()=>router.push("/challenges")}>{t.open} →</button></div>
          <div className="challengeGrid">
            {challenges.map(ch=>{
              const value=challengeProgress[ch.challenge_key]||0;
              const shown=Math.min(value,ch.target);
              const pct=Math.min(100,(value/ch.target)*100);
              const done=value>=ch.target;
              return <button key={ch.id} className="challengeCard" onClick={()=>router.push("/challenges")}>
                <div className="challengeTop"><b>{challengeNames[language][ch.challenge_key]||ch.challenge_key}</b><span>{done?"✅":ch.challenge_type==="daily"?"☀️":"📅"}</span></div>
                <div className="challengeValue">{shown}/{ch.target}</div>
                <div className="challengeBar"><i style={{width:`${pct}%`}} /></div>
                <small>🎁 +{ch.reward_points}</small>
              </button>
            })}
          </div>
        </section>}

        {achievementStats && <section className="achievementBox">
          <div className="challengeHead"><h2>🏅 {t.achievements}</h2><button onClick={()=>router.push("/achievements")}>{t.open} →</button></div>
          <button className="achievementSummary" onClick={()=>router.push("/achievements")}>
            <div><strong>{achievementUnlockedCount} / {achievementTotal}</strong><small>{t.achievements}</small></div>
            <div className="achievementProgress"><i style={{width:`${Math.round((achievementUnlockedCount/achievementTotal)*100)}%`}} /></div>
            <span>→</span>
          </button>
        </section>}

        <section className="quick">
          <Quick icon="⚽" title={t.makePrediction} text={t.upcoming} onClick={()=>router.push("/wedstrijden")} />
          <Quick icon="👥" title={t.pools} text={t.poolsText} onClick={()=>router.push("/poules")} />
          <Quick icon="🎯" title={t.challenges} text={t.challengesText} onClick={()=>router.push("/challenges")} />
          <Quick icon="🏅" title={t.achievements} text={t.achievementsText} onClick={()=>router.push("/achievements")} />
        </section>
      </>}
    </div></main>

    <style jsx>{`
      .page{min-height:100vh;background:radial-gradient(circle at 50% 0%,rgba(15,122,70,.2),transparent 32%),linear-gradient(180deg,#00170e 0%,#00110a 48%,#000d08 100%);color:#fff;padding:42px 20px 90px}.wrap{max-width:1120px;margin:auto}
      .state{padding:30px;border:1px solid rgba(74,222,128,.18);background:#06271a;border-radius:18px;text-align:center;color:#a9bbb0}.error{color:#fecaca;border-color:#7f1d1d}
      .hero{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:24px}.kicker{color:#41e58b;font-size:12px;font-weight:950;letter-spacing:1.2px}.hero h1{font-size:clamp(30px,5vw,44px);margin:7px 0 8px}.hero p{color:#9fb5a9;margin:0;max-width:650px}.premium{padding:9px 12px;border:1px solid rgba(250,204,21,.24);background:rgba(250,204,21,.08);color:#fde68a;border-radius:999px;font-weight:900;font-size:12px}
      .onboarding{border:1px solid rgba(65,229,139,.24);background:linear-gradient(145deg,rgba(7,52,33,.96),rgba(0,23,14,.98));border-radius:18px;padding:18px;margin-bottom:16px}.onboardingIntro{display:flex;align-items:flex-start;justify-content:space-between;gap:18px;margin-bottom:14px}.onboardingIntro h2{font-size:17px;margin:0 0 5px}.onboardingIntro p{color:#8da397;font-size:11px;margin:0}.onboardingIntro>strong{color:#41e58b;font-size:14px}.onboardingSteps{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.onboardingStep{border:1px solid rgba(80,190,130,.14);background:#041e14;color:white;border-radius:13px;padding:12px;text-align:left;cursor:pointer;display:grid;grid-template-columns:auto 1fr;gap:5px 8px;align-items:center}.onboardingStep:hover{border-color:rgba(65,229,139,.4)}.onboardingStep.done{opacity:.68}.stepNumber{display:grid;place-items:center;width:20px;height:20px;border-radius:50%;background:#0b4b30;color:#83e7ae;font-size:10px;font-weight:950}.stepIcon{font-size:17px}.onboardingStep b{grid-column:1/-1;font-size:11px}.onboardingStep small{grid-column:1/-1;color:#41e58b;font-size:9px;font-weight:900}
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px}.stats button{cursor:pointer;text-align:left;border:1px solid rgba(80,190,130,.18);background:linear-gradient(145deg,#06271a,#00170e);border-radius:16px;padding:17px;color:white;display:flex;flex-direction:column;gap:5px}.stats button:hover{border-color:rgba(65,229,139,.4)}.stats span{font-size:20px}.stats strong{font-size:21px}.stats small{color:#81998c;font-weight:800}
      .rankCard{border:1px solid rgba(80,190,130,.18);background:rgba(6,39,26,.72);border-radius:16px;padding:17px;margin-bottom:24px}.rankTop{display:flex;justify-content:space-between;gap:15px;align-items:center}.rankTop>div{display:flex;flex-direction:column;gap:4px}.rankTop small,.rankTop strong{color:#8da397;font-size:11px}.bar{height:8px;background:#00170e;border-radius:999px;overflow:hidden;margin-top:13px}.bar i{display:block;height:100%;background:#22c55e;border-radius:999px}
      .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}.match{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.06)}.match:last-child{border-bottom:0}.match>div:first-child{display:flex;flex-direction:column;gap:4px}.match b{font-size:13px}.match small{color:#789084;font-size:10px}.score{text-align:right;display:flex;flex-direction:column}.score strong{font-size:16px}.earned{color:#41e58b;font-weight:950;font-size:13px;white-space:nowrap}
      .poolBox{border:1px solid rgba(80,190,130,.18);background:linear-gradient(145deg,rgba(6,39,26,.97),rgba(0,23,14,.98));border-radius:18px;padding:18px;margin-bottom:14px}.poolGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.poolCard{display:grid;grid-template-columns:34px 1fr auto;align-items:center;gap:10px;text-align:left;border:1px solid rgba(80,190,130,.14);background:#041e14;color:white;border-radius:14px;padding:14px;cursor:pointer}.poolCard:hover{border-color:rgba(65,229,139,.4)}.poolCard>span{font-size:22px}.poolCard>div{display:flex;flex-direction:column;gap:3px}.poolCard b{font-size:12px}.poolCard small{color:#81998c;font-size:10px}.poolCard strong{color:#41e58b}
      .challengeBox{border:1px solid rgba(80,190,130,.18);background:linear-gradient(145deg,rgba(6,39,26,.97),rgba(0,23,14,.98));border-radius:18px;padding:18px;margin-bottom:14px}.challengeHead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px}.challengeHead h2{font-size:16px;margin:0}.challengeHead button{border:0;background:transparent;color:#41e58b;font-size:10px;font-weight:900;cursor:pointer}.challengeGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.challengeCard{text-align:left;border:1px solid rgba(80,190,130,.14);background:#041e14;color:white;border-radius:14px;padding:14px;cursor:pointer}.challengeCard:hover{border-color:rgba(65,229,139,.4)}.challengeTop{display:flex;justify-content:space-between;gap:10px}.challengeTop b{font-size:12px}.challengeValue{margin-top:12px;color:#41e58b;font-weight:950}.challengeBar{height:6px;background:#00170e;border-radius:999px;overflow:hidden;margin:7px 0}.challengeBar i{display:block;height:100%;background:#22c55e;border-radius:999px}.challengeCard small{color:#81998c;font-size:10px}
      .achievementBox{border:1px solid rgba(80,190,130,.18);background:linear-gradient(145deg,rgba(6,39,26,.97),rgba(0,23,14,.98));border-radius:18px;padding:18px;margin-bottom:14px}.achievementSummary{width:100%;display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:16px;text-align:left;border:1px solid rgba(80,190,130,.14);background:#041e14;color:white;border-radius:14px;padding:15px;cursor:pointer}.achievementSummary:hover{border-color:rgba(65,229,139,.4)}.achievementSummary>div:first-child{display:flex;flex-direction:column;gap:3px;min-width:85px}.achievementSummary strong{font-size:18px;color:#41e58b}.achievementSummary small{font-size:10px;color:#81998c}.achievementProgress{height:8px;background:#00170e;border-radius:999px;overflow:hidden}.achievementProgress i{display:block;height:100%;background:#22c55e;border-radius:999px}.achievementSummary>span{color:#41e58b;font-weight:950}
      .quick{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
      @media(max-width:850px){.stats,.quick,.challengeGrid,.poolGrid,.onboardingSteps{grid-template-columns:repeat(2,1fr)}.two{grid-template-columns:1fr}.hero{flex-direction:column}}
      @media(max-width:520px){.page{padding:28px 14px 70px}.stats,.quick,.challengeGrid,.poolGrid,.onboardingSteps{grid-template-columns:1fr 1fr}.rankTop{align-items:flex-start;flex-direction:column}}
    `}</style>
  </>;
}

function DashboardList({title,empty,action,onAction,children}:{title:string;empty:string;action:string;onAction:()=>void;children:React.ReactNode}) {
  const hasChildren = Array.isArray(children) ? children.length>0 : Boolean(children);
  return <section className="box"><div className="head"><h2>{title}</h2><button onClick={onAction}>{action} →</button></div>{hasChildren?children:<p className="empty">{empty}</p>}<style jsx>{`
    .box{border:1px solid rgba(80,190,130,.18);background:linear-gradient(145deg,rgba(6,39,26,.97),rgba(0,23,14,.98));border-radius:18px;padding:18px}.head{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:4px}.head h2{font-size:16px;margin:0}.head button{border:0;background:transparent;color:#41e58b;font-size:10px;font-weight:900;cursor:pointer}.empty{color:#789084;font-size:12px;margin:20px 0 5px}
  `}</style></section>
}

function Quick({icon,title,text,onClick}:{icon:string;title:string;text:string;onClick:()=>void}) {
  return <button className="quickCard" onClick={onClick}><span>{icon}</span><b>{title}</b><small>{text}</small><style jsx>{`
    .quickCard{text-align:left;cursor:pointer;border:1px solid rgba(80,190,130,.18);background:#06271a;color:white;border-radius:15px;padding:17px;display:flex;flex-direction:column;gap:6px}.quickCard:hover{border-color:rgba(65,229,139,.4);transform:translateY(-1px)}span{font-size:22px}b{font-size:13px}small{color:#81998c;line-height:1.4;font-size:10px}
  `}</style></button>
}
