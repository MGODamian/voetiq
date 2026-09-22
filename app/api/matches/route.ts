import { NextResponse } from "next/server";

const FOOTBALL_DATA_COMPETITIONS = [
  "PL", "DED", "PD", "BL1", "SA", "FL1", "PPL", "CL",
];

const ZAFRONIX_COMPETITIONS = ["EL", "ECL"] as const;
const SPECIAL_COMPETITIONS = ["KNVB"] as const;

function formatDate(date: Date) {
  return date.toISOString().split("T")[0];
}

function zafronixNumericId(
  competition: "EL" | "ECL",
  id: unknown,
  index: number
) {
  const text = String(id ?? "");
  const number = Number(text.match(/(\d+)$/)?.[1] ?? index + 1);
  return (competition === "EL" ? 300000000 : 848000000) + number;
}

function zafronixStatus(item: any) {
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

function zafronixWinner(item: any) {
  if (
    item.homeScore === null ||
    item.homeScore === undefined ||
    item.awayScore === null ||
    item.awayScore === undefined
  ) {
    return null;
  }

  if (item.homeScore > item.awayScore) {
    return "HOME_TEAM";
  }

  if (item.awayScore > item.homeScore) {
    return "AWAY_TEAM";
  }

  return "DRAW";
}

/**
 * Officiële UEFA-aftraptijden voor de Conference League 2026/27.
 *
 * UEFA vermeldt 21:00 als standaardtijd.
 * Alleen afwijkende tijden worden hieronder vastgelegd.
 *
 * Zafronix levert alleen de datum en teams,
 * niet de kickoff-tijd.
 *
 * Key = YYYY-MM-DD|thuisteam
 */
const UEFA_CONFERENCE_SPECIAL_KICKOFFS: Record<string, string> = {
  // Speeldag 1 — 15 oktober 2026
  "2026-10-15|Lugano": "18:45",
  "2026-10-15|Hajduk Split": "18:45",
  "2026-10-15|Gent": "18:45",
  "2026-10-15|Egnatia": "18:45",
  "2026-10-15|KuPS": "18:45",
  "2026-10-15|Mjällby AIF": "18:45",
  "2026-10-15|Panathinaikos": "18:45",
  "2026-10-15|CSKA Sofia": "18:45",
  "2026-10-15|Riga": "18:45",
  "2026-10-15|Universitatea Craiova": "18:45",

  // Speeldag 2 — 22 oktober 2026
  "2026-10-22|Kairat": "16:30",
  "2026-10-22|Iberia 1999": "18:45",
  "2026-10-22|Nordsjælland": "18:45",
  "2026-10-22|Red Star Belgrade": "18:45",
  "2026-10-22|Jablonec": "18:45",
  "2026-10-22|Kauno Žalgiris": "18:45",
  "2026-10-22|Getafe": "18:45",
  "2026-10-22|Inter Escaldes": "18:45",
  "2026-10-22|Pafos": "18:45",
  "2026-10-22|Trabzonspor": "18:45",

  // Speeldag 3 — 5 november 2026
  "2026-11-05|AGF": "18:45",
  "2026-11-05|Atalanta": "18:45",
  "2026-11-05|Midtjylland": "18:45",
  "2026-11-05|Thun": "18:45",
  "2026-11-05|Red Star Belgrade": "18:45",
  "2026-11-05|KuPS": "18:45",
  "2026-11-05|Lincoln Red Imps": "18:45",
  "2026-11-05|Mjällby AIF": "18:45",
  "2026-11-05|Trabzonspor": "18:45",

  // Speeldag 4 — 26 november 2026
  "2026-11-26|Kairat": "16:30",
  "2026-11-26|Ajax": "18:45",
  "2026-11-26|Brighton & Hove Albion": "18:45",
  "2026-11-26|Iberia 1999": "18:45",
  "2026-11-26|Jablonec": "18:45",
  "2026-11-26|Kauno Žalgiris": "18:45",
  "2026-11-26|Heart of Midlothian": "18:45",
  "2026-11-26|Egnatia": "18:45",
  "2026-11-26|Pafos": "18:45",
  "2026-11-26|Brann": "18:45",

  // Speeldag 5 — 10 december 2026
  "2026-12-10|Kairat": "16:30",
  "2026-12-10|Copenhagen": "18:45",
  "2026-12-10|Iberia 1999": "18:45",
  "2026-12-10|Getafe": "18:45",
  "2026-12-10|KuPS": "18:45",
  "2026-12-10|Lincoln Red Imps": "18:45",
  "2026-12-10|Riga": "18:45",
  "2026-12-10|SC Freiburg": "18:45",
  "2026-12-10|Brann": "18:45",
  "2026-12-10|Trabzonspor": "18:45",
};

function getUefaConferenceKickoff(
  date: string,
  homeTeam: string
): string {
  return (
    UEFA_CONFERENCE_SPECIAL_KICKOFFS[
      `${date}|${homeTeam}`
    ] || "21:00"
  );
}

/**
 * Bepaalt automatisch de Nederlandse UTC-offset.
 *
 * Nederland gebruikt:
 * - UTC+2 tijdens zomertijd
 * - UTC+1 tijdens wintertijd
 *
 * Hierdoor worden bijvoorbeeld:
 * 15 oktober 2026 18:45 → 16:45 UTC
 * 15 oktober 2026 21:00 → 19:00 UTC
 *
 * En vanaf november:
 * 5 november 2026 18:45 → 17:45 UTC
 */
function getAmsterdamUtcOffset(date: string): number {
  const reference = new Date(`${date}T12:00:00Z`);

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Amsterdam",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(reference);

  const localHour = Number(
    parts.find((part) => part.type === "hour")?.value ?? "12"
  );

  let offset = localHour - 12;

  if (offset < 0) {
    offset += 24;
  }

  return offset;
}

function getUefaConferenceUtcDate(
  date: string,
  homeTeam: string
): string {
  const kickoff = getUefaConferenceKickoff(
    date,
    homeTeam
  );

  const [hours, minutes] = kickoff
    .split(":")
    .map(Number);

  const offset = getAmsterdamUtcOffset(date);

  let utcHours = hours - offset;
  let utcDate = date;

  if (utcHours < 0) {
    utcHours += 24;

    const previousDay = new Date(`${date}T12:00:00Z`);

    previousDay.setUTCDate(
      previousDay.getUTCDate() - 1
    );

    utcDate = previousDay
      .toISOString()
      .split("T")[0];
  }

  return `${utcDate}T${String(utcHours).padStart(
    2,
    "0"
  )}:${String(minutes).padStart(2, "0")}:00Z`;
}

async function getZafronixConferenceLeagueMatches(
  dateFrom: string,
  dateTo: string
) {
  const apiKey = process.env.ZAFRONIX_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ZAFRONIX_API_KEY ontbreekt in Vercel.",
      },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://api.zafronix.com/uefa/conferenceleague/v1/matches?season=2026",
    {
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      next: {
        revalidate: 7200,
      },
    }
  );

  const rawText = await response.text();

  let payload: any;

  try {
    payload = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      {
        error:
          "Zafronix gaf geen geldige JSON terug.",
        details: rawText,
      },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Zafronix fout",
        competition: "ECL",
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

  const filteredSourceMatches = sourceMatches.filter(
    (item: any) => {
      if (!item?.date) {
        return false;
      }

      return (
        item.date >= dateFrom &&
        item.date <= dateTo
      );
    }
  );

  const matches = filteredSourceMatches.map(
    (item: any, index: number) => ({
      id: zafronixNumericId(
        "ECL",
        item.id,
        index
      ),

      // Zafronix levert geen kickoff-tijd.
      // Gebruik daarom de officieel ingestelde
      // Conference League-tijden.
      utcDate: getUefaConferenceUtcDate(
        item.date,
        item.homeTeam || "Thuisteam"
      ),

      status: zafronixStatus(item),

      matchday:
        typeof item.matchday === "number"
          ? item.matchday
          : Number(item.matchday) ||
            undefined,

      stage:
        item.stage ||
        "league_phase",

      homeTeam: {
        id: null,
        name:
          item.homeTeam ||
          "Thuisteam",
        shortName:
          item.homeTeam ||
          "Thuisteam",
        tla: null,
        crest: null,
      },

      awayTeam: {
        id: null,
        name:
          item.awayTeam ||
          "Uitteam",
        shortName:
          item.awayTeam ||
          "Uitteam",
        tla: null,
        crest: null,
      },

      competition: {
        id: 848,
        name:
          "UEFA Conference League",
        code: "ECL",
      },

      score: {
        winner:
          zafronixWinner(item),

        duration: "REGULAR",

        fullTime: {
          home:
            item.homeScore ??
            null,
          away:
            item.awayScore ??
            null,
        },

        halfTime: {
          home: null,
          away: null,
        },
      },
    })
  );

  return NextResponse.json({
    competition: {
      id: 848,
      code: "ECL",
      name:
        "UEFA Conference League",
    },

    count: matches.length,

    matches,
  });
}


/**
 * UEFA Europa League 2026/27.
 * UEFA publiceert alle tijden als CET: standaard 21:00,
 * behalve de expliciet vermelde 18:45-wedstrijden.
 */
const UEFA_EUROPA_SPECIAL_KICKOFFS: Record<string, string> = {
  // Speeldag 1
  "2026-09-16|Ararat-Armenia": "18:45",
  "2026-09-16|Omonia": "18:45",
  "2026-09-17|OFI Crete": "18:45",
  "2026-09-17|Levski Sofia": "18:45",

  // Speeldag 2
  "2026-10-15|Sparta Praha": "18:45",
  "2026-10-15|AZ Alkmaar": "18:45",
  "2026-10-15|Salzburg": "18:45",
  "2026-10-15|Lech Poznań": "18:45",
  "2026-10-15|Celje": "18:45",
  "2026-10-15|Lyon": "18:45",
  "2026-10-15|Union SG": "18:45",
  "2026-10-15|Torreense": "18:45",

  // Speeldag 3
  "2026-10-22|Ararat-Armenia": "18:45",
  "2026-10-22|Ferencváros": "18:45",
  "2026-10-22|GNK Dinamo": "18:45",
  "2026-10-22|Juventus": "18:45",
  "2026-10-22|Lech Poznań": "18:45",
  "2026-10-22|OFI Crete": "18:45",
  "2026-10-22|Union SG": "18:45",
  "2026-10-22|Sturm Graz": "18:45",

  // Speeldag 4
  "2026-11-05|Milan": "18:45",
  "2026-11-05|Sparta Praha": "18:45",
  "2026-11-05|Crystal Palace": "18:45",
  "2026-11-05|Lillestrøm": "18:45",
  "2026-11-05|N.E.C. Nijmegen": "18:45",
  "2026-11-05|N.E.C.": "18:45",
  "2026-11-05|Levski Sofia": "18:45",
  "2026-11-05|Real Sociedad": "18:45",
  "2026-11-05|Anderlecht": "18:45",
  "2026-11-05|Rennes": "18:45",

  // Speeldag 5
  "2026-11-26|Viktoria Plzeň": "18:45",
  "2026-11-26|Beşiktaş": "18:45",
  "2026-11-26|Celta": "18:45",
  "2026-11-26|Olympiacos": "18:45",
  "2026-11-26|Salzburg": "18:45",

  // Speeldag 6
  "2026-12-10|Anderlecht": "18:45",
  "2026-12-10|Ararat-Armenia": "18:45",
  "2026-12-10|AZ Alkmaar": "18:45",
  "2026-12-10|Celta": "18:45",
  "2026-12-10|Jagiellonia": "18:45",
  "2026-12-10|Omonia": "18:45",
  "2026-12-10|Rennes": "18:45",

  // Speeldag 7
  "2027-01-21|Beşiktaş": "18:45",
  "2027-01-21|Ararat-Armenia": "18:45",
  "2027-01-21|Ferencváros": "18:45",
  "2027-01-21|Jagiellonia": "18:45",
  "2027-01-21|Lillestrøm": "18:45",
  "2027-01-21|N.E.C. Nijmegen": "18:45",
  "2027-01-21|N.E.C.": "18:45",
  "2027-01-21|Olympiacos": "18:45",
  "2027-01-21|Real Sociedad": "18:45",
  "2027-01-21|Sturm Graz": "18:45",
};

function getUefaEuropaKickoff(date: string, homeTeam: string): string {
  return UEFA_EUROPA_SPECIAL_KICKOFFS[`${date}|${homeTeam}`] || "21:00";
}

function getUefaEuropaUtcDate(date: string, homeTeam: string): string {
  const kickoff = getUefaEuropaKickoff(date, homeTeam);
  const [hours, minutes] = kickoff.split(":").map(Number);
  const offset = getAmsterdamUtcOffset(date);

  let utcHours = hours - offset;
  let utcDate = date;

  if (utcHours < 0) {
    utcHours += 24;
    const previousDay = new Date(`${date}T12:00:00Z`);
    previousDay.setUTCDate(previousDay.getUTCDate() - 1);
    utcDate = previousDay.toISOString().split("T")[0];
  }

  return `${utcDate}T${String(utcHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00Z`;
}

async function getZafronixEuropaLeagueMatches(
  dateFrom: string,
  dateTo: string
) {
  const apiKey = process.env.ZAFRONIX_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "ZAFRONIX_API_KEY ontbreekt in Vercel." },
      { status: 500 }
    );
  }

  const response = await fetch(
    "https://api.zafronix.com/uefa/europaleague/v1/matches?season=2026",
    {
      headers: {
        "X-API-Key": apiKey,
        Accept: "application/json",
      },
      next: { revalidate: 7200 },
    }
  );

  const rawText = await response.text();
  let payload: any;

  try {
    payload = JSON.parse(rawText);
  } catch {
    return NextResponse.json(
      { error: "Zafronix gaf geen geldige JSON terug.", details: rawText },
      { status: 502 }
    );
  }

  if (!response.ok) {
    return NextResponse.json(
      {
        error: "Zafronix fout",
        competition: "EL",
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

  const filteredSourceMatches = sourceMatches.filter((item: any) => {
    if (!item?.date) return false;
    return item.date >= dateFrom && item.date <= dateTo;
  });

  const matches = filteredSourceMatches.map((item: any, index: number) => {
    const suppliedDateTime =
      item.utcDate || item.kickoffUtc || item.kickoff || item.startTime || null;

    // Gebruik een echte volledige kickoff van Zafronix als die beschikbaar is.
    // Anders gebruiken we de door UEFA gepubliceerde Europa League-tijd.
    const utcDate =
      typeof suppliedDateTime === "string" && suppliedDateTime.includes("T")
        ? suppliedDateTime
        : getUefaEuropaUtcDate(
            item.date,
            item.homeTeam || "Thuisteam"
          );

    return {
      id: zafronixNumericId("EL", item.id, index),
      utcDate,
      status: zafronixStatus(item),
      matchday:
        typeof item.matchday === "number"
          ? item.matchday
          : Number(item.matchday) || undefined,
      stage: item.stage || item.stageNormalized || "league_phase",

      homeTeam: {
        id: null,
        name: item.homeTeam || "Thuisteam",
        shortName: item.homeTeam || "Thuisteam",
        tla: null,
        crest: null,
      },

      awayTeam: {
        id: null,
        name: item.awayTeam || "Uitteam",
        shortName: item.awayTeam || "Uitteam",
        tla: null,
        crest: null,
      },

      competition: {
        id: 3,
        name: "UEFA Europa League",
        code: "EL",
      },

      score: {
        winner: zafronixWinner(item),
        duration: "REGULAR",
        fullTime: {
          home: item.homeScore ?? null,
          away: item.awayScore ?? null,
        },
        halfTime: { home: null, away: null },
      },
    };
  });

  return NextResponse.json({
    competition: {
      id: 3,
      code: "EL",
      name: "UEFA Europa League",
    },
    count: matches.length,
    matches,
  });
}

function getKnvbSpecialMatches(
  dateFrom: string,
  dateTo: string
) {
  const sourceMatches = [
    // Dinsdag 22 september 2026 — tweede kwalificatieronde
    [92622001, "2026-09-22T18:00:00Z", "ACV", "Hoogeveen"],
    [92622002, "2026-09-22T18:00:00Z", "Eemdijk", "RBC"],
    [92622003, "2026-09-22T18:00:00Z", "EVV Echt", "Halsteren"],
    [92622004, "2026-09-22T18:00:00Z", "Excelsior '31", "AFC '34"],
    [92622005, "2026-09-22T18:00:00Z", "FC Rijnvogels", "VVSB"],
    [92622006, "2026-09-22T18:00:00Z", "Groene Ster", "AFC"],
    [92622007, "2026-09-22T18:00:00Z", "GVVV", "DVS '33 Ermelo"],
    [92622008, "2026-09-22T18:00:00Z", "HHC Hardenberg", "Barendrecht"],
    [92622009, "2026-09-22T18:00:00Z", "Kloetinge", "Achilles Veen"],
    [92622010, "2026-09-22T18:00:00Z", "Koninklijke HFC", "DOVO"],
    [92622011, "2026-09-22T18:00:00Z", "Noordwijk", "LAC Frisia 1883"],
    [92622012, "2026-09-22T18:00:00Z", "RKAV Volendam", "Spakenburg"],
    [92622013, "2026-09-22T18:00:00Z", "Sportlust '46", "Excelsior Maassluis"],
    [92622014, "2026-09-22T18:00:00Z", "Staphorst", "Genemuiden SC"],

    // Woensdag 23 september 2026 — tweede kwalificatieronde
    [92623001, "2026-09-23T18:00:00Z", "Germania", "Kozakken Boys"],
    [92623002, "2026-09-23T18:00:00Z", "IJsselmeervogels", "Gemert"],
    [92623003, "2026-09-23T18:00:00Z", "JOS Watergraafsmeer", "TEC"],
    [92623004, "2026-09-23T18:00:00Z", "Sparta Nijkerk", "UDI '19"],
    [92623005, "2026-09-23T18:00:00Z", "TOGB", "Rohda Raalte"],
    [92623006, "2026-09-23T18:00:00Z", "Zwaluwen", "Purmersteijn"],
  ] as const;

  const matches = sourceMatches
    .filter(([, utcDate]) => {
      const date = utcDate.slice(0, 10);
      return date >= dateFrom && date <= dateTo;
    })
    .map(([id, utcDate, homeTeam, awayTeam]) => ({
      id,
      utcDate,
      status: "SCHEDULED",
      matchday: 2,
      stage: "QUALIFICATION_ROUND_2",
      homeTeam: {
        id: null,
        name: homeTeam,
        shortName: homeTeam,
        tla: null,
        crest: null,
      },
      awayTeam: {
        id: null,
        name: awayTeam,
        shortName: awayTeam,
        tla: null,
        crest: null,
      },
      competition: {
        id: 926,
        name: "Eurojackpot KNVB Beker",
        code: "KNVB",
      },
      score: {
        winner: null,
        duration: "REGULAR",
        fullTime: {
          home: null,
          away: null,
        },
        halfTime: {
          home: null,
          away: null,
        },
      },
    }));

  return NextResponse.json({
    competition: {
      id: 926,
      code: "KNVB",
      name: "Eurojackpot KNVB Beker",
    },
    count: matches.length,
    matches,
  });
}


async function getFootballDataMatches(
  competition: string,
  dateFrom: string,
  dateTo: string
) {
  const token =
    process.env.FOOTBALL_DATA_API_TOKEN;

  if (!token) {
    return NextResponse.json(
      {
        error:
          "FOOTBALL_DATA_API_TOKEN ontbreekt.",
      },
      { status: 500 }
    );
  }

  const response = await fetch(
    `https://api.football-data.org/v4/competitions/${competition}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`,
    {
      headers: {
        "X-Auth-Token": token,
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    return NextResponse.json(
      {
        error:
          "Football-data API fout",
        competition,
        details: errorText,
      },
      { status: response.status }
    );
  }

  const data =
    await response.json();

  return NextResponse.json(data);
}

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const competition =
    searchParams.get(
      "competition"
    ) || "DED";

  const supportedCompetitions = [
    ...FOOTBALL_DATA_COMPETITIONS,
    ...ZAFRONIX_COMPETITIONS,
    ...SPECIAL_COMPETITIONS,
  ];

  if (
    !supportedCompetitions.includes(
      competition
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Deze competitie wordt niet ondersteund.",
      },
      { status: 400 }
    );
  }

  const today = new Date();

  const previousMonth =
    new Date(today);

  previousMonth.setDate(
    previousMonth.getDate() - 30
  );

  const nextMonth =
    new Date(today);

  nextMonth.setDate(
    nextMonth.getDate() + 30
  );

  const dateFrom =
    formatDate(previousMonth);

  const dateTo =
    formatDate(nextMonth);

  try {
    if (competition === "ECL") {
      return await getZafronixConferenceLeagueMatches(
        dateFrom,
        dateTo
      );
    }

    if (competition === "EL") {
      return await getZafronixEuropaLeagueMatches(
        dateFrom,
        dateTo
      );
    }

    if (competition === "KNVB") {
      return getKnvbSpecialMatches(
        dateFrom,
        dateTo
      );
    }

    return await getFootballDataMatches(
      competition,
      dateFrom,
      dateTo
    );
  } catch (error) {
    console.error(
      "Matches API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Er ging iets mis bij het ophalen van de wedstrijden.",
      },
      { status: 500 }
    );
  }
}
