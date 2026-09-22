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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const competition = searchParams.get("competition") || "DED";

  if (!FOOTBALL_DATA_COMPETITIONS.includes(competition as any)) {
    return NextResponse.json(
      { error: "Voor deze competitie is geen stand beschikbaar." },
      { status: 400 }
    );
  }

  const token = process.env.FOOTBALL_DATA_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "FOOTBALL_DATA_API_TOKEN ontbreekt." },
      { status: 500 }
    );
  }

  try {
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
  } catch (error) {
    console.error("Standings API error:", error);

    return NextResponse.json(
      { error: "Er ging iets mis bij het ophalen van de stand." },
      { status: 500 }
    );
  }
}
