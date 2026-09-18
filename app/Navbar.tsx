"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type NavbarTranslation = {
  home: string;
  matches: string;
  pools: string;
  leaderboard: string;
  howItWorks: string;
  profile: string;
  logout: string;
  login: string;
  playFree: string;
  language: string;
  openMenu: string;
};

const languages: {
  code: LanguageCode;
  flag: string;
  name: string;
  short: string;
}[] = [
  { code: "nl", flag: "🇳🇱", name: "Nederlands", short: "NL" },
  { code: "en", flag: "🇬🇧", name: "English", short: "EN" },
  { code: "de", flag: "🇩🇪", name: "Deutsch", short: "DE" },
  { code: "es", flag: "🇪🇸", name: "Español", short: "ES" },
  { code: "fr", flag: "🇫🇷", name: "Français", short: "FR" },
  { code: "it", flag: "🇮🇹", name: "Italiano", short: "IT" },
  { code: "pt", flag: "🇵🇹", name: "Português", short: "PT" },
];

const translations: Record<LanguageCode, NavbarTranslation> = {
  nl: {
    home: "Home",
    matches: "Wedstrijden",
    pools: "Poules",
    leaderboard: "Ranglijst",
    howItWorks: "Hoe werkt het?",
    profile: "Mijn profiel",
    logout: "Uitloggen",
    login: "Inloggen",
    playFree: "Speel gratis",
    language: "Taal",
    openMenu: "Menu openen",
  },
  en: {
    home: "Home",
    matches: "Matches",
    pools: "Pools",
    leaderboard: "Leaderboard",
    howItWorks: "How does it work?",
    profile: "My profile",
    logout: "Log out",
    login: "Log in",
    playFree: "Play for free",
    language: "Language",
    openMenu: "Open menu",
  },
  de: {
    home: "Startseite",
    matches: "Spiele",
    pools: "Tipprunden",
    leaderboard: "Rangliste",
    howItWorks: "Wie funktioniert es?",
    profile: "Mein Profil",
    logout: "Abmelden",
    login: "Anmelden",
    playFree: "Kostenlos spielen",
    language: "Sprache",
    openMenu: "Menü öffnen",
  },
  es: {
    home: "Inicio",
    matches: "Partidos",
    pools: "Grupos",
    leaderboard: "Clasificación",
    howItWorks: "¿Cómo funciona?",
    profile: "Mi perfil",
    logout: "Cerrar sesión",
    login: "Iniciar sesión",
    playFree: "Jugar gratis",
    language: "Idioma",
    openMenu: "Abrir menú",
  },
  fr: {
    home: "Accueil",
    matches: "Matchs",
    pools: "Ligues",
    leaderboard: "Classement",
    howItWorks: "Comment ça marche ?",
    profile: "Mon profil",
    logout: "Se déconnecter",
    login: "Se connecter",
    playFree: "Jouer gratuitement",
    language: "Langue",
    openMenu: "Ouvrir le menu",
  },
  it: {
    home: "Home",
    matches: "Partite",
    pools: "Gruppi",
    leaderboard: "Classifica",
    howItWorks: "Come funziona?",
    profile: "Il mio profilo",
    logout: "Esci",
    login: "Accedi",
    playFree: "Gioca gratis",
    language: "Lingua",
    openMenu: "Apri menu",
  },
  pt: {
    home: "Início",
    matches: "Jogos",
    pools: "Grupos",
    leaderboard: "Classificação",
    howItWorks: "Como funciona?",
    profile: "O meu perfil",
    logout: "Terminar sessão",
    login: "Iniciar sessão",
    playFree: "Jogar grátis",
    language: "Idioma",
    openMenu: "Abrir menu",
  },
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return languages.some((language) => language.code === value);
}

export default function Navbar() {
  const pathname = usePathname();

  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("nl");

  const languageRef = useRef<HTMLDivElement>(null);

  const t = translations[language];
  const currentLanguage =
    languages.find((item) => item.code === language) || languages[0];

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("voetiq-language");

    if (isLanguageCode(storedLanguage)) {
      setLanguage(storedLanguage);
      document.documentElement.lang = storedLanguage;
    } else {
      document.documentElement.lang = "nl";
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      setMobileOpen(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setLanguageOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setLoggedIn(!!user);
  }

  async function handleLogout() {
    await supabase.auth.signOut({ scope: "local" });
    setMobileOpen(false);
    window.location.href = "/";
  }

  function changeLanguage(newLanguage: LanguageCode) {
    setLanguage(newLanguage);
    setLanguageOpen(false);
    window.localStorage.setItem("voetiq-language", newLanguage);
    document.documentElement.lang = newLanguage;

    window.dispatchEvent(
      new CustomEvent("voetiq-language-change", {
        detail: { language: newLanguage },
      })
    );
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="voetiq-header">
        <div className="voetiq-navbar">
          <Link href="/" className="voetiq-logo">
            Voet<span>IQ</span>
          </Link>

          <nav className="desktop-nav">
            <NavLink href="/" label={t.home} active={isActive("/")} />

            <NavLink
              href="/wedstrijden"
              label={t.matches}
              active={isActive("/wedstrijden")}
            />

            <NavLink
              href="/poules"
              label={t.pools}
              active={isActive("/poules")}
            />

            <NavLink
              href="/ranglijst"
              label={t.leaderboard}
              active={isActive("/ranglijst")}
            />

            <NavLink
              href="/hoe-werkt-het"
              label={t.howItWorks}
              active={isActive("/hoe-werkt-het")}
            />
          </nav>

          <div className="desktop-account">
            <div className="language-picker" ref={languageRef}>
              <button
                type="button"
                className="language-button"
                onClick={() => setLanguageOpen((current) => !current)}
                aria-expanded={languageOpen}
                aria-label={t.language}
              >
                <span className="language-flag">{currentLanguage.flag}</span>
                <span>{currentLanguage.short}</span>
                <span className="language-chevron">⌄</span>
              </button>

              {languageOpen && (
                <div className="language-dropdown">
                  <div className="language-dropdown-title">{t.language}</div>

                  {languages.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      className={
                        item.code === language
                          ? "language-option active-language"
                          : "language-option"
                      }
                      onClick={() => changeLanguage(item.code)}
                    >
                      <span>{item.flag}</span>
                      <span>{item.name}</span>
                      {item.code === language && (
                        <span className="language-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loggedIn ? (
              <>
                <Link
                  href="/profiel"
                  className={
                    isActive("/profiel")
                      ? "profile-button active-profile"
                      : "profile-button"
                  }
                >
                  {t.profile}
                </Link>

                <button onClick={handleLogout} className="logout-button">
                  {t.logout}
                </button>
              </>
            ) : (
              <>
                <Link href="/inloggen" className="login-link">
                  {t.login}
                </Link>

                <Link href="/registreren" className="register-button">
                  {t.playFree}
                </Link>
              </>
            )}
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t.openMenu}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {mobileOpen && (
          <div className="mobile-menu">
            <Link href="/" onClick={() => setMobileOpen(false)}>
              {t.home}
            </Link>

            <Link
              href="/wedstrijden"
              onClick={() => setMobileOpen(false)}
            >
              {t.matches}
            </Link>

            <Link href="/poules" onClick={() => setMobileOpen(false)}>
              {t.pools}
            </Link>

            <Link href="/ranglijst" onClick={() => setMobileOpen(false)}>
              {t.leaderboard}
            </Link>

            <Link
              href="/hoe-werkt-het"
              onClick={() => setMobileOpen(false)}
            >
              {t.howItWorks}
            </Link>

            <div className="mobile-divider" />

            <div className="mobile-language-title">
              🌐 {t.language}
            </div>

            <div className="mobile-language-grid">
              {languages.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={
                    item.code === language
                      ? "mobile-language-option active-mobile-language"
                      : "mobile-language-option"
                  }
                  onClick={() => changeLanguage(item.code)}
                >
                  <span>{item.flag}</span>
                  <span>{item.short}</span>
                </button>
              ))}
            </div>

            <div className="mobile-divider" />

            {loggedIn ? (
              <>
                <Link
                  href="/profiel"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.profile}
                </Link>

                <button onClick={handleLogout}>{t.logout}</button>
              </>
            ) : (
              <>
                <Link
                  href="/inloggen"
                  onClick={() => setMobileOpen(false)}
                >
                  {t.login}
                </Link>

                <Link
                  href="/registreren"
                  onClick={() => setMobileOpen(false)}
                  className="mobile-register"
                >
                  {t.playFree}
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      <style jsx global>{`
        .voetiq-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(4, 22, 14, 0.97);
          border-bottom: 1px solid rgba(75, 255, 153, 0.12);
          backdrop-filter: blur(16px);
          box-shadow: 0 3px 18px rgba(0, 0, 0, 0.12);
        }

        .voetiq-navbar {
          max-width: 1260px;
          min-height: 72px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          align-items: center;
          gap: 26px;
        }

        .voetiq-logo {
          color: white;
          text-decoration: none;
          font-size: 27px;
          font-weight: 950;
          letter-spacing: -1.4px;
          white-space: nowrap;
        }

        .voetiq-logo span {
          color: #2ee681;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 2px;
          flex: 1;
        }

        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          height: 72px;
          padding: 0 11px;
          color: #c9d8d0;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
          white-space: nowrap;
          transition:
            color 0.18s ease,
            background 0.18s ease;
        }

        .nav-link:hover {
          color: white;
        }

        .nav-link.active {
          color: #62ef9d;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          left: 11px;
          right: 11px;
          bottom: 0;
          height: 3px;
          background: #2ee681;
          border-radius: 5px 5px 0 0;
        }

        .desktop-account {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .language-picker {
          position: relative;
        }

        .language-button {
          height: 39px;
          display: flex;
          align-items: center;
          gap: 6px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.05);
          color: #eef8f2;
          border-radius: 9px;
          padding: 0 10px;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .language-button:hover {
          background: rgba(255, 255, 255, 0.09);
        }

        .language-flag {
          font-size: 16px;
        }

        .language-chevron {
          color: #8fa79a;
          font-size: 14px;
          transform: translateY(-1px);
        }

        .language-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 215px;
          padding: 8px;
          background: #ffffff;
          border: 1px solid #e7ece9;
          border-radius: 13px;
          box-shadow: 0 18px 50px rgba(0, 0, 0, 0.2);
          overflow: hidden;
        }

        .language-dropdown-title {
          padding: 8px 10px 7px;
          color: #829087;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .language-option {
          width: 100%;
          display: grid;
          grid-template-columns: 25px 1fr 20px;
          align-items: center;
          gap: 8px;
          padding: 10px 10px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #26322c;
          font-size: 13px;
          font-weight: 750;
          text-align: left;
          cursor: pointer;
        }

        .language-option:hover {
          background: #f2f7f4;
        }

        .language-option.active-language {
          background: #e9faf1;
          color: #08763e;
        }

        .language-check {
          color: #0b8f4d;
          font-weight: 950;
          text-align: right;
        }

        .login-link {
          color: #e7f3ec;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          padding: 10px 9px;
        }

        .register-button {
          background: #2ee681;
          color: #052c1b;
          text-decoration: none;
          padding: 11px 14px;
          border-radius: 9px;
          font-size: 12px;
          font-weight: 900;
          transition:
            transform 0.18s ease,
            background 0.18s ease;
        }

        .register-button:hover {
          background: #55ed98;
          transform: translateY(-1px);
        }

        .profile-button {
          color: #e9f5ee;
          text-decoration: none;
          padding: 10px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
        }

        .profile-button:hover,
        .active-profile {
          background: rgba(255, 255, 255, 0.07);
          color: #5bef9b;
        }

        .logout-button {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: #dce9e2;
          padding: 10px 11px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .logout-button:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .mobile-menu-button {
          display: none;
          width: 43px;
          height: 43px;
          border: 1px solid rgba(75, 255, 153, 0.15);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
        }

        .mobile-menu-button span {
          width: 20px;
          height: 2px;
          background: #2ee681;
          border-radius: 10px;
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 1080px) {
          .desktop-nav,
          .desktop-account {
            display: none;
          }

          .voetiq-navbar {
            justify-content: space-between;
            min-height: 68px;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            padding: 8px 20px 20px;
            background: #061b11;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }

          .mobile-menu a,
          .mobile-menu > button {
            width: 100%;
            box-sizing: border-box;
            padding: 14px 12px;
            color: #e8f4ed;
            text-decoration: none;
            font-size: 15px;
            font-weight: 750;
            text-align: left;
            border: none;
            background: transparent;
            border-radius: 8px;
            cursor: pointer;
          }

          .mobile-menu a:hover,
          .mobile-menu > button:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .mobile-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.08);
            margin: 7px 0;
          }

          .mobile-language-title {
            padding: 10px 12px 7px;
            color: #8fa79a;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.7px;
          }

          .mobile-language-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 7px;
            padding: 4px 0 8px;
          }

          .mobile-language-option {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            min-height: 42px;
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.035);
            color: #dce9e2;
            font-size: 12px;
            font-weight: 900;
            cursor: pointer;
          }

          .mobile-language-option.active-mobile-language {
            border-color: rgba(46, 230, 129, 0.35);
            background: rgba(46, 230, 129, 0.12);
            color: #67efa2;
          }

          .mobile-menu .mobile-register {
            background: #2ee681;
            color: #052c1b;
            margin-top: 5px;
            text-align: center;
          }
        }

        @media (max-width: 600px) {
          .voetiq-navbar {
            padding: 0 16px;
          }

          .voetiq-logo {
            font-size: 24px;
          }

          .mobile-language-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={active ? "nav-link active" : "nav-link"}
    >
      {label}
    </Link>
  );
}
