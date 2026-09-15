import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const footballToken = process.env.FOOTBALL_DATA_API_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;

  if (!footballToken || !supabaseUrl || !supabaseSecret) {
    return NextResponse.json(
      { error: "Server environment variables ontbreken." },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseSecret, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const today = new Date();

  const previousMonth = new Date();
  previousMonth.setDate(today.getDate() - 30);

  const dateFrom = previousMonth.toISOString().split("T")[0];
  const dateTo = today.toISOString().split("T")[0];

  try {
    const response = await fetch(
      `https://api.football-data.org/v4/competitions/DED/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
      {
        headers: {
          "X-Auth-Token": footballToken,
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

    const finishedMatches = (data.matches || []).filter(
      (match: any) =>
        match.status === "FINISHED" &&
        match.score?.fullTime?.home !== null &&
        match.score?.fullTime?.away !== null
    );

    let updatedPredictions = 0;

    for (const match of finishedMatches) {
      const actualHomeScore = match.score.fullTime.home;
      const actualAwayScore = match.score.fullTime.away;

      const { data: updated, error } = await supabase
        .from("predictions")
        .update({
          actual_home_score: actualHomeScore,
          actual_away_score: actualAwayScore,
        })
        .eq("match_id", match.id)
        .is("actual_home_score", null)
        .select("id");

      if (error) {
        console.error(error);
        continue;
      }

      updatedPredictions += updated?.length || 0;
    }

    return NextResponse.json({
      success: true,
      finishedMatches: finishedMatches.length,
      updatedPredictions,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Er ging iets mis bij het verwerken van de uitslagen.",
      },
      { status: 500 }
    );
  }
}
