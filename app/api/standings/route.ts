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

type ZafronixCompetition = (typeof ZAFRONIX_COMPETITIONS)[number];

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

type MutableStanding = Omit<StandingRow, "position">;

const ZAFRONIX_CONFIG: Record<
  ZafronixCompetition,
  { url: string; name: string; id: number }
> = {
  EL: {
    url: "https://api.zafronix.com/uefa/europaleague/v1/matches?season=2026",
    name: "UEFA Europa League",
    id: 3,
  },
  ECL: {
    url: "https://api.zafronix.com/uefa/conferenceleague/v1/matches?season=2026",
    name: "UEFA Conference League",
    id: 848,
  },
};

function normalizeStage(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
}

function isLeaguePhaseMatch(item: any): boolean {
  const stage = normalizeStage(item?.stageNormalized ?? item?.stage);

  // De moderne EL/ECL league phase. We nemen bewust geen kwalificatie-
  // of knock-outwedstrijden mee in de ranglijst.
  return (
    stage === "league_phase" ||
    stage === "league" ||
    stage === "league_stage"
  );
}

function hasFinishedScore(item: any): boolean {
  const home = item?.homeScore;
  const away = item?.awayScore;

  return (
    home !== null &&
    home !== undefined &&
    away !== null &&
    away !== undefined &&
    Number.isFinite(Number(home)) &&
    Number.isFinite(Number(away))
  );
}

function teamName(value: unknown): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    for (const key of ["name", "shortName", "clubName"]) {
      const candidate = objectValue[key];

      if (typeof candidate === "string" && candidate.trim()) {
        return candidate.trim();
      }
    }
  }

  return "";
}

function getOrCreateStanding(
  map: Map<string, MutableStanding>,
  name: string
): MutableStanding {
  const existing = map.get(name);

  if (existing) {
    return existing;
  }

  const row: MutableStanding = {
    team: {
      id: null,
      name,
      shortName: name,
      tla: null,
      crest: null,
    },
    playedGames: 0,
    won: 0,
    draw: 0,
    lost: 0,
    points: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
  };

  map.set(name, row);
  return row;
}

function applyResult(
  home: MutableStanding,
  away: MutableStanding,
  homeScore: number,
  awayScore: number
) {
  home.playedGames += 1;
  away.playedGames += 1;

  home.goalsFor += homeScore;
  home.goalsAgainst += awayScore;

  away.goalsFor += awayScore;
  away.goalsAgainst += homeScore;

  if (homeScore > awayScore) {
    home.won += 1;
    away.lost += 1;
    home.points += 3;
  } else if (homeScore < awayScore) {
    away.won += 1;
    home.lost += 1;
    away.points += 3;
  } else {
    home.draw += 1;
    away.draw += 1;
    home.points += 1;
    away.points += 1;
  }

  home.goalDifference = home.goalsFor - home.goalsAgainst;
  away.goalDifference = away.goalsFor - away.goalsAgainst;
}

function sortStandings(a: MutableStanding, b: MutableStanding) {
  // Dit is voldoende om de live tabel op te bouwen.
  // UEFA heeft bij volledig gelijke waarden aanvullende tiebreakers;
  // die kunnen later worden toegevoegd als twee clubs exact gelijk staan.
  if (b.points !== a.points) return b.points - a.points;
  if (b.goalDifference !== a.goalDifference) {
    return b.goalDifference - a.goalDifference;
  }
  if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;

  return a.team.name.localeCompare(b.team.name, "nl");
}

async function getZafronixStandings(competition: ZafronixCompetition) {
  const apiKey = process.env.ZAFRONIX_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ZAFRONIX_API_KEY ontbreekt in Vercel." },
      { status: 500 }
    );
  }

  const config = ZAFRONIX_CONFIG[competition];

  const response = await fetch(config.url, {
    headers: {
      "X-API-Key": apiKey,
      Accept: "application/json",
    },
    next: {
      // Zelfde rustige cache-aanpak als bij de bestaande Zafronix-matchroute.
      revalidate: 7200,
    },
  });

  const rawText = await response.text();

  let payload: any;

  try {
    payload = JSON.parse(rawText);
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

  if (sourceMatches.length === 0) {
    return NextResponse.json(
      {
        error: "Zafronix gaf geen wedstrijden terug.",
        competition,
      },
      { status: 502 }
    );
  }

  const leaguePhaseMatches = sourceMatches.filter(isLeaguePhaseMatch);

  /*
   * Voeg alle clubs uit de league phase alvast toe.
   * Daardoor staat de volledige league table er ook voordat alle clubs
   * hun eerste wedstrijd hebben gespeeld.
   */
  const standingsMap = new Map<string, MutableStanding>();

  for (const item of leaguePhaseMatches) {
    const homeName = teamName(item?.homeTeam);
    const awayName = teamName(item?.awayTeam);

    if (homeName) getOrCreateStanding(standingsMap, homeName);
    if (awayName) getOrCreateStanding(standingsMap, awayName);
  }

  let finishedMatches = 0;

  for (const item of leaguePhaseMatches) {
    if (!hasFinishedScore(item)) {
      continue;
    }

    const homeName = teamName(item?.homeTeam);
    const awayName = teamName(item?.awayTeam);

    if (!homeName || !awayName) {
      continue;
    }

    const homeScore = Number(item.homeScore);
    const awayScore = Number(item.awayScore);

    const home = getOrCreateStanding(standingsMap, homeName);
    const away = getOrCreateStanding(standingsMap, awayName);

    applyResult(home, away, homeScore, awayScore);
    finishedMatches += 1;
  }

  const table: StandingRow[] = Array.from(standingsMap.values())
    .sort(sortStandings)
    .map((row, index) => ({
      position: index + 1,
      ...row,
    }));

  if (table.length === 0) {
    return NextResponse.json(
      {
        error:
          "Er konden geen league-phase clubs uit de Zafronix-wedstrijden worden opgebouwd.",
        competition,
        availableStages: Array.from(
          new Set(
            sourceMatches
              .map((item: any) => item?.stageNormalized ?? item?.stage)
              .filter(Boolean)
          )
        ),
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    competition: {
      id: config.id,
      name: config.name,
      code: competition,
      emblem: null,
    },
    season: 2026,
    stage: "LEAGUE_PHASE",
    type: "TOTAL",
    count: table.length,
    calculatedFromMatches: true,
    finishedMatches,
    table,
  });
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
        competition as ZafronixCompetition
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
