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
  nl:{kicker:"JOUW VOETIQ",title:"Dashboard",hello:"Welkom terug",subtitle:"Alles wat belangrijk is voor jouw VoetIQ-carrière op één plek.",points:"Totaalpunten",rank:"Voetbalrang",leaderboard:"Ranglijst",predictions:"Voorspellingen",of:"van",players:"spelers",next:"Volgende rang",needed:"punten nodig",upcoming:"Eerstvolgende voorspellingen",recent:"Recente resultaten",noneUpcoming:"Je hebt geen komende voorspellingen.",noneRecent:"Nog geen gespeelde voorspellingen.",viewPredictions:"Alle voorspellingen",makePrediction:"Voorspel wedstrijden",viewLeaderboard:"Bekijk ranglijst",pools:"Poules",poolsText:"Speel samen met vrienden en bekijk je poules.",challenges:"Challenges",challengesText:"Bekijk je dagelijkse en wekelijkse uitdagingen.",achievements:"Achievements",achievementsText:"Bekijk welke mijlpalen je al hebt bereikt.",open:"Openen",yourPrediction:"Jouw voorspelling",result:"Eindstand",pointsShort:"pt",premium:"Premium",active:"Actief",loading:"Dashboard laden...",error:"Dashboard kon niet worden geladen."},
  en:{kicker:"YOUR VOETIQ",title:"Dashboard",hello:"Welcome back",subtitle:"Everything that matters for your VoetIQ career in one place.",points:"Total points",rank:"Football rank",leaderboard:"Leaderboard",predictions:"Predictions",of:"of",players:"players",next:"Next rank",needed:"points needed",upcoming:"Next predictions",recent:"Recent results",noneUpcoming:"You have no upcoming predictions.",noneRecent:"No played predictions yet.",viewPredictions:"All predictions",makePrediction:"Predict matches",viewLeaderboard:"View leaderboard",pools:"Pools",poolsText:"Play with friends and view your pools.",challenges:"Challenges",challengesText:"View your daily and weekly challenges.",achievements:"Achievements",achievementsText:"See which milestones you have reached.",open:"Open",yourPrediction:"Your prediction",result:"Final score",pointsShort:"pts",premium:"Premium",active:"Active",loading:"Loading dashboard...",error:"Dashboard could not be loaded."},
  de:{kicker:"DEIN VOETIQ",title:"Dashboard",hello:"Willkommen zurück",subtitle:"Alles Wichtige für deine VoetIQ-Karriere an einem Ort.",points:"Gesamtpunkte",rank:"Fußballrang",leaderboard:"Rangliste",predictions:"Tipps",of:"von",players:"Spielern",next:"Nächster Rang",needed:"Punkte benötigt",upcoming:"Nächste Tipps",recent:"Letzte Ergebnisse",noneUpcoming:"Du hast keine kommenden Tipps.",noneRecent:"Noch keine gespielten Tipps.",viewPredictions:"Alle Tipps",makePrediction:"Spiele tippen",viewLeaderboard:"Rangliste ansehen",pools:"Pools",poolsText:"Spiele mit Freunden und sieh deine Pools.",challenges:"Challenges",challengesText:"Sieh deine täglichen und wöchentlichen Challenges.",achievements:"Erfolge",achievementsText:"Sieh deine erreichten Meilensteine.",open:"Öffnen",yourPrediction:"Dein Tipp",result:"Endstand",pointsShort:"Pkt.",premium:"Premium",active:"Aktiv",loading:"Dashboard wird geladen...",error:"Dashboard konnte nicht geladen werden."},
  es:{kicker:"TU VOETIQ",title:"Panel",hello:"Bienvenido de nuevo",subtitle:"Todo lo importante de tu carrera en VoetIQ en un solo lugar.",points:"Puntos totales",rank:"Rango de fútbol",leaderboard:"Clasificación",predictions:"Pronósticos",of:"de",players:"jugadores",next:"Siguiente rango",needed:"puntos necesarios",upcoming:"Próximos pronósticos",recent:"Resultados recientes",noneUpcoming:"No tienes próximos pronósticos.",noneRecent:"Aún no hay pronósticos jugados.",viewPredictions:"Todos los pronósticos",makePrediction:"Pronosticar partidos",viewLeaderboard:"Ver clasificación",pools:"Ligas",poolsText:"Juega con amigos y consulta tus ligas.",challenges:"Desafíos",challengesText:"Consulta tus desafíos diarios y semanales.",achievements:"Logros",achievementsText:"Consulta los hitos que has alcanzado.",open:"Abrir",yourPrediction:"Tu pronóstico",result:"Resultado final",pointsShort:"pts",premium:"Premium",active:"Activo",loading:"Cargando panel...",error:"No se pudo cargar el panel."},
  fr:{kicker:"TON VOETIQ",title:"Tableau de bord",hello:"Bon retour",subtitle:"Tout ce qui compte pour ta carrière VoetIQ au même endroit.",points:"Points totaux",rank:"Rang football",leaderboard:"Classement",predictions:"Pronostics",of:"sur",players:"joueurs",next:"Rang suivant",needed:"points nécessaires",upcoming:"Prochains pronostics",recent:"Résultats récents",noneUpcoming:"Tu n’as aucun pronostic à venir.",noneRecent:"Aucun pronostic joué pour le moment.",viewPredictions:"Tous les pronostics",makePrediction:"Pronostiquer",viewLeaderboard:"Voir le classement",pools:"Poules",poolsText:"Joue avec tes amis et consulte tes poules.",challenges:"Challenges",challengesText:"Consulte tes défis quotidiens et hebdomadaires.",achievements:"Succès",achievementsText:"Découvre les étapes que tu as déjà franchies.",open:"Ouvrir",yourPrediction:"Ton pronostic",result:"Score final",pointsShort:"pts",premium:"Premium",active:"Actif",loading:"Chargement du tableau de bord...",error:"Impossible de charger le tableau de bord."},
  it:{kicker:"IL TUO VOETIQ",title:"Dashboard",hello:"Bentornato",subtitle:"Tutto ciò che conta per la tua carriera VoetIQ in un unico posto.",points:"Punti totali",rank:"Rango calcistico",leaderboard:"Classifica",predictions:"Pronostici",of:"su",players:"giocatori",next:"Rango successivo",needed:"punti necessari",upcoming:"Prossimi pronostici",recent:"Risultati recenti",noneUpcoming:"Non hai pronostici futuri.",noneRecent:"Nessun pronostico giocato.",viewPredictions:"Tutti i pronostici",makePrediction:"Pronostica partite",viewLeaderboard:"Vedi classifica",pools:"Gironi",poolsText:"Gioca con gli amici e visualizza i tuoi gironi.",challenges:"Sfide",challengesText:"Visualizza le sfide giornaliere e settimanali.",achievements:"Obiettivi",achievementsText:"Scopri i traguardi che hai raggiunto.",open:"Apri",yourPrediction:"Il tuo pronostico",result:"Risultato finale",pointsShort:"pt",premium:"Premium",active:"Attivo",loading:"Caricamento dashboard...",error:"Impossibile caricare la dashboard."},
  pt:{kicker:"O TEU VOETIQ",title:"Dashboard",hello:"Bem-vindo de volta",subtitle:"Tudo o que importa para a tua carreira VoetIQ num só lugar.",points:"Pontos totais",rank:"Nível futebolístico",leaderboard:"Classificação",predictions:"Previsões",of:"de",players:"jogadores",next:"Próximo nível",needed:"pontos necessários",upcoming:"Próximas previsões",recent:"Resultados recentes",noneUpcoming:"Não tens previsões futuras.",noneRecent:"Ainda não há previsões jogadas.",viewPredictions:"Todas as previsões",makePrediction:"Prever jogos",viewLeaderboard:"Ver classificação",pools:"Grupos",poolsText:"Joga com amigos e consulta os teus grupos.",challenges:"Desafios",challengesText:"Consulta os teus desafios diários e semanais.",achievements:"Conquistas",achievementsText:"Vê os marcos que já alcançaste.",open:"Abrir",yourPrediction:"A tua previsão",result:"Resultado final",pointsShort:"pts",premium:"Premium",active:"Ativo",loading:"A carregar dashboard...",error:"Não foi possível carregar o dashboard."},
} satisfies Record<LanguageCode, Record<string,string>>;

function validLanguage(value:string|null): value is LanguageCode {
  return ["nl","en","de","es","fr","it","pt"].includes(value || "");
}

function played(p:Prediction) {
  return p.actual_home_score !== null && p.actual_away_score !== null;
}

export default function DashboardPage() {
  const router = useRouter();
  const [language,setLanguage] = useState<LanguageCode>("nl");
  const [profile,setProfile] = useState<Profile|null>(null);
  const [predictions,setPredictions] = useState<Prediction[]>([]);
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

      const [profileResult,predictionResult,leaderboardResult] = await Promise.all([
        supabase.from("profiles").select("username, first_name, last_name, is_premium, premium_expires_at").eq("id",user.id).maybeSingle(),
        supabase.from("predictions").select("id, match_name, home_score, away_score, actual_home_score, actual_away_score, points, created_at, competition_code, kickoff_at").eq("user_id",user.id).order("kickoff_at",{ascending:false}),
        supabase.rpc("get_leaderboard"),
      ]);
      if (profileResult.error) throw profileResult.error;
      if (predictionResult.error) throw predictionResult.error;
      if (!profileResult.data) throw new Error("Profile not found");

      setProfile(profileResult.data as Profile);
      setPredictions((predictionResult.data || []) as Prediction[]);

      if (!leaderboardResult.error) {
        const ranking = (leaderboardResult.data || []) as {username:string;total_points:number}[];
        setTotalPlayers(ranking.length);
        const index = ranking.findIndex(x => x.username === profileResult.data.username);
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
  const premiumActive = Boolean(profile?.is_premium && (!profile.premium_expires_at || new Date(profile.premium_expires_at).getTime()>Date.now()));

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
      .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:12px}.stats button{cursor:pointer;text-align:left;border:1px solid rgba(80,190,130,.18);background:linear-gradient(145deg,#06271a,#00170e);border-radius:16px;padding:17px;color:white;display:flex;flex-direction:column;gap:5px}.stats button:hover{border-color:rgba(65,229,139,.4)}.stats span{font-size:20px}.stats strong{font-size:21px}.stats small{color:#81998c;font-weight:800}
      .rankCard{border:1px solid rgba(80,190,130,.18);background:rgba(6,39,26,.72);border-radius:16px;padding:17px;margin-bottom:24px}.rankTop{display:flex;justify-content:space-between;gap:15px;align-items:center}.rankTop>div{display:flex;flex-direction:column;gap:4px}.rankTop small,.rankTop strong{color:#8da397;font-size:11px}.bar{height:8px;background:#00170e;border-radius:999px;overflow:hidden;margin-top:13px}.bar i{display:block;height:100%;background:#22c55e;border-radius:999px}
      .two{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}.match{display:flex;justify-content:space-between;gap:14px;align-items:center;padding:13px 0;border-bottom:1px solid rgba(255,255,255,.06)}.match:last-child{border-bottom:0}.match>div:first-child{display:flex;flex-direction:column;gap:4px}.match b{font-size:13px}.match small{color:#789084;font-size:10px}.score{text-align:right;display:flex;flex-direction:column}.score strong{font-size:16px}.earned{color:#41e58b;font-weight:950;font-size:13px;white-space:nowrap}
      .quick{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
      @media(max-width:850px){.stats,.quick{grid-template-columns:repeat(2,1fr)}.two{grid-template-columns:1fr}.hero{flex-direction:column}}
      @media(max-width:520px){.page{padding:28px 14px 70px}.stats,.quick{grid-template-columns:1fr 1fr}.rankTop{align-items:flex-start;flex-direction:column}}
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
