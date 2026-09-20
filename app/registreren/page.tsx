  "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Translation = {
  createAccount: string;
  subtitle: string;
  firstName: string;
  lastName: string;
  username: string;
  usernamePlaceholder: string;
  usernameHelp: string;
  email: string;
  emailPlaceholder: string;
  password: string;
  passwordPlaceholder: string;
  agreePrefix: string;
  terms: string;
  agreeMiddle: string;
  privacy: string;
  creating: string;
  create: string;
  alreadyAccount: string;
  login: string;
  fillAll: string;
  acceptTerms: string;
  usernameLength: string;
  usernameCharacters: string;
  passwordLength: string;
  emailExists: string;
  accountFailed: string;
  genericError: string;
  checkEmail: string;
  confirmationSent: string;
  confirmationInstruction: string;
  goToLogin: string;
};

const ui: Record<LanguageCode, Translation> = {
  nl: {
    createAccount: "Account aanmaken",
    subtitle: "Maak gratis een account en begin met voorspellen.",
    firstName: "Voornaam",
    lastName: "Achternaam",
    username: "Gebruikersnaam",
    usernamePlaceholder: "Bijv. AjaxFan1907",
    usernameHelp: "Dit is de naam die andere spelers op VoetIQ zien.",
    email: "E-mailadres",
    emailPlaceholder: "jij@email.nl",
    password: "Wachtwoord",
    passwordPlaceholder: "Minimaal 8 tekens",
    agreePrefix: "Ik ga akkoord met de",
    terms: "Algemene voorwaarden",
    agreeMiddle: "en het",
    privacy: "Privacybeleid",
    creating: "Account aanmaken...",
    create: "Account aanmaken",
    alreadyAccount: "Heb je al een account?",
    login: "Inloggen",
    fillAll: "Vul alle velden in.",
    acceptTerms:
      "Je moet akkoord gaan met de Algemene voorwaarden en het Privacybeleid.",
    usernameLength:
      "Je gebruikersnaam moet minimaal 3 tekens bevatten.",
    usernameCharacters:
      "Je gebruikersnaam mag alleen letters, cijfers en underscores bevatten.",
    passwordLength:
      "Je wachtwoord moet minimaal 8 tekens bevatten.",
    emailExists:
      "Er bestaat al een account met dit e-mailadres.",
    accountFailed: "Account kon niet worden aangemaakt.",
    genericError: "Er ging iets mis. Probeer het opnieuw.",
    checkEmail: "Controleer je e-mail",
    confirmationSent: "We hebben een bevestigingslink gestuurd naar:",
    confirmationInstruction:
      "Klik op de link in de e-mail om je account te bevestigen. Daarna kun je inloggen en beginnen met voorspellen.",
    goToLogin: "Naar inloggen",
  },

  en: {
    createAccount: "Create account",
    subtitle: "Create a free account and start predicting.",
    firstName: "First name",
    lastName: "Last name",
    username: "Username",
    usernamePlaceholder: "E.g. AjaxFan1907",
    usernameHelp: "This is the name other players will see on VoetIQ.",
    email: "Email address",
    emailPlaceholder: "you@email.com",
    password: "Password",
    passwordPlaceholder: "At least 8 characters",
    agreePrefix: "I agree to the",
    terms: "Terms and Conditions",
    agreeMiddle: "and the",
    privacy: "Privacy Policy",
    creating: "Creating account...",
    create: "Create account",
    alreadyAccount: "Already have an account?",
    login: "Log in",
    fillAll: "Please fill in all fields.",
    acceptTerms:
      "You must agree to the Terms and Conditions and Privacy Policy.",
    usernameLength:
      "Your username must contain at least 3 characters.",
    usernameCharacters:
      "Your username may only contain letters, numbers and underscores.",
    passwordLength:
      "Your password must contain at least 8 characters.",
    emailExists:
      "An account with this email address already exists.",
    accountFailed: "The account could not be created.",
    genericError: "Something went wrong. Please try again.",
    checkEmail: "Check your email",
    confirmationSent: "We sent a confirmation link to:",
    confirmationInstruction:
      "Click the link in the email to confirm your account. You can then log in and start making predictions.",
    goToLogin: "Go to login",
  },

  de: {
    createAccount: "Konto erstellen",
    subtitle: "Erstelle kostenlos ein Konto und beginne mit dem Tippen.",
    firstName: "Vorname",
    lastName: "Nachname",
    username: "Benutzername",
    usernamePlaceholder: "Z. B. AjaxFan1907",
    usernameHelp:
      "Diesen Namen sehen andere Spieler auf VoetIQ.",
    email: "E-Mail-Adresse",
    emailPlaceholder: "du@email.de",
    password: "Passwort",
    passwordPlaceholder: "Mindestens 8 Zeichen",
    agreePrefix: "Ich stimme den",
    terms: "Allgemeinen Geschäftsbedingungen",
    agreeMiddle: "und der",
    privacy: "Datenschutzerklärung",
    creating: "Konto wird erstellt...",
    create: "Konto erstellen",
    alreadyAccount: "Du hast bereits ein Konto?",
    login: "Anmelden",
    fillAll: "Fülle alle Felder aus.",
    acceptTerms:
      "Du musst den Allgemeinen Geschäftsbedingungen und der Datenschutzerklärung zustimmen.",
    usernameLength:
      "Dein Benutzername muss mindestens 3 Zeichen enthalten.",
    usernameCharacters:
      "Dein Benutzername darf nur Buchstaben, Zahlen und Unterstriche enthalten.",
    passwordLength:
      "Dein Passwort muss mindestens 8 Zeichen enthalten.",
    emailExists:
      "Es existiert bereits ein Konto mit dieser E-Mail-Adresse.",
    accountFailed: "Das Konto konnte nicht erstellt werden.",
    genericError:
      "Etwas ist schiefgelaufen. Versuche es erneut.",
    checkEmail: "Überprüfe deine E-Mails",
    confirmationSent:
      "Wir haben einen Bestätigungslink gesendet an:",
    confirmationInstruction:
      "Klicke auf den Link in der E-Mail, um dein Konto zu bestätigen. Danach kannst du dich anmelden und mit dem Tippen beginnen.",
    goToLogin: "Zur Anmeldung",
  },

  es: {
    createAccount: "Crear cuenta",
    subtitle:
      "Crea una cuenta gratis y empieza a hacer pronósticos.",
    firstName: "Nombre",
    lastName: "Apellido",
    username: "Nombre de usuario",
    usernamePlaceholder: "Ej. AjaxFan1907",
    usernameHelp:
      "Este es el nombre que verán los demás jugadores en VoetIQ.",
    email: "Correo electrónico",
    emailPlaceholder: "tu@email.es",
    password: "Contraseña",
    passwordPlaceholder: "Mínimo 8 caracteres",
    agreePrefix: "Acepto los",
    terms: "Términos y condiciones",
    agreeMiddle: "y la",
    privacy: "Política de privacidad",
    creating: "Creando cuenta...",
    create: "Crear cuenta",
    alreadyAccount: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
    fillAll: "Completa todos los campos.",
    acceptTerms:
      "Debes aceptar los Términos y condiciones y la Política de privacidad.",
    usernameLength:
      "Tu nombre de usuario debe tener al menos 3 caracteres.",
    usernameCharacters:
      "Tu nombre de usuario solo puede contener letras, números y guiones bajos.",
    passwordLength:
      "Tu contraseña debe tener al menos 8 caracteres.",
    emailExists:
      "Ya existe una cuenta con este correo electrónico.",
    accountFailed: "No se ha podido crear la cuenta.",
    genericError:
      "Algo ha salido mal. Inténtalo de nuevo.",
    checkEmail: "Comprueba tu correo electrónico",
    confirmationSent:
      "Hemos enviado un enlace de confirmación a:",
    confirmationInstruction:
      "Haz clic en el enlace del correo electrónico para confirmar tu cuenta. Después podrás iniciar sesión y empezar a hacer pronósticos.",
    goToLogin: "Ir a iniciar sesión",
  },

  fr: {
    createAccount: "Créer un compte",
    subtitle:
      "Créez gratuitement un compte et commencez à pronostiquer.",
    firstName: "Prénom",
    lastName: "Nom",
    username: "Nom d'utilisateur",
    usernamePlaceholder: "Ex. AjaxFan1907",
    usernameHelp:
      "C'est le nom que les autres joueurs verront sur VoetIQ.",
    email: "Adresse e-mail",
    emailPlaceholder: "vous@email.fr",
    password: "Mot de passe",
    passwordPlaceholder: "Au moins 8 caractères",
    agreePrefix: "J'accepte les",
    terms: "Conditions générales",
    agreeMiddle: "et la",
    privacy: "Politique de confidentialité",
    creating: "Création du compte...",
    create: "Créer un compte",
    alreadyAccount: "Vous avez déjà un compte ?",
    login: "Se connecter",
    fillAll: "Veuillez remplir tous les champs.",
    acceptTerms:
      "Vous devez accepter les Conditions générales et la Politique de confidentialité.",
    usernameLength:
      "Votre nom d'utilisateur doit contenir au moins 3 caractères.",
    usernameCharacters:
      "Votre nom d'utilisateur ne peut contenir que des lettres, des chiffres et des tirets bas.",
    passwordLength:
      "Votre mot de passe doit contenir au moins 8 caractères.",
    emailExists:
      "Un compte existe déjà avec cette adresse e-mail.",
    accountFailed: "Le compte n'a pas pu être créé.",
    genericError:
      "Une erreur s'est produite. Veuillez réessayer.",
    checkEmail: "Consultez votre e-mail",
    confirmationSent:
      "Nous avons envoyé un lien de confirmation à :",
    confirmationInstruction:
      "Cliquez sur le lien dans l'e-mail pour confirmer votre compte. Vous pourrez ensuite vous connecter et commencer à faire vos pronostics.",
    goToLogin: "Aller à la connexion",
  },

  it: {
    createAccount: "Crea account",
    subtitle:
      "Crea gratuitamente un account e inizia a fare pronostici.",
    firstName: "Nome",
    lastName: "Cognome",
    username: "Nome utente",
    usernamePlaceholder: "Es. AjaxFan1907",
    usernameHelp:
      "Questo è il nome che gli altri giocatori vedranno su VoetIQ.",
    email: "Indirizzo email",
    emailPlaceholder: "tu@email.it",
    password: "Password",
    passwordPlaceholder: "Almeno 8 caratteri",
    agreePrefix: "Accetto i",
    terms: "Termini e condizioni",
    agreeMiddle: "e la",
    privacy: "Politica sulla privacy",
    creating: "Creazione account...",
    create: "Crea account",
    alreadyAccount: "Hai già un account?",
    login: "Accedi",
    fillAll: "Compila tutti i campi.",
    acceptTerms:
      "Devi accettare i Termini e condizioni e la Politica sulla privacy.",
    usernameLength:
      "Il nome utente deve contenere almeno 3 caratteri.",
    usernameCharacters:
      "Il nome utente può contenere solo lettere, numeri e underscore.",
    passwordLength:
      "La password deve contenere almeno 8 caratteri.",
    emailExists:
      "Esiste già un account con questo indirizzo email.",
    accountFailed: "Impossibile creare l'account.",
    genericError:
      "Qualcosa è andato storto. Riprova.",
    checkEmail: "Controlla la tua email",
    confirmationSent:
      "Abbiamo inviato un link di conferma a:",
    confirmationInstruction:
      "Fai clic sul link nell'email per confermare il tuo account. Dopodiché potrai accedere e iniziare a fare pronostici.",
    goToLogin: "Vai al login",
  },

  pt: {
    createAccount: "Criar conta",
    subtitle:
      "Cria uma conta gratuita e começa a fazer previsões.",
    firstName: "Nome",
    lastName: "Apelido",
    username: "Nome de utilizador",
    usernamePlaceholder: "Ex. AjaxFan1907",
    usernameHelp:
      "Este é o nome que os outros jogadores verão no VoetIQ.",
    email: "Endereço de email",
    emailPlaceholder: "tu@email.pt",
    password: "Palavra-passe",
    passwordPlaceholder: "Mínimo de 8 caracteres",
    agreePrefix: "Aceito os",
    terms: "Termos e condições",
    agreeMiddle: "e a",
    privacy: "Política de privacidade",
    creating: "A criar conta...",
    create: "Criar conta",
    alreadyAccount: "Já tens uma conta?",
    login: "Iniciar sessão",
    fillAll: "Preenche todos os campos.",
    acceptTerms:
      "Tens de aceitar os Termos e condições e a Política de privacidade.",
    usernameLength:
      "O teu nome de utilizador deve ter pelo menos 3 caracteres.",
    usernameCharacters:
      "O teu nome de utilizador só pode conter letras, números e underscores.",
    passwordLength:
      "A tua palavra-passe deve ter pelo menos 8 caracteres.",
    emailExists:
      "Já existe uma conta com este endereço de email.",
    accountFailed: "Não foi possível criar a conta.",
    genericError:
      "Algo correu mal. Tenta novamente.",
    checkEmail: "Verifica o teu email",
    confirmationSent:
      "Enviámos um link de confirmação para:",
    confirmationInstruction:
      "Clica no link do email para confirmar a tua conta. Depois poderás iniciar sessão e começar a fazer previsões.",
    goToLogin: "Ir para o login",
  },
};

function isLanguageCode(value: string): value is LanguageCode {
  return ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value);
}

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
  const [language, setLanguage] = useState<LanguageCode>("nl");

  const t = ui[language];

  function getSafeRedirect() {
    if (typeof window === "undefined") {
      return "/";
    }

    const params = new URLSearchParams(window.location.search);
    const requestedRedirect = params.get("redirect");

    return requestedRedirect?.startsWith("/") &&
      !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/";
  }

  function getLoginHref() {
    const redirect = getSafeRedirect();

    return redirect === "/"
      ? "/inloggen"
      : `/inloggen?redirect=${encodeURIComponent(redirect)}`;
  }

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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

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
      setErrorMessage(t.fillAll);
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage(t.acceptTerms);
      return;
    }

    if (cleanUsername.length < 3) {
      setErrorMessage(t.usernameLength);
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(cleanUsername)) {
      setErrorMessage(t.usernameCharacters);
      return;
    }

    if (password.length < 8) {
      setErrorMessage(t.passwordLength);
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
        if (
          error.message
            .toLowerCase()
            .includes("already registered")
        ) {
          setErrorMessage(t.emailExists);
        } else {
          setErrorMessage(t.accountFailed);
        }

        setLoading(false);
        return;
      }

      if (!data.user) {
        setErrorMessage(t.accountFailed);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setRegistered(true);
        setLoading(false);
        return;
      }

      window.location.href = getSafeRedirect();
    } catch (error) {
      console.error(error);
      setErrorMessage(t.genericError);
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
            className="register-card confirmation-card"
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
              {t.checkEmail}
            </h1>

            <p
              style={{
                margin: "15px 0 0",
                color: "#9fb6a8",
                fontSize: "15px",
                lineHeight: 1.6,
              }}
            >
              {t.confirmationSent}
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
              {t.confirmationInstruction}
            </p>

            <Link
              href={getLoginHref()}
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
              {t.goToLogin}
            </Link>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 520px) {
            main {
              padding: 24px 14px !important;
            }

            .register-card {
              padding: 24px 18px !important;
            }
          }
        `}</style>
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
          className="register-card"
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
            {t.createAccount}
          </h1>

          <p
            style={{
              margin: "8px 0 26px",
              color: "#9fb6a8",
              fontSize: "14px",
            }}
          >
            {t.subtitle}
          </p>

          <form onSubmit={handleRegister}>
            <div
              className="name-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                <label style={labelStyle}>{t.firstName}</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={t.firstName}
                  autoComplete="given-name"
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>{t.lastName}</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={t.lastName}
                  autoComplete="family-name"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>{t.username}</label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.usernamePlaceholder}
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
                {t.usernameHelp}
              </p>
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>{t.email}</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.emailPlaceholder}
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            <div style={{ marginTop: "14px" }}>
              <label style={labelStyle}>{t.password}</label>

              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
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
                onChange={(e) =>
                  setAcceptedTerms(e.target.checked)
                }
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
                {t.agreePrefix}{" "}
                <Link
                  href="/voorwaarden"
                  target="_blank"
                  style={{
                    color: "#2ee681",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  {t.terms}
                </Link>{" "}
                {t.agreeMiddle}{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  style={{
                    color: "#2ee681",
                    fontWeight: 800,
                    textDecoration: "none",
                  }}
                >
                  {t.privacy}
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
              {loading ? t.creating : t.create}
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
            {t.alreadyAccount}{" "}

            <Link
              href={getLoginHref()}
              style={{
                color: "#2ee681",
                fontWeight: 800,
                textDecoration: "none",
              }}
            >
              {t.login}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 520px) {
          main {
            padding: 24px 14px !important;
            align-items: flex-start !important;
          }

          .register-card {
            padding: 24px 18px !important;
          }

          .name-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
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
