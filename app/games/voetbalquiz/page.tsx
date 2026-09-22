"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Question = {
  question: string;
  answers: string[];
  correct: number;
  category: string;
};

const QUESTION_BANK: Question[] = [
  { question: "Welk land won het WK van 2022?", answers: ["Frankrijk", "Argentinië", "Brazilië", "Spanje"], correct: 1, category: "WK" },
  { question: "Welke club speelt zijn thuiswedstrijden in de Johan Cruijff ArenA?", answers: ["PSV", "Feyenoord", "Ajax", "AZ"], correct: 2, category: "Nederland" },
  { question: "Welke club speelt in Camp Nou?", answers: ["Real Madrid", "FC Barcelona", "Atlético Madrid", "Valencia"], correct: 1, category: "Clubs" },
  { question: "Welke club speelt zijn thuiswedstrijden op Anfield?", answers: ["Arsenal", "Chelsea", "Liverpool", "Everton"], correct: 2, category: "Engeland" },
  { question: "Welke club speelt in het Santiago Bernabéu?", answers: ["Sevilla", "Real Madrid", "Barcelona", "Villarreal"], correct: 1, category: "Spanje" },
  { question: "Hoeveel spelers heeft één team normaal gesproken op het veld bij de aftrap?", answers: ["9", "10", "11", "12"], correct: 2, category: "Spelregels" },
  { question: "Hoe lang duurt een reguliere voetbalwedstrijd zonder blessuretijd?", answers: ["80 minuten", "90 minuten", "100 minuten", "120 minuten"], correct: 1, category: "Spelregels" },
  { question: "Hoeveel minuten duurt één reguliere helft?", answers: ["40", "45", "50", "60"], correct: 1, category: "Spelregels" },
  { question: "Welke kaart betekent dat een speler van het veld wordt gestuurd?", answers: ["Blauw", "Groen", "Geel", "Rood"], correct: 3, category: "Spelregels" },
  { question: "Vanaf hoeveel meter wordt een strafschop genomen?", answers: ["9 meter", "10 meter", "11 meter", "12 meter"], correct: 2, category: "Spelregels" },

  { question: "Welke Nederlandse club speelt in De Kuip?", answers: ["Ajax", "Feyenoord", "FC Utrecht", "PSV"], correct: 1, category: "Nederland" },
  { question: "Welke Nederlandse club speelt in het Philips Stadion?", answers: ["PSV", "Ajax", "AZ", "FC Twente"], correct: 0, category: "Nederland" },
  { question: "Uit welke stad komt AZ?", answers: ["Alkmaar", "Arnhem", "Almelo", "Amersfoort"], correct: 0, category: "Nederland" },
  { question: "Welke club komt uit Enschede?", answers: ["Go Ahead Eagles", "FC Twente", "NEC", "Heerenveen"], correct: 1, category: "Nederland" },
  { question: "Welke club speelt in De Adelaarshorst?", answers: ["PEC Zwolle", "Go Ahead Eagles", "NAC Breda", "NEC"], correct: 1, category: "Nederland" },
  { question: "Welke club komt uit Nijmegen?", answers: ["NEC", "NAC", "RKC", "Heracles"], correct: 0, category: "Nederland" },
  { question: "Welke club komt uit Heerenveen?", answers: ["SC Heerenveen", "FC Groningen", "Cambuur", "PEC Zwolle"], correct: 0, category: "Nederland" },
  { question: "Welke club speelt in Stadion Galgenwaard?", answers: ["FC Utrecht", "FC Twente", "Sparta", "Willem II"], correct: 0, category: "Nederland" },

  { question: "Welke club speelt in Old Trafford?", answers: ["Manchester City", "Manchester United", "Liverpool", "Tottenham"], correct: 1, category: "Engeland" },
  { question: "Welke club speelt in Stamford Bridge?", answers: ["Chelsea", "Arsenal", "Fulham", "West Ham"], correct: 0, category: "Engeland" },
  { question: "Welke club speelt in het Emirates Stadium?", answers: ["Tottenham", "Arsenal", "Chelsea", "Liverpool"], correct: 1, category: "Engeland" },
  { question: "Welke club speelt in het Etihad Stadium?", answers: ["Manchester United", "Manchester City", "Newcastle United", "Aston Villa"], correct: 1, category: "Engeland" },
  { question: "Welke club speelt in St James' Park?", answers: ["Everton", "Newcastle United", "Leeds United", "Aston Villa"], correct: 1, category: "Engeland" },
  { question: "Welke club speelt in Villa Park?", answers: ["Aston Villa", "West Ham", "Wolves", "Brighton"], correct: 0, category: "Engeland" },

  { question: "Welke Duitse club speelt in de Allianz Arena?", answers: ["Borussia Dortmund", "Bayern München", "RB Leipzig", "Bayer Leverkusen"], correct: 1, category: "Duitsland" },
  { question: "Welke club speelt in het Signal Iduna Park?", answers: ["Schalke 04", "Bayern München", "Borussia Dortmund", "Werder Bremen"], correct: 2, category: "Duitsland" },
  { question: "Welke club komt uit Leverkusen?", answers: ["Bayer Leverkusen", "Borussia Mönchengladbach", "VfB Stuttgart", "Eintracht Frankfurt"], correct: 0, category: "Duitsland" },
  { question: "Welke club komt uit München?", answers: ["Bayern München", "Borussia Dortmund", "RB Leipzig", "Hamburger SV"], correct: 0, category: "Duitsland" },

  { question: "Welke Italiaanse club speelt in Turijn?", answers: ["Napoli", "Juventus", "AS Roma", "Atalanta"], correct: 1, category: "Italië" },
  { question: "Welke twee clubs delen traditioneel San Siro?", answers: ["Juventus en Torino", "Inter en AC Milan", "Roma en Lazio", "Napoli en Salernitana"], correct: 1, category: "Italië" },
  { question: "Welke club komt uit Napels?", answers: ["Napoli", "Lazio", "Fiorentina", "Bologna"], correct: 0, category: "Italië" },
  { question: "Welke club komt uit Florence?", answers: ["Fiorentina", "Atalanta", "Genoa", "Parma"], correct: 0, category: "Italië" },

  { question: "Welke Franse club speelt in het Parc des Princes?", answers: ["Marseille", "Monaco", "Paris Saint-Germain", "Lyon"], correct: 2, category: "Frankrijk" },
  { question: "Welke club komt uit Marseille?", answers: ["Olympique Marseille", "Olympique Lyon", "Lille", "Nice"], correct: 0, category: "Frankrijk" },
  { question: "Welke club komt uit Monaco?", answers: ["AS Monaco", "PSG", "Lens", "Rennes"], correct: 0, category: "Frankrijk" },

  { question: "Welke Portugese club speelt in Estádio da Luz?", answers: ["Porto", "Benfica", "Sporting CP", "Braga"], correct: 1, category: "Portugal" },
  { question: "Welke club komt uit Porto?", answers: ["Benfica", "FC Porto", "Sporting CP", "Braga"], correct: 1, category: "Portugal" },
  { question: "Welke club speelt in Estádio José Alvalade?", answers: ["Sporting CP", "Benfica", "Porto", "Boavista"], correct: 0, category: "Portugal" },

  { question: "Welke Spaanse club speelt in het Metropolitano?", answers: ["Real Madrid", "Atlético Madrid", "Sevilla", "Real Sociedad"], correct: 1, category: "Spanje" },
  { question: "Welke club komt uit Sevilla?", answers: ["Sevilla FC", "Villarreal", "Athletic Club", "Real Sociedad"], correct: 0, category: "Spanje" },
  { question: "Welke club komt uit Bilbao?", answers: ["Athletic Club", "Valencia", "Getafe", "Osasuna"], correct: 0, category: "Spanje" },
  { question: "Welke club komt uit Villarreal?", answers: ["Villarreal CF", "Valencia CF", "Celta de Vigo", "Mallorca"], correct: 0, category: "Spanje" },

  { question: "Welk land won het WK van 2018?", answers: ["Kroatië", "Duitsland", "Frankrijk", "Argentinië"], correct: 2, category: "WK" },
  { question: "Welk land won het WK van 2014?", answers: ["Duitsland", "Argentinië", "Brazilië", "Spanje"], correct: 0, category: "WK" },
  { question: "Welk land won het WK van 2010?", answers: ["Nederland", "Spanje", "Duitsland", "Brazilië"], correct: 1, category: "WK" },
  { question: "Welk land won het WK van 2006?", answers: ["Frankrijk", "Brazilië", "Italië", "Duitsland"], correct: 2, category: "WK" },
  { question: "Welk land won het WK van 2002?", answers: ["Brazilië", "Duitsland", "Frankrijk", "Argentinië"], correct: 0, category: "WK" },
  { question: "In welk land werd het WK 2014 gespeeld?", answers: ["Zuid-Afrika", "Brazilië", "Rusland", "Qatar"], correct: 1, category: "WK" },
  { question: "In welk land werd het WK 2018 gespeeld?", answers: ["Rusland", "Duitsland", "Frankrijk", "Qatar"], correct: 0, category: "WK" },
  { question: "In welk land werd het WK 2022 gespeeld?", answers: ["Verenigde Arabische Emiraten", "Qatar", "Saudi-Arabië", "Egypte"], correct: 1, category: "WK" },

  { question: "Welk land won het EK van 2024?", answers: ["Engeland", "Spanje", "Frankrijk", "Duitsland"], correct: 1, category: "EK" },
  { question: "Welk land won het EK van 2020, gespeeld in 2021?", answers: ["Engeland", "Italië", "Spanje", "Portugal"], correct: 1, category: "EK" },
  { question: "Welk land won het EK van 2016?", answers: ["Frankrijk", "Portugal", "Duitsland", "Spanje"], correct: 1, category: "EK" },
  { question: "Welk land won het EK van 1988?", answers: ["Nederland", "Duitsland", "Sovjet-Unie", "Italië"], correct: 0, category: "EK" },

  { question: "Welke speler staat bekend als CR7?", answers: ["Cristiano Ronaldo", "Ronaldo Nazário", "Ronaldinho", "Roberto Carlos"], correct: 0, category: "Spelers" },
  { question: "Uit welk land komt Lionel Messi?", answers: ["Spanje", "Uruguay", "Argentinië", "Chili"], correct: 2, category: "Spelers" },
  { question: "Uit welk land komt Erling Haaland?", answers: ["Zweden", "Noorwegen", "Denemarken", "Finland"], correct: 1, category: "Spelers" },
  { question: "Uit welk land komt Kylian Mbappé?", answers: ["België", "Frankrijk", "Kameroen", "Senegal"], correct: 1, category: "Spelers" },
  { question: "Uit welk land komt Mohamed Salah?", answers: ["Marokko", "Egypte", "Tunesië", "Algerije"], correct: 1, category: "Spelers" },
  { question: "Uit welk land komt Kevin De Bruyne?", answers: ["Nederland", "België", "Duitsland", "Frankrijk"], correct: 1, category: "Spelers" },
  { question: "Uit welk land komt Robert Lewandowski?", answers: ["Polen", "Tsjechië", "Oekraïne", "Kroatië"], correct: 0, category: "Spelers" },
  { question: "Uit welk land komt Luka Modrić?", answers: ["Servië", "Slovenië", "Kroatië", "Bosnië en Herzegovina"], correct: 2, category: "Spelers" },

  { question: "Hoe heet de hoogste Nederlandse voetbalcompetitie?", answers: ["Eerste Divisie", "Eredivisie", "Tweede Divisie", "KNVB Liga"], correct: 1, category: "Competities" },
  { question: "Hoe heet de hoogste Engelse voetbalcompetitie?", answers: ["Championship", "Premier League", "League One", "FA League"], correct: 1, category: "Competities" },
  { question: "Hoe heet de hoogste Spaanse voetbalcompetitie?", answers: ["LaLiga", "Copa del Rey", "Segunda División", "Liga Iberia"], correct: 0, category: "Competities" },
  { question: "Hoe heet de hoogste Duitse voetbalcompetitie?", answers: ["2. Bundesliga", "Bundesliga", "DFB-Liga", "Regionalliga"], correct: 1, category: "Competities" },
  { question: "Hoe heet de hoogste Italiaanse voetbalcompetitie?", answers: ["Serie B", "Serie A", "Coppa Italia", "Lega Uno"], correct: 1, category: "Competities" },
  { question: "Hoe heet de hoogste Franse voetbalcompetitie?", answers: ["Ligue 1", "Ligue 2", "Coupe de France", "National"], correct: 0, category: "Competities" },

  { question: "Welke Europese clubcompetitie geldt als het hoogste UEFA-clubtoernooi?", answers: ["Europa League", "Conference League", "Champions League", "Super Cup"], correct: 2, category: "Europa" },
  { question: "Welke organisatie organiseert de Champions League?", answers: ["FIFA", "UEFA", "KNVB", "IOC"], correct: 1, category: "Europa" },
  { question: "Welke organisatie organiseert het WK voetbal voor mannen?", answers: ["UEFA", "FIFA", "IOC", "CONMEBOL"], correct: 1, category: "WK" },
];

const QUESTIONS_PER_GAME = 10;
const POINTS_PER_CORRECT = 100;

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function VoetbalquizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const startGame = () => {
    setQuestions(shuffle(QUESTION_BANK).slice(0, QUESTIONS_PER_GAME));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setCorrectCount(0);
    setStreak(0);
    setBestStreak(0);
    setFinished(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  const question = questions[current];
  const progress = questions.length
    ? ((current + (finished ? 1 : 0)) / QUESTIONS_PER_GAME) * 100
    : 0;

  const percentage = useMemo(
    () => Math.round((correctCount / QUESTIONS_PER_GAME) * 100),
    [correctCount]
  );

  const chooseAnswer = (index: number) => {
    if (!question || selected !== null) return;

    setSelected(index);

    if (index === question.correct) {
      const newStreak = streak + 1;
      setScore((value) => value + POINTS_PER_CORRECT);
      setCorrectCount((value) => value + 1);
      setStreak(newStreak);
      setBestStreak((value) => Math.max(value, newStreak));
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (current >= QUESTIONS_PER_GAME - 1) {
      setFinished(true);
      return;
    }

    setCurrent((value) => value + 1);
    setSelected(null);
  };

  if (!question && !finished) {
    return (
      <main className="quiz-page">
        <div className="loading">Quiz laden...</div>
      </main>
    );
  }

  return (
    <main className="quiz-page">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <div className="quiz-shell">
        <div className="topbar">
          <Link href="/games" className="back-button">
            <span>←</span> Games
          </Link>

          <div className="brand">
            <span className="brand-dot" />
            VOETIQ GAMES
          </div>
        </div>

        {!finished ? (
          <>
            <section className="game-header">
              <div>
                <span className="eyebrow">🧠 VOETBALQUIZ</span>
                <h1>Hoe goed ken jij <span>voetbal?</span></h1>
                <p>10 willekeurige vragen. Vier antwoorden. Eén eindscore.</p>
              </div>

              <div className="score-card">
                <span>SCORE</span>
                <strong>{score}</strong>
                <small>/ {QUESTIONS_PER_GAME * POINTS_PER_CORRECT}</small>
              </div>
            </section>

            <div className="stats-row">
              <div>
                <span>VRAAG</span>
                <strong>{current + 1}/{QUESTIONS_PER_GAME}</strong>
              </div>
              <div>
                <span>GOED</span>
                <strong>{correctCount}</strong>
              </div>
              <div>
                <span>STREAK</span>
                <strong>🔥 {streak}</strong>
              </div>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${((current + 1) / QUESTIONS_PER_GAME) * 100}%` }}
              />
            </div>

            <section className="question-card">
              <div className="question-meta">
                <span>{question.category}</span>
                <span>Vraag {current + 1}</span>
              </div>

              <h2>{question.question}</h2>

              <div className="answers">
                {question.answers.map((answer, index) => {
                  const isCorrect = index === question.correct;
                  const isSelected = selected === index;

                  let className = "answer-button";

                  if (selected !== null) {
                    if (isCorrect) className += " correct";
                    else if (isSelected) className += " wrong";
                    else className += " faded";
                  }

                  return (
                    <button
                      type="button"
                      key={answer}
                      className={className}
                      onClick={() => chooseAnswer(index)}
                      disabled={selected !== null}
                    >
                      <span className="answer-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span>{answer}</span>
                      {selected !== null && isCorrect && (
                        <span className="answer-result">✓</span>
                      )}
                      {selected !== null && isSelected && !isCorrect && (
                        <span className="answer-result">×</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {selected !== null && (
                <div
                  className={
                    selected === question.correct
                      ? "feedback correct-feedback"
                      : "feedback wrong-feedback"
                  }
                >
                  <div>
                    <strong>
                      {selected === question.correct
                        ? "Goed antwoord! +100 punten"
                        : "Helaas, dat is niet goed."}
                    </strong>
                    <span>
                      {selected === question.correct
                        ? streak + 1 >= 2
                          ? `Je streak staat nu op ${streak}. 🔥`
                          : "Op naar de volgende!"
                        : `Het juiste antwoord is ${question.answers[question.correct]}.`}
                    </span>
                  </div>

                  <button type="button" onClick={nextQuestion}>
                    {current === QUESTIONS_PER_GAME - 1
                      ? "Bekijk resultaat"
                      : "Volgende vraag"}
                    <span>→</span>
                  </button>
                </div>
              )}
            </section>

            <div className="game-note">
              <span>💡</span>
              De quizscore staat los van je punten voor wedstrijdvoorspellingen.
            </div>
          </>
        ) : (
          <section className="result-card">
            <div className="result-icon">
              {percentage >= 80 ? "🏆" : percentage >= 60 ? "⚽" : "🎯"}
            </div>

            <span className="eyebrow">QUIZ VOLTOOID</span>
            <h1>
              {percentage >= 80
                ? "Voetbalkenner!"
                : percentage >= 60
                ? "Sterke score!"
                : "Nog een rondje?"}
            </h1>

            <p>
              Je had <strong>{correctCount} van de {QUESTIONS_PER_GAME}</strong>{" "}
              vragen goed.
            </p>

            <div className="final-score">
              <span>EINDSCORE</span>
              <strong>{score}</strong>
              <small>punten</small>
            </div>

            <div className="result-stats">
              <div>
                <span>Goed</span>
                <strong>{correctCount}</strong>
              </div>
              <div>
                <span>Percentage</span>
                <strong>{percentage}%</strong>
              </div>
              <div>
                <span>Beste streak</span>
                <strong>🔥 {bestStreak}</strong>
              </div>
            </div>

            <div className="result-actions">
              <button type="button" onClick={startGame}>
                ↻ Opnieuw spelen
              </button>
              <Link href="/games">Terug naar Games</Link>
            </div>
          </section>
        )}
      </div>

      <style jsx global>{`
        * { box-sizing: border-box; }

        .quiz-page {
          position: relative;
          min-height: calc(100vh - 86px);
          overflow: hidden;
          padding: 42px 0 80px;
          background:
            radial-gradient(circle at 50% 0%, rgba(46,230,129,.09), transparent 32%),
            #03140d;
          color: #fff;
        }

        .quiz-shell {
          position: relative;
          z-index: 2;
          width: min(900px, calc(100% - 36px));
          margin: 0 auto;
        }

        .glow {
          position: absolute;
          border-radius: 999px;
          pointer-events: none;
          filter: blur(25px);
        }

        .glow-one {
          width: 420px;
          height: 420px;
          top: -270px;
          left: calc(50% - 210px);
          background: rgba(46,230,129,.11);
        }

        .glow-two {
          width: 260px;
          height: 260px;
          right: -120px;
          bottom: 10%;
          background: rgba(46,230,129,.05);
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 52px;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #9db3a7;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          transition: color .18s ease, transform .18s ease;
        }

        .back-button:hover {
          color: #2ee681;
          transform: translateX(-2px);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #75eeab;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 1.5px;
        }

        .brand-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #2ee681;
          box-shadow: 0 0 12px rgba(46,230,129,.8);
        }

        .game-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          margin-bottom: 28px;
        }

        .eyebrow {
          display: inline-block;
          margin-bottom: 12px;
          color: #57eb98;
          font-size: 10px;
          font-weight: 950;
          letter-spacing: 1.4px;
        }

        .game-header h1,
        .result-card h1 {
          margin: 0;
          font-size: clamp(34px, 5vw, 51px);
          line-height: 1.03;
          letter-spacing: -1.9px;
          font-weight: 950;
        }

        .game-header h1 span { color: #2ee681; }

        .game-header p {
          margin: 13px 0 0;
          color: #849c90;
          font-size: 14px;
        }

        .score-card {
          min-width: 145px;
          padding: 17px 20px;
          border: 1px solid rgba(46,230,129,.17);
          border-radius: 14px;
          background: rgba(46,230,129,.055);
          text-align: right;
        }

        .score-card span,
        .score-card small {
          display: block;
          color: #759084;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .score-card strong {
          display: inline-block;
          margin: 4px 4px 1px 0;
          color: #2ee681;
          font-size: 27px;
        }

        .score-card small { display: inline; }

        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 13px;
        }

        .stats-row div {
          padding: 12px 15px;
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 10px;
          background: rgba(255,255,255,.022);
        }

        .stats-row span {
          display: block;
          margin-bottom: 4px;
          color: #688176;
          font-size: 8px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        .stats-row strong {
          font-size: 14px;
        }

        .progress-track {
          height: 5px;
          margin-bottom: 22px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: #2ee681;
          transition: width .3s ease;
        }

        .question-card {
          padding: 30px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px;
          background: linear-gradient(145deg, rgba(8,34,22,.97), rgba(5,25,16,.97));
          box-shadow: 0 25px 70px rgba(0,0,0,.18);
        }

        .question-meta {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 22px;
        }

        .question-meta span {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(46,230,129,.07);
          color: #62e99e;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .7px;
          text-transform: uppercase;
        }

        .question-meta span:last-child {
          background: rgba(255,255,255,.035);
          color: #73897e;
        }

        .question-card h2 {
          max-width: 720px;
          margin: 0 0 27px;
          font-size: clamp(22px, 4vw, 31px);
          line-height: 1.25;
          letter-spacing: -.6px;
        }

        .answers {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px;
        }

        .answer-button {
          min-height: 67px;
          padding: 12px 15px;
          display: flex;
          align-items: center;
          gap: 13px;
          border: 1px solid rgba(255,255,255,.075);
          border-radius: 11px;
          background: rgba(255,255,255,.025);
          color: #d8e4de;
          cursor: pointer;
          text-align: left;
          font-size: 13px;
          font-weight: 750;
          transition: transform .16s ease, border-color .16s ease, background .16s ease;
        }

        .answer-button:not(:disabled):hover {
          transform: translateY(-2px);
          border-color: rgba(46,230,129,.35);
          background: rgba(46,230,129,.055);
        }

        .answer-letter {
          flex: 0 0 34px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: rgba(255,255,255,.05);
          color: #8fa49a;
          font-size: 11px;
          font-weight: 950;
        }

        .answer-result {
          margin-left: auto;
          font-size: 20px;
          font-weight: 950;
        }

        .answer-button.correct {
          border-color: rgba(46,230,129,.5);
          background: rgba(46,230,129,.1);
          color: #7af0ae;
        }

        .answer-button.correct .answer-letter {
          background: #2ee681;
          color: #032014;
        }

        .answer-button.wrong {
          border-color: rgba(255,93,93,.38);
          background: rgba(255,93,93,.08);
          color: #ff9b9b;
        }

        .answer-button.wrong .answer-letter {
          background: rgba(255,93,93,.17);
          color: #ff9b9b;
        }

        .answer-button.faded { opacity: .45; }

        .feedback {
          margin-top: 20px;
          padding: 15px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          border-radius: 11px;
        }

        .correct-feedback {
          border: 1px solid rgba(46,230,129,.18);
          background: rgba(46,230,129,.06);
        }

        .wrong-feedback {
          border: 1px solid rgba(255,93,93,.15);
          background: rgba(255,93,93,.045);
        }

        .feedback strong,
        .feedback span {
          display: block;
        }

        .feedback strong {
          margin-bottom: 4px;
          font-size: 12px;
        }

        .feedback > div > span {
          color: #849a8f;
          font-size: 11px;
        }

        .feedback button {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 13px;
          border: 0;
          border-radius: 8px;
          background: #2ee681;
          color: #032014;
          cursor: pointer;
          font-size: 10px;
          font-weight: 950;
        }

        .game-note {
          margin-top: 16px;
          color: #637b6f;
          text-align: center;
          font-size: 10px;
        }

        .game-note span { margin-right: 5px; }

        .result-card {
          max-width: 700px;
          margin: 50px auto 0;
          padding: 45px 35px;
          border: 1px solid rgba(46,230,129,.15);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(8,34,22,.98), rgba(5,25,16,.98));
          text-align: center;
          box-shadow: 0 30px 80px rgba(0,0,0,.22);
        }

        .result-icon {
          width: 78px;
          height: 78px;
          margin: 0 auto 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(46,230,129,.18);
          border-radius: 20px;
          background: rgba(46,230,129,.075);
          font-size: 36px;
        }

        .result-card p {
          margin: 15px 0 27px;
          color: #849b8f;
          font-size: 14px;
        }

        .final-score {
          width: 190px;
          margin: 0 auto 26px;
          padding: 20px;
          border-radius: 15px;
          background: rgba(46,230,129,.07);
        }

        .final-score span,
        .final-score small {
          display: block;
          color: #6f8b7d;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .final-score strong {
          display: block;
          margin: 3px 0;
          color: #2ee681;
          font-size: 42px;
        }

        .result-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin-bottom: 27px;
        }

        .result-stats div {
          padding: 15px 10px;
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 11px;
          background: rgba(255,255,255,.02);
        }

        .result-stats span {
          display: block;
          margin-bottom: 5px;
          color: #71887c;
          font-size: 9px;
        }

        .result-stats strong { font-size: 17px; }

        .result-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .result-actions button,
        .result-actions a {
          padding: 12px 17px;
          border-radius: 9px;
          text-decoration: none;
          cursor: pointer;
          font-size: 11px;
          font-weight: 900;
        }

        .result-actions button {
          border: 0;
          background: #2ee681;
          color: #032014;
        }

        .result-actions a {
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.035);
          color: #a7bbb0;
        }

        .loading {
          padding-top: 100px;
          color: #8ba095;
          text-align: center;
        }

        @media (max-width: 700px) {
          .quiz-page { padding-top: 25px; }

          .topbar { margin-bottom: 37px; }

          .game-header {
            align-items: stretch;
            flex-direction: column;
          }

          .score-card {
            width: 100%;
            text-align: left;
          }

          .answers { grid-template-columns: 1fr; }

          .question-card { padding: 21px; }

          .feedback {
            align-items: stretch;
            flex-direction: column;
          }

          .feedback button {
            justify-content: center;
          }

          .result-card {
            margin-top: 25px;
            padding: 34px 20px;
          }
        }

        @media (max-width: 430px) {
          .brand { display: none; }

          .stats-row { gap: 6px; }

          .stats-row div { padding: 10px; }

          .result-stats {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
