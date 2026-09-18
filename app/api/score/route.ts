import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Prediction = {
  id: number;
  match_id: number;
  home_score: number;
  away_score: number;
};

function getOutcome(home: number, away: number): "home" | "draw" | "away" {
  if (home > away) return "home";
  if (home < away) return "away";
  return "draw";
}

function calculatePoints(predictedHome: number, predictedAway: number, actualHome: number, actualAway: number) {
  const predictedOutcome = getOutcome(predictedHome, predictedAway);
  const actualOutcome = getOutcome(actualHome, actualAway);
  if (predictedOutcome !== actualOutcome) return 0;
  const maximumPoints = 10 + (actualHome + actualAway) * 2;
  const goalDifference = Math.abs(predictedHome - actualHome) + Math.abs(predictedAway - actualAway);
  return Math.max(2, maximumPoints - goalDifference * 2);
}

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (!cronSecret || authorization !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Niet toegestaan." }, { status: 401 });
  }

  const footballToken = process.env.FOOTBALL_DATA_API_TOKEN;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecret = process.env.SUPABASE_SECRET_KEY;

  if (!footballToken || !supabaseUrl || !supabaseSecret) {
    return NextResponse.json({ error: "Server environment variables ontbreken." }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseSecret, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  try {
    const { data: pendingPredictions, error: predictionsError } = await supabase
      .from("predictions")
      .select("id, match_id, home_score, away_score")
      .is("actual_home_score", null)
      .not("match_id", "is", null);

    if (predictionsError) {
      console.error(predictionsError);
      return NextResponse.json({ error: "Openstaande voorspellingen konden niet worden geladen." }, { status: 500 });
    }

    const predictions = (pendingPredictions || []) as Prediction[];
    const uniqueMatchIds = [...new Set(predictions.map((prediction) => prediction.match_id))];

    let checkedMatches = 0;
    let finishedMatches = 0;
    let updatedPredictions = 0;
    let unfinishedMatches = 0;

    const results: Array<{
      matchId: number;
      status: "finished" | "not-finished" | "error";
      predictionsUpdated?: number;
      score?: string;
      error?: string;
    }> = [];

    for (const matchId of uniqueMatchIds) {
      try {
        const footballResponse = await fetch(`https://api.football-data.org/v4/matches/${matchId}`, {
          headers: { "X-Auth-Token": footballToken },
          cache: "no-store",
        });

        checkedMatches++;

        if (!footballResponse.ok) {
          const errorText = await footballResponse.text();
          console.error(`Football-data fout voor wedstrijd ${matchId}:`, footballResponse.status, errorText);
          results.push({ matchId, status: "error", error: `Football-data status ${footballResponse.status}` });
          continue;
        }

        const match = await footballResponse.json();

        if (match.status !== "FINISHED") {
          unfinishedMatches++;
          results.push({ matchId, status: "not-finished" });
          continue;
        }

        const actualHomeScore = match.score?.fullTime?.home;
        const actualAwayScore = match.score?.fullTime?.away;

        if (typeof actualHomeScore !== "number" || typeof actualAwayScore !== "number") {
          results.push({ matchId, status: "error", error: "Geen geldige einduitslag ontvangen." });
          continue;
        }

        finishedMatches++;
        const matchPredictions = predictions.filter((prediction) => prediction.match_id === matchId);
        let updatedForMatch = 0;

        for (const prediction of matchPredictions) {
          const points = calculatePoints(
            prediction.home_score,
            prediction.away_score,
            actualHomeScore,
            actualAwayScore
          );

          const { error: updateError } = await supabase
            .from("predictions")
            .update({
              actual_home_score: actualHomeScore,
              actual_away_score: actualAwayScore,
              points,
            })
            .eq("id", prediction.id);

          if (updateError) {
            console.error(`Voorspelling ${prediction.id} kon niet worden bijgewerkt:`, updateError);
            continue;
          }

          updatedForMatch++;
          updatedPredictions++;
        }

        results.push({
          matchId,
          status: "finished",
          predictionsUpdated: updatedForMatch,
          score: `${actualHomeScore}-${actualAwayScore}`,
        });
      } catch (matchError) {
        console.error(`Fout bij wedstrijd ${matchId}:`, matchError);
        results.push({
          matchId,
          status: "error",
          error: "Onverwachte fout bij het controleren van de wedstrijd.",
        });
      }
    }

    return NextResponse.json({
      success: true,
      openPredictions: predictions.length,
      uniqueMatches: uniqueMatchIds.length,
      checkedMatches,
      finishedMatches,
      unfinishedMatches,
      updatedPredictions,
      results,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Er ging iets mis bij het verwerken van de uitslagen." },
      { status: 500 }
    );
  }
}
