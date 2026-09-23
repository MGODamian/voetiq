Welke tekst kan ik in de beschrijving zetten
ik had gister al paar sitemaps-url opgegeven en geindexeerd
Pasted text(20260923-093724).txt
Document
Pasted text(20260923-093746).txt
Document
Pasted text(20260923-093838).txt
Document
Pasted text(20260923-093948).txt
Document

Ja, ik heb de hele pagina bekeken. 👍 Dit is opnieuw een client component, dus we laten je gamecode volledig met rust.

De pagina heeft inhoudelijk al een sterke basis: de H1 is “Wie is de speler?” en er staat duidelijk bij dat je een voetballer moet raden met zo min mogelijk hints.

Maak nu:

app/games/wie-is-de-speler/layout.tsx

met dit volledige bestand:

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wie is de speler? – Raad de voetballer | VoetIQ",

  description:
    "Speel Wie is de speler gratis bij VoetIQ. Raad bekende voetballers aan de hand van hints, verdien punten en test jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/wie-is-de-speler",
  },

  openGraph: {
    title: "Wie is de speler? – Raad de voetballer | VoetIQ",
    description:
      "Kun jij de voetballer raden met zo min mogelijk hints? Speel Wie is de speler gratis bij VoetIQ.",
    url: "https://voetiq.nl/games/wie-is-de-speler",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function WhoIsThePlayerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

Hiermee krijgt juist deze URL een eigen Google-focus rond “wie is de speler”, “raad de voetballer” en “voetballer raden”, terwijl de game zelf exact hetzelfde blijft.

Commit deze weer. Daarna pakken we /games/raad-het-stadion.

gecommit

Top, die staat. ✅

Dan is nu geregeld:

/games ✅
/games/wie-is-de-speler ✅

We gaan door met Raad het stadion.

Stuur nu je huidige volledige bestand:

app/games/raad-het-stadion/page.tsx

Als daar al een layout.tsx staat, stuur die ook mee. Anders maken we er net als bij Wie is de speler? een aparte SEO-layout voor, zonder de gamecode aan te raken.

Pasted text(20260923-094125).txt
Document

Ja, deze heb ik bekeken. Ook raad-het-stadion/page.tsx begint met "use client", dus opnieuw is een aparte layout de veiligste oplossing.

De inhoud sluit er goed op aan: de game vraagt welke “voetbaltempel” wordt gezocht en laat de gebruiker het stadion raden met hints.

Maak:

app/games/raad-het-stadion/layout.tsx

en zet dit volledige bestand erin:

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raad het voetbalstadion – Stadion quiz | VoetIQ",

  description:
    "Speel Raad het Stadion gratis bij VoetIQ. Herken beroemde voetbalstadions aan de hand van hints, verdien punten en test jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/raad-het-stadion",
  },

  openGraph: {
    title: "Raad het voetbalstadion – Stadion quiz | VoetIQ",
    description:
      "Hoeveel voetbalstadions herken jij? Gebruik de hints, raad beroemde stadions en haal de hoogste score bij VoetIQ.",
    url: "https://voetiq.nl/games/raad-het-stadion",
    siteName: "VoetIQ",
    locale: "nl_NL",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RaadHetStadionLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

Deze richt zich vooral op “raad het stadion”, “voetbalstadion raden”, “stadion quiz” en “voetbalstadions herkennen”.

Je page.tsx hoef je dus niet te wijzigen. Commit alleen deze nieuwe layout.tsx. Daarna gaan we naar Voetbalquiz.

gecommit

Top! ✅ Dan is Raad het stadion ook geregeld.

Tot nu toe hebben we:

/games ✅
/games/wie-is-de-speler ✅
/games/raad-het-stadion ✅

Nu gaan we door met Voetbalquiz.

Stuur je huidige:

app/games/voetbalquiz/page.tsx

Als daar nog geen layout.tsx staat, maken we daarna weer een aparte SEO-layout, gericht op zoektermen zoals voetbal quiz, voetbalquiz online en voetbalkennis quiz.

Pasted text(20260923-094216).txt
Document
alleen in het bestand staat heel veel informatie hoezo moet ik alles verwijderen en dan een bestand aanmaken waar amper iets in staat

Ahh, ik snap de verwarring. Je moet absoluut niet alles uit dat grote page.tsx-bestand verwijderen. 😄

Je grote bestand blijft gewoon bestaan. Daar staat de hele game in: de vragenbank, puntentelling, knoppen, score, vormgeving enzovoort. Ik zie bijvoorbeeld dat je page.tsx bijna 900 regels bevat en de hele vragenbank plus quizlogica bevat.

We voegen er alleen een tweede bestand naast toe:

app
└── games
    └── voetbalquiz
        ├── page.tsx       ← JOUW GROTE BESTAND BLIJFT STAAN
        └── layout.tsx     ← klein NIEUW bestand voor SEO

Dus niet page.tsx vervangen door mijn kleine code.

Het werkt zo:

page.tsx = wat de bezoeker ziet en waarmee hij speelt. Jouw quiz toont bijvoorbeeld 10 willekeurige vragen en houdt de score bij.

layout.tsx = extra informatie voor Next.js/Google, zoals:
title, description, canonical URL en Open Graph.

Daarom is die layout.tsx zo klein. Hij hoeft je quizcode niet opnieuw te bevatten.

En dit geldt ook voor wat we zojuist hebben gedaan bij Wie is de speler en Raad het stadion: ik bedoelde daar óók dat je de nieuwe layout.tsx naast de bestaande page.tsx zet.

Als je bij die vorige twee daadwerkelijk de grote page.tsx hebt verwijderd/vervangen, zeg het meteen, want dan herstellen we die eerst.

markdown(1).md geplakt
Bestand
want bijvoorbeeld dit stond er in raad-het-stadion en ik heb alles verwijderd en een klein bestand erin gezet klopt dat wel

Nee — als je de grote page.tsx van Raad het stadion hebt verwijderd en vervangen door het kleine SEO-bestand, dan is dat niet goed. Goed dat je dit nu opmerkt.

Ik zie in wat je stuurde dat je oorspronkelijke bestand juist de volledige game bevat: de lijst met stadions begint daar, daarna komt de spel-logica en verderop de complete interface. De eigenlijke RaadHetStadionPage() begint pas rond regel 328.

Je map moet uiteindelijk twee bestanden hebben:

app/
└── games/
    └── raad-het-stadion/
        ├── page.tsx      ← het GROTE oorspronkelijke bestand
        └── layout.tsx    ← het KLEINE SEO-bestand

Dus als jij het grote page.tsx hebt leeggemaakt en daar mijn SEO-code in hebt gezet, moeten we dat herstellen.

Doe nu nog even niets met Voetbalquiz. We herstellen eerst Raad het stadion, en daarna controleren we ook Wie is de speler, want mogelijk is daar hetzelfde gebeurd.

Stuur mij even een screenshot van de bestanden die nu in de map:

app/games/raad-het-stadion

staan. Dan zeg ik je exact wat we moeten herstellen zonder iets kwijt te raken.

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Raad het voetbalstadion – Stadion quiz | VoetIQ",

  description:
    "Speel Raad het Stadion gratis bij VoetIQ. Herken beroemde voetbalstadions aan de hand van hints, verdien punten en test jouw voetbalkennis.",

  alternates: {
    canonical: "https://voetiq.nl/games/raad-het-stadion",
  },

  openGraph: {
    title: "Raad het voetbalstadion – Stadion quiz | VoetIQ",
    description:
      "Hoeveel voetbalstadions herken jij? Gebruik de hints, raad beroemde stadions en haal de hoogste score bij VoetIQ.",
    url: "https://voetiq.nl/games/raad-het-stadion", 
    siteName: "VoetIQ", 
    locale: "nl_NL", 
    type: "website", 
  }, 
 
  robots: { 
    index: true, 
    follow: true, 
  }, 
}; 
 
export default function RaadHetStadionLayout({ 
  children, 
}: Readonly<{ 
  children: React.ReactNode; 
}>) { 
  return children; 
}

ik heb nu dit erin staaan

Ja — deze code is helemaal goed, maar hij hoort in layout.tsx, niet in page.tsx. 👍

Dus in de map app/games/raad-het-stadion/ moet dit staan:

raad-het-stadion/
├── page.tsx      ← je oorspronkelijke grote bestand met de hele stadiongame
└── layout.tsx    ← de kleine SEO-code die je hierboven stuurde

Als je nu die kleine code in layout.tsx hebt staan én je grote page.tsx staat er nog naast, dan is alles perfect en hoef je niets te veranderen.

Maar als je de grote inhoud van page.tsx hebt verwijderd en deze kleine code daarvoor in de plaats hebt gezet, dan is de game nu inderdaad overschreven. Je oorspronkelijke bestand bevatte onder andere alle stadions, hints en spelcode.

Zeg me alleen even: staat die code die je zojuist stuurde bij jou in page.tsx of in layout.tsx? Dan geef ik je meteen de juiste volgende stap.

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Stadium = {
name: string;
aliases?: string[];
city: string;
hints: string[];
};

const STADIUMS: Stadium[] = [
{ name: "Johan Cruijff ArenA", aliases: ["Johan Cruijff Arena", "Amsterdam ArenA", "Amsterdam Arena"], city: "Amsterdam", hints: ["Dit stadion werd geopend in 1996.", "Het Nederlands elftal speelt hier regelmatig interlands.", "Het stadion kreeg in 2018 zijn huidige naam.", "Ajax speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Amsterdam."] },
{ name: "De Kuip", aliases: ["Stadion Feijenoord", "Stadion Feyenoord"], city: "Rotterdam", hints: ["Dit stadion werd geopend in 1937.", "Hier zijn veel Nederlandse bekerfinales gespeeld.", "De officiële naam is Stadion Feijenoord.", "Feyenoord speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Rotterdam."] },
{ name: "Philips Stadion", city: "Eindhoven", hints: ["Dit stadion ligt midden in de stad.", "Het staat op historische grond van een bekende Nederlandse topclub.", "De clubkleuren die je hier veel ziet zijn rood en wit.", "PSV speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Eindhoven."] },
{ name: "Old Trafford", city: "Manchester", hints: ["Dit stadion heeft de bijnaam Theatre of Dreams.", "Het werd geopend in 1910.", "Een van de succesvolste Engelse clubs speelt hier.", "Manchester United speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Manchester."] },
{ name: "Anfield", city: "Liverpool", hints: ["Een beroemde tribune hier heet The Kop.", "You'll Never Walk Alone is sterk met dit stadion verbonden.", "Het stadion werd al in de 19e eeuw geopend.", "Liverpool FC speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Liverpool."] },
{ name: "Etihad Stadium", aliases: ["City of Manchester Stadium"], city: "Manchester", hints: ["Dit stadion werd gebruikt tijdens de Commonwealth Games van 2002.", "Het heette oorspronkelijk City of Manchester Stadium.", "De club die hier speelt draagt lichtblauw.", "Manchester City speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Manchester."] },
{ name: "Emirates Stadium", city: "Londen", hints: ["Dit stadion werd geopend in 2006.", "Het verving Highbury als thuisbasis.", "De club die hier speelt wordt The Gunners genoemd.", "Arsenal speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Londen."] },
{ name: "Stamford Bridge", city: "Londen", hints: ["Dit stadion werd geopend in 1877.", "Het ligt in het westen van Londen.", "De club die hier speelt wordt The Blues genoemd.", "Chelsea speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Londen."] },
{ name: "Tottenham Hotspur Stadium", city: "Londen", hints: ["Dit moderne stadion werd geopend in 2019.", "Het kan ook wedstrijden uit de NFL ontvangen.", "Het verving White Hart Lane.", "Tottenham Hotspur speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Londen."] },
{ name: "Wembley Stadium", aliases: ["Wembley"], city: "Londen", hints: ["Dit stadion heeft een enorme herkenbare boog.", "Het huidige stadion werd geopend in 2007.", "Hier worden onder andere FA Cup-finales gespeeld.", "Het Engelse nationale elftal speelt hier.", "Dit stadion staat in Londen."] },
{ name: "Santiago Bernabéu", aliases: ["Santiago Bernabeu", "Bernabéu", "Bernabeu"], city: "Madrid", hints: ["Dit stadion is uitgebreid gerenoveerd in de jaren 2020.", "Het draagt de naam van een voormalige clubpresident.", "De club die hier speelt heeft veel Champions League-titels gewonnen.", "Real Madrid speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Madrid."] },
{ name: "Camp Nou", aliases: ["Spotify Camp Nou", "Nou Camp"], city: "Barcelona", hints: ["Dit stadion werd geopend in 1957.", "Het behoort tot de bekendste voetbalstadions ter wereld.", "De clubkleuren die ermee verbonden zijn, zijn blauw en granaatrood.", "FC Barcelona speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Barcelona."] },
{ name: "Metropolitano", aliases: ["Riyadh Air Metropolitano", "Wanda Metropolitano", "Cívitas Metropolitano", "Civitas Metropolitano"], city: "Madrid", hints: ["De Champions League-finale van 2019 werd hier gespeeld.", "De club verhuisde hierheen vanuit het Vicente Calderón.", "Rood-witte strepen horen bij de thuisclub.", "Atlético Madrid speelt hier zijn thuiswedstrijden.", "Dit stadion staat in Madrid."] },
{ name: "San Mamés", aliases: ["San Mames"], city: "Bilbao", hints: ["Dit moderne stadion opende in 2013.", "De voorganger droeg dezelfde beroemde naam.", "De thuisclub staat bekend om een bijzondere band met Baskische spelers.", "Athletic Club speelt hier.", "Dit stadion staat in Bilbao."] },
{ name: "Allianz Arena", city: "München", hints: ["De buitenkant kan in verschillende kleuren oplichten.", "Dit stadion werd geopend in 2005.", "Het was een speelstadion tijdens het WK van 2006.", "Bayern München speelt hier zijn thuiswedstrijden.", "Dit stadion staat in München."] },
{ name: "Signal Iduna Park", aliases: ["Westfalenstadion"], city: "Dortmund", hints: ["Dit stadion staat bekend om de Gelbe Wand.", "De traditionele naam is Westfalenstadion.", "Het is een van de grootste stadions van Duitsland.", "Borussia Dortmund speelt hier.", "Dit stadion staat in Dortmund."] },
{ name: "Olympiastadion Berlin", aliases: ["Olympiastadion", "Olympisch Stadion Berlijn"], city: "Berlijn", hints: ["Dit stadion werd gebouwd voor de Olympische Spelen van 1936.", "De WK-finale van 2006 werd hier gespeeld.", "Ook de DFB-Pokal-finale wordt hier traditioneel gespeeld.", "Hertha BSC is sterk met dit stadion verbonden.", "Dit stadion staat in Berlijn."] },
{ name: "San Siro", aliases: ["Stadio Giuseppe Meazza", "Giuseppe Meazza"], city: "Milaan", hints: ["Twee grote rivalen delen dit stadion.", "De officiële naam verwijst naar Giuseppe Meazza.", "AC Milan en Inter spelen hier.", "Het is beroemd om zijn grote spiraalvormige torens.", "Dit stadion staat in Milaan."] },
{ name: "Stadio Olimpico", aliases: ["Olympisch Stadion Rome"], city: "Rome", hints: ["Twee grote clubs uit dezelfde stad delen dit stadion.", "Hier werd de WK-finale van 1990 gespeeld.", "AS Roma en Lazio spelen hier.", "Het maakt deel uit van het Foro Italico-complex.", "Dit stadion staat in Rome."] },
{ name: "Stadio Diego Armando Maradona", aliases: ["Stadio San Paolo", "San Paolo"], city: "Napels", hints: ["Dit stadion heette vroeger Stadio San Paolo.", "Het werd hernoemd ter ere van een Argentijnse voetballegende.", "SSC Napoli speelt hier.", "Diego Maradona is onlosmakelijk met de thuisclub verbonden.", "Dit stadion staat in Napels."] },
{ name: "Parc des Princes", city: "Parijs", hints: ["Dit stadion werd in zijn huidige vorm geopend in 1972.", "Het ligt in het westen van de Franse hoofdstad.", "De bekendste club uit Parijs speelt hier.", "Paris Saint-Germain speelt hier.", "Dit stadion staat in Parijs."] },
{ name: "Stade de France", city: "Saint-Denis", hints: ["Dit stadion werd gebouwd voor het WK van 1998.", "De WK-finale van 1998 werd hier gespeeld.", "Het Franse nationale elftal speelt hier regelmatig.", "Het ligt net buiten Parijs.", "Dit stadion staat in Saint-Denis."] },
{ name: "Estádio da Luz", aliases: ["Estadio da Luz", "Da Luz"], city: "Lissabon", hints: ["De naam betekent Stadion van het Licht.", "Hier werd de Champions League-finale van 2014 gespeeld.", "De thuisclub heeft een adelaar als belangrijk symbool.", "Benfica speelt hier.", "Dit stadion staat in Lissabon."] },
{ name: "Estádio do Dragão", aliases: ["Estadio do Dragao", "Estádio do Dragao"], city: "Porto", hints: ["De naam verwijst naar een draak.", "Dit stadion werd geopend voor Euro 2004.", "De thuisclub speelt traditioneel in blauw en wit.", "FC Porto speelt hier.", "Dit stadion staat in Porto."] },
{ name: "Celtic Park", aliases: ["Parkhead"], city: "Glasgow", hints: ["Dit stadion heeft de bijnaam Paradise.", "Groen en wit domineren op de tribunes.", "De thuisclub speelt de Old Firm tegen Rangers.", "Celtic speelt hier.", "Dit stadion staat in Glasgow."] },
{ name: "Ibrox Stadium", aliases: ["Ibrox"], city: "Glasgow", hints: ["Dit stadion ligt aan de zuidkant van de rivier Clyde.", "Blauw is de belangrijkste kleur van de thuisclub.", "De thuisclub speelt de Old Firm tegen Celtic.", "Rangers speelt hier.", "Dit stadion staat in Glasgow."] },
{ name: "Türk Telekom Stadium", aliases: ["RAMS Park", "Ali Sami Yen Spor Kompleksi"], city: "Istanbul", hints: ["Dit stadion is de thuisbasis van een Turkse topclub.", "Rood en geel zijn de kleuren van de thuisclub.", "De thuisclub heeft een leeuw als bekend symbool.", "Galatasaray speelt hier.", "Dit stadion staat in Istanbul."] },
{ name: "Şükrü Saracoğlu Stadium", aliases: ["Sukru Saracoglu Stadium", "Ülker Stadyumu", "Ulker Stadyumu"], city: "Istanbul", hints: ["Dit stadion ligt aan de Aziatische kant van de stad.", "Geel en donkerblauw zijn de clubkleuren.", "De thuisclub is een grote rivaal van Galatasaray.", "Fenerbahçe speelt hier.", "Dit stadion staat in Istanbul."] },
{ name: "Maracanã", aliases: ["Maracana", "Estádio do Maracanã"], city: "Rio de Janeiro", hints: ["Dit stadion werd gebouwd voor het WK van 1950.", "Het organiseerde WK-finales in 1950 en 2014.", "Flamengo en Fluminense spelen hier vaak.", "Het is een van de beroemdste stadions van Zuid-Amerika.", "Dit stadion staat in Rio de Janeiro."] },
{ name: "La Bombonera", aliases: ["Estadio Alberto J. Armando", "Bombonera"], city: "Buenos Aires", hints: ["De bijnaam betekent ongeveer 'de chocoladedoos'.", "Het stadion staat bekend om steile tribunes en intense sfeer.", "Blauw en geel zijn de kleuren van de thuisclub.", "Boca Juniors speelt hier.", "Dit stadion staat in Buenos Aires."] },
{ name: "El Monumental", aliases: ["Estadio Monumental", "Mâs Monumental", "Mas Monumental"], city: "Buenos Aires", hints: ["Dit stadion is de grote rivaal van La Bombonera.", "De Argentijnse nationale ploeg speelt hier vaak.", "River Plate speelt hier.", "Het is een van de grootste stadions van Zuid-Amerika.", "Dit stadion staat in Buenos Aires."] },
{ name: "Estadio Azteca", aliases: ["Azteca"], city: "Mexico-Stad", hints: ["Dit stadion organiseerde WK-finales in 1970 en 1986.", "Pelé en Diego Maradona speelden hier beroemde WK-wedstrijden.", "Club América speelt hier.", "Het is een van de bekendste stadions van Noord-Amerika.", "Dit stadion staat in Mexico-Stad."] },
{ name: "Soccer City", aliases: ["FNB Stadium"], city: "Johannesburg", hints: ["Dit stadion heeft een ontwerp dat doet denken aan een Afrikaanse pot.", "De WK-finale van 2010 werd hier gespeeld.", "Hier vond de openingswedstrijd van het WK 2010 plaats.", "Het is ook bekend als FNB Stadium.", "Dit stadion staat in Johannesburg."] },
{ name: "Lusail Stadium", aliases: ["Lusail Iconic Stadium"], city: "Lusail", hints: ["Dit stadion werd gebouwd voor een WK in het Midden-Oosten.", "De WK-finale van 2022 werd hier gespeeld.", "Argentinië werd hier wereldkampioen na een finale tegen Frankrijk.", "Het stadion ligt ten noorden van Doha.", "Dit stadion staat in Lusail."] },
{ name: "Saitama Stadium 2002", aliases: ["Saitama Stadium"], city: "Saitama", hints: ["Dit stadion werd gebouwd voor het WK van 2002.", "Het is een groot voetbalstadion in Japan.", "Urawa Red Diamonds speelt hier.", "Het nationale elftal van Japan speelt hier regelmatig.", "Dit stadion staat in Saitama."] },
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

export default function RaadHetStadionPage() {
const [rounds, setRounds] = useState<Stadium[]>([]);
const [round, setRound] = useState(0);
const [hintCount, setHintCount] = useState(1);
const [guess, setGuess] = useState("");
const [score, setScore] = useState(0);
const [correct, setCorrect] = useState(0);
const [wrong, setWrong] = useState(0);
const [feedback, setFeedback] = useState("");
const [solved, setSolved] = useState(false);
const [finished, setFinished] = useState(false);

const startGame = () => {
setRounds(shuffle(STADIUMS).slice(0, ROUNDS));
setRound(0);
setHintCount(1);
setGuess("");
setScore(0);
setCorrect(0);
setWrong(0);
setFeedback("");
setSolved(false);
setFinished(false);
};

useEffect(() => {
startGame();
}, []);

const stadium = rounds[round];

const suggestions = useMemo(() => {
if (!guess.trim()) return [];
const q = normalize(guess);
return STADIUMS.filter((item) =>
[item.name, ...(item.aliases ?? [])].some((name) =>
normalize(name).includes(q)
)
).slice(0, 6);
}, [guess]);

const possiblePoints = POINTS[Math.min(hintCount - 1, 4)];

const submitGuess = (value?: string) => {
if (!stadium || solved) return;
const answer = (value ?? guess).trim();
if (!answer) return;

const valid = [stadium.name, ...(stadium.aliases ?? [])].map(normalize);

if (valid.includes(normalize(answer))) {
  setScore((s) => s + possiblePoints);
  setCorrect((c) => c + 1);
  setSolved(true);
  setFeedback(`✓ Correct! Het is ${stadium.name}. +${possiblePoints} punten`);
} else {
  setWrong((w) => w + 1);
  setFeedback(`✕ ${answer} is niet het juiste stadion.`);
}
setGuess("");

};

const nextHint = () => {
if (!stadium || solved || hintCount >= stadium.hints.length) return;
setHintCount((h) => h + 1);
setFeedback("");
};

const giveUp = () => {
if (!stadium || solved) return;
setSolved(true);
setGuess("");
setFeedback(Het antwoord was ${stadium.name}.);
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

if (!stadium && !finished) {
return <main className="stadium-page"><div className="loading">Stadions laden...</div></main>;
}

const percentage = Math.round((correct / ROUNDS) * 100);

return (
<main className="stadium-page">
<div className="ambient a1" />
<div className="ambient a2" />

  <div className="shell">
    <div className="topbar">
      <Link href="/games" className="back">← Games</Link>
      <div className="brand"><span /> VOETIQ GAMES</div>
    </div>

    {!finished ? (
      <>
        <section className="hero">
          <div>
            <span className="eyebrow">🏟️ RAAD HET STADION</span>
            <h1>Welke voetbaltempel <span>zoeken we?</span></h1>
            <p>Gebruik de hints en herken het stadion zo snel mogelijk.</p>
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
          <div className="card-top">
            <div>
              <span>STADIONHINTS</span>
              <strong>{hintCount} van {stadium.hints.length} zichtbaar</strong>
            </div>
            <div className="points">{possiblePoints} PUNTEN</div>
          </div>

          <div className="stadium-visual">
            <div className="roof roof-left" />
            <div className="roof roof-right" />
            <div className="pitch">
              <div className="center-line" />
              <div className="center-circle" />
            </div>
            <div className="stand stand-left">VOETIQ</div>
            <div className="stand stand-right">STADIUM</div>
            <div className="question">?</div>
          </div>

          <div className="hints">
            {stadium.hints.slice(0, hintCount).map((hint, index) => (
              <div className="hint" key={`${hint}-${index}`}>
                <span>{index + 1}</span>
                <p>{hint}</p>
              </div>
            ))}
          </div>

          {!solved ? (
            <>
              <div className="guess-label">Welk stadion is dit?</div>
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
                    placeholder="Typ de naam van een stadion..."
                    autoComplete="off"
                  />
                  <button type="button" onClick={() => submitGuess()}>Raad</button>
                </div>

                {suggestions.length > 0 && (
                  <div className="suggestions">
                    {suggestions.map((item) => (
                      <button type="button" key={item.name} onClick={() => submitGuess(item.name)}>
                        <span>🏟️</span>
                        <div><strong>{item.name}</strong><small>{item.city}</small></div>
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
                  disabled={hintCount >= stadium.hints.length}
                >
                  💡 Volgende hint
                  {hintCount < stadium.hints.length && (
                    <small>−{possiblePoints - POINTS[Math.min(hintCount, 4)]} pt</small>
                  )}
                </button>
                <button type="button" className="giveup" onClick={giveUp}>Ik geef op</button>
              </div>
            </>
          ) : (
            <div className="solved">
              <div className={feedback.startsWith("✓") ? "feedback correct" : "feedback neutral"}>
                {feedback}
              </div>
              <div className="answer">
                <span>🏟️</span>
                <div><strong>{stadium.name}</strong><small>{stadium.city}</small></div>
              </div>
              <button type="button" onClick={nextRound}>
                {round === ROUNDS - 1 ? "Bekijk eindscore" : "Volgende stadion"} →
              </button>
            </div>
          )}
        </section>

        <p className="note">💡 Hoe minder hints je nodig hebt, hoe hoger je score.</p>
      </>
    ) : (
      <section className="result">
        <div className="result-icon">{percentage >= 75 ? "🏆" : "🏟️"}</div>
        <span className="eyebrow">GAME VOLTOOID</span>
        <h1>{percentage >= 75 ? "Stadionexpert!" : percentage >= 50 ? "Sterke ronde!" : "Nog een rondje?"}</h1>
        <p>Je herkende <strong>{correct} van de {ROUNDS}</strong> stadions.</p>

        <div className="final-score">
          <span>EINDSCORE</span>
          <strong>{score}</strong>
          <small>punten</small>
        </div>

        <div className="result-stats">
          <div><span>Goed</span><strong>{correct}/{ROUNDS}</strong></div>
          <div><span>Percentage</span><strong>{percentage}%</strong></div>
          <div><span>Foute pogingen</span><strong>{wrong}</strong></div>
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
    .stadium-page { position:relative; min-height:calc(100vh - 86px); overflow:hidden; padding:38px 0 80px; background:radial-gradient(circle at 50% 0%,rgba(46,230,129,.09),transparent 31%),#03140d; color:#fff; }
    .shell { position:relative; z-index:2; width:min(900px,calc(100% - 36px)); margin:0 auto; }
    .ambient { position:absolute; border-radius:50%; filter:blur(25px); pointer-events:none; }
    .a1 { width:420px;height:420px;top:-300px;left:calc(50% - 210px);background:rgba(46,230,129,.12); }
    .a2 { width:300px;height:300px;right:-180px;bottom:10%;background:rgba(46,230,129,.05); }
    .topbar { display:flex;align-items:center;justify-content:space-between;margin-bottom:44px; }
    .back { color:#91a99c;text-decoration:none;font-size:12px;font-weight:850;transition:.18s ease; }
    .back:hover { color:#2ee681;transform:translateX(-2px); }
    .brand { display:flex;align-items:center;gap:8px;color:#69efa4;font-size:9px;font-weight:950;letter-spacing:1.5px; }
    .brand span { width:7px;height:7px;border-radius:50%;background:#2ee681;box-shadow:0 0 12px rgba(46,230,129,.8); }
    .hero { display:flex;align-items:flex-end;justify-content:space-between;gap:25px;margin-bottom:25px; }
    .eyebrow { display:inline-block;margin-bottom:11px;color:#59eb9a;font-size:10px;font-weight:950;letter-spacing:1.4px; }
    .hero h1,.result h1 { margin:0;font-size:clamp(35px,5vw,50px);line-height:1.02;letter-spacing:-1.8px;font-weight:950; }
    .hero h1 span { color:#2ee681; }
    .hero p { margin:12px 0 0;color:#839b8e;font-size:13px; }
    .scorebox { min-width:145px;padding:16px 19px;border:1px solid rgba(46,230,129,.16);border-radius:13px;background:rgba(46,230,129,.05);text-align:right; }
    .scorebox span,.scorebox small,.final-score span,.final-score small { display:block;color:#718a7d;font-size:8px;font-weight:900;letter-spacing:1px; }
    .scorebox strong { display:block;color:#2ee681;font-size:27px; }
    .stats { display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:11px; }
    .stats div,.result-stats div { padding:11px 14px;border:1px solid rgba(255,255,255,.055);border-radius:9px;background:rgba(255,255,255,.02); }
    .stats span,.result-stats span { display:block;margin-bottom:3px;color:#6d8578;font-size:8px;font-weight:950;letter-spacing:1px; }
    .stats strong { font-size:13px; }
    .progress { height:5px;margin-bottom:20px;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.055); }
    .progress i { display:block;height:100%;border-radius:inherit;background:#2ee681;transition:width .3s ease; }
    .game-card,.result { padding:28px;border:1px solid rgba(255,255,255,.07);border-radius:18px;background:linear-gradient(145deg,rgba(8,34,22,.97),rgba(5,25,16,.97));box-shadow:0 25px 70px rgba(0,0,0,.18); }
    .card-top { display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:18px; }
    .card-top > div:first-child span { display:block;margin-bottom:3px;color:#59e999;font-size:8px;font-weight:950;letter-spacing:1.3px; }
    .card-top strong { font-size:12px; }
    .points { padding:7px 9px;border:1px solid rgba(46,230,129,.15);border-radius:999px;background:rgba(46,230,129,.06);color:#60eca0;font-size:8px;font-weight:950; }
    .stadium-visual { position:relative;height:145px;margin-bottom:17px;overflow:hidden;border:1px solid rgba(46,230,129,.11);border-radius:12px;background:linear-gradient(180deg,#09291b,#061c13); }
    .pitch { position:absolute;left:25%;right:25%;bottom:10px;height:65px;border:1px solid rgba(94,236,158,.26);background:rgba(46,230,129,.06);transform:perspective(180px) rotateX(25deg); }
    .center-line { position:absolute;left:50%;top:0;bottom:0;width:1px;background:rgba(255,255,255,.16); }
    .center-circle { position:absolute;width:28px;height:28px;left:50%;top:50%;border:1px solid rgba(255,255,255,.16);border-radius:50%;transform:translate(-50%,-50%); }
    .stand { position:absolute;top:25px;width:24%;height:88px;padding-top:15px;border:1px solid rgba(46,230,129,.1);background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 7px,rgba(46,230,129,.04) 7px 14px);color:rgba(105,239,164,.18);font-size:8px;font-weight:950;letter-spacing:2px;text-align:center; }
    .stand-left { left:8px;transform:skewY(7deg); }
    .stand-right { right:8px;transform:skewY(-7deg); }
    .roof { position:absolute;top:8px;width:36%;height:2px;background:rgba(46,230,129,.15); }
    .roof-left { left:4%;transform:rotate(-5deg); }
    .roof-right { right:4%;transform:rotate(5deg); }
    .question { position:absolute;left:50%;top:32%;transform:translate(-50%,-50%);color:#2ee681;font-size:40px;font-weight:950;text-shadow:0 0 24px rgba(46,230,129,.35); }
    .hints { display:grid;gap:8px; }
    .hint { min-height:52px;padding:10px 13px;display:flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,.055);border-radius:9px;background:rgba(255,255,255,.022);animation:reveal .25s ease both; }
    .hint > span { flex:0 0 29px;width:29px;height:29px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(46,230,129,.08);color:#55e995;font-size:9px;font-weight:950; }
    .hint p { margin:0;color:#b2c4ba;font-size:11px;line-height:1.45; }
    .guess-label { margin:22px 0 8px;color:#849a8f;font-size:9px;font-weight:800; }
    .search-wrap { position:relative; }
    .search { height:51px;padding:0 8px 0 14px;display:flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,.08);border-radius:10px;background:rgba(255,255,255,.03); }
    .search > span { color:#5ce99b;font-size:20px; }
    .search input { min-width:0;flex:1;border:0;outline:0;background:transparent;color:#fff;font:inherit;font-size:12px; }
    .search input::placeholder { color:#61796c; }
    .search > button,.solved > button { padding:10px 14px;border:0;border-radius:8px;background:#2ee681;color:#032014;cursor:pointer;font-size:9px;font-weight:950; }
    .suggestions { position:absolute;z-index:20;top:calc(100% + 6px);left:0;right:0;overflow:hidden;border:1px solid rgba(46,230,129,.14);border-radius:10px;background:#071f15;box-shadow:0 20px 45px rgba(0,0,0,.35); }
    .suggestions button { width:100%;padding:10px 13px;display:flex;align-items:center;gap:10px;border:0;border-bottom:1px solid rgba(255,255,255,.045);background:transparent;color:#d8e4de;cursor:pointer;text-align:left; }
    .suggestions button:hover { background:rgba(46,230,129,.07); }
    .suggestions button div { display:flex;flex-direction:column;gap:2px; }
    .suggestions strong { font-size:10px; }
    .suggestions small { color:#6f867a;font-size:8px; }
    .feedback { margin-top:10px;padding:11px 12px;border-radius:8px;font-size:10px; }
    .feedback.wrong { border:1px solid rgba(255,91,91,.15);background:rgba(255,91,91,.045);color:#ff9c9c; }
    .feedback.correct { border:1px solid rgba(46,230,129,.16);background:rgba(46,230,129,.055);color:#69eda3; }
    .feedback.neutral { border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);color:#9bb0a5; }
    .actions { margin-top:14px;display:flex;align-items:center;justify-content:space-between;gap:10px; }
    .hint-button,.giveup { padding:10px 12px;border-radius:8px;cursor:pointer;font-size:9px;font-weight:900; }
    .hint-button { border:1px solid rgba(46,230,129,.15);background:rgba(46,230,129,.06);color:#67eca2; }
    .hint-button small { margin-left:7px;color:#81978c;font-size:8px; }
    .hint-button:disabled { opacity:.4;cursor:default; }
    .giveup { border:0;background:transparent;color:#667d71; }
    .solved { margin-top:20px;text-align:center; }
    .answer { margin:18px auto;display:flex;align-items:center;justify-content:center;gap:10px; }
    .answer > span { font-size:27px; }
    .answer div { display:flex;flex-direction:column;text-align:left; }
    .answer strong { font-size:18px; }
    .answer small { color:#72897d;font-size:9px; }
    .note { margin-top:14px;color:#61796d;text-align:center;font-size:9px; }
    .result { max-width:700px;margin:50px auto 0;text-align:center; }
    .result-icon { width:76px;height:76px;margin:0 auto 18px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(46,230,129,.16);border-radius:19px;background:rgba(46,230,129,.07);font-size:34px; }
    .result > p { color:#849b8f;font-size:13px; }
    .final-score { width:185px;margin:24px auto;padding:18px;border-radius:13px;background:rgba(46,230,129,.07); }
    .final-score strong { display:block;color:#2ee681;font-size:40px; }
    .result-stats { display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-bottom:24px; }
    .result-stats strong { font-size:15px; }
    .result-actions { display:flex;justify-content:center;gap:9px;flex-wrap:wrap; }
    .result-actions button,.result-actions a { padding:11px 15px;border-radius:8px;cursor:pointer;text-decoration:none;font-size:10px;font-weight:900; }
    .result-actions button { border:0;background:#2ee681;color:#032014; }
    .result-actions a { border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);color:#9db0a6; }
    .loading { padding-top:100px;color:#8ba095;text-align:center; }
    @keyframes reveal { from { opacity:0;transform:translateY(5px); } to { opacity:1;transform:translateY(0); } }
    @media(max-width:650px) {
      .stadium-page { padding-top:24px; }
      .brand { display:none; }
      .topbar { margin-bottom:33px; }
      .hero { align-items:stretch;flex-direction:column; }
      .scorebox { width:100%;text-align:left; }
      .game-card,.result { padding:20px; }
      .actions { align-items:stretch;flex-direction:column; }
      .giveup { padding:8px; }
    }
    @media(max-width:430px) {
      .stats { gap:5px; }
      .stats div { padding:9px; }
      .stadium-visual { height:125px; }
      .result-stats { grid-template-columns:1fr; }
    }
  `}</style>
</main>

);
}

Sluiten
