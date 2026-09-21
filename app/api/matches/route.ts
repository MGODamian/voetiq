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
    competition: {
      code: competition,
      name: "UEFA Europa League",
    },
    matches,
  });
}

function zafronixNumericId(id: unknown, index: number) {
  const text = String(id ?? "");
  const number = Number(
    text.match(/(\d+)$/)?.[1] ?? index + 1
  );

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
        revalidate: 3600,
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

async function getFootballDataMatches(
  competition: string,
  dateFrom: string,
  dateTo: string
) {
  const token =
    process.env.FOOTBALL_DATA_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error:
          "FOOTBALL_DATA_API_TOKEN ontbreekt.",
      },
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
    const errorText =
      await response.text();

    return NextResponse.json(
      {
        error:
          "Football-data API fout",
        competition,
        details: errorText,
      },
      { status: response.status }
    );
  }

  const data =
    await response.json();

  return NextResponse.json(data);
}

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const competition =
    searchParams.get(
      "competition"
    ) || "DED";

  const supportedCompetitions = [
    ...FOOTBALL_DATA_COMPETITIONS,
    ...Object.keys(
      API_FOOTBALL_COMPETITIONS
    ),
    "ECL",
  ];

  if (
    !supportedCompetitions.includes(
      competition
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Deze competitie wordt niet ondersteund.",
      },
      { status: 400 }
    );
  }

  const today = new Date();

  const previousMonth =
    new Date(today);

  previousMonth.setDate(
    previousMonth.getDate() - 30
  );

  const nextMonth =
    new Date(today);

  nextMonth.setDate(
    nextMonth.getDate() + 30
  );

  const dateFrom =
    formatDate(previousMonth);

  const dateTo =
    formatDate(nextMonth);

  try {
    if (competition === "ECL") {
      return await getZafronixConferenceLeagueMatches(
        dateFrom,
        dateTo
      );
    }

    if (competition === "EL") {
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
    console.error(
      "Matches API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Er ging iets mis bij het ophalen van de wedstrijden.",
      },
      { status: 500 }
    );
  }
}
