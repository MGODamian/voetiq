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
] as const;

const ZAFRONIX_COMPETITIONS = ["EL", "ECL"] as const;

const ZAFRONIX_CONFIG: Record<
  (typeof ZAFRONIX_COMPETITIONS)[number],
  { baseUrl: string; name: string }
> = {
  EL: {
    baseUrl: "https://api.zafronix.com/uefa/europaleague/v1",
    name: "UEFA Europa League",
  },
  ECL: {
    baseUrl: "https://api.zafronix.com/uefa/conferenceleague/v1",
    name: "UEFA Conference League",
  },
};

type NormalizedStandingRow = {
  position: number;
  team: {
    id: string | number | null;
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

function numberValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return 0;
}

function stringValue(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim() !== "") {
      return value;
    }
  }

  return null;
}

function normalizeZafronixRow(
  row: any,
  index: number
): NormalizedStandingRow {
  const teamObject =
    row?.team && typeof row.team === "object"
      ? row.team
      : row?.club && typeof row.club === "object"
        ? row.club
        : {};

  const teamName =
    stringValue(
      teamObject?.name,
      teamObject?.shortName,
      row?.teamName,
      row?.clubName,
      typeof row?.team === "string" ? row.team : null,
      typeof row?.club === "string" ? row.club : null,
      row?.name
    ) ?? "Onbekend";

  const shortName =
    stringValue(
      teamObject?.shortName,
      teamObject?.name,
      row?.shortName,
      row?.teamName,
      row?.clubName,
      teamName
    ) ?? teamName;

  const crest =
    stringValue(
      teamObject?.crest,
      teamObject?.logo,
      teamObject?.badge,
      teamObject?.image,
      row?.crest,
      row?.logo,
      row?.badge,
      row?.image
    ) ?? null;

  const tla =
    stringValue(
      teamObject?.tla,
      teamObject?.code,
      teamObject?.abbr,
      row?.tla,
      row?.code,
      row?.abbr
    ) ?? null;

  const playedGames = numberValue(
    row?.playedGames,
    row?.played,
    row?.matchesPlayed,
    row?.gamesPlayed,
    row?.mp
  );

  const won = numberValue(row?.won, row?.wins, row?.win, row?.w);
  const draw = numberValue(
    row?.draw,
    row?.drawn,
    row?.draws,
    row?.d
  );
  const lost = numberValue(
    row?.lost,
    row?.losses,
    row?.loss,
    row?.l
  );

  const goalsFor = numberValue(
    row?.goalsFor,
    row?.goals_for,
    row?.gf
  );

  const goalsAgainst = numberValue(
    row?.goalsAgainst,
    row?.goals_against,
    row?.ga
  );

  const goalDifference = numberValue(
    row?.goalDifference,
    row?.goal_difference,
    row?.gd,
    goalsFor - goalsAgainst
  );

  return {
    position: numberValue(
      row?.position,
      row?.rank,
      row?.place,
      index + 1
    ),
    team: {
      id:
        teamObject?.id ??
        row?.teamId ??
        row?.clubId ??
        row?.id ??
        null,
      name: teamName,
      shortName,
      tla,
      crest,
    },
    playedGames,
    won,
    draw,
    lost,
    points: numberValue(row?.points, row?.pts),
    goalsFor,
    goalsAgainst,
    goalDifference,
  };
}

function findZafronixTable(data: any): any[] {
  const candidates = [
    data?.table,
    data?.standings,
    data?.rows,
    data?.leagueTable,
    data?.league_table,
    data?.data?.table,
    data?.data?.standings,
    data?.data?.rows,
    data?.data?.leagueTable,
    data?.data?.league_table,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  if (data?.standings && typeof data.standings === "object") {
    const nestedCandidates = [
      data.standings?.table,
      data.standings?.rows,
      data.standings?.standings,
    ];

    for (const candidate of nestedCandidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }
  }

  if (data?.data?.standings && typeof data.data.standings === "object") {
    const nestedCandidates = [
      data.data.standings?.table,
      data.data.standings?.rows,
      data.data.standings?.standings,
    ];

    for (const candidate of nestedCandidates) {
      if (Array.isArray(candidate)) {
        return candidate;
      }
    }
  }

  return [];
}

async function getFootballDataStandings(competition: string) {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "FOOTBALL_DATA_API_TOKEN ontbreekt." },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.football-data.org/v4/competitions/${competition}/standings`,
    {
      headers: {
        "X-Auth-Token": token,
      },
      next: {
        revalidate: 300,
      },
    }
  );

  const rawText = await response.text();

  let data: any;

  try {
    data = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      {
        error: "Football-data gaf geen geldige JSON terug.",
        details: rawText,
      },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Football-data API fout",
        competition,
        details: data,
      },
      { status: response.status }
    );
  }

  const totalStanding = Array.isArray(data?.standings)
    ? data.standings.find((standing: any) => standing.type === "TOTAL") ??
      data.standings[0]
    : null;

  const table = Array.isArray(totalStanding?.table)
    ? totalStanding.table.map((row: any) => ({
        position: row.position,
        team: {
          id: row.team?.id ?? null,
          name: row.team?.name ?? "Onbekend",
          shortName: row.team?.shortName ?? row.team?.name ?? "Onbekend",
          tla: row.team?.tla ?? null,
          crest: row.team?.crest ?? null,
        },
        playedGames: row.playedGames ?? 0,
        won: row.won ?? 0,
        draw: row.draw ?? 0,
        lost: row.lost ?? 0,
        points: row.points ?? 0,
        goalsFor: row.goalsFor ?? 0,
        goalsAgainst: row.goalsAgainst ?? 0,
        goalDifference: row.goalDifference ?? 0,
      }))
    : [];

  return NextResponse.json({
    competition: {
      id: data?.competition?.id ?? null,
      name: data?.competition?.name ?? competition,
      code: data?.competition?.code ?? competition,
      emblem: data?.competition?.emblem ?? null,
    },
    season: data?.season ?? null,
    stage: totalStanding?.stage ?? null,
    type: totalStanding?.type ?? "TOTAL",
    count: table.length,
    table,
  });
}

async function getZafronixStandings(
  competition: (typeof ZAFRONIX_COMPETITIONS)[number]
) {
  const apiKey = process.env.ZAFRONIX_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ZAFRONIX_API_KEY ontbreekt." },
      { status: 500 }
    );
  }

  const config = ZAFRONIX_CONFIG[competition];

  const response = await fetch(
    `${config.baseUrl}/standings?season=2026`,
    {
      headers: {
        "X-API-Key": apiKey,
      },
      next: {
        revalidate: 300,
      },
    }
  );

  const rawText = await response.text();

  let data: any;

  try {
    data = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      {
        error: "Zafronix gaf geen geldige JSON terug.",
        competition,
        details: rawText,
      },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Zafronix API fout",
        competition,
        details: data,
      },
      { status: response.status }
    );
  }

  const rawTable = findZafronixTable(data);
  const table = rawTable.map(normalizeZafronixRow);

  if (table.length === 0) {
    return NextResponse.json(
      {
        error: "Zafronix gaf geen herkenbare stand terug.",
        competition,
        details: data,
      },
      { status: 502 }
    );
  }

  table.sort((a, b) => a.position - b.position);

  return NextResponse.json({
    competition: {
      id: data?.competition?.id ?? null,
      name:
        data?.competition?.name ??
        data?.competitionName ??
        config.name,
      code: competition,
      emblem:
        data?.competition?.emblem ??
        data?.competition?.logo ??
        null,
    },
    season: data?.season ?? 2026,
    stage:
      data?.stage ??
      data?.phase ??
      data?.competition?.stage ??
      "LEAGUE_PHASE",
    type: "TOTAL",
    count: table.length,
    table,
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const competition = (
    searchParams.get("competition") || "DED"
  ).toUpperCase();

  try {
    if (FOOTBALL_DATA_COMPETITIONS.includes(competition as any)) {
      return await getFootballDataStandings(competition);
    }

    if (ZAFRONIX_COMPETITIONS.includes(competition as any)) {
      return await getZafronixStandings(
        competition as (typeof ZAFRONIX_COMPETITIONS)[number]
      );
    }

    return NextResponse.json(
      { error: "Voor deze competitie is geen stand beschikbaar." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Standings API error:", error);

    return NextResponse.json(
      { error: "Er ging iets mis bij het ophalen van de stand." },
      { status: 500 }
    );
  }
}
