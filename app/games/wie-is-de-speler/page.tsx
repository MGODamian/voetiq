"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Player = {
  name: string;
  aliases?: string[];
  flag: string;
  position: string;
  hints: string[];
};

const players: Player[] = [
  {
    name: "Frenkie de Jong",
    aliases: ["Frenkie", "De Jong"],
    flag: "🇳🇱",
    position: "Middenvelder",
    hints: [
      "Ik speelde in de jeugd van Willem II.",
      "Ik brak in Nederland door bij Ajax.",
      "In 2019 vertrok ik naar Spanje.",
      "Ik speel meestal als middenvelder.",
      "Ik ben Nederlands international.",
    ],
  },
  {
    name: "Erling Haaland",
    aliases: ["Haaland", "Erling Braut Haaland"],
    flag: "🇳🇴",
    position: "Aanvaller",
    hints: [
      "Mijn vader was ook profvoetballer.",
      "Ik speelde in Oostenrijk voor Red Bull Salzburg.",
      "Daarna speelde ik in de Bundesliga.",
      "Ik ben een Noorse spits.",
      "Ik maakte de overstap van Borussia Dortmund naar Manchester City.",
    ],
  },
  {
    name: "Kylian Mbappé",
    aliases: ["Mbappe", "Kylian Mbappe", "Mbappé"],
    flag: "🇫🇷",
    position: "Aanvaller",
    hints: [
      "Ik brak als tiener door in de Ligue 1.",
      "Mijn eerste grote profclub was AS Monaco.",
      "Ik werd in 2018 wereldkampioen.",
      "Ik speelde jarenlang voor Paris Saint-Germain.",
      "Ik ben een Franse aanvaller.",
    ],
  },
  {
    name: "Virgil van Dijk",
    aliases: ["Van Dijk", "Virgil"],
    flag: "🇳🇱",
    position: "Verdediger",
    hints: [
      "Mijn profcarrière begon in Groningen.",
      "Ik speelde daarna voor Celtic.",
      "Ook Southampton staat op mijn cv.",
      "Ik ben een Nederlandse centrale verdediger.",
      "Ik werd een belangrijke speler bij Liverpool.",
    ],
  },
  {
    name: "Lionel Messi",
    aliases: ["Messi", "Leo Messi"],
    flag: "🇦🇷",
    position: "Aanvaller",
    hints: [
      "Ik verhuisde op jonge leeftijd naar Spanje.",
      "Vrijwel mijn gehele Europese topcarrière begon bij één club.",
      "Ik speelde later ook in Frankrijk.",
      "Ik won in 2022 het WK.",
      "Ik ben een Argentijnse aanvaller.",
    ],
  },
  {
    name: "Cristiano Ronaldo",
    aliases: ["Ronaldo", "Cristiano", "CR7"],
    flag: "🇵🇹",
    position: "Aanvaller",
    hints: [
      "Mijn profcarrière begon in Portugal.",
      "Sir Alex Ferguson haalde mij naar Engeland.",
      "Ik speelde vervolgens jarenlang in Madrid.",
      "Ik ben Portugees international.",
      "Mijn bijnaam wordt vaak afgekort tot CR7.",
    ],
  },
  {
    name: "Kevin De Bruyne",
    aliases: ["De Bruyne", "Kevin de Bruyne", "KDB"],
    flag: "🇧🇪",
    position: "Middenvelder",
    hints: [
      "Ik begon mijn profcarrière in België.",
      "Ik stond als jonge speler onder contract bij Chelsea.",
      "Ik speelde ook voor VfL Wolfsburg.",
      "Ik ben Belgisch international.",
      "Ik werd jarenlang een bepalende middenvelder bij Manchester City.",
    ],
  },
  {
    name: "Mohamed Salah",
    aliases: ["Salah", "Mo Salah"],
    flag: "🇪🇬",
    position: "Aanvaller",
    hints: [
      "Ik begon mijn carrière in mijn thuisland.",
      "FC Basel was mijn eerste Europese club.",
      "Ik stond later onder contract bij Chelsea.",
      "Ik speelde in Italië voor Fiorentina en AS Roma.",
      "Ik ben een Egyptische aanvaller.",
    ],
  },
  {
    name: "Jude Bellingham",
    aliases: ["Bellingham", "Jude"],
    flag: "🏴",
    position: "Middenvelder",
    hints: [
      "Ik maakte als tiener mijn profdebuut in Engeland.",
      "Birmingham City was mijn eerste profclub.",
      "Daarna verhuisde ik naar Duitsland.",
      "Ik speelde voor Borussia Dortmund.",
      "Ik ben een Engelse middenvelder.",
    ],
  },
  {
    name: "Robert Lewandowski",
    aliases: ["Lewandowski", "Robert"],
    flag: "🇵🇱",
    position: "Aanvaller",
    hints: [
      "Ik speelde eerst jarenlang in mijn geboorteland.",
      "Borussia Dortmund was mijn eerste club in een Europese topcompetitie.",
      "Daarna speelde ik voor Bayern München.",
      "Ik ben Pools international.",
      "Ik ben vooral bekend als doelpuntenmaker en centrumspits.",
    ],
  },
];

const MAX_POINTS = 1000;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function pointsForHint(hintCount: number) {
  const scores = [1000, 800, 600, 400, 200];
  return scores[Math.min(hintCount - 1, scores.length - 1)];
}

function shuffle<T>(array: T[]) {
  const copy = [...array];

  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy;
}

export default function WhoIsThePlayerPage() {
  const [gamePlayers, setGamePlayers] = useState<Player[]>(() =>
    shuffle(players)
  );
  const [playerIndex, setPlayerIndex] = useState(0);
  const [visibleHints, setVisibleHints] = useState(1);
  const [guess, setGuess] = useState("");
  const [wrongGuess, setWrongGuess] = useState("");
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [roundPoints, setRoundPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [finished, setFinished] = useState(false);

  const currentPlayer = gamePlayers[playerIndex];

  const suggestions = useMemo(() => {
    if (guess.trim().length < 2) return [];

    const search = normalize(guess);

    return players
      .filter((player) => normalize(player.name).includes(search))
      .slice(0, 5);
  }, [guess]);

  function isCorrectGuess(value: string) {
    const normalizedGuess = normalize(value);

    if (normalize(currentPlayer.name) === normalizedGuess) {
      return true;
    }

    return (currentPlayer.aliases || []).some(
      (alias) => normalize(alias) === normalizedGuess
    );
  }

  function submitGuess(event?: FormEvent) {
    event?.preventDefault();

    if (!guess.trim() || answered) return;

    if (isCorrectGuess(guess)) {
      const earned = pointsForHint(visibleHints);

      setCorrect(true);
      setAnswered(true);
      setRoundPoints(earned);
      setTotalPoints((current) => current + earned);
      setCorrectAnswers((current) => current + 1);
      setWrongGuess("");
      return;
    }

    setWrongGuess(guess.trim());
    setGuess("");
  }

  function revealHint() {
    if (answered) return;

    if (visibleHints < currentPlayer.hints.length) {
      setVisibleHints((current) => current + 1);
    }
  }

  function giveUp() {
    if (answered) return;

    setCorrect(false);
    setAnswered(true);
    setRoundPoints(0);
    setWrongGuess("");
  }

  function nextPlayer() {
    if (playerIndex >= gamePlayers.length - 1) {
      setFinished(true);
      return;
    }

    setPlayerIndex((current) => current + 1);
    setVisibleHints(1);
    setGuess("");
    setWrongGuess("");
    setAnswered(false);
    setCorrect(false);
    setRoundPoints(0);
  }

  function restartGame() {
    setGamePlayers(shuffle(players));
    setPlayerIndex(0);
    setVisibleHints(1);
    setGuess("");
    setWrongGuess("");
    setAnswered(false);
    setCorrect(false);
    setRoundPoints(0);
    setTotalPoints(0);
    setCorrectAnswers(0);
    setFinished(false);
  }

  const progress = ((playerIndex + (answered ? 1 : 0)) / gamePlayers.length) * 100;
  const possibleTotal = gamePlayers.length * MAX_POINTS;

  if (finished) {
    const percentage = Math.round((totalPoints / possibleTotal) * 100);

    return (
      <main className="game-page">
        <div className="background-glow glow-one" />
        <div className="background-glow glow-two" />

        <section className="result-screen">
          <div className="result-icon">🏆</div>
          <div className="result-kicker">RONDE VOLTOOID</div>

          <h1>Dit is jouw score</h1>

          <div className="final-score">
            {totalPoints.toLocaleString("nl-NL")}
            <span> / {possibleTotal.toLocaleString("nl-NL")}</span>
          </div>

          <div className="result-stats">
            <div>
              <strong>{correctAnswers}</strong>
              <span>goed</span>
            </div>

            <div>
              <strong>{gamePlayers.length - correctAnswers}</strong>
              <span>gemist</span>
            </div>

            <div>
              <strong>{percentage}%</strong>
              <span>score</span>
            </div>
          </div>

          <p className="result-message">
            {correctAnswers === gamePlayers.length
              ? "Perfect! Jij kent je voetballers. 🔥"
              : correctAnswers >= 7
                ? "Sterke score! Jij weet duidelijk veel van voetbal. ⚽"
                : correctAnswers >= 4
                  ? "Niet slecht! Nog een ronde en je gaat er overheen."
                  : "Deze was lastig. Tijd voor revanche!"}
          </p>

          <div className="result-buttons">
            <button type="button" onClick={restartGame}>
              🔄 Opnieuw spelen
            </button>

            <Link href="/games">← Terug naar Games</Link>
          </div>
        </section>

        <GameStyles />
      </main>
    );
  }

  return (
    <main className="game-page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <div className="game-container">
        <div className="topbar">
          <Link href="/games" className="back-link">
            ← Games
          </Link>

          <div className="game-title-small">
            <span>👤</span>
            Wie is de speler?
          </div>

          <div className="score-small">
            {totalPoints.toLocaleString("nl-NL")} pt
          </div>
        </div>

        <div className="progress-area">
          <div className="progress-info">
            <span>
              Speler {playerIndex + 1} van {gamePlayers.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <section className="game-card">
          <div className="game-heading">
            <div className="game-label">VOETIQ GAMES</div>
            <h1>Wie is de speler?</h1>
            <p>
              Raad de voetballer met zo min mogelijk hints. Hoe eerder je hem
              weet, hoe meer punten je krijgt.
            </p>
          </div>

          <div className="points-banner">
            <div>
              <span>MOGELIJKE SCORE</span>
              <strong>{pointsForHint(visibleHints)} punten</strong>
            </div>

            <div className="hint-counter">
              Hint {visibleHints}/{currentPlayer.hints.length}
            </div>
          </div>

          <div className="hints">
            {currentPlayer.hints
              .slice(0, visibleHints)
              .map((hint, index) => (
                <div
                  className={
                    index === visibleHints - 1
                      ? "hint newest"
                      : "hint"
                  }
                  key={`${currentPlayer.name}-${index}`}
                >
                  <div className="hint-number">{index + 1}</div>

                  <div>
                    <span>HINT {index + 1}</span>
                    <p>{hint}</p>
                  </div>
                </div>
              ))}
          </div>

          {!answered ? (
            <>
              <form className="guess-form" onSubmit={submitGuess}>
                <label htmlFor="player-guess">Wie denk jij dat het is?</label>

                <div className="input-area">
                  <input
                    id="player-guess"
                    value={guess}
                    onChange={(event) => {
                      setGuess(event.target.value);
                      setWrongGuess("");
                    }}
                    placeholder="Typ de naam van een speler..."
                    autoComplete="off"
                  />

                  <button
                    type="submit"
                    className="guess-button"
                    disabled={!guess.trim()}
                  >
                    Raad speler
                  </button>

                  {suggestions.length > 0 && (
                    <div className="suggestions">
                      {suggestions.map((player) => (
                        <button
                          key={player.name}
                          type="button"
                          onClick={() => {
                            setGuess(player.name);
                          }}
                        >
                          <span>{player.flag}</span>
                          {player.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </form>

              {wrongGuess && (
                <div className="wrong-message">
                  <span>✕</span>
                  <div>
                    <strong>{wrongGuess}</strong> is niet goed. Probeer het nog
                    eens of onthul een nieuwe hint.
                  </div>
                </div>
              )}

              <div className="game-actions">
                <button
                  type="button"
                  className="hint-button"
                  onClick={revealHint}
                  disabled={visibleHints >= currentPlayer.hints.length}
                >
                  💡{" "}
                  {visibleHints >= currentPlayer.hints.length
                    ? "Alle hints onthuld"
                    : "Volgende hint"}
                </button>

                <button
                  type="button"
                  className="give-up-button"
                  onClick={giveUp}
                >
                  Ik weet het niet
                </button>
              </div>
            </>
          ) : (
            <div
              className={
                correct
                  ? "answer-result correct-result"
                  : "answer-result wrong-result"
              }
            >
              <div className="answer-result-icon">
                {correct ? "✓" : "✕"}
              </div>

              <div className="answer-copy">
                <span>
                  {correct ? "GOED GERADEN!" : "HET ANTWOORD WAS"}
                </span>

                <h2>
                  {currentPlayer.flag} {currentPlayer.name}
                </h2>

                <p>{currentPlayer.position}</p>

                {correct && (
                  <div className="earned-points">
                    +{roundPoints} punten
                  </div>
                )}
              </div>

              <button
                type="button"
                className="next-button"
                onClick={nextPlayer}
              >
                {playerIndex === gamePlayers.length - 1
                  ? "Bekijk eindscore"
                  : "Volgende speler"}{" "}
                →
              </button>
            </div>
          )}
        </section>

        <div className="scoring-help">
          <span>💡 Puntentelling:</span>
          <strong>Hint 1: 1000</strong>
          <strong>Hint 2: 800</strong>
          <strong>Hint 3: 600</strong>
          <strong>Hint 4: 400</strong>
          <strong>Hint 5: 200</strong>
        </div>
      </div>

      <GameStyles />
    </main>
  );
}

function GameStyles() {
  return (
    <style jsx global>{`
      * {
        box-sizing: border-box;
      }

      .game-page {
        position: relative;
        min-height: calc(100vh - 86px);
        overflow: hidden;
        padding: 32px 20px 80px;
        background:
          radial-gradient(
            circle at 50% 0%,
            rgba(46, 230, 129, 0.08),
            transparent 31%
          ),
          #03140d;
        color: white;
      }

      .background-glow {
        position: fixed;
        border-radius: 999px;
        pointer-events: none;
        filter: blur(20px);
      }

      .glow-one {
        width: 400px;
        height: 400px;
        top: 120px;
        left: -280px;
        background: rgba(46, 230, 129, 0.06);
      }

      .glow-two {
        width: 420px;
        height: 420px;
        right: -310px;
        bottom: 30px;
        background: rgba(46, 230, 129, 0.055);
      }

      .game-container {
        position: relative;
        z-index: 2;
        width: min(820px, 100%);
        margin: 0 auto;
      }

      .topbar {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        align-items: center;
        gap: 15px;
        margin-bottom: 25px;
      }

      .back-link {
        width: fit-content;
        color: #82988c;
        text-decoration: none;
        font-size: 12px;
        font-weight: 800;
        transition: color 0.18s ease;
      }

      .back-link:hover {
        color: #55ec97;
      }

      .game-title-small {
        display: flex;
        align-items: center;
        gap: 7px;
        color: #c7d8cf;
        font-size: 12px;
        font-weight: 850;
      }

      .score-small {
        justify-self: end;
        color: #54ed98;
        font-size: 12px;
        font-weight: 950;
      }

      .progress-area {
        margin-bottom: 20px;
      }

      .progress-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 7px;
        color: #70877b;
        font-size: 10px;
        font-weight: 800;
      }

      .progress-track {
        height: 5px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.055);
      }

      .progress-fill {
        height: 100%;
        border-radius: inherit;
        background: #2ee681;
        transition: width 0.35s ease;
      }

      .game-card {
        padding: 37px;
        border: 1px solid rgba(46, 230, 129, 0.14);
        border-radius: 20px;
        background:
          radial-gradient(
            circle at 100% 0%,
            rgba(46, 230, 129, 0.055),
            transparent 28%
          ),
          linear-gradient(
            145deg,
            rgba(8, 34, 22, 0.98),
            rgba(4, 24, 15, 0.98)
          );
        box-shadow: 0 28px 80px rgba(0, 0, 0, 0.2);
      }

      .game-heading {
        text-align: center;
      }

      .game-label {
        margin-bottom: 7px;
        color: #44e88d;
        font-size: 9px;
        font-weight: 950;
        letter-spacing: 1.5px;
      }

      .game-heading h1 {
        margin: 0;
        font-size: 34px;
        letter-spacing: -1.2px;
        font-weight: 950;
      }

      .game-heading p {
        max-width: 570px;
        margin: 11px auto 0;
        color: #82978c;
        font-size: 12px;
        line-height: 1.65;
      }

      .points-banner {
        margin-top: 28px;
        padding: 14px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
        border: 1px solid rgba(46, 230, 129, 0.11);
        border-radius: 11px;
        background: rgba(46, 230, 129, 0.045);
      }

      .points-banner > div:first-child {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }

      .points-banner span {
        color: #70887b;
        font-size: 8px;
        font-weight: 950;
        letter-spacing: 1px;
      }

      .points-banner strong {
        color: #58ee9a;
        font-size: 15px;
      }

      .hint-counter {
        padding: 6px 9px;
        border-radius: 7px;
        background: rgba(255, 255, 255, 0.04);
        color: #a8bbb0;
        font-size: 10px;
        font-weight: 850;
      }

      .hints {
        display: flex;
        flex-direction: column;
        gap: 9px;
        margin-top: 17px;
      }

      .hint {
        display: grid;
        grid-template-columns: 35px 1fr;
        align-items: center;
        gap: 12px;
        padding: 13px;
        border: 1px solid rgba(255, 255, 255, 0.055);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.018);
        animation: hintAppear 0.3s ease;
      }

      .hint.newest {
        border-color: rgba(46, 230, 129, 0.13);
        background: rgba(46, 230, 129, 0.035);
      }

      .hint-number {
        width: 31px;
        height: 31px;
        display: grid;
        place-items: center;
        border-radius: 8px;
        background: rgba(46, 230, 129, 0.08);
        color: #54eb96;
        font-size: 11px;
        font-weight: 950;
      }

      .hint span {
        color: #637b6e;
        font-size: 7px;
        font-weight: 950;
        letter-spacing: 1px;
      }

      .hint p {
        margin: 3px 0 0;
        color: #d5e2db;
        font-size: 12px;
        line-height: 1.5;
      }

      .guess-form {
        margin-top: 25px;
      }

      .guess-form label {
        display: block;
        margin-bottom: 8px;
        color: #a6b8ae;
        font-size: 10px;
        font-weight: 850;
      }

      .input-area {
        position: relative;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 8px;
      }

      .input-area input {
        width: 100%;
        min-width: 0;
        height: 47px;
        padding: 0 14px;
        outline: none;
        border: 1px solid rgba(255, 255, 255, 0.09);
        border-radius: 9px;
        background: rgba(0, 0, 0, 0.16);
        color: white;
        font-size: 13px;
        transition: border-color 0.18s ease;
      }

      .input-area input:focus {
        border-color: rgba(46, 230, 129, 0.42);
      }

      .input-area input::placeholder {
        color: #52675c;
      }

      .guess-button {
        height: 47px;
        padding: 0 18px;
        border: 0;
        border-radius: 9px;
        background: #2ee681;
        color: #042317;
        font-size: 11px;
        font-weight: 950;
        cursor: pointer;
      }

      .guess-button:disabled {
        opacity: 0.38;
        cursor: default;
      }

      .suggestions {
        position: absolute;
        z-index: 20;
        top: 54px;
        left: 0;
        width: calc(100% - 112px);
        padding: 6px;
        border: 1px solid rgba(46, 230, 129, 0.15);
        border-radius: 10px;
        background: #061b11;
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.45);
      }

      .suggestions button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 9px 10px;
        border: 0;
        border-radius: 7px;
        background: transparent;
        color: #d9e6df;
        text-align: left;
        font-size: 11px;
        cursor: pointer;
      }

      .suggestions button:hover {
        background: rgba(46, 230, 129, 0.08);
      }

      .wrong-message {
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 9px;
        padding: 10px 12px;
        border: 1px solid rgba(255, 104, 104, 0.13);
        border-radius: 8px;
        background: rgba(255, 90, 90, 0.045);
        color: #bd9d9d;
        font-size: 10px;
        line-height: 1.5;
      }

      .wrong-message > span {
        color: #ff7373;
        font-weight: 950;
      }

      .wrong-message strong {
        color: #e5c3c3;
      }

      .game-actions {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        margin-top: 14px;
      }

      .hint-button,
      .give-up-button {
        border: 0;
        background: transparent;
        font-size: 10px;
        font-weight: 850;
        cursor: pointer;
      }

      .hint-button {
        padding: 9px 11px;
        border: 1px solid rgba(46, 230, 129, 0.12);
        border-radius: 8px;
        background: rgba(46, 230, 129, 0.045);
        color: #5ceb9a;
      }

      .hint-button:disabled {
        opacity: 0.4;
        cursor: default;
      }

      .give-up-button {
        color: #667c70;
      }

      .give-up-button:hover {
        color: #a6b8ae;
      }

      .answer-result {
        margin-top: 25px;
        padding: 20px;
        display: grid;
        grid-template-columns: auto 1fr auto;
        align-items: center;
        gap: 17px;
        border-radius: 13px;
      }

      .correct-result {
        border: 1px solid rgba(46, 230, 129, 0.25);
        background: rgba(46, 230, 129, 0.07);
      }

      .wrong-result {
        border: 1px solid rgba(255, 104, 104, 0.18);
        background: rgba(255, 90, 90, 0.05);
      }

      .answer-result-icon {
        width: 43px;
        height: 43px;
        display: grid;
        place-items: center;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.06);
        font-size: 18px;
        font-weight: 950;
      }

      .correct-result .answer-result-icon {
        color: #55ee99;
      }

      .wrong-result .answer-result-icon {
        color: #ff7979;
      }

      .answer-copy > span {
        color: #70877a;
        font-size: 8px;
        font-weight: 950;
        letter-spacing: 1px;
      }

      .answer-copy h2 {
        margin: 3px 0;
        font-size: 19px;
      }

      .answer-copy p {
        margin: 0;
        color: #7e9589;
        font-size: 10px;
      }

      .earned-points {
        width: fit-content;
        margin-top: 7px;
        padding: 4px 7px;
        border-radius: 5px;
        background: rgba(46, 230, 129, 0.11);
        color: #61efa0;
        font-size: 9px;
        font-weight: 950;
      }

      .next-button {
        padding: 10px 13px;
        border: 0;
        border-radius: 8px;
        background: #2ee681;
        color: #042317;
        font-size: 10px;
        font-weight: 950;
        cursor: pointer;
      }

      .scoring-help {
        margin-top: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 10px;
        color: #566d61;
        font-size: 8px;
      }

      .scoring-help span {
        color: #71877b;
        font-weight: 850;
      }

      .scoring-help strong {
        font-weight: 800;
      }

      .result-screen {
        position: relative;
        z-index: 2;
        width: min(610px, 100%);
        margin: 80px auto 0;
        padding: 45px 35px;
        text-align: center;
        border: 1px solid rgba(46, 230, 129, 0.18);
        border-radius: 22px;
        background:
          radial-gradient(
            circle at 50% 0%,
            rgba(46, 230, 129, 0.11),
            transparent 35%
          ),
          linear-gradient(145deg, #082319, #04170f);
      }

      .result-icon {
        font-size: 43px;
      }

      .result-kicker {
        margin-top: 14px;
        color: #4be993;
        font-size: 9px;
        font-weight: 950;
        letter-spacing: 1.5px;
      }

      .result-screen h1 {
        margin: 7px 0 20px;
        font-size: 31px;
      }

      .final-score {
        color: #50ec96;
        font-size: 42px;
        font-weight: 950;
        letter-spacing: -1.5px;
      }

      .final-score span {
        color: #60776a;
        font-size: 16px;
      }

      .result-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 9px;
        margin-top: 25px;
      }

      .result-stats div {
        padding: 15px 8px;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.025);
      }

      .result-stats strong {
        display: block;
        color: #e8f5ed;
        font-size: 19px;
      }

      .result-stats span {
        display: block;
        margin-top: 3px;
        color: #657c70;
        font-size: 9px;
      }

      .result-message {
        margin: 22px 0 0;
        color: #8ca095;
        font-size: 12px;
      }

      .result-buttons {
        display: flex;
        justify-content: center;
        gap: 9px;
        margin-top: 27px;
      }

      .result-buttons button,
      .result-buttons a {
        padding: 11px 15px;
        border-radius: 9px;
        font-size: 10px;
        font-weight: 900;
        text-decoration: none;
        cursor: pointer;
      }

      .result-buttons button {
        border: 0;
        background: #2ee681;
        color: #042317;
      }

      .result-buttons a {
        border: 1px solid rgba(255, 255, 255, 0.08);
        background: rgba(255, 255, 255, 0.035);
        color: #a2b4aa;
      }

      @keyframes hintAppear {
        from {
          opacity: 0;
          transform: translateY(-5px);
        }

        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      @media (max-width: 650px) {
        .game-page {
          padding: 20px 13px 60px;
        }

        .topbar {
          grid-template-columns: 1fr auto;
        }

        .game-title-small {
          display: none;
        }

        .game-card {
          padding: 25px 17px;
          border-radius: 16px;
        }

        .game-heading h1 {
          font-size: 28px;
        }

        .input-area {
          grid-template-columns: 1fr;
        }

        .guess-button {
          width: 100%;
        }

        .suggestions {
          width: 100%;
          top: 54px;
        }

        .game-actions {
          align-items: stretch;
          flex-direction: column;
        }

        .hint-button,
        .give-up-button {
          min-height: 40px;
        }

        .answer-result {
          grid-template-columns: auto 1fr;
        }

        .next-button {
          grid-column: 1 / -1;
          width: 100%;
        }

        .result-screen {
          margin-top: 30px;
          padding: 35px 18px;
        }

        .result-buttons {
          flex-direction: column;
        }
      }
    `}</style>
  );
}
