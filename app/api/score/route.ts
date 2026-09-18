import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const competitions = [
  "DED",
  "PL",
  "PD",
  "BL1",
  "SA",
  "FL1",
  "PPL",
  "CL",
];

export async function GET() {
  const footballToken =
    process.env.FOOTBALL_DATA_API_TOKEN;

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseSecret =
    process.env.SUPABASE_SECRET_KEY;

  if (
    !footballToken ||
    !supabaseUrl ||
    !supabaseSecret
  ) {
    return NextResponse.json(
      {
        error:
          "Server environment variables ontbreken.",
      },
      { status: 500 }
    );
  }

  const supabase = createClient(
    supabaseUrl,
    supabaseSecret,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  const today = new Date();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(
    today.getDate() - 7
  );

  const dateFrom =
    sevenDaysAgo
      .toISOString()
      .split("T")[0];

  const dateTo =
    today
      .toISOString()
      .split("T")[0];

  let totalFinishedMatches = 0;
  let totalUpdatedPredictions = 0;

  const competitionResults: Array<{
    competition: string;
    finishedMatches: number;
    updatedPredictions: number;
    success: boolean;
    error?: string;
  }> = [];

  try {
    for (const competition of competitions) {
      try {
        const response = await fetch(
          `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&status=FINISHED`,
          {
            headers: {
              "X-Auth-Token": footballToken,
            },
            cache: "no-store",
          }
        );

        if (!response.ok) {
          const errorText =
            await response.text();

          console.error(
            `Football-data fout voor ${competition}:`,
            response.status,
            errorText
          );

          competitionResults.push({
            competition,
            finishedMatches: 0,
            updatedPredictions: 0,
            success: false,
            error: `Football-data status ${response.status}`,
          });

          continue;
        }

        const data = await response.json();

        const finishedMatches = (
          data.matches || []
        ).filter(
          (match: any) =>
            match.status === "FINISHED" &&
            typeof match.score?.fullTime
              ?.home === "number" &&
            typeof match.score?.fullTime
              ?.away === "number"
        );

        let updatedForCompetition = 0;

        for (const match of finishedMatches) {
          const actualHomeScore =
            match.score.fullTime.home;

          const actualAwayScore =
            match.score.fullTime.away;

          const {
            data: updated,
            error,
          } = await supabase
            .from("predictions")
            .update({
              actual_home_score:
                actualHomeScore,
              actual_away_score:
                actualAwayScore,
            })
            .eq("match_id", match.id)
            .is(
              "actual_home_score",
              null
            )
            .select("id");

          if (error) {
            console.error(
              `Fout bij wedstrijd ${match.id}:`,
              error
            );

            continue;
          }

          updatedForCompetition +=
            updated?.length || 0;
        }

        totalFinishedMatches +=
          finishedMatches.length;

        totalUpdatedPredictions +=
          updatedForCompetition;

        competitionResults.push({
          competition,
          finishedMatches:
            finishedMatches.length,
          updatedPredictions:
            updatedForCompetition,
          success: true,
        });
      } catch (competitionError) {
        console.error(
          `Fout bij competitie ${competition}:`,
          competitionError
        );

        competitionResults.push({
          competition,
          finishedMatches: 0,
          updatedPredictions: 0,
          success: false,
          error:
            "Onverwachte fout bij competitie.",
        });
      }
    }

    return NextResponse.json({
      success: true,
      checkedFrom: dateFrom,
      checkedTo: dateTo,
      competitionsChecked:
        competitions.length,
      finishedMatches:
        totalFinishedMatches,
      updatedPredictions:
        totalUpdatedPredictions,
      competitions:
        competitionResults,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Er ging iets mis bij het verwerken van de uitslagen.",
      },
      { status: 500 }
    );
  }
}
