import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publishableKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    const secretKey = process.env.SUPABASE_SECRET_KEY;
    const adminUserId = process.env.ADMIN_USER_ID;

    if (!supabaseUrl || !publishableKey || !secretKey || !adminUserId) {
      return NextResponse.json(
        { error: "Serverconfiguratie ontbreekt." },
        { status: 500 }
      );
    }

    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Niet ingelogd." },
        { status: 401 }
      );
    }

    const accessToken = authorization.slice(7);

    // Controleer de ingelogde gebruiker met de publieke Supabase-client.
    const authClient = createClient(supabaseUrl, publishableKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser(accessToken);

    if (userError || !user) {
      return NextResponse.json(
        { error: "Ongeldige sessie." },
        { status: 401 }
      );
    }

    // Alleen jouw account mag verder.
    if (user.id !== adminUserId) {
      return NextResponse.json(
        { error: "Geen toegang." },
        { status: 403 }
      );
    }

    // Pas NA de admincontrole gebruiken we de geheime server-key.
    const adminClient = createClient(supabaseUrl, secretKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });

    const { data: profiles, error: profilesError } = await adminClient
      .from("profiles")
      .select(
        "id, first_name, last_name, username, created_at, is_premium"
      )
      .order("created_at", { ascending: false });

    if (profilesError) {
      console.error("Admin profiles error:", profilesError);

      return NextResponse.json(
        { error: "Gebruikers konden niet worden opgehaald." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      users: profiles ?? [],
      total: profiles?.length ?? 0,
    });
  } catch (error) {
    console.error("Admin API error:", error);

    return NextResponse.json(
      { error: "Er ging iets mis op de server." },
      { status: 500 }
    );
  }
}
