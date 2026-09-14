"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Match = {
  id: number;
  utcDate: string;
  status: string;
  homeTeam: {
    name: string;
  };
  awayTeam: {
    name: string;
  };
  competition: {
    name: string;
  };
};

export default function Wedstrijden() {
  const [playerName, setPlayerName] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [predictions, setPredictions] = useState<
    Record<number, { home: string; away: string }>
  >({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  async function loadMatches() {
    try {
      const response = await fetch("/api/matches");

      if (!response.ok) {
        throw new Error("Kon wedstrijden niet ophalen");
      }

      const data = await response.json();

      const upcomingMatches = (data.matches || [])
        .filter(
          (match: Match) =>
            match.status === "SCHEDULED" ||
            match.status === "TIMED"
        )
        .sort(
          (a: Match, b: Match) =>
            new Date(a.utcDate).getTime() -
            new Date(b.utcDate).getTime()
        );

      setMatches(upcomingMatches);
    } catch (error) {
      console.error(error);
      setMessage("De wedstrijden konden niet worden opgehaald.");
    } finally {
      setLoading(false);
    }
  }

  const updatePrediction = (
    matchId: number,
    type: "home" | "away",
    value: string
  ) => {
    setPredictions((current) => ({
      ...current,
      [matchId]: {
        home: current[matchId]?.home || "",
        away: current[matchId]?.away || "",
        [type]: value,
      },
    }));
  };

  const savePrediction = async (match: Match) => {
    if (!playerName.trim()) {
      setMessage("Vul eerst je spelersnaam in.");
      return;
    }

    const prediction = predictions[match.id];

    if (!prediction || prediction.home === "" || prediction.away === "") {
      setMessage("Vul eerst een volledige uitslag in.");
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
      setMessage("Vul een geldige uitslag in van 0 t/m 20.");
      return;
    }

    const matchName = `${match.homeTeam.name} - ${match.awayTeam.name}`;

    const { error } = await supabase.from("predictions").insert({
      player_name: playerName.trim(),
      match_id: match.id,
      match_name: matchName,
      home_score: home,
      away_score: away,
    });

    if (error) {
      console.error(error);
      setMessage("Er ging iets mis met opslaan.");
      return;
    }

    setMessage(`Voorspelling opgeslagen voor ${matchName}!`);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7f6",
        color: "#111",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <header
        style={{
          background: "#0b8f4d",
          color: "white",
          padding: "20px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1 style={{ margin: 0 }}>VoetIQ</h1>

          <nav style={{ display: "flex", gap: "20px" }}>
            <a
              href="/"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Home
            </a>

            <a
              href="/wedstrijden"
              style={{
                color: "white",
                textDecoration: "none",
                fontWeight: "bold",
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
        </div>
      </header>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "50px 20px",
        }}
      >
        <h2
          style={{
            fontSize: "36px",
            marginBottom: "10px",
          }}
        >
          Wedstrijden
        </h2>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Voorspel de uitslag en verdien punten.
        </p>

        <div style={{ marginBottom: "35px" }}>
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            Jouw spelersnaam
          </label>

          <input
            type="text"
            placeholder="Bijvoorbeeld Damian"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            style={{
              width: "100%",
              maxWidth: "350px",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "16px",
            }}
          />
        </div>

        {loading && (
          <p style={{ color: "#666" }}>
            Wedstrijden laden...
          </p>
        )}

        {!loading && matches.length === 0 && (
          <div
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "16px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            Er zijn momenteel geen komende Eredivisie-wedstrijden
            beschikbaar.
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          {matches.map((match) => {
            const prediction = predictions[match.id] || {
              home: "",
              away: "",
            };

            const date = new Date(match.utcDate);

            return (
              <div
                key={match.id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "25px",
                  boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
                }}
              >
                <p
                  style={{
                    color: "#777",
                    marginTop: 0,
                  }}
                >
                  {match.competition.name}
                </p>

                <p
                  style={{
                    color: "#888",
                    fontSize: "14px",
                  }}
                >
                  {date.toLocaleDateString("nl-NL", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  om{" "}
                  {date.toLocaleTimeString("nl-NL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                <h3
                  style={{
                    fontSize: "22px",
                    marginTop: "18px",
                  }}
                >
                  {match.homeTeam.name} 🆚{" "}
                  {match.awayTeam.name}
                </h3>

                <p style={{ color: "#777" }}>
                  Voorspel de eindstand
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <input
                    type="number"
                    min="0"
                    max="20"
                    placeholder="Thuis"
                    value={prediction.home}
                    onChange={(e) =>
                      updatePrediction(
                        match.id,
                        "home",
                        e.target.value
                      )
                    }
                    style={{
                      width: "80px",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  />

                  <span style={{ fontSize: "20px" }}>-</span>

                  <input
                    type="number"
                    min="0"
                    max="20"
                    placeholder="Uit"
                    value={prediction.away}
                    onChange={(e) =>
                      updatePrediction(
                        match.id,
                        "away",
                        e.target.value
                      )
                    }
                    style={{
                      width: "80px",
                      padding: "12px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                      fontSize: "18px",
                      textAlign: "center",
                    }}
                  />
                </div>

                <button
                  onClick={() => savePrediction(match)}
                  style={{
                    marginTop: "20px",
                    width: "100%",
                    padding: "13px",
                    background: "#0b8f4d",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                >
                  Voorspelling opslaan
                </button>
              </div>
            );
          })}
        </div>

        {message && (
          <p
            style={{
              marginTop: "30px",
              padding: "15px",
              background: "#e8f7ef",
              borderRadius: "10px",
              color: "#08763e",
              fontWeight: "bold",
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            marginTop: "40px",
            fontSize: "13px",
            color: "#888",
          }}
        >
          Data provided by football-data.org
        </p>
      </section>
    </main>
  );
}
