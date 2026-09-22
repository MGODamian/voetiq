"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Player = {
  id: string;
  name: string;
  country: string;
  clubs: string[];
};

type Puzzle = {
  start: string;
  target: string;
  par: number;
};

const PLAYERS: Player[] = [
  { id: "frenkie", name: "Frenkie de Jong", country: "🇳🇱", clubs: ["Ajax", "FC Barcelona"] },
  { id: "de-ligt", name: "Matthijs de Ligt", country: "🇳🇱", clubs: ["Ajax", "Juventus", "Bayern München", "Manchester United"] },
  { id: "vdb", name: "Donny van de Beek", country: "🇳🇱", clubs: ["Ajax", "Manchester United", "Everton", "Eintracht Frankfurt", "Girona"] },
  { id: "ziyech", name: "Hakim Ziyech", country: "🇲🇦", clubs: ["FC Twente", "Ajax", "Chelsea", "Galatasaray"] },
  { id: "onana", name: "André Onana", country: "🇨🇲", clubs: ["Ajax", "Inter", "Manchester United"] },
  { id: "blind", name: "Daley Blind", country: "🇳🇱", clubs: ["Ajax", "Manchester United", "Bayern München", "Girona"] },
  { id: "suarez", name: "Luis Suárez", country: "🇺🇾", clubs: ["Ajax", "Liverpool", "FC Barcelona", "Atlético Madrid", "Grêmio", "Inter Miami"] },
  { id: "eriksen", name: "Christian Eriksen", country: "🇩🇰", clubs: ["Ajax", "Tottenham Hotspur", "Inter", "Brentford", "Manchester United"] },
  { id: "ibrahimovic", name: "Zlatan Ibrahimović", country: "🇸🇪", clubs: ["Ajax", "Juventus", "Inter", "FC Barcelona", "AC Milan", "Paris Saint-Germain", "Manchester United", "LA Galaxy"] },
  { id: "messi", name: "Lionel Messi", country: "🇦🇷", clubs: ["FC Barcelona", "Paris Saint-Germain", "Inter Miami"] },
  { id: "neymar", name: "Neymar", country: "🇧🇷", clubs: ["Santos", "FC Barcelona", "Paris Saint-Germain", "Al-Hilal"] },
  { id: "mbappe", name: "Kylian Mbappé", country: "🇫🇷", clubs: ["AS Monaco", "Paris Saint-Germain", "Real Madrid"] },
  { id: "ronaldo", name: "Cristiano Ronaldo", country: "🇵🇹", clubs: ["Sporting CP", "Manchester United", "Real Madrid", "Juventus", "Al-Nassr"] },
  { id: "benzema", name: "Karim Benzema", country: "🇫🇷", clubs: ["Olympique Lyon", "Real Madrid", "Al-Ittihad"] },
  { id: "modric", name: "Luka Modrić", country: "🇭🇷", clubs: ["Dinamo Zagreb", "Tottenham Hotspur", "Real Madrid", "AC Milan"] },
  { id: "bale", name: "Gareth Bale", country: "🏴", clubs: ["Southampton", "Tottenham Hotspur", "Real Madrid", "Los Angeles FC"] },
  { id: "kroos", name: "Toni Kroos", country: "🇩🇪", clubs: ["Bayern München", "Bayer Leverkusen", "Real Madrid"] },
  { id: "lewandowski", name: "Robert Lewandowski", country: "🇵🇱", clubs: ["Lech Poznań", "Borussia Dortmund", "Bayern München", "FC Barcelona"] },
  { id: "haaland", name: "Erling Haaland", country: "🇳🇴", clubs: ["Molde", "Red Bull Salzburg", "Borussia Dortmund", "Manchester City"] },
  { id: "gundogan", name: "İlkay Gündoğan", country: "🇩🇪", clubs: ["1. FC Nürnberg", "Borussia Dortmund", "Manchester City", "FC Barcelona"] },
  { id: "debruyne", name: "Kevin De Bruyne", country: "🇧🇪", clubs: ["Genk", "Chelsea", "Werder Bremen", "VfL Wolfsburg", "Manchester City", "Napoli"] },
  { id: "salah", name: "Mohamed Salah", country: "🇪🇬", clubs: ["Basel", "Chelsea", "Fiorentina", "AS Roma", "Liverpool"] },
  { id: "vandijk", name: "Virgil van Dijk", country: "🇳🇱", clubs: ["FC Groningen", "Celtic", "Southampton", "Liverpool"] },
  { id: "mane", name: "Sadio Mané", country: "🇸🇳", clubs: ["Metz", "Red Bull Salzburg", "Southampton", "Liverpool", "Bayern München", "Al-Nassr"] },
  { id: "kane", name: "Harry Kane", country: "🏴", clubs: ["Tottenham Hotspur", "Bayern München"] },
  { id: "son", name: "Son Heung-min", country: "🇰🇷", clubs: ["Hamburger SV", "Bayer Leverkusen", "Tottenham Hotspur", "Los Angeles FC"] },
  { id: "hazard", name: "Eden Hazard", country: "🇧🇪", clubs: ["Lille", "Chelsea", "Real Madrid"] },
  { id: "courtois", name: "Thibaut Courtois", country: "🇧🇪", clubs: ["Genk", "Chelsea", "Atlético Madrid", "Real Madrid"] },
  { id: "griezmann", name: "Antoine Griezmann", country: "🇫🇷", clubs: ["Real Sociedad", "Atlético Madrid", "FC Barcelona"] },
  { id: "aguero", name: "Sergio Agüero", country: "🇦🇷", clubs: ["Independiente", "Atlético Madrid", "Manchester City", "FC Barcelona"] },
  { id: "di-maria", name: "Ángel Di María", country: "🇦🇷", clubs: ["Rosario Central", "Benfica", "Real Madrid", "Manchester United", "Paris Saint-Germain", "Juventus"] },
  { id: "pogba", name: "Paul Pogba", country: "🇫🇷", clubs: ["Manchester United", "Juventus"] },
  { id: "sancho", name: "Jadon Sancho", country: "🏴", clubs: ["Borussia Dortmund", "Manchester United", "Chelsea"] },
  { id: "pulisic", name: "Christian Pulisic", country: "🇺🇸", clubs: ["Borussia Dortmund", "Chelsea", "AC Milan"] },
];

const PUZZLES: Puzzle[] = [
  { start: "frenkie", target: "haaland", par: 1 },
  { start: "messi", target: "ronaldo", par: 1 },
  { start: "vandijk", target: "mbappe", par: 2 },
  { start: "salah", target: "lewandowski", par: 2 },
  { start: "de-ligt", target: "messi", par: 1 },
  { start: "kane", target: "neymar", par: 2 },
  { start: "ziyech", target: "ronaldo", par: 2 },
  { start: "haaland", target: "benzema", par: 2 },
  { start: "suarez", target: "debruyne", par: 2 },
  { start: "eriksen", target: "mbappe", par: 2 },
  { start: "son", target: "ronaldo", par: 2 },
  { start: "courtois", target: "haaland", par: 2 },
];

function getPlayer(id: string) {
  return PLAYERS.find((player) => player.id === id)!;
}

function sharedClubs(a: Player, b: Player) {
  return a.clubs.filter((club) => b.clubs.includes(club));
}

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function PlayerLinkPage() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [route, setRoute] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [hint, setHint] = useState("");

  const startNewPuzzle = () => {
    const next = shuffle(PUZZLES)[0];
    setPuzzle(next);
    setRoute([next.start]);
    setQuery("");
    setMessage("");
    setFinished(false);
    setHintUsed(false);
    setHint("");
  };

  useEffect(() => {
    startNewPuzzle();
  }, []);

  const start = puzzle ? getPlayer(puzzle.start) : null;
  const target = puzzle ? getPlayer(puzzle.target) : null;
  const current = route.length ? getPlayer(route[route.length - 1]) : null;

  const suggestions = useMemo(() => {
    if (!query.trim() || !current || !puzzle) return [];

    const normalized = query.toLocaleLowerCase("nl");
    return PLAYERS.filter(
      (player) =>
        player.id !== current.id &&
        player.id !== puzzle.start &&
        !route.includes(player.id) &&
        player.name.toLocaleLowerCase("nl").includes(normalized)
    ).slice(0, 7);
  }, [query, current, puzzle, route]);

  const connections = Math.max(0, route.length - 1);

  const addPlayer = (player: Player) => {
    if (!current || !puzzle || finished) return;

    const clubs = sharedClubs(current, player);

    if (clubs.length === 0) {
      setMessage(
        `${current.name} en ${player.name} hebben in deze game geen gezamenlijke club.`
      );
      setQuery("");
      return;
    }

    const newRoute = [...route, player.id];
    setRoute(newRoute);
    setQuery("");
    setMessage(`✓ Verbonden via ${clubs[0]}`);

    if (player.id === puzzle.target) {
      setFinished(true);
    }
  };

  const undo = () => {
    if (route.length <= 1 || finished) return;
    setRoute((value) => value.slice(0, -1));
    setMessage("");
    setHint("");
  };

  const revealHint = () => {
    if (!current || !target || !puzzle || finished) return;

    const direct = sharedClubs(current, target);
    if (direct.length > 0) {
      setHint(`Je kunt ${target.name} direct verbinden via ${direct[0]}.`);
      setHintUsed(true);
      return;
    }

    const possible = PLAYERS.find((candidate) => {
      if (route.includes(candidate.id) || candidate.id === target.id) return false;
      return (
        sharedClubs(current, candidate).length > 0 &&
        sharedClubs(candidate, target).length > 0
      );
    });

    if (possible) {
      setHint(`Probeer eens te zoeken naar ${possible.name}.`);
    } else {
      setHint(`Zoek een speler die een club deelt met ${current.name}.`);
    }

    setHintUsed(true);
  };

  const score = finished
    ? Math.max(
        100,
        1000 - Math.max(0, connections - (puzzle?.par ?? 0)) * 200 - (hintUsed ? 150 : 0)
      )
    : 0;

  if (!puzzle || !start || !target || !current) {
    return (
      <main className="player-link-page">
        <div className="loading">Player Link laden...</div>
      </main>
    );
  }

  return (
    <main className="player-link-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <div className="shell">
        <div className="topbar">
          <Link href="/games" className="back">
            ← Games
          </Link>
          <div className="brand">
            <span />
            VOETIQ GAMES
          </div>
        </div>

        <section className="hero">
          <span className="eyebrow">🔗 PLAYER LINK</span>
          <h1>
            Verbind de <span>spelers.</span>
          </h1>
          <p>
            Bouw een route tussen twee voetballers. Twee spelers zijn verbonden
            wanneer ze allebei voor dezelfde club hebben gespeeld.
          </p>
        </section>

        <section className="mission">
          <div className="player-box">
            <span className="label">START</span>
            <div className="flag">{start.country}</div>
            <strong>{start.name}</strong>
          </div>

          <div className="mission-center">
            <span>PAR {puzzle.par}</span>
            <div className="link-line">
              <i />
              <b>→</b>
              <i />
            </div>
            <small>{connections} verbinding{connections === 1 ? "" : "en"}</small>
          </div>

          <div className="player-box target">
            <span className="label">DOEL</span>
            <div className="flag">{target.country}</div>
            <strong>{target.name}</strong>
          </div>
        </section>

        {!finished ? (
          <section className="game-card">
            <div className="route-header">
              <div>
                <span>JOUW ROUTE</span>
                <strong>Van {start.name} naar {target.name}</strong>
              </div>
              <button type="button" onClick={undo} disabled={route.length <= 1}>
                ↶ Stap terug
              </button>
            </div>

            <div className="route">
              {route.map((id, index) => {
                const player = getPlayer(id);
                const previous = index > 0 ? getPlayer(route[index - 1]) : null;
                const club = previous ? sharedClubs(previous, player)[0] : "";

                return (
                  <div className="route-part" key={`${id}-${index}`}>
                    {index > 0 && (
                      <div className="club-connection">
                        <span>{club}</span>
                        <i>→</i>
                      </div>
                    )}
                    <div className="route-player">
                      <span>{player.country}</span>
                      <strong>{player.name}</strong>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="current-label">
              Voeg een speler toe die een club deelt met{" "}
              <strong>{current.name}</strong>
            </div>

            <div className="search-wrap">
              <div className="search-box">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setMessage("");
                  }}
                  placeholder="Zoek een speler..."
                  autoComplete="off"
                />
              </div>

              {suggestions.length > 0 && (
                <div className="suggestions">
                  {suggestions.map((player) => {
                    const clubs = sharedClubs(current, player);
                    return (
                      <button
                        type="button"
                        key={player.id}
                        onClick={() => addPlayer(player)}
                      >
                        <span className="suggestion-flag">{player.country}</span>
                        <span className="suggestion-name">{player.name}</span>
                        {clubs.length > 0 && (
                          <span className="possible">Mogelijke link</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {message && (
              <div className={message.startsWith("✓") ? "message good" : "message bad"}>
                {message}
              </div>
            )}

            <div className="tools">
              <button type="button" className="hint-button" onClick={revealHint}>
                💡 Geef een hint
              </button>
              <span>
                Een hint kost <strong>150 punten</strong> van je eindscore.
              </span>
            </div>

            {hint && <div className="hint">💡 {hint}</div>}

            <div className="rules">
              <strong>Hoe werkt het?</strong>
              <p>
                Kies steeds een speler die minstens één club deelt met de vorige
                speler. Je hoeft niet in dezelfde periode teamgenoten te zijn
                geweest. Bereik de doelspeler in zo weinig mogelijk verbindingen.
              </p>
            </div>
          </section>
        ) : (
          <section className="finish-card">
            <div className="trophy">{connections <= puzzle.par ? "🏆" : "⚽"}</div>
            <span className="eyebrow">ROUTE VOLTOOID</span>
            <h2>
              Link <span>gevonden!</span>
            </h2>
            <p>
              Je verbond <strong>{start.name}</strong> met{" "}
              <strong>{target.name}</strong> in {connections} verbinding
              {connections === 1 ? "" : "en"}.
            </p>

            <div className="score">
              <span>SCORE</span>
              <strong>{score}</strong>
              <small>punten</small>
            </div>

            <div className="finish-stats">
              <div>
                <span>Jouw route</span>
                <strong>{connections}</strong>
              </div>
              <div>
                <span>Par</span>
                <strong>{puzzle.par}</strong>
              </div>
              <div>
                <span>Hint gebruikt</span>
                <strong>{hintUsed ? "Ja" : "Nee"}</strong>
              </div>
            </div>

            <div className="completed-route">
              {route.map((id, index) => (
                <span key={`${id}-finish`}>
                  {index > 0 && <i>→</i>}
                  {getPlayer(id).name}
                </span>
              ))}
            </div>

            <div className="finish-actions">
              <button type="button" onClick={startNewPuzzle}>
                ↻ Nieuwe puzzel
              </button>
              <Link href="/games">Terug naar Games</Link>
            </div>
          </section>
        )}
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }

        .player-link-page {
          position: relative;
          min-height: calc(100vh - 86px);
          overflow: hidden;
          padding: 38px 0 80px;
          background:
            radial-gradient(circle at 50% 0%, rgba(46,230,129,.09), transparent 31%),
            #03140d;
          color: white;
        }

        .shell {
          position: relative;
          z-index: 2;
          width: min(930px, calc(100% - 36px));
          margin: 0 auto;
        }

        .ambient {
          position: absolute;
          border-radius: 50%;
          filter: blur(20px);
          pointer-events: none;
        }

        .ambient-one {
          width: 420px;
          height: 420px;
          top: -300px;
          left: calc(50% - 210px);
          background: rgba(46,230,129,.12);
        }

        .ambient-two {
          width: 300px;
          height: 300px;
          right: -180px;
          bottom: 10%;
          background: rgba(46,230,129,.05);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 42px;
        }

        .back {
          color: #91a99c;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
          transition: color .18s ease, transform .18s ease;
        }

        .back:hover {
          color: #2ee681;
          transform: translateX(-2px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #69efa4;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1.5px;
        }

        .brand > span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2ee681;
          box-shadow: 0 0 12px rgba(46,230,129,.8);
        }

        .hero {
          margin-bottom: 29px;
          text-align: center;
        }

        .eyebrow {
          display: inline-block;
          margin-bottom: 11px;
          color: #59eb9a;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 1.4px;
        }

        .hero h1 {
          margin: 0;
          font-size: clamp(36px, 5vw, 52px);
          line-height: 1;
          letter-spacing: -2px;
          font-weight: 950;
        }

        .hero h1 span,
        .finish-card h2 span {
          color: #2ee681;
        }

        .hero p {
          max-width: 630px;
          margin: 14px auto 0;
          color: #859e91;
          font-size: 13px;
          line-height: 1.65;
        }

        .mission {
          display: grid;
          grid-template-columns: 1fr 170px 1fr;
          align-items: stretch;
          gap: 12px;
          margin-bottom: 18px;
        }

        .player-box {
          min-height: 118px;
          padding: 17px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          border: 1px solid rgba(46,230,129,.15);
          border-radius: 14px;
          background: rgba(46,230,129,.045);
        }

        .player-box.target {
          text-align: right;
          align-items: flex-end;
        }

        .player-box .label {
          color: #62e99e;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1.4px;
        }

        .player-box .flag {
          margin: 8px 0 3px;
          font-size: 20px;
        }

        .player-box strong {
          font-size: 16px;
        }

        .mission-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #6f897c;
        }

        .mission-center > span {
          color: #48e890;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1.2px;
        }

        .mission-center small {
          font-size: 9px;
        }

        .link-line {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 8px 0;
        }

        .link-line i {
          height: 1px;
          flex: 1;
          background: rgba(46,230,129,.18);
        }

        .link-line b {
          color: #2ee681;
          font-size: 16px;
        }

        .game-card,
        .finish-card {
          padding: 27px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(8,34,22,.97), rgba(5,25,16,.97));
          box-shadow: 0 25px 70px rgba(0,0,0,.18);
        }

        .route-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 20px;
        }

        .route-header span {
          display: block;
          margin-bottom: 4px;
          color: #5be99a;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1.2px;
        }

        .route-header strong {
          font-size: 13px;
        }

        .route-header button {
          padding: 8px 10px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 8px;
          background: rgba(255,255,255,.03);
          color: #8fa49a;
          cursor: pointer;
          font-size: 9px;
          font-weight: 800;
        }

        .route-header button:disabled {
          opacity: .35;
          cursor: default;
        }

        .route {
          min-height: 84px;
          padding: 13px;
          display: flex;
          align-items: center;
          overflow-x: auto;
          border: 1px solid rgba(46,230,129,.1);
          border-radius: 12px;
          background: rgba(46,230,129,.025);
        }

        .route-part {
          display: flex;
          align-items: center;
          flex: 0 0 auto;
        }

        .route-player {
          min-width: 125px;
          padding: 11px 12px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 9px;
          background: rgba(255,255,255,.035);
        }

        .route-player span {
          display: block;
          margin-bottom: 3px;
          font-size: 15px;
        }

        .route-player strong {
          font-size: 10px;
        }

        .club-connection {
          width: 105px;
          padding: 0 8px;
          text-align: center;
        }

        .club-connection span {
          display: block;
          color: #6f897c;
          font-size: 8px;
          line-height: 1.2;
        }

        .club-connection i {
          display: block;
          margin-top: 4px;
          color: #2ee681;
          font-style: normal;
        }

        .current-label {
          margin: 22px 0 9px;
          color: #82998d;
          font-size: 10px;
        }

        .current-label strong {
          color: #bcd0c5;
        }

        .search-wrap {
          position: relative;
        }

        .search-box {
          height: 51px;
          padding: 0 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px;
          background: rgba(255,255,255,.03);
        }

        .search-box > span {
          color: #65e99e;
          font-size: 20px;
        }

        .search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font: inherit;
          font-size: 12px;
        }

        .search-box input::placeholder {
          color: #61796c;
        }

        .suggestions {
          position: absolute;
          z-index: 20;
          top: calc(100% + 7px);
          left: 0;
          right: 0;
          overflow: hidden;
          border: 1px solid rgba(46,230,129,.14);
          border-radius: 10px;
          background: #071f15;
          box-shadow: 0 20px 45px rgba(0,0,0,.35);
        }

        .suggestions button {
          width: 100%;
          min-height: 46px;
          padding: 8px 12px;
          display: flex;
          align-items: center;
          gap: 10px;
          border: 0;
          border-bottom: 1px solid rgba(255,255,255,.045);
          background: transparent;
          color: #d9e5de;
          cursor: pointer;
          text-align: left;
        }

        .suggestions button:last-child {
          border-bottom: 0;
        }

        .suggestions button:hover {
          background: rgba(46,230,129,.07);
        }

        .suggestion-flag {
          font-size: 16px;
        }

        .suggestion-name {
          font-size: 11px;
          font-weight: 800;
        }

        .possible {
          margin-left: auto;
          color: #4be992;
          font-size: 8px;
          font-weight: 900;
        }

        .message,
        .hint {
          margin-top: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          font-size: 10px;
        }

        .message.good {
          border: 1px solid rgba(46,230,129,.14);
          background: rgba(46,230,129,.05);
          color: #64eaa0;
        }

        .message.bad {
          border: 1px solid rgba(255,90,90,.15);
          background: rgba(255,90,90,.045);
          color: #ff9a9a;
        }

        .tools {
          margin-top: 18px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hint-button {
          padding: 9px 11px;
          border: 1px solid rgba(46,230,129,.16);
          border-radius: 8px;
          background: rgba(46,230,129,.06);
          color: #69eca3;
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
        }

        .tools > span {
          color: #657d70;
          font-size: 9px;
        }

        .tools > span strong {
          color: #8ea399;
        }

        .hint {
          border: 1px solid rgba(255,204,77,.12);
          background: rgba(255,204,77,.045);
          color: #d8c887;
        }

        .rules {
          margin-top: 21px;
          padding-top: 18px;
          border-top: 1px solid rgba(255,255,255,.055);
        }

        .rules strong {
          color: #9fb3a8;
          font-size: 9px;
        }

        .rules p {
          margin: 5px 0 0;
          color: #637a6e;
          font-size: 9px;
          line-height: 1.55;
        }

        .finish-card {
          max-width: 720px;
          margin: 25px auto 0;
          text-align: center;
        }

        .trophy {
          width: 72px;
          height: 72px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(46,230,129,.16);
          border-radius: 18px;
          background: rgba(46,230,129,.07);
          font-size: 32px;
        }

        .finish-card h2 {
          margin: 0;
          font-size: 38px;
          letter-spacing: -1.4px;
        }

        .finish-card > p {
          color: #849b8f;
          font-size: 12px;
          line-height: 1.6;
        }

        .score {
          width: 180px;
          margin: 22px auto;
          padding: 17px;
          border-radius: 13px;
          background: rgba(46,230,129,.07);
        }

        .score span,
        .score small {
          display: block;
          color: #718a7d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .score strong {
          display: block;
          color: #2ee681;
          font-size: 38px;
        }

        .finish-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
        }

        .finish-stats div {
          padding: 13px;
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 9px;
          background: rgba(255,255,255,.02);
        }

        .finish-stats span {
          display: block;
          margin-bottom: 4px;
          color: #6f867a;
          font-size: 8px;
        }

        .finish-stats strong {
          font-size: 14px;
        }

        .completed-route {
          margin: 18px 0 22px;
          padding: 12px;
          border-radius: 9px;
          background: rgba(255,255,255,.02);
          color: #91a69b;
          font-size: 9px;
          line-height: 2;
        }

        .completed-route span i {
          margin: 0 8px;
          color: #2ee681;
          font-style: normal;
        }

        .finish-actions {
          display: flex;
          justify-content: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .finish-actions button,
        .finish-actions a {
          padding: 11px 15px;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
        }

        .finish-actions button {
          border: 0;
          background: #2ee681;
          color: #032014;
        }

        .finish-actions a {
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03);
          color: #9db0a6;
        }

        .loading {
          padding-top: 100px;
          color: #8ba095;
          text-align: center;
        }

        @media (max-width: 680px) {
          .player-link-page { padding-top: 24px; }

          .topbar { margin-bottom: 32px; }

          .brand { display: none; }

          .mission {
            grid-template-columns: 1fr 62px 1fr;
          }

          .mission-center > span { font-size: 7px; }
          .mission-center small { font-size: 7px; }

          .player-box {
            min-height: 105px;
            padding: 13px;
          }

          .player-box strong { font-size: 12px; }

          .game-card,
          .finish-card {
            padding: 20px;
          }

          .route-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .tools {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (max-width: 430px) {
          .hero h1 { font-size: 38px; }

          .mission {
            grid-template-columns: 1fr;
          }

          .mission-center {
            min-height: 45px;
          }

          .link-line {
            max-width: 140px;
          }

          .player-box.target {
            text-align: left;
            align-items: flex-start;
          }

          .finish-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
