import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.FOOTBALL_DATA_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "API-token ontbreekt" },
      { status: 500 }
    );
  }

  const today = new Date();

  const previousMonth = new Date();
  previousMonth.setDate(today.getDate() - 30);

  const nextMonth = new Date();
  nextMonth.setDate(today.getDate() + 30);

  const dateFrom = previousMonth.toISOString().split("T")[0];
  const dateTo = nextMonth.toISOString().split("T")[0];

  const response = await fetch(
    `https://api.football-data.org/v4/competitions/DED/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
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
        details: errorText,
      },
      { status: response.status }
    );
  }

  const data = await response.json();

  return NextResponse.json(data);
}
