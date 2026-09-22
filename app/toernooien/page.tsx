"use client";

import Link from "next/link";
import { useEffect, useState } from "react";


type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

const translations = {
  nl: {
    backHome: "Terug naar Home", kicker: "{t.kicker}",
    titleBefore: "Voorspel complete", titleAccent: "toernooien.",
    intro: "Van de groepsfase tot de beslissende wedstrijden. Vul je voorspellingen in, volg de poules en verzamel punten.",
    tournaments: "Toernooien", matchPredictions: "Wedstrijdvoorspellingen", groupsStandings: "Poules & standen",
    activeTournament: "{t.activeTournament}",
    activeIntro: "De league phase van 2026/27 begint op 24 september. Bekijk alle poules en ga naar het toernooi om je voorspellingen in te vullen.",
    active: "ACTIEF", tournamentDesc: "54 landen verdeeld over League A, B, C en D. Bekijk de groepen, wedstrijden en vul jouw uitslagen in.",
    countries: "landen", groups: "groepen", openTournament: "Open toernooi",
    groupLayout: "{t.groupLayout}", allGroups: "Alle groepen", pools: "POULES", group: "Groep", view: "Bekijk",
    moreTournaments: "{t.moreTournaments}", beginning: "Dit is nog maar het begin",
    later: "Later kunnen hier onder andere het EK en WK als aparte voorspeltoernooien aan worden toegevoegd.",
  },
  en: {
    backHome: "Back to Home", kicker: "VOETIQ TOURNAMENTS",
    titleBefore: "Predict complete", titleAccent: "tournaments.",
    intro: "From the group stage to the decisive matches. Enter your predictions, follow the groups and collect points.",
    tournaments: "Tournaments", matchPredictions: "Match predictions", groupsStandings: "Groups & standings",
    activeTournament: "ACTIVE TOURNAMENT",
    activeIntro: "The 2026/27 league phase starts on 24 September. View all groups and open the tournament to enter your predictions.",
    active: "ACTIVE", tournamentDesc: "54 countries across Leagues A, B, C and D. View the groups and matches and enter your scores.",
    countries: "countries", groups: "groups", openTournament: "Open tournament",
    groupLayout: "GROUP DRAW", allGroups: "All groups", pools: "GROUPS", group: "Group", view: "View",
    moreTournaments: "MORE TOURNAMENTS", beginning: "This is just the beginning",
    later: "More prediction tournaments, including the European Championship and World Cup, can be added here later.",
  },
  de: {
    backHome: "Zurück zur Startseite", kicker: "VOETIQ TURNIERE",
    titleBefore: "Tippe komplette", titleAccent: "Turniere.",
    intro: "Von der Gruppenphase bis zu den entscheidenden Spielen. Gib deine Tipps ab, verfolge die Gruppen und sammle Punkte.",
    tournaments: "Turniere", matchPredictions: "Spieltipps", groupsStandings: "Gruppen & Tabellen",
    activeTournament: "AKTIVES TURNIER",
    activeIntro: "Die Ligaphase 2026/27 beginnt am 24. September. Sieh dir alle Gruppen an und öffne das Turnier, um deine Tipps abzugeben.",
    active: "AKTIV", tournamentDesc: "54 Länder in Liga A, B, C und D. Sieh dir Gruppen und Spiele an und tippe die Ergebnisse.",
    countries: "Länder", groups: "Gruppen", openTournament: "Turnier öffnen",
    groupLayout: "GRUPPENEINTEILUNG", allGroups: "Alle Gruppen", pools: "GRUPPEN", group: "Gruppe", view: "Ansehen",
    moreTournaments: "MEHR TURNIERE", beginning: "Das ist erst der Anfang",
    later: "Später können hier unter anderem die EM und WM als eigene Tippspiel-Turniere hinzugefügt werden.",
  },
  es: {
    backHome: "Volver al inicio", kicker: "TORNEOS VOETIQ",
    titleBefore: "Predice torneos", titleAccent: "completos.",
    intro: "Desde la fase de grupos hasta los partidos decisivos. Haz tus pronósticos, sigue los grupos y suma puntos.",
    tournaments: "Torneos", matchPredictions: "Pronósticos", groupsStandings: "Grupos y clasificación",
    activeTournament: "TORNEO ACTIVO",
    activeIntro: "La fase de liga 2026/27 comienza el 24 de septiembre. Consulta todos los grupos y entra al torneo para hacer tus pronósticos.",
    active: "ACTIVO", tournamentDesc: "54 países repartidos entre las Ligas A, B, C y D. Consulta los grupos y partidos y pronostica los resultados.",
    countries: "países", groups: "grupos", openTournament: "Abrir torneo",
    groupLayout: "DISTRIBUCIÓN DE GRUPOS", allGroups: "Todos los grupos", pools: "GRUPOS", group: "Grupo", view: "Ver",
    moreTournaments: "MÁS TORNEOS", beginning: "Esto es solo el comienzo",
    later: "Más adelante se podrán añadir aquí torneos de pronósticos como la Eurocopa y el Mundial.",
  },
  fr: {
    backHome: "Retour à l’accueil", kicker: "TOURNOIS VOETIQ",
    titleBefore: "Pronostique des", titleAccent: "tournois complets.",
    intro: "De la phase de groupes aux matchs décisifs. Fais tes pronostics, suis les groupes et gagne des points.",
    tournaments: "Tournois", matchPredictions: "Pronostics de matchs", groupsStandings: "Groupes & classements",
    activeTournament: "TOURNOI ACTIF",
    activeIntro: "La phase de ligue 2026/27 débute le 24 septembre. Consulte tous les groupes et ouvre le tournoi pour saisir tes pronostics.",
    active: "ACTIF", tournamentDesc: "54 pays répartis entre les Ligues A, B, C et D. Consulte les groupes et les matchs et saisis tes scores.",
    countries: "pays", groups: "groupes", openTournament: "Ouvrir le tournoi",
    groupLayout: "RÉPARTITION DES GROUPES", allGroups: "Tous les groupes", pools: "GROUPES", group: "Groupe", view: "Voir",
    moreTournaments: "PLUS DE TOURNOIS", beginning: "Ce n’est que le début",
    later: "D’autres tournois de pronostics, comme l’Euro et la Coupe du monde, pourront être ajoutés ici plus tard.",
  },
  it: {
    backHome: "Torna alla Home", kicker: "TORNEI VOETIQ",
    titleBefore: "Pronostica interi", titleAccent: "tornei.",
    intro: "Dalla fase a gironi alle partite decisive. Inserisci i pronostici, segui i gruppi e raccogli punti.",
    tournaments: "Tornei", matchPredictions: "Pronostici partite", groupsStandings: "Gruppi e classifiche",
    activeTournament: "TORNEO ATTIVO",
    activeIntro: "La fase campionato 2026/27 inizia il 24 settembre. Guarda tutti i gruppi e apri il torneo per inserire i tuoi pronostici.",
    active: "ATTIVO", tournamentDesc: "54 nazioni suddivise tra Lega A, B, C e D. Guarda gruppi e partite e inserisci i risultati.",
    countries: "nazioni", groups: "gruppi", openTournament: "Apri torneo",
    groupLayout: "COMPOSIZIONE GRUPPI", allGroups: "Tutti i gruppi", pools: "GRUPPI", group: "Gruppo", view: "Vedi",
    moreTournaments: "ALTRI TORNEI", beginning: "Questo è solo l’inizio",
    later: "In futuro potranno essere aggiunti qui altri tornei di pronostici, tra cui Europei e Mondiali.",
  },
  pt: {
    backHome: "Voltar ao início", kicker: "TORNEIOS VOETIQ",
    titleBefore: "Prevê torneios", titleAccent: "completos.",
    intro: "Da fase de grupos aos jogos decisivos. Faz os teus prognósticos, acompanha os grupos e soma pontos.",
    tournaments: "Torneios", matchPredictions: "Prognósticos de jogos", groupsStandings: "Grupos e classificações",
    activeTournament: "TORNEIO ATIVO",
    activeIntro: "A fase de liga 2026/27 começa a 24 de setembro. Vê todos os grupos e abre o torneio para fazeres os teus prognósticos.",
    active: "ATIVO", tournamentDesc: "54 países distribuídos pelas Ligas A, B, C e D. Vê os grupos e jogos e indica os teus resultados.",
    countries: "países", groups: "grupos", openTournament: "Abrir torneio",
    groupLayout: "COMPOSIÇÃO DOS GRUPOS", allGroups: "Todos os grupos", pools: "GRUPOS", group: "Grupo", view: "Ver",
    moreTournaments: "MAIS TORNEIOS", beginning: "Isto é apenas o começo",
    later: "Mais tarde poderão ser adicionados aqui outros torneios de prognósticos, incluindo o Europeu e o Mundial.",
  },
} satisfies Record<LanguageCode, Record<string, string>>;

function isLanguageCode(value: string | null): value is LanguageCode {
  return value === "nl" || value === "en" || value === "de" || value === "es" ||
    value === "fr" || value === "it" || value === "pt";
}

const leagues = [
  {
    name: "League A",
    color: "A",
    groups: [
      { id: "A1", teams: ["🇫🇷 Frankrijk", "🇮🇹 Italië", "🇧🇪 België", "🇹🇷 Turkije"] },
      { id: "A2", teams: ["🇩🇪 Duitsland", "🇳🇱 Nederland", "🇷🇸 Servië", "🇬🇷 Griekenland"] },
      { id: "A3", teams: ["🇪🇸 Spanje", "🇭🇷 Kroatië", "🏴 Engeland", "🇨🇿 Tsjechië"] },
      { id: "A4", teams: ["🇵🇹 Portugal", "🇩🇰 Denemarken", "🇳🇴 Noorwegen", "🏴 Wales"] },
    ],
  },
  {
    name: "League B",
    color: "B",
    groups: [
      { id: "B1", teams: ["🏴 Schotland", "🇨🇭 Zwitserland", "🇸🇮 Slovenië", "🇲🇰 Noord-Macedonië"] },
      { id: "B2", teams: ["🇭🇺 Hongarije", "🇺🇦 Oekraïne", "🇬🇪 Georgië", "🇬🇧 Noord-Ierland"] },
      { id: "B3", teams: ["🇮🇱 Israël", "🇦🇹 Oostenrijk", "🇮🇪 Ierland", "🇽🇰 Kosovo"] },
      { id: "B4", teams: ["🇵🇱 Polen", "🇧🇦 Bosnië en Herzegovina", "🇷🇴 Roemenië", "🇸🇪 Zweden"] },
    ],
  },
  {
    name: "League C",
    color: "C",
    groups: [
      { id: "C1", teams: ["🇦🇱 Albanië", "🇫🇮 Finland", "🇧🇾 Belarus", "🇸🇲 San Marino"] },
      { id: "C2", teams: ["🇲🇪 Montenegro", "🇦🇲 Armenië", "🇨🇾 Cyprus", "🇱🇻 Letland"] },
      { id: "C3", teams: ["🇰🇿 Kazachstan", "🇸🇰 Slowakije", "🇫🇴 Faeröer", "🇲🇩 Moldavië"] },
      { id: "C4", teams: ["🇮🇸 IJsland", "🇧🇬 Bulgarije", "🇪🇪 Estland", "🇱🇺 Luxemburg"] },
    ],
  },
  {
    name: "League D",
    color: "D",
    groups: [
      { id: "D1", teams: ["🇬🇮 Gibraltar", "🇲🇹 Malta", "🇦🇩 Andorra"] },
      { id: "D2", teams: ["🇱🇹 Litouwen", "🇦🇿 Azerbeidzjan", "🇱🇮 Liechtenstein"] },
    ],
  },
];

export default function ToernooienPage() {
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const t = translations[language];

  useEffect(() => {
    const syncLanguage = () => {
      const stored = window.localStorage.getItem("voetiq-language");
      setLanguage(isLanguageCode(stored) ? stored : "nl");
    };

    syncLanguage();

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const nextLanguage = customEvent.detail?.language;
      if (isLanguageCode(nextLanguage ?? null)) {
        setLanguage(nextLanguage as LanguageCode);
      } else {
        syncLanguage();
      }
    };

    window.addEventListener("voetiq-language-change", handleLanguageChange);
    window.addEventListener("storage", syncLanguage);

    return () => {
      window.removeEventListener("voetiq-language-change", handleLanguageChange);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  return (
    <main className="tournaments-page">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <section className="hero">
        <div className="container">
          <div className="hero-back-row">
            <Link href="/" className="home-back-link">
              ← {t.backHome}
            </Link>
          </div>

          <div className="kicker">
            <span className="dot" />
            VOETIQ TOERNOOIEN
          </div>

          <h1>
            {t.titleBefore} <span>{t.titleAccent}</span>
          </h1>

          <p>
            {t.intro}
          </p>

          <div className="hero-pills">
            <div>🏆 {t.tournaments}</div>
            <div>⚽ {t.matchPredictions}</div>
            <div>📊 {t.groupsStandings}</div>
          </div>
        </div>
      </section>

      <section className="content">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="label">ACTIEF TOERNOOI</span>
              <h2>UEFA Nations League</h2>
            </div>
            <p>
              {t.activeIntro}
            </p>
          </div>

          <Link href="/toernooien/nations-league" className="featured">
            <div className="featured-main">
              <div className="trophy">🏆</div>

              <div className="featured-copy">
                <div className="badges">
                  <span className="live">{t.active}</span>
                  <span>2026/27</span>
                </div>

                <h3>UEFA Nations League</h3>
                <p>
                  {t.tournamentDesc}
                </p>

                <div className="meta">
                  <span>📅 24 sep – 17 nov 2026</span>
                  <span>🌍 54 {t.countries}</span>
                  <span>🏁 14 {t.groups}</span>
                </div>
              </div>
            </div>

            <div className="open">
              {t.openTournament} <span>→</span>
            </div>

            <div className="shine" />
          </Link>

          <div className="groups-title">
            <div>
              <span className="label">POULE-INDELING</span>
              <h2>{t.allGroups}</h2>
            </div>
            <span className="group-count">14 {t.pools}</span>
          </div>

          <div className="league-list">
            {leagues.map((league) => (
              <section className="league" key={league.name}>
                <div className="league-header">
                  <div className={`league-icon league-${league.color}`}>
                    {league.color}
                  </div>
                  <div>
                    <span>UEFA NATIONS LEAGUE</span>
                    <h3>{league.name}</h3>
                  </div>
                </div>

                <div className="group-grid">
                  {league.groups.map((group) => (
                    <Link
                      href={`/toernooien/nations-league?groep=${group.id}`}
                      className="group-card"
                      key={group.id}
                    >
                      <div className="group-card-top">
                        <strong>{t.group} {group.id}</strong>
                        <span>{t.view} →</span>
                      </div>

                      <div className="teams">
                        {group.teams.map((team, index) => (
                          <div className="team" key={team}>
                            <span className="position">{index + 1}</span>
                            <strong>{team}</strong>
                          </div>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="coming">
            <div className="coming-icon">＋</div>
            <div>
              <span>MEER TOERNOOIEN</span>
              <h3>{t.beginning}</h3>
              <p>
                {t.later}
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        * { box-sizing: border-box; }

        .tournaments-page {
          position: relative;
          min-height: calc(100vh - 86px);
          overflow: hidden;
          background:
            radial-gradient(circle at 50% 0%, rgba(46,230,129,.09), transparent 31%),
            #03140d;
          color: white;
        }

        .container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .glow {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(30px);
        }

        .glow-one {
          width: 430px;
          height: 430px;
          top: -300px;
          left: calc(50% - 215px);
          background: rgba(46,230,129,.13);
        }

        .glow-two {
          width: 300px;
          height: 300px;
          top: 700px;
          right: -190px;
          background: rgba(46,230,129,.05);
        }

        .hero {
          position: relative;
          z-index: 1;
          padding: 80px 0 67px;
          text-align: center;
          border-bottom: 1px solid rgba(46,230,129,.08);
          background: linear-gradient(180deg, rgba(5,30,19,.88), rgba(3,20,13,.96));
        }

        .hero-back-row {
          display: flex;
          justify-content: flex-start;
          margin-bottom: 28px;
        }

        .home-back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 10px;
          background: rgba(255,255,255,.045);
          color: #c8d8d0;
          font-size: 12px;
          font-weight: 850;
          text-decoration: none;
          transition: .18s ease;
        }

        .home-back-link:hover {
          transform: translateX(-2px);
          border-color: rgba(46,230,129,.32);
          background: rgba(46,230,129,.08);
          color: #72f0aa;
        }

        .kicker {
          width: fit-content;
          margin: 0 auto 19px;
          padding: 8px 13px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(46,230,129,.18);
          border-radius: 999px;
          background: rgba(46,230,129,.06);
          color: #72f0aa;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 1.5px;
        }

        .dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2ee681;
          box-shadow: 0 0 12px rgba(46,230,129,.8);
        }

        .hero h1 {
          max-width: 820px;
          margin: 0 auto;
          font-size: clamp(39px, 5vw, 65px);
          line-height: 1.02;
          letter-spacing: -2.6px;
          font-weight: 950;
        }

        .hero h1 span { color: #2ee681; }

        .hero > .container > p {
          max-width: 690px;
          margin: 21px auto 0;
          color: #9db3a7;
          font-size: 15px;
          line-height: 1.75;
        }

        .hero-pills {
          margin-top: 30px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
        }

        .hero-pills div {
          padding: 9px 13px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 9px;
          background: rgba(255,255,255,.025);
          color: #bdd0c6;
          font-size: 11px;
          font-weight: 800;
        }

        .content {
          position: relative;
          z-index: 1;
          padding: 62px 0 90px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 35px;
          margin-bottom: 25px;
        }

        .label {
          display: block;
          margin-bottom: 7px;
          color: #2ee681;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1.5px;
        }

        .section-heading h2,
        .groups-title h2 {
          margin: 0;
          font-size: 29px;
          letter-spacing: -.8px;
        }

        .section-heading > p {
          max-width: 500px;
          margin: 0;
          color: #789083;
          font-size: 12px;
          line-height: 1.65;
          text-align: right;
        }

        .featured {
          position: relative;
          min-height: 235px;
          padding: 29px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          border: 1px solid rgba(46,230,129,.25);
          border-radius: 18px;
          background:
            radial-gradient(circle at 85% 20%, rgba(46,230,129,.09), transparent 30%),
            linear-gradient(135deg, rgba(10,42,27,.98), rgba(5,25,16,.98));
          color: white;
          text-decoration: none;
          transition: .2s ease;
        }

        .featured:hover {
          transform: translateY(-4px);
          border-color: rgba(46,230,129,.5);
          box-shadow: 0 22px 60px rgba(0,0,0,.22);
        }

        .featured-main {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .trophy {
          flex: 0 0 92px;
          width: 92px;
          height: 92px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(46,230,129,.16);
          border-radius: 22px;
          background: rgba(46,230,129,.07);
          font-size: 43px;
        }

        .badges {
          display: flex;
          gap: 7px;
          margin-bottom: 11px;
        }

        .badges span {
          padding: 5px 8px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 6px;
          background: rgba(255,255,255,.03);
          color: #879d91;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: .8px;
        }

        .badges .live {
          border-color: rgba(46,230,129,.18);
          background: rgba(46,230,129,.08);
          color: #5ce99b;
        }

        .featured h3 {
          margin: 0 0 8px;
          font-size: 27px;
          letter-spacing: -.6px;
        }

        .featured-copy > p {
          max-width: 600px;
          margin: 0;
          color: #91a79b;
          font-size: 12px;
          line-height: 1.65;
        }

        .meta {
          margin-top: 16px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .meta span {
          padding: 6px 8px;
          border-radius: 6px;
          background: rgba(255,255,255,.03);
          color: #80968a;
          font-size: 9px;
          font-weight: 800;
        }

        .open {
          position: relative;
          z-index: 2;
          flex: 0 0 auto;
          padding: 11px 14px;
          border-radius: 9px;
          background: #2ee681;
          color: #032014;
          font-size: 10px;
          font-weight: 950;
        }

        .open span {
          display: inline-block;
          margin-left: 6px;
          transition: transform .2s ease;
        }

        .featured:hover .open span { transform: translateX(3px); }

        .shine {
          position: absolute;
          width: 220px;
          height: 220px;
          right: -120px;
          bottom: -140px;
          border-radius: 50%;
          background: rgba(46,230,129,.08);
        }

        .groups-title {
          margin: 59px 0 21px;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .group-count {
          color: #71897c;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        .league {
          margin-bottom: 35px;
        }

        .league-header {
          margin-bottom: 13px;
          display: flex;
          align-items: center;
          gap: 11px;
        }

        .league-icon {
          width: 39px;
          height: 39px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(46,230,129,.16);
          border-radius: 10px;
          background: rgba(46,230,129,.07);
          color: #55eb99;
          font-size: 13px;
          font-weight: 950;
        }

        .league-header span {
          display: block;
          margin-bottom: 2px;
          color: #60796c;
          font-size: 7px;
          font-weight: 950;
          letter-spacing: 1.1px;
        }

        .league-header h3 {
          margin: 0;
          font-size: 17px;
        }

        .group-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 13px;
        }

        .group-card {
          padding: 17px;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 13px;
          background: linear-gradient(145deg, rgba(8,34,22,.96), rgba(5,25,16,.96));
          color: white;
          text-decoration: none;
          transition: .18s ease;
        }

        .group-card:hover {
          transform: translateY(-3px);
          border-color: rgba(46,230,129,.28);
        }

        .group-card-top {
          padding-bottom: 11px;
          display: flex;
          justify-content: space-between;
          gap: 10px;
          border-bottom: 1px solid rgba(255,255,255,.055);
        }

        .group-card-top strong {
          font-size: 11px;
        }

        .group-card-top span {
          color: #48e890;
          font-size: 8px;
          font-weight: 900;
        }

        .teams {
          padding-top: 7px;
        }

        .team {
          min-height: 34px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .position {
          width: 18px;
          color: #5e776a;
          font-size: 8px;
          font-weight: 900;
        }

        .team strong {
          font-size: 10px;
          font-weight: 750;
        }

        .coming {
          margin-top: 48px;
          padding: 24px 27px;
          display: flex;
          align-items: center;
          gap: 19px;
          border: 1px dashed rgba(255,255,255,.1);
          border-radius: 15px;
          background: rgba(255,255,255,.018);
        }

        .coming-icon {
          flex: 0 0 51px;
          width: 51px;
          height: 51px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: rgba(255,255,255,.035);
          color: #789083;
          font-size: 25px;
        }

        .coming span {
          color: #4ce994;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1.2px;
        }

        .coming h3 {
          margin: 3px 0 4px;
          font-size: 16px;
        }

        .coming p {
          margin: 0;
          color: #71897d;
          font-size: 11px;
        }

        @media (max-width: 1000px) {
          .group-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 760px) {
          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 9px;
          }

          .section-heading > p { text-align: left; }

          .featured {
            align-items: stretch;
            flex-direction: column;
          }

          .open { width: fit-content; }
        }

        @media (max-width: 640px) {
          .container { width: min(100% - 28px, 1180px); }
          .hero { padding: 28px 0 49px; }
          .hero-back-row { margin-bottom: 24px; }
          .hero h1 { font-size: 39px; letter-spacing: -1.8px; }
          .content { padding: 43px 0 65px; }
          .featured-main { align-items: flex-start; flex-direction: column; }
          .trophy { width: 70px; height: 70px; flex-basis: 70px; font-size: 32px; }
          .group-grid { grid-template-columns: 1fr; }
          .coming { align-items: flex-start; }
        }
      `}</style>
    </main>
  );
}
