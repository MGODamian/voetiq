"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Game = {
  id: string;
  icon: string;
  title: string;
  description: string;
  href: string;
  status: "available" | "soon";
  badge?: string;
};

const copy: Record<
  LanguageCode,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    available: string;
    comingSoon: string;
    play: string;
    soon: string;
    dailyTitle: string;
    dailyText: string;
    dailyButton: string;
    backHome: string;
    pillGames: string;
    pillFast: string;
    pillBest: string;
    choose: string;
    sectionIntro: string;
    games: Game[];
  }
> = {
  nl: {
    eyebrow: "VOETIQ GAMES",
    title: "Hoe goed is jouw voetbalkennis?",
    subtitle:
      "Test je voetbalkennis met verschillende minigames. Speel, verbeter je scores en probeer jezelf steeds weer te verslaan.",
    available: "Speel nu",
    comingSoon: "Binnenkort",
    play: "Spelen",
    soon: "Binnenkort",
    dailyTitle: "Op zoek naar de Daily?",
    dailyText:
      "De VoetIQ Daily blijft losstaan van de minigames. Iedere dag wacht daar een nieuwe voetbalchallenge op je.",
    dailyButton: "Naar de Daily",
    backHome: "Terug naar Home",
    pillGames: "Minigames",
    pillFast: "Snel & uitdagend",
    pillBest: "Versla je beste score",
    choose: "Kies je uitdaging",
    sectionIntro: "Begin met Wie is de speler? Binnenkort komen er steeds meer voetbalgames bij.",
    games: [
      {
        id: "player",
        icon: "👤",
        title: "Wie is de speler?",
        description:
          "Ontdek welke voetballer we zoeken. Je krijgt steeds meer hints — raad hem zo vroeg mogelijk.",
        href: "/games/wie-is-de-speler",
        status: "available",
        badge: "EERSTE GAME",
      },
      {
        id: "stadium",
        icon: "🏟️",
        title: "Raad het stadion",
        description:
          "Van wereldberoemde voetbaltempels tot lastige stadions. Weet jij welk stadion je ziet?",
        href: "/games/raad-het-stadion",
        status: "available",
      },
      {
        id: "quiz",
        icon: "🧠",
        title: "Voetbalquiz",
        description:
          "Tien vragen. Eén score. Laat zien hoeveel jij écht van voetbal weet.",
        href: "/games/voetbalquiz",
        status: "available",
      },
      {
        id: "link",
        icon: "🔗",
        title: "Player Link",
        description:
          "Verbind twee voetballers via clubs en teamgenoten. Vind jij de kortste route?",
        href: "/games/player-link",
        status: "available",
      },
      {
        id: "country",
        icon: "🌍",
        title: "Raad het voetballand",
        description:
          "Clubs, spelers en competities geven je hints. Kun jij het juiste land vinden?",
        href: "/games/raad-het-land",
        status: "available",
      },
    ],
  },

  en: {
    eyebrow: "VOETIQ GAMES",
    title: "How good is your football knowledge?",
    subtitle:
      "Test your football knowledge with different mini-games. Play, improve your scores and keep trying to beat yourself.",
    available: "Play now",
    comingSoon: "Coming soon",
    play: "Play",
    soon: "Coming soon",
    dailyTitle: "Looking for the Daily?",
    dailyText:
      "VoetIQ Daily remains separate from the mini-games. A new football challenge awaits you there every day.",
    dailyButton: "Go to Daily",
    backHome: "Back to Home",
    pillGames: "Mini-games",
    pillFast: "Fast & challenging",
    pillBest: "Beat your best score",
    choose: "Choose your challenge",
    sectionIntro: "Start with Who is the player? More football games will be added over time.",
    games: [
      {
        id: "player",
        icon: "👤",
        title: "Who is the player?",
        description:
          "Discover which footballer we're looking for. More hints appear as you play.",
        href: "/games/wie-is-de-speler",
        status: "available",
        badge: "FIRST GAME",
      },
      {
        id: "stadium",
        icon: "🏟️",
        title: "Guess the stadium",
        description:
          "From famous football temples to difficult grounds. Can you identify them?",
        href: "/games/raad-het-stadion",
        status: "available",
      },
      {
        id: "quiz",
        icon: "🧠",
        title: "Football quiz",
        description:
          "Ten questions. One score. Show how much you really know about football.",
        href: "/games/voetbalquiz",
        status: "available",
      },
      {
        id: "link",
        icon: "🔗",
        title: "Player Link",
        description:
          "Connect two footballers through clubs and teammates. Find the shortest route.",
        href: "/games/player-link",
        status: "available",
      },
      {
        id: "country",
        icon: "🌍",
        title: "Guess the football country",
        description:
          "Clubs, players and competitions give you clues. Find the right country.",
        href: "/games/raad-het-land",
        status: "available",
      },
    ],
  },

  de: {
    eyebrow: "VOETIQ GAMES",
    title: "Wie gut ist dein Fußballwissen?",
    subtitle:
      "Teste dein Fußballwissen mit verschiedenen Minigames und verbessere deine Ergebnisse.",
    available: "Jetzt spielen",
    comingSoon: "Demnächst",
    play: "Spielen",
    soon: "Demnächst",
    dailyTitle: "Suchst du die Daily?",
    dailyText:
      "Die VoetIQ Daily bleibt von den Minigames getrennt. Jeden Tag wartet dort eine neue Fußball-Challenge.",
    dailyButton: "Zur Daily",
    backHome: "Zurück zur Startseite",
    pillGames: "Minispiele",
    pillFast: "Schnell & herausfordernd",
    pillBest: "Schlage deinen Highscore",
    choose: "Wähle deine Herausforderung",
    sectionIntro: "Starte mit Wer ist der Spieler? Nach und nach kommen weitere Fußballspiele dazu.",
    games: [],
  },

  es: {
    eyebrow: "VOETIQ GAMES",
    title: "¿Cuánto sabes de fútbol?",
    subtitle:
      "Pon a prueba tus conocimientos de fútbol con diferentes minijuegos.",
    available: "Jugar ahora",
    comingSoon: "Próximamente",
    play: "Jugar",
    soon: "Próximamente",
    dailyTitle: "¿Buscas el Daily?",
    dailyText:
      "VoetIQ Daily permanece separado de los minijuegos y ofrece un nuevo reto cada día.",
    dailyButton: "Ir al Daily",
    backHome: "Volver al inicio",
    pillGames: "Minijuegos",
    pillFast: "Rápido y desafiante",
    pillBest: "Supera tu mejor puntuación",
    choose: "Elige tu desafío",
    sectionIntro: "Empieza con ¿Quién es el jugador? Poco a poco añadiremos más juegos de fútbol.",
    games: [],
  },

  fr: {
    eyebrow: "VOETIQ GAMES",
    title: "Que vaut ta culture football ?",
    subtitle:
      "Teste tes connaissances avec différents mini-jeux et améliore tes scores.",
    available: "Jouer maintenant",
    comingSoon: "Bientôt",
    play: "Jouer",
    soon: "Bientôt",
    dailyTitle: "Tu cherches le Daily ?",
    dailyText:
      "Le VoetIQ Daily reste séparé des mini-jeux avec un nouveau défi chaque jour.",
    dailyButton: "Voir le Daily",
    backHome: "Retour à l’accueil",
    pillGames: "Mini-jeux",
    pillFast: "Rapide et stimulant",
    pillBest: "Bats ton meilleur score",
    choose: "Choisis ton défi",
    sectionIntro: "Commence par Qui est le joueur ? De nouveaux jeux de football seront ajoutés progressivement.",
    games: [],
  },

  it: {
    eyebrow: "VOETIQ GAMES",
    title: "Quanto conosci il calcio?",
    subtitle:
      "Metti alla prova le tue conoscenze calcistiche con diversi minigiochi.",
    available: "Gioca ora",
    comingSoon: "Prossimamente",
    play: "Gioca",
    soon: "Prossimamente",
    dailyTitle: "Cerchi la Daily?",
    dailyText:
      "VoetIQ Daily rimane separata dai minigiochi con una nuova sfida ogni giorno.",
    dailyButton: "Vai alla Daily",
    backHome: "Torna alla Home",
    pillGames: "Minigiochi",
    pillFast: "Veloce e impegnativo",
    pillBest: "Batti il tuo record",
    choose: "Scegli la tua sfida",
    sectionIntro: "Inizia con Chi è il giocatore? Aggiungeremo sempre più giochi di calcio.",
    games: [],
  },

  pt: {
    eyebrow: "VOETIQ GAMES",
    title: "Quanto sabes de futebol?",
    subtitle:
      "Testa os teus conhecimentos de futebol com diferentes minijogos.",
    available: "Jogar agora",
    comingSoon: "Em breve",
    play: "Jogar",
    soon: "Em breve",
    dailyTitle: "Procuras a Daily?",
    dailyText:
      "A VoetIQ Daily continua separada dos minijogos com um novo desafio todos os dias.",
    dailyButton: "Ir para a Daily",
    backHome: "Voltar ao início",
    pillGames: "Minijogos",
    pillFast: "Rápido e desafiante",
    pillBest: "Supera a tua melhor pontuação",
    choose: "Escolhe o teu desafio",
    sectionIntro: "Começa com Quem é o jogador? Serão adicionados cada vez mais jogos de futebol.",
    games: [],
  },
};


const translatedGames: Record<Exclude<LanguageCode,"nl"|"en">, Game[]> = {
  de: [
    {id:"player",icon:"👤",title:"Wer ist der Spieler?",description:"Finde heraus, welchen Fußballer wir suchen. Du bekommst immer mehr Hinweise — errate ihn so früh wie möglich.",href:"/games/wie-is-de-speler",status:"available",badge:"ERSTES SPIEL"},
    {id:"stadium",icon:"🏟️",title:"Errate das Stadion",description:"Von weltberühmten Fußballtempeln bis zu kniffligen Stadien. Weißt du, welches Stadion du siehst?",href:"/games/raad-het-stadion",status:"available"},
    {id:"quiz",icon:"🧠",title:"Fußballquiz",description:"Zehn Fragen. Ein Ergebnis. Zeig, wie viel du wirklich über Fußball weißt.",href:"/games/voetbalquiz",status:"available"},
    {id:"link",icon:"🔗",title:"Player Link",description:"Verbinde zwei Fußballer über Vereine und Mitspieler. Findest du den kürzesten Weg?",href:"/games/player-link",status:"available"},
    {id:"country",icon:"🌍",title:"Errate das Fußballland",description:"Vereine, Spieler und Wettbewerbe geben dir Hinweise. Findest du das richtige Land?",href:"/games/raad-het-land",status:"available"}
  ],
  es: [
    {id:"player",icon:"👤",title:"¿Quién es el jugador?",description:"Descubre qué futbolista buscamos. Recibirás cada vez más pistas: adivínalo lo antes posible.",href:"/games/wie-is-de-speler",status:"available",badge:"PRIMER JUEGO"},
    {id:"stadium",icon:"🏟️",title:"Adivina el estadio",description:"Desde templos del fútbol mundialmente famosos hasta estadios difíciles. ¿Sabes qué estadio estás viendo?",href:"/games/raad-het-stadion",status:"available"},
    {id:"quiz",icon:"🧠",title:"Quiz de fútbol",description:"Diez preguntas. Una puntuación. Demuestra cuánto sabes realmente de fútbol.",href:"/games/voetbalquiz",status:"available"},
    {id:"link",icon:"🔗",title:"Player Link",description:"Conecta a dos futbolistas mediante clubes y compañeros de equipo. ¿Encuentras la ruta más corta?",href:"/games/player-link",status:"available"},
    {id:"country",icon:"🌍",title:"Adivina el país",description:"Clubes, jugadores y competiciones te dan pistas. ¿Puedes encontrar el país correcto?",href:"/games/raad-het-land",status:"available"}
  ],
  fr: [
    {id:"player",icon:"👤",title:"Qui est le joueur ?",description:"Découvre quel footballeur nous recherchons. Tu obtiens de plus en plus d’indices — trouve-le le plus tôt possible.",href:"/games/wie-is-de-speler",status:"available",badge:"PREMIER JEU"},
    {id:"stadium",icon:"🏟️",title:"Devine le stade",description:"Des temples du football mondialement connus aux stades plus difficiles. Sais-tu quel stade tu vois ?",href:"/games/raad-het-stadion",status:"available"},
    {id:"quiz",icon:"🧠",title:"Quiz football",description:"Dix questions. Un score. Montre ce que tu sais vraiment sur le football.",href:"/games/voetbalquiz",status:"available"},
    {id:"link",icon:"🔗",title:"Player Link",description:"Relie deux footballeurs grâce aux clubs et coéquipiers. Trouveras-tu le chemin le plus court ?",href:"/games/player-link",status:"available"},
    {id:"country",icon:"🌍",title:"Devine le pays",description:"Les clubs, joueurs et compétitions te donnent des indices. Trouveras-tu le bon pays ?",href:"/games/raad-het-land",status:"available"}
  ],
  it: [
    {id:"player",icon:"👤",title:"Chi è il giocatore?",description:"Scopri quale calciatore stiamo cercando. Riceverai sempre più indizi: indovinalo il prima possibile.",href:"/games/wie-is-de-speler",status:"available",badge:"PRIMO GIOCO"},
    {id:"stadium",icon:"🏟️",title:"Indovina lo stadio",description:"Dai templi del calcio famosi in tutto il mondo agli stadi più difficili. Sai quale stadio stai guardando?",href:"/games/raad-het-stadion",status:"available"},
    {id:"quiz",icon:"🧠",title:"Quiz di calcio",description:"Dieci domande. Un punteggio. Dimostra quanto conosci davvero il calcio.",href:"/games/voetbalquiz",status:"available"},
    {id:"link",icon:"🔗",title:"Player Link",description:"Collega due calciatori tramite club e compagni di squadra. Trovi il percorso più breve?",href:"/games/player-link",status:"available"},
    {id:"country",icon:"🌍",title:"Indovina il paese",description:"Club, giocatori e competizioni ti danno indizi. Riesci a trovare il paese giusto?",href:"/games/raad-het-land",status:"available"}
  ],
  pt: [
    {id:"player",icon:"👤",title:"Quem é o jogador?",description:"Descobre qual é o futebolista que procuramos. Recebes cada vez mais pistas — tenta adivinhar o mais cedo possível.",href:"/games/wie-is-de-speler",status:"available",badge:"PRIMEIRO JOGO"},
    {id:"stadium",icon:"🏟️",title:"Adivinha o estádio",description:"Dos templos do futebol mundialmente famosos aos estádios mais difíceis. Sabes que estádio estás a ver?",href:"/games/raad-het-stadion",status:"available"},
    {id:"quiz",icon:"🧠",title:"Quiz de futebol",description:"Dez perguntas. Uma pontuação. Mostra quanto sabes realmente de futebol.",href:"/games/voetbalquiz",status:"available"},
    {id:"link",icon:"🔗",title:"Player Link",description:"Liga dois futebolistas através de clubes e colegas de equipa. Encontras o caminho mais curto?",href:"/games/player-link",status:"available"},
    {id:"country",icon:"🌍",title:"Adivinha o país",description:"Clubes, jogadores e competições dão-te pistas. Consegues encontrar o país certo?",href:"/games/raad-het-land",status:"available"}
  ]
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value || "");
}

export default function GamesPage() {
  const [language, setLanguage] = useState<LanguageCode>("nl");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem("voetiq-language");

    if (isLanguageCode(storedLanguage)) {
      setLanguage(storedLanguage);
    }

    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const newLanguage = customEvent.detail?.language;

      if (isLanguageCode(newLanguage || null)) {
        setLanguage(newLanguage as LanguageCode);
      }
    };

    window.addEventListener("voetiq-language-change", handleLanguageChange);

    return () => {
      window.removeEventListener(
        "voetiq-language-change",
        handleLanguageChange
      );
    };
  }, []);

  const fallbackGames = copy.nl.games;
  const t = copy[language];

  const games = t.games.length > 0 ? t.games : (language === "nl" || language === "en" ? fallbackGames : translatedGames[language]);

  return (
    <main className="games-page">
      <section className="games-hero">
        <div className="hero-glow hero-glow-one" />
        <div className="hero-glow hero-glow-two" />

        <div className="games-container hero-content">
          <div className="hero-kicker">
            <span className="kicker-dot" />
            {t.eyebrow}
          </div>

          <h1>{t.title}</h1>

          <p>{t.subtitle}</p>

          <div className="hero-pills">
            <div>
              <span>🎮</span>
              {t.pillGames}
            </div>
            <div>
              <span>⚡</span>
              {t.pillFast}
            </div>
            <div>
              <span>🏆</span>
              {t.pillBest}
            </div>
          </div>
        </div>
      </section>

      <section className="games-section">
        <div className="games-container">
          <div className="section-heading">
            <div>
              <span className="section-label">🎮 GAMES</span>
              <h2>{t.choose}</h2>
            </div>

            <p>{t.sectionIntro}</p>
          </div>

          <div className="games-grid">
            {games.map((game, index) => {
              const available = game.status === "available";

              const content = (
                <>
                  <div className="game-card-top">
                    <div className="game-icon">{game.icon}</div>

                    <div
                      className={
                        available
                          ? "game-status available"
                          : "game-status coming"
                      }
                    >
                      {available ? t.available : t.comingSoon}
                    </div>
                  </div>

                  {game.badge && (
                    <div className="game-badge">{game.badge}</div>
                  )}

                  <h3>{game.title}</h3>
                  <p>{game.description}</p>

                  <div className="game-card-footer">
                    <span
                      className={
                        available ? "game-button active" : "game-button"
                      }
                    >
                      {available ? (
                        <>
                          {t.play}
                          <span className="arrow">→</span>
                        </>
                      ) : (
                        t.soon
                      )}
                    </span>
                  </div>

                  {available && <div className="card-shine" />}
                </>
              );

              if (available) {
                return (
                  <Link
                    href={game.href}
                    className="game-card playable"
                    key={game.id}
                    style={{ animationDelay: `${index * 70}ms` }}
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <div
                  className="game-card disabled"
                  key={game.id}
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  {content}
                </div>
              );
            })}
          </div>

          <div className="daily-banner">
            <div className="daily-icon">⚡</div>

            <div className="daily-copy">
              <span>VOETIQ DAILY</span>
              <h3>{t.dailyTitle}</h3>
              <p>{t.dailyText}</p>
            </div>

            <Link href="/daily" className="daily-button">
              {t.dailyButton}
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        .games-page {
          min-height: calc(100vh - 86px);
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(46, 230, 129, 0.08),
              transparent 32%
            ),
            #03140d;
          color: white;
        }

        .games-container {
          width: min(1180px, calc(100% - 40px));
          margin: 0 auto;
        }

        .games-hero {
          position: relative;
          overflow: hidden;
          padding: 82px 0 70px;
          border-bottom: 1px solid rgba(46, 230, 129, 0.09);
          background:
            linear-gradient(
              180deg,
              rgba(5, 30, 19, 0.9),
              rgba(3, 20, 13, 0.95)
            );
        }

        .hero-content {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .hero-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(10px);
          pointer-events: none;
        }

        .hero-glow-one {
          width: 420px;
          height: 420px;
          top: -270px;
          left: calc(50% - 210px);
          background: rgba(46, 230, 129, 0.12);
        }

        .hero-glow-two {
          width: 260px;
          height: 260px;
          right: 4%;
          bottom: -180px;
          background: rgba(46, 230, 129, 0.05);
        }

        .hero-kicker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin-bottom: 19px;
          padding: 8px 13px;
          border: 1px solid rgba(46, 230, 129, 0.18);
          border-radius: 999px;
          background: rgba(46, 230, 129, 0.06);
          color: #72f0aa;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .kicker-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2ee681;
          box-shadow: 0 0 12px rgba(46, 230, 129, 0.8);
        }

        .games-hero h1 {
          max-width: 800px;
          margin: 0;
          font-size: clamp(38px, 5vw, 65px);
          line-height: 1.02;
          letter-spacing: -2.6px;
          font-weight: 950;
        }

        .games-hero h1 span {
          color: #2ee681;
        }

        .games-hero > .hero-content > p {
          max-width: 690px;
          margin: 22px auto 0;
          color: #9db3a7;
          font-size: 16px;
          line-height: 1.75;
        }

        .hero-pills {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 31px;
        }

        .hero-pills div {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 9px 13px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.025);
          color: #bdd0c6;
          font-size: 12px;
          font-weight: 750;
        }

        .games-section {
          padding: 64px 0 90px;
        }

        .section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 35px;
          margin-bottom: 28px;
        }

        .section-label {
          display: block;
          margin-bottom: 7px;
          color: #2ee681;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 1.6px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 29px;
          letter-spacing: -0.8px;
          font-weight: 900;
        }

        .section-heading > p {
          max-width: 440px;
          margin: 0;
          color: #779083;
          font-size: 13px;
          line-height: 1.65;
          text-align: right;
        }

        .games-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 17px;
        }

        .game-card {
          position: relative;
          min-height: 310px;
          padding: 23px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 16px;
          background:
            linear-gradient(
              145deg,
              rgba(8, 34, 22, 0.96),
              rgba(5, 25, 16, 0.96)
            );
          text-decoration: none;
          color: white;
          animation: cardAppear 0.45s ease both;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .game-card.playable {
          cursor: pointer;
          border-color: rgba(46, 230, 129, 0.2);
        }

        .game-card.playable:hover {
          transform: translateY(-5px);
          border-color: rgba(46, 230, 129, 0.5);
          box-shadow:
            0 18px 50px rgba(0, 0, 0, 0.25),
            0 0 30px rgba(46, 230, 129, 0.04);
        }

        .game-card.disabled {
          opacity: 0.66;
        }

        .game-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .game-icon {
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(46, 230, 129, 0.14);
          border-radius: 14px;
          background: rgba(46, 230, 129, 0.07);
          font-size: 25px;
        }

        .game-status {
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .game-status.available {
          color: #60eda0;
          border: 1px solid rgba(46, 230, 129, 0.18);
          background: rgba(46, 230, 129, 0.07);
        }

        .game-status.coming {
          color: #899b91;
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.03);
        }

        .game-badge {
          width: fit-content;
          margin-top: 18px;
          padding: 5px 8px;
          border-radius: 6px;
          background: #2ee681;
          color: #032014;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        .game-card h3 {
          margin: 18px 0 9px;
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.4px;
        }

        .game-card p {
          margin: 0;
          color: #82998d;
          font-size: 13px;
          line-height: 1.65;
        }

        .game-card-footer {
          margin-top: auto;
          padding-top: 23px;
        }

        .game-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #70867a;
          font-size: 12px;
          font-weight: 850;
        }

        .game-button.active {
          color: #50eb94;
        }

        .game-button .arrow {
          transition: transform 0.2s ease;
        }

        .game-card.playable:hover .arrow {
          transform: translateX(4px);
        }

        .card-shine {
          position: absolute;
          width: 150px;
          height: 150px;
          right: -90px;
          bottom: -90px;
          border-radius: 50%;
          background: rgba(46, 230, 129, 0.07);
          filter: blur(4px);
          pointer-events: none;
        }

        .daily-banner {
          margin-top: 34px;
          padding: 24px 27px;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 21px;
          border: 1px solid rgba(46, 230, 129, 0.16);
          border-radius: 16px;
          background:
            linear-gradient(
              90deg,
              rgba(46, 230, 129, 0.07),
              rgba(7, 29, 19, 0.85)
            );
        }

        .daily-icon {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: rgba(46, 230, 129, 0.1);
          font-size: 26px;
        }

        .daily-copy > span {
          color: #42e98c;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1.5px;
        }

        .daily-copy h3 {
          margin: 4px 0 4px;
          font-size: 18px;
        }

        .daily-copy p {
          margin: 0;
          color: #80988b;
          font-size: 12px;
          line-height: 1.55;
        }

        .daily-button {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          padding: 11px 15px;
          border-radius: 9px;
          background: #2ee681;
          color: #032014;
          text-decoration: none;
          font-size: 11px;
          font-weight: 900;
          transition:
            transform 0.18s ease,
            background 0.18s ease;
        }

        .daily-button:hover {
          transform: translateY(-2px);
          background: #4bef99;
        }

        @keyframes cardAppear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .games-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }

          .section-heading > p {
            text-align: left;
          }
        }

        @media (max-width: 640px) {
          .games-container {
            width: min(100% - 28px, 1180px);
          }

          .games-hero {
            padding: 57px 0 49px;
          }

          .games-hero h1 {
            font-size: 39px;
            letter-spacing: -1.8px;
          }

          .games-hero > .hero-content > p {
            font-size: 14px;
          }

          .hero-pills {
            margin-top: 25px;
          }

          .games-section {
            padding: 43px 0 65px;
          }

          .games-grid {
            grid-template-columns: 1fr;
          }

          .game-card {
            min-height: 270px;
          }

          .daily-banner {
            grid-template-columns: auto 1fr;
            padding: 20px;
          }

          .daily-button {
            grid-column: 1 / -1;
            justify-content: center;
          }
        }
      `}</style>
    </main>
  );
}
