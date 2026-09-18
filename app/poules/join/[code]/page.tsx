"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../Navbar";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

const texts = {
  nl: {
    title: "Uitnodiging voor een poule",
    description: "Je bent uitgenodigd om mee te doen aan een VoetIQ-poule.",
    code: "Uitnodigingscode",
    join: "Deelnemen aan poule",
    joining: "Bezig met deelnemen...",
    login: "Log eerst in om deel te nemen",
    invalid: "Deze uitnodigingslink is ongeldig.",
    error: "Je kon niet deelnemen aan deze poule.",
    back: "Terug naar poules",
  },
  en: {
    title: "Pool invitation",
    description: "You've been invited to join a VoetIQ pool.",
    code: "Invitation code",
    join: "Join pool",
    joining: "Joining...",
    login: "Log in first to join",
    invalid: "This invitation link is invalid.",
    error: "You could not join this pool.",
    back: "Back to pools",
  },
  de: {
    title: "Einladung zur Tipprunde",
    description: "Du wurdest zu einer VoetIQ-Tipprunde eingeladen.",
    code: "Einladungscode",
    join: "Tipprunde beitreten",
    joining: "Beitritt läuft...",
    login: "Melde dich zuerst an",
    invalid: "Dieser Einladungslink ist ungültig.",
    error: "Du konntest dieser Tipprunde nicht beitreten.",
    back: "Zurück zu den Tipprunden",
  },
  es: {
    title: "Invitación al grupo",
    description: "Te han invitado a unirte a un grupo de VoetIQ.",
    code: "Código de invitación",
    join: "Unirse al grupo",
    joining: "Uniéndote...",
    login: "Inicia sesión para unirte",
    invalid: "Este enlace de invitación no es válido.",
    error: "No has podido unirte a este grupo.",
    back: "Volver a los grupos",
  },
  fr: {
    title: "Invitation à une ligue",
    description: "Vous avez été invité à rejoindre une ligue VoetIQ.",
    code: "Code d’invitation",
    join: "Rejoindre la ligue",
    joining: "Connexion...",
    login: "Connectez-vous pour participer",
    invalid: "Ce lien d’invitation n’est pas valide.",
    error: "Vous n’avez pas pu rejoindre cette ligue.",
    back: "Retour aux ligues",
  },
  it: {
    title: "Invito al gruppo",
    description: "Sei stato invitato a partecipare a un gruppo VoetIQ.",
    code: "Codice d’invito",
    join: "Unisciti al gruppo",
    joining: "Accesso...",
    login: "Accedi per partecipare",
    invalid: "Questo link d’invito non è valido.",
    error: "Non è stato possibile unirti al gruppo.",
    back: "Torna ai gruppi",
  },
  pt: {
    title: "Convite para um grupo",
    description: "Foste convidado para participar num grupo VoetIQ.",
    code: "Código de convite",
    join: "Entrar no grupo",
    joining: "A entrar...",
    login: "Inicia sessão para participar",
    invalid: "Este link de convite é inválido.",
    error: "Não foi possível entrar neste grupo.",
    back: "Voltar aos grupos",
  },
};

function isLanguageCode(value: string): value is LanguageCode {
  return ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value);
}

export default function JoinPoolPage() {
  const router = useRouter();

  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [code, setCode] = useState("");
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [joining, setJoining] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("voetiq-language");

    const initialLanguage: LanguageCode =
      savedLanguage && isLanguageCode(savedLanguage)
        ? savedLanguage
        : "nl";

    setLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const nextLanguage = customEvent.detail?.language;

      if (nextLanguage && isLanguageCode(nextLanguage)) {
        setLanguage(nextLanguage);
        document.documentElement.lang = nextLanguage;
      }
    }

    window.addEventListener(
      "voetiq-language-change",
      handleLanguageChange
    );

    const parts = window.location.pathname.split("/").filter(Boolean);
    const inviteCode = decodeURIComponent(parts[2] || "").toUpperCase();

    setCode(inviteCode);

    supabase.auth.getUser().then(({ data }) => {
      setLoggedIn(Boolean(data.user));
    });

    return () => {
      window.removeEventListener(
        "voetiq-language-change",
        handleLanguageChange
      );
    };
  }, []);

  const t = texts[language];

  async function joinPool() {
    if (!code) {
      setErrorMessage(t.invalid);
      return;
    }

    if (!loggedIn) {
      router.push(
        `/inloggen?redirect=${encodeURIComponent(
          `/poules/join/${code}`
        )}`
      );
      return;
    }

    setJoining(true);
    setErrorMessage("");

    const { data, error } = await supabase.rpc("join_pool", {
      code,
    });

    if (error) {
      console.error(error);
      setErrorMessage(t.error);
      setJoining(false);
      return;
    }

    if (!data) {
      setErrorMessage(t.invalid);
      setJoining(false);
      return;
    }

    router.push(`/poules/${data}`);
  }

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(180deg, #f4f7f5 0%, #eef4f0 100%)",
          padding: "60px 20px 100px",
        }}
      >
        <div
          style={{
            maxWidth: "620px",
            margin: "0 auto",
          }}
        >
          <button
            onClick={() => router.push("/poules")}
            style={{
              border: 0,
              background: "transparent",
              color: "#08783e",
              fontWeight: 800,
              cursor: "pointer",
              padding: 0,
              marginBottom: "24px",
            }}
          >
            ← {t.back}
          </button>

          <section
            style={{
              background: "white",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
              border: "1px solid #e1e9e4",
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, #0d3d27 0%, #062a1a 100%)",
                color: "white",
                padding: "38px 34px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "48px",
                  marginBottom: "15px",
                }}
              >
                🏆
              </div>

              <div
                style={{
                  color: "#61e89b",
                  fontSize: "13px",
                  fontWeight: 900,
                  letterSpacing: "1.5px",
                  marginBottom: "10px",
                }}
              >
                VOETIQ
              </div>

              <h1
                style={{
                  margin: 0,
                  fontSize: "31px",
                }}
              >
                {t.title}
              </h1>

              <p
                style={{
                  color: "#c8dfd2",
                  margin: "12px 0 0",
                  lineHeight: 1.6,
                }}
              >
                {t.description}
              </p>
            </div>

            <div
              style={{
                padding: "34px",
              }}
            >
              <div
                style={{
                  background: "#f3f8f5",
                  border: "1px solid #dfe9e3",
                  borderRadius: "14px",
                  padding: "18px",
                  textAlign: "center",
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    color: "#748078",
                    fontSize: "12px",
                    fontWeight: 800,
                    marginBottom: "7px",
                  }}
                >
                  {t.code}
                </div>

                <div
                  style={{
                    color: "#0d3d27",
                    fontSize: "25px",
                    fontWeight: 900,
                    letterSpacing: "1.5px",
                  }}
                >
                  {code || "—"}
                </div>
              </div>

              {errorMessage && (
                <div
                  style={{
                    background: "#fee2e2",
                    color: "#991b1b",
                    padding: "13px 15px",
                    borderRadius: "10px",
                    marginBottom: "18px",
                    fontWeight: 700,
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <button
                onClick={joinPool}
                disabled={joining || loggedIn === null}
                style={{
                  width: "100%",
                  border: 0,
                  borderRadius: "12px",
                  padding: "15px 18px",
                  background: "#08783e",
                  color: "white",
                  fontSize: "16px",
                  fontWeight: 900,
                  cursor:
                    joining || loggedIn === null
                      ? "default"
                      : "pointer",
                  opacity:
                    joining || loggedIn === null
                      ? 0.7
                      : 1,
                }}
              >
                {joining
                  ? t.joining
                  : loggedIn === false
                  ? `🔐 ${t.login}`
                  : `⚽ ${t.join} →`}
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
