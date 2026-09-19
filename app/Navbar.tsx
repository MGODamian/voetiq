"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type NotificationItem = {
  id: string;
  icon: string;
  text: string;
  createdAt: string;
  href: string;
};

const notificationCopy: Record<LanguageCode, {
  title: string;
  empty: string;
  markRead: string;
  points: (points: number, match: string) => string;
  exact: (match: string) => string;
  achievement: (name: string) => string;
  promotion: (rank: string) => string;
}> = {
  nl: { title:"Meldingen", empty:"Je hebt nog geen meldingen.", markRead:"Alles gelezen", points:(p,m)=>`+${p} punten verdiend bij ${m}`, exact:m=>`Exacte score voorspeld bij ${m}`, achievement:n=>`Achievement behaald: ${n}`, promotion:r=>`Gepromoveerd naar ${r}` },
  en: { title:"Notifications", empty:"You don't have any notifications yet.", markRead:"Mark all read", points:(p,m)=>`Earned +${p} points for ${m}`, exact:m=>`Exact score predicted for ${m}`, achievement:n=>`Achievement unlocked: ${n}`, promotion:r=>`Promoted to ${r}` },
  de: { title:"Benachrichtigungen", empty:"Du hast noch keine Benachrichtigungen.", markRead:"Alle gelesen", points:(p,m)=>`+${p} Punkte bei ${m} verdient`, exact:m=>`Exaktes Ergebnis bei ${m} getippt`, achievement:n=>`Erfolg freigeschaltet: ${n}`, promotion:r=>`Aufgestiegen zu ${r}` },
  es: { title:"Notificaciones", empty:"Aún no tienes notificaciones.", markRead:"Marcar todo como leído", points:(p,m)=>`Has ganado +${p} puntos en ${m}`, exact:m=>`Marcador exacto pronosticado en ${m}`, achievement:n=>`Logro conseguido: ${n}`, promotion:r=>`Ascendido a ${r}` },
  fr: { title:"Notifications", empty:"Tu n’as encore aucune notification.", markRead:"Tout marquer comme lu", points:(p,m)=>`+${p} points gagnés pour ${m}`, exact:m=>`Score exact pronostiqué pour ${m}`, achievement:n=>`Succès débloqué : ${n}`, promotion:r=>`Promu au rang ${r}` },
  it: { title:"Notifiche", empty:"Non hai ancora notifiche.", markRead:"Segna tutto come letto", points:(p,m)=>`+${p} punti guadagnati in ${m}`, exact:m=>`Risultato esatto pronosticato in ${m}`, achievement:n=>`Obiettivo sbloccato: ${n}`, promotion:r=>`Promosso a ${r}` },
  pt: { title:"Notificações", empty:"Ainda não tens notificações.", markRead:"Marcar tudo como lido", points:(p,m)=>`+${p} pontos ganhos em ${m}`, exact:m=>`Resultado exato previsto em ${m}`, achievement:n=>`Conquista desbloqueada: ${n}`, promotion:r=>`Promovido a ${r}` },
};

const achievementNotificationNames: Record<LanguageCode, {
  debut: string; firstPoints: string; firstCorrect: string; firstExact: string;
  tenPredictions: string; tenCorrect: string; hundredPoints: string;
}> = {
  nl:{debut:"Debutant",firstPoints:"Eerste punten",firstCorrect:"Goed gezien",firstExact:"Scherpschutter",tenPredictions:"Vaste voorspeller",tenCorrect:"Voetbalkenner",hundredPoints:"100-puntenclub"},
  en:{debut:"Debutant",firstPoints:"First points",firstCorrect:"Good call",firstExact:"Sharpshooter",tenPredictions:"Regular predictor",tenCorrect:"Football expert",hundredPoints:"100-point club"},
  de:{debut:"Debütant",firstPoints:"Erste Punkte",firstCorrect:"Gut gesehen",firstExact:"Scharfschütze",tenPredictions:"Stamm-Tipper",tenCorrect:"Fußballkenner",hundredPoints:"100-Punkte-Club"},
  es:{debut:"Debutante",firstPoints:"Primeros puntos",firstCorrect:"Buen pronóstico",firstExact:"Francotirador",tenPredictions:"Pronosticador habitual",tenCorrect:"Experto en fútbol",hundredPoints:"Club de 100 puntos"},
  fr:{debut:"Débutant",firstPoints:"Premiers points",firstCorrect:"Bien vu",firstExact:"Tireur d’élite",tenPredictions:"Pronostiqueur régulier",tenCorrect:"Expert football",hundredPoints:"Club des 100 points"},
  it:{debut:"Debuttante",firstPoints:"Primi punti",firstCorrect:"Ben visto",firstExact:"Cecchino",tenPredictions:"Pronosticatore abituale",tenCorrect:"Esperto di calcio",hundredPoints:"Club dei 100 punti"},
  pt:{debut:"Estreante",firstPoints:"Primeiros pontos",firstCorrect:"Boa previsão",firstExact:"Atirador de elite",tenPredictions:"Prognosticador habitual",tenCorrect:"Especialista em futebol",hundredPoints:"Clube dos 100 pontos"},
};

type PromotionCopy = {
  title: string;
  promoted: string;
  points: string;
  next: string;
  continue: string;
};

const promotionCopy: Record<LanguageCode, PromotionCopy> = {
  nl: { title: "PROMOTIE!", promoted: "Je bent gepromoveerd!", points: "punten", next: "Op naar", continue: "Doorgaan" },
  en: { title: "PROMOTION!", promoted: "You have been promoted!", points: "points", next: "Next up", continue: "Continue" },
  de: { title: "AUFSTIEG!", promoted: "Du bist aufgestiegen!", points: "Punkte", next: "Weiter zu", continue: "Weiter" },
  es: { title: "¡ASCENSO!", promoted: "¡Has ascendido!", points: "puntos", next: "A por", continue: "Continuar" },
  fr: { title: "PROMOTION !", promoted: "Tu as été promu !", points: "points", next: "En route vers", continue: "Continuer" },
  it: { title: "PROMOZIONE!", promoted: "Sei stato promosso!", points: "punti", next: "Prossimo obiettivo", continue: "Continua" },
  pt: { title: "PROMOÇÃO!", promoted: "Foste promovido!", points: "pontos", next: "Rumo a", continue: "Continuar" },
};

const footballRanks = [
  { min: 0, icon: "🟤", nl: "Straatvoetballer", en: "Street Footballer", de: "Straßenfußballer", es: "Futbolista callejero", fr: "Footballeur de rue", it: "Calciatore di strada", pt: "Futebolista de rua" },
  { min: 50, icon: "🟢", nl: "Jeugdspeler", en: "Youth Player", de: "Jugendspieler", es: "Jugador juvenil", fr: "Joueur junior", it: "Giocatore giovanile", pt: "Jogador juvenil" },
  { min: 100, icon: "🔵", nl: "Academiespeler", en: "Academy Player", de: "Akademiespieler", es: "Jugador de academia", fr: "Joueur d’académie", it: "Giocatore dell’accademia", pt: "Jogador da academia" },
  { min: 200, icon: "⚪", nl: "Selectiespeler", en: "Squad Player", de: "Kaderspieler", es: "Jugador de plantilla", fr: "Joueur de l’effectif", it: "Giocatore della rosa", pt: "Jogador do plantel" },
  { min: 350, icon: "🟡", nl: "Basisspeler", en: "Starting Player", de: "Stammspieler", es: "Titular", fr: "Titulaire", it: "Titolare", pt: "Titular" },
  { min: 550, icon: "🟠", nl: "Profvoetballer", en: "Professional Footballer", de: "Profifußballer", es: "Futbolista profesional", fr: "Footballeur professionnel", it: "Calciatore professionista", pt: "Futebolista profissional" },
  { min: 800, icon: "🔥", nl: "Sterspeler", en: "Star Player", de: "Starspieler", es: "Jugador estrella", fr: "Joueur vedette", it: "Giocatore stella", pt: "Jogador estrela" },
  { min: 1100, icon: "⭐", nl: "Topspeler", en: "Top Player", de: "Topspieler", es: "Jugador de élite", fr: "Joueur d’élite", it: "Top player", pt: "Jogador de elite" },
  { min: 1500, icon: "🌟", nl: "Wereldster", en: "World Star", de: "Weltstar", es: "Estrella mundial", fr: "Star mondiale", it: "Stella mondiale", pt: "Estrela mundial" },
  { min: 2000, icon: "🏆", nl: "Kampioen", en: "Champion", de: "Champion", es: "Campeón", fr: "Champion", it: "Campione", pt: "Campeão" },
  { min: 2750, icon: "👑", nl: "Ballon d'Or-niveau", en: "Ballon d'Or Level", de: "Ballon-d’Or-Niveau", es: "Nivel Balón de Oro", fr: "Niveau Ballon d’Or", it: "Livello Pallone d’Oro", pt: "Nível Bola de Ouro" },
  { min: 3500, icon: "🐐", nl: "VoetIQ GOAT", en: "VoetIQ GOAT", de: "VoetIQ GOAT", es: "VoetIQ GOAT", fr: "VoetIQ GOAT", it: "VoetIQ GOAT", pt: "VoetIQ GOAT" },
] as const;

function getRankIndex(points: number) {
  let index = 0;
  for (let i = 0; i < footballRanks.length; i += 1) {
    if (points >= footballRanks[i].min) index = i;
  }
  return index;
}

type NavbarTranslation = {
  home: string;
  matches: string;
  pools: string;
  leaderboard: string;
  achievements: string;
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
    achievements: "Achievements",
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
    achievements: "Achievements",
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
    achievements: "Erfolge",
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
    achievements: "Logros",
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
    achievements: "Succès",
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
    achievements: "Obiettivi",
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
    achievements: "Conquistas",
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
  const [promotionRankIndex, setPromotionRankIndex] = useState<number | null>(null);
  const [promotionPoints, setPromotionPoints] = useState(0);
  const [promotionUserId, setPromotionUserId] = useState("");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [notificationUserId, setNotificationUserId] = useState("");

  const languageRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

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

      if (session?.user) {
        setNotificationUserId(session.user.id);
        void checkPromotion(session.user.id);
        void loadNotifications(session.user.id);
      } else {
        setPromotionRankIndex(null);
        setPromotionUserId("");
        setNotificationUserId("");
        setNotifications([]);
        setReadNotificationIds([]);
      }
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

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
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

    if (user) {
      setNotificationUserId(user.id);
      await Promise.all([
        checkPromotion(user.id),
        loadNotifications(user.id),
      ]);
    }
  }

  useEffect(() => {
    if (!notificationUserId) return;
    void loadNotifications(notificationUserId);
  }, [language, notificationUserId]);

  async function loadNotifications(userId: string) {
    const { data, error } = await supabase
      .from("predictions")
      .select("id, match_name, home_score, away_score, actual_home_score, actual_away_score, points, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Kon meldingen niet laden:", error);
      return;
    }

    const copy = notificationCopy[language];
    const names = achievementNotificationNames[language];
    const rows = data || [];
    const items: NotificationItem[] = [];
    let runningPoints = 0;
    let correctCount = 0;
    let exactCount = 0;
    let previousRankIndex = 0;

    rows.forEach((row, index) => {
      const played = row.actual_home_score !== null && row.actual_away_score !== null;
      const exact = played && row.home_score === row.actual_home_score && row.away_score === row.actual_away_score;
      const correct = played && (
        (row.home_score > row.away_score && row.actual_home_score > row.actual_away_score) ||
        (row.home_score < row.away_score && row.actual_home_score < row.actual_away_score) ||
        (row.home_score === row.away_score && row.actual_home_score === row.actual_away_score)
      );

      if (index === 0) {
        items.push({ id:`achievement-debut-${row.id}`, icon:"🌱", text:copy.achievement(names.debut), createdAt:row.created_at, href:"/achievements" });
      }
      if (index + 1 === 10) {
        items.push({ id:`achievement-10pred-${row.id}`, icon:"📋", text:copy.achievement(names.tenPredictions), createdAt:row.created_at, href:"/achievements" });
      }

      if (!played) return;

      const beforePoints = runningPoints;
      runningPoints += Number(row.points || 0);
      if (correct) correctCount += 1;
      if (exact) exactCount += 1;

      if (Number(row.points || 0) > 0) {
        items.push({ id:`points-${row.id}`, icon:"⚽", text:copy.points(Number(row.points || 0), row.match_name), createdAt:row.created_at, href:"/profiel" });
      }
      if (exact) {
        items.push({ id:`exact-${row.id}`, icon:"🎯", text:copy.exact(row.match_name), createdAt:row.created_at, href:"/profiel" });
      }
      if (beforePoints === 0 && runningPoints > 0) {
        items.push({ id:`achievement-firstpoints-${row.id}`, icon:"🪙", text:copy.achievement(names.firstPoints), createdAt:row.created_at, href:"/achievements" });
      }
      if (correctCount === 1 && correct) {
        items.push({ id:`achievement-correct-${row.id}`, icon:"✅", text:copy.achievement(names.firstCorrect), createdAt:row.created_at, href:"/achievements" });
      }
      if (exactCount === 1 && exact) {
        items.push({ id:`achievement-firstexact-${row.id}`, icon:"🎯", text:copy.achievement(names.firstExact), createdAt:row.created_at, href:"/achievements" });
      }
      if (correctCount === 10 && correct) {
        items.push({ id:`achievement-10correct-${row.id}`, icon:"⚽", text:copy.achievement(names.tenCorrect), createdAt:row.created_at, href:"/achievements" });
      }
      if (beforePoints < 100 && runningPoints >= 100) {
        items.push({ id:`achievement-100points-${row.id}`, icon:"💯", text:copy.achievement(names.hundredPoints), createdAt:row.created_at, href:"/achievements" });
      }

      const currentRankIndex = getRankIndex(runningPoints);
      if (currentRankIndex > previousRankIndex) {
        for (let rankIndex = previousRankIndex + 1; rankIndex <= currentRankIndex; rankIndex += 1) {
          const rank = footballRanks[rankIndex];
          items.push({
            id:`rank-${rankIndex}-${row.id}`,
            icon:"⬆️",
            text:copy.promotion(`${rank.icon} ${rank[language]}`),
            createdAt:row.created_at,
            href:"/profiel",
          });
        }
      }
      previousRankIndex = currentRankIndex;
    });

    items.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setNotifications(items.slice(0, 12));

    const stored = window.localStorage.getItem(`voetiq-read-notifications-${userId}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setReadNotificationIds(parsed);
      } catch {
        setReadNotificationIds([]);
      }
    }
  }

  function markAllNotificationsRead() {
    const ids = notifications.map((item) => item.id);
    setReadNotificationIds(ids);

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        window.localStorage.setItem(
          `voetiq-read-notifications-${user.id}`,
          JSON.stringify(ids)
        );
      }
    });
  }

  async function checkPromotion(userId: string) {
    const [{ data: profile }, { data: predictionRows }] = await Promise.all([
      supabase
        .from("profiles")
        .select("highest_rank_seen")
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("predictions")
        .select("points")
        .eq("user_id", userId),
    ]);

    const totalPoints = (predictionRows || []).reduce(
      (sum, row) => sum + Number(row.points || 0),
      0
    );

    const currentRankIndex = getRankIndex(totalPoints);
    const highestRankSeen = Number(profile?.highest_rank_seen ?? 0);

    if (currentRankIndex > highestRankSeen) {
      setPromotionPoints(totalPoints);
      setPromotionRankIndex(currentRankIndex);
      setPromotionUserId(userId);
    }
  }

  async function closePromotion() {
    if (promotionRankIndex === null || !promotionUserId) return;

    const rankToSave = promotionRankIndex;

    setPromotionRankIndex(null);

    const { error } = await supabase
      .from("profiles")
      .update({ highest_rank_seen: rankToSave })
      .eq("id", promotionUserId);

    if (error) {
      console.error("Kon hoogste bekeken voetbalrang niet opslaan:", error);
    }
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

            {loggedIn && (
              <NavLink
                href="/achievements"
                label={`🏅 ${t.achievements}`}
                active={isActive("/achievements")}
              />
            )}

            <NavLink
              href="/hoe-werkt-het"
              label={t.howItWorks}
              active={isActive("/hoe-werkt-het")}
            />
          </nav>

          <div className="desktop-account">
            {loggedIn && (
              <div className="notification-picker" ref={notificationRef}>
                <button
                  type="button"
                  className="notification-button"
                  onClick={() => setNotificationsOpen((current) => !current)}
                  aria-label={notificationCopy[language].title}
                  aria-expanded={notificationsOpen}
                >
                  <span>🔔</span>
                  {notifications.filter((item) => !readNotificationIds.includes(item.id)).length > 0 && (
                    <span className="notification-count">
                      {Math.min(9, notifications.filter((item) => !readNotificationIds.includes(item.id)).length)}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <strong>{notificationCopy[language].title}</strong>
                      {notifications.length > 0 && (
                        <button type="button" onClick={markAllNotificationsRead}>
                          {notificationCopy[language].markRead}
                        </button>
                      )}
                    </div>

                    {notifications.length === 0 ? (
                      <div className="notification-empty">
                        {notificationCopy[language].empty}
                      </div>
                    ) : (
                      <div className="notification-list">
                        {notifications.map((item) => (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setNotificationsOpen(false)}
                            className={
                              readNotificationIds.includes(item.id)
                                ? "notification-item"
                                : "notification-item unread"
                            }
                          >
                            <span className="notification-icon">{item.icon}</span>
                            <span>{item.text}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

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

            {loggedIn && (
              <Link href="/achievements" onClick={() => setMobileOpen(false)}>
                🏅 {t.achievements}
              </Link>
            )}

            <Link
              href="/hoe-werkt-het"
              onClick={() => setMobileOpen(false)}
            >
              {t.howItWorks}
            </Link>

            {loggedIn && (
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(true);
                  setMobileOpen(false);
                }}
              >
                🔔 {notificationCopy[language].title}
                {notifications.filter((item) => !readNotificationIds.includes(item.id)).length > 0
                  ? ` (${notifications.filter((item) => !readNotificationIds.includes(item.id)).length})`
                  : ""}
              </button>
            )}

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

      {loggedIn && notificationsOpen && (
        <div className="mobile-notification-panel">
          <div className="notification-header">
            <strong>{notificationCopy[language].title}</strong>
            <div className="mobile-notification-actions">
              {notifications.length > 0 && (
                <button type="button" onClick={markAllNotificationsRead}>
                  {notificationCopy[language].markRead}
                </button>
              )}
              <button type="button" onClick={() => setNotificationsOpen(false)}>✕</button>
            </div>
          </div>
          {notifications.length === 0 ? (
            <div className="notification-empty">{notificationCopy[language].empty}</div>
          ) : (
            <div className="notification-list">
              {notifications.map((item) => (
                <Link
                  key={`mobile-${item.id}`}
                  href={item.href}
                  onClick={() => setNotificationsOpen(false)}
                  className={readNotificationIds.includes(item.id) ? "notification-item" : "notification-item unread"}
                >
                  <span className="notification-icon">{item.icon}</span>
                  <span>{item.text}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {promotionRankIndex !== null && (
        <div className="promotion-overlay" role="dialog" aria-modal="true">
          <div className="promotion-card">
            <div className="promotion-badge">🎉</div>
            <div className="promotion-kicker">{promotionCopy[language].title}</div>
            <h2>{promotionCopy[language].promoted}</h2>

            <div className="promotion-ranks">
              <div className="promotion-rank old-rank">
                <span>{footballRanks[promotionRankIndex - 1]?.icon}</span>
                <strong>{footballRanks[promotionRankIndex - 1]?.[language]}</strong>
              </div>

              <div className="promotion-arrow">→</div>

              <div className="promotion-rank new-rank">
                <span>{footballRanks[promotionRankIndex].icon}</span>
                <strong>{footballRanks[promotionRankIndex][language]}</strong>
              </div>
            </div>

            <div className="promotion-points">
              {promotionPoints} {promotionCopy[language].points}
            </div>

            {promotionRankIndex < footballRanks.length - 1 && (
              <p className="promotion-next">
                {promotionCopy[language].next}{" "}
                <strong>
                  {footballRanks[promotionRankIndex + 1].icon}{" "}
                  {footballRanks[promotionRankIndex + 1][language]}
                </strong>
              </p>
            )}

            <button type="button" className="promotion-continue" onClick={closePromotion}>
              {promotionCopy[language].continue}
            </button>
          </div>
        </div>
      )}

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

        .notification-picker {
          position: relative;
        }

        .notification-button {
          position: relative;
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.05);
          border-radius: 9px;
          cursor: pointer;
          font-size: 16px;
        }

        .notification-count {
          position: absolute;
          top: -5px;
          right: -5px;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #2ee681;
          color: #052c1b;
          font-size: 10px;
          font-weight: 950;
          box-shadow: 0 0 0 3px #04160e;
        }

        .notification-dropdown,
        .mobile-notification-panel {
          color: #eef8f2;
          background: #061b11;
          border: 1px solid rgba(46,230,129,0.18);
          box-shadow: 0 22px 60px rgba(0,0,0,0.45);
        }

        .notification-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: min(390px, 88vw);
          border-radius: 15px;
          overflow: hidden;
        }

        .notification-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 15px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .notification-header button {
          border: 0;
          background: transparent;
          color: #55ed98;
          font-size: 11px;
          font-weight: 900;
          cursor: pointer;
        }

        .notification-list {
          max-height: 380px;
          overflow-y: auto;
        }

        .notification-item {
          display: grid;
          grid-template-columns: 30px 1fr;
          gap: 9px;
          padding: 13px 15px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          color: #b9c9c0;
          font-size: 12px;
          line-height: 1.45;
          text-decoration: none;
          cursor: pointer;
        }

        .notification-item:hover {
          background: rgba(255,255,255,0.045);
        }

        .notification-item.unread {
          background: rgba(46,230,129,0.07);
          color: #f2fff7;
        }

        .notification-icon {
          font-size: 18px;
        }

        .notification-empty {
          padding: 28px 18px;
          text-align: center;
          color: #8fa79a;
          font-size: 12px;
        }

        .mobile-notification-panel {
          display: none;
        }

        .mobile-notification-actions {
          display: flex;
          align-items: center;
          gap: 8px;
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

        .promotion-overlay {
          position: fixed;
          inset: 0;
          z-index: 5000;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(0, 10, 6, 0.78);
          backdrop-filter: blur(10px);
        }

        .promotion-card {
          width: min(520px, 100%);
          box-sizing: border-box;
          padding: 34px 30px 30px;
          text-align: center;
          color: white;
          background:
            radial-gradient(circle at 50% 0%, rgba(46, 230, 129, 0.18), transparent 42%),
            linear-gradient(145deg, #06271a 0%, #00170e 100%);
          border: 1px solid rgba(65, 229, 139, 0.28);
          border-radius: 24px;
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.55);
        }

        .promotion-badge {
          font-size: 44px;
          line-height: 1;
          margin-bottom: 13px;
        }

        .promotion-kicker {
          color: #41e58b;
          font-size: 13px;
          font-weight: 950;
          letter-spacing: 1.6px;
        }

        .promotion-card h2 {
          margin: 7px 0 24px;
          font-size: 28px;
          letter-spacing: -0.7px;
        }

        .promotion-ranks {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
        }

        .promotion-rank {
          min-height: 98px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 10px;
          border-radius: 15px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .promotion-rank span {
          font-size: 30px;
        }

        .promotion-rank strong {
          font-size: 13px;
          line-height: 1.25;
        }

        .promotion-rank.new-rank {
          background: rgba(46, 230, 129, 0.10);
          border-color: rgba(46, 230, 129, 0.30);
          color: #72f1a9;
        }

        .promotion-rank.old-rank {
          color: #a9bbb0;
        }

        .promotion-arrow {
          color: #41e58b;
          font-size: 24px;
          font-weight: 950;
        }

        .promotion-points {
          margin-top: 22px;
          color: white;
          font-size: 23px;
          font-weight: 950;
        }

        .promotion-next {
          margin: 8px 0 22px;
          color: #a9bbb0;
          font-size: 14px;
        }

        .promotion-next strong {
          color: #dff7e9;
        }

        .promotion-continue {
          width: 100%;
          border: 0;
          border-radius: 11px;
          padding: 13px 18px;
          background: #2ee681;
          color: #052c1b;
          font-size: 14px;
          font-weight: 950;
          cursor: pointer;
        }

        .promotion-continue:hover {
          background: #55ed98;
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

          .mobile-notification-panel {
            display: block;
            position: fixed;
            z-index: 1500;
            top: 76px;
            left: 16px;
            right: 16px;
            max-height: 70vh;
            overflow: hidden;
            border-radius: 15px;
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
