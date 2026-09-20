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
  is_premium?: boolean;
  premium_expires_at?: string | null;
  profile_theme?: "default" | "emerald" | "gold" | "midnight" | "champions";
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

type CompetitionRank = {
  competition_code: string;
  rank: number;
  total_players: number;
};

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


type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

const footballRanks = [
  { min:0, next:50, icon:"🟤", nl:"Straatvoetballer", en:"Street Footballer", de:"Straßenfußballer", es:"Futbolista callejero", fr:"Footballeur de rue", it:"Calciatore di strada", pt:"Futebolista de rua" },
  { min:50, next:100, icon:"🟢", nl:"Jeugdspeler", en:"Youth Player", de:"Jugendspieler", es:"Jugador juvenil", fr:"Joueur junior", it:"Giocatore giovanile", pt:"Jogador juvenil" },
  { min:100, next:200, icon:"🔵", nl:"Academiespeler", en:"Academy Player", de:"Akademiespieler", es:"Jugador de academia", fr:"Joueur d’académie", it:"Giocatore dell’accademia", pt:"Jogador da academia" },
  { min:200, next:350, icon:"⚪", nl:"Selectiespeler", en:"Squad Player", de:"Kaderspieler", es:"Jugador de plantilla", fr:"Joueur de l’effectif", it:"Giocatore della rosa", pt:"Jogador do plantel" },
  { min:350, next:550, icon:"🟡", nl:"Basisspeler", en:"Starting Player", de:"Stammspieler", es:"Titular", fr:"Titulaire", it:"Titolare", pt:"Titular" },
  { min:550, next:800, icon:"🟠", nl:"Profvoetballer", en:"Professional Footballer", de:"Profifußballer", es:"Futbolista profesional", fr:"Footballeur professionnel", it:"Calciatore professionista", pt:"Futebolista profissional" },
  { min:800, next:1100, icon:"🔥", nl:"Sterspeler", en:"Star Player", de:"Starspieler", es:"Jugador estrella", fr:"Joueur vedette", it:"Giocatore stella", pt:"Jogador estrela" },
  { min:1100, next:1500, icon:"⭐", nl:"Topspeler", en:"Top Player", de:"Topspieler", es:"Jugador de élite", fr:"Joueur d’élite", it:"Top player", pt:"Jogador de elite" },
  { min:1500, next:2000, icon:"🌟", nl:"Wereldster", en:"World Star", de:"Weltstar", es:"Estrella mundial", fr:"Star mondiale", it:"Stella mondiale", pt:"Estrela mundial" },
  { min:2000, next:2750, icon:"🏆", nl:"Kampioen", en:"Champion", de:"Champion", es:"Campeón", fr:"Champion", it:"Campione", pt:"Campeão" },
  { min:2750, next:3500, icon:"👑", nl:"Ballon d'Or-niveau", en:"Ballon d'Or Level", de:"Ballon-d’Or-Niveau", es:"Nivel Balón de Oro", fr:"Niveau Ballon d’Or", it:"Livello Pallone d’Oro", pt:"Nível Bola de Ouro" },
  { min:3500, next:null, icon:"🐐", nl:"VoetIQ GOAT", en:"VoetIQ GOAT", de:"VoetIQ GOAT", es:"VoetIQ GOAT", fr:"VoetIQ GOAT", it:"VoetIQ GOAT", pt:"VoetIQ GOAT" },
] as const;


const publicAchievementNames: Record<LanguageCode,string[]> = {
 nl:["Scherpschutter","Precisieschutter","Scoremeester","Voorspelkoning","Goed gezien","Voetbalkenner","Kenner","Voetbalorakel","Debutant","Vaste voorspeller","Doorgewinterd","Honderdclub","Eerste punten","100-puntenclub","250-puntenclub","500-puntenclub","1000-puntenclub","In vorm","Niet te stoppen","Perfecte reeks","Podium","Koploper","Wereldreiziger","Alleskenner","Competitiespecialist","VoetIQ-veteraan"],
 en:["Sharpshooter","Precision Shooter","Score Master","Prediction King","Good Call","Football Expert","Expert","Football Oracle","Debutant","Regular Predictor","Seasoned Predictor","Century Club","First Points","100 Point Club","250 Point Club","500 Point Club","1000 Point Club","In Form","Unstoppable","Perfect Streak","Podium","Leader","World Traveller","All-Round Expert","Competition Specialist","VoetIQ Veteran"],
 de:["Scharfschütze","Präzisionsschütze","Ergebnismeister","Tippkönig","Gut getippt","Fußballexperte","Kenner","Fußballorakel","Debütant","Stammtipper","Erfahrener Tipper","Hunderterclub","Erste Punkte","100-Punkte-Club","250-Punkte-Club","500-Punkte-Club","1000-Punkte-Club","In Form","Unaufhaltsam","Perfekte Serie","Podium","Spitzenreiter","Weltenbummler","Alleskönner","Wettbewerbsspezialist","VoetIQ-Veteran"],
 es:["Francotirador","Tirador de precisión","Maestro del marcador","Rey de las predicciones","Bien visto","Experto en fútbol","Conocedor","Oráculo del fútbol","Debutante","Pronosticador habitual","Experimentado","Club de los 100","Primeros puntos","Club de 100 puntos","Club de 250 puntos","Club de 500 puntos","Club de 1000 puntos","En forma","Imparable","Racha perfecta","Podio","Líder","Trotamundos","Experto total","Especialista de competición","Veterano de VoetIQ"],
 fr:["Tireur d’élite","Tireur de précision","Maître du score","Roi des pronostics","Bien vu","Expert football","Connaisseur","Oracle du football","Débutant","Pronostiqueur régulier","Expérimenté","Club des 100","Premiers points","Club des 100 points","Club des 250 points","Club des 500 points","Club des 1000 points","En forme","Inarrêtable","Série parfaite","Podium","Leader","Globe-trotter","Expert complet","Spécialiste d’une compétition","Vétéran VoetIQ"],
 it:["Cecchino","Tiratore di precisione","Maestro del risultato","Re dei pronostici","Ben visto","Esperto di calcio","Intenditore","Oracolo del calcio","Debuttante","Pronosticatore abituale","Esperto","Club dei 100","Primi punti","Club dei 100 punti","Club dei 250 punti","Club dei 500 punti","Club dei 1000 punti","In forma","Inarrestabile","Serie perfetta","Podio","Capolista","Girammondo","Tuttologo","Specialista di competizione","Veterano VoetIQ"],
 pt:["Atirador certeiro","Atirador de precisão","Mestre do resultado","Rei das previsões","Boa previsão","Especialista em futebol","Conhecedor","Oráculo do futebol","Estreante","Prognosticador regular","Experiente","Clube dos 100","Primeiros pontos","Clube dos 100 pontos","Clube dos 250 pontos","Clube dos 500 pontos","Clube dos 1000 pontos","Em forma","Imparável","Série perfeita","Pódio","Líder","Viajante do mundo","Especialista total","Especialista da competição","Veterano VoetIQ"]
};

const publicUi = {
 nl:{back:"Terug",loading:"Spelersprofiel laden...",notFound:"Deze speler kon niet worden gevonden.",loadError:"Het spelersprofiel kon niet worden geladen.",noPublic:"Deze speler heeft nog geen openbaar VoetIQ-profiel.",player:"VOETIQ-SPELER",publicProfile:"Openbaar spelersprofiel",totalPoints:"Totaal punten",predictions:"Voorspellingen",exactScores:"Exacte scores",correctResults:"Juiste uitslagen",overall:(n:number)=>`Algemeen · van ${n} spelers`,overallList:"Algemene ranglijst",statistics:"Statistieken",avg:"Gemiddeld aantal punten per voorspelling",competitionPerformance:"Prestaties per competitie",wherePoints:(u:string)=>`Bekijk waar ${u} zijn punten heeft verdiend.`,noCompetition:"Nog geen competitiegegevens beschikbaar.",points:"punten",ofPlayers:(n:number)=>`van ${n} spelers`,achievements:"Achievements",recent:"Recente voorspellingen",privacy:"Alleen voorspellingen van wedstrijden die al zijn begonnen zijn zichtbaar.",noPublicPredictions:"Nog geen openbare voorspellingen beschikbaar.",prediction:"Voorspelling",result:"Uitslag",live:"Bezig",footballRank:"Voetbalrang",currentRank:"Huidige rang",nextRank:"Volgende rang",needed:(n:number)=>`Nog ${n} punten nodig voor promotie`,highest:"Hoogste rang bereikt"},
 en:{back:"Back",loading:"Loading player profile...",notFound:"This player could not be found.",loadError:"The player profile could not be loaded.",noPublic:"This player does not have a public VoetIQ profile yet.",player:"VOETIQ PLAYER",publicProfile:"Public player profile",totalPoints:"Total points",predictions:"Predictions",exactScores:"Exact scores",correctResults:"Correct results",overall:(n:number)=>`Overall · of ${n} players`,overallList:"Overall leaderboard",statistics:"Statistics",avg:"Average points per prediction",competitionPerformance:"Performance by competition",wherePoints:(u:string)=>`See where ${u} earned their points.`,noCompetition:"No competition data available yet.",points:"points",ofPlayers:(n:number)=>`of ${n} players`,achievements:"Achievements",recent:"Recent predictions",privacy:"Only predictions for matches that have already started are visible.",noPublicPredictions:"No public predictions available yet.",prediction:"Prediction",result:"Result",live:"In progress",footballRank:"Football rank",currentRank:"Current rank",nextRank:"Next rank",needed:(n:number)=>`${n} points needed for promotion`,highest:"Highest rank reached"},
 de:{back:"Zurück",loading:"Spielerprofil wird geladen...",notFound:"Dieser Spieler wurde nicht gefunden.",loadError:"Das Spielerprofil konnte nicht geladen werden.",noPublic:"Dieser Spieler hat noch kein öffentliches VoetIQ-Profil.",player:"VOETIQ-SPIELER",publicProfile:"Öffentliches Spielerprofil",totalPoints:"Gesamtpunkte",predictions:"Tipps",exactScores:"Exakte Ergebnisse",correctResults:"Richtige Ausgänge",overall:(n:number)=>`Gesamt · von ${n} Spielern`,overallList:"Gesamtrangliste",statistics:"Statistiken",avg:"Durchschnittliche Punkte pro Tipp",competitionPerformance:"Leistung pro Wettbewerb",wherePoints:(u:string)=>`Sieh, wo ${u} seine Punkte verdient hat.`,noCompetition:"Noch keine Wettbewerbsdaten verfügbar.",points:"Punkte",ofPlayers:(n:number)=>`von ${n} Spielern`,achievements:"Erfolge",recent:"Letzte Tipps",privacy:"Nur Tipps für bereits begonnene Spiele sind sichtbar.",noPublicPredictions:"Noch keine öffentlichen Tipps verfügbar.",prediction:"Tipp",result:"Ergebnis",live:"Läuft",footballRank:"Fußballrang",currentRank:"Aktueller Rang",nextRank:"Nächster Rang",needed:(n:number)=>`Noch ${n} Punkte bis zum Aufstieg`,highest:"Höchster Rang erreicht"},
 es:{back:"Volver",loading:"Cargando perfil del jugador...",notFound:"No se pudo encontrar a este jugador.",loadError:"No se pudo cargar el perfil del jugador.",noPublic:"Este jugador aún no tiene un perfil público de VoetIQ.",player:"JUGADOR VOETIQ",publicProfile:"Perfil público del jugador",totalPoints:"Puntos totales",predictions:"Predicciones",exactScores:"Marcadores exactos",correctResults:"Resultados correctos",overall:(n:number)=>`General · de ${n} jugadores`,overallList:"Clasificación general",statistics:"Estadísticas",avg:"Promedio de puntos por predicción",competitionPerformance:"Rendimiento por competición",wherePoints:(u:string)=>`Consulta dónde ha conseguido sus puntos ${u}.`,noCompetition:"Aún no hay datos de competiciones.",points:"puntos",ofPlayers:(n:number)=>`de ${n} jugadores`,achievements:"Logros",recent:"Predicciones recientes",privacy:"Solo son visibles las predicciones de partidos que ya han comenzado.",noPublicPredictions:"Aún no hay predicciones públicas.",prediction:"Predicción",result:"Resultado",live:"En juego",footballRank:"Rango de fútbol",currentRank:"Rango actual",nextRank:"Siguiente rango",needed:(n:number)=>`Faltan ${n} puntos para ascender`,highest:"Rango máximo alcanzado"},
 fr:{back:"Retour",loading:"Chargement du profil joueur...",notFound:"Ce joueur est introuvable.",loadError:"Le profil du joueur n’a pas pu être chargé.",noPublic:"Ce joueur n’a pas encore de profil VoetIQ public.",player:"JOUEUR VOETIQ",publicProfile:"Profil public du joueur",totalPoints:"Points totaux",predictions:"Pronostics",exactScores:"Scores exacts",correctResults:"Bons résultats",overall:(n:number)=>`Général · sur ${n} joueurs`,overallList:"Classement général",statistics:"Statistiques",avg:"Moyenne de points par pronostic",competitionPerformance:"Performance par compétition",wherePoints:(u:string)=>`Découvre où ${u} a gagné ses points.`,noCompetition:"Aucune donnée de compétition disponible.",points:"points",ofPlayers:(n:number)=>`sur ${n} joueurs`,achievements:"Succès",recent:"Pronostics récents",privacy:"Seuls les pronostics des matchs déjà commencés sont visibles.",noPublicPredictions:"Aucun pronostic public disponible.",prediction:"Pronostic",result:"Résultat",live:"En cours",footballRank:"Rang football",currentRank:"Rang actuel",nextRank:"Rang suivant",needed:(n:number)=>`Encore ${n} points pour être promu`,highest:"Rang maximal atteint"},
 it:{back:"Indietro",loading:"Caricamento profilo giocatore...",notFound:"Impossibile trovare questo giocatore.",loadError:"Impossibile caricare il profilo del giocatore.",noPublic:"Questo giocatore non ha ancora un profilo VoetIQ pubblico.",player:"GIOCATORE VOETIQ",publicProfile:"Profilo pubblico del giocatore",totalPoints:"Punti totali",predictions:"Pronostici",exactScores:"Risultati esatti",correctResults:"Esiti corretti",overall:(n:number)=>`Generale · su ${n} giocatori`,overallList:"Classifica generale",statistics:"Statistiche",avg:"Media punti per pronostico",competitionPerformance:"Prestazioni per competizione",wherePoints:(u:string)=>`Scopri dove ${u} ha guadagnato i suoi punti.`,noCompetition:"Nessun dato sulle competizioni disponibile.",points:"punti",ofPlayers:(n:number)=>`su ${n} giocatori`,achievements:"Obiettivi",recent:"Pronostici recenti",privacy:"Sono visibili solo i pronostici delle partite già iniziate.",noPublicPredictions:"Nessun pronostico pubblico disponibile.",prediction:"Pronostico",result:"Risultato",live:"In corso",footballRank:"Rango calcistico",currentRank:"Rango attuale",nextRank:"Rango successivo",needed:(n:number)=>`Mancano ${n} punti alla promozione`,highest:"Rango massimo raggiunto"},
 pt:{back:"Voltar",loading:"A carregar perfil do jogador...",notFound:"Não foi possível encontrar este jogador.",loadError:"Não foi possível carregar o perfil do jogador.",noPublic:"Este jogador ainda não tem um perfil público no VoetIQ.",player:"JOGADOR VOETIQ",publicProfile:"Perfil público do jogador",totalPoints:"Pontos totais",predictions:"Previsões",exactScores:"Resultados exatos",correctResults:"Resultados corretos",overall:(n:number)=>`Geral · de ${n} jogadores`,overallList:"Classificação geral",statistics:"Estatísticas",avg:"Média de pontos por previsão",competitionPerformance:"Desempenho por competição",wherePoints:(u:string)=>`Vê onde ${u} ganhou os seus pontos.`,noCompetition:"Ainda não existem dados de competições.",points:"pontos",ofPlayers:(n:number)=>`de ${n} jogadores`,achievements:"Conquistas",recent:"Previsões recentes",privacy:"Só são visíveis previsões de jogos que já começaram.",noPublicPredictions:"Ainda não existem previsões públicas.",prediction:"Previsão",result:"Resultado",live:"Em jogo",footballRank:"Nível futebolístico",currentRank:"Nível atual",nextRank:"Próximo nível",needed:(n:number)=>`Faltam ${n} pontos para subir de nível`,highest:"Nível máximo alcançado"}
};


type PublicProfileTheme = "default" | "emerald" | "gold" | "midnight" | "champions";

const publicProfileThemes: Record<PublicProfileTheme, {
  background: string;
  border: string;
  accent: string;
  soft: string;
  avatarBackground: string;
  avatarBorder: string;
}> = {
  default: {
    background: "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
    border: "1px solid rgba(80,190,130,0.20)",
    accent: "#41e58b",
    soft: "#83e7ae",
    avatarBackground: "#0b3523",
    avatarBorder: "2px solid rgba(65,229,139,0.28)",
  },
  emerald: {
    background: "linear-gradient(145deg, rgba(6,95,70,0.98) 0%, rgba(2,44,34,0.98) 100%)",
    border: "1px solid rgba(52,211,153,0.30)",
    accent: "#6ee7b7",
    soft: "#a7f3d0",
    avatarBackground: "rgba(16,185,129,0.16)",
    avatarBorder: "2px solid rgba(52,211,153,0.32)",
  },
  gold: {
    background: "linear-gradient(145deg, rgba(120,53,15,0.98) 0%, rgba(66,32,6,0.97) 58%, rgba(17,24,39,0.99) 100%)",
    border: "1px solid rgba(253,224,71,0.30)",
    accent: "#fde047",
    soft: "#fde68a",
    avatarBackground: "rgba(245,158,11,0.16)",
    avatarBorder: "2px solid rgba(253,224,71,0.32)",
  },
  midnight: {
    background: "linear-gradient(145deg, rgba(23,37,84,0.99) 0%, rgba(15,23,42,0.98) 58%, rgba(2,6,23,0.99) 100%)",
    border: "1px solid rgba(129,140,248,0.30)",
    accent: "#a5b4fc",
    soft: "#c7d2fe",
    avatarBackground: "rgba(99,102,241,0.15)",
    avatarBorder: "2px solid rgba(129,140,248,0.32)",
  },
  champions: {
    background: "linear-gradient(145deg, rgba(49,46,129,0.99) 0%, rgba(30,58,138,0.97) 55%, rgba(2,6,23,0.99) 100%)",
    border: "1px solid rgba(196,181,253,0.32)",
    accent: "#c4b5fd",
    soft: "#ddd6fe",
    avatarBackground: "rgba(139,92,246,0.16)",
    avatarBorder: "2px solid rgba(196,181,253,0.34)",
  },
};

export default function PublicPlayerProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [competitions, setCompetitions] = useState<CompetitionStats[]>([]);
  const [recentPredictions, setRecentPredictions] = useState<RecentPrediction[]>([]);
  const [profileRank, setProfileRank] = useState<ProfileRank | null>(null);
  const [competitionRanks, setCompetitionRanks] = useState<CompetitionRank[]>([]);
  const [achievementStats, setAchievementStats] = useState<AchievementStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [error, setError] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [profileTheme, setProfileTheme] = useState<"default" | "emerald" | "gold" | "midnight" | "champions">("default");

  useEffect(() => {
    const stored = window.localStorage.getItem("voetiq-language");
    if (stored && ["nl","en","de","es","fr","it","pt"].includes(stored)) setLanguage(stored as LanguageCode);
    const parts = window.location.pathname.split("/").filter(Boolean);
    const userId = parts[1];

    if (!userId) {
      setError(publicUi[language].notFound);
      setLoading(false);
      return;
    }

    loadProfile(userId);
  }, []);

  useEffect(() => {
    function onLanguageChange(event: Event) {
      const e = event as CustomEvent<{ language: LanguageCode }>;
      if (e.detail?.language) setLanguage(e.detail.language);
    }
    window.addEventListener("voetiq-language-change", onLanguageChange);
    return () => window.removeEventListener("voetiq-language-change", onLanguageChange);
  }, []);

  async function loadProfile(userId: string) {
    setLoading(true);
    setError("");

    const [
      profileResult,
      competitionResult,
      recentResult,
      rankResult,
      competitionRankResult,
      achievementResult,
    ] = await Promise.all([
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
      supabase.rpc("get_public_profile_competition_ranks", {
        requested_user_id: userId,
      }),
      supabase.rpc("get_public_achievement_stats", {
        requested_user_id: userId,
      }),
    ]);

    if (profileResult.error) {
      console.error(profileResult.error);
      setError(publicUi[language].loadError);
      setLoading(false);
      return;
    }

    const player = profileResult.data?.[0] as PublicProfile | undefined;

    if (!player) {
      setError(publicUi[language].noPublic);
      setLoading(false);
      return;
    }

    const { data: premiumProfile, error: premiumProfileError } = await supabase
      .from("profiles")
      .select("is_premium, premium_expires_at, profile_theme")
      .eq("id", userId)
      .maybeSingle();

    if (premiumProfileError) {
      console.error(premiumProfileError);
    }

    const premiumExpiresAt = premiumProfile?.premium_expires_at
      ? new Date(premiumProfile.premium_expires_at)
      : null;

    const premiumActive =
      premiumProfile?.is_premium === true &&
      (premiumExpiresAt === null ||
        (!Number.isNaN(premiumExpiresAt.getTime()) &&
          premiumExpiresAt.getTime() > Date.now()));

    setIsPremium(premiumActive);
    setProfileTheme(
      premiumActive &&
        ["default", "emerald", "gold", "midnight", "champions"].includes(
          premiumProfile?.profile_theme || ""
        )
        ? (premiumProfile!.profile_theme as "default" | "emerald" | "gold" | "midnight" | "champions")
        : "default"
    );

    if (competitionResult.error) {
      console.error(competitionResult.error);
    }

    if (recentResult.error) {
      console.error(recentResult.error);
    }

    if (rankResult.error) {
      console.error(rankResult.error);
    }

    if (competitionRankResult.error) {
      console.error(competitionRankResult.error);
    }
    if (achievementResult.error) {
      console.error(achievementResult.error);
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

    setCompetitionRanks(
      ((competitionRankResult.data || []) as CompetitionRank[]).map((item) => ({
        competition_code: item.competition_code,
        rank: Number(item.rank) || 0,
        total_players: Number(item.total_players) || 0,
      }))
    );

    const a = achievementResult.data?.[0] as AchievementStats | undefined;
    if (a) {
      setAchievementStats({
        total_points: Number(a.total_points)||0,
        predictions_count: Number(a.predictions_count)||0,
        played_predictions: Number(a.played_predictions)||0,
        exact_scores: Number(a.exact_scores)||0,
        correct_results: Number(a.correct_results)||0,
        competitions_played: Number(a.competitions_played)||0,
        best_correct_streak: Number(a.best_correct_streak)||0,
        best_exact_streak: Number(a.best_exact_streak)||0,
        best_competition_correct_results: Number(a.best_competition_correct_results)||0,
      });
    }
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

  const t = publicUi[language];
  const currentRankIndex = profile ? Math.max(0, footballRanks.findLastIndex((r) => profile.total_points >= r.min)) : 0;
  const currentFootballRank = footballRanks[currentRankIndex];
  const nextFootballRank = currentRankIndex < footballRanks.length - 1 ? footballRanks[currentRankIndex + 1] : null;
  const rankProgress = profile && nextFootballRank
    ? Math.min(100, Math.max(0, ((profile.total_points-currentFootballRank.min)/(nextFootballRank.min-currentFootballRank.min))*100))
    : 100;
  const pointsNeeded = profile && nextFootballRank ? Math.max(0,nextFootballRank.min-profile.total_points) : 0;
  const activePublicTheme = publicProfileThemes[profileTheme];

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
            ← {t.back}
          </button>

          {loading ? (
            <section style={cardStyle}>
              <div style={{ color: "#a9bbb0" }}>
                {t.loading}
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
                {error || t.notFound}
              </div>
            </section>
          ) : (
            <>
              <section
                style={{
                  ...cardStyle,
                  background: activePublicTheme.background,
                  border: activePublicTheme.border,
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
                      background: activePublicTheme.avatarBackground,
                      border: activePublicTheme.avatarBorder,
                      display: "grid",
                      placeItems: "center",
                      color: activePublicTheme.accent,
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
                        color: activePublicTheme.soft,
                        fontSize: "12px",
                        fontWeight: 900,
                        letterSpacing: "1px",
                        marginBottom: "6px",
                      }}
                    >
                      {t.player}
                    </div>

                    <h1
                      style={{
                        margin: 0,
                        fontSize: "34px",
                        lineHeight: 1.15,
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span>{profile.username}</span>
                        {isPremium && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              borderRadius: "999px",
                              border: "1px solid rgba(250,204,21,0.32)",
                              background: "rgba(250,204,21,0.10)",
                              padding: "5px 9px",
                              color: "#fde047",
                              fontSize: "10px",
                              fontWeight: 900,
                              letterSpacing: "0.8px",
                              lineHeight: 1,
                            }}
                          >
                            👑 PREMIUM
                          </span>
                        )}
                      </span>
                    </h1>

                    <p
                      style={{
                        margin: "8px 0 0",
                        color: activePublicTheme.soft,
                        opacity: 0.72,
                        fontSize: "14px",
                      }}
                    >
                      {t.publicProfile}
                    </p>
                  </div>
                </div>
              </section>

              <section style={{ ...cardStyle, marginBottom:"18px", padding:"24px 26px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", gap:"20px", alignItems:"flex-start", flexWrap:"wrap" }}>
                  <div>
                    <div style={{ color:"#41e58b", fontSize:"11px", fontWeight:900, letterSpacing:"1px", textTransform:"uppercase" }}>{t.footballRank}</div>
                    <div style={{ color:"#a9bbb0", fontSize:"12px", marginTop:"8px" }}>{t.currentRank}</div>
                    <div style={{ fontSize:"25px", fontWeight:900, marginTop:"4px" }}>
                      {currentFootballRank.icon} {currentFootballRank[language]}
                    </div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    {nextFootballRank ? <>
                      <div style={{ color:"#a9bbb0", fontSize:"12px" }}>{t.nextRank}</div>
                      <div style={{ color:"#83e7ae", fontWeight:900, marginTop:"5px" }}>{nextFootballRank.icon} {nextFootballRank[language]}</div>
                    </> : <div style={{ color:"#83e7ae", fontWeight:900 }}>🐐 {t.highest}</div>}
                  </div>
                </div>
                <div style={{ marginTop:"20px" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", color:"#a9bbb0", fontSize:"12px", fontWeight:800 }}>
                    <span>{profile.total_points} {t.points}</span>
                    <span>{nextFootballRank ? `${nextFootballRank.min} ${t.points}` : t.highest}</span>
                  </div>
                  <div style={{ height:"9px", background:"rgba(255,255,255,0.08)", borderRadius:"999px", overflow:"hidden", marginTop:"8px" }}>
                    <div style={{ width:`${rankProgress}%`, height:"100%", background:"#41e58b", borderRadius:"999px" }} />
                  </div>
                  <div style={{ color:"#a9bbb0", fontSize:"12px", marginTop:"9px" }}>{nextFootballRank ? t.needed(pointsNeeded) : t.highest}</div>
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
                  label={t.totalPoints}
                />

                <StatCard
                  icon="⚽"
                  value={profile.predictions_count}
                  label={t.predictions}
                />

                <StatCard
                  icon="🎯"
                  value={profile.exact_scores}
                  label={t.exactScores}
                />

                <StatCard
                  icon="✅"
                  value={profile.correct_results}
                  label={t.correctResults}
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
                      ? t.overall(profileRank.total_players)
                      : t.overallList
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
                  📊 {t.statistics}
                </h2>

                <StatRow
                  label={t.avg}
                  value={averagePoints}
                />

                <StatRow
                  label={t.correctResults}
                  value={`${correctPercentage}%`}
                />

                <StatRow
                  label={t.exactScores}
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
                    🏟️ {t.competitionPerformance}
                  </h2>

                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#a9bbb0",
                      fontSize: "13px",
                    }}
                  >
                    {t.wherePoints(profile.username)}
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
                    {t.noCompetition}
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

                      const competitionRank = competitionRanks.find(
                        (item) =>
                          item.competition_code === competition.competition_code
                      );

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
                            {t.points}
                          </div>

                          {competitionRank && (
                            <div
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "7px",
                                background: "rgba(65,229,139,0.10)",
                                border: "1px solid rgba(65,229,139,0.18)",
                                borderRadius: "999px",
                                padding: "7px 10px",
                                color: "#83e7ae",
                                fontSize: "12px",
                                fontWeight: 900,
                                marginBottom: "10px",
                              }}
                            >
                              🥇 #{competitionRank.rank} {t.ofPlayers(competitionRank.total_players)}
                              
                            </div>
                          )}

                          <MiniStat
                            label={t.predictions}
                            value={competition.predictions_count}
                          />
                          <MiniStat
                            label={t.exactScores}
                            value={competition.exact_scores}
                          />
                          <MiniStat
                            label={t.correctResults}
                            value={`${competition.correct_results} (${percentage}%)`}
                            last
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>


              <section style={{ ...cardStyle, marginBottom: "18px" }}>
                <h2 style={{ margin: "0 0 18px", fontSize: "22px" }}>🏅 {t.achievements}</h2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: "12px" }}>
                  {[
                    ["🎯","Scherpschutter", achievementStats?.exact_scores||0,1],
                    ["🎯","Precisieschutter", achievementStats?.exact_scores||0,5],
                    ["🧙","Scoremeester", achievementStats?.exact_scores||0,10],
                    ["🔮","Voorspelkoning", achievementStats?.exact_scores||0,25],
                    ["✅","Goed gezien", achievementStats?.correct_results||0,1],
                    ["⚽","Voetbalkenner", achievementStats?.correct_results||0,10],
                    ["🧠","Kenner", achievementStats?.correct_results||0,25],
                    ["👑","Voetbalorakel", achievementStats?.correct_results||0,50],
                    ["🌱","Debutant", achievementStats?.predictions_count||0,1],
                    ["📋","Vaste voorspeller", achievementStats?.predictions_count||0,10],
                    ["💪","Doorgewinterd", achievementStats?.predictions_count||0,50],
                    ["💯","Honderdclub", achievementStats?.predictions_count||0,100],
                    ["🪙","Eerste punten", achievementStats?.total_points||0,1],
                    ["💯","100-puntenclub", achievementStats?.total_points||0,100],
                    ["🚀","250-puntenclub", achievementStats?.total_points||0,250],
                    ["💎","500-puntenclub", achievementStats?.total_points||0,500],
                    ["🏆","1000-puntenclub", achievementStats?.total_points||0,1000],
                    ["🔥","In vorm", achievementStats?.best_correct_streak||0,3],
                    ["🔥","Niet te stoppen", achievementStats?.best_correct_streak||0,5],
                    ["⚡","Perfecte reeks", achievementStats?.best_exact_streak||0,3],
                    ["🥉","Podium", profileRank?.rank===1?3:profileRank?.rank===2?3:profileRank?.rank===3?3:0,3],
                    ["🥇","Koploper", profileRank?.rank===1?1:0,1],
                    ["🌍","Wereldreiziger", achievementStats?.competitions_played||0,3],
                    ["🌐","Alleskenner", achievementStats?.competitions_played||0,8],
                    ["🏟️","Competitiespecialist", achievementStats?.best_competition_correct_results||0,10],
                    ["💚","VoetIQ-veteraan", achievementStats?.predictions_count||0,250],
                  ].map(([icon,title,progress,target],i)=>{
                    const done = Number(progress)>=Number(target);
                    const pct = Math.min(100, Math.round((Number(progress)/Number(target))*100));
                    return (
                      <div key={i} style={{ background: done?"linear-gradient(145deg,#0b3523,#06271a)":"rgba(255,255,255,0.03)", border:`1px solid ${done?"rgba(65,229,139,0.25)":"rgba(255,255,255,0.08)"}`, borderRadius:"14px", padding:"14px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                            <span style={{ fontSize:"20px" }}>{icon}</span>
                            <strong style={{ color: done?"#83e7ae":"white", fontSize:"14px" }}>{publicAchievementNames[language][i] || title}</strong>
                          </div>
                          <span style={{ color: done?"#41e58b":"#849088", fontSize:"18px" }}>{done?"✅":"🔒"}</span>
                        </div>
                        <div style={{ color:"#a9bbb0", fontSize:"12px", marginTop:"8px" }}>{progress}/{target}</div>
                        <div style={{ height:"6px", background:"rgba(255,255,255,0.08)", borderRadius:"999px", marginTop:"8px", overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", background: done?"#41e58b":"#3b82f6" }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
              <section style={cardStyle}>
                <div style={{ marginBottom: "18px" }}>
                  <h2 style={{ margin: 0, fontSize: "22px" }}>
                    🕘 {t.recent}
                  </h2>
                  <p
                    style={{
                      margin: "7px 0 0",
                      color: "#a9bbb0",
                      fontSize: "13px",
                    }}
                  >
                    {t.privacy}
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
                    {t.noPublicPredictions}
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
                                  ({nl:"nl-NL",en:"en-GB",de:"de-DE",es:"es-ES",fr:"fr-FR",it:"it-IT",pt:"pt-PT"} as Record<LanguageCode,string>)[language],
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
                              +{prediction.points} {t.points}
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
                              label={t.prediction}
                              value={`${prediction.home_score} - ${prediction.away_score}`}
                            />
                            <PredictionValue
                              label={t.result}
                              value={
                                hasResult
                                  ? `${prediction.actual_home_score} - ${prediction.actual_away_score}`
                                  : t.live
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
