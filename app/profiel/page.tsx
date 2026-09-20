"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "../Navbar";

type Profile = {
  username: string;
  first_name: string;
  last_name: string;
  is_premium: boolean;
  premium_expires_at: string | null;
  profile_theme: "default" | "emerald" | "gold" | "midnight" | "champions";
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
  competition_code: string | null;
};

type CompetitionInfo = {
  name: string;
  icon: string;
};

const competitions: Record<string, CompetitionInfo> = {
  DED: {
    name: "Eredivisie",
    icon: "🇳🇱",
  },
  PL: {
    name: "Premier League",
    icon: "🏴",
  },
  PD: {
    name: "La Liga",
    icon: "🇪🇸",
  },
  BL1: {
    name: "Bundesliga",
    icon: "🇩🇪",
  },
  SA: {
    name: "Serie A",
    icon: "🇮🇹",
  },
  FL1: {
    name: "Ligue 1",
    icon: "🇫🇷",
  },
  PPL: {
    name: "Primeira Liga",
    icon: "🇵🇹",
  },
  CL: {
    name: "Champions League",
    icon: "🏆",
  },
};

const competitionOrder = [
  "DED",
  "PL",
  "PD",
  "BL1",
  "SA",
  "FL1",
  "PPL",
  "CL",
];


type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type FootballRank = {
  min: number;
  max: number | null;
  icon: string;
  names: Record<LanguageCode, string>;
};


const profileUi = {
  nl: {
    profileNotFound:"Er is geen profiel gevonden voor dit account.", unknownError:"Onbekende fout bij het laden van je profiel.",
    loading:"Profiel laden...", retry:"Opnieuw proberen", myProfile:"Mijn profiel", leaderboardRank:"Rang", ofPlayers:(n:number)=>`van ${n} spelers`,
    points:"Punten", predictions:"Voorspellingen", exact:"Exact", accuracy:"Accuracy",
    performance:"Performance", yourPredictions:"Jouw voorspellingen", performanceIntro:"Bekijk hoe je presteert als voorspeller.",
    exactScores:"Exacte scores", exactDesc:"Precies goed voorspeld", correctResults:"Juiste uitslagen", correctDesc:"Winst, verlies of gelijk",
    playedMatches:(n:number)=>`${n} gespeelde wedstrijden`, noPlayed:"Nog geen wedstrijden gespeeld", average:"Gemiddeld", averageDesc:"Punten per gespeelde wedstrijd",
    competitions:"Competities", competitionPerformance:"Prestaties per competitie", competitionIntro:"Bekijk hoeveel punten je in iedere VoetIQ-competitie hebt verdiend.",
    predicted:"Voorspeld", history:"Mijn geschiedenis", noPredictions:"Je hebt nog geen voorspellingen gedaan.", noPredictionsDesc:"Ga naar Wedstrijden en doe je eerste voorspelling.",
    predictionCount:(n:number)=>`${n} voorspelling${n===1?"":"en"}`, predictedOn:"Voorspeld op", yourPrediction:"Jouw voorspelling", result:"Uitslag",
    notPlayed:"⏳ Nog niet gespeeld", correct:"✅ Juiste uitslag", noPoints:"❌ Geen punten", unknownCompetition:"Onbekende competitie",
    career:"🏆 Jouw VoetIQ-carrière", careerDesc:"Blijf voorspellen, verbeter je accuracy en klim op de ranglijst.", totalPoints:"Totaalpunten"
  },
  en: {
    profileNotFound:"No profile was found for this account.", unknownError:"Unknown error while loading your profile.",
    loading:"Loading profile...", retry:"Try again", myProfile:"My profile", leaderboardRank:"Rank", ofPlayers:(n:number)=>`of ${n} players`,
    points:"Points", predictions:"Predictions", exact:"Exact", accuracy:"Accuracy",
    performance:"Performance", yourPredictions:"Your predictions", performanceIntro:"See how you perform as a predictor.",
    exactScores:"Exact scores", exactDesc:"Predicted exactly right", correctResults:"Correct results", correctDesc:"Win, loss or draw",
    playedMatches:(n:number)=>`${n} matches played`, noPlayed:"No matches played yet", average:"Average", averageDesc:"Points per match played",
    competitions:"Competitions", competitionPerformance:"Performance by competition", competitionIntro:"See how many points you have earned in each VoetIQ competition.",
    predicted:"Predicted", history:"My history", noPredictions:"You haven't made any predictions yet.", noPredictionsDesc:"Go to Matches and make your first prediction.",
    predictionCount:(n:number)=>`${n} prediction${n===1?"":"s"}`, predictedOn:"Predicted on", yourPrediction:"Your prediction", result:"Result",
    notPlayed:"⏳ Not played yet", correct:"✅ Correct result", noPoints:"❌ No points", unknownCompetition:"Unknown competition",
    career:"🏆 Your VoetIQ career", careerDesc:"Keep predicting, improve your accuracy and climb the leaderboard.", totalPoints:"Total points"
  },
  de: {
    profileNotFound:"Für dieses Konto wurde kein Profil gefunden.", unknownError:"Unbekannter Fehler beim Laden deines Profils.",
    loading:"Profil wird geladen...", retry:"Erneut versuchen", myProfile:"Mein Profil", leaderboardRank:"Rang", ofPlayers:(n:number)=>`von ${n} Spielern`,
    points:"Punkte", predictions:"Tipps", exact:"Exakt", accuracy:"Genauigkeit",
    performance:"Leistung", yourPredictions:"Deine Tipps", performanceIntro:"Sieh dir an, wie gut du tippst.",
    exactScores:"Exakte Ergebnisse", exactDesc:"Genau richtig getippt", correctResults:"Richtige Ausgänge", correctDesc:"Sieg, Niederlage oder Unentschieden",
    playedMatches:(n:number)=>`${n} gespielte Spiele`, noPlayed:"Noch keine Spiele gespielt", average:"Durchschnitt", averageDesc:"Punkte pro gespieltem Spiel",
    competitions:"Wettbewerbe", competitionPerformance:"Leistung pro Wettbewerb", competitionIntro:"Sieh dir an, wie viele Punkte du in jedem VoetIQ-Wettbewerb verdient hast.",
    predicted:"Getippt", history:"Mein Verlauf", noPredictions:"Du hast noch keine Tipps abgegeben.", noPredictionsDesc:"Gehe zu Spiele und gib deinen ersten Tipp ab.",
    predictionCount:(n:number)=>`${n} Tipp${n===1?"":"s"}`, predictedOn:"Getippt am", yourPrediction:"Dein Tipp", result:"Ergebnis",
    notPlayed:"⏳ Noch nicht gespielt", correct:"✅ Richtiger Ausgang", noPoints:"❌ Keine Punkte", unknownCompetition:"Unbekannter Wettbewerb",
    career:"🏆 Deine VoetIQ-Karriere", careerDesc:"Tippe weiter, verbessere deine Genauigkeit und steige in der Rangliste.", totalPoints:"Gesamtpunkte"
  },
  es: {
    profileNotFound:"No se encontró ningún perfil para esta cuenta.", unknownError:"Error desconocido al cargar tu perfil.",
    loading:"Cargando perfil...", retry:"Intentar de nuevo", myProfile:"Mi perfil", leaderboardRank:"Clasificación", ofPlayers:(n:number)=>`de ${n} jugadores`,
    points:"Puntos", predictions:"Predicciones", exact:"Exactos", accuracy:"Precisión",
    performance:"Rendimiento", yourPredictions:"Tus predicciones", performanceIntro:"Consulta tu rendimiento como pronosticador.",
    exactScores:"Marcadores exactos", exactDesc:"Marcadores acertados exactamente", correctResults:"Resultados correctos", correctDesc:"Victoria, derrota o empate",
    playedMatches:(n:number)=>`${n} partidos jugados`, noPlayed:"Aún no hay partidos jugados", average:"Promedio", averageDesc:"Puntos por partido jugado",
    competitions:"Competiciones", competitionPerformance:"Rendimiento por competición", competitionIntro:"Consulta cuántos puntos has conseguido en cada competición de VoetIQ.",
    predicted:"Pronosticado", history:"Mi historial", noPredictions:"Aún no has hecho ninguna predicción.", noPredictionsDesc:"Ve a Partidos y haz tu primera predicción.",
    predictionCount:(n:number)=>`${n} predicci${n===1?"ón":"ones"}`, predictedOn:"Pronosticado el", yourPrediction:"Tu predicción", result:"Resultado",
    notPlayed:"⏳ Aún no jugado", correct:"✅ Resultado correcto", noPoints:"❌ Sin puntos", unknownCompetition:"Competición desconocida",
    career:"🏆 Tu carrera en VoetIQ", careerDesc:"Sigue pronosticando, mejora tu precisión y sube en la clasificación.", totalPoints:"Puntos totales"
  },
  fr: {
    profileNotFound:"Aucun profil n’a été trouvé pour ce compte.", unknownError:"Erreur inconnue lors du chargement de ton profil.",
    loading:"Chargement du profil...", retry:"Réessayer", myProfile:"Mon profil", leaderboardRank:"Classement", ofPlayers:(n:number)=>`sur ${n} joueurs`,
    points:"Points", predictions:"Pronostics", exact:"Exacts", accuracy:"Précision",
    performance:"Performance", yourPredictions:"Tes pronostics", performanceIntro:"Découvre tes performances en tant que pronostiqueur.",
    exactScores:"Scores exacts", exactDesc:"Scores parfaitement pronostiqués", correctResults:"Bons résultats", correctDesc:"Victoire, défaite ou nul",
    playedMatches:(n:number)=>`${n} matchs joués`, noPlayed:"Aucun match joué pour le moment", average:"Moyenne", averageDesc:"Points par match joué",
    competitions:"Compétitions", competitionPerformance:"Performance par compétition", competitionIntro:"Découvre combien de points tu as gagnés dans chaque compétition VoetIQ.",
    predicted:"Pronostiqué", history:"Mon historique", noPredictions:"Tu n’as encore fait aucun pronostic.", noPredictionsDesc:"Va dans Matchs et fais ton premier pronostic.",
    predictionCount:(n:number)=>`${n} pronostic${n===1?"":"s"}`, predictedOn:"Pronostiqué le", yourPrediction:"Ton pronostic", result:"Résultat",
    notPlayed:"⏳ Pas encore joué", correct:"✅ Bon résultat", noPoints:"❌ Aucun point", unknownCompetition:"Compétition inconnue",
    career:"🏆 Ta carrière VoetIQ", careerDesc:"Continue à pronostiquer, améliore ta précision et grimpe au classement.", totalPoints:"Points totaux"
  },
  it: {
    profileNotFound:"Nessun profilo trovato per questo account.", unknownError:"Errore sconosciuto durante il caricamento del profilo.",
    loading:"Caricamento profilo...", retry:"Riprova", myProfile:"Il mio profilo", leaderboardRank:"Classifica", ofPlayers:(n:number)=>`su ${n} giocatori`,
    points:"Punti", predictions:"Pronostici", exact:"Esatti", accuracy:"Precisione",
    performance:"Prestazioni", yourPredictions:"I tuoi pronostici", performanceIntro:"Scopri come stai andando come pronosticatore.",
    exactScores:"Risultati esatti", exactDesc:"Pronosticati perfettamente", correctResults:"Esiti corretti", correctDesc:"Vittoria, sconfitta o pareggio",
    playedMatches:(n:number)=>`${n} partite giocate`, noPlayed:"Nessuna partita ancora giocata", average:"Media", averageDesc:"Punti per partita giocata",
    competitions:"Competizioni", competitionPerformance:"Prestazioni per competizione", competitionIntro:"Scopri quanti punti hai guadagnato in ogni competizione VoetIQ.",
    predicted:"Pronosticato", history:"La mia cronologia", noPredictions:"Non hai ancora fatto pronostici.", noPredictionsDesc:"Vai su Partite e fai il tuo primo pronostico.",
    predictionCount:(n:number)=>`${n} pronostic${n===1?"o":"i"}`, predictedOn:"Pronosticato il", yourPrediction:"Il tuo pronostico", result:"Risultato",
    notPlayed:"⏳ Non ancora giocata", correct:"✅ Esito corretto", noPoints:"❌ Nessun punto", unknownCompetition:"Competizione sconosciuta",
    career:"🏆 La tua carriera VoetIQ", careerDesc:"Continua a pronosticare, migliora la precisione e scala la classifica.", totalPoints:"Punti totali"
  },
  pt: {
    profileNotFound:"Não foi encontrado nenhum perfil para esta conta.", unknownError:"Erro desconhecido ao carregar o teu perfil.",
    loading:"A carregar perfil...", retry:"Tentar novamente", myProfile:"O meu perfil", leaderboardRank:"Classificação", ofPlayers:(n:number)=>`de ${n} jogadores`,
    points:"Pontos", predictions:"Previsões", exact:"Exatos", accuracy:"Precisão",
    performance:"Desempenho", yourPredictions:"As tuas previsões", performanceIntro:"Vê o teu desempenho como prognosticador.",
    exactScores:"Resultados exatos", exactDesc:"Previstos exatamente", correctResults:"Resultados corretos", correctDesc:"Vitória, derrota ou empate",
    playedMatches:(n:number)=>`${n} jogos disputados`, noPlayed:"Ainda não há jogos disputados", average:"Média", averageDesc:"Pontos por jogo disputado",
    competitions:"Competições", competitionPerformance:"Desempenho por competição", competitionIntro:"Vê quantos pontos ganhaste em cada competição do VoetIQ.",
    predicted:"Previsto", history:"O meu histórico", noPredictions:"Ainda não fizeste nenhuma previsão.", noPredictionsDesc:"Vai a Jogos e faz a tua primeira previsão.",
    predictionCount:(n:number)=>`${n} previs${n===1?"ão":"ões"}`, predictedOn:"Previsto em", yourPrediction:"A tua previsão", result:"Resultado",
    notPlayed:"⏳ Ainda não disputado", correct:"✅ Resultado correto", noPoints:"❌ Sem pontos", unknownCompetition:"Competição desconhecida",
    career:"🏆 A tua carreira VoetIQ", careerDesc:"Continua a prever, melhora a tua precisão e sobe na classificação.", totalPoints:"Pontos totais"
  }
} satisfies Record<LanguageCode, Record<string, any>>;

const premiumInsightsUi: Record<LanguageCode, {
  eyebrow: string; title: string; intro: string; lockedTitle: string; lockedText: string; unlock: string;
  lastTen: string; lastTenDesc: string; exactRate: string; exactRateDesc: string; avgLastTen: string; avgLastTenDesc: string;
  bestCompetition: string; bestCompetitionDesc: string; highestMatch: string; highestMatchDesc: string; currentStreak: string; currentStreakDesc: string; bestStreak: string; bestStreakDesc: string; noData: string; matches: string;
}> = {
  nl:{eyebrow:"👑 Premium Insights",title:"Jouw uitgebreide statistieken",intro:"Duik dieper in je prestaties en ontdek waar jij het verschil maakt.",lockedTitle:"Ontgrendel Premium Insights",lockedText:"Bekijk je vorm, reeksen, beste competitie en meer met VoetIQ Premium.",unlock:"👑 Ontgrendel met VoetIQ Premium",lastTen:"Vorm laatste 10",lastTenDesc:"Juiste uitslagen in je laatste 10 gespeelde voorspellingen",exactRate:"Exact-percentage",exactRateDesc:"Percentage gespeelde voorspellingen met de exacte score",avgLastTen:"Gemiddelde laatste 10",avgLastTenDesc:"Punten per voorspelling over je laatste 10 gespeelde wedstrijden",bestCompetition:"Beste competitie",bestCompetitionDesc:"Hoogste gemiddelde punten per gespeelde voorspelling",highestMatch:"Beste voorspelling",highestMatchDesc:"Hoogste aantal punten uit één voorspelling",currentStreak:"Huidige reeks",currentStreakDesc:"Opeenvolgende juiste uitslagen vanaf je nieuwste resultaat",bestStreak:"Beste reeks",bestStreakDesc:"Langste reeks juiste uitslagen",noData:"Nog onvoldoende gespeelde voorspellingen",matches:"wedstrijden"},
  en:{eyebrow:"👑 Premium Insights",title:"Your advanced statistics",intro:"Dive deeper into your performance and discover where you make the difference.",lockedTitle:"Unlock Premium Insights",lockedText:"See your form, streaks, best competition and more with VoetIQ Premium.",unlock:"👑 Unlock with VoetIQ Premium",lastTen:"Last 10 form",lastTenDesc:"Correct results in your last 10 played predictions",exactRate:"Exact-score rate",exactRateDesc:"Percentage of played predictions with the exact score",avgLastTen:"Last 10 average",avgLastTenDesc:"Points per prediction over your last 10 played matches",bestCompetition:"Best competition",bestCompetitionDesc:"Highest average points per played prediction",highestMatch:"Best prediction",highestMatchDesc:"Highest points from a single prediction",currentStreak:"Current streak",currentStreakDesc:"Consecutive correct results from your newest result",bestStreak:"Best streak",bestStreakDesc:"Longest streak of correct results",noData:"Not enough played predictions yet",matches:"matches"},
  de:{eyebrow:"👑 Premium Insights",title:"Deine erweiterten Statistiken",intro:"Analysiere deine Leistung genauer und entdecke deine Stärken.",lockedTitle:"Premium Insights freischalten",lockedText:"Sieh Form, Serien, besten Wettbewerb und mehr mit VoetIQ Premium.",unlock:"👑 Mit VoetIQ Premium freischalten",lastTen:"Form letzte 10",lastTenDesc:"Richtige Ausgänge in deinen letzten 10 gespielten Tipps",exactRate:"Exakt-Quote",exactRateDesc:"Anteil gespielter Tipps mit exakt richtigem Ergebnis",avgLastTen:"Schnitt letzte 10",avgLastTenDesc:"Punkte pro Tipp in deinen letzten 10 gespielten Spielen",bestCompetition:"Bester Wettbewerb",bestCompetitionDesc:"Höchster Punkteschnitt pro gespieltem Tipp",highestMatch:"Bester Tipp",highestMatchDesc:"Höchste Punktzahl aus einem einzelnen Tipp",currentStreak:"Aktuelle Serie",currentStreakDesc:"Richtige Ausgänge in Folge ab dem neuesten Ergebnis",bestStreak:"Beste Serie",bestStreakDesc:"Längste Serie richtiger Ausgänge",noData:"Noch nicht genügend gespielte Tipps",matches:"Spiele"},
  es:{eyebrow:"👑 Premium Insights",title:"Tus estadísticas avanzadas",intro:"Profundiza en tu rendimiento y descubre tus puntos fuertes.",lockedTitle:"Desbloquea Premium Insights",lockedText:"Consulta tu forma, rachas, mejor competición y más con VoetIQ Premium.",unlock:"👑 Desbloquear con VoetIQ Premium",lastTen:"Forma últimos 10",lastTenDesc:"Resultados correctos en tus últimos 10 pronósticos jugados",exactRate:"Porcentaje exacto",exactRateDesc:"Porcentaje de pronósticos jugados con marcador exacto",avgLastTen:"Promedio últimos 10",avgLastTenDesc:"Puntos por pronóstico en tus últimos 10 partidos jugados",bestCompetition:"Mejor competición",bestCompetitionDesc:"Mayor promedio de puntos por pronóstico jugado",highestMatch:"Mejor pronóstico",highestMatchDesc:"Mayor puntuación obtenida en un solo pronóstico",currentStreak:"Racha actual",currentStreakDesc:"Resultados correctos consecutivos desde el resultado más reciente",bestStreak:"Mejor racha",bestStreakDesc:"Racha más larga de resultados correctos",noData:"Aún no hay suficientes pronósticos jugados",matches:"partidos"},
  fr:{eyebrow:"👑 Premium Insights",title:"Tes statistiques avancées",intro:"Analyse tes performances en profondeur et découvre tes points forts.",lockedTitle:"Débloque Premium Insights",lockedText:"Découvre ta forme, tes séries, ta meilleure compétition et plus avec VoetIQ Premium.",unlock:"👑 Débloquer avec VoetIQ Premium",lastTen:"Forme sur 10",lastTenDesc:"Bons résultats sur tes 10 derniers pronostics joués",exactRate:"Taux de scores exacts",exactRateDesc:"Pourcentage de pronostics joués avec le score exact",avgLastTen:"Moyenne sur 10",avgLastTenDesc:"Points par pronostic sur tes 10 derniers matchs joués",bestCompetition:"Meilleure compétition",bestCompetitionDesc:"Meilleure moyenne de points par pronostic joué",highestMatch:"Meilleur pronostic",highestMatchDesc:"Plus grand nombre de points sur un seul pronostic",currentStreak:"Série actuelle",currentStreakDesc:"Bons résultats consécutifs depuis le résultat le plus récent",bestStreak:"Meilleure série",bestStreakDesc:"Plus longue série de bons résultats",noData:"Pas encore assez de pronostics joués",matches:"matchs"},
  it:{eyebrow:"👑 Premium Insights",title:"Le tue statistiche avanzate",intro:"Analizza più a fondo le tue prestazioni e scopri i tuoi punti di forza.",lockedTitle:"Sblocca Premium Insights",lockedText:"Scopri forma, serie, migliore competizione e altro con VoetIQ Premium.",unlock:"👑 Sblocca con VoetIQ Premium",lastTen:"Forma ultime 10",lastTenDesc:"Esiti corretti negli ultimi 10 pronostici giocati",exactRate:"Percentuale esatta",exactRateDesc:"Percentuale di pronostici giocati con risultato esatto",avgLastTen:"Media ultime 10",avgLastTenDesc:"Punti per pronostico nelle ultime 10 partite giocate",bestCompetition:"Migliore competizione",bestCompetitionDesc:"Media punti più alta per pronostico giocato",highestMatch:"Miglior pronostico",highestMatchDesc:"Punteggio più alto ottenuto in un singolo pronostico",currentStreak:"Serie attuale",currentStreakDesc:"Esiti corretti consecutivi dal risultato più recente",bestStreak:"Migliore serie",bestStreakDesc:"Serie più lunga di esiti corretti",noData:"Non ci sono ancora abbastanza pronostici giocati",matches:"partite"},
  pt:{eyebrow:"👑 Premium Insights",title:"As tuas estatísticas avançadas",intro:"Aprofunda o teu desempenho e descobre os teus pontos fortes.",lockedTitle:"Desbloqueia Premium Insights",lockedText:"Vê a tua forma, sequências, melhor competição e mais com VoetIQ Premium.",unlock:"👑 Desbloquear com VoetIQ Premium",lastTen:"Forma últimos 10",lastTenDesc:"Resultados corretos nas tuas últimas 10 previsões jogadas",exactRate:"Percentagem exata",exactRateDesc:"Percentagem de previsões jogadas com resultado exato",avgLastTen:"Média últimos 10",avgLastTenDesc:"Pontos por previsão nos teus últimos 10 jogos disputados",bestCompetition:"Melhor competição",bestCompetitionDesc:"Maior média de pontos por previsão jogada",highestMatch:"Melhor previsão",highestMatchDesc:"Maior pontuação numa única previsão",currentStreak:"Sequência atual",currentStreakDesc:"Resultados corretos consecutivos desde o resultado mais recente",bestStreak:"Melhor sequência",bestStreakDesc:"Maior sequência de resultados corretos",noData:"Ainda não há previsões jogadas suficientes",matches:"jogos"}
};

const activityUi: Record<LanguageCode, {
  eyebrow: string;
  title: string;
  intro: string;
  noActivity: string;
  exact: (match: string, points: number) => string;
  correct: (match: string, points: number) => string;
  played: (match: string) => string;
  achievement: (name: string) => string;
  promotion: (rank: string) => string;
}> = {
  nl: {
    eyebrow: "Activiteit",
    title: "Jouw laatste activiteit",
    intro: "Je nieuwste resultaten, mijlpalen en promoties op één plek.",
    noActivity: "Nog geen activiteit om te tonen.",
    exact: (match, points) => `Exacte score bij ${match} · +${points} punten`,
    correct: (match, points) => `Juiste uitslag bij ${match} · +${points} punten`,
    played: (match) => `Uitslag verwerkt voor ${match}`,
    achievement: (name) => `Achievement behaald: ${name}`,
    promotion: (rank) => `Gepromoveerd naar ${rank}`,
  },
  en: {
    eyebrow: "Activity",
    title: "Your latest activity",
    intro: "Your newest results, milestones and promotions in one place.",
    noActivity: "No activity to show yet.",
    exact: (match, points) => `Exact score for ${match} · +${points} points`,
    correct: (match, points) => `Correct result for ${match} · +${points} points`,
    played: (match) => `Result processed for ${match}`,
    achievement: (name) => `Achievement unlocked: ${name}`,
    promotion: (rank) => `Promoted to ${rank}`,
  },
  de: {
    eyebrow: "Aktivität",
    title: "Deine neuesten Aktivitäten",
    intro: "Deine neuesten Ergebnisse, Meilensteine und Aufstiege auf einen Blick.",
    noActivity: "Noch keine Aktivität vorhanden.",
    exact: (match, points) => `Exaktes Ergebnis bei ${match} · +${points} Punkte`,
    correct: (match, points) => `Richtiger Ausgang bei ${match} · +${points} Punkte`,
    played: (match) => `Ergebnis für ${match} verarbeitet`,
    achievement: (name) => `Erfolg freigeschaltet: ${name}`,
    promotion: (rank) => `Aufgestiegen zu ${rank}`,
  },
  es: {
    eyebrow: "Actividad",
    title: "Tu actividad reciente",
    intro: "Tus resultados, hitos y ascensos más recientes en un solo lugar.",
    noActivity: "Aún no hay actividad para mostrar.",
    exact: (match, points) => `Marcador exacto en ${match} · +${points} puntos`,
    correct: (match, points) => `Resultado correcto en ${match} · +${points} puntos`,
    played: (match) => `Resultado procesado para ${match}`,
    achievement: (name) => `Logro desbloqueado: ${name}`,
    promotion: (rank) => `Ascenso a ${rank}`,
  },
  fr: {
    eyebrow: "Activité",
    title: "Ton activité récente",
    intro: "Tes derniers résultats, étapes et promotions au même endroit.",
    noActivity: "Aucune activité à afficher pour le moment.",
    exact: (match, points) => `Score exact pour ${match} · +${points} points`,
    correct: (match, points) => `Bon résultat pour ${match} · +${points} points`,
    played: (match) => `Résultat traité pour ${match}`,
    achievement: (name) => `Succès débloqué : ${name}`,
    promotion: (rank) => `Promotion vers ${rank}`,
  },
  it: {
    eyebrow: "Attività",
    title: "Le tue attività recenti",
    intro: "I tuoi ultimi risultati, traguardi e promozioni in un unico posto.",
    noActivity: "Nessuna attività da mostrare.",
    exact: (match, points) => `Risultato esatto in ${match} · +${points} punti`,
    correct: (match, points) => `Esito corretto in ${match} · +${points} punti`,
    played: (match) => `Risultato elaborato per ${match}`,
    achievement: (name) => `Obiettivo sbloccato: ${name}`,
    promotion: (rank) => `Promosso a ${rank}`,
  },
  pt: {
    eyebrow: "Atividade",
    title: "A tua atividade recente",
    intro: "Os teus resultados, marcos e promoções mais recentes num só lugar.",
    noActivity: "Ainda não há atividade para mostrar.",
    exact: (match, points) => `Resultado exato em ${match} · +${points} pontos`,
    correct: (match, points) => `Resultado correto em ${match} · +${points} pontos`,
    played: (match) => `Resultado processado para ${match}`,
    achievement: (name) => `Conquista desbloqueada: ${name}`,
    promotion: (rank) => `Promovido a ${rank}`,
  },
};

const footballRanks: FootballRank[] = [
  { min: 0, max: 49, icon: "🟤", names: { nl:"Straatvoetballer", en:"Street Footballer", de:"Straßenfußballer", es:"Futbolista callejero", fr:"Footballeur de rue", it:"Calciatore di strada", pt:"Futebolista de rua" } },
  { min: 50, max: 99, icon: "🟢", names: { nl:"Jeugdspeler", en:"Youth Player", de:"Jugendspieler", es:"Jugador juvenil", fr:"Joueur junior", it:"Giocatore giovanile", pt:"Jogador juvenil" } },
  { min: 100, max: 199, icon: "🔵", names: { nl:"Academiespeler", en:"Academy Player", de:"Akademiespieler", es:"Jugador de academia", fr:"Joueur d’académie", it:"Giocatore dell’accademia", pt:"Jogador da academia" } },
  { min: 200, max: 349, icon: "⚪", names: { nl:"Selectiespeler", en:"Squad Player", de:"Kaderspieler", es:"Jugador de plantilla", fr:"Joueur de l’effectif", it:"Giocatore della rosa", pt:"Jogador do plantel" } },
  { min: 350, max: 549, icon: "🟡", names: { nl:"Basisspeler", en:"Starting Player", de:"Stammspieler", es:"Titular", fr:"Titulaire", it:"Titolare", pt:"Titular" } },
  { min: 550, max: 799, icon: "🟠", names: { nl:"Profvoetballer", en:"Professional Footballer", de:"Profifußballer", es:"Futbolista profesional", fr:"Footballeur professionnel", it:"Calciatore professionista", pt:"Futebolista profissional" } },
  { min: 800, max: 1099, icon: "🔥", names: { nl:"Sterspeler", en:"Star Player", de:"Starspieler", es:"Jugador estrella", fr:"Joueur vedette", it:"Giocatore stella", pt:"Jogador estrela" } },
  { min: 1100, max: 1499, icon: "⭐", names: { nl:"Topspeler", en:"Top Player", de:"Topspieler", es:"Jugador de élite", fr:"Joueur d’élite", it:"Top player", pt:"Jogador de elite" } },
  { min: 1500, max: 1999, icon: "🌟", names: { nl:"Wereldster", en:"World Star", de:"Weltstar", es:"Estrella mundial", fr:"Star mondiale", it:"Stella mondiale", pt:"Estrela mundial" } },
  { min: 2000, max: 2749, icon: "🏆", names: { nl:"Kampioen", en:"Champion", de:"Champion", es:"Campeón", fr:"Champion", it:"Campione", pt:"Campeão" } },
  { min: 2750, max: 3499, icon: "👑", names: { nl:"Ballon d'Or-niveau", en:"Ballon d'Or Level", de:"Ballon-d’Or-Niveau", es:"Nivel Balón de Oro", fr:"Niveau Ballon d’Or", it:"Livello Pallone d’Oro", pt:"Nível Bola de Ouro" } },
  { min: 3500, max: null, icon: "🐐", names: { nl:"VoetIQ GOAT", en:"VoetIQ GOAT", de:"VoetIQ GOAT", es:"VoetIQ GOAT", fr:"VoetIQ GOAT", it:"VoetIQ GOAT", pt:"VoetIQ GOAT" } },
];

const rankUi: Record<LanguageCode, {careerRank:string; current:string; next:string; needed:(n:number)=>string; highest:string; points:string}> = {
  nl:{careerRank:"Voetbalrang",current:"Huidige rang",next:"Volgende rang",needed:n=>`Nog ${n} punten nodig voor promotie`,highest:"Hoogste rang bereikt",points:"punten"},
  en:{careerRank:"Football rank",current:"Current rank",next:"Next rank",needed:n=>`${n} points needed for promotion`,highest:"Highest rank reached",points:"points"},
  de:{careerRank:"Fußballrang",current:"Aktueller Rang",next:"Nächster Rang",needed:n=>`Noch ${n} Punkte bis zum Aufstieg`,highest:"Höchster Rang erreicht",points:"Punkte"},
  es:{careerRank:"Rango de fútbol",current:"Rango actual",next:"Siguiente rango",needed:n=>`Faltan ${n} puntos para ascender`,highest:"Rango máximo alcanzado",points:"puntos"},
  fr:{careerRank:"Rang football",current:"Rang actuel",next:"Rang suivant",needed:n=>`Encore ${n} points pour être promu`,highest:"Rang maximal atteint",points:"points"},
  it:{careerRank:"Rango calcistico",current:"Rango attuale",next:"Rango successivo",needed:n=>`Mancano ${n} punti alla promozione`,highest:"Rango massimo raggiunto",points:"punti"},
  pt:{careerRank:"Nível futebolístico",current:"Nível atual",next:"Próximo nível",needed:n=>`Faltam ${n} pontos para subir de nível`,highest:"Nível máximo alcançado",points:"pontos"},
};


type ProfileTheme = "default" | "emerald" | "gold" | "midnight" | "champions";

const profileThemeUi: Record<LanguageCode, {
  eyebrow: string;
  title: string;
  intro: string;
  saved: string;
  saving: string;
  premiumOnly: string;
}> = {
  nl:{eyebrow:"👑 Premium profielthema",title:"Geef je profiel een eigen stijl",intro:"Kies een exclusief thema voor jouw VoetIQ-profiel.",saved:"Profielthema opgeslagen.",saving:"Opslaan...",premiumOnly:"Premium"},
  en:{eyebrow:"👑 Premium profile theme",title:"Give your profile its own style",intro:"Choose an exclusive theme for your VoetIQ profile.",saved:"Profile theme saved.",saving:"Saving...",premiumOnly:"Premium"},
  de:{eyebrow:"👑 Premium-Profilthema",title:"Gib deinem Profil einen eigenen Stil",intro:"Wähle ein exklusives Design für dein VoetIQ-Profil.",saved:"Profilthema gespeichert.",saving:"Speichern...",premiumOnly:"Premium"},
  es:{eyebrow:"👑 Tema de perfil Premium",title:"Dale a tu perfil un estilo propio",intro:"Elige un tema exclusivo para tu perfil de VoetIQ.",saved:"Tema de perfil guardado.",saving:"Guardando...",premiumOnly:"Premium"},
  fr:{eyebrow:"👑 Thème de profil Premium",title:"Donne ton propre style à ton profil",intro:"Choisis un thème exclusif pour ton profil VoetIQ.",saved:"Thème du profil enregistré.",saving:"Enregistrement...",premiumOnly:"Premium"},
  it:{eyebrow:"👑 Tema profilo Premium",title:"Dai al tuo profilo uno stile unico",intro:"Scegli un tema esclusivo per il tuo profilo VoetIQ.",saved:"Tema del profilo salvato.",saving:"Salvataggio...",premiumOnly:"Premium"},
  pt:{eyebrow:"👑 Tema de perfil Premium",title:"Dá um estilo próprio ao teu perfil",intro:"Escolhe um tema exclusivo para o teu perfil VoetIQ.",saved:"Tema do perfil guardado.",saving:"A guardar...",premiumOnly:"Premium"}
};

const profileThemes: Array<{
  id: ProfileTheme;
  name: string;
  icon: string;
  preview: string;
}> = [
  { id:"default", name:"Default", icon:"⚽", preview:"linear-gradient(135deg,#166534,#052e16,#030712)" },
  { id:"emerald", name:"Emerald", icon:"💚", preview:"linear-gradient(135deg,#065f46,#064e3b,#022c22)" },
  { id:"gold", name:"Gold", icon:"👑", preview:"linear-gradient(135deg,#92400e,#422006,#111827)" },
  { id:"midnight", name:"Midnight", icon:"🌙", preview:"linear-gradient(135deg,#172554,#0f172a,#020617)" },
  { id:"champions", name:"Champions", icon:"🏆", preview:"linear-gradient(135deg,#312e81,#172554,#020617)" },
];

const profileHeaderThemes: Record<ProfileTheme, {
  background: string;
  borderColor: string;
  accent: string;
  accentSoft: string;
  avatarBackground: string;
  avatarRing: string;
  rankBackground: string;
  rankBorder: string;
}> = {
  default: {
    background: "linear-gradient(135deg, rgba(22,101,52,0.82), rgba(5,46,22,0.92) 55%, rgba(3,7,18,0.98))",
    borderColor: "rgba(74,222,128,0.10)",
    accent: "#86efac",
    accentSoft: "rgba(220,252,231,0.60)",
    avatarBackground: "rgba(34,197,94,0.15)",
    avatarRing: "rgba(74,222,128,0.20)",
    rankBackground: "rgba(74,222,128,0.10)",
    rankBorder: "rgba(74,222,128,0.20)",
  },
  emerald: {
    background: "linear-gradient(135deg, rgba(6,95,70,0.95), rgba(6,78,59,0.94) 52%, rgba(2,44,34,0.98))",
    borderColor: "rgba(52,211,153,0.24)",
    accent: "#6ee7b7",
    accentSoft: "rgba(209,250,229,0.64)",
    avatarBackground: "rgba(16,185,129,0.18)",
    avatarRing: "rgba(52,211,153,0.28)",
    rankBackground: "rgba(16,185,129,0.13)",
    rankBorder: "rgba(52,211,153,0.26)",
  },
  gold: {
    background: "linear-gradient(135deg, rgba(120,53,15,0.96), rgba(66,32,6,0.94) 52%, rgba(17,24,39,0.99))",
    borderColor: "rgba(253,224,71,0.30)",
    accent: "#fde68a",
    accentSoft: "rgba(254,243,199,0.65)",
    avatarBackground: "rgba(245,158,11,0.18)",
    avatarRing: "rgba(253,224,71,0.30)",
    rankBackground: "rgba(245,158,11,0.13)",
    rankBorder: "rgba(253,224,71,0.28)",
  },
  midnight: {
    background: "linear-gradient(135deg, rgba(23,37,84,0.98), rgba(15,23,42,0.96) 55%, rgba(2,6,23,0.99))",
    borderColor: "rgba(129,140,248,0.24)",
    accent: "#c7d2fe",
    accentSoft: "rgba(224,231,255,0.62)",
    avatarBackground: "rgba(99,102,241,0.16)",
    avatarRing: "rgba(129,140,248,0.28)",
    rankBackground: "rgba(99,102,241,0.12)",
    rankBorder: "rgba(129,140,248,0.25)",
  },
  champions: {
    background: "linear-gradient(135deg, rgba(49,46,129,0.98), rgba(30,58,138,0.94) 50%, rgba(2,6,23,0.99))",
    borderColor: "rgba(165,180,252,0.28)",
    accent: "#ddd6fe",
    accentSoft: "rgba(237,233,254,0.64)",
    avatarBackground: "rgba(139,92,246,0.17)",
    avatarRing: "rgba(196,181,253,0.30)",
    rankBackground: "rgba(99,102,241,0.14)",
    rankBorder: "rgba(196,181,253,0.27)",
  },
};

export default function ProfielPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(
    null
  );

  const [predictions, setPredictions] = useState<
    Prediction[]
  >([]);

  const [rankPosition, setRankPosition] = useState<
    number | null
  >(null);

  const [totalPlayers, setTotalPlayers] = useState(0);

  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>("nl");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [themeSaving, setThemeSaving] = useState(false);
  const [themeMessage, setThemeMessage] = useState("");

  useEffect(() => {
    loadProfile();

    const stored = window.localStorage.getItem("voetiq-language");
    if (stored && ["nl","en","de","es","fr","it","pt"].includes(stored)) {
      setLanguage(stored as LanguageCode);
    }

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language: LanguageCode }>;
      if (customEvent.detail?.language) setLanguage(customEvent.detail.language);
    }

    window.addEventListener("voetiq-language-change", handleLanguageChange);
    return () => window.removeEventListener("voetiq-language-change", handleLanguageChange);
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

      const {
        data: profileData,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(
          "username, first_name, last_name, is_premium, premium_expires_at, profile_theme"
        )
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profileData) {
        throw new Error(
          profileUi[language].profileNotFound
        );
      }

      const {
        data: predictionData,
        error: predictionError,
      } = await supabase
        .from("predictions")
        .select(
          "id, match_id, match_name, home_score, away_score, actual_home_score, actual_away_score, points, created_at, competition_code"
        )
        .eq("user_id", user.id)
        .order("created_at", {
          ascending: false,
        });

      if (predictionError) {
        throw predictionError;
      }

      const {
        data: rankingData,
        error: rankingError,
      } = await supabase.rpc("get_leaderboard");

      if (rankingError) {
        console.error(
          "Ranglijst fout:",
          rankingError
        );
      } else {
        const ranking = (rankingData || []) as {
          username: string;
          total_points: number;
        }[];

        setTotalPlayers(ranking.length);

        const currentPlayerIndex =
          ranking.findIndex(
            (player) =>
              player.username ===
              profileData.username
          );

        if (currentPlayerIndex !== -1) {
          setRankPosition(
            currentPlayerIndex + 1
          );
        }
      }

      setProfile(profileData);
      setPredictions(predictionData || []);
    } catch (error: unknown) {
      console.error("PROFIEL FOUT:", error);

      const message =
        error instanceof Error
          ? error.message
          : profileUi[language].unknownError;

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }

  const totalPoints = predictions.reduce(
    (total, prediction) =>
      total + (prediction.points || 0),
    0
  );

  const currentFootballRankIndex = footballRanks.findIndex(
    (rank) => totalPoints >= rank.min && (rank.max === null || totalPoints <= rank.max)
  );
  const currentFootballRank = footballRanks[Math.max(0, currentFootballRankIndex)];
  const nextFootballRank =
    currentFootballRankIndex >= 0 && currentFootballRankIndex < footballRanks.length - 1
      ? footballRanks[currentFootballRankIndex + 1]
      : null;
  const rankStart = currentFootballRank.min;
  const rankEnd = nextFootballRank ? nextFootballRank.min : currentFootballRank.min;
  const rankProgress = nextFootballRank
    ? Math.min(100, Math.max(0, ((totalPoints - rankStart) / (rankEnd - rankStart)) * 100))
    : 100;
  const pointsNeeded = nextFootballRank ? Math.max(0, nextFootballRank.min - totalPoints) : 0;
  const rui = rankUi[language];
  const t = profileUi[language];
  const aui = activityUi[language];

  const isCorrectResult = (prediction: Prediction) => {
    if (
      prediction.actual_home_score === null ||
      prediction.actual_away_score === null
    ) {
      return false;
    }

    const predicted =
      prediction.home_score === prediction.away_score
        ? "draw"
        : prediction.home_score > prediction.away_score
          ? "home"
          : "away";

    const actual =
      prediction.actual_home_score === prediction.actual_away_score
        ? "draw"
        : prediction.actual_home_score > prediction.actual_away_score
          ? "home"
          : "away";

    return predicted === actual;
  };

  const achievementNames: Record<LanguageCode, {
    firstPrediction: string;
    firstPoints: string;
    firstCorrect: string;
    firstExact: string;
    tenPredictions: string;
    tenCorrect: string;
    hundredPoints: string;
  }> = {
    nl: { firstPrediction:"Debutant", firstPoints:"Eerste punten", firstCorrect:"Goed gezien", firstExact:"Scherpschutter", tenPredictions:"Vaste voorspeller", tenCorrect:"Voetbalkenner", hundredPoints:"100-puntenclub" },
    en: { firstPrediction:"Debutant", firstPoints:"First points", firstCorrect:"Good call", firstExact:"Sharpshooter", tenPredictions:"Regular predictor", tenCorrect:"Football expert", hundredPoints:"100-point club" },
    de: { firstPrediction:"Debütant", firstPoints:"Erste Punkte", firstCorrect:"Gut gesehen", firstExact:"Scharfschütze", tenPredictions:"Stamm-Tipper", tenCorrect:"Fußballkenner", hundredPoints:"100-Punkte-Club" },
    es: { firstPrediction:"Debutante", firstPoints:"Primeros puntos", firstCorrect:"Buen pronóstico", firstExact:"Francotirador", tenPredictions:"Pronosticador habitual", tenCorrect:"Experto en fútbol", hundredPoints:"Club de 100 puntos" },
    fr: { firstPrediction:"Débutant", firstPoints:"Premiers points", firstCorrect:"Bien vu", firstExact:"Tireur d’élite", tenPredictions:"Pronostiqueur régulier", tenCorrect:"Expert football", hundredPoints:"Club des 100 points" },
    it: { firstPrediction:"Debuttante", firstPoints:"Primi punti", firstCorrect:"Ben visto", firstExact:"Cecchino", tenPredictions:"Pronosticatore abituale", tenCorrect:"Esperto di calcio", hundredPoints:"Club dei 100 punti" },
    pt: { firstPrediction:"Estreante", firstPoints:"Primeiros pontos", firstCorrect:"Boa previsão", firstExact:"Atirador de elite", tenPredictions:"Prognosticador habitual", tenCorrect:"Especialista em futebol", hundredPoints:"Clube dos 100 pontos" },
  };

  const playedChronological = [...predictions]
    .filter(
      (prediction) =>
        prediction.actual_home_score !== null &&
        prediction.actual_away_score !== null
    )
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  const timelineItems: { id: string; icon: string; title: string; date: string }[] = [];
  let runningPoints = 0;
  let runningCorrect = 0;
  let runningExact = 0;
  let previousRankIndex = 0;

  playedChronological.forEach((prediction, index) => {
    const exact =
      prediction.home_score === prediction.actual_home_score &&
      prediction.away_score === prediction.actual_away_score;
    const correct = isCorrectResult(prediction);
    const beforePoints = runningPoints;

    runningPoints += prediction.points || 0;
    if (correct) runningCorrect += 1;
    if (exact) runningExact += 1;

    timelineItems.push({
      id: `prediction-${prediction.id}`,
      icon: exact ? "🎯" : correct ? "✅" : "⚽",
      title: exact
        ? aui.exact(prediction.match_name, prediction.points || 0)
        : correct
          ? aui.correct(prediction.match_name, prediction.points || 0)
          : aui.played(prediction.match_name),
      date: prediction.created_at,
    });

    const names = achievementNames[language];

    if (index === 0) {
      timelineItems.push({
        id: `achievement-debut-${prediction.id}`,
        icon: "🏅",
        title: aui.achievement(names.firstPrediction),
        date: prediction.created_at,
      });
    }
    if (beforePoints === 0 && runningPoints > 0) {
      timelineItems.push({
        id: `achievement-points-${prediction.id}`,
        icon: "🪙",
        title: aui.achievement(names.firstPoints),
        date: prediction.created_at,
      });
    }
    if (correct && runningCorrect === 1) {
      timelineItems.push({
        id: `achievement-correct-${prediction.id}`,
        icon: "✅",
        title: aui.achievement(names.firstCorrect),
        date: prediction.created_at,
      });
    }
    if (exact && runningExact === 1) {
      timelineItems.push({
        id: `achievement-exact-${prediction.id}`,
        icon: "🎯",
        title: aui.achievement(names.firstExact),
        date: prediction.created_at,
      });
    }
    if (index + 1 === 10) {
      timelineItems.push({
        id: `achievement-tenpred-${prediction.id}`,
        icon: "📋",
        title: aui.achievement(names.tenPredictions),
        date: prediction.created_at,
      });
    }
    if (correct && runningCorrect === 10) {
      timelineItems.push({
        id: `achievement-tencorrect-${prediction.id}`,
        icon: "⚽",
        title: aui.achievement(names.tenCorrect),
        date: prediction.created_at,
      });
    }
    if (beforePoints < 100 && runningPoints >= 100) {
      timelineItems.push({
        id: `achievement-100points-${prediction.id}`,
        icon: "💯",
        title: aui.achievement(names.hundredPoints),
        date: prediction.created_at,
      });
    }

    let currentRankIndex = 0;
    for (let i = 0; i < footballRanks.length; i += 1) {
      if (runningPoints >= footballRanks[i].min) currentRankIndex = i;
    }

    if (currentRankIndex > previousRankIndex) {
      for (let i = previousRankIndex + 1; i <= currentRankIndex; i += 1) {
        timelineItems.push({
          id: `promotion-${i}-${prediction.id}`,
          icon: "⬆️",
          title: aui.promotion(
            `${footballRanks[i].icon} ${footballRanks[i].names[language]}`
          ),
          date: prediction.created_at,
        });
      }
    }
    previousRankIndex = currentRankIndex;
  });

  const activityItems = timelineItems
    .sort(
      (a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 8);

  const totalPredictions = predictions.length;

  const playedPredictions = predictions.filter(
    (prediction) =>
      prediction.actual_home_score !== null &&
      prediction.actual_away_score !== null
  );

  const exactPredictions =
    playedPredictions.filter(
      (prediction) =>
        prediction.home_score ===
          prediction.actual_home_score &&
        prediction.away_score ===
          prediction.actual_away_score
    ).length;

  const correctResults =
    playedPredictions.filter((prediction) => {
      const predictedResult =
        prediction.home_score ===
        prediction.away_score
          ? "draw"
          : prediction.home_score >
            prediction.away_score
          ? "home"
          : "away";

      const actualHomeScore =
        prediction.actual_home_score!;

      const actualAwayScore =
        prediction.actual_away_score!;

      const actualResult =
        actualHomeScore === actualAwayScore
          ? "draw"
          : actualHomeScore >
            actualAwayScore
          ? "home"
          : "away";

      return predictedResult === actualResult;
    }).length;

  const accuracy =
    playedPredictions.length > 0
      ? Math.round(
          (correctResults /
            playedPredictions.length) *
            100
        )
      : 0;

  const averagePoints =
    playedPredictions.length > 0
      ? (
          totalPoints /
          playedPredictions.length
        ).toFixed(1)
      : "0.0";

  const competitionStats =
    competitionOrder.map((code) => {
      const competitionPredictions =
        predictions.filter(
          (prediction) =>
            prediction.competition_code === code
        );

      const played =
        competitionPredictions.filter(
          (prediction) =>
            prediction.actual_home_score !== null &&
            prediction.actual_away_score !== null
        );

      const points =
        competitionPredictions.reduce(
          (total, prediction) =>
            total +
            (prediction.points || 0),
          0
        );

      const exact = played.filter(
        (prediction) =>
          prediction.home_score ===
            prediction.actual_home_score &&
          prediction.away_score ===
            prediction.actual_away_score
      ).length;

      return {
        code,
        ...competitions[code],
        predictions:
          competitionPredictions.length,
        played: played.length,
        points,
        exact,
      };
    });

  const premiumActive = Boolean(
    profile?.is_premium === true &&
    (!profile.premium_expires_at || new Date(profile.premium_expires_at).getTime() > Date.now())
  );
  const pui = premiumInsightsUi[language];
  const selectedProfileTheme: ProfileTheme =
    premiumActive && profile?.profile_theme
      ? profile.profile_theme
      : "default";
  const activeHeaderTheme = profileHeaderThemes[selectedProfileTheme];

  const recentPlayed = [...playedPredictions]
    .sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const lastTen = recentPlayed.slice(0, 10);
  const lastTenCorrect = lastTen.filter(isCorrectResult).length;
  const lastTenPoints = lastTen.reduce((sum,p) => sum + (p.points || 0), 0);
  const lastTenAverage = lastTen.length ? (lastTenPoints / lastTen.length).toFixed(1) : "0.0";
  const exactRate = playedPredictions.length ? Math.round((exactPredictions / playedPredictions.length) * 100) : 0;
  const highestMatchPoints = playedPredictions.length ? Math.max(...playedPredictions.map(p => p.points || 0)) : 0;

  const competitionPremiumStats = competitionOrder.map((code) => {
    const played = playedPredictions.filter(p => p.competition_code === code);
    const points = played.reduce((sum,p) => sum + (p.points || 0), 0);
    return { code, name: competitions[code].name, icon: competitions[code].icon, played: played.length, average: played.length ? points / played.length : -1 };
  }).filter(item => item.played > 0).sort((a,b) => b.average - a.average);
  const bestCompetition = competitionPremiumStats[0] || null;

  let currentStreak = 0;
  for (const prediction of recentPlayed) {
    if (isCorrectResult(prediction)) currentStreak += 1; else break;
  }
  let bestStreak = 0;
  let runningStreak = 0;
  [...playedPredictions].sort((a,b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()).forEach((prediction) => {
    if (isCorrectResult(prediction)) { runningStreak += 1; bestStreak = Math.max(bestStreak, runningStreak); } else runningStreak = 0;
  });

  async function saveProfileTheme(theme: ProfileTheme) {
    if (!profile || themeSaving) return;
    if (theme !== "default" && !premiumActive) {
      router.push("/premium");
      return;
    }

    setThemeSaving(true);
    setThemeMessage("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/inloggen");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({ profile_theme: theme })
      .eq("id", user.id);

    if (error) {
      console.error("PROFIELTHEMA FOUT:", error);
      setThemeMessage(error.message);
      setThemeSaving(false);
      return;
    }

    setProfile((current) =>
      current ? { ...current, profile_theme: theme } : current
    );
    setThemeMessage(profileThemeUi[language].saved);
    setThemeSaving(false);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString(
      ({nl:"nl-NL",en:"en-GB",de:"de-DE",es:"es-ES",fr:"fr-FR",it:"it-IT",pt:"pt-PT"} as Record<LanguageCode,string>)[language],
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  function getPredictionStatus(
    prediction: Prediction
  ) {
    const hasResult =
      prediction.actual_home_score !== null &&
      prediction.actual_away_score !== null;

    if (!hasResult) {
      return {
        label: t.notPlayed,
        color: "#8fa99a",
        background:
          "rgba(255,255,255,0.05)",
      };
    }

    const isExact =
      prediction.home_score ===
        prediction.actual_home_score &&
      prediction.away_score ===
        prediction.actual_away_score;

    if (isExact) {
      return {
        label: "🎯 Exact",
        color: "#2ee681",
        background:
          "rgba(46,230,129,0.12)",
      };
    }

    if (prediction.points > 0) {
      return {
        label: t.correct,
        color: "#9ee7bd",
        background:
          "rgba(46,230,129,0.08)",
      };
    }

    return {
      label: t.noPoints,
      color: "#a9aaa9",
      background:
        "rgba(255,255,255,0.04)",
    };
  }

  function getCompetition(
    code: string | null
  ) {
    if (!code || !competitions[code]) {
      return {
        name: t.unknownCompetition,
        icon: "⚽",
      };
    }

    return competitions[code];
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#07110e_0%,#091713_50%,#050a08_100%)] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-6 sm:py-12">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center text-green-100/70">
            {t.loading}
          </div>
        )}

        {!loading && errorMessage && (
          <div className="mx-auto max-w-xl rounded-2xl border border-red-400/20 bg-red-500/10 p-8 text-center">
            <div className="mb-3 text-4xl">
              ⚠️
            </div>

            <p className="font-semibold text-red-200">
              {errorMessage}
            </p>

            <button
              onClick={loadProfile}
              className="mt-5 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition hover:bg-green-500"
            >
              {t.retry}
            </button>
          </div>
        )}

        {!loading &&
          !errorMessage &&
          profile && (
            <>
              <section
                className="overflow-hidden rounded-3xl border shadow-2xl transition-all duration-300"
                style={{
                  background: activeHeaderTheme.background,
                  borderColor: activeHeaderTheme.borderColor,
                }}
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-green-500/15 text-4xl ring-1 ring-green-400/20">
                        ⚽
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">
                          {t.myProfile}
                        </p>

                        <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                          {profile.username}
                        </h1>

                        <p className="mt-1 text-sm text-green-100/60">
                          {profile.first_name}{" "}
                          {profile.last_name}
                        </p>
                      </div>
                    </div>

                    {rankPosition !== null && (
                      <div className="rounded-2xl border border-green-400/20 bg-green-400/10 px-5 py-4 text-center sm:min-w-[180px]">
                        <p className="text-xs font-bold uppercase tracking-wide text-green-300">
                          {t.leaderboardRank}
                        </p>

                        <p className="mt-1 text-3xl font-black text-white">
                          #{rankPosition}
                        </p>

                        <p className="text-xs text-green-100/50">
                          {t.ofPlayers(totalPlayers)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 border-t border-white/10 sm:grid-cols-4">
                  <ProfileHeaderStat
                    label={t.points}
                    value={totalPoints.toString()}
                  />

                  <ProfileHeaderStat
                    label={t.predictions}
                    value={totalPredictions.toString()}
                  />

                  <ProfileHeaderStat
                    label={t.exact}
                    value={exactPredictions.toString()}
                  />

                  <ProfileHeaderStat
                    label={t.accuracy}
                    value={`${accuracy}%`}
                  />
                </div>
              </section>

              {premiumActive && (
                <section className="mt-8 overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-400/[0.08] via-green-950/70 to-gray-950 p-6 sm:p-7">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">
                      {profileThemeUi[language].eyebrow}
                    </p>
                    <h2 className="mt-1 text-2xl font-black">
                      {profileThemeUi[language].title}
                    </h2>
                    <p className="mt-1 text-sm text-green-100/50">
                      {profileThemeUi[language].intro}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                    {profileThemes.map((theme) => {
                      const selected = (profile.profile_theme || "default") === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          disabled={themeSaving}
                          onClick={() => saveProfileTheme(theme.id)}
                          className={`overflow-hidden rounded-2xl border text-left transition ${
                            selected
                              ? "border-amber-300/70 ring-2 ring-amber-300/20"
                              : "border-white/10 hover:border-amber-300/30"
                          }`}
                        >
                          <div
                            className="h-20"
                            style={{ background: theme.preview }}
                          />
                          <div className="bg-black/30 px-4 py-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-black text-white">
                                {theme.icon} {theme.name}
                              </span>
                              {selected && (
                                <span className="text-xs font-black text-amber-300">✓</span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {themeMessage && (
                    <p className="mt-4 text-sm font-bold text-amber-200">
                      {themeMessage}
                    </p>
                  )}
                  {themeSaving && (
                    <p className="mt-4 text-sm text-green-100/50">
                      {profileThemeUi[language].saving}
                    </p>
                  )}
                </section>
              )}

              <section className="mt-8 rounded-3xl border border-green-400/15 bg-gradient-to-br from-green-900/70 via-green-950/80 to-gray-950 p-6 sm:p-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">{rui.careerRank}</p>
                    <p className="mt-2 text-sm text-green-100/45">{rui.current}</p>
                    <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                      {currentFootballRank.icon} {currentFootballRank.names[language]}
                    </h2>
                  </div>

                  <div className="sm:text-right">
                    {nextFootballRank ? (
                      <>
                        <p className="text-xs text-green-100/45">{rui.next}</p>
                        <p className="mt-1 font-black text-green-300">
                          {nextFootballRank.icon} {nextFootballRank.names[language]}
                        </p>
                      </>
                    ) : (
                      <p className="font-black text-green-300">🐐 {rui.highest}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                    <span className="font-bold text-green-100/55">
                      {totalPoints} {rui.points}
                    </span>
                    <span className="font-bold text-green-300">
                      {nextFootballRank ? `${nextFootballRank.min} ${rui.points}` : rui.highest}
                    </span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-green-400 transition-all duration-500"
                      style={{ width: `${rankProgress}%` }}
                    />
                  </div>
                  <p className="mt-3 text-sm font-bold text-green-100/60">
                    {nextFootballRank ? rui.needed(pointsNeeded) : rui.highest}
                  </p>
                </div>
              </section>

              <section className="mt-8 rounded-3xl border border-green-400/10 bg-white/[0.035] p-6 sm:p-7">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                    {aui.eyebrow}
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    {aui.title}
                  </h2>
                  <p className="mt-1 text-sm text-green-100/50">
                    {aui.intro}
                  </p>
                </div>

                {activityItems.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-black/10 px-5 py-8 text-center text-sm text-green-100/50">
                    {aui.noActivity}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activityItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 px-4 py-4"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-xl ring-1 ring-green-400/10">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white">
                            {item.title}
                          </p>
                          <p className="mt-1 text-xs text-green-100/35">
                            {formatDate(item.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              <section className="mt-8">
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                    {t.performance}
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    {t.yourPredictions}
                  </h2>

                  <p className="mt-1 text-sm text-green-100/50">
                    {t.performanceIntro}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <PerformanceCard
                    icon="🎯"
                    label={t.exactScores}
                    value={exactPredictions.toString()}
                    description={t.exactDesc}
                  />

                  <PerformanceCard
                    icon="✅"
                    label={t.correctResults}
                    value={correctResults.toString()}
                    description={t.correctDesc}
                  />

                  <PerformanceCard
                    icon="📈"
                    label={t.accuracy}
                    value={`${accuracy}%`}
                    description={
                      playedPredictions.length > 0
                        ? t.playedMatches(playedPredictions.length)
                        : t.noPlayed
                    }
                  />

                  <PerformanceCard
                    icon="⭐"
                    label={t.average}
                    value={averagePoints}
                    description={t.averageDesc}
                  />
                </div>
              </section>

              <section className="mt-10 overflow-hidden rounded-3xl border border-amber-300/20 bg-gradient-to-br from-amber-400/[0.08] via-green-950/70 to-gray-950 p-6 sm:p-7">
                <div className="mb-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-300">{pui.eyebrow}</p>
                  <h2 className="mt-1 text-2xl font-black">{premiumActive ? pui.title : pui.lockedTitle}</h2>
                  <p className="mt-1 text-sm text-green-100/50">{premiumActive ? pui.intro : pui.lockedText}</p>
                </div>

                {!premiumActive ? (
                  <div className="rounded-2xl border border-amber-300/15 bg-black/20 px-6 py-10 text-center">
                    <div className="text-5xl">🔒</div>
                    <h3 className="mt-4 text-xl font-black">{pui.lockedTitle}</h3>
                    <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-green-100/50">{pui.lockedText}</p>
                    <button onClick={() => router.push("/premium")} className="mt-6 rounded-xl bg-amber-300 px-5 py-3 font-black text-gray-950 transition hover:bg-amber-200">{pui.unlock}</button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <PremiumInsightCard icon="🔥" label={pui.lastTen} value={`${lastTenCorrect}/${lastTen.length || 0}`} description={pui.lastTenDesc} />
                    <PremiumInsightCard icon="🎯" label={pui.exactRate} value={`${exactRate}%`} description={pui.exactRateDesc} />
                    <PremiumInsightCard icon="📊" label={pui.avgLastTen} value={lastTenAverage} description={pui.avgLastTenDesc} />
                    <PremiumInsightCard icon="🏆" label={pui.bestCompetition} value={bestCompetition ? `${bestCompetition.icon} ${bestCompetition.name}` : "—"} description={bestCompetition ? `${bestCompetition.average.toFixed(1)} ${t.points} · ${bestCompetition.played} ${pui.matches}` : pui.noData} />
                    <PremiumInsightCard icon="⭐" label={pui.highestMatch} value={playedPredictions.length ? highestMatchPoints.toString() : "—"} description={playedPredictions.length ? pui.highestMatchDesc : pui.noData} />
                    <PremiumInsightCard icon="⚡" label={pui.currentStreak} value={playedPredictions.length ? currentStreak.toString() : "—"} description={playedPredictions.length ? pui.currentStreakDesc : pui.noData} />
                    <PremiumInsightCard icon="👑" label={pui.bestStreak} value={playedPredictions.length ? bestStreak.toString() : "—"} description={playedPredictions.length ? pui.bestStreakDesc : pui.noData} />
                  </div>
                )}
              </section>

              <section className="mt-10">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                    {t.competitions}
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    {t.competitionPerformance}
                  </h2>

                  <p className="mt-1 text-sm text-green-100/50">
                    {t.competitionIntro}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {competitionStats.map(
                    (competition) => (
                      <div
                        key={competition.code}
                        className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-green-400/20 hover:bg-white/[0.07]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="text-2xl">
                            {competition.icon}
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-black text-green-300">
                              {competition.points}
                            </div>

                            <div className="text-[10px] font-bold uppercase tracking-wide text-green-100/35">
                              {t.points}
                            </div>
                          </div>
                        </div>

                        <h3 className="mt-4 font-black text-white">
                          {competition.name}
                        </h3>

                        <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
                          <div>
                            <p className="text-lg font-black">
                              {competition.predictions}
                            </p>

                            <p className="text-[10px] uppercase tracking-wide text-green-100/35">
                              {t.predicted}
                            </p>
                          </div>

                          <div>
                            <p className="text-lg font-black">
                              {competition.exact}
                            </p>

                            <p className="text-[10px] uppercase tracking-wide text-green-100/35">
                              Exact
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>

              <section className="mt-10">
                <div className="mb-5 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-400">
                      {t.history}
                    </p>

                    <h2 className="mt-1 text-2xl font-black">
                      {t.predictions}
                    </h2>
                  </div>

                  <p className="text-sm text-green-100/40">
{t.predictionCount(totalPredictions)}
                  </p>
                </div>

                {predictions.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center">
                    <div className="text-4xl">
                      ⚽
                    </div>

                    <p className="mt-3 font-bold">
                      {t.noPredictions}
                    </p>

                    <p className="mt-1 text-sm text-green-100/50">
                      {t.noPredictionsDesc}
                    </p>
                  </div>
                )}

                <div className="space-y-3">
                  {predictions.map(
                    (prediction) => {
                      const status =
                        getPredictionStatus(
                          prediction
                        );

                      const competition =
                        getCompetition(
                          prediction.competition_code
                        );

                      const hasResult =
                        prediction.actual_home_score !==
                          null &&
                        prediction.actual_away_score !==
                          null;

                      return (
                        <article
                          key={prediction.id}
                          className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-green-400/20 hover:bg-white/[0.07]"
                        >
                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                            <div className="min-w-0">
                              <div className="mb-2 inline-flex items-center gap-2 rounded-lg bg-green-500/10 px-2.5 py-1 text-[11px] font-bold text-green-200 ring-1 ring-green-400/10">
                                <span>
                                  {
                                    competition.icon
                                  }
                                </span>

                                <span>
                                  {
                                    competition.name
                                  }
                                </span>
                              </div>

                              <p className="font-bold text-white">
                                {
                                  prediction.match_name
                                }
                              </p>

                              <p className="mt-1 text-xs text-green-100/40">
                                {t.predictedOn}{" "}
                                {formatDate(
                                  prediction.created_at
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <ScoreBox
                                label={t.yourPrediction}
                                home={
                                  prediction.home_score
                                }
                                away={
                                  prediction.away_score
                                }
                              />

                              {hasResult && (
                                <>
                                  <span className="text-xl font-black text-green-100/20">
                                    →
                                  </span>

                                  <ScoreBox
                                    label={t.result}
                                    home={
                                      prediction.actual_home_score!
                                    }
                                    away={
                                      prediction.actual_away_score!
                                    }
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/5 pt-4">
                            <span
                              className="rounded-lg px-3 py-1.5 text-xs font-bold"
                              style={{
                                color:
                                  status.color,
                                background:
                                  status.background,
                              }}
                            >
                              {status.label}
                            </span>

                            <span
                              className={`text-sm font-black ${
                                prediction.points > 0
                                  ? "text-green-300"
                                  : "text-green-100/40"
                              }`}
                            >
                              +
                              {prediction.points || 0}{" "}
                              {t.points}
                            </span>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              </section>

              <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black">
                      {t.career}
                    </p>

                    <p className="mt-1 text-sm text-green-100/45">
                      {t.careerDesc}
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-500/10 px-4 py-3 text-center ring-1 ring-green-400/10">
                    <p className="text-xs text-green-100/50">
                      {t.totalPoints}
                    </p>

                    <p className="text-xl font-black text-green-300">
                      {totalPoints}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
      </section>
    </main>
  );
}

function ProfileHeaderStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="border-r border-white/10 px-4 py-5 text-center last:border-r-0">
      <p className="text-xl font-black text-white sm:text-2xl">
        {value}
      </p>

      <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-green-100/40">
        {label}
      </p>
    </div>
  );
}

function PerformanceCard({
  icon,
  label,
  value,
  description,
}: {
  icon: string;
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:border-green-400/20 hover:bg-white/[0.07]">
      <div className="flex items-center justify-between">
        <span className="text-2xl">
          {icon}
        </span>

        <span className="text-2xl font-black text-white">
          {value}
        </span>
      </div>

      <p className="mt-4 font-bold text-white">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-green-100/40">
        {description}
      </p>
    </div>
  );
}

function PremiumInsightCard({ icon, label, value, description }: { icon: string; label: string; value: string; description: string; }) {
  return (
    <div className="rounded-2xl border border-amber-300/10 bg-black/20 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-right text-xl font-black text-amber-200">{value}</span>
      </div>
      <p className="mt-4 font-black text-white">{label}</p>
      <p className="mt-1 text-xs leading-5 text-green-100/45">{description}</p>
    </div>
  );
}

function ScoreBox({
  label,
  home,
  away,
}: {
  label: string;
  home: number;
  away: number;
}) {
  return (
    <div className="min-w-[90px] text-center">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-green-100/35">
        {label}
      </p>

      <div className="rounded-xl border border-white/10 bg-black/10 px-3 py-2">
        <span className="text-xl font-black">
          {home} - {away}
        </span>
      </div>
    </div>
  );
}
