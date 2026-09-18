import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const allowedCompetitions = [
  "PL",
  "DED",
  "PD",
  "BL1",
  "SA",
  "FL1",
  "PPL",
  "CL",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      accessToken,
      matchId,
      competition,
      homeScore,
      awayScore,
    } = body;

    if (
      !accessToken ||
      !matchId ||
      !competition ||
      homeScore === undefined ||
      awayScore === undefined
    ) {
      return NextResponse.json(
        { error: "Niet alle gegevens zijn ingevuld." },
        { status: 400 }
      );
    }

    if (!allowedCompetitions.includes(competition)) {
      return NextResponse.json(
        { error: "Ongeldige competitie." },
        { status: 400 }
      );
    }

    const home = Number(homeScore);
    const away = Number(awayScore);

    if (
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0 ||
      home > 20 ||
      away > 20
    ) {
      return NextResponse.json(
        { error: "Ongeldige voorspelling." },
        { status: 400 }
      );
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const supabasePublishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    const supabaseSecretKey =
      process.env.SUPABASE_SECRET_KEY;

    const footballToken =
      process.env.FOOTBALL_DATA_API_TOKEN;

    if (
      !supabaseUrl ||
      !supabasePublishableKey ||
      !supabaseSecretKey ||
      !footballToken
    ) {
      return NextResponse.json(
        { error: "Serverconfiguratie ontbreekt." },
        { status: 500 }
      );
    }

    // Client om te controleren welke gebruiker
    // bij het access token hoort.
    const authClient = createClient(
      supabaseUrl,
      supabasePublishableKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Je bent niet ingelogd." },
        { status: 401 }
      );
    }

    // Wedstrijd rechtstreeks controleren
    // bij football-data.
    const footballResponse = await fetch(
      `https://api.football-data.org/v4/matches/${matchId}`,
      {
        headers: {
          "X-Auth-Token": footballToken,
        },
        cache: "no-store",
      }
    );

    if (!footballResponse.ok) {
      console.error(
        "Football-data controle mislukt:",
        footballResponse.status
      );

      return NextResponse.json(
        {
          error:
            "De wedstrijd kon niet worden gecontroleerd.",
        },
        { status: 502 }
      );
    }

    const match = await footballResponse.json();

    if (
      !match.competition ||
      match.competition.code !== competition
    ) {
      return NextResponse.json(
        {
          error:
            "Wedstrijd en competitie komen niet overeen.",
        },
        { status: 400 }
      );
    }

    const kickoff = new Date(match.utcDate);

    if (Number.isNaN(kickoff.getTime())) {
      return NextResponse.json(
        {
          error:
            "De aftraptijd van deze wedstrijd is ongeldig.",
        },
        { status: 500 }
      );
    }

    // Deadline wordt altijd op de server gecontroleerd.
    if (kickoff.getTime() <= Date.now()) {
      return NextResponse.json(
        {
          error:
            "De wedstrijd is al begonnen. Je voorspelling staat op slot.",
        },
        { status: 403 }
      );
    }

    if (
      match.status !== "SCHEDULED" &&
      match.status !== "TIMED"
    ) {
      return NextResponse.json(
        {
          error:
            "Deze wedstrijd is niet meer beschikbaar om te voorspellen.",
        },
        { status: 403 }
      );
    }

    // Speelronde uit football-data.
    const matchday =
      typeof match.matchday === "number"
        ? match.matchday
        : null;

    // Secret/server client.
    // Deze key komt nooit in de browser terecht.
    const adminClient = createClient(
      supabaseUrl,
      supabaseSecretKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    const {
      data: profile,
      error: profileError,
    } = await adminClient
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(profileError);

      return NextResponse.json(
        {
          error:
            "Je profiel kon niet worden geladen.",
        },
        { status: 500 }
      );
    }

    const matchName =
      `${match.homeTeam.name} - ${match.awayTeam.name}`;

    const {
      data: existingPrediction,
      error: existingError,
    } = await adminClient
      .from("predictions")
      .select("id")
      .eq("user_id", user.id)
      .eq("match_id", matchId)
      .maybeSingle();

    if (existingError) {
      console.error(existingError);

      return NextResponse.json(
        {
          error:
            "Je bestaande voorspelling kon niet worden gecontroleerd.",
        },
        { status: 500 }
      );
    }

    // Bestaande voorspelling wijzigen.
    if (existingPrediction) {
      const { error: updateError } =
        await adminClient
          .from("predictions")
          .update({
            home_score: home,
            away_score: away,
            competition_code: competition,
            matchday: matchday,
          })
          .eq("id", existingPrediction.id)
          .eq("user_id", user.id);

      if (updateError) {
        console.error(updateError);

        return NextResponse.json(
          {
            error:
              "Je voorspelling kon niet worden gewijzigd.",
          },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        action: "updated",
        message:
          `Voorspelling gewijzigd: ` +
          `${match.homeTeam.name} ${home} - ${away} ${match.awayTeam.name}`,
      });
    }

    // Nieuwe voorspelling opslaan.
    const { error: insertError } =
      await adminClient
        .from("predictions")
        .insert({
          user_id: user.id,
          user_email: user.email || "",
          player_name:
            profile?.username || "Speler",
          match_id: matchId,
          match_name: matchName,
          home_score: home,
          away_score: away,
          competition_code: competition,
          matchday: matchday,
        });

    if (insertError) {
      console.error(insertError);

      return NextResponse.json(
        {
          error:
            "Je voorspelling kon niet worden opgeslagen.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action: "created",
      message:
        `Voorspelling opgeslagen: ` +
        `${match.homeTeam.name} ${home} - ${away} ${match.awayTeam.name}`,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Er ging iets mis bij het verwerken van je voorspelling.",
      },
      { status: 500 }
    );
  }
}
