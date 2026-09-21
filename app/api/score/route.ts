import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Prediction = {
  id: number;
  match_id: number;
  home_score: number;
  away_score: number;
  kickoff_at: string | null;
  competition_code: string | null;
};

type ZafronixCompetition = "EL" | "ECL";

type ZafronixMatch = {
  id: number;
  status: "FINISHED" | "SCHEDULED";
  homeScore: number | null;
  awayScore: number | null;
};

function getOutcome(
  home: number,
  away: number
): "home" | "draw" | "away" {
  if (home > away) return "home";
  if (home < away) return "away";
  return "draw";
}

function calculatePoints(
  predictedHome: number,
  predictedAway: number,
  actualHome: number,
  actualAway: number
) {
  const predictedOutcome = getOutcome(predictedHome, predictedAway);
  const actualOutcome = getOutcome(actualHome, actualAway);

  if (predictedOutcome !== actualOutcome) {
    return 0;
  }

  const maximumPoints =
    10 + (actualHome + actualAway) * 2;

  const goalDifference =
    Math.abs(predictedHome - actualHome) +
    Math.abs(predictedAway - actualAway);

  return Math.max(
    2,
    maximumPoints - goalDifference * 2
  );
}

function zafronixNumericId(
  competition: ZafronixCompetition,
  id: unknown,
  index: number
) {
  const text = String(id ?? "");
  const number = Number(
    text.match(/(\d+)$/)?.[1] ?? index + 1
  );

  return (
    (competition === "EL" ? 300000000 : 848000000) +
    number
  );
}

function zafronixStatus(item: any): "FINISHED" | "SCHEDULED" {
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

/**
 * Haalt per competitie in één keer alle Zafronix-wedstrijden op.
 *
 * BELANGRIJK VOOR DE GRATIS ZAFRONIX-LIMIET:
 * - De cron mag iedere 5 minuten blijven draaien.
 * - Next.js cachet deze externe response 6 uur.
 * - Daardoor veroorzaakt deze route per competitie maximaal ongeveer
 *   4 echte Zafronix-originrequests per dag.
 * - EL + ECL samen is dus ongeveer 8 per dag in het slechtste geval.
 *
 * We halen dus NIET per voorspelling of per wedstrijd apart Zafronix op.
 */
async function getZafronixMatches(
  competition: ZafronixCompetition
): Promise<ZafronixMatch[]> {
  const apiKey = process.env.ZAFRONIX_API_KEY;

  if (!apiKey) {
    throw new Error("ZAFRONIX_API_KEY ontbreekt in Vercel.");
  }

  const endpoint =
    competition === "EL"
      ? "https://api.zafronix.com/uefa/europaleague/v1/matches?season=2026"
      : "https://api.zafronix.com/uefa/conferenceleague/v1/matches?season=2026";

  const response = await fetch(endpoint, {
    headers: {
      "X-API-Key": apiKey,
      Accept: "application/json",
    },
    next: {
      revalidate: 21600, // 6 uur
    },
  });

  const rawText = await response.text();

  let payload: any;

  try {
    payload = JSON.parse(rawText);
  } catch {
    throw new Error(
      `Zafronix gaf voor ${competition} geen geldige JSON terug.`
    );
  }

  if (!response.ok) {
    console.error(
      `Zafronix fout voor ${competition}:`,
      response.status,
      payload
    );

    throw new Error(
      `Zafronix status ${response.status} voor ${competition}.`
    );
  }

  const sourceMatches = Array.isArray(payload?.data)
    ? payload.data
    : Array.isArray(payload)
      ? payload
      : [];

  return sourceMatches.map((item: any, index: number) => ({
    id: zafronixNumericId(
      competition,
      item?.id,
      index
    ),
    status: zafronixStatus(item),
    homeScore:
      typeof item?.homeScore === "number"
        ? item.homeScore
        : item?.homeScore !== null &&
            item?.homeScore !== undefined &&
            Number.isFinite(Number(item.homeScore))
          ? Number(item.homeScore)
          : null,
    awayScore:
      typeof item?.awayScore === "number"
        ? item.awayScore
        : item?.awayScore !== null &&
            item?.awayScore !== undefined &&
            Number.isFinite(Number(item.awayScore))
          ? Number(item.awayScore)
          : null,
  }));
}

export async function GET(request: Request) {
  // Beveiliging voor cron-job.org / Vercel Cron
  const cronSecret = process.env.CRON_SECRET;
  const authorization = request.headers.get("authorization");

  if (
    !cronSecret ||
    authorization !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json(
      { error: "Niet toegestaan." },
      { status: 401 }
    );
  }

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

  try {
    const now = new Date();

    // Alleen voorspellingen ophalen die nog geen einduitslag hebben.
    // competition_code is nu nodig om football-data en Zafronix
    // van elkaar te kunnen scheiden.
    const {
      data: pendingPredictions,
      error: predictionsError,
    } = await supabase
      .from("predictions")
      .select(
        "id, match_id, home_score, away_score, kickoff_at, competition_code"
      )
      .is("actual_home_score", null)
      .not("match_id", "is", null);

    if (predictionsError) {
      console.error(predictionsError);

      return NextResponse.json(
        {
          error:
            "Openstaande voorspellingen konden niet worden geladen.",
        },
        { status: 500 }
      );
    }

    const allPredictions =
      (pendingPredictions || []) as Prediction[];

    /*
     * Normale voorspellingen:
     * - kickoff_at bestaat
     * - datum is geldig
     * - wedstrijd is al begonnen
     *
     * Herstelgevallen:
     * - kickoff_at ontbreekt of is ongeldig
     * - match_id bestaat wel
     *
     * Voor football-data blijven herstelgevallen automatisch werken.
     * EL/ECL met ontbrekende kickoff_at worden niet blind als toekomstig
     * gezien; ze mogen wel tegen de Zafronix-dataset worden gecontroleerd.
     */
    const predictionsToCheck =
      allPredictions.filter((prediction) => {
        if (!prediction.kickoff_at) {
          return true;
        }

        const kickoff = new Date(prediction.kickoff_at);

        if (Number.isNaN(kickoff.getTime())) {
          return true;
        }

        return kickoff.getTime() <= now.getTime();
      });

    const skippedFuturePredictions =
      allPredictions.length -
      predictionsToCheck.length;

    const predictionsMissingKickoff =
      allPredictions.filter((prediction) => {
        if (!prediction.kickoff_at) {
          return true;
        }

        const kickoff = new Date(prediction.kickoff_at);
        return Number.isNaN(kickoff.getTime());
      }).length;

    // Zafronix-wedstrijden apart houden.
    const zafronixPredictions =
      predictionsToCheck.filter(
        (prediction) =>
          prediction.competition_code === "EL" ||
          prediction.competition_code === "ECL"
      );

    // Alles behalve EL/ECL blijft exact via football-data lopen.
    const footballPredictions =
      predictionsToCheck.filter(
        (prediction) =>
          prediction.competition_code !== "EL" &&
          prediction.competition_code !== "ECL"
      );

    const uniqueFootballMatchIds = [
      ...new Set(
        footballPredictions.map(
          (prediction) => prediction.match_id
        )
      ),
    ];

    let checkedMatches = 0;
    let finishedMatches = 0;
    let unfinishedMatches = 0;
    let updatedPredictions = 0;

    let footballDataMatchesChecked = 0;
    let zafronixMatchesChecked = 0;
    let zafronixApiDatasetsLoaded = 0;

    const results: Array<{
      matchId: number;
      provider: "football-data" | "zafronix";
      competition?: string | null;
      status:
        | "finished"
        | "not-finished"
        | "error";
      predictionsUpdated?: number;
      score?: string;
      error?: string;
    }> = [];

    // ------------------------------------------------
    // 1. BESTAANDE COMPETITIES VIA FOOTBALL-DATA
    // ------------------------------------------------
    for (const matchId of uniqueFootballMatchIds) {
      try {
        const footballResponse =
          await fetch(
            `https://api.football-data.org/v4/matches/${matchId}`,
            {
              headers: {
                "X-Auth-Token": footballToken,
              },
              cache: "no-store",
            }
          );

        checkedMatches++;
        footballDataMatchesChecked++;

        if (!footballResponse.ok) {
          const errorText =
            await footballResponse.text();

          console.error(
            `Football-data fout voor wedstrijd ${matchId}:`,
            footballResponse.status,
            errorText
          );

          results.push({
            matchId,
            provider: "football-data",
            status: "error",
            error:
              `Football-data status ${footballResponse.status}`,
          });

          continue;
        }

        const match =
          await footballResponse.json();

        // Als football-data de juiste aftraptijd teruggeeft,
        // herstellen we ontbrekende/ongeldige kickoff_at-waarden.
        const apiKickoff =
          typeof match.utcDate === "string"
            ? match.utcDate
            : null;

        if (apiKickoff) {
          const predictionsForKickoffRepair =
            footballPredictions.filter(
              (prediction) => {
                if (
                  prediction.match_id !== matchId
                ) {
                  return false;
                }

                if (!prediction.kickoff_at) {
                  return true;
                }

                const kickoff = new Date(
                  prediction.kickoff_at
                );

                return Number.isNaN(
                  kickoff.getTime()
                );
              }
            );

          for (
            const prediction
            of predictionsForKickoffRepair
          ) {
            const { error: kickoffUpdateError } =
              await supabase
                .from("predictions")
                .update({
                  kickoff_at: apiKickoff,
                })
                .eq("id", prediction.id);

            if (kickoffUpdateError) {
              console.error(
                `Kickoff van voorspelling ${prediction.id} kon niet worden hersteld:`,
                kickoffUpdateError
              );
            }
          }
        }

        if (match.status !== "FINISHED") {
          unfinishedMatches++;

          results.push({
            matchId,
            provider: "football-data",
            status: "not-finished",
          });

          continue;
        }

        const actualHomeScore =
          match.score?.fullTime?.home;

        const actualAwayScore =
          match.score?.fullTime?.away;

        if (
          typeof actualHomeScore !== "number" ||
          typeof actualAwayScore !== "number"
        ) {
          results.push({
            matchId,
            provider: "football-data",
            status: "error",
            error:
              "Geen geldige einduitslag ontvangen.",
          });

          continue;
        }

        finishedMatches++;

        const matchPredictions =
          footballPredictions.filter(
            (prediction) =>
              prediction.match_id === matchId
          );

        let updatedForMatch = 0;

        for (const prediction of matchPredictions) {
          const points = calculatePoints(
            prediction.home_score,
            prediction.away_score,
            actualHomeScore,
            actualAwayScore
          );

          const { error: updateError } =
            await supabase
              .from("predictions")
              .update({
                actual_home_score:
                  actualHomeScore,
                actual_away_score:
                  actualAwayScore,
                points,
                ...(apiKickoff
                  ? { kickoff_at: apiKickoff }
                  : {}),
              })
              .eq("id", prediction.id);

          if (updateError) {
            console.error(
              `Voorspelling ${prediction.id} kon niet worden bijgewerkt:`,
              updateError
            );

            continue;
          }

          updatedForMatch++;
          updatedPredictions++;
        }

        results.push({
          matchId,
          provider: "football-data",
          status: "finished",
          predictionsUpdated:
            updatedForMatch,
          score:
            `${actualHomeScore}-${actualAwayScore}`,
        });
      } catch (matchError) {
        console.error(
          `Fout bij football-data wedstrijd ${matchId}:`,
          matchError
        );

        results.push({
          matchId,
          provider: "football-data",
          status: "error",
          error:
            "Onverwachte fout bij het controleren van de wedstrijd.",
        });
      }
    }

    // ------------------------------------------------
    // 2. EUROPA LEAGUE + CONFERENCE LEAGUE VIA ZAFRONIX
    // ------------------------------------------------
    for (const competition of ["EL", "ECL"] as const) {
      const competitionPredictions =
        zafronixPredictions.filter(
          (prediction) =>
            prediction.competition_code === competition
        );

      if (competitionPredictions.length === 0) {
        continue;
      }

      let zafronixMatches: ZafronixMatch[];

      try {
        zafronixMatches =
          await getZafronixMatches(competition);

        zafronixApiDatasetsLoaded++;
      } catch (zafronixError) {
        console.error(
          `Zafronix dataset ${competition} kon niet worden geladen:`,
          zafronixError
        );

        const uniqueIds = [
          ...new Set(
            competitionPredictions.map(
              (prediction) => prediction.match_id
            )
          ),
        ];

        for (const matchId of uniqueIds) {
          results.push({
            matchId,
            provider: "zafronix",
            competition,
            status: "error",
            error:
              `Zafronix ${competition} kon niet worden geladen.`,
          });
        }

        continue;
      }

      const matchesById =
        new Map<number, ZafronixMatch>(
          zafronixMatches.map(
            (match) => [match.id, match]
          )
        );

      const uniqueMatchIds = [
        ...new Set(
          competitionPredictions.map(
            (prediction) => prediction.match_id
          )
        ),
      ];

      for (const matchId of uniqueMatchIds) {
        checkedMatches++;
        zafronixMatchesChecked++;

        const match =
          matchesById.get(matchId);

        if (!match) {
          results.push({
            matchId,
            provider: "zafronix",
            competition,
            status: "error",
            error:
              "Wedstrijd niet gevonden in de Zafronix-dataset.",
          });

          continue;
        }

        if (
          match.status !== "FINISHED" ||
          typeof match.homeScore !== "number" ||
          typeof match.awayScore !== "number"
        ) {
          unfinishedMatches++;

          results.push({
            matchId,
            provider: "zafronix",
            competition,
            status: "not-finished",
          });

          continue;
        }

        const actualHomeScore =
          match.homeScore;

        const actualAwayScore =
          match.awayScore;

        finishedMatches++;

        const matchPredictions =
          competitionPredictions.filter(
            (prediction) =>
              prediction.match_id === matchId
          );

        let updatedForMatch = 0;

        for (const prediction of matchPredictions) {
          const points = calculatePoints(
            prediction.home_score,
            prediction.away_score,
            actualHomeScore,
            actualAwayScore
          );

          const { error: updateError } =
            await supabase
              .from("predictions")
              .update({
                actual_home_score:
                  actualHomeScore,
                actual_away_score:
                  actualAwayScore,
                points,
              })
              .eq("id", prediction.id);

          if (updateError) {
            console.error(
              `Zafronix-voorspelling ${prediction.id} kon niet worden bijgewerkt:`,
              updateError
            );

            continue;
          }

          updatedForMatch++;
          updatedPredictions++;
        }

        results.push({
          matchId,
          provider: "zafronix",
          competition,
          status: "finished",
          predictionsUpdated:
            updatedForMatch,
          score:
            `${actualHomeScore}-${actualAwayScore}`,
        });
      }
    }

    return NextResponse.json({
      success: true,

      openPredictions:
        allPredictions.length,

      skippedPredictions:
        skippedFuturePredictions,

      predictionsMissingKickoff,

      predictionsToCheck:
        predictionsToCheck.length,

      uniqueMatches:
        new Set(
          predictionsToCheck.map(
            (prediction) => prediction.match_id
          )
        ).size,

      checkedMatches,
      finishedMatches,
      unfinishedMatches,
      updatedPredictions,

      providers: {
        footballDataMatchesChecked,
        zafronixMatchesChecked,
        zafronixApiDatasetsLoaded,
        zafronixCacheSeconds: 21600,
      },

      results,
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
