"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Translation = {
  badge: string;
  heroBefore: string;
  heroHighlight: string;
  heroText: string;
  step1Title: string;
  step1Text: string;
  step2Title: string;
  step2Text: string;
  step3Title: string;
  step3Text: string;
  scoringEyebrow: string;
  scoringTitle: string;
  formula: string;
  scoringIntro: string;
  realScore: string;
  points: string;
  almostEyebrow: string;
  almostTitle: string;
  almostText: string;
  rule1Title: string;
  rule1Text: string;
  rule2Title: string;
  rule2Text: string;
  rule3Title: string;
  rule3Text: string;
  example: string;
  home: string;
  away: string;
  exact: string;
  oneGoalOff: string;
  twoGoalsOff: string;
  fourGoalsOff: string;
  sixGoalsOff: string;
  wrongWinner: string;
  anotherExample: string;
  drawTitle: string;
  drawText: string;
  whyEyebrow: string;
  whyTitle: string;
  whyText: string;
  predictMatches: string;
};

const ui: Record<LanguageCode, Translation> = {
  nl: {
    badge: "⚽ ZO WERKT VOETIQ",
    heroBefore: "Voorspel. Scoor.",
    heroHighlight: " Klim.",
    heroText: "Voorspel de uitslagen van voetbalwedstrijden, verdien punten en neem het op tegen vrienden en andere spelers.",
    step1Title: "Voorspel wedstrijden",
    step1Text: "Vul vóór de aftrap jouw voorspelling in. Zodra de wedstrijd begint, staat je voorspelling vast.",
    step2Title: "Verdien punten",
    step2Text: "Hoe dichter je voorspelling bij de echte uitslag zit, hoe meer punten je verdient.",
    step3Title: "Klim in het klassement",
    step3Text: "Vergelijk je punten met andere spelers en probeer bovenaan het klassement te eindigen.",
    scoringEyebrow: "VOETIQ PUNTENSYSTEEM",
    scoringTitle: "Niet iedere uitslag is evenveel waard.",
    formula: "10 + (doelpunten × 2)",
    scoringIntro: "Een exacte uitslag met veel doelpunten is moeilijker te voorspellen. Daarom levert zo'n voorspelling meer punten op.",
    realScore: "Echte uitslag",
    points: "punten",
    almostEyebrow: "BIJNA GOED?",
    almostTitle: "Dan kun je nog steeds punten verdienen.",
    almostText: "Heb je de juiste winnaar of het gelijkspel goed? Dan kijken we hoe ver jouw voorspelling van de echte uitslag af zit.",
    rule1Title: "2 punten eraf per doelpunt afwijking",
    rule1Text: "We tellen de afwijking van beide teams bij elkaar op.",
    rule2Title: "Minimaal 2 punten",
    rule2Text: "Zolang je de juiste winnaar of het juiste gelijkspel hebt voorspeld.",
    rule3Title: "Verkeerde wedstrijduitkomst = 0",
    rule3Text: "Heb je de verkeerde winnaar voorspeld of een gelijkspel gemist? Dan krijg je 0 punten.",
    example: "VOORBEELD",
    home: "Thuis",
    away: "Uit",
    exact: "Exact",
    oneGoalOff: "1 doelpunt afwijking",
    twoGoalsOff: "2 doelpunten afwijking",
    fourGoalsOff: "4 doelpunten afwijking",
    sixGoalsOff: "6 doelpunten afwijking",
    wrongWinner: "Verkeerde winnaar",
    anotherExample: "NOG EEN VOORBEELD",
    drawTitle: "De wedstrijd eindigt in 1-1",
    drawText: "Een exacte 1-1 is maximaal 14 punten waard. Voorspel je ook een gelijkspel, maar zit je verder van de uitslag af? Dan verlies je per afwijkend doelpunt 2 punten.",
    whyEyebrow: "WAAROM DIT SYSTEEM?",
    whyTitle: "Elke voorspelling telt anders.",
    whyText: "Een spectaculaire uitslag exact voorspellen wordt extra beloond. Tegelijkertijd krijg je ook punten wanneer je de juiste wedstrijduitkomst hebt en dicht bij de echte score zit. Zo ontstaat er meer verschil tussen spelers in het klassement.",
    predictMatches: "Voorspel wedstrijden →",
  },
  en: {
    badge: "⚽ HOW VOETIQ WORKS",
    heroBefore: "Predict. Score.",
    heroHighlight: " Climb.",
    heroText: "Predict football match scores, earn points and compete with friends and other players.",
    step1Title: "Predict matches",
    step1Text: "Enter your prediction before kick-off. Once the match starts, your prediction is locked.",
    step2Title: "Earn points",
    step2Text: "The closer your prediction is to the actual score, the more points you earn.",
    step3Title: "Climb the leaderboard",
    step3Text: "Compare your points with other players and try to finish at the top of the leaderboard.",
    scoringEyebrow: "VOETIQ SCORING SYSTEM",
    scoringTitle: "Not every score is worth the same.",
    formula: "10 + (goals × 2)",
    scoringIntro: "An exact score with lots of goals is harder to predict. That's why such a prediction earns more points.",
    realScore: "Actual score",
    points: "points",
    almostEyebrow: "ALMOST RIGHT?",
    almostTitle: "You can still earn points.",
    almostText: "Did you predict the correct winner or a draw? Then we look at how far your prediction is from the actual score.",
    rule1Title: "2 points deducted per goal difference",
    rule1Text: "We add together the difference for both teams.",
    rule2Title: "Minimum 2 points",
    rule2Text: "As long as you predicted the correct winner or the correct draw.",
    rule3Title: "Wrong match outcome = 0",
    rule3Text: "Predicted the wrong winner or missed a draw? Then you get 0 points.",
    example: "EXAMPLE",
    home: "Home",
    away: "Away",
    exact: "Exact",
    oneGoalOff: "1 goal off",
    twoGoalsOff: "2 goals off",
    fourGoalsOff: "4 goals off",
    sixGoalsOff: "6 goals off",
    wrongWinner: "Wrong winner",
    anotherExample: "ANOTHER EXAMPLE",
    drawTitle: "The match ends 1-1",
    drawText: "An exact 1-1 is worth up to 14 points. If you also predict a draw but are further from the score, you lose 2 points for every goal difference.",
    whyEyebrow: "WHY THIS SYSTEM?",
    whyTitle: "Every prediction counts differently.",
    whyText: "Predicting a spectacular score exactly is rewarded more. At the same time, you can still earn points when you get the match outcome right and stay close to the actual score. This creates more separation between players on the leaderboard.",
    predictMatches: "Predict matches →",
  },
  de: {
    badge: "⚽ SO FUNKTIONIERT VOETIQ",
    heroBefore: "Tippen. Punkten.",
    heroHighlight: " Aufsteigen.",
    heroText: "Tippe die Ergebnisse von Fußballspielen, sammle Punkte und tritt gegen Freunde und andere Spieler an.",
    step1Title: "Spiele tippen",
    step1Text: "Gib deinen Tipp vor dem Anpfiff ab. Sobald das Spiel beginnt, ist dein Tipp gesperrt.",
    step2Title: "Punkte sammeln",
    step2Text: "Je näher dein Tipp am tatsächlichen Ergebnis liegt, desto mehr Punkte erhältst du.",
    step3Title: "In der Rangliste aufsteigen",
    step3Text: "Vergleiche deine Punkte mit anderen Spielern und versuche, die Rangliste anzuführen.",
    scoringEyebrow: "VOETIQ-PUNKTESYSTEM",
    scoringTitle: "Nicht jedes Ergebnis ist gleich viel wert.",
    formula: "10 + (Tore × 2)",
    scoringIntro: "Ein exaktes Ergebnis mit vielen Toren ist schwieriger vorherzusagen. Deshalb bringt ein solcher Tipp mehr Punkte.",
    realScore: "Endergebnis",
    points: "Punkte",
    almostEyebrow: "FAST RICHTIG?",
    almostTitle: "Dann kannst du trotzdem Punkte sammeln.",
    almostText: "Hast du den richtigen Sieger oder ein Unentschieden getippt? Dann schauen wir, wie weit dein Tipp vom tatsächlichen Ergebnis entfernt ist.",
    rule1Title: "2 Punkte Abzug pro Tor Abweichung",
    rule1Text: "Wir addieren die Abweichungen beider Teams.",
    rule2Title: "Mindestens 2 Punkte",
    rule2Text: "Solange du den richtigen Sieger oder das richtige Unentschieden vorhergesagt hast.",
    rule3Title: "Falscher Spielausgang = 0",
    rule3Text: "Hast du den falschen Sieger getippt oder ein Unentschieden verpasst? Dann bekommst du 0 Punkte.",
    example: "BEISPIEL",
    home: "Heim",
    away: "Auswärts",
    exact: "Exakt",
    oneGoalOff: "1 Tor Abweichung",
    twoGoalsOff: "2 Tore Abweichung",
    fourGoalsOff: "4 Tore Abweichung",
    sixGoalsOff: "6 Tore Abweichung",
    wrongWinner: "Falscher Sieger",
    anotherExample: "NOCH EIN BEISPIEL",
    drawTitle: "Das Spiel endet 1:1",
    drawText: "Ein exaktes 1:1 ist maximal 14 Punkte wert. Tippst du ebenfalls auf Unentschieden, liegst aber weiter daneben, verlierst du pro abweichendem Tor 2 Punkte.",
    whyEyebrow: "WARUM DIESES SYSTEM?",
    whyTitle: "Jeder Tipp zählt anders.",
    whyText: "Ein spektakuläres Ergebnis exakt vorherzusagen wird stärker belohnt. Gleichzeitig bekommst du auch Punkte, wenn du den richtigen Spielausgang hast und nah am tatsächlichen Ergebnis liegst. So entstehen größere Unterschiede in der Rangliste.",
    predictMatches: "Spiele tippen →",
  },
  es: {
    badge: "⚽ ASÍ FUNCIONA VOETIQ",
    heroBefore: "Pronostica. Puntúa.",
    heroHighlight: " Sube.",
    heroText: "Pronostica los resultados de los partidos de fútbol, gana puntos y compite contra amigos y otros jugadores.",
    step1Title: "Pronostica partidos",
    step1Text: "Introduce tu pronóstico antes del inicio. En cuanto empiece el partido, tu pronóstico quedará bloqueado.",
    step2Title: "Gana puntos",
    step2Text: "Cuanto más se acerque tu pronóstico al resultado real, más puntos ganarás.",
    step3Title: "Sube en la clasificación",
    step3Text: "Compara tus puntos con otros jugadores e intenta terminar en lo más alto de la clasificación.",
    scoringEyebrow: "SISTEMA DE PUNTOS DE VOETIQ",
    scoringTitle: "No todos los resultados valen lo mismo.",
    formula: "10 + (goles × 2)",
    scoringIntro: "Un resultado exacto con muchos goles es más difícil de pronosticar. Por eso, un pronóstico así otorga más puntos.",
    realScore: "Resultado real",
    points: "puntos",
    almostEyebrow: "¿CASI ACERTASTE?",
    almostTitle: "Aún puedes ganar puntos.",
    almostText: "¿Acertaste el ganador o el empate? Entonces calculamos cuánto se aleja tu pronóstico del resultado real.",
    rule1Title: "2 puntos menos por cada gol de diferencia",
    rule1Text: "Sumamos la diferencia de ambos equipos.",
    rule2Title: "Mínimo 2 puntos",
    rule2Text: "Siempre que hayas acertado el ganador o el empate.",
    rule3Title: "Resultado incorrecto = 0",
    rule3Text: "¿Pronosticaste al ganador equivocado o no acertaste el empate? Entonces obtienes 0 puntos.",
    example: "EJEMPLO",
    home: "Local",
    away: "Visitante",
    exact: "Exacto",
    oneGoalOff: "1 gol de diferencia",
    twoGoalsOff: "2 goles de diferencia",
    fourGoalsOff: "4 goles de diferencia",
    sixGoalsOff: "6 goles de diferencia",
    wrongWinner: "Ganador incorrecto",
    anotherExample: "OTRO EJEMPLO",
    drawTitle: "El partido termina 1-1",
    drawText: "Un 1-1 exacto vale como máximo 14 puntos. Si también pronosticas un empate pero te alejas más del resultado, pierdes 2 puntos por cada gol de diferencia.",
    whyEyebrow: "¿POR QUÉ ESTE SISTEMA?",
    whyTitle: "Cada pronóstico cuenta de forma diferente.",
    whyText: "Acertar exactamente un resultado espectacular recibe una recompensa mayor. Al mismo tiempo, también ganas puntos si aciertas el resultado del partido y te acercas al marcador real. Así se crean más diferencias entre los jugadores de la clasificación.",
    predictMatches: "Pronosticar partidos →",
  },
  fr: {
    badge: "⚽ COMMENT FONCTIONNE VOETIQ",
    heroBefore: "Pronostiquez. Marquez.",
    heroHighlight: " Grimpez.",
    heroText: "Pronostiquez les scores des matchs de football, gagnez des points et affrontez vos amis et d'autres joueurs.",
    step1Title: "Pronostiquez les matchs",
    step1Text: "Saisissez votre pronostic avant le coup d'envoi. Dès que le match commence, votre pronostic est verrouillé.",
    step2Title: "Gagnez des points",
    step2Text: "Plus votre pronostic est proche du score réel, plus vous gagnez de points.",
    step3Title: "Grimpez au classement",
    step3Text: "Comparez vos points à ceux des autres joueurs et essayez de terminer en tête du classement.",
    scoringEyebrow: "SYSTÈME DE POINTS VOETIQ",
    scoringTitle: "Tous les scores n'ont pas la même valeur.",
    formula: "10 + (buts × 2)",
    scoringIntro: "Un score exact avec beaucoup de buts est plus difficile à prévoir. C'est pourquoi un tel pronostic rapporte davantage de points.",
    realScore: "Score réel",
    points: "points",
    almostEyebrow: "PRESQUE JUSTE ?",
    almostTitle: "Vous pouvez quand même gagner des points.",
    almostText: "Avez-vous trouvé le bon vainqueur ou le match nul ? Nous regardons alors à quel point votre pronostic diffère du score réel.",
    rule1Title: "2 points retirés par but d'écart",
    rule1Text: "Nous additionnons l'écart des deux équipes.",
    rule2Title: "Minimum 2 points",
    rule2Text: "Tant que vous avez pronostiqué le bon vainqueur ou le bon match nul.",
    rule3Title: "Mauvais résultat du match = 0",
    rule3Text: "Vous avez choisi le mauvais vainqueur ou manqué un match nul ? Vous obtenez alors 0 point.",
    example: "EXEMPLE",
    home: "Domicile",
    away: "Extérieur",
    exact: "Exact",
    oneGoalOff: "1 but d'écart",
    twoGoalsOff: "2 buts d'écart",
    fourGoalsOff: "4 buts d'écart",
    sixGoalsOff: "6 buts d'écart",
    wrongWinner: "Mauvais vainqueur",
    anotherExample: "AUTRE EXEMPLE",
    drawTitle: "Le match se termine sur un 1-1",
    drawText: "Un 1-1 exact vaut au maximum 14 points. Si vous pronostiquez aussi un match nul mais êtes plus éloigné du score, vous perdez 2 points par but d'écart.",
    whyEyebrow: "POURQUOI CE SYSTÈME ?",
    whyTitle: "Chaque pronostic compte différemment.",
    whyText: "Prédire exactement un score spectaculaire est davantage récompensé. En même temps, vous gagnez aussi des points lorsque vous trouvez le bon résultat du match et restez proche du score réel. Cela crée davantage d'écart entre les joueurs au classement.",
    predictMatches: "Pronostiquer les matchs →",
  },
  it: {
    badge: "⚽ COME FUNZIONA VOETIQ",
    heroBefore: "Pronostica. Segna.",
    heroHighlight: " Sali.",
    heroText: "Pronostica i risultati delle partite di calcio, guadagna punti e sfida amici e altri giocatori.",
    step1Title: "Pronostica le partite",
    step1Text: "Inserisci il tuo pronostico prima del calcio d'inizio. Quando la partita comincia, il pronostico viene bloccato.",
    step2Title: "Guadagna punti",
    step2Text: "Più il tuo pronostico si avvicina al risultato reale, più punti guadagni.",
    step3Title: "Sali in classifica",
    step3Text: "Confronta i tuoi punti con quelli degli altri giocatori e prova ad arrivare in cima alla classifica.",
    scoringEyebrow: "SISTEMA DI PUNTEGGIO VOETIQ",
    scoringTitle: "Non tutti i risultati valgono allo stesso modo.",
    formula: "10 + (gol × 2)",
    scoringIntro: "Un risultato esatto con molti gol è più difficile da pronosticare. Per questo un pronostico del genere vale più punti.",
    realScore: "Risultato reale",
    points: "punti",
    almostEyebrow: "QUASI GIUSTO?",
    almostTitle: "Puoi comunque guadagnare punti.",
    almostText: "Hai indovinato il vincitore o il pareggio? Allora calcoliamo quanto il tuo pronostico si discosta dal risultato reale.",
    rule1Title: "2 punti in meno per ogni gol di differenza",
    rule1Text: "Sommiamo lo scarto di entrambe le squadre.",
    rule2Title: "Minimo 2 punti",
    rule2Text: "Finché hai pronosticato il vincitore corretto o il pareggio corretto.",
    rule3Title: "Esito della partita errato = 0",
    rule3Text: "Hai pronosticato il vincitore sbagliato o mancato un pareggio? Allora ottieni 0 punti.",
    example: "ESEMPIO",
    home: "Casa",
    away: "Trasferta",
    exact: "Esatto",
    oneGoalOff: "1 gol di differenza",
    twoGoalsOff: "2 gol di differenza",
    fourGoalsOff: "4 gol di differenza",
    sixGoalsOff: "6 gol di differenza",
    wrongWinner: "Vincitore sbagliato",
    anotherExample: "UN ALTRO ESEMPIO",
    drawTitle: "La partita finisce 1-1",
    drawText: "Un 1-1 esatto vale al massimo 14 punti. Se pronostichi comunque un pareggio ma sei più lontano dal risultato, perdi 2 punti per ogni gol di differenza.",
    whyEyebrow: "PERCHÉ QUESTO SISTEMA?",
    whyTitle: "Ogni pronostico conta in modo diverso.",
    whyText: "Pronosticare esattamente un risultato spettacolare viene premiato di più. Allo stesso tempo, guadagni punti anche quando indovini l'esito della partita e resti vicino al risultato reale. In questo modo si crea più differenza tra i giocatori in classifica.",
    predictMatches: "Pronostica le partite →",
  },
  pt: {
    badge: "⚽ COMO FUNCIONA O VOETIQ",
    heroBefore: "Prevê. Pontua.",
    heroHighlight: " Sobe.",
    heroText: "Prevê os resultados dos jogos de futebol, ganha pontos e compete com amigos e outros jogadores.",
    step1Title: "Prevê os jogos",
    step1Text: "Introduz a tua previsão antes do apito inicial. Assim que o jogo começar, a tua previsão fica bloqueada.",
    step2Title: "Ganha pontos",
    step2Text: "Quanto mais próxima a tua previsão estiver do resultado real, mais pontos ganhas.",
    step3Title: "Sobe na classificação",
    step3Text: "Compara os teus pontos com os de outros jogadores e tenta chegar ao topo da classificação.",
    scoringEyebrow: "SISTEMA DE PONTOS VOETIQ",
    scoringTitle: "Nem todos os resultados valem o mesmo.",
    formula: "10 + (golos × 2)",
    scoringIntro: "Um resultado exato com muitos golos é mais difícil de prever. Por isso, uma previsão assim vale mais pontos.",
    realScore: "Resultado real",
    points: "pontos",
    almostEyebrow: "QUASE CERTO?",
    almostTitle: "Ainda podes ganhar pontos.",
    almostText: "Acertaste no vencedor ou no empate? Então calculamos a diferença entre a tua previsão e o resultado real.",
    rule1Title: "Menos 2 pontos por cada golo de diferença",
    rule1Text: "Somamos a diferença das duas equipas.",
    rule2Title: "Mínimo de 2 pontos",
    rule2Text: "Desde que tenhas previsto o vencedor correto ou o empate correto.",
    rule3Title: "Resultado do jogo errado = 0",
    rule3Text: "Preveste o vencedor errado ou falhaste um empate? Então recebes 0 pontos.",
    example: "EXEMPLO",
    home: "Casa",
    away: "Fora",
    exact: "Exato",
    oneGoalOff: "1 golo de diferença",
    twoGoalsOff: "2 golos de diferença",
    fourGoalsOff: "4 golos de diferença",
    sixGoalsOff: "6 golos de diferença",
    wrongWinner: "Vencedor errado",
    anotherExample: "OUTRO EXEMPLO",
    drawTitle: "O jogo termina 1-1",
    drawText: "Um 1-1 exato vale no máximo 14 pontos. Se também previres um empate mas estiveres mais longe do resultado, perdes 2 pontos por cada golo de diferença.",
    whyEyebrow: "PORQUÊ ESTE SISTEMA?",
    whyTitle: "Cada previsão conta de forma diferente.",
    whyText: "Prever exatamente um resultado espetacular é mais recompensado. Ao mesmo tempo, também ganhas pontos quando acertas no desfecho do jogo e ficas perto do resultado real. Assim, há mais diferença entre os jogadores na classificação.",
    predictMatches: "Prever jogos →",
  },
};

function isLanguageCode(value: string): value is LanguageCode {
  return ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value);
}

export default function HoeWerktHetPage() {
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

    window.addEventListener("voetiq-language-change", handleLanguageChange);

    return () =>
      window.removeEventListener("voetiq-language-change", handleLanguageChange);
  }, []);

  return (
    <>
      <Navbar />

      <main className="page">
        <section className="hero">
          <div className="badge">{t.badge}</div>
          <h1>
            {t.heroBefore}
            <span>{t.heroHighlight}</span>
          </h1>
          <p>{t.heroText}</p>
        </section>

        <section className="steps">
          <div className="step">
            <div className="number">1</div>
            <div className="icon">⚽</div>
            <h2>{t.step1Title}</h2>
            <p>{t.step1Text}</p>
          </div>
          <div className="step">
            <div className="number">2</div>
            <div className="icon">🎯</div>
            <h2>{t.step2Title}</h2>
            <p>{t.step2Text}</p>
          </div>
          <div className="step">
            <div className="number">3</div>
            <div className="icon">🏆</div>
            <h2>{t.step3Title}</h2>
            <p>{t.step3Text}</p>
          </div>
        </section>

        <section className="scoring">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">{t.scoringEyebrow}</span>
              <h2>{t.scoringTitle}</h2>
            </div>
            <div className="formula">{t.formula}</div>
          </div>
          <p className="intro">{t.scoringIntro}</p>

          <div className="examples">
            {[
              ["0 - 0", 10],
              ["1 - 0", 12],
              ["1 - 1", 14],
              ["2 - 1", 16],
              ["6 - 5", 32],
            ].map(([score, value], index) => (
              <div
                className={`example ${index === 4 ? "highlight" : ""}`}
                key={String(score)}
              >
                <span>{t.realScore}</span>
                <strong>{score}</strong>
                <b>
                  {value} {t.points}
                  {index === 4 ? " 🔥" : ""}
                </b>
              </div>
            ))}
          </div>
        </section>

        <section className="distance">
          <div className="distanceText">
            <span className="eyebrow">{t.almostEyebrow}</span>
            <h2>{t.almostTitle}</h2>
            <p>{t.almostText}</p>

            <div className="rule">
              <div className="ruleIcon">−2</div>
              <div>
                <strong>{t.rule1Title}</strong>
                <p>{t.rule1Text}</p>
              </div>
            </div>

            <div className="rule">
              <div className="ruleIcon">✓</div>
              <div>
                <strong>{t.rule2Title}</strong>
                <p>{t.rule2Text}</p>
              </div>
            </div>

            <div className="rule">
              <div className="ruleIcon">✕</div>
              <div>
                <strong>{t.rule3Title}</strong>
                <p>{t.rule3Text}</p>
              </div>
            </div>
          </div>

          <div className="scoreCard">
            <div className="scoreHeader">
              <span>{t.example}</span>
              <b>{t.realScore}</b>
            </div>

            <div className="realScore">
              <span>{t.home}</span>
              <strong>6</strong>
              <div>–</div>
              <strong>5</strong>
              <span>{t.away}</span>
            </div>

            <div className="scoreRows">
              <div className="scoreRow exact">
                <span>6 - 5</span>
                <small>{t.exact}</small>
                <b>32 pt</b>
              </div>
              <div className="scoreRow">
                <span>5 - 5</span>
                <small>{t.oneGoalOff}</small>
                <b>30 pt</b>
              </div>
              <div className="scoreRow">
                <span>5 - 4</span>
                <small>{t.twoGoalsOff}</small>
                <b>28 pt</b>
              </div>
              <div className="scoreRow">
                <span>4 - 3</span>
                <small>{t.fourGoalsOff}</small>
                <b>24 pt</b>
              </div>
              <div className="scoreRow">
                <span>3 - 2</span>
                <small>{t.sixGoalsOff}</small>
                <b>20 pt</b>
              </div>
              <div className="scoreRow wrong">
                <span>5 - 6</span>
                <small>{t.wrongWinner}</small>
                <b>0 pt</b>
              </div>
            </div>
          </div>
        </section>

        <section className="drawExample">
          <div>
            <span className="eyebrow">{t.anotherExample}</span>
            <h2>{t.drawTitle}</h2>
            <p>{t.drawText}</p>
          </div>

          <div className="miniScores">
            {[
              ["1 - 1", 14],
              ["2 - 2", 10],
              ["3 - 3", 6],
              ["4 - 4", 2],
            ].map(([score, value]) => (
              <div key={String(score)}>
                <span>{score}</span>
                <b>
                  {value} {t.points}
                </b>
              </div>
            ))}
          </div>
        </section>

        <section className="why">
          <span className="eyebrow">{t.whyEyebrow}</span>
          <h2>{t.whyTitle}</h2>
          <p>{t.whyText}</p>
          <a href="/wedstrijden">{t.predictMatches}</a>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(
              circle at top right,
              rgba(29, 145, 89, 0.18),
              transparent 32%
            ),
            #07130f;
          color: white;
          padding: 70px 24px 100px;
        }

        .hero,
        .steps,
        .scoring,
        .distance,
        .drawExample,
        .why {
          max-width: 1180px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero {
          text-align: center;
          padding: 50px 0 70px;
        }

        .badge,
        .eyebrow {
          color: #58e59a;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 1.5px;
        }

        .hero h1 {
          margin: 18px 0;
          font-size: clamp(42px, 7vw, 76px);
          line-height: 0.98;
          letter-spacing: -3px;
        }

        .hero h1 span {
          color: #58e59a;
        }

        .hero p {
          max-width: 680px;
          margin: 0 auto;
          color: #aebdb7;
          font-size: 18px;
          line-height: 1.7;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-bottom: 90px;
        }

        .step {
          position: relative;
          padding: 30px;
          border: 1px solid #1d352c;
          background: #0b1c16;
          border-radius: 20px;
        }

        .number {
          position: absolute;
          right: 24px;
          top: 20px;
          color: #29473b;
          font-size: 46px;
          font-weight: 900;
        }

        .icon {
          font-size: 32px;
          margin-bottom: 22px;
        }

        .step h2 {
          font-size: 20px;
          margin: 0 0 10px;
        }

        .step p,
        .intro,
        .distanceText > p,
        .drawExample p,
        .why p {
          color: #9eafa8;
          line-height: 1.7;
        }

        .scoring {
          padding: 45px;
          border-radius: 26px;
          background: #0b1c16;
          border: 1px solid #1d352c;
          margin-bottom: 80px;
        }

        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
        }

        .sectionHeader h2,
        .distance h2,
        .drawExample h2,
        .why h2 {
          margin: 10px 0;
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -1px;
        }

        .formula {
          background: #123426;
          color: #6ff0a8;
          border: 1px solid #275d45;
          padding: 14px 20px;
          border-radius: 12px;
          font-weight: 900;
          white-space: nowrap;
        }

        .intro {
          max-width: 750px;
          margin-bottom: 32px;
        }

        .examples {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }

        .example {
          padding: 22px 15px;
          background: #081510;
          border: 1px solid #19372a;
          border-radius: 16px;
          text-align: center;
        }

        .example span {
          display: block;
          color: #758a81;
          font-size: 12px;
          margin-bottom: 10px;
        }

        .example strong {
          display: block;
          font-size: 27px;
          margin-bottom: 10px;
        }

        .example b {
          color: #58e59a;
        }

        .example.highlight {
          border-color: #4bca84;
          background: #0c261b;
        }

        .distance {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 55px;
          align-items: center;
          margin-bottom: 90px;
        }

        .rule {
          display: flex;
          gap: 16px;
          margin-top: 22px;
          align-items: flex-start;
        }

        .ruleIcon {
          min-width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #123426;
          color: #62e99f;
          font-weight: 900;
        }

        .rule strong {
          font-size: 16px;
        }

        .rule p {
          color: #84978f;
          margin: 5px 0 0;
          line-height: 1.5;
          font-size: 14px;
        }

        .scoreCard {
          background: #0b1c16;
          border: 1px solid #234435;
          border-radius: 24px;
          overflow: hidden;
        }

        .scoreHeader {
          display: flex;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #1b352b;
          color: #80938b;
          font-size: 12px;
        }

        .scoreHeader span {
          color: #58e59a;
          font-weight: 900;
        }

        .realScore {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 15px;
          padding: 28px;
          background: #0d241b;
        }

        .realScore strong {
          font-size: 36px;
        }

        .realScore span {
          color: #81958d;
          font-size: 12px;
        }

        .scoreRows {
          padding: 10px 20px 20px;
        }

        .scoreRow {
          display: grid;
          grid-template-columns: 80px 1fr 70px;
          gap: 10px;
          align-items: center;
          padding: 14px 8px;
          border-bottom: 1px solid #172e25;
        }

        .scoreRow:last-child {
          border-bottom: 0;
        }

        .scoreRow span {
          font-weight: 800;
        }

        .scoreRow small {
          color: #7f928a;
        }

        .scoreRow b {
          color: #58e59a;
          text-align: right;
        }

        .scoreRow.exact {
          background: rgba(70, 210, 132, 0.08);
          border-radius: 10px;
        }

        .scoreRow.wrong b {
          color: #e76e6e;
        }

        .drawExample {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 50px;
          align-items: center;
          padding: 45px;
          background: #091913;
          border: 1px solid #1b352b;
          border-radius: 26px;
          margin-bottom: 80px;
        }

        .miniScores {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .miniScores div {
          display: flex;
          flex-direction: column;
          padding: 20px;
          background: #0d241b;
          border-radius: 14px;
          border: 1px solid #1e4031;
        }

        .miniScores span {
          font-size: 23px;
          font-weight: 900;
          margin-bottom: 6px;
        }

        .miniScores b {
          color: #58e59a;
          font-size: 14px;
        }

        .why {
          text-align: center;
          padding: 50px 20px;
        }

        .why p {
          max-width: 720px;
          margin: 15px auto 30px;
        }

        .why a {
          display: inline-block;
          padding: 15px 24px;
          background: #50df93;
          color: #04120c;
          border-radius: 12px;
          text-decoration: none;
          font-weight: 900;
        }

        @media (max-width: 900px) {
          .steps,
          .distance,
          .drawExample {
            grid-template-columns: 1fr;
          }

          .examples {
            grid-template-columns: repeat(2, 1fr);
          }

          .sectionHeader {
            align-items: flex-start;
            flex-direction: column;
          }

          .scoring,
          .drawExample {
            padding: 28px;
          }
        }

        @media (max-width: 560px) {
          .page {
            padding-left: 16px;
            padding-right: 16px;
          }

          .hero {
            padding-top: 30px;
          }

          .hero h1 {
            letter-spacing: -2px;
          }

          .examples,
          .miniScores {
            grid-template-columns: 1fr;
          }

          .scoring,
          .drawExample {
            padding: 22px;
          }

          .scoreRow {
            grid-template-columns: 60px 1fr 55px;
          }
        }
      `}</style>
    </>
  );
}
