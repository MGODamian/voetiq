"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [ajaxHome, setAjaxHome] = useState("");
  const [ajaxAway, setAjaxAway] = useState("");
  const [feyenoordHome, setFeyenoordHome] = useState("");
  const [feyenoordAway, setFeyenoordAway] = useState("");

  const [message, setMessage] = useState("");

  const savePrediction = async (
    matchName: string,
    homeScore: string,
    awayScore: string
  ) => {
    const home = Number(homeScore);
    const away = Number(awayScore);

    if (
      homeScore === "" ||
      awayScore === "" ||
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0 ||
      home > 20 ||
      away > 20
    ) {
      setMessage("Vul een geldige uitslag in (0 t/m 20).");
      return;
    }

    const { error } = await supabase.from("predictions").insert({
      player_name: "Gast",
      match_name: matchName,
      home_score: home,
      away_score: away,
    });

    if (error) {
      console.error(error);
      setMessage("Er ging iets mis met opslaan.");
      return;
    }

    setMessage("Voorspelling opgeslagen!");
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
          padding: "18px 20px",
          position: "relative",
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

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "transparent",
              border: "none",
              color: "white",
              fontSize: "30px",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        </div>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "70px",
              right: "20px",
              background: "white",
              borderRadius: "12px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.2)",
              overflow: "hidden",
              width: "200px",
              zIndex: 10,
            }}
          >
            <a
              href="/"
              style={{
                display: "block",
                padding: "15px",
                color: "#111",
                textDecoration: "none",
              }}
            >
              🏠 Home
            </a>

            <a
              href="/wedstrijden"
              style={{
                display: "block",
                padding: "15px",
                color: "#111",
                textDecoration: "none",
              }}
            >
              ⚽ Wedstrijden
            </a>

            <a
              href="/ranglijst"
              style={{
                display: "block",
                padding: "15px",
                color: "#111",
                textDecoration: "none",
              }}
            >
              🏆 Ranglijst
            </a>
          </div>
        )}
      </header>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "60px 20px",
        }}
      >
        <h2
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          Voetbal Voorspellen
        </h2>

        <p
          style={{
            fontSize: "20px",
            color: "#666",
            marginBottom: "40px",
          }}
        >
          Voorspel. Scoor. Win.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "25px",
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "25px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <p style={{ color: "#777" }}>Eredivisie</p>

            <h3 style={{ fontSize: "25px" }}>Ajax 🆚 PSV</h3>

            <p style={{ color: "#777" }}>Voorspel de eindstand</p>

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
                placeholder="Ajax"
                value={ajaxHome}
                onChange={(e) => setAjaxHome(e.target.value)}
                style={{
                  width: "80px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              />

              <span>-</span>

              <input
                type="number"
                min="0"
                max="20"
                placeholder="PSV"
                value={ajaxAway}
                onChange={(e) => setAjaxAway(e.target.value)}
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
              onClick={() =>
                savePrediction("Ajax - PSV", ajaxHome, ajaxAway)
              }
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

          <div
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "25px",
              boxShadow: "0 5px 20px rgba(0,0,0,0.08)",
            }}
          >
            <p style={{ color: "#777" }}>Eredivisie</p>

            <h3 style={{ fontSize: "25px" }}>Feyenoord 🆚 AZ</h3>

            <p style={{ color: "#777" }}>Voorspel de eindstand</p>

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
                placeholder="Feyenoord"
                value={feyenoordHome}
                onChange={(e) => setFeyenoordHome(e.target.value)}
                style={{
                  width: "80px",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  fontSize: "18px",
                  textAlign: "center",
                }}
              />

              <span>-</span>

              <input
                type="number"
                min="0"
                max="20"
                placeholder="AZ"
                value={feyenoordAway}
                onChange={(e) => setFeyenoordAway(e.target.value)}
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
              onClick={() =>
                savePrediction(
                  "Feyenoord - AZ",
                  feyenoordHome,
                  feyenoordAway
                )
              }
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
      </section>
    </main>
  );
}
