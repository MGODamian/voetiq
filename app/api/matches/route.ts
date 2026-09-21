import { NextResponse } from "next/server";

const FOOTBALL_DATA_COMPETITIONS = [
  "PL",
  "DED",
  "PD",
  "BL1",
  "SA",
  "FL1",
  "PPL",
  "CL",
];

const API_FOOTBALL_COMPETITIONS: Record<string, number> = {
  EL: 3,
  ECL: 848,
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
    case "TBD":
      return "SCHEDULED";
    case "1H":
    case "HT":
    case "2H":
    case "ET":
    case "BT":
    case "P":
    case "SUSP":
    case "INT":
    case "LIVE":
      return "IN_PLAY";
    case "FT":
    case "AET":
    case "PEN":
      return "FINISHED";
    case "PST":
      return "POSTPONED";
    case "CANC":
      return "CANCELLED";
    default:
      return shortStatus || "SCHEDULED";
  }
}

async function getApiFootballMatches(
  competition: "EL" | "ECL",
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
    headers: {
      "x-apisports-key": apiKey,
    },
    next: {
      revalidate: 3600,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "API-Football fout",
        competition,
        details: data,
      },
      { status: response.status }
    );
  }

  if (data.errors) {
    const hasErrors = Array.isArray(data.errors)
      ? data.errors.length > 0
      : Object.keys(data.errors).length > 0;

    if (hasErrors) {
      return NextResponse.json(
        {
          error: "API-Football fout",
          competition,
          details: data.errors,
        },
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
      name:
        item.league?.name ||
        (competition === "EL"
          ? "UEFA Europa League"
          : "UEFA Conference League"),
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
    competition: {
      code: competition,
      name:
        competition === "EL"
          ? "UEFA Europa League"
          : "UEFA Conference League",
    },
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
      headers: {
        "X-Auth-Token": token,
      },
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
    if (competition === "EL" || competition === "ECL") {
      return await getApiFootballMatches(
        competition,
        dateFrom,
        dateTo
      );
    }

    return await getFootballDataMatches(
      competition,
      dateFrom,
      dateTo
    );
  } catch (error) {
    console.error("Matches API error:", error);

    return NextResponse.json(
      {
        error: "Er ging iets mis bij het ophalen van de wedstrijden.",
      },
      { status: 500 }
    );
  }
}
