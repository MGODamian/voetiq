import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const allowedCompetitions = [
  "PL",
  "DED",
  "PD",
  "BL1",
  "SA",
  "FL1",
  "PPL",
  "CL",
  "EL",
  "ECL",
];

const ZAFRONIX_COMPETITIONS = ["EL", "ECL"] as const;

type CompetitionCode = "EL" | "ECL";

function zafronixNumericId(
  competition: "EL" | "ECL",
  id: unknown,
  index: number
) {
  const text = String(id ?? "");
  const number = Number(text.match(/(\d+)$/)?.[1] ?? index + 1);
  return (competition === "EL" ? 300000000 : 848000000) + number;
}

function zafronixStatus(item: any) {
  if (
    item.homeScore !== null &&
    item.homeScore !== undefined &&
    item.awayScore !== null &&
    item.awayScore !== undefined
  ) {
    return "FINISHED";
  }

  return "SCHEDULED";
}

function zafronixWinner(item: any) {
  if (
    item.homeScore === null ||
    item.homeScore === undefined ||
    item.awayScore === null ||
    item.awayScore === undefined
  ) {
    return null;
  }

  if (item.homeScore > item.awayScore) {
    return "HOME_TEAM";
  }

  if (item.awayScore > item.homeScore) {
    return "AWAY_TEAM";
  }

  return "DRAW";
}

/**
 * Officiële UEFA-aftraptijden voor de Conference League 2026/27.
 *
 * UEFA vermeldt 21:00 als standaardtijd.
 * Alleen afwijkende tijden worden hieronder vastgelegd.
 *
 * Zafronix levert alleen de datum en teams,
 * niet de kickoff-tijd.
 *
 * Key = YYYY-MM-DD|thuisteam
 */
const UEFA_CONFERENCE_SPECIAL_KICKOFFS: Record<string, string> = {
  // Speeldag 1 — 15 oktober 2026
  "2026-10-15|Lugano": "18:45",
  "2026-10-15|Hajduk Split": "18:45",
  "2026-10-15|Gent": "18:45",
  "2026-10-15|Egnatia": "18:45",
  "2026-10-15|KuPS": "18:45",
  "2026-10-15|Mjällby AIF": "18:45",
  "2026-10-15|Panathinaikos": "18:45",
  "2026-10-15|CSKA Sofia": "18:45",
  "2026-10-15|Riga": "18:45",
  "2026-10-15|Universitatea Craiova": "18:45",

  // Speeldag 2 — 22 oktober 2026
  "2026-10-22|Kairat": "16:30",
  "2026-10-22|Iberia 1999": "18:45",
  "2026-10-22|Nordsjælland": "18:45",
  "2026-10-22|Red Star Belgrade": "18:45",
  "2026-10-22|Jablonec": "18:45",
  "2026-10-22|Kauno Žalgiris": "18:45",
  "2026-10-22|Getafe": "18:45",
  "2026-10-22|Inter Escaldes": "18:45",
  "2026-10-22|Pafos": "18:45",
  "2026-10-22|Trabzonspor": "18:45",

  // Speeldag 3 — 5 november 2026
  "2026-11-05|AGF": "18:45",
  "2026-11-05|Atalanta": "18:45",
  "2026-11-05|Midtjylland": "18:45",
  "2026-11-05|Thun": "18:45",
  "2026-11-05|Red Star Belgrade": "18:45",
  "2026-11-05|KuPS": "18:45",
  "2026-11-05|Lincoln Red Imps": "18:45",
  "2026-11-05|Mjällby AIF": "18:45",
  "2026-11-05|Trabzonspor": "18:45",

  // Speeldag 4 — 26 november 2026
  "2026-11-26|Kairat": "16:30",
  "2026-11-26|Ajax": "18:45",
  "2026-11-26|Brighton & Hove Albion": "18:45",
  "2026-11-26|Iberia 1999": "18:45",
  "2026-11-26|Jablonec": "18:45",
  "2026-11-26|Kauno Žalgiris": "18:45",
  "2026-11-26|Heart of Midlothian": "18:45",
  "2026-11-26|Egnatia": "18:45",
  "2026-11-26|Pafos": "18:45",
  "2026-11-26|Brann": "18:45",

  // Speeldag 5 — 10 december 2026
  "2026-12-10|Kairat": "16:30",
  "2026-12-10|Copenhagen": "18:45",
  "2026-12-10|Iberia 1999": "18:45",
  "2026-12-10|Getafe": "18:45",
  "2026-12-10|KuPS": "18:45",
  "2026-12-10|Lincoln Red Imps": "18:45",
  "2026-12-10|Riga": "18:45",
  "2026-12-10|SC Freiburg": "18:45",
  "2026-12-10|Brann": "18:45",
  "2026-12-10|Trabzonspor": "18:45",
};

function getUefaConferenceKickoff(
  date: string,
  homeTeam: string
): string {
  return (
    UEFA_CONFERENCE_SPECIAL_KICKOFFS[
      `${date}|${homeTeam}`
    ] || "21:00"
  );
}

/**
 * Bepaalt automatisch de Nederlandse UTC-offset.
 *
 * Nederland gebruikt:
 * - UTC+2 tijdens zomertijd
 * - UTC+1 tijdens wintertijd
 *
 * Hierdoor worden bijvoorbeeld:
 * 15 oktober 2026 18:45 → 16:45 UTC
 * 15 oktober 2026 21:00 → 19:00 UTC
 *
 * En vanaf november:
 * 5 november 2026 18:45 → 17:45 UTC
 */
function getAmsterdamUtcOffset(date: string): number {
  const reference = new Date(`${date}T12:00:00Z`);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Amsterdam",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(reference);

  const localHour = Number(
    parts.find((part) => part.type === "hour")?.value ?? "12"
  );

  let offset = localHour - 12;

  if (offset < 0) {
    offset += 24;
  }

  return offset;
}

function getUefaConferenceUtcDate(
  date: string,
  homeTeam: string
): string {
  const kickoff = getUefaConferenceKickoff(
    date,
    homeTeam
  );

  const [hours, minutes] = kickoff
    .split(":")
    .map(Number);

  const offset = getAmsterdamUtcOffset(date);

  let utcHours = hours - offset;
  let utcDate = date;

  if (utcHours < 0) {
    utcHours += 24;

    const previousDay = new Date(`${date}T12:00:00Z`);

    previousDay.setUTCDate(
      previousDay.getUTCDate() - 1
    );

    utcDate = previousDay
      .toISOString()
      .split("T")[0];
  }

  return `${utcDate}T${String(utcHours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(2, "0")}:00Z`;
}

async function getZafronixConferenceLeagueMatches(
  dateFrom: string,
  dateTo: string
) {
  const apiKey = process.env.ZAFRONIX_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ZAFRONIX_API_KEY ontbreekt in Vercel.",
      },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://api.zafronix.com/uefa/conferenceleague/v1/matches?season=2026",
    {
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      next: {
        revalidate: 7200,
      },
    }
  );

  const rawText = await response.text();

  let payload: any;

  try {
    payload = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      {
        error:
          "Zafronix gaf geen geldige JSON terug.",
        details: rawText,
      },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Zafronix fout",
        competition: "ECL",
        status: response.status,
        details: payload,
      },
      { status: response.status }
    );
  }

  const sourceMatches = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  const filteredSourceMatches = sourceMatches.filter(
    (item: any) => {
      if (!item?.date) {
        return false;
      }

      return (
        item.date >= dateFrom &&
        item.date <= dateTo
      );
    }
  );

  const matches = filteredSourceMatches.map(
    (item: any, index: number) => ({
      id: zafronixNumericId(
        "ECL",
        item.id,
        index
      ),

      // Zafronix levert geen kickoff-tijd.
      // Gebruik daarom de officieel ingestelde
      // Conference League-tijden.
      utcDate: getUefaConferenceUtcDate(
        item.date,
        item.homeTeam || "Thuisteam"
      ),

      status: zafronixStatus(item),

      matchday:
        typeof item.matchday === "number"
          ? item.matchday
          : Number(item.matchday) ||
            undefined,

      stage:
        item.stage ||
        "league_phase",

      homeTeam: {
        id: null,
        name:
          item.homeTeam ||
          "Thuisteam",
        shortName:
          item.homeTeam ||
          "Thuisteam",
        tla: null,
        crest: null,
      },

      awayTeam: {
        id: null,
        name:
          item.awayTeam ||
          "Uitteam",
        shortName:
          item.awayTeam ||
          "Uitteam",
        tla: null,
        crest: null,
      },

      competition: {
        id: 848,
        name:
          "UEFA Conference League",
        code: "ECL",
      },

      score: {
        winner:
          zafronixWinner(item),

        duration: "REGULAR",

        fullTime: {
          home:
            item.homeScore ??
            null,
          away:
            item.awayScore ??
            null,
        },

        halfTime: {
          home: null,
          away: null,
        },
      },
    })
  );

  return NextResponse.json({
    competition: {
      id: 848,
      code: "ECL",
      name:
        "UEFA Conference League",
    },

    count: matches.length,

    matches,
  });
}


/**
 * UEFA Europa League 2026/27.
 * UEFA publiceert alle tijden als CET: standaard 21:00,
 * behalve de expliciet vermelde 18:45-wedstrijden.
 */
const UEFA_EUROPA_SPECIAL_KICKOFFS: Record<string, string> = {
  // Speeldag 1
  "2026-09-16|Ararat-Armenia": "18:45",
  "2026-09-16|Omonia": "18:45",
  "2026-09-17|OFI Crete": "18:45",
  "2026-09-17|Levski Sofia": "18:45",

  // Speeldag 2
  "2026-10-15|Sparta Praha": "18:45",
  "2026-10-15|AZ Alkmaar": "18:45",
  "2026-10-15|Salzburg": "18:45",
  "2026-10-15|Lech Poznań": "18:45",
  "2026-10-15|Celje": "18:45",
  "2026-10-15|Lyon": "18:45",
  "2026-10-15|Union SG": "18:45",
  "2026-10-15|Torreense": "18:45",

  // Speeldag 3
  "2026-10-22|Ararat-Armenia": "18:45",
  "2026-10-22|Ferencváros": "18:45",
  "2026-10-22|GNK Dinamo": "18:45",
  "2026-10-22|Juventus": "18:45",
  "2026-10-22|Lech Poznań": "18:45",
  "2026-10-22|OFI Crete": "18:45",
  "2026-10-22|Union SG": "18:45",
  "2026-10-22|Sturm Graz": "18:45",

  // Speeldag 4
  "2026-11-05|Milan": "18:45",
  "2026-11-05|Sparta Praha": "18:45",
  "2026-11-05|Crystal Palace": "18:45",
  "2026-11-05|Lillestrøm": "18:45",
  "2026-11-05|N.E.C. Nijmegen": "18:45",
  "2026-11-05|N.E.C.": "18:45",
  "2026-11-05|Levski Sofia": "18:45",
  "2026-11-05|Real Sociedad": "18:45",
  "2026-11-05|Anderlecht": "18:45",
  "2026-11-05|Rennes": "18:45",

  // Speeldag 5
  "2026-11-26|Viktoria Plzeň": "18:45",
  "2026-11-26|Beşiktaş": "18:45",
  "2026-11-26|Celta": "18:45",
  "2026-11-26|Olympiacos": "18:45",
  "2026-11-26|Salzburg": "18:45",

  // Speeldag 6
  "2026-12-10|Anderlecht": "18:45",
  "2026-12-10|Ararat-Armenia": "18:45",
  "2026-12-10|AZ Alkmaar": "18:45",
  "2026-12-10|Celta": "18:45",
  "2026-12-10|Jagiellonia": "18:45",
  "2026-12-10|Omonia": "18:45",
  "2026-12-10|Rennes": "18:45",

  // Speeldag 7
  "2027-01-21|Beşiktaş": "18:45",
  "2027-01-21|Ararat-Armenia": "18:45",
  "2027-01-21|Ferencváros": "18:45",
  "2027-01-21|Jagiellonia": "18:45",
  "2027-01-21|Lillestrøm": "18:45",
  "2027-01-21|N.E.C. Nijmegen": "18:45",
  "2027-01-21|N.E.C.": "18:45",
  "2027-01-21|Olympiacos": "18:45",
  "2027-01-21|Real Sociedad": "18:45",
  "2027-01-21|Sturm Graz": "18:45",
};

function getUefaEuropaKickoff(date: string, homeTeam: string): string {
  return UEFA_EUROPA_SPECIAL_KICKOFFS[`${date}|${homeTeam}`] || "21:00";
}

function getUefaEuropaUtcDate(date: string, homeTeam: string): string {
  const kickoff = getUefaEuropaKickoff(date, homeTeam);
  const [hours, minutes] = kickoff.split(":").map(Number);
  const offset = getAmsterdamUtcOffset(date);

  let utcHours = hours - offset;
  let utcDate = date;

  if (utcHours < 0) {
    utcHours += 24;
    const previousDay = new Date(`${date}T12:00:00Z`);
    previousDay.setUTCDate(previousDay.getUTCDate() - 1);
    utcDate = previousDay.toISOString().split("T")[0];
  }

  return `${utcDate}T${String(utcHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00Z`;
}


type VerifiedMatch = {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  homeTeam: { name: string };
  awayTeam: { name: string };
  competition: { code: string };
};

async function verifyFootballDataMatch(
  matchId: number | string,
  competition: string,
  footballToken: string
): Promise<VerifiedMatch | NextResponse> {
  const footballResponse = await fetch(
    `https://api.football-data.org/v4/matches/${matchId}`,
    {
      headers: { "X-Auth-Token": footballToken },
      cache: "no-store",
    }
  );

  if (!footballResponse.ok) {
    console.error("Football-data controle mislukt:", footballResponse.status);
    return NextResponse.json(
      { error: "De wedstrijd kon niet worden gecontroleerd." },
      { status: 502 }
    );
  }

  const match = await footballResponse.json();

  if (!match.competition || match.competition.code !== competition) {
    return NextResponse.json(
      { error: "Wedstrijd en competitie komen niet overeen." },
      { status: 400 }
    );
  }

  return {
    id: Number(match.id),
    utcDate: match.utcDate,
    status: match.status,
    matchday: typeof match.matchday === "number" ? match.matchday : null,
    homeTeam: { name: match.homeTeam.name },
    awayTeam: { name: match.awayTeam.name },
    competition: { code: match.competition.code },
  };
}

async function verifyZafronixMatch(
  matchId: number | string,
  competition: CompetitionCode
): Promise<VerifiedMatch | NextResponse> {
  const apiKey = process.env.ZAFRONIX_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ZAFRONIX_API_KEY ontbreekt in Vercel." },
      { status: 500 }
    );
  }

  const endpoint =
    competition === "EL"
      ? "https://api.zafronix.com/uefa/europaleague/v1/matches?season=2026"
      : "https://api.zafronix.com/uefa/conferenceleague/v1/matches?season=2026";

  // Zelfde cacheduur als /api/matches, zodat opslaan niet onnodig
  // door het dagelijkse Zafronix-limiet heen gaat.
  const response = await fetch(endpoint, {
    headers: {
      "X-API-Key": apiKey,
      Accept: "application/json",
    },
    next: { revalidate: 7200 },
  });

  const rawText = await response.text();
  let payload: any;

  try {
    payload = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { error: "Zafronix gaf geen geldige JSON terug." },
      { status: 502 }
    );
  }

  if (!response.ok) {
    console.error("Zafronix controle mislukt:", response.status, payload);
    return NextResponse.json(
      { error: "De wedstrijd kon niet worden gecontroleerd." },
      { status: 502 }
    );
  }

  const sourceMatches = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  // BELANGRIJK: dezelfde ID-opbouw als /api/matches.
  const foundIndex = sourceMatches.findIndex(
    (item: any, index: number) =>
      zafronixNumericId(competition, item?.id, index) === Number(matchId)
  );

  if (foundIndex < 0) {
    return NextResponse.json(
      { error: "De wedstrijd kon niet worden gevonden." },
      { status: 404 }
    );
  }

  const item = sourceMatches[foundIndex];

  const suppliedDateTime =
    item.utcDate ||
    item.kickoffUtc ||
    item.kickoff ||
    item.startTime ||
    null;

  const utcDate =
    competition === "EL" &&
    typeof suppliedDateTime === "string" &&
    suppliedDateTime.includes("T")
      ? suppliedDateTime
      : competition === "EL"
        ? getUefaEuropaUtcDate(
            item.date,
            item.homeTeam || "Thuisteam"
          )
        : getUefaConferenceUtcDate(
            item.date,
            item.homeTeam || "Thuisteam"
          );

  return {
    id: Number(matchId),
    utcDate,
    status: zafronixStatus(item),
    matchday:
      typeof item.matchday === "number"
        ? item.matchday
        : Number(item.matchday) || null,
    homeTeam: { name: item.homeTeam || "Thuisteam" },
    awayTeam: { name: item.awayTeam || "Uitteam" },
    competition: { code: competition },
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { accessToken, matchId, competition, homeScore, awayScore } = body;

    if (
      !accessToken ||
      !matchId ||
      !competition ||
      homeScore === undefined ||
      awayScore === undefined
    ) {
      return NextResponse.json(
        { error: "Niet alle gegevens zijn ingevuld." },
        { status: 400 }
      );
    }

    if (!allowedCompetitions.includes(competition)) {
      return NextResponse.json(
        { error: "Ongeldige competitie." },
        { status: 400 }
      );
    }

    const home = Number(homeScore);
    const away = Number(awayScore);

    if (
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0 ||
      home > 20 ||
      away > 20
    ) {
      return NextResponse.json(
        { error: "Ongeldige voorspelling." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabasePublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
    const footballToken = process.env.FOOTBALL_DATA_API_TOKEN;

    if (
      !supabaseUrl ||
      !supabasePublishableKey ||
      !supabaseSecretKey ||
      !footballToken
    ) {
      return NextResponse.json(
        { error: "Serverconfiguratie ontbreekt." },
        { status: 500 }
      );
    }

    const authClient = createClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Je bent niet ingelogd." },
        { status: 401 }
      );
    }

    const adminClient = createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const { data: profile, error: profileError } = await adminClient
      .from("profiles")
      .select("username, is_premium, premium_expires_at")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(profileError);
      return NextResponse.json(
        { error: "Je profiel kon niet worden geladen." },
        { status: 500 }
      );
    }

    if (!profile) {
      return NextResponse.json(
        { error: "Je profiel kon niet worden gevonden." },
        { status: 404 }
      );
    }

    const premiumExpiresAt = profile.premium_expires_at
      ? new Date(profile.premium_expires_at)
      : null;

    const premiumIsActive =
      profile.is_premium === true &&
      (premiumExpiresAt === null ||
        (!Number.isNaN(premiumExpiresAt.getTime()) &&
          premiumExpiresAt.getTime() > Date.now()));

    if (competition === "CL" && !premiumIsActive) {
      return NextResponse.json(
        {
          error:
            "Voor Champions League-voorspellingen heb je VoetIQ Premium nodig.",
          code: "PREMIUM_REQUIRED",
        },
        { status: 403 }
      );
    }

    let verified: VerifiedMatch | NextResponse;

    if (competition === "EL" || competition === "ECL") {
      verified = await verifyZafronixMatch(
        matchId,
        competition as CompetitionCode
      );
    } else {
      verified = await verifyFootballDataMatch(
        matchId,
        competition,
        footballToken
      );
    }

    if (verified instanceof NextResponse) {
      return verified;
    }

    const match = verified;
    const kickoff = new Date(match.utcDate);

    if (Number.isNaN(kickoff.getTime())) {
      return NextResponse.json(
        { error: "De aftraptijd van deze wedstrijd is ongeldig." },
        { status: 500 }
      );
    }

    if (kickoff.getTime() <= Date.now()) {
      return NextResponse.json(
        {
          error:
            "De wedstrijd is al begonnen. Je voorspelling staat op slot.",
        },
        { status: 403 }
      );
    }

    if (match.status !== "SCHEDULED" && match.status !== "TIMED") {
      return NextResponse.json(
        {
          error:
            "Deze wedstrijd is niet meer beschikbaar om te voorspellen.",
        },
        { status: 403 }
      );
    }

    const matchday = match.matchday;
    const matchName =
      `${match.homeTeam.name} - ${match.awayTeam.name}`;

    const { data: existingPrediction, error: existingError } =
      await adminClient
        .from("predictions")
        .select("id")
        .eq("user_id", user.id)
        .eq("match_id", matchId)
        .maybeSingle();

    if (existingError) {
      console.error(existingError);
      return NextResponse.json(
        {
          error:
            "Je bestaande voorspelling kon niet worden gecontroleerd.",
        },
        { status: 500 }
      );
    }

    if (existingPrediction) {
      const { error: updateError } = await adminClient
        .from("predictions")
        .update({
          home_score: home,
          away_score: away,
          competition_code: competition,
          matchday,
          kickoff_at: kickoff.toISOString(),
        })
        .eq("id", existingPrediction.id)
        .eq("user_id", user.id);

      if (updateError) {
        console.error(updateError);
        return NextResponse.json(
          { error: "Je voorspelling kon niet worden gewijzigd." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: "updated",
        message:
          `Voorspelling gewijzigd: ` +
          `${match.homeTeam.name} ${home} - ${away} ${match.awayTeam.name}`,
      });
    }

    const { error: insertError } = await adminClient
      .from("predictions")
      .insert({
        user_id: user.id,
        user_email: user.email || "",
        player_name: profile.username || "Speler",
        match_id: matchId,
        match_name: matchName,
        home_score: home,
        away_score: away,
        competition_code: competition,
        matchday,
        kickoff_at: kickoff.toISOString(),
      });

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { error: "Je voorspelling kon niet worden opgeslagen." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: "created",
      message:
        `Voorspelling opgeslagen: ` +
        `${match.homeTeam.name} ${home} - ${away} ${match.awayTeam.name}`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Er ging iets mis bij het verwerken van je voorspelling.",
      },
      { status: 500 }
    );
  }
}
