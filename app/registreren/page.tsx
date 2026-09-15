"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegistrerenPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const cleanUsername = username.trim();
    const cleanEmail = email.trim();

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanUsername ||
      !cleanEmail ||
      !password
    ) {
      setErrorMessage("Vul alle velden in.");
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage(
        "Je moet akkoord gaan met de Algemene voorwaarden en het Privacybeleid."
      );
      return;
    }

    if (cleanUsername.length < 3) {
      setErrorMessage("Je gebruikersnaam moet minimaal 3 tekens bevatten.");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setErrorMessage(
        "Je gebruikersnaam mag alleen letters, cijfers en underscores bevatten."
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Je wachtwoord moet minimaal 8 tekens bevatten.");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            first_name: cleanFirstName,
            last_name: cleanLastName,
            username: cleanUsername,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setErrorMessage("Er bestaat al een account met dit e-mailadres.");
        } else {
          setErrorMessage(error.message);
        }

        setLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage("Account kon niet worden aangemaakt.");
        setLoading(false);
        return;
      }

      if (!data.session) {
        setRegistered(true);
        setLoading(false);
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      setErrorMessage("Er ging iets mis. Probeer het opnieuw.");
      setLoading(false);
    }
  }

  if (registered) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top, rgba(46,230,129,0.10), transparent 35%), #020e09",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 20px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            textAlign: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display: "block",
              color: "white",
              textDecoration: "none",
              fontSize: "32px",
              fontWeight: 900,
              marginBottom: "30px",
            }}
          >
            Voet<span style={{ color: "#2ee681" }}>IQ</span>
          </Link>

          <div
            style={{
              background:
                "linear-gradient(145deg, rgba(8,36,24,0.98), rgba(4,21,13,0.98))",
              border: "1px solid rgba(75,255,153,0.13)",
              borderRadius: "22px",
              padding: "35px 30px",
              boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                fontSize: "48px",
                marginBottom: "15px",
              }}
            >
              📧
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "28px",
                fontWeight: 900,
              }}
            >
              Controleer je e-mail
            </h1>

            <p
              style={{
                margin: "15px 0 0",
                color: "#9fb6a8",
                fontSize: "15px",
                lineHeight: 1.6,
              }}
            >
              We hebben een bevestigingslink gestuurd naar:
            </p>

            <p
              style={{
                margin: "10px 0 20px",
                color: "#2ee681",
                fontWeight: 800,
                wordBreak: "break-word",
              }}
            >
              {email}
            </p>

            <p
              style={{
                margin: 0,
                color: "#789183",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              Klik op de link in de e-mail om je account te bevestigen.
              Daarna kun je inloggen en beginnen met voorspellen.
            </p>

            <Link
              href="/inloggen"
              style={{
                display: "block",
                marginTop: "25px",
                padding: "13px",
                borderRadius: "11px",
                background: "#2ee681",
                color: "#03150b",
                textDecoration: "none",
                fontWeight: 900,
              }}
            >
              Naar inloggen
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, rgba(46,230,129,0.10), transparent 35%), #020e09",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            color: "white",
            textDecoration: "none",
            fontSize: "32px",
            fontWeight: 900,
            marginBottom: "30px",
          }}
        >
          Voet<span style={{ color: "#2ee681" }}>IQ</span>
        </Link>

        <div
          style={{
            background:
              "linear-gradient(145deg, rgba(8,36,24,0.98), rgba(4,21,13,0.98))",
            border: "1px solid rgba(75,255,153,0.13)",
            borderRadius: "22px",
            padding: "30px",
            boxShadow: "0 25px 80px rgba(0,0,0,0.35)",
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 900,
            }}
          >
            Account aanmaken
          </h1>

          <p
            style={{
              margin: "8px 0 26px",
              color: "#9fb6a8",
              fontSize: "14px",
            }}
          >
            Maak gratis een account en begin met voorspellen.
          </p>

          <form onSubmit={handleRegister}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                <label style={labelStyle}>Voornaam</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Voornaam"
                  autoComplete="given-name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Achternaam</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Achternaam"
                  autoComplete="family-name"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>Gebruikersnaam</label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Bijv. AjaxFan1907"
                maxLength={20}
                style={inputStyle}
              />

              <p
                style={{
                  margin: "7px 0 0",
                  color: "#789183",
                  fontSize: "12px",
                }}
              >
                Dit is de naam die andere spelers op VoetIQ zien.
              </p>
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>E-mailadres</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jij@email.nl"
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>Wachtwoord</label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimaal 8 tekens"
                  autoComplete="new-password"
                  style={{
                    ...inputStyle,
                    paddingRight: "52px",
                  }}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#8fa79a",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                marginTop: "20px",
                color: "#a9bbb2",
                fontSize: "13px",
                lineHeight: 1.5,
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                style={{
                  width: "17px",
                  height: "17px",
                  marginTop: "2px",
                  flexShrink: 0,
                  accentColor: "#2ee681",
                  cursor: "pointer",
                }}
              />

              <span>
                Ik ga akkoord met de{" "}
                <Link
                  href="/voorwaarden"
                  target="_blank"
                  style={{
                    color: "#2ee681",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Algemene voorwaarden
                </Link>{" "}
                en het{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  style={{
                    color: "#2ee681",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  Privacybeleid
                </Link>
                .
              </span>
            </label>

            {errorMessage && (
              <div
                style={{
                  marginTop: "18px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  background: "rgba(255,70,70,0.08)",
                  border: "1px solid rgba(255,70,70,0.18)",
                  color: "#ff9b9b",
                  fontSize: "13px",
                }}
              >
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "22px",
                padding: "14px 18px",
                border: "none",
                borderRadius: "12px",
                background: loading ? "#247a4b" : "#2ee681",
                color: "#03150b",
                fontSize: "15px",
                fontWeight: 900,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Account aanmaken..." : "Account aanmaken"}
            </button>
          </form>

          <div
            style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              textAlign: "center",
              color: "#8fa79a",
              fontSize: "14px",
            }}
          >
            Heb je al een account?{" "}
            <Link
              href="/inloggen"
              style={{
                color: "#2ee681",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              Inloggen
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  color: "#dcebe2",
  fontSize: "13px",
  fontWeight: 800,
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "13px 14px",
  borderRadius: "11px",
  border: "1px solid rgba(75,255,153,0.12)",
  background: "rgba(255,255,255,0.045)",
  color: "white",
  outline: "none",
  fontSize: "14px",
};
