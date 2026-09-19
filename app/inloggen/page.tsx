"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Translation = {
  welcome: string;
  subtitle1: string;
  subtitle2: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  remember: string;
  missingFields: string;
  loginFailed: string;
  loggingIn: string;
  login: string;
  noAccount: string;
  register: string;
  footer: string;
};

const ui: Record<LanguageCode, Translation> = {
  nl: {
    welcome: "Welkom terug",
    subtitle1: "Log in en ga verder met",
    subtitle2: "jouw voetbalvoorspellingen.",
    email: "E-mailadres",
    emailPlaceholder: "jij@email.nl",
    password: "Wachtwoord",
    passwordPlaceholder: "Je wachtwoord",
    remember: "Ingelogd blijven",
    missingFields: "Vul je e-mailadres en wachtwoord in.",
    loginFailed:
      "Inloggen mislukt. Controleer je e-mailadres en wachtwoord.",
    loggingIn: "Inloggen...",
    login: "INLOGGEN →",
    noAccount: "Nog geen account?",
    register: "Registreren",
    footer: "VoetIQ • Voorspel. Scoor punten.",
  },

  en: {
    welcome: "Welcome back",
    subtitle1: "Log in and continue with",
    subtitle2: "your football predictions.",
    email: "Email address",
    emailPlaceholder: "you@email.com",
    password: "Password",
    passwordPlaceholder: "Your password",
    remember: "Keep me signed in",
    missingFields: "Enter your email address and password.",
    loginFailed: "Login failed. Check your email address and password.",
    loggingIn: "Logging in...",
    login: "LOG IN →",
    noAccount: "Don't have an account yet?",
    register: "Register",
    footer: "VoetIQ • Predict. Score points.",
  },

  de: {
    welcome: "Willkommen zurück",
    subtitle1: "Melde dich an und fahre mit",
    subtitle2: "deinen Fußballtipps fort.",
    email: "E-Mail-Adresse",
    emailPlaceholder: "du@email.de",
    password: "Passwort",
    passwordPlaceholder: "Dein Passwort",
    remember: "Angemeldet bleiben",
    missingFields: "Gib deine E-Mail-Adresse und dein Passwort ein.",
    loginFailed:
      "Anmeldung fehlgeschlagen. Überprüfe deine E-Mail-Adresse und dein Passwort.",
    loggingIn: "Anmelden...",
    login: "ANMELDEN →",
    noAccount: "Noch kein Konto?",
    register: "Registrieren",
    footer: "VoetIQ • Tippen. Punkte sammeln.",
  },

  es: {
    welcome: "Bienvenido de nuevo",
    subtitle1: "Inicia sesión y continúa con",
    subtitle2: "tus pronósticos de fútbol.",
    email: "Correo electrónico",
    emailPlaceholder: "tu@email.es",
    password: "Contraseña",
    passwordPlaceholder: "Tu contraseña",
    remember: "Mantener la sesión iniciada",
    missingFields: "Introduce tu correo electrónico y contraseña.",
    loginFailed:
      "No se pudo iniciar sesión. Comprueba tu correo electrónico y contraseña.",
    loggingIn: "Iniciando sesión...",
    login: "INICIAR SESIÓN →",
    noAccount: "¿Aún no tienes una cuenta?",
    register: "Registrarse",
    footer: "VoetIQ • Pronostica. Gana puntos.",
  },

  fr: {
    welcome: "Bon retour",
    subtitle1: "Connectez-vous et continuez",
    subtitle2: "vos pronostics de football.",
    email: "Adresse e-mail",
    emailPlaceholder: "vous@email.fr",
    password: "Mot de passe",
    passwordPlaceholder: "Votre mot de passe",
    remember: "Rester connecté",
    missingFields: "Saisissez votre adresse e-mail et votre mot de passe.",
    loginFailed:
      "Échec de la connexion. Vérifiez votre adresse e-mail et votre mot de passe.",
    loggingIn: "Connexion...",
    login: "SE CONNECTER →",
    noAccount: "Pas encore de compte ?",
    register: "S'inscrire",
    footer: "VoetIQ • Pronostiquez. Gagnez des points.",
  },

  it: {
    welcome: "Bentornato",
    subtitle1: "Accedi e continua con",
    subtitle2: "i tuoi pronostici calcistici.",
    email: "Indirizzo email",
    emailPlaceholder: "tu@email.it",
    password: "Password",
    passwordPlaceholder: "La tua password",
    remember: "Rimani connesso",
    missingFields: "Inserisci il tuo indirizzo email e la password.",
    loginFailed:
      "Accesso non riuscito. Controlla il tuo indirizzo email e la password.",
    loggingIn: "Accesso...",
    login: "ACCEDI →",
    noAccount: "Non hai ancora un account?",
    register: "Registrati",
    footer: "VoetIQ • Pronostica. Guadagna punti.",
  },

  pt: {
    welcome: "Bem-vindo de volta",
    subtitle1: "Inicia sessão e continua com",
    subtitle2: "as tuas previsões de futebol.",
    email: "Endereço de email",
    emailPlaceholder: "tu@email.pt",
    password: "Palavra-passe",
    passwordPlaceholder: "A tua palavra-passe",
    remember: "Manter sessão iniciada",
    missingFields: "Introduz o teu endereço de email e a palavra-passe.",
    loginFailed:
      "Não foi possível iniciar sessão. Verifica o teu email e a palavra-passe.",
    loggingIn: "A iniciar sessão...",
    login: "INICIAR SESSÃO →",
    noAccount: "Ainda não tens uma conta?",
    register: "Registar",
    footer: "VoetIQ • Prevê. Ganha pontos.",
  },
};

function isLanguageCode(value: string): value is LanguageCode {
  return ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value);
}

export default function Inloggen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("nl");

  const t = ui[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("voetiq-language");

    const initial: LanguageCode =
      saved && isLanguageCode(saved) ? saved : "nl";

    setLanguage(initial);
    document.documentElement.lang = initial;

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const next = customEvent.detail?.language;

      if (next && isLanguageCode(next)) {
        setLanguage(next);
        document.documentElement.lang = next;
      }
    }

    window.addEventListener(
      "voetiq-language-change",
      handleLanguageChange
    );

    return () =>
      window.removeEventListener(
        "voetiq-language-change",
        handleLanguageChange
      );
  }, []);

  async function login() {
    setMessage("");

    if (!email || !password) {
      setMessage(t.missingFields);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setMessage(t.loginFailed);
      return;
    }

    if (!rememberMe) {
      const authKeys = Object.keys(localStorage).filter(
        (key) =>
          key.startsWith("sb-") &&
          key.endsWith("-auth-token")
      );

      authKeys.forEach((key) => {
        localStorage.removeItem(key);
      });
    }

    setLoading(false);

    const params = new URLSearchParams(window.location.search);
    const requestedRedirect = params.get("redirect");
    const safeRedirect =
      requestedRedirect?.startsWith("/") &&
      !requestedRedirect.startsWith("//")
        ? requestedRedirect
        : "/";

    window.location.href = safeRedirect;
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -10%, rgba(0,190,90,0.25), transparent 35%), linear-gradient(135deg, #03150d 0%, #061f14 45%, #020806 100%)",
        color: "white",
        padding: "30px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
        }}
      >
        <a
          href="/"
          style={{
            display: "block",
            textAlign: "center",
            color: "white",
            textDecoration: "none",
            fontSize: "32px",
            fontWeight: 900,
            letterSpacing: "-1.5px",
            marginBottom: "25px",
          }}
        >
          Voet<span style={{ color: "#2ee681" }}>IQ</span>
        </a>

        <section
          style={{
            background: "rgba(7, 28, 19, 0.88)",
            border: "1px solid rgba(75,255,153,0.13)",
            borderRadius: "22px",
            padding: "28px",
            boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                fontSize: "42px",
                marginBottom: "8px",
              }}
            >
              ⚽
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "27px",
                letterSpacing: "-0.8px",
              }}
            >
              {t.welcome}
            </h1>

            <p
              style={{
                color: "#8fa69b",
                fontSize: "14px",
                lineHeight: 1.5,
                marginTop: "9px",
              }}
            >
              {t.subtitle1}
              <br />
              {t.subtitle2}
            </p>
          </div>

          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "7px",
              color: "#c5d3cd",
            }}
          >
            {t.email}
          </label>

          <input
            type="email"
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              marginBottom: "17px",
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "11px",
              color: "white",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <label
            style={{
              display: "block",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "7px",
              color: "#c5d3cd",
            }}
          >
            {t.password}
          </label>

          <input
            type="password"
            placeholder={t.passwordPlaceholder}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                login();
              }
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px",
              marginBottom: "12px",
              background: "rgba(0,0,0,0.25)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: "11px",
              color: "white",
              fontSize: "15px",
              outline: "none",
            }}
          />

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "9px",
              marginBottom: "18px",
              color: "#a9bbb2",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(event.target.checked)
              }
              style={{
                width: "17px",
                height: "17px",
                accentColor: "#2ee681",
                cursor: "pointer",
              }}
            />

            <span>{t.remember}</span>
          </label>

          {message && (
            <div
              style={{
                marginBottom: "16px",
                padding: "12px",
                borderRadius: "10px",
                background: "rgba(255,80,80,0.08)",
                border: "1px solid rgba(255,80,80,0.15)",
                color: "#ffaaaa",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {message}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "50px",
              border: "none",
              borderRadius: "11px",
              background: loading
                ? "#237c50"
                : "linear-gradient(135deg, #25d879, #0cae59)",
              color: "#02170c",
              fontSize: "14px",
              fontWeight: 900,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? t.loggingIn : t.login}
          </button>

          <div
            style={{
              textAlign: "center",
              marginTop: "20px",
              paddingTop: "18px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              color: "#71877d",
              fontSize: "13px",
            }}
          >
            {t.noAccount}{" "}

            <a
              href={
                typeof window !== "undefined" && window.location.search
                  ? `/registreren${window.location.search}`
                  : "/registreren"
              }
              style={{
                color: "#42e78e",
                textDecoration: "none",
                fontWeight: 800,
              }}
            >
              {t.register}
            </a>
          </div>
        </section>

        <p
          style={{
            textAlign: "center",
            color: "#53675e",
            fontSize: "11px",
            marginTop: "20px",
          }}
        >
          {t.footer}
        </p>
      </div>
    </main>
  );
}
