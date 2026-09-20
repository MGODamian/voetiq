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
  journeyEyebrow: string;
  journeyTitle: string;
  journeyText: string;
  poolsTitle: string;
  poolsText: string;
  challengesTitle: string;
  challengesText: string;
  achievementsTitle: string;
  achievementsText: string;
  ranksTitle: string;
  ranksText: string;
  dashboardTitle: string;
  dashboardText: string;
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
    journeyEyebrow: "MEER DAN ALLEEN VOORSPELLEN",
    journeyTitle: "Bouw je eigen VoetIQ-carrière.",
    journeyText: "Je voorspellingen vormen de basis. Daarna kun je jezelf uitdagen, samen met vrienden spelen en steeds verder groeien.",
    poolsTitle: "Speel in poules",
    poolsText: "Maak een poule of sluit je aan bij vrienden en vergelijk jullie prestaties.",
    challengesTitle: "Voltooi challenges",
    challengesText: "Werk aan dagelijkse en wekelijkse uitdagingen terwijl je voorspelt.",
    achievementsTitle: "Verdien achievements",
    achievementsText: "Ontgrendel mijlpalen door te voorspellen, punten te pakken en goede reeksen neer te zetten.",
    ranksTitle: "Stijg in voetbalrang",
    ranksText: "Je totaalpunten bepalen je voetbalrang. Hoe meer punten, hoe verder je carrière groeit.",
    dashboardTitle: "Alles op je dashboard",
    dashboardText: "Bekijk je punten, rang, voorspellingen, poules, challenges en achievements overzichtelijk op één plek.",
    scoringEyebrow: "VOETIQ PUNTENSYSTEEM",
    scoringTitle: "Niet iedere uitslag is evenveel waard.",
    formula: "10 + (doelpunten × 2)",
    scoringIntro: "Een exacte uitslag met veel doelpunten is moeilijker te voorspellen. Daarom levert zo'n voorspelling meer punten op.",
    realScore: "Echte uitslag",
    points: "punten",
    almostEyebrow: "BIJNA GOED?",
    almostTitle: "Dan kun je nog steeds punten verdienen.",
    almostText: "Heb je de winnaar of het gelijkspel goed voorspeld, maar niet de exacte uitslag? Dan krijg je alsnog punten. Hoe dichter jouw voorspelling bij de echte uitslag zit, hoe meer punten je verdient.",
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
    drawText: "Een exacte 1-1 is maximaal 14 punten waard. Voorspel je wel een gelijkspel, maar wijkt jouw voorspelling af? Dan gaan er per afwijkend doelpunt 2 punten vanaf.",
    whyEyebrow: "WAAROM DIT SYSTEEM?",
    whyTitle: "Elke voorspelling telt anders.",
    whyText: "Hoe nauwkeuriger je voorspelt, hoe meer punten je verdient. Vooral een hoge uitslag exact voorspellen kan daarom veel punten opleveren.",
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
    journeyEyebrow: "MORE THAN PREDICTIONS",
    journeyTitle: "Build your own VoetIQ career.",
    journeyText: "Your predictions are the foundation. From there you can challenge yourself, play with friends and keep progressing.",
    poolsTitle: "Play in pools",
    poolsText: "Create a pool or join your friends and compare your performances.",
    challengesTitle: "Complete challenges",
    challengesText: "Work on daily and weekly challenges while making predictions.",
    achievementsTitle: "Earn achievements",
    achievementsText: "Unlock milestones by predicting, earning points and building strong streaks.",
    ranksTitle: "Climb football ranks",
    ranksText: "Your total points determine your football rank. The more points you earn, the further your career grows.",
    dashboardTitle: "Everything on your dashboard",
    dashboardText: "See your points, rank, predictions, pools, challenges and achievements clearly in one place.",
    scoringEyebrow: "VOETIQ SCORING SYSTEM",
    scoringTitle: "Not every score is worth the same.",
    formula: "10 + (goals × 2)",
    scoringIntro: "An exact score with lots of goals is harder to predict. That's why such a prediction earns more points.",
    realScore: "Actual score",
    points: "points",
    almostEyebrow: "ALMOST RIGHT?",
    almostTitle: "You can still earn points.",
    almostText: "Did you predict the correct winner or a draw, but not the exact score? You can still earn points. The closer your prediction is to the actual score, the more points you earn.",
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
    drawText: "An exact 1-1 is worth up to 14 points. If you correctly predict a draw but your score is different, 2 points are deducted for every goal of difference.",
    whyEyebrow: "WHY THIS SYSTEM?",
    whyTitle: "Every prediction counts differently.",
    whyText: "The more accurate your prediction, the more points you earn. Predicting a high-scoring result exactly can therefore earn you a lot of points.",
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
    journeyEyebrow: "MEHR ALS NUR TIPPEN",
    journeyTitle: "Baue deine eigene VoetIQ-Karriere auf.",
    journeyText: "Deine Tipps sind die Grundlage. Danach kannst du dich Herausforderungen stellen, mit Freunden spielen und immer weiter aufsteigen.",
    poolsTitle: "In Tipprunden spielen",
    poolsText: "Erstelle eine Tipprunde oder tritt deinen Freunden bei und vergleicht eure Leistungen.",
    challengesTitle: "Challenges abschließen",
    challengesText: "Erfülle tägliche und wöchentliche Herausforderungen während du tippst.",
    achievementsTitle: "Erfolge freischalten",
    achievementsText: "Schalte Meilensteine durch Tipps, Punkte und starke Serien frei.",
    ranksTitle: "Im Fußballrang aufsteigen",
    ranksText: "Deine Gesamtpunkte bestimmen deinen Fußballrang. Je mehr Punkte du sammelst, desto weiter wächst deine Karriere.",
    dashboardTitle: "Alles auf deinem Dashboard",
    dashboardText: "Sieh Punkte, Rang, Tipps, Tipprunden, Challenges und Erfolge übersichtlich an einem Ort.",
    scoringEyebrow: "VOETIQ-PUNKTESYSTEM",
    scoringTitle: "Nicht jedes Ergebnis ist gleich viel wert.",
    formula: "10 + (Tore × 2)",
    scoringIntro: "Ein exaktes Ergebnis mit vielen Toren ist schwieriger vorherzusagen. Deshalb bringt ein solcher Tipp mehr Punkte.",
    realScore: "Endergebnis",
    points: "Punkte",
    almostEyebrow: "FAST RICHTIG?",
    almostTitle: "Dann kannst du trotzdem Punkte sammeln.",
    almostText: "Hast du den richtigen Sieger oder ein Unentschieden vorhergesagt, aber nicht das genaue Ergebnis? Dann bekommst du trotzdem Punkte. Je näher dein Tipp am tatsächlichen Ergebnis liegt, desto mehr Punkte erhältst du.",
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
    drawText: "Ein exaktes 1:1 ist maximal 14 Punkte wert. Tippst du richtig auf ein Unentschieden, aber dein Ergebnis weicht ab, werden pro abweichendem Tor 2 Punkte abgezogen.",
    whyEyebrow: "WARUM DIESES SYSTEM?",
    whyTitle: "Jeder Tipp zählt anders.",
    whyText: "Je genauer dein Tipp ist, desto mehr Punkte erhältst du. Ein torreiches Ergebnis exakt vorherzusagen kann daher besonders viele Punkte bringen.",
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
    journeyEyebrow: "MÁS QUE PRONÓSTICOS",
    journeyTitle: "Construye tu propia carrera en VoetIQ.",
    journeyText: "Tus pronósticos son la base. Después puedes superar desafíos, jugar con amigos y seguir progresando.",
    poolsTitle: "Juega en ligas",
    poolsText: "Crea una liga o únete a tus amigos y comparad vuestro rendimiento.",
    challengesTitle: "Completa desafíos",
    challengesText: "Supera desafíos diarios y semanales mientras haces pronósticos.",
    achievementsTitle: "Consigue logros",
    achievementsText: "Desbloquea hitos haciendo pronósticos, consiguiendo puntos y creando buenas rachas.",
    ranksTitle: "Sube de rango futbolístico",
    ranksText: "Tus puntos totales determinan tu rango. Cuantos más puntos consigas, más avanzará tu carrera.",
    dashboardTitle: "Todo en tu panel",
    dashboardText: "Consulta tus puntos, rango, pronósticos, ligas, desafíos y logros claramente en un solo lugar.",
    scoringEyebrow: "SISTEMA DE PUNTOS DE VOETIQ",
    scoringTitle: "No todos los resultados valen lo mismo.",
    formula: "10 + (goles × 2)",
    scoringIntro: "Un resultado exacto con muchos goles es más difícil de pronosticar. Por eso, un pronóstico así otorga más puntos.",
    realScore: "Resultado real",
    points: "puntos",
    almostEyebrow: "¿CASI ACERTASTE?",
    almostTitle: "Aún puedes ganar puntos.",
    almostText: "¿Has acertado el ganador o el empate, pero no el resultado exacto? Aun así puedes ganar puntos. Cuanto más se acerque tu pronóstico al resultado real, más puntos obtendrás.",
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
    drawText: "Un 1-1 exacto vale como máximo 14 puntos. Si aciertas el empate pero tu marcador es diferente, se restan 2 puntos por cada gol de diferencia.",
    whyEyebrow: "¿POR QUÉ ESTE SISTEMA?",
    whyTitle: "Cada pronóstico cuenta de forma diferente.",
    whyText: "Cuanto más preciso sea tu pronóstico, más puntos ganarás. Acertar exactamente un resultado con muchos goles puede darte muchos puntos.",
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
    journeyEyebrow: "PLUS QUE DES PRONOSTICS",
    journeyTitle: "Construisez votre propre carrière VoetIQ.",
    journeyText: "Vos pronostics sont la base. Ensuite, relevez des défis, jouez avec vos amis et continuez à progresser.",
    poolsTitle: "Jouez dans des poules",
    poolsText: "Créez une poule ou rejoignez vos amis et comparez vos performances.",
    challengesTitle: "Relevez des challenges",
    challengesText: "Progressez dans des défis quotidiens et hebdomadaires en faisant vos pronostics.",
    achievementsTitle: "Débloquez des succès",
    achievementsText: "Atteignez des étapes grâce à vos pronostics, vos points et vos bonnes séries.",
    ranksTitle: "Montez de rang",
    ranksText: "Votre total de points détermine votre rang football. Plus vous gagnez de points, plus votre carrière progresse.",
    dashboardTitle: "Tout sur votre tableau de bord",
    dashboardText: "Retrouvez clairement vos points, rang, pronostics, poules, challenges et succès au même endroit.",
    scoringEyebrow: "SYSTÈME DE POINTS VOETIQ",
    scoringTitle: "Tous les scores n'ont pas la même valeur.",
    formula: "10 + (buts × 2)",
    scoringIntro: "Un score exact avec beaucoup de buts est plus difficile à prévoir. C'est pourquoi un tel pronostic rapporte davantage de points.",
    realScore: "Score réel",
    points: "points",
    almostEyebrow: "PRESQUE JUSTE ?",
    almostTitle: "Vous pouvez quand même gagner des points.",
    almostText: "Avez-vous trouvé le bon vainqueur ou le match nul, mais pas le score exact ? Vous gagnez quand même des points. Plus votre pronostic est proche du score réel, plus vous gagnez de points.",
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
    drawText: "Un score exact de 1-1 vaut au maximum 14 points. Si vous avez bien pronostiqué un match nul mais que votre score est différent, 2 points sont retirés pour chaque but d'écart.",
    whyEyebrow: "POURQUOI CE SYSTÈME ?",
    whyTitle: "Chaque pronostic compte différemment.",
    whyText: "Plus votre pronostic est précis, plus vous gagnez de points. Prédire exactement un score élevé peut donc rapporter beaucoup de points.",
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
    journeyEyebrow: "PIÙ DI SEMPLICI PRONOSTICI",
    journeyTitle: "Costruisci la tua carriera VoetIQ.",
    journeyText: "I pronostici sono la base. Poi puoi affrontare sfide, giocare con gli amici e continuare a crescere.",
    poolsTitle: "Gioca nei gironi",
    poolsText: "Crea un girone o unisciti ai tuoi amici e confrontate le vostre prestazioni.",
    challengesTitle: "Completa le sfide",
    challengesText: "Affronta sfide giornaliere e settimanali mentre fai i tuoi pronostici.",
    achievementsTitle: "Ottieni obiettivi",
    achievementsText: "Sblocca traguardi facendo pronostici, guadagnando punti e creando serie positive.",
    ranksTitle: "Sali di rango calcistico",
    ranksText: "I tuoi punti totali determinano il rango calcistico. Più punti guadagni, più cresce la tua carriera.",
    dashboardTitle: "Tutto nella dashboard",
    dashboardText: "Visualizza punti, rango, pronostici, gironi, sfide e obiettivi in modo chiaro in un unico posto.",
    scoringEyebrow: "SISTEMA DI PUNTEGGIO VOETIQ",
    scoringTitle: "Non tutti i risultati valgono allo stesso modo.",
    formula: "10 + (gol × 2)",
    scoringIntro: "Un risultato esatto con molti gol è più difficile da pronosticare. Per questo un pronostico del genere vale più punti.",
    realScore: "Risultato reale",
    points: "punti",
    almostEyebrow: "QUASI GIUSTO?",
    almostTitle: "Puoi comunque guadagnare punti.",
    almostText: "Hai indovinato il vincitore o il pareggio, ma non il risultato esatto? Puoi comunque guadagnare punti. Più il tuo pronostico è vicino al risultato reale, più punti ottieni.",
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
    drawText: "Un 1-1 esatto vale al massimo 14 punti. Se indovini il pareggio ma il tuo risultato è diverso, vengono sottratti 2 punti per ogni gol di differenza.",
    whyEyebrow: "PERCHÉ QUESTO SISTEMA?",
    whyTitle: "Ogni pronostico conta in modo diverso.",
    whyText: "Più preciso è il tuo pronostico, più punti guadagni. Indovinare esattamente un risultato con molti gol può quindi farti guadagnare molti punti.",
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
    journeyEyebrow: "MAIS DO QUE PREVISÕES",
    journeyTitle: "Constrói a tua própria carreira VoetIQ.",
    journeyText: "As tuas previsões são a base. Depois podes enfrentar desafios, jogar com amigos e continuar a evoluir.",
    poolsTitle: "Joga em grupos",
    poolsText: "Cria um grupo ou junta-te aos teus amigos e compara os vossos desempenhos.",
    challengesTitle: "Completa desafios",
    challengesText: "Avança em desafios diários e semanais enquanto fazes previsões.",
    achievementsTitle: "Conquista achievements",
    achievementsText: "Desbloqueia marcos através de previsões, pontos e boas sequências.",
    ranksTitle: "Sobe de nível futebolístico",
    ranksText: "Os teus pontos totais determinam o teu nível. Quanto mais pontos ganhares, mais a tua carreira evolui.",
    dashboardTitle: "Tudo no teu dashboard",
    dashboardText: "Vê pontos, nível, previsões, grupos, desafios e achievements de forma clara num só lugar.",
    scoringEyebrow: "SISTEMA DE PONTOS VOETIQ",
    scoringTitle: "Nem todos os resultados valem o mesmo.",
    formula: "10 + (golos × 2)",
    scoringIntro: "Um resultado exato com muitos golos é mais difícil de prever. Por isso, uma previsão assim vale mais pontos.",
    realScore: "Resultado real",
    points: "pontos",
    almostEyebrow: "QUASE CERTO?",
    almostTitle: "Ainda podes ganhar pontos.",
    almostText: "Acertaste no vencedor ou no empate, mas não no resultado exato? Ainda assim ganhas pontos. Quanto mais próxima a tua previsão estiver do resultado real, mais pontos ganhas.",
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
    drawText: "Um 1-1 exato vale no máximo 14 pontos. Se acertares no empate mas o teu resultado for diferente, são retirados 2 pontos por cada golo de diferença.",
    whyEyebrow: "PORQUÊ ESTE SISTEMA?",
    whyTitle: "Cada previsão conta de forma diferente.",
    whyText: "Quanto mais precisa for a tua previsão, mais pontos ganhas. Acertar exatamente num resultado com muitos golos pode, por isso, valer muitos pontos.",
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

        <section className="journey">
          <div className="journeyHeader">
            <span className="eyebrow">{t.journeyEyebrow}</span>
            <h2>{t.journeyTitle}</h2>
            <p>{t.journeyText}</p>
          </div>

          <div className="journeyGrid">
            <div className="journeyCard"><span>👥</span><div><h3>{t.poolsTitle}</h3><p>{t.poolsText}</p></div></div>
            <div className="journeyCard"><span>🎯</span><div><h3>{t.challengesTitle}</h3><p>{t.challengesText}</p></div></div>
            <div className="journeyCard"><span>🏅</span><div><h3>{t.achievementsTitle}</h3><p>{t.achievementsText}</p></div></div>
            <div className="journeyCard"><span>⭐</span><div><h3>{t.ranksTitle}</h3><p>{t.ranksText}</p></div></div>
            <div className="journeyCard wide"><span>📊</span><div><h3>{t.dashboardTitle}</h3><p>{t.dashboardText}</p></div></div>
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
        .journey,
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

        .journey {
          margin-bottom: 80px;
        }

        .journeyHeader {
          max-width: 760px;
          margin-bottom: 24px;
        }

        .journeyHeader h2 {
          margin: 10px 0;
          font-size: clamp(28px, 4vw, 42px);
          letter-spacing: -1px;
        }

        .journeyHeader p {
          color: #9eafa8;
          line-height: 1.7;
          margin: 0;
        }

        .journeyGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .journeyCard {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 22px;
          border: 1px solid #1d352c;
          background: #0b1c16;
          border-radius: 18px;
        }

        .journeyCard.wide {
          grid-column: 1 / -1;
        }

        .journeyCard > span {
          font-size: 25px;
          line-height: 1;
        }

        .journeyCard h3 {
          margin: 0 0 7px;
          font-size: 16px;
        }

        .journeyCard p {
          margin: 0;
          color: #84978f;
          line-height: 1.55;
          font-size: 13px;
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
          .drawExample,
          .journeyGrid {
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
