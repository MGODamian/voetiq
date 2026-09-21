import { NextResponse } from "next/server";

const FOOTBALL_DATA_COMPETITIONS = [
  "PL", "DED", "PD", "BL1", "SA", "FL1", "PPL", "CL",
];

const API_FOOTBALL_COMPETITIONS: Record<string, number> = {
  EL: 3,
};

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function getMatchday(round?: string): number | undefined {
  if (!round) return undefined;
  const numbers = round.match(/\d+/g);
  if (!numbers?.length) return undefined;
  const value = Number(numbers[numbers.length - 1]);
  return Number.isFinite(value) ? value : undefined;
}

function mapApiFootballStatus(shortStatus?: string) {
  switch (shortStatus) {
    case "NS":
    case "TBD": return "SCHEDULED";
    case "1H":
    case "HT":
    case "2H":
    case "ET":
    case "BT":
    case "P":
    case "SUSP":
    case "INT":
    case "LIVE": return "IN_PLAY";
    case "FT":
    case "AET":
    case "PEN": return "FINISHED";
    case "PST": return "POSTPONED";
    case "CANC": return "CANCELLED";
    default: return shortStatus || "SCHEDULED";
  }
}

async function getApiFootballMatches(
  competition: "EL",
  dateFrom: string,
  dateTo: string
) {
  const apiKey = process.env.API_FOOTBALL_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "API_FOOTBALL_KEY ontbreekt in Vercel." },
      { status: 500 }
    );
  }

  const leagueId = API_FOOTBALL_COMPETITIONS[competition];

  const url =
    "https://v3.football.api-sports.io/fixtures" +
    `?league=${leagueId}` +
    "&season=2026" +
    `&from=${dateFrom}` +
    `&to=${dateTo}` +
    "&timezone=UTC";

  const response = await fetch(url, {
    headers: { "x-apisports-key": apiKey },
    next: { revalidate: 3600 },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: "API-Football fout", competition, details: data },
      { status: response.status }
    );
  }

  if (data.errors) {
    const hasErrors = Array.isArray(data.errors)
      ? data.errors.length > 0
      : Object.keys(data.errors).length > 0;

    if (hasErrors) {
      return NextResponse.json(
        { error: "API-Football fout", competition, details: data.errors },
        { status: 502 }
      );
    }
  }

  const matches = (data.response || []).map((item: any) => ({
    id: item.fixture.id,
    utcDate: item.fixture.date,
    status: mapApiFootballStatus(item.fixture.status?.short),
    matchday: getMatchday(item.league?.round),
    homeTeam: {
      id: item.teams?.home?.id,
      name: item.teams?.home?.name || "Thuisteam",
      crest: item.teams?.home?.logo,
    },
    awayTeam: {
      id: item.teams?.away?.id,
      name: item.teams?.away?.name || "Uitteam",
      crest: item.teams?.away?.logo,
    },
    competition: {
      id: item.league?.id,
      name: item.league?.name || "UEFA Europa League",
      code: competition,
    },
    score: {
      winner:
        item.teams?.home?.winner === true
          ? "HOME_TEAM"
          : item.teams?.away?.winner === true
            ? "AWAY_TEAM"
            : item.fixture.status?.short === "FT"
              ? "DRAW"
              : null,
      duration: "REGULAR",
      fullTime: {
        home: item.goals?.home ?? null,
        away: item.goals?.away ?? null,
      },
      halfTime: {
        home: item.score?.halftime?.home ?? null,
        away: item.score?.halftime?.away ?? null,
      },
    },
  }));

  return NextResponse.json({
    competition: { code: competition, name: "UEFA Europa League" },
    matches,
  });
}

function zafronixNumericId(id: unknown, index: number) {
  const text = String(id ?? "");
  const number = Number(text.match(/(\d+)$/)?.[1] ?? index + 1);
  return 848000000 + number;
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

  if (item.homeScore > item.awayScore) return "HOME_TEAM";
  if (item.awayScore > item.homeScore) return "AWAY_TEAM";
  return "DRAW";
}

function pickKickoff(item: any) {
  return (
    item.kickoff ??
    item.kickoffUtc ??
    item.kickoffUTC ??
    item.kickoffTime ??
    item.time ??
    item.startTime ??
    item.start_time ??
    null
  );
}

async function getZafronixConferenceLeagueMatches(
  dateFrom: string,
  dateTo: string
) {
  const apiKey = process.env.ZAFRONIX_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ZAFRONIX_API_KEY ontbreekt in Vercel." },
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
      next: { revalidate: 3600 },
    }
  );

  const rawText = await response.text();

  let payload: any;
  try {
    payload = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      {
        error: "Zafronix gaf geen geldige JSON terug.",
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

  const filteredSourceMatches = sourceMatches.filter((item: any) => {
    if (!item?.date) return false;
    return item.date >= dateFrom && item.date <= dateTo;
  });

  const matches = filteredSourceMatches.map((item: any, index: number) => ({
    id: zafronixNumericId(item.id, index),

    // Voorlopig blijft de veilige placeholder bestaan totdat we exact weten
    // hoe Zafronix de echte kickoff terugstuurt.
    utcDate: `${item.date}T12:00:00Z`,

    status: zafronixStatus(item),
    matchday:
      typeof item.matchday === "number"
        ? item.matchday
        : Number(item.matchday) || undefined,
    stage: item.stage || "league_phase",

    homeTeam: {
      id: null,
      name: item.homeTeam || "Thuisteam",
      shortName: item.homeTeam || "Thuisteam",
      tla: null,
      crest: null,
    },

    awayTeam: {
      id: null,
      name: item.awayTeam || "Uitteam",
      shortName: item.awayTeam || "Uitteam",
      tla: null,
      crest: null,
    },

    competition: {
      id: 848,
      name: "UEFA Conference League",
      code: "ECL",
    },

    score: {
      winner: zafronixWinner(item),
      duration: "REGULAR",
      fullTime: {
        home: item.homeScore ?? null,
        away: item.awayScore ?? null,
      },
      halfTime: {
        home: null,
        away: null,
      },
    },
  }));

  // Tijdelijke debug-info: geen API-key of andere geheime gegevens.
  // Hiermee zien we exact welke velden Zafronix voor de eerste ECL-match levert.
  const firstMatch = filteredSourceMatches[0] ?? null;

  return NextResponse.json({
    competition: {
      id: 848,
      code: "ECL",
      name: "UEFA Conference League",
    },
    count: matches.length,
    kickoffDebug: firstMatch
      ? {
          availableFields: Object.keys(firstMatch),
          detectedKickoff: pickKickoff(firstMatch),
          sample: {
            id: firstMatch.id ?? null,
            date: firstMatch.date ?? null,
            homeTeam: firstMatch.homeTeam ?? null,
            awayTeam: firstMatch.awayTeam ?? null,
            kickoff: firstMatch.kickoff ?? null,
            kickoffUtc: firstMatch.kickoffUtc ?? null,
            kickoffUTC: firstMatch.kickoffUTC ?? null,
            kickoffTime: firstMatch.kickoffTime ?? null,
            time: firstMatch.time ?? null,
            startTime: firstMatch.startTime ?? null,
            start_time: firstMatch.start_time ?? null,
          },
        }
      : null,
    matches,
  });
}

async function getFootballDataMatches(
  competition: string,
  dateFrom: string,
  dateTo: string
) {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "FOOTBALL_DATA_API_TOKEN ontbreekt." },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    {
      headers: { "X-Auth-Token": token },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    return NextResponse.json(
      {
        error: "Football-data API fout",
        competition,
        details: errorText,
      },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const competition = searchParams.get("competition") || "DED";

  const supportedCompetitions = [
    ...FOOTBALL_DATA_COMPETITIONS,
    ...Object.keys(API_FOOTBALL_COMPETITIONS),
    "ECL",
  ];

  if (!supportedCompetitions.includes(competition)) {
    return NextResponse.json(
      { error: "Deze competitie wordt niet ondersteund." },
      { status: 400 }
    );
  }

  const today = new Date();

  const previousMonth = new Date(today);
  previousMonth.setDate(previousMonth.getDate() - 30);

  const nextMonth = new Date(today);
  nextMonth.setDate(nextMonth.getDate() + 30);

  const dateFrom = formatDate(previousMonth);
  const dateTo = formatDate(nextMonth);

  try {
    if (competition === "ECL") {
      return await getZafronixConferenceLeagueMatches(dateFrom, dateTo);
    }

    if (competition === "EL") {
      return await getApiFootballMatches(competition, dateFrom, dateTo);
    }

    return await getFootballDataMatches(competition, dateFrom, dateTo);
  } catch (error) {
    console.error("Matches API error:", error);

    return NextResponse.json(
      { error: "Er ging iets mis bij het ophalen van de wedstrijden." },
      { status: 500 }
    );
  }
}
