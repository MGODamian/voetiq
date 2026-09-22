"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Match = {
  id: number;
  utcDate: string;
  status: string;
  matchday?: number;
  homeTeam: {
    name: string;
    crest?: string;
  };
  awayTeam: {
    name: string;
    crest?: string;
  };
  competition: {
    name: string;
  };
};

type Prediction = {
  home: string;
  away: string;
};

type Competition = {
  code: string;
  name: string;
  flag: string;
};

type StoredPrediction = {
  match_id: number;
  home_score: number;
  away_score: number;
};

type StandingRow = {
  position: number;
  team: {
    id: number | null;
    name: string;
    shortName: string;
    tla: string | null;
    crest: string | null;
  };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
};

type StandingsResponse = {
  competition?: {
    id: number | null;
    name: string;
    code: string;
    emblem: string | null;
  };
  table?: StandingRow[];
  error?: string;
};


type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type TranslationKey =
  | "matches"
  | "subtitle"
  | "competition"
  | "filled"
  | "loading"
  | "noUpcoming"
  | "noUpcomingDescription"
  | "previous"
  | "matchday"
  | "next"
  | "predicted"
  | "predictionClosed"
  | "saving"
  | "changePrediction"
  | "savePrediction"
  | "matchesLoadFailed"
  | "completeScore"
  | "validScore"
  | "loginRequired"
  | "predictionSaveFailed"
  | "predictionSaved"
  | "predictionSaveError"
  | "premiumRequired"
  | "unlockPremium"
  | "premiumOnly"
  | "premiumGateTitle"
  | "premiumGateDescription"
  | "back"
  | "timeTbd"
  | "matchCenter";

const localeByLanguage: Record<LanguageCode, string> = {
  nl: "nl-NL",
  en: "en-GB",
  de: "de-DE",
  es: "es-ES",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-PT",
};

const translations: Record<
  LanguageCode,
  Record<TranslationKey, string>
> = {
  nl: {
    matches: "Wedstrijden",
    subtitle: "Voorspel de uitslagen en verdien punten.",
    competition: "Competitie",
    filled: "Ingevuld",
    loading: "Wedstrijden laden...",
    noUpcoming: "Geen komende wedstrijden",
    noUpcomingDescription:
      "Er zijn momenteel geen aankomende wedstrijden beschikbaar voor deze competitie.",
    previous: "Vorige",
    matchday: "Speelronde",
    next: "Volgende",
    predicted: "Voorspeld",
    predictionClosed: "Voorspelling gesloten",
    saving: "Opslaan...",
    changePrediction: "Voorspelling wijzigen",
    savePrediction: "Voorspelling opslaan",
    matchesLoadFailed: "De wedstrijden konden niet worden opgehaald.",
    completeScore: "Vul eerst een volledige uitslag in.",
    validScore: "Vul een geldige uitslag in van 0 t/m 20.",
    loginRequired: "Je moet ingelogd zijn om een voorspelling op te slaan.",
    predictionSaveFailed: "Je voorspelling kon niet worden opgeslagen.",
    predictionSaved: "Je voorspelling is opgeslagen.",
    predictionSaveError:
      "Er ging iets mis bij het opslaan van je voorspelling.",
    premiumRequired: "Voor Champions League-voorspellingen heb je VoetIQ Premium nodig.",
    unlockPremium: "Ontgrendel met VoetIQ Premium",
    premiumOnly: "Alleen met Premium",
    premiumGateTitle: "Champions League is onderdeel van VoetIQ Premium",
    premiumGateDescription: "Word Premium om Champions League-wedstrijden te bekijken en te voorspellen.",
    back: "Terug",
    timeTbd: "Tijd volgt",
    matchCenter: "VOETIQ MATCH CENTER",
  },
  en: {
    matches: "Matches",
    subtitle: "Predict the scores and earn points.",
    competition: "Competition",
    filled: "Completed",
    loading: "Loading matches...",
    noUpcoming: "No upcoming matches",
    noUpcomingDescription:
      "There are currently no upcoming matches available for this competition.",
    previous: "Previous",
    matchday: "Matchday",
    next: "Next",
    predicted: "Predicted",
    predictionClosed: "Prediction closed",
    saving: "Saving...",
    changePrediction: "Change prediction",
    savePrediction: "Save prediction",
    matchesLoadFailed: "The matches could not be loaded.",
    completeScore: "Enter a complete score first.",
    validScore: "Enter a valid score from 0 to 20.",
    loginRequired: "You must be logged in to save a prediction.",
    predictionSaveFailed: "Your prediction could not be saved.",
    predictionSaved: "Your prediction has been saved.",
    predictionSaveError: "Something went wrong while saving your prediction.",
    premiumRequired: "You need VoetIQ Premium to predict Champions League matches.",
    unlockPremium: "Unlock with VoetIQ Premium",
    premiumOnly: "Premium only",
    premiumGateTitle: "Champions League is part of VoetIQ Premium",
    premiumGateDescription: "Go Premium to view and predict Champions League matches.",
    back: "Back",
    timeTbd: "Time TBA",
    matchCenter: "VOETIQ MATCH CENTER",
  },
  de: {
    matches: "Spiele",
    subtitle: "Tippe die Ergebnisse und sammle Punkte.",
    competition: "Wettbewerb",
    filled: "Ausgefüllt",
    loading: "Spiele werden geladen...",
    noUpcoming: "Keine kommenden Spiele",
    noUpcomingDescription:
      "Für diesen Wettbewerb sind derzeit keine kommenden Spiele verfügbar.",
    previous: "Zurück",
    matchday: "Spieltag",
    next: "Weiter",
    predicted: "Getippt",
    predictionClosed: "Tippabgabe geschlossen",
    saving: "Speichern...",
    changePrediction: "Tipp ändern",
    savePrediction: "Tipp speichern",
    matchesLoadFailed: "Die Spiele konnten nicht geladen werden.",
    completeScore: "Gib zuerst ein vollständiges Ergebnis ein.",
    validScore: "Gib ein gültiges Ergebnis von 0 bis 20 ein.",
    loginRequired: "Du musst angemeldet sein, um einen Tipp zu speichern.",
    predictionSaveFailed: "Dein Tipp konnte nicht gespeichert werden.",
    predictionSaved: "Dein Tipp wurde gespeichert.",
    predictionSaveError: "Beim Speichern deines Tipps ist etwas schiefgelaufen.",
    premiumRequired: "Für Champions-League-Tipps benötigst du VoetIQ Premium.",
    unlockPremium: "Mit VoetIQ Premium freischalten",
    premiumOnly: "Nur mit Premium",
    premiumGateTitle: "Die Champions League ist Teil von VoetIQ Premium",
    premiumGateDescription: "Hol dir Premium, um Champions-League-Spiele zu sehen und zu tippen.",
    back: "Zurück",
    timeTbd: "Uhrzeit folgt",
    matchCenter: "VOETIQ MATCH CENTER",
  },
  es: {
    matches: "Partidos",
    subtitle: "Pronostica los resultados y gana puntos.",
    competition: "Competición",
    filled: "Completados",
    loading: "Cargando partidos...",
    noUpcoming: "No hay próximos partidos",
    noUpcomingDescription:
      "Actualmente no hay próximos partidos disponibles para esta competición.",
    previous: "Anterior",
    matchday: "Jornada",
    next: "Siguiente",
    predicted: "Pronosticado",
    predictionClosed: "Pronóstico cerrado",
    saving: "Guardando...",
    changePrediction: "Cambiar pronóstico",
    savePrediction: "Guardar pronóstico",
    matchesLoadFailed: "No se han podido cargar los partidos.",
    completeScore: "Introduce primero un resultado completo.",
    validScore: "Introduce un resultado válido entre 0 y 20.",
    loginRequired: "Debes iniciar sesión para guardar un pronóstico.",
    predictionSaveFailed: "No se ha podido guardar tu pronóstico.",
    predictionSaved: "Tu pronóstico se ha guardado.",
    predictionSaveError: "Se ha producido un error al guardar tu pronóstico.",
    premiumRequired: "Necesitas VoetIQ Premium para pronosticar la Champions League.",
    unlockPremium: "Desbloquear con VoetIQ Premium",
    premiumOnly: "Solo con Premium",
    premiumGateTitle: "La Champions League forma parte de VoetIQ Premium",
    premiumGateDescription: "Hazte Premium para ver y pronosticar los partidos de la Champions League.",
    back: "Volver",
    timeTbd: "Hora por confirmar",
    matchCenter: "CENTRO DE PARTIDOS VOETIQ",
  },
  fr: {
    matches: "Matchs",
    subtitle: "Pronostiquez les scores et gagnez des points.",
    competition: "Compétition",
    filled: "Complétés",
    loading: "Chargement des matchs...",
    noUpcoming: "Aucun match à venir",
    noUpcomingDescription:
      "Aucun match à venir n’est actuellement disponible pour cette compétition.",
    previous: "Précédent",
    matchday: "Journée",
    next: "Suivant",
    predicted: "Pronostiqué",
    predictionClosed: "Pronostic fermé",
    saving: "Enregistrement...",
    changePrediction: "Modifier le pronostic",
    savePrediction: "Enregistrer le pronostic",
    matchesLoadFailed: "Les matchs n’ont pas pu être chargés.",
    completeScore: "Saisissez d’abord un score complet.",
    validScore: "Saisissez un score valide compris entre 0 et 20.",
    loginRequired:
      "Vous devez être connecté pour enregistrer un pronostic.",
    predictionSaveFailed: "Votre pronostic n’a pas pu être enregistré.",
    predictionSaved: "Votre pronostic a été enregistré.",
    predictionSaveError:
      "Une erreur s’est produite lors de l’enregistrement de votre pronostic.",
    premiumRequired: "VoetIQ Premium est nécessaire pour pronostiquer la Champions League.",
    unlockPremium: "Débloquer avec VoetIQ Premium",
    premiumOnly: "Premium uniquement",
    premiumGateTitle: "La Ligue des champions fait partie de VoetIQ Premium",
    premiumGateDescription: "Passez à Premium pour voir et pronostiquer les matchs de Ligue des champions.",
    back: "Retour",
    timeTbd: "Horaire à confirmer",
    matchCenter: "CENTRE DES MATCHS VOETIQ",
  },
  it: {
    matches: "Partite",
    subtitle: "Pronostica i risultati e guadagna punti.",
    competition: "Competizione",
    filled: "Completati",
    loading: "Caricamento delle partite...",
    noUpcoming: "Nessuna partita in programma",
    noUpcomingDescription:
      "Al momento non ci sono prossime partite disponibili per questa competizione.",
    previous: "Precedente",
    matchday: "Giornata",
    next: "Successiva",
    predicted: "Pronosticato",
    predictionClosed: "Pronostico chiuso",
    saving: "Salvataggio...",
    changePrediction: "Modifica pronostico",
    savePrediction: "Salva pronostico",
    matchesLoadFailed: "Non è stato possibile caricare le partite.",
    completeScore: "Inserisci prima un risultato completo.",
    validScore: "Inserisci un risultato valido da 0 a 20.",
    loginRequired: "Devi accedere per salvare un pronostico.",
    predictionSaveFailed: "Non è stato possibile salvare il tuo pronostico.",
    predictionSaved: "Il tuo pronostico è stato salvato.",
    predictionSaveError:
      "Si è verificato un errore durante il salvataggio del pronostico.",
    premiumRequired: "Serve VoetIQ Premium per pronosticare la Champions League.",
    unlockPremium: "Sblocca con VoetIQ Premium",
    premiumOnly: "Solo Premium",
    premiumGateTitle: "La Champions League fa parte di VoetIQ Premium",
    premiumGateDescription: "Passa a Premium per vedere e pronosticare le partite di Champions League.",
    back: "Indietro",
    timeTbd: "Orario da definire",
    matchCenter: "CENTRO PARTITE VOETIQ",
  },
  pt: {
    matches: "Jogos",
    subtitle: "Prevê os resultados e ganha pontos.",
    competition: "Competição",
    filled: "Preenchidos",
    loading: "A carregar jogos...",
    noUpcoming: "Sem próximos jogos",
    noUpcomingDescription:
      "De momento, não existem próximos jogos disponíveis para esta competição.",
    previous: "Anterior",
    matchday: "Jornada",
    next: "Seguinte",
    predicted: "Previsto",
    predictionClosed: "Previsão encerrada",
    saving: "A guardar...",
    changePrediction: "Alterar previsão",
    savePrediction: "Guardar previsão",
    matchesLoadFailed: "Não foi possível carregar os jogos.",
    completeScore: "Introduz primeiro um resultado completo.",
    validScore: "Introduz um resultado válido entre 0 e 20.",
    loginRequired: "Tens de iniciar sessão para guardar uma previsão.",
    predictionSaveFailed: "Não foi possível guardar a tua previsão.",
    predictionSaved: "A tua previsão foi guardada.",
    predictionSaveError: "Ocorreu um erro ao guardar a tua previsão.",
    premiumRequired: "Precisas do VoetIQ Premium para prever jogos da Champions League.",
    unlockPremium: "Desbloquear com VoetIQ Premium",
    premiumOnly: "Apenas Premium",
    premiumGateTitle: "A Champions League faz parte do VoetIQ Premium",
    premiumGateDescription: "Adere ao Premium para veres e preveres os jogos da Champions League.",
    back: "Voltar",
    timeTbd: "Hora a confirmar",
    matchCenter: "CENTRO DE JOGOS VOETIQ",
  },
};

function isLanguageCode(value: string): value is LanguageCode {
  return ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value);
}


function translateServerMessage(
  message: unknown,
  language: LanguageCode
): string {
  if (typeof message !== "string" || message.trim() === "") {
    return "";
  }

  const knownMessages: Record<string, TranslationKey> = {
    "Je voorspelling is opgeslagen.": "predictionSaved",
    "Je voorspelling kon niet worden opgeslagen.": "predictionSaveFailed",
    "Je moet ingelogd zijn om een voorspelling op te slaan.": "loginRequired",
    "Vul eerst een volledige uitslag in.": "completeScore",
    "Vul een geldige uitslag in van 0 t/m 20.": "validScore",
  };

  const key = knownMessages[message];

  return key ? translations[language][key] : message;
}

const competitions: Competition[] = [
  { code: "PL", name: "Premier League", flag: "🏴" },
  { code: "DED", name: "Eredivisie", flag: "🇳🇱" },
  { code: "PD", name: "La Liga", flag: "🇪🇸" },
  { code: "BL1", name: "Bundesliga", flag: "🇩🇪" },
  { code: "SA", name: "Serie A", flag: "🇮🇹" },
  { code: "FL1", name: "Ligue 1", flag: "🇫🇷" },
  { code: "PPL", name: "Primeira Liga", flag: "🇵🇹" },
  { code: "EL", name: "Europa League", flag: "🟠" },
  { code: "ECL", name: "Conference League", flag: "🟢" },
  { code: "CL", name: "Champions League", flag: "🏆" },
  { code: "KNVB", name: "KNVB Beker Special", flag: "✨" },
];

const competitionThemes: Record<
  string,
  {
    hero: string;
    card: string;
    accent: string;
    glow: string;
    page: string;
    surface: string;
    surfaceSoft: string;
    border: string;
  }
> = {
  DED: {
    hero: "radial-gradient(circle at 82% 18%, rgba(38,103,255,0.55) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(0,181,255,0.24) 0%, transparent 28%), linear-gradient(135deg, #03132f 0%, #082d73 55%, #0757c9 100%)",
    card: "linear-gradient(135deg, #071d45 0%, #0a4ba8 100%)",
    accent: "#8ac5ff",
    glow: "rgba(31,112,255,0.30)",
    page: "#030b18",
    surface: "#07172b",
    surfaceSoft: "#0a2039",
    border: "rgba(138,197,255,0.16)",
  },
  PL: {
    hero: "radial-gradient(circle at 82% 18%, rgba(216,0,255,0.35) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(0,255,209,0.18) 0%, transparent 28%), linear-gradient(135deg, #170020 0%, #37003c 55%, #5b075f 100%)",
    card: "linear-gradient(135deg, #24002b 0%, #52005c 100%)",
    accent: "#ef8cff",
    glow: "rgba(181,36,202,0.28)",
    page: "#0d0612",
    surface: "#1b0b22",
    surfaceSoft: "#25102e",
    border: "rgba(239,140,255,0.15)",
  },
  PD: {
    hero: "radial-gradient(circle at 82% 20%, rgba(255,126,38,0.42) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(255,43,43,0.22) 0%, transparent 28%), linear-gradient(135deg, #1b0808 0%, #641616 55%, #a52b12 100%)",
    card: "linear-gradient(135deg, #3b0c0c 0%, #9a2915 100%)",
    accent: "#ffad78",
    glow: "rgba(231,76,35,0.27)",
    page: "#130707",
    surface: "#251010",
    surfaceSoft: "#321414",
    border: "rgba(255,173,120,0.15)",
  },
  BL1: {
    hero: "radial-gradient(circle at 80% 20%, rgba(255,70,70,0.42) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(255,255,255,0.09) 0%, transparent 28%), linear-gradient(135deg, #190404 0%, #650909 55%, #a20e0e 100%)",
    card: "linear-gradient(135deg, #3d0606 0%, #9e1010 100%)",
    accent: "#ff8b8b",
    glow: "rgba(220,25,25,0.27)",
    page: "#120505",
    surface: "#260909",
    surfaceSoft: "#330d0d",
    border: "rgba(255,139,139,0.15)",
  },
  SA: {
    hero: "radial-gradient(circle at 80% 20%, rgba(36,131,255,0.45) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(72,205,255,0.18) 0%, transparent 28%), linear-gradient(135deg, #041326 0%, #073c78 55%, #0967b5 100%)",
    card: "linear-gradient(135deg, #062a55 0%, #0874bd 100%)",
    accent: "#8bd1ff",
    glow: "rgba(28,126,219,0.27)",
    page: "#04101b",
    surface: "#071d31",
    surfaceSoft: "#092843",
    border: "rgba(139,209,255,0.15)",
  },
  FL1: {
    hero: "radial-gradient(circle at 82% 18%, rgba(216,255,0,0.22) 0%, transparent 30%), radial-gradient(circle at 15% 80%, rgba(39,82,255,0.22) 0%, transparent 28%), linear-gradient(135deg, #071124 0%, #101f4b 55%, #19327b 100%)",
    card: "linear-gradient(135deg, #0c1837 0%, #1c3474 100%)",
    accent: "#d8ff49",
    glow: "rgba(97,119,255,0.24)",
    page: "#050a16",
    surface: "#0a1328",
    surfaceSoft: "#101d3b",
    border: "rgba(216,255,73,0.13)",
  },
  PPL: {
    hero: "radial-gradient(circle at 82% 20%, rgba(225,32,50,0.34) 0%, transparent 31%), radial-gradient(circle at 15% 80%, rgba(31,190,102,0.25) 0%, transparent 28%), linear-gradient(135deg, #061a11 0%, #0a5130 55%, #12693f 100%)",
    card: "linear-gradient(135deg, #082f1d 0%, #12653d 100%)",
    accent: "#76ecad",
    glow: "rgba(26,166,91,0.25)",
    page: "#04110b",
    surface: "#082218",
    surfaceSoft: "#0b3020",
    border: "rgba(118,236,173,0.14)",
  },
  EL: {
    hero: "radial-gradient(circle at 82% 18%, rgba(255,117,24,0.42) 0%, transparent 32%), radial-gradient(circle at 18% 80%, rgba(255,181,71,0.20) 0%, transparent 30%), linear-gradient(135deg, #160904 0%, #5a2108 55%, #a8490c 100%)",
    card: "linear-gradient(135deg, #341207 0%, #9a400b 100%)",
    accent: "#ffad63",
    glow: "rgba(235,105,20,0.27)",
    page: "#100703",
    surface: "#241008",
    surfaceSoft: "#32160a",
    border: "rgba(255,173,99,0.15)",
  },
  ECL: {
    hero: "radial-gradient(circle at 82% 18%, rgba(55,215,112,0.38) 0%, transparent 32%), radial-gradient(circle at 18% 80%, rgba(123,255,167,0.16) 0%, transparent 30%), linear-gradient(135deg, #031008 0%, #0a4827 55%, #11713b 100%)",
    card: "linear-gradient(135deg, #062a17 0%, #0e6937 100%)",
    accent: "#7cf0a9",
    glow: "rgba(32,180,91,0.25)",
    page: "#030d07",
    surface: "#071d11",
    surfaceSoft: "#0a2a18",
    border: "rgba(124,240,169,0.14)",
  },
  CL: {
    hero: "radial-gradient(circle at 82% 18%, rgba(93,110,255,0.42) 0%, transparent 32%), radial-gradient(circle at 18% 80%, rgba(42,58,180,0.30) 0%, transparent 30%), linear-gradient(135deg, #030514 0%, #0b1240 55%, #171e68 100%)",
    card: "linear-gradient(135deg, #070b2b 0%, #192365 100%)",
    accent: "#aeb7ff",
    glow: "rgba(76,91,220,0.28)",
    page: "#03040d",
    surface: "#080b1d",
    surfaceSoft: "#0d1230",
    border: "rgba(174,183,255,0.14)",
  },
  KNVB: {
    hero: "radial-gradient(circle at 82% 18%, rgba(255,190,46,0.42) 0%, transparent 32%), radial-gradient(circle at 15% 80%, rgba(255,111,0,0.22) 0%, transparent 28%), linear-gradient(135deg, #1b0d02 0%, #6b3105 55%, #a85208 100%)",
    card: "linear-gradient(135deg, #3a1903 0%, #9a4808 100%)",
    accent: "#ffd36b",
    glow: "rgba(255,145,24,0.28)",
    page: "#120902",
    surface: "#241207",
    surfaceSoft: "#321a0a",
    border: "rgba(255,211,107,0.17)",
  },
};


const ECL_KICKOFFS_2026_10_15_UTC: Record<string, string> = {
  "Lugano|Red Star Belgrade": "2026-10-15T16:45:00Z",
  "Hajduk Split|Ajax": "2026-10-15T16:45:00Z",
  "Gent|AGF": "2026-10-15T16:45:00Z",
  "Egnatia|Midtjylland": "2026-10-15T16:45:00Z",
  "KuPS|Trabzonspor": "2026-10-15T16:45:00Z",
  "Mjällby AIF|Inter Club d'Escaldes": "2026-10-15T16:45:00Z",
  "Panathinaikos|Borac Banja Luka": "2026-10-15T16:45:00Z",
  "CSKA Sofia|Monaco": "2026-10-15T16:45:00Z",
  "Riga|Kairat": "2026-10-15T16:45:00Z",
  "Universitatea Craiova|Getafe": "2026-10-15T16:45:00Z",
  "Atalanta|Pafos": "2026-10-15T19:00:00Z",
  "Brighton & Hove Albion|Kauno Žalgiris": "2026-10-15T19:00:00Z",
  "Copenhagen|Braga": "2026-10-15T19:00:00Z",
  "Twente|Thun": "2026-10-15T19:00:00Z",
  "Heart of Midlothian|Nordsjælland": "2026-10-15T19:00:00Z",
  "Sint-Truiden|Iberia 1999": "2026-10-15T19:00:00Z",
  "SC Freiburg|Jablonec": "2026-10-15T19:00:00Z",
  "Brann|Lincoln Red Imps": "2026-10-15T19:00:00Z",
};

function getEffectiveMatchDate(match: Match, competitionCode: string): Date {
  if (competitionCode === "ECL") {
    const kickoffKey = `${match.homeTeam.name}|${match.awayTeam.name}`;
    const scheduledKickoff = ECL_KICKOFFS_2026_10_15_UTC[kickoffKey];

    if (scheduledKickoff) {
      return new Date(scheduledKickoff);
    }
  }

  return new Date(match.utcDate);
}

function getUserTimezone(): string {
  if (typeof Intl !== "undefined") {
    const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    if (browserTimezone) {
      return browserTimezone;
    }
  }

  return "Europe/Amsterdam";
}

export default function Wedstrijden() {
  const router = useRouter();

  const [selectedCompetition, setSelectedCompetition] =
    useState("DED");
  const [competitionUrlReady, setCompetitionUrlReady] =
    useState(false);

  const [matches, setMatches] = useState<Match[]>([]);

  const [predictions, setPredictions] = useState<
    Record<number, Prediction>
  >({});

  const [savedMatchIds, setSavedMatchIds] = useState<
    Set<number>
  >(new Set());

  const [savingMatchId, setSavingMatchId] = useState<
    number | null
  >(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [isPremium, setIsPremium] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);
  const [timezone, setTimezone] = useState("Europe/Amsterdam");
  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [standingsLoading, setStandingsLoading] = useState(false);
  const [standingsError, setStandingsError] = useState("");

  const [selectedMatchday, setSelectedMatchday] =
    useState<number | null>(null);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("voetiq-language");
    const initialLanguage: LanguageCode =
      savedLanguage && isLanguageCode(savedLanguage) ? savedLanguage : "nl";

    setLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;

    const fallbackTimezone = getUserTimezone();
    setTimezone(fallbackTimezone);

    async function loadRegisteredTimezone() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const registeredTimezone = user?.user_metadata?.timezone;

        if (
          typeof registeredTimezone === "string" &&
          registeredTimezone.trim() !== ""
        ) {
          setTimezone(registeredTimezone);
        }
      } catch (error) {
        console.error("Kon geregistreerde tijdzone niet laden:", error);
      }
    }

    loadRegisteredTimezone();

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const nextLanguage = customEvent.detail?.language;

      if (nextLanguage && isLanguageCode(nextLanguage)) {
        setLanguage(nextLanguage);
        document.documentElement.lang = nextLanguage;
      }
    }

    window.addEventListener("voetiq-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener("voetiq-language-change", handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    async function loadPremiumStatus() {
      try {
        setPremiumLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsPremium(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("is_premium, premium_expires_at")
          .eq("id", user.id)
          .maybeSingle();

        if (error || !data) {
          console.error("Kon Premium-status niet laden:", error);
          setIsPremium(false);
          return;
        }

        const premiumNotExpired =
          !data.premium_expires_at ||
          new Date(data.premium_expires_at).getTime() > Date.now();

        setIsPremium(data.is_premium === true && premiumNotExpired);
      } finally {
        setPremiumLoading(false);
      }
    }

    loadPremiumStatus();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const competitionFromUrl =
      params.get("competition")?.toUpperCase() || "DED";

    const isValidCompetition = competitions.some(
      (competition) => competition.code === competitionFromUrl
    );

    setSelectedCompetition(
      isValidCompetition ? competitionFromUrl : "DED"
    );
    setCompetitionUrlReady(true);
  }, []);

  useEffect(() => {
    if (!competitionUrlReady) {
      return;
    }

    loadCompetition(selectedCompetition);
  }, [selectedCompetition, competitionUrlReady]);

  useEffect(() => {
    if (!competitionUrlReady) {
      return;
    }

    const supportsStandings = ["PL", "DED", "PD", "BL1", "SA", "FL1", "PPL"].includes(
      selectedCompetition
    );

    if (!supportsStandings) {
      setStandings([]);
      setStandingsError("");
      setStandingsLoading(false);
      return;
    }

    let cancelled = false;

    async function loadStandings() {
      setStandingsLoading(true);
      setStandingsError("");
      setStandings([]);

      try {
        const response = await fetch(
          `/api/standings?competition=${selectedCompetition}`,
          { cache: "no-store" }
        );

        const data: StandingsResponse = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Kon stand niet ophalen");
        }

        if (!cancelled) {
          setStandings(Array.isArray(data.table) ? data.table : []);
        }
      } catch (error) {
        console.error("Kon competitiestand niet laden:", error);

        if (!cancelled) {
          setStandingsError("De actuele stand kon niet worden opgehaald.");
        }
      } finally {
        if (!cancelled) {
          setStandingsLoading(false);
        }
      }
    }

    loadStandings();

    return () => {
      cancelled = true;
    };
  }, [selectedCompetition, competitionUrlReady]);

  async function loadCompetition(
    competitionCode: string
  ) {
    setLoading(true);
    setMessage("");
    setMatches([]);
    setPredictions({});
    setSavedMatchIds(new Set());
    setSelectedMatchday(null);

    try {
      const response = await fetch(
        `/api/matches?competition=${competitionCode}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Kon wedstrijden niet ophalen"
        );
      }

      const data = await response.json();

      const upcomingMatches: Match[] = (
        data.matches || []
      )
        .filter(
          (match: Match) =>
            match.status === "SCHEDULED" ||
            match.status === "TIMED"
        )
        .sort(
          (a: Match, b: Match) =>
            new Date(a.utcDate).getTime() -
            new Date(b.utcDate).getTime()
        );

      setMatches(upcomingMatches);

      const matchdays = upcomingMatches
        .map((match: Match) => match.matchday)
        .filter(
          (
            matchday: number | undefined
          ): matchday is number =>
            typeof matchday === "number"
        );

      if (matchdays.length > 0) {
        setSelectedMatchday(
          Math.min(...matchdays)
        );
      }

      await loadSavedPredictions(
        upcomingMatches
      );
    } catch (error) {
      console.error(error);

      setMessage(
        t("matchesLoadFailed")
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadSavedPredictions(
    upcomingMatches: Match[]
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || upcomingMatches.length === 0) {
      return;
    }

    const matchIds = upcomingMatches.map(
      (match) => match.id
    );

    const { data, error } = await supabase
      .from("predictions")
      .select(
        "match_id, home_score, away_score"
      )
      .eq("user_id", user.id)
      .in("match_id", matchIds);

    if (error) {
      console.error(
        "Kon opgeslagen voorspellingen niet laden:",
        error
      );
      return;
    }

    const predictionMap: Record<
      number,
      Prediction
    > = {};

    const storedIds = new Set<number>();

    ((data || []) as StoredPrediction[]).forEach(
      (prediction) => {
        predictionMap[prediction.match_id] = {
          home: String(
            prediction.home_score
          ),
          away: String(
            prediction.away_score
          ),
        };

        storedIds.add(
          prediction.match_id
        );
      }
    );

    setPredictions(predictionMap);
    setSavedMatchIds(storedIds);
  }

  const availableMatchdays = useMemo(() => {
    return Array.from(
      new Set(
        matches
          .map(
            (match: Match) =>
              match.matchday
          )
          .filter(
            (
              matchday:
                | number
                | undefined
            ): matchday is number =>
              typeof matchday ===
              "number"
          )
      )
    ).sort((a, b) => a - b);
  }, [matches]);

  const currentMatchdayIndex =
    selectedMatchday !== null
      ? availableMatchdays.indexOf(
          selectedMatchday
        )
      : -1;

  const currentMatches = matches.filter(
    (match) =>
      match.matchday === selectedMatchday
  );

  const selectedCompetitionData =
    competitions.find(
      (competition) =>
        competition.code ===
        selectedCompetition
    ) || competitions[1];

  const activeTheme =
    competitionThemes[selectedCompetition] ||
    competitionThemes.DED;

  const savedPredictionsThisRound =
    currentMatches.filter((match) =>
      savedMatchIds.has(match.id)
    ).length;

  function changeCompetition(
    code: string
  ) {
    setSelectedCompetition(code);

    const url = new URL(
      window.location.href
    );

    url.searchParams.set(
      "competition",
      code
    );

    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}`
    );
  }

  function updatePrediction(
    matchId: number,
    type: "home" | "away",
    value: string
  ) {
    setPredictions((current) => ({
      ...current,
      [matchId]: {
        home:
          current[matchId]?.home || "",
        away:
          current[matchId]?.away || "",
        [type]: value,
      },
    }));
  }

  async function savePrediction(
    match: Match
  ) {
    if (savingMatchId !== null) {
      return;
    }

    if (selectedCompetition === "CL" && !isPremium) {
      setMessage(t("premiumRequired"));
      return;
    }

    const prediction =
      predictions[match.id];

    if (
      !prediction ||
      prediction.home === "" ||
      prediction.away === ""
    ) {
      setMessage(
        t("completeScore")
      );
      return;
    }

    const home = Number(
      prediction.home
    );

    const away = Number(
      prediction.away
    );

    if (
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0 ||
      home > 20 ||
      away > 20
    ) {
      setMessage(
        t("validScore")
      );
      return;
    }

    const {
      data: { session },
    } =
      await supabase.auth.getSession();

    if (!session) {
      setMessage(
        t("loginRequired")
      );
      return;
    }

    setSavingMatchId(match.id);
    setMessage("");

    try {
      const response = await fetch(
        "/api/predictions",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            accessToken:
              session.access_token,
            matchId: match.id,
            competition:
              selectedCompetition,
            homeScore: home,
            awayScore: away,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        setMessage(
          translateServerMessage(result.error, language) ||
            t("predictionSaveFailed")
        );
        return;
      }

      setSavedMatchIds(
        (current) => {
          const next =
            new Set(current);

          next.add(match.id);

          return next;
        }
      );

      setMessage(
        translateServerMessage(result.message, language) ||
          t("predictionSaved")
      );
    } catch (error) {
      console.error(error);

      setMessage(
        t("predictionSaveError")
      );
    } finally {
      setSavingMatchId(null);
    }
  }

  function changeMatchday(
    direction: "previous" | "next"
  ) {
    if (
      currentMatchdayIndex === -1
    ) {
      return;
    }

    const newIndex =
      direction === "previous"
        ? currentMatchdayIndex - 1
        : currentMatchdayIndex + 1;

    if (
      newIndex >= 0 &&
      newIndex <
        availableMatchdays.length
    ) {
      setSelectedMatchday(
        availableMatchdays[newIndex]
      );

      setMessage("");
    }
  }

  const t = (key: TranslationKey) =>
    translations[language][key] || translations.nl[key];

  const locale = localeByLanguage[language];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: activeTheme.page,
        color: "white",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          background: activeTheme.hero,
          position: "relative",
          overflow: "hidden",
          boxShadow: `inset 0 -50px 80px ${activeTheme.glow}`,
          color: "white",
          padding:
            "38px 20px 36px",
        }}
      >
        <div
          style={{
            maxWidth: "1180px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "13px",
              padding: "8px 12px",
              borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.10)",
              color: "white",
              fontSize: "13px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            ← {t("back")}
          </button>

          <br />

          <div
            style={{
              display:
                "inline-flex",
              alignItems: "center",
              gap: "7px",
              padding: "7px 12px",
              borderRadius:
                "999px",
              background:
                "rgba(255,255,255,0.10)",
              border:
                "1px solid rgba(255,255,255,0.18)",
              color: activeTheme.accent,
              fontSize: "11px",
              fontWeight: 900,
              letterSpacing:
                "0.4px",
              marginBottom:
                "15px",
            }}
          >
            ⚽ {t("matchCenter")}
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: 900,
              letterSpacing:
                "-1.5px",
            }}
          >
            {t("matches")}
          </h1>

          <p
            style={{
              margin:
                "10px 0 0",
              color: "rgba(255,255,255,0.72)",
              fontSize: "15px",
            }}
          >
            {t("subtitle")}
          </p>
        </div>
      </section>

      <style jsx global>{`
        .voetiq-competition-scroll { scrollbar-width: thin; scrollbar-color: ${activeTheme.accent} ${activeTheme.surface}; }
        .voetiq-competition-scroll::-webkit-scrollbar { height: 7px; }
        .voetiq-competition-scroll::-webkit-scrollbar-track { background: ${activeTheme.surface}; border-radius: 999px; }
        .voetiq-competition-scroll::-webkit-scrollbar-thumb { background: ${activeTheme.accent}; border-radius: 999px; }
        @media (max-width: 760px) {
          .voetiq-competition-scroll { scrollbar-width: none; }
          .voetiq-competition-scroll::-webkit-scrollbar { display: none; }
        }
        .voetiq-standings-scroll { overflow-x: auto; }
        .voetiq-standings-table { width: 100%; min-width: 720px; border-collapse: collapse; }
        .voetiq-standings-table th {
          padding: 11px 10px;
          color: rgba(255,255,255,0.46);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .voetiq-standings-table th:nth-child(2) { text-align: left; }
        .voetiq-standings-table td {
          padding: 12px 10px;
          color: rgba(255,255,255,0.72);
          font-size: 12px;
          font-weight: 700;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.055);
        }
        .voetiq-standings-table tbody tr:last-child td { border-bottom: 0; }
        .voetiq-standings-team {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: left !important;
          white-space: nowrap;
        }
        .voetiq-standings-team img {
          width: 25px;
          height: 25px;
          object-fit: contain;
          flex: 0 0 auto;
        }
        @media (max-width: 760px) {
          .voetiq-standings-scroll { scrollbar-width: thin; }
        }
      `}</style>

      <section
        style={{
          maxWidth: "1180px",
          margin: "0 auto",
          padding:
            "24px 20px 70px",
        }}
      >
        <div
          className="voetiq-competition-scroll"
          style={{
            background: activeTheme.surface,
            border: `1px solid ${activeTheme.border}`,
            borderRadius: "16px",
            padding: "10px",
            boxShadow:
              `0 8px 28px ${activeTheme.glow}`,
            overflowX: "auto",
            marginBottom:
              "18px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              minWidth: "max-content",
            }}
          >
            {[
              competitions.filter((competition) =>
                ["PL", "DED", "PD", "BL1", "SA", "FL1", "PPL"].includes(
                  competition.code
                )
              ),
              competitions.filter((competition) =>
                ["EL", "ECL", "CL", "KNVB"].includes(competition.code)
              ),
            ].map((competitionRow, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  display: "flex",
                  gap: "6px",
                  minWidth: "max-content",
                }}
              >
                {competitionRow.map((competition) => {
                  const active =
                    selectedCompetition === competition.code;

                  return (
                    <button
                      key={competition.code}
                      onClick={() => changeCompetition(competition.code)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px",
                        padding: "10px 13px",
                        borderRadius: "10px",
                        border: active
                          ? `1px solid ${activeTheme.border}`
                          : "1px solid transparent",
                        background: active
                          ? activeTheme.surfaceSoft
                          : "transparent",
                        color: active
                          ? activeTheme.accent
                          : "rgba(255,255,255,0.68)",
                        fontSize: "13px",
                        fontWeight: active ? 800 : 600,
                        cursor: "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span>{competition.flag}</span>
                      {competition.name}
                      {competition.code === "CL" &&
                        !premiumLoading &&
                        !isPremium && (
                          <span
                            style={{
                              fontSize: "11px",
                              opacity: 0.9,
                            }}
                          >
                            🔒
                          </span>
                        )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            background: activeTheme.card,
            borderRadius: "18px",
            padding:
              "22px 24px",
            color: "white",
            marginBottom: "16px",
            boxShadow:
              `0 12px 34px ${activeTheme.glow}`,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "13px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius:
                  "13px",
                background:
                  "rgba(255,255,255,0.08)",
                display: "flex",
                alignItems:
                  "center",
                justifyContent:
                  "center",
                fontSize: "25px",
              }}
            >
              {
                selectedCompetitionData.flag
              }
            </div>

            <div>
              <div
                style={{
                  color:
                    activeTheme.accent,
                  fontSize:
                    "10px",
                  fontWeight: 900,
                  textTransform:
                    "uppercase",
                  letterSpacing:
                    "0.9px",
                }}
              >
                {t("competition")}
              </div>

              <h2
                style={{
                  margin:
                    "3px 0 0",
                  fontSize:
                    "25px",
                }}
              >
                {
                  selectedCompetitionData.name
                }
                {selectedCompetition === "CL" && !premiumLoading && !isPremium && (
                  <span style={{ marginLeft: "10px", fontSize: "12px", color: activeTheme.accent }}>
                    🔒 {t("premiumOnly")}
                  </span>
                )}
              </h2>
            </div>
          </div>

          {!loading &&
            !(selectedCompetition === "CL" && !premiumLoading && !isPremium) &&
            currentMatches.length >
              0 && (
              <div
                style={{
                  background:
                    "rgba(255,255,255,0.08)",
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  borderRadius:
                    "12px",
                  padding:
                    "10px 15px",
                  textAlign:
                    "center",
                }}
              >
                <div
                  style={{
                    color:
                      "#70f0aa",
                    fontSize:
                      "10px",
                    fontWeight:
                      900,
                    textTransform:
                      "uppercase",
                  }}
                >
                  {t("filled")}
                </div>

                <div
                  style={{
                    marginTop:
                      "3px",
                    fontSize:
                      "17px",
                    fontWeight:
                      900,
                  }}
                >
                  {
                    savedPredictionsThisRound
                  }{" "}
                  /{" "}
                  {
                    currentMatches.length
                  }
                </div>
              </div>
            )}
        </div>

        {selectedCompetition === "CL" && !premiumLoading && !isPremium && (
          <div
            style={{
              background: activeTheme.surface,
              border: `1px solid ${activeTheme.border}`,
              borderRadius: "18px",
              padding: "58px 28px",
              textAlign: "center",
              boxShadow: `0 10px 32px ${activeTheme.glow}`,
            }}
          >
            <div
              style={{
                width: "76px",
                height: "76px",
                margin: "0 auto 20px",
                borderRadius: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: activeTheme.surfaceSoft,
                border: `1px solid ${activeTheme.border}`,
                fontSize: "36px",
              }}
            >
              🔒
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "25px",
                fontWeight: 900,
                color: "white",
              }}
            >
              {t("premiumGateTitle")}
            </h3>

            <p
              style={{
                maxWidth: "560px",
                margin: "12px auto 0",
                color: "rgba(255,255,255,0.62)",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              {t("premiumGateDescription")}
            </p>

            <button
              type="button"
              onClick={() => router.push("/premium")}
              style={{
                marginTop: "24px",
                padding: "13px 20px",
                border: "none",
                borderRadius: "11px",
                background: activeTheme.accent,
                color: "#080b1d",
                fontSize: "14px",
                fontWeight: 900,
                cursor: "pointer",
              }}
            >
              👑 {t("unlockPremium")}
            </button>
          </div>
        )}

        {!(selectedCompetition === "CL" && !premiumLoading && !isPremium) && loading && (
          <div style={{...emptyCardStyle, background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, color: "white"}}>
            <div
              style={{
                fontSize: "32px",
                marginBottom:
                  "10px",
              }}
            >
              ⚽
            </div>

            <strong>{t("loading")}</strong>
          </div>
        )}

        {!(selectedCompetition === "CL" && !premiumLoading && !isPremium) &&
          !loading &&
          availableMatchdays.length ===
            0 && (
            <div style={{...emptyCardStyle, background: activeTheme.surface, border: `1px solid ${activeTheme.border}`, color: "white"}}>
              <div
                style={{
                  fontSize: "34px",
                  marginBottom:
                    "10px",
                }}
              >
                📅
              </div>

              <strong
                style={{
                  fontSize:
                    "17px",
                }}
              >
                {t("noUpcoming")}
              </strong>

              <p
                style={{
                  color:
                    "#78827d",
                  margin:
                    "8px 0 0",
                }}
              >
                {t("noUpcomingDescription")}
              </p>
            </div>
          )}

        {!(selectedCompetition === "CL" && !premiumLoading && !isPremium) &&
          !loading &&
          availableMatchdays.length >
            0 && (
            <>
              <div
                style={{
                  background:
                    activeTheme.surface,
                  border: `1px solid ${activeTheme.border}`,
                  borderRadius:
                    "15px",
                  padding: "10px",
                  display: "grid",
                  gridTemplateColumns:
                    "1fr auto 1fr",
                  alignItems:
                    "center",
                  marginBottom:
                    "15px",
                  boxShadow:
                    `0 6px 22px ${activeTheme.glow}`,
                }}
              >
                <div>
                  <button
                    onClick={() =>
                      changeMatchday(
                        "previous"
                      )
                    }
                    disabled={
                      currentMatchdayIndex <=
                      0
                    }
                    style={navigationButtonStyle(
                      currentMatchdayIndex <=
                        0,
                        activeTheme
                    )}
                  >
                    ← {t("previous")}
                  </button>
                </div>

                <div
                  style={{
                    textAlign:
                      "center",
                  }}
                >
                  <div
                    style={{
                      color:
                        "rgba(255,255,255,0.52)",
                      fontSize:
                        "10px",
                      fontWeight:
                        900,
                      textTransform:
                        "uppercase",
                      letterSpacing:
                        "0.6px",
                    }}
                  >
                    {t("matchday")}
                  </div>

                  <strong
                    style={{
                      fontSize:
                        "20px",
                      color: "white",
                    }}
                  >
                    {
                      selectedMatchday
                    }
                  </strong>
                </div>

                <div
                  style={{
                    textAlign:
                      "right",
                  }}
                >
                  <button
                    onClick={() =>
                      changeMatchday(
                        "next"
                      )
                    }
                    disabled={
                      currentMatchdayIndex ===
                      availableMatchdays.length -
                        1
                    }
                    style={navigationButtonStyle(
                      currentMatchdayIndex ===
                        availableMatchdays.length -
                          1,
                          activeTheme
                    )}
                  >
                    {t("next")} →
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "12px",
                }}
              >
                {currentMatches.map(
                  (match) => {
                    const prediction =
                      predictions[
                        match.id
                      ] || {
                        home: "",
                        away: "",
                      };

                    const date = getEffectiveMatchDate(
                      match,
                      selectedCompetition
                    );

                    const isSaved =
                      savedMatchIds.has(
                        match.id
                      );

                    const isSaving =
                      savingMatchId ===
                      match.id;

                    const locked =
                      date.getTime() <=
                      Date.now();

                    const premiumLocked =
                      selectedCompetition === "CL" &&
                      !premiumLoading &&
                      !isPremium;

                    const predictionLocked = locked || premiumLocked;

                    return (
                      <div
                        key={match.id}
                        style={{
                          background:
                            activeTheme.surfaceSoft,
                          borderRadius:
                            "17px",
                          border:
                            isSaved
                              ? `1px solid ${activeTheme.accent}`
                              : `1px solid ${activeTheme.border}`,
                          overflow:
                            "hidden",
                          boxShadow:
                            `0 7px 24px ${activeTheme.glow}`,
                        }}
                      >
                        <div
                          style={{
                            display:
                              "flex",
                            justifyContent:
                              "space-between",
                            alignItems:
                              "center",
                            padding:
                              "11px 18px",
                            background:
                              activeTheme.surface,
                            borderBottom:
                              `1px solid ${activeTheme.border}`,
                            color:
                              "rgba(255,255,255,0.72)",
                            fontSize:
                              "12px",
                            fontWeight:
                              700,
                          }}
                        >
                          <span>
                            {date.toLocaleDateString(
                              locale,
                              {
                                timeZone: timezone,
                                weekday: "short",
                                day: "numeric",
                                month: "short",
                              }
                            )}
                          </span>

                          <div
                            style={{
                              display:
                                "flex",
                              alignItems:
                                "center",
                              gap: "12px",
                            }}
                          >
                            {isSaved && (
                              <span
                                style={{
                                  color:
                                    "#0b8f4d",
                                  fontSize:
                                    "11px",
                                  fontWeight:
                                    900,
                                }}
                              >
                                ✓ {t("predicted")}
                              </span>
                            )}

                            <span>
                              {date.toLocaleTimeString(locale, {
                                timeZone: timezone,
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              })}
                            </span>
                          </div>
                        </div>

                        <div
                          style={{
                            padding:
                              "20px 22px 18px",
                          }}
                        >
                          <div
                            style={{
                              display:
                                "grid",
                              gridTemplateColumns:
                                "minmax(0,1fr) 170px minmax(0,1fr)",
                              alignItems:
                                "center",
                              gap: "18px",
                            }}
                          >
                            <Team
                              name={
                                match
                                  .homeTeam
                                  .name
                              }
                              crest={
                                match
                                  .homeTeam
                                  .crest
                              }
                              side="home"
                              theme={activeTheme}
                            />

                            <div
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  "center",
                                alignItems:
                                  "center",
                                gap: "8px",
                              }}
                            >
                              <input
                                type="number"
                                min="0"
                                max="20"
                                disabled={
                                  predictionLocked
                                }
                                value={
                                  prediction.home
                                }
                                onChange={(
                                  e
                                ) =>
                                  updatePrediction(
                                    match.id,
                                    "home",
                                    e
                                      .target
                                      .value
                                  )
                                }
                                style={{
                                  ...scoreInputStyle,
                                  background: activeTheme.surface,
                                  border: `1px solid ${activeTheme.border}`,
                                  color: "white",
                                  opacity:
                                    predictionLocked
                                      ? 0.6
                                      : 1,
                                }}
                              />

                              <span
                                style={{
                                  fontWeight:
                                    900,
                                  color:
                                    "#9ca7a1",
                                }}
                              >
                                -
                              </span>

                              <input
                                type="number"
                                min="0"
                                max="20"
                                disabled={
                                  predictionLocked
                                }
                                value={
                                  prediction.away
                                }
                                onChange={(
                                  e
                                ) =>
                                  updatePrediction(
                                    match.id,
                                    "away",
                                    e
                                      .target
                                      .value
                                  )
                                }
                                style={{
                                  ...scoreInputStyle,
                                  background: activeTheme.surface,
                                  border: `1px solid ${activeTheme.border}`,
                                  color: "white",
                                  opacity:
                                    predictionLocked
                                      ? 0.6
                                      : 1,
                                }}
                              />
                            </div>

                            <Team
                              name={
                                match
                                  .awayTeam
                                  .name
                              }
                              crest={
                                match
                                  .awayTeam
                                  .crest
                              }
                              side="away"
                              theme={activeTheme}
                            />
                          </div>

                          <button
                            onClick={() =>
                              savePrediction(
                                match
                              )
                            }
                            disabled={
                              isSaving ||
                              predictionLocked
                            }
                            style={{
                              marginTop:
                                "21px",
                              width: "100%",
                              padding:
                                "12px",
                              background:
                                predictionLocked
                                  ? "#aeb8b2"
                                  : isSaved
                                    ? "#075f35"
                                    : "#0b8f4d",
                              color:
                                "white",
                              border:
                                "none",
                              borderRadius:
                                "10px",
                              fontSize:
                                "14px",
                              fontWeight:
                                800,
                              cursor:
                                predictionLocked ||
                                isSaving
                                  ? "default"
                                  : "pointer",
                              opacity:
                                isSaving
                                  ? 0.75
                                  : 1,
                            }}
                          >
                            {premiumLocked
                              ? `🔒 ${t("premiumOnly")}`
                              : locked
                                ? t("predictionClosed")
                                : isSaving
                                  ? t("saving")
                                  : isSaved
                                    ? t("changePrediction")
                                    : t("savePrediction")}
                          </button>

                          {premiumLocked && (
                            <button
                              type="button"
                              onClick={() => router.push("/premium")}
                              style={{
                                marginTop: "10px",
                                width: "100%",
                                padding: "12px",
                                background: activeTheme.accent,
                                color: "#050814",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "14px",
                                fontWeight: 900,
                                cursor: "pointer",
                              }}
                            >
                              👑 {t("unlockPremium")}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </>
          )}

        {message && (
          <div
            style={{
              marginTop: "18px",
              padding:
                "14px 17px",
              background:
                activeTheme.surface,
              border:
                `1px solid ${activeTheme.border}`,
              borderRadius:
                "12px",
              color: activeTheme.accent,
              fontWeight: 700,
              fontSize: "14px",
            }}
          >
            {message}
          </div>
        )}

        <p
          style={{
            marginTop: "28px",
            fontSize: "11px",
            color: "rgba(255,255,255,0.38)",
            textAlign: "center",
          }}
        >
          Data provided by
          football-data.org
        </p>
      
        {["PL", "DED", "PD", "BL1", "SA", "FL1", "PPL"].includes(
          selectedCompetition
        ) && (
          <div
            style={{
              marginTop: "24px",
              background: activeTheme.surface,
              border: `1px solid ${activeTheme.border}`,
              borderRadius: "18px",
              overflow: "hidden",
              boxShadow: `0 10px 32px ${activeTheme.glow}`,
            }}
          >
            <div
              style={{
                padding: "20px 22px 15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "14px",
                flexWrap: "wrap",
                borderBottom: `1px solid ${activeTheme.border}`,
              }}
            >
              <div>
                <div
                  style={{
                    color: activeTheme.accent,
                    fontSize: "10px",
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: "0.8px",
                  }}
                >
                  Actuele stand
                </div>
                <h3
                  style={{
                    margin: "4px 0 0",
                    color: "white",
                    fontSize: "21px",
                    fontWeight: 900,
                  }}
                >
                  {selectedCompetitionData.flag} {selectedCompetitionData.name}
                </h3>
              </div>

              {!standingsLoading && standings.length > 0 && (
                <div
                  style={{
                    padding: "7px 10px",
                    borderRadius: "9px",
                    background: activeTheme.surfaceSoft,
                    border: `1px solid ${activeTheme.border}`,
                    color: activeTheme.accent,
                    fontSize: "10px",
                    fontWeight: 900,
                  }}
                >
                  {standings.length} clubs
                </div>
              )}
            </div>

            {standingsLoading && (
              <div
                style={{
                  padding: "28px 22px",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.58)",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                📊 Stand laden...
              </div>
            )}

            {!standingsLoading && standingsError && (
              <div
                style={{
                  padding: "28px 22px",
                  textAlign: "center",
                  color: "#ffb0b0",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {standingsError}
              </div>
            )}

            {!standingsLoading && !standingsError && standings.length === 0 && (
              <div
                style={{
                  padding: "28px 22px",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.58)",
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                Voor deze competitie is momenteel geen stand beschikbaar.
              </div>
            )}

            {!standingsLoading && !standingsError && standings.length > 0 && (
              <div className="voetiq-standings-scroll">
                <table className="voetiq-standings-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Club</th>
                      <th title="Gespeeld">GS</th>
                      <th title="Gewonnen">W</th>
                      <th title="Gelijk">G</th>
                      <th title="Verloren">V</th>
                      <th title="Doelpunten voor">DV</th>
                      <th title="Doelpunten tegen">DT</th>
                      <th title="Doelsaldo">DS</th>
                      <th title="Punten">P</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((row) => (
                      <tr key={row.team.id ?? row.team.name}>
                        <td
                          style={{
                            color:
                              row.position <= 4
                                ? activeTheme.accent
                                : "rgba(255,255,255,0.62)",
                            fontWeight: 900,
                          }}
                        >
                          {row.position}
                        </td>
                        <td className="voetiq-standings-team">
                          {row.team.crest ? (
                            <img src={row.team.crest} alt="" />
                          ) : (
                            <span
                              style={{
                                width: "25px",
                                height: "25px",
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              ⚽
                            </span>
                          )}
                          <strong style={{ color: "white" }}>
                            {row.team.shortName || row.team.name}
                          </strong>
                        </td>
                        <td>{row.playedGames}</td>
                        <td>{row.won}</td>
                        <td>{row.draw}</td>
                        <td>{row.lost}</td>
                        <td>{row.goalsFor}</td>
                        <td>{row.goalsAgainst}</td>
                        <td>
                          {row.goalDifference > 0
                            ? `+${row.goalDifference}`
                            : row.goalDifference}
                        </td>
                        <td
                          style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: 900,
                          }}
                        >
                          {row.points}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

</section>
    </main>
  );
}

function Team({
  name,
  crest,
  side,
  theme,
}: {
  name: string;
  crest?: string;
  side: "home" | "away";
  theme: { surfaceSoft: string; border: string };
}) {
  const home = side === "home";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: home
          ? "row"
          : "row-reverse",
        alignItems: "center",
        justifyContent:
          "flex-end",
        gap: "13px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          textAlign: home
            ? "right"
            : "left",
          fontWeight: 800,
          fontSize: "15px",
          lineHeight: 1.25,
        }}
      >
        {name}
      </div>

      <div
        style={{
          width: "48px",
          height: "48px",
          flexShrink: 0,
          borderRadius: "12px",
          background: theme.surfaceSoft,
          border:
            `1px solid ${theme.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent:
            "center",
          padding: "7px",
          boxSizing:
            "border-box",
        }}
      >
        {crest ? (
          <img
            src={crest}
            alt={`${name} logo`}
            style={{
              width: "100%",
              height: "100%",
              objectFit:
                "contain",
            }}
          />
        ) : (
          <span
            style={{
              fontSize: "20px",
            }}
          >
            ⚽
          </span>
        )}
      </div>
    </div>
  );
}

const scoreInputStyle = {
  width: "55px",
  height: "52px",
  boxSizing:
    "border-box" as const,
  border:
    "1px solid #dce3df",
  borderRadius: "11px",
  textAlign:
    "center" as const,
  fontSize: "20px",
  fontWeight: 900,
  outline: "none",
  background: "rgba(255,255,255,0.06)",
  color: "white",
};

const emptyCardStyle = {
  background: "#07172b",
  borderRadius: "17px",
  padding: "45px 25px",
  textAlign:
    "center" as const,
  boxShadow:
    "0 7px 24px rgba(0,0,0,0.055)",
};

function navigationButtonStyle(
  disabled: boolean,
  theme: { surfaceSoft: string; border: string; accent: string }
) {
  return {
    border: `1px solid ${theme.border}`,
    background: disabled
      ? "rgba(255,255,255,0.04)"
      : theme.surfaceSoft,
    color: disabled
      ? "rgba(255,255,255,0.28)"
      : theme.accent,
    borderRadius: "9px",
    padding: "10px 14px",
    fontWeight: 800,
    cursor: disabled
      ? "default"
      : "pointer",
  };
}
