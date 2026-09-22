"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Country = {
  name: string;
  aliases?: string[];
  hints: string[];
};

const COUNTRIES: Country[] = [
  { name: "Nederland", aliases: ["Holland"], hints: ["Een van de bekendste clubs uit dit land is Ajax.", "De hoogste competitie heet de Eredivisie.", "Het nationale elftal speelt traditioneel in oranje.", "Johan Cruijff is een van de grootste voetbaliconen uit dit land.", "De hoofdstad is Amsterdam."] },
  { name: "Engeland", hints: ["Clubs als Liverpool en Manchester United komen uit dit land.", "De hoogste competitie heet de Premier League.", "Wembley is het nationale stadion.", "Het nationale team wordt vaak The Three Lions genoemd.", "De hoofdstad is Londen."] },
  { name: "Spanje", hints: ["Real Madrid en FC Barcelona spelen in dit land.", "De hoogste competitie heet LaLiga.", "Dit land werd wereldkampioen in 2010.", "Clubs uit Madrid, Barcelona en Sevilla zijn internationaal bekend.", "De hoofdstad is Madrid."] },
  { name: "Duitsland", hints: ["Bayern München en Borussia Dortmund spelen hier.", "De hoogste competitie heet de Bundesliga.", "Het land werd wereldkampioen in 2014.", "De nationale beker heet de DFB-Pokal.", "De hoofdstad is Berlijn."] },
  { name: "Italië", hints: ["Juventus, AC Milan en Inter komen uit dit land.", "De hoogste competitie heet Serie A.", "Het nationale elftal wordt de Azzurri genoemd.", "Dit land werd wereldkampioen in 2006.", "De hoofdstad is Rome."] },
  { name: "Frankrijk", hints: ["Paris Saint-Germain speelt in dit land.", "De hoogste competitie heet Ligue 1.", "Dit land werd wereldkampioen in 2018.", "Kylian Mbappé komt uit dit land.", "De hoofdstad is Parijs."] },
  { name: "Portugal", hints: ["Benfica, Porto en Sporting CP spelen hier.", "De hoogste competitie heet de Primeira Liga.", "Dit land won het EK van 2016.", "Cristiano Ronaldo komt uit dit land.", "De hoofdstad is Lissabon."] },
  { name: "België", hints: ["Club Brugge en Anderlecht zijn bekende clubs uit dit land.", "De nationale ploeg wordt de Rode Duivels genoemd.", "Kevin De Bruyne komt uit dit land.", "Het land grenst aan Nederland en Frankrijk.", "De hoofdstad is Brussel."] },
  { name: "Argentinië", hints: ["Boca Juniors en River Plate zijn grote rivalen uit dit land.", "Dit land won het WK van 2022.", "Diego Maradona kwam uit dit land.", "Lionel Messi komt uit dit land.", "De hoofdstad is Buenos Aires."] },
  { name: "Brazilië", hints: ["Santos, Flamengo en Palmeiras zijn bekende clubs uit dit land.", "Het nationale team speelt beroemd genoeg vaak in geel.", "Pelé kwam uit dit land.", "Dit land won vijf WK-titels bij de mannen.", "De hoofdstad is Brasília."] },
  { name: "Uruguay", hints: ["Peñarol en Nacional zijn grote clubs uit dit land.", "Dit land won het eerste WK in 1930.", "Luis Suárez komt uit dit land.", "Het ligt tussen Brazilië en Argentinië.", "De hoofdstad is Montevideo."] },
  { name: "Kroatië", hints: ["Dinamo Zagreb is een bekende club uit dit land.", "Dit land bereikte de WK-finale van 2018.", "Luka Modrić komt uit dit land.", "Het nationale shirt staat bekend om rode en witte blokken.", "De hoofdstad is Zagreb."] },
  { name: "Noorwegen", hints: ["Molde en Rosenborg zijn bekende clubs uit dit land.", "De hoogste competitie heet Eliteserien.", "Martin Ødegaard komt uit dit land.", "Erling Haaland komt uit dit land.", "De hoofdstad is Oslo."] },
  { name: "Zweden", hints: ["Malmö FF is een bekende club uit dit land.", "De hoogste competitie heet Allsvenskan.", "Zlatan Ibrahimović speelde voor dit nationale team.", "Het nationale team speelt vaak in geel en blauw.", "De hoofdstad is Stockholm."] },
  { name: "Denemarken", hints: ["FC København en Brøndby zijn bekende clubs uit dit land.", "Dit land won het EK van 1992.", "Christian Eriksen komt uit dit land.", "Het ligt direct ten noorden van Duitsland.", "De hoofdstad is Kopenhagen."] },
  { name: "Polen", hints: ["Legia Warschau is een bekende club uit dit land.", "De hoogste competitie heet Ekstraklasa.", "Robert Lewandowski komt uit dit land.", "Het nationale team speelt vaak in wit en rood.", "De hoofdstad is Warschau."] },
  { name: "Zwitserland", hints: ["FC Basel en Young Boys zijn bekende clubs uit dit land.", "De hoogste competitie heet de Swiss Super League.", "Het nationale team speelt vaak in rood.", "Het land grenst onder andere aan Frankrijk, Duitsland en Italië.", "De hoofdstad is Bern."] },
  { name: "Oostenrijk", hints: ["Red Bull Salzburg en Rapid Wien spelen in dit land.", "De hoogste competitie heet de Oostenrijkse Bundesliga.", "David Alaba komt uit dit land.", "Het land ligt ten zuiden van Duitsland.", "De hoofdstad is Wenen."] },
  { name: "Turkije", aliases: ["Türkiye"], hints: ["Galatasaray, Fenerbahçe en Beşiktaş zijn grote clubs uit dit land.", "De hoogste competitie heet de Süper Lig.", "De derby's in Istanbul staan bekend om hun intense sfeer.", "Een deel van het land ligt in Europa en een deel in Azië.", "De hoofdstad is Ankara."] },
  { name: "Griekenland", hints: ["Olympiakos, Panathinaikos en AEK Athene spelen hier.", "Dit land won verrassend het EK van 2004.", "De nationale kleuren zijn blauw en wit.", "Veel grote clubs komen uit Athene of Piraeus.", "De hoofdstad is Athene."] },
  { name: "Schotland", hints: ["Celtic en Rangers zijn de bekendste rivalen uit dit land.", "De Old Firm is een beroemde derby.", "Het nationale stadion is Hampden Park.", "Het land maakt deel uit van het Verenigd Koninkrijk.", "De hoofdstad is Edinburgh."] },
  { name: "Ierland", aliases: ["Republiek Ierland"], hints: ["Shamrock Rovers is een bekende club uit dit land.", "Het nationale team speelt traditioneel in groen.", "Veel internationals spelen in Engelse competities.", "Het land ligt ten westen van Groot-Brittannië.", "De hoofdstad is Dublin."] },
  { name: "Tsjechië", aliases: ["Tsjechische Republiek"], hints: ["Sparta Praag en Slavia Praag zijn grote rivalen.", "Pavel Nedvěd is een beroemde oud-speler uit dit land.", "Het nationale team bereikte de EK-finale van 1996.", "Een groot deel van de topclubs komt uit Praag.", "De hoofdstad is Praag."] },
  { name: "Servië", hints: ["Rode Ster Belgrado en Partizan zijn grote rivalen.", "Rode Ster won in 1991 de Europacup I.", "Het nationale team speelt vaak in rood.", "Veel bekende clubs komen uit Belgrado.", "De hoofdstad is Belgrado."] },
  { name: "Japan", hints: ["Kashima Antlers en Urawa Red Diamonds zijn bekende clubs.", "De hoogste competitie heet de J1 League.", "Het nationale team wordt Samurai Blue genoemd.", "Dit land organiseerde samen met Zuid-Korea het WK van 2002.", "De hoofdstad is Tokio."] },
  { name: "Zuid-Korea", aliases: ["Korea"], hints: ["Jeonbuk Hyundai Motors is een bekende club uit dit land.", "Het nationale team bereikte de halve finale van het WK 2002.", "Son Heung-min komt uit dit land.", "Dit land organiseerde het WK 2002 samen met Japan.", "De hoofdstad is Seoul."] },
  { name: "Verenigde Staten", aliases: ["USA", "VS", "United States"], hints: ["De grote voetbalcompetitie heet Major League Soccer.", "Clubs als LA Galaxy en Inter Miami spelen hier.", "Het nationale team wordt vaak USMNT genoemd.", "Dit land organiseerde het WK van 1994.", "De hoofdstad is Washington, D.C."] },
  { name: "Mexico", hints: ["Club América en Chivas zijn beroemde clubs uit dit land.", "De hoogste competitie heet Liga MX.", "Het nationale stadion is het Estadio Azteca.", "Dit land organiseerde het WK in 1970 en 1986.", "De hoofdstad is Mexico-Stad."] },
  { name: "Marokko", hints: ["Raja Casablanca en Wydad Casablanca zijn grote clubs.", "Dit land bereikte de halve finale van het WK 2022.", "Hakim Ziyech speelde voor dit nationale team.", "Het ligt in Noord-Afrika.", "De hoofdstad is Rabat."] },
  { name: "Egypte", hints: ["Al Ahly en Zamalek zijn beroemde rivalen.", "Dit land won meerdere Afrika Cups.", "Mohamed Salah komt uit dit land.", "Het ligt in Noord-Afrika.", "De hoofdstad is Caïro."] },
  { name: "Senegal", hints: ["Het nationale team wordt de Lions of Teranga genoemd.", "Dit land won de Afrika Cup van 2021, gespeeld in 2022.", "Sadio Mané komt uit dit land.", "Het ligt in West-Afrika.", "De hoofdstad is Dakar."] },
  { name: "Kameroen", hints: ["Het nationale team wordt de Indomitable Lions genoemd.", "Samuel Eto'o is een van de bekendste spelers uit dit land.", "Het land won meerdere Afrika Cups.", "Het ligt in Centraal-Afrika.", "De hoofdstad is Yaoundé."] },
];

const ROUNDS = 8;
const POINTS = [1000, 800, 600, 400, 200];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function RaadHetLandPage() {
  const [gameCountries, setGameCountries] = useState<Country[]>([]);
  const [round, setRound] = useState(0);
  const [hintCount, setHintCount] = useState(1);
  const [guess, setGuess] = useState("");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState(false);

  const startGame = () => {
    setGameCountries(shuffle(COUNTRIES).slice(0, ROUNDS));
    setRound(0);
    setHintCount(1);
    setGuess("");
    setScore(0);
    setCorrect(0);
    setWrongGuesses(0);
    setFeedback("");
    setSolved(false);
    setFinished(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  const country = gameCountries[round];

  const suggestions = useMemo(() => {
    if (!guess.trim()) return [];
    const q = normalize(guess);
    return COUNTRIES.filter((item) => {
      const names = [item.name, ...(item.aliases ?? [])];
      return names.some((name) => normalize(name).includes(q));
    }).slice(0, 6);
  }, [guess]);

  const possiblePoints = POINTS[Math.min(hintCount - 1, POINTS.length - 1)];

  const submitGuess = (value?: string) => {
    if (!country || solved) return;

    const answer = (value ?? guess).trim();
    if (!answer) return;

    const validNames = [country.name, ...(country.aliases ?? [])].map(normalize);

    if (validNames.includes(normalize(answer))) {
      setScore((s) => s + possiblePoints);
      setCorrect((c) => c + 1);
      setSolved(true);
      setFeedback(`✓ Correct! Het land is ${country.name}. +${possiblePoints} punten`);
      setGuess("");
    } else {
      setWrongGuesses((w) => w + 1);
      setFeedback(`✕ ${answer} is niet het juiste land.`);
      setGuess("");
    }
  };

  const nextHint = () => {
    if (!country || solved || hintCount >= country.hints.length) return;
    setHintCount((h) => h + 1);
    setFeedback("");
  };

  const giveUp = () => {
    if (!country || solved) return;
    setSolved(true);
    setFeedback(`Het antwoord was ${country.name}.`);
    setGuess("");
  };

  const nextRound = () => {
    if (round >= ROUNDS - 1) {
      setFinished(true);
      return;
    }
    setRound((r) => r + 1);
    setHintCount(1);
    setGuess("");
    setFeedback("");
    setSolved(false);
  };

  if (!country && !finished) {
    return <main className="country-page"><div className="loading">Game laden...</div></main>;
  }

  const percentage = Math.round((correct / ROUNDS) * 100);

  return (
    <main className="country-page">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <div className="shell">
        <div className="topbar">
          <Link href="/games" className="back">← Games</Link>
          <div className="brand"><span /> VOETIQ GAMES</div>
        </div>

        {!finished ? (
          <>
            <section className="hero">
              <div>
                <span className="eyebrow">🌍 RAAD HET VOETBALLAND</span>
                <h1>Welk land <span>zoeken we?</span></h1>
                <p>Gebruik de voetbalhints en raad het land zo vroeg mogelijk.</p>
              </div>
              <div className="scorebox">
                <span>SCORE</span>
                <strong>{score}</strong>
                <small>punten</small>
              </div>
            </section>

            <div className="stats">
              <div><span>RONDE</span><strong>{round + 1}/{ROUNDS}</strong></div>
              <div><span>GOED</span><strong>{correct}</strong></div>
              <div><span>MOGELIJK</span><strong>{possiblePoints} pt</strong></div>
            </div>

            <div className="progress">
              <i style={{ width: `${((round + 1) / ROUNDS) * 100}%` }} />
            </div>

            <section className="game-card">
              <div className="hint-title">
                <div>
                  <span>HINTS</span>
                  <strong>{hintCount} van {country.hints.length} zichtbaar</strong>
                </div>
                <div className="points-pill">{possiblePoints} PUNTEN</div>
              </div>

              <div className="hints">
                {country.hints.slice(0, hintCount).map((hint, index) => (
                  <div className="hint" key={`${hint}-${index}`}>
                    <span>{index + 1}</span>
                    <p>{hint}</p>
                  </div>
                ))}
              </div>

              {!solved ? (
                <>
                  <div className="guess-label">Welk land denk jij dat het is?</div>
                  <div className="search-wrap">
                    <div className="search">
                      <span>⌕</span>
                      <input
                        value={guess}
                        onChange={(e) => {
                          setGuess(e.target.value);
                          setFeedback("");
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitGuess();
                        }}
                        placeholder="Typ een land..."
                        autoComplete="off"
                      />
                      <button type="button" onClick={() => submitGuess()}>Raad</button>
                    </div>

                    {suggestions.length > 0 && (
                      <div className="suggestions">
                        {suggestions.map((item) => (
                          <button
                            type="button"
                            key={item.name}
                            onClick={() => submitGuess(item.name)}
                          >
                            🌍 <span>{item.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {feedback && <div className="feedback wrong">{feedback}</div>}

                  <div className="actions">
                    <button
                      type="button"
                      className="hint-button"
                      onClick={nextHint}
                      disabled={hintCount >= country.hints.length}
                    >
                      💡 Volgende hint
                      {hintCount < country.hints.length && (
                        <small>−{possiblePoints - POINTS[Math.min(hintCount, 4)]} pt</small>
                      )}
                    </button>
                    <button type="button" className="giveup" onClick={giveUp}>
                      Ik geef op
                    </button>
                  </div>
                </>
              ) : (
                <div className="solved">
                  <div className={feedback.startsWith("✓") ? "feedback correct" : "feedback neutral"}>
                    {feedback}
                  </div>
                  <div className="answer-country">🌍 {country.name}</div>
                  <button type="button" onClick={nextRound}>
                    {round === ROUNDS - 1 ? "Bekijk eindscore" : "Volgende ronde"} →
                  </button>
                </div>
              )}
            </section>

            <div className="note">
              💡 Elke extra hint verlaagt de mogelijke score. Foute antwoorden kosten geen extra punten.
            </div>
          </>
        ) : (
          <section className="result">
            <div className="result-icon">{percentage >= 75 ? "🏆" : percentage >= 50 ? "🌍" : "⚽"}</div>
            <span className="eyebrow">GAME VOLTOOID</span>
            <h1>{percentage >= 75 ? "Wereldklasse!" : percentage >= 50 ? "Netjes gespeeld!" : "Nog een wereldreis?"}</h1>
            <p>Je raadde <strong>{correct} van de {ROUNDS}</strong> voetballanden goed.</p>

            <div className="final-score">
              <span>EINDSCORE</span>
              <strong>{score}</strong>
              <small>punten</small>
            </div>

            <div className="result-stats">
              <div><span>Goed</span><strong>{correct}/{ROUNDS}</strong></div>
              <div><span>Percentage</span><strong>{percentage}%</strong></div>
              <div><span>Foute pogingen</span><strong>{wrongGuesses}</strong></div>
            </div>

            <div className="result-actions">
              <button type="button" onClick={startGame}>↻ Opnieuw spelen</button>
              <Link href="/games">Terug naar Games</Link>
            </div>
          </section>
        )}
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }

        .country-page {
          position: relative;
          min-height: calc(100vh - 86px);
          overflow: hidden;
          padding: 38px 0 80px;
          background: radial-gradient(circle at 50% 0%, rgba(46,230,129,.09), transparent 31%), #03140d;
          color: white;
        }

        .shell {
          position: relative;
          z-index: 2;
          width: min(900px, calc(100% - 36px));
          margin: 0 auto;
        }

        .glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(25px);
        }

        .glow-one {
          width: 420px;
          height: 420px;
          top: -290px;
          left: calc(50% - 210px);
          background: rgba(46,230,129,.12);
        }

        .glow-two {
          width: 280px;
          height: 280px;
          right: -160px;
          bottom: 12%;
          background: rgba(46,230,129,.05);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 44px;
        }

        .back {
          color: #91a99c;
          text-decoration: none;
          font-size: 12px;
          font-weight: 850;
          transition: .18s ease;
        }

        .back:hover { color: #2ee681; transform: translateX(-2px); }

        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #69efa4;
          font-size: 9px;
          font-weight: 950;
          letter-spacing: 1.5px;
        }

        .brand span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2ee681;
          box-shadow: 0 0 12px rgba(46,230,129,.8);
        }

        .hero {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 25px;
          margin-bottom: 25px;
        }

        .eyebrow {
          display: inline-block;
          margin-bottom: 11px;
          color: #59eb9a;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 1.4px;
        }

        .hero h1, .result h1 {
          margin: 0;
          font-size: clamp(35px, 5vw, 50px);
          line-height: 1.02;
          letter-spacing: -1.8px;
          font-weight: 950;
        }

        .hero h1 span { color: #2ee681; }

        .hero p {
          margin: 12px 0 0;
          color: #839b8e;
          font-size: 13px;
        }

        .scorebox {
          min-width: 145px;
          padding: 16px 19px;
          border: 1px solid rgba(46,230,129,.16);
          border-radius: 13px;
          background: rgba(46,230,129,.05);
          text-align: right;
        }

        .scorebox span, .scorebox small {
          display: block;
          color: #718a7d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .scorebox strong {
          display: block;
          margin: 2px 0;
          color: #2ee681;
          font-size: 27px;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          margin-bottom: 11px;
        }

        .stats div {
          padding: 11px 14px;
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 9px;
          background: rgba(255,255,255,.02);
        }

        .stats span {
          display: block;
          margin-bottom: 3px;
          color: #6d8578;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        .stats strong { font-size: 13px; }

        .progress {
          height: 5px;
          margin-bottom: 20px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.055);
        }

        .progress i {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #2ee681;
          transition: width .3s ease;
        }

        .game-card, .result {
          padding: 28px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(8,34,22,.97), rgba(5,25,16,.97));
          box-shadow: 0 25px 70px rgba(0,0,0,.18);
        }

        .hint-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 18px;
        }

        .hint-title > div:first-child span {
          display: block;
          margin-bottom: 3px;
          color: #59e999;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1.3px;
        }

        .hint-title strong { font-size: 12px; }

        .points-pill {
          padding: 7px 9px;
          border: 1px solid rgba(46,230,129,.15);
          border-radius: 999px;
          background: rgba(46,230,129,.06);
          color: #60eca0;
          font-size: 8px;
          font-weight: 950;
        }

        .hints {
          display: grid;
          gap: 8px;
        }

        .hint {
          min-height: 52px;
          padding: 10px 13px;
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 9px;
          background: rgba(255,255,255,.022);
          animation: reveal .25s ease both;
        }

        .hint > span {
          flex: 0 0 29px;
          width: 29px;
          height: 29px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(46,230,129,.08);
          color: #55e995;
          font-size: 9px;
          font-weight: 950;
        }

        .hint p {
          margin: 0;
          color: #b2c4ba;
          font-size: 11px;
          line-height: 1.45;
        }

        .guess-label {
          margin: 22px 0 8px;
          color: #849a8f;
          font-size: 9px;
          font-weight: 800;
        }

        .search-wrap { position: relative; }

        .search {
          height: 51px;
          padding: 0 8px 0 14px;
          display: flex;
          align-items: center;
          gap: 9px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px;
          background: rgba(255,255,255,.03);
        }

        .search > span {
          color: #5ce99b;
          font-size: 20px;
        }

        .search input {
          min-width: 0;
          flex: 1;
          border: 0;
          outline: 0;
          background: transparent;
          color: white;
          font: inherit;
          font-size: 12px;
        }

        .search input::placeholder { color: #61796c; }

        .search > button {
          padding: 10px 14px;
          border: 0;
          border-radius: 8px;
          background: #2ee681;
          color: #032014;
          cursor: pointer;
          font-size: 9px;
          font-weight: 950;
        }

        .suggestions {
          position: absolute;
          z-index: 20;
          top: calc(100% + 6px);
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
          padding: 11px 13px;
          display: flex;
          gap: 9px;
          border: 0;
          border-bottom: 1px solid rgba(255,255,255,.045);
          background: transparent;
          color: #d8e4de;
          cursor: pointer;
          text-align: left;
          font-size: 11px;
        }

        .suggestions button:hover { background: rgba(46,230,129,.07); }

        .feedback {
          margin-top: 10px;
          padding: 11px 12px;
          border-radius: 8px;
          font-size: 10px;
        }

        .feedback.wrong {
          border: 1px solid rgba(255,91,91,.15);
          background: rgba(255,91,91,.045);
          color: #ff9c9c;
        }

        .feedback.correct {
          border: 1px solid rgba(46,230,129,.16);
          background: rgba(46,230,129,.055);
          color: #69eda3;
        }

        .feedback.neutral {
          border: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.025);
          color: #9bb0a5;
        }

        .actions {
          margin-top: 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .hint-button, .giveup {
          padding: 10px 12px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 9px;
          font-weight: 900;
        }

        .hint-button {
          border: 1px solid rgba(46,230,129,.15);
          background: rgba(46,230,129,.06);
          color: #67eca2;
        }

        .hint-button small {
          margin-left: 7px;
          color: #81978c;
          font-size: 8px;
        }

        .hint-button:disabled { opacity: .4; cursor: default; }

        .giveup {
          border: 0;
          background: transparent;
          color: #667d71;
        }

        .solved {
          margin-top: 20px;
          text-align: center;
        }

        .answer-country {
          margin: 19px 0;
          font-size: 26px;
          font-weight: 950;
        }

        .solved > button {
          padding: 11px 15px;
          border: 0;
          border-radius: 8px;
          background: #2ee681;
          color: #032014;
          cursor: pointer;
          font-size: 10px;
          font-weight: 950;
        }

        .note {
          margin-top: 14px;
          color: #61796d;
          text-align: center;
          font-size: 9px;
        }

        .result {
          max-width: 700px;
          margin: 50px auto 0;
          text-align: center;
        }

        .result-icon {
          width: 76px;
          height: 76px;
          margin: 0 auto 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(46,230,129,.16);
          border-radius: 19px;
          background: rgba(46,230,129,.07);
          font-size: 34px;
        }

        .result > p {
          color: #849b8f;
          font-size: 13px;
        }

        .final-score {
          width: 185px;
          margin: 24px auto;
          padding: 18px;
          border-radius: 13px;
          background: rgba(46,230,129,.07);
        }

        .final-score span, .final-score small {
          display: block;
          color: #718a7d;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .final-score strong {
          display: block;
          color: #2ee681;
          font-size: 40px;
        }

        .result-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 9px;
          margin-bottom: 24px;
        }

        .result-stats div {
          padding: 14px;
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 9px;
          background: rgba(255,255,255,.02);
        }

        .result-stats span {
          display: block;
          margin-bottom: 4px;
          color: #71877b;
          font-size: 8px;
        }

        .result-stats strong { font-size: 15px; }

        .result-actions {
          display: flex;
          justify-content: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .result-actions button, .result-actions a {
          padding: 11px 15px;
          border-radius: 8px;
          cursor: pointer;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
        }

        .result-actions button {
          border: 0;
          background: #2ee681;
          color: #032014;
        }

        .result-actions a {
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.03);
          color: #9db0a6;
        }

        .loading {
          padding-top: 100px;
          color: #8ba095;
          text-align: center;
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 650px) {
          .country-page { padding-top: 24px; }
          .brand { display: none; }
          .topbar { margin-bottom: 33px; }

          .hero {
            align-items: stretch;
            flex-direction: column;
          }

          .scorebox {
            width: 100%;
            text-align: left;
          }

          .game-card, .result { padding: 20px; }

          .actions {
            align-items: stretch;
            flex-direction: column;
          }

          .giveup { padding: 8px; }
        }

        @media (max-width: 430px) {
          .stats { gap: 5px; }
          .stats div { padding: 9px; }
          .result-stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
