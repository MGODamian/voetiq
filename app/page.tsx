"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Match = {
id: number;
utcDate: string;
status: string;
competition?: {
name: string;
};
homeTeam: {
name: string;
};
awayTeam: {
name: string;
};
};

export default function Home() {
const [matches, setMatches] = useState<Match[]>([]);
const [playerName, setPlayerName] = useState("");
const [predictions, setPredictions] = useState<
Record<number, { home: string; away: string }>

> ({});
> const [message, setMessage] = useState("");
> const [loading, setLoading] = useState(true);

useEffect(() => {
loadMatches();
}, []);

async function loadMatches() {
try {
const response = await fetch("/api/matches");
const data = await response.json();

```
  if (!response.ok) {
    throw new Error(data.error || "Kon wedstrijden niet laden.");
  }

  const upcomingMatches = (data.matches || [])
    .filter(
      (match: Match) =>
        match.status === "SCHEDULED" || match.status === "TIMED"
    )
    .sort(
      (a: Match, b: Match) =>
        new Date(a.utcDate).getTime() -
        new Date(b.utcDate).getTime()
    )
    .slice(0, 6);

  setMatches(upcomingMatches);
} catch (error) {
  console.error(error);
  setMessage("De wedstrijden konden niet worden geladen.");
} finally {
  setLoading(false);
}
```

}

function updatePrediction(
matchId: number,
type: "home" | "away",
value: string
) {
setPredictions((current) => {
const oldPrediction = current[matchId] || {
home: "",
away: "",
};

```
  return {
    ...current,
    [matchId]: {
      home: type === "home" ? value : oldPrediction.home,
      away: type === "away" ? value : oldPrediction.away,
    },
  };
});
```

}

async function savePrediction(match: Match) {
setMessage("");

```
if (!playerName.trim()) {
  setMessage("Vul eerst je naam in.");
  return;
}

const prediction = predictions[match.id];

if (!prediction?.home || !prediction?.away) {
  setMessage("Vul beide scores in.");
  return;
}

const home = Number(prediction.home);
const away = Number(prediction.away);

if (
  !Number.isInteger(home) ||
  !Number.isInteger(away) ||
  home < 0 ||
  away < 0 ||
  home > 20 ||
  away > 20
) {
  setMessage("Gebruik geldige scores tussen 0 en 20.");
  return;
}

if (
  match.status !== "SCHEDULED" &&
  match.status !== "TIMED"
) {
  setMessage(
    "Deze wedstrijd is al begonnen. Voorspellen kan niet meer."
  );
  return;
}

const matchName = `${match.homeTeam.name}-${match.awayTeam.name}`;

const { error } = await supabase
  .from("predictions")
  .insert({
    player_name: playerName.trim(),
    match_id: match.id,
    match_name: matchName,
    home_score: home,
    away_score: away,
  });

if (error) {
  console.error(error);

  if (error.code === "23505") {
    setMessage(
      "Je hebt al een voorspelling voor deze wedstrijd."
    );
    return;
  }

  setMessage(
    "Er ging iets mis bij het opslaan van je voorspelling."
  );
  return;
}

setMessage(
  `Voorspelling opgeslagen: ${match.homeTeam.name} ${home}-${away} ${match.awayTeam.name}`
);
```

}

return (
<main
style={{
minHeight: "100vh",
background: "#f5f7f6",
padding: "30px 20px",
}}
>
<div
style={{
maxWidth: "900px",
margin: "0 auto",
}}
>
<header
style={{
background: "#00843d",
color: "white",
padding: "20px",
borderRadius: "14px",
marginBottom: "25px",
}}
>
<h1 style={{ margin: 0 }}>VoetIQ</h1>

```
      <nav style={{ marginTop: "12px" }}>
        <a
          href="/"
          style={{
            color: "white",
            marginRight: "20px",
            textDecoration: "none",
          }}
        >
          Home
        </a>

        <a
          href="/wedstrijden"
          style={{
            color: "white",
            marginRight: "20px",
            textDecoration: "none",
          }}
        >
          Wedstrijden
        </a>

        <a
          href="/ranglijst"
          style={{
            color: "white",
            textDecoration: "none",
          }}
        >
          Ranglijst
        </a>
      </nav>
    </header>

    <section
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "14px",
        marginBottom: "20px",
      }}
    >
      <h2>Voorspel de wedstrijden ⚽</h2>

      <input
        type="text"
        placeholder="Jouw naam"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "350px",
          padding: "12px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "20px",
          fontSize: "16px",
        }}
      />

      {message && (
        <div
          style={{
            background: "#eef7f1",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {message}
        </div>
      )}
    </section>

    {loading && <p>Wedstrijden laden...</p>}

    {!loading && matches.length === 0 && (
      <p>Er zijn momenteel geen aankomende wedstrijden.</p>
    )}

    {matches.map((match) => {
      const prediction = predictions[match.id] || {
        home: "",
        away: "",
      };

      const matchDate = new Date(match.utcDate);

      return (
        <section
          key={match.id}
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "14px",
            marginBottom: "18px",
          }}
        >
          <p
            style={{
              marginTop: 0,
              color: "#666",
            }}
          >
            {match.competition?.name || "Voetbal"} •{" "}
            {matchDate.toLocaleDateString("nl-NL")} •{" "}
            {matchDate.toLocaleTimeString("nl-NL", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <h3>
            {match.homeTeam.name} – {match.awayTeam.name}
          </h3>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              marginTop: "15px",
            }}
          >
            <input
              type="number"
              min="0"
              max="20"
              value={prediction.home}
              onChange={(e) =>
                updatePrediction(
                  match.id,
                  "home",
                  e.target.value
                )
              }
              style={{
                width: "70px",
                padding: "10px",
                fontSize: "18px",
                textAlign: "center",
              }}
            />

            <span>-</span>

            <input
              type="number"
              min="0"
              max="20"
              value={prediction.away}
              onChange={(e) =>
                updatePrediction(
                  match.id,
                  "away",
                  e.target.value
                )
              }
              style={{
                width: "70px",
                padding: "10px",
                fontSize: "18px",
                textAlign: "center",
              }}
            />

            <button
              onClick={() => savePrediction(match)}
              style={{
                padding: "11px 16px",
                background: "#00843d",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Voorspel
            </button>
          </div>
        </section>
      );
    })}

    <p
      style={{
        textAlign: "center",
        color: "#777",
        fontSize: "13px",
        marginTop: "30px",
      }}
    >
      Data provided by football-data.org
    </p>
  </div>
</main>
```

);
}
