import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "API-token ontbreekt" },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const competition = searchParams.get("competition") || "DED";

  const allowedCompetitions = [
    "PL",
    "DED",
    "PD",
    "BL1",
    "SA",
    "FL1",
    "PPL",
    "EL",
    "ECL",
    "CL",
  ];

  if (!allowedCompetitions.includes(competition)) {
    return NextResponse.json(
      { error: "Deze competitie wordt niet ondersteund." },
      { status: 400 }
    );
  }

  // VoetIQ gebruikt intern ECL voor de Conference League.
  // football-data.org gebruikt hiervoor UCL.
  const footballDataCompetition =
    competition === "ECL" ? "UCL" : competition;

  const today = new Date();

  const previousMonth = new Date(today);
  previousMonth.setDate(today.getDate() - 30);

  const nextMonth = new Date(today);
  nextMonth.setDate(today.getDate() + 30);

  const dateFrom = previousMonth.toISOString().split("T")[0];
  const dateTo = nextMonth.toISOString().split("T")[0];

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/${footballDataCompetition}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        headers: {
          "X-Auth-Token": token,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error(
        `Football-data fout voor ${competition} (${footballDataCompetition}):`,
        response.status,
        errorText
      );

      return NextResponse.json(
        {
          error: "Football-data API fout",
          competition,
          footballDataCompetition,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(
      `Fout bij ophalen van ${competition}:`,
      error
    );

    return NextResponse.json(
      {
        error: "Er ging iets mis bij het ophalen van de wedstrijden.",
      },
      { status: 500 }
    );
  }
}
