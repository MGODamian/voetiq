"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Match = {
  id: string;
  date: string;
  time: string;
  home: string;
  away: string;
};

type Group = {
  id: string;
  league: "A" | "B" | "C" | "D";
  teams: string[];
  matches: Match[];
};

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

const translations = {
  nl:{back:"Toernooien",brand:"VOETIQ TOERNOOIEN",titleBefore:"Voorspel de",hero:"Kies een league en poule en vul jouw voorspelling voor iedere wedstrijd in.",phase:"League phase: 24 september – 17 november 2026",loading:"Je opgeslagen voorspellingen worden geladen...",account:"Je voorspellingen worden gekoppeld aan je VoetIQ-account en blijven na een refresh bewaard.",league:"LEAGUE",group:"Groep",previous:"Vorige",round:"SPEELRONDE",of:"van",next:"Volgende",save:"Opslaan",saving:"Opslaan...",saved:"✓ Opgeslagen",current:"ACTUELE STAND",standing:"Stand Groep",country:"Land",played:"Gespeeld",won:"Gewonnen",drawn:"Gelijk",lost:"Verloren",gf:"Doelpunten voor",ga:"Doelpunten tegen",gd:"Doelsaldo",points:"Punten",winner:"Groepswinnaar",second:"Tweede plaats",note:"De stand wordt later automatisch bijgewerkt met echte uitslagen.",system:"PUNTENSYSTEEM",accurate:"Voorspel zo nauwkeurig mogelijk",systemText:"Het definitieve puntensysteem en automatisch verwerken van uitslagen koppelen we samen met de database.",complete:"Vul eerst een volledige uitslag in.",valid:"Vul een geldige uitslag in van 0 t/m 20.",login:"Je moet ingelogd zijn om een voorspelling op te slaan.",loadError:"Je opgeslagen voorspellingen konden niet worden geladen.",saveError:"Er ging iets mis bij het opslaan van je voorspelling.",saveSuccess:"Je voorspelling is opgeslagen.",goRound:"Ga naar speelronde"},
  en:{back:"Tournaments",brand:"VOETIQ TOURNAMENTS",titleBefore:"Predict the",hero:"Choose a league and group and enter your prediction for every match.",phase:"League phase: 24 September – 17 November 2026",loading:"Your saved predictions are loading...",account:"Your predictions are linked to your VoetIQ account and remain saved after a refresh.",league:"LEAGUE",group:"Group",previous:"Previous",round:"MATCHDAY",of:"of",next:"Next",save:"Save",saving:"Saving...",saved:"✓ Saved",current:"CURRENT STANDINGS",standing:"Group standings",country:"Country",played:"Played",won:"Won",drawn:"Drawn",lost:"Lost",gf:"Goals for",ga:"Goals against",gd:"Goal difference",points:"Points",winner:"Group winner",second:"Second place",note:"The standings will later be updated automatically with real results.",system:"POINTS SYSTEM",accurate:"Predict as accurately as possible",systemText:"The final points system and automatic result processing will be connected to the database.",complete:"Enter a complete score first.",valid:"Enter a valid score from 0 to 20.",login:"You must be logged in to save a prediction.",loadError:"Your saved predictions could not be loaded.",saveError:"Something went wrong while saving your prediction.",saveSuccess:"Your prediction has been saved.",goRound:"Go to matchday"},
  de:{back:"Turniere",brand:"VOETIQ TURNIERE",titleBefore:"Tippe die",hero:"Wähle eine Liga und Gruppe und gib deinen Tipp für jedes Spiel ab.",phase:"Ligaphase: 24. September – 17. November 2026",loading:"Deine gespeicherten Tipps werden geladen...",account:"Deine Tipps sind mit deinem VoetIQ-Konto verknüpft und bleiben nach dem Aktualisieren gespeichert.",league:"LIGA",group:"Gruppe",previous:"Zurück",round:"SPIELTAG",of:"von",next:"Weiter",save:"Speichern",saving:"Speichern...",saved:"✓ Gespeichert",current:"AKTUELLE TABELLE",standing:"Tabelle Gruppe",country:"Land",played:"Gespielt",won:"Gewonnen",drawn:"Unentschieden",lost:"Verloren",gf:"Tore",ga:"Gegentore",gd:"Tordifferenz",points:"Punkte",winner:"Gruppensieger",second:"Zweiter Platz",note:"Die Tabelle wird später automatisch mit echten Ergebnissen aktualisiert.",system:"PUNKTESYSTEM",accurate:"Tippe so genau wie möglich",systemText:"Das endgültige Punktesystem und die automatische Ergebnisverarbeitung werden mit der Datenbank verbunden.",complete:"Gib zuerst ein vollständiges Ergebnis ein.",valid:"Gib ein gültiges Ergebnis von 0 bis 20 ein.",login:"Du musst angemeldet sein, um einen Tipp zu speichern.",loadError:"Deine gespeicherten Tipps konnten nicht geladen werden.",saveError:"Beim Speichern deines Tipps ist etwas schiefgelaufen.",saveSuccess:"Dein Tipp wurde gespeichert.",goRound:"Gehe zu Spieltag"},
  es:{back:"Torneos",brand:"TORNEOS VOETIQ",titleBefore:"Predice la",hero:"Elige una liga y un grupo e introduce tu pronóstico para cada partido.",phase:"Fase de liga: 24 de septiembre – 17 de noviembre de 2026",loading:"Se están cargando tus pronósticos guardados...",account:"Tus pronósticos están vinculados a tu cuenta de VoetIQ y se conservan al actualizar.",league:"LIGA",group:"Grupo",previous:"Anterior",round:"JORNADA",of:"de",next:"Siguiente",save:"Guardar",saving:"Guardando...",saved:"✓ Guardado",current:"CLASIFICACIÓN ACTUAL",standing:"Clasificación Grupo",country:"País",played:"Jugados",won:"Ganados",drawn:"Empatados",lost:"Perdidos",gf:"Goles a favor",ga:"Goles en contra",gd:"Diferencia de goles",points:"Puntos",winner:"Ganador del grupo",second:"Segundo puesto",note:"La clasificación se actualizará más adelante automáticamente con resultados reales.",system:"SISTEMA DE PUNTOS",accurate:"Pronostica con la mayor precisión posible",systemText:"El sistema de puntos definitivo y el procesamiento automático de resultados se conectarán a la base de datos.",complete:"Introduce primero un resultado completo.",valid:"Introduce un resultado válido de 0 a 20.",login:"Debes iniciar sesión para guardar un pronóstico.",loadError:"No se pudieron cargar tus pronósticos guardados.",saveError:"Se produjo un error al guardar tu pronóstico.",saveSuccess:"Tu pronóstico se ha guardado.",goRound:"Ir a la jornada"},
  fr:{back:"Tournois",brand:"TOURNOIS VOETIQ",titleBefore:"Pronostique la",hero:"Choisis une ligue et un groupe et saisis ton pronostic pour chaque match.",phase:"Phase de ligue : 24 septembre – 17 novembre 2026",loading:"Tes pronostics enregistrés sont en cours de chargement...",account:"Tes pronostics sont liés à ton compte VoetIQ et restent enregistrés après actualisation.",league:"LIGUE",group:"Groupe",previous:"Précédent",round:"JOURNÉE",of:"sur",next:"Suivant",save:"Enregistrer",saving:"Enregistrement...",saved:"✓ Enregistré",current:"CLASSEMENT ACTUEL",standing:"Classement Groupe",country:"Pays",played:"Joués",won:"Victoires",drawn:"Nuls",lost:"Défaites",gf:"Buts pour",ga:"Buts contre",gd:"Différence",points:"Points",winner:"Vainqueur du groupe",second:"Deuxième place",note:"Le classement sera ensuite mis à jour automatiquement avec les résultats réels.",system:"SYSTÈME DE POINTS",accurate:"Pronostique le plus précisément possible",systemText:"Le système de points définitif et le traitement automatique des résultats seront reliés à la base de données.",complete:"Saisis d’abord un score complet.",valid:"Saisis un score valide de 0 à 20.",login:"Tu dois être connecté pour enregistrer un pronostic.",loadError:"Tes pronostics enregistrés n’ont pas pu être chargés.",saveError:"Une erreur s’est produite lors de l’enregistrement de ton pronostic.",saveSuccess:"Ton pronostic a été enregistré.",goRound:"Aller à la journée"},
  it:{back:"Tornei",brand:"TORNEI VOETIQ",titleBefore:"Pronostica la",hero:"Scegli una lega e un gruppo e inserisci il tuo pronostico per ogni partita.",phase:"Fase campionato: 24 settembre – 17 novembre 2026",loading:"I tuoi pronostici salvati sono in caricamento...",account:"I tuoi pronostici sono collegati al tuo account VoetIQ e restano salvati dopo l’aggiornamento.",league:"LEGA",group:"Gruppo",previous:"Precedente",round:"GIORNATA",of:"di",next:"Successiva",save:"Salva",saving:"Salvataggio...",saved:"✓ Salvato",current:"CLASSIFICA ATTUALE",standing:"Classifica Gruppo",country:"Paese",played:"Giocate",won:"Vinte",drawn:"Pareggi",lost:"Perse",gf:"Gol fatti",ga:"Gol subiti",gd:"Differenza reti",points:"Punti",winner:"Vincitore del gruppo",second:"Secondo posto",note:"La classifica verrà aggiornata automaticamente con i risultati reali.",system:"SISTEMA PUNTI",accurate:"Pronostica nel modo più preciso possibile",systemText:"Il sistema di punti definitivo e l’elaborazione automatica dei risultati saranno collegati al database.",complete:"Inserisci prima un risultato completo.",valid:"Inserisci un risultato valido da 0 a 20.",login:"Devi accedere per salvare un pronostico.",loadError:"Impossibile caricare i pronostici salvati.",saveError:"Si è verificato un errore durante il salvataggio del pronostico.",saveSuccess:"Il tuo pronostico è stato salvato.",goRound:"Vai alla giornata"},
  pt:{back:"Torneios",brand:"TORNEIOS VOETIQ",titleBefore:"Prevê a",hero:"Escolhe uma liga e um grupo e indica o teu prognóstico para cada jogo.",phase:"Fase de liga: 24 de setembro – 17 de novembro de 2026",loading:"Os teus prognósticos guardados estão a carregar...",account:"Os teus prognósticos estão ligados à tua conta VoetIQ e permanecem guardados após atualizar.",league:"LIGA",group:"Grupo",previous:"Anterior",round:"JORNADA",of:"de",next:"Seguinte",save:"Guardar",saving:"A guardar...",saved:"✓ Guardado",current:"CLASSIFICAÇÃO ATUAL",standing:"Classificação Grupo",country:"País",played:"Jogos",won:"Vitórias",drawn:"Empates",lost:"Derrotas",gf:"Golos marcados",ga:"Golos sofridos",gd:"Diferença de golos",points:"Pontos",winner:"Vencedor do grupo",second:"Segundo lugar",note:"A classificação será atualizada automaticamente mais tarde com resultados reais.",system:"SISTEMA DE PONTOS",accurate:"Prevê com a maior precisão possível",systemText:"O sistema de pontos definitivo e o processamento automático dos resultados serão ligados à base de dados.",complete:"Indica primeiro um resultado completo.",valid:"Indica um resultado válido de 0 a 20.",login:"Tens de iniciar sessão para guardar um prognóstico.",loadError:"Não foi possível carregar os teus prognósticos guardados.",saveError:"Ocorreu um erro ao guardar o teu prognóstico.",saveSuccess:"O teu prognóstico foi guardado.",goRound:"Ir para a jornada"}
} satisfies Record<LanguageCode, Record<string,string>>;

function isLanguageCode(v:string|null): v is LanguageCode {
  return ["nl","en","de","es","fr","it","pt"].includes(v ?? "");
}

const countryNames: Record<string, Record<LanguageCode,string>> = {
"Frankrijk":{nl:"Frankrijk",en:"France",de:"Frankreich",es:"Francia",fr:"France",it:"Francia",pt:"França"},
"Italië":{nl:"Italië",en:"Italy",de:"Italien",es:"Italia",fr:"Italie",it:"Italia",pt:"Itália"},
"België":{nl:"België",en:"Belgium",de:"Belgien",es:"Bélgica",fr:"Belgique",it:"Belgio",pt:"Bélgica"},
"Turkije":{nl:"Turkije",en:"Türkiye",de:"Türkei",es:"Turquía",fr:"Turquie",it:"Turchia",pt:"Turquia"},
"Duitsland":{nl:"Duitsland",en:"Germany",de:"Deutschland",es:"Alemania",fr:"Allemagne",it:"Germania",pt:"Alemanha"},
"Nederland":{nl:"Nederland",en:"Netherlands",de:"Niederlande",es:"Países Bajos",fr:"Pays-Bas",it:"Paesi Bassi",pt:"Países Baixos"},
"Servië":{nl:"Servië",en:"Serbia",de:"Serbien",es:"Serbia",fr:"Serbie",it:"Serbia",pt:"Sérvia"},
"Griekenland":{nl:"Griekenland",en:"Greece",de:"Griechenland",es:"Grecia",fr:"Grèce",it:"Grecia",pt:"Grécia"},
"Spanje":{nl:"Spanje",en:"Spain",de:"Spanien",es:"España",fr:"Espagne",it:"Spagna",pt:"Espanha"},
"Kroatië":{nl:"Kroatië",en:"Croatia",de:"Kroatien",es:"Croacia",fr:"Croatie",it:"Croazia",pt:"Croácia"},
"Engeland":{nl:"Engeland",en:"England",de:"England",es:"Inglaterra",fr:"Angleterre",it:"Inghilterra",pt:"Inglaterra"},
"Tsjechië":{nl:"Tsjechië",en:"Czechia",de:"Tschechien",es:"Chequia",fr:"Tchéquie",it:"Cechia",pt:"Chéquia"},
"Portugal":{nl:"Portugal",en:"Portugal",de:"Portugal",es:"Portugal",fr:"Portugal",it:"Portogallo",pt:"Portugal"},
"Denemarken":{nl:"Denemarken",en:"Denmark",de:"Dänemark",es:"Dinamarca",fr:"Danemark",it:"Danimarca",pt:"Dinamarca"},
"Noorwegen":{nl:"Noorwegen",en:"Norway",de:"Norwegen",es:"Noruega",fr:"Norvège",it:"Norvegia",pt:"Noruega"},
"Wales":{nl:"Wales",en:"Wales",de:"Wales",es:"Gales",fr:"Pays de Galles",it:"Galles",pt:"País de Gales"},
"Schotland":{nl:"Schotland",en:"Scotland",de:"Schottland",es:"Escocia",fr:"Écosse",it:"Scozia",pt:"Escócia"},
"Zwitserland":{nl:"Zwitserland",en:"Switzerland",de:"Schweiz",es:"Suiza",fr:"Suisse",it:"Svizzera",pt:"Suíça"},
"Slovenië":{nl:"Slovenië",en:"Slovenia",de:"Slowenien",es:"Eslovenia",fr:"Slovénie",it:"Slovenia",pt:"Eslovénia"},
"Noord-Macedonië":{nl:"Noord-Macedonië",en:"North Macedonia",de:"Nordmazedonien",es:"Macedonia del Norte",fr:"Macédoine du Nord",it:"Macedonia del Nord",pt:"Macedónia do Norte"},
"Hongarije":{nl:"Hongarije",en:"Hungary",de:"Ungarn",es:"Hungría",fr:"Hongrie",it:"Ungheria",pt:"Hungria"},
"Oekraïne":{nl:"Oekraïne",en:"Ukraine",de:"Ukraine",es:"Ucrania",fr:"Ukraine",it:"Ucraina",pt:"Ucrânia"},
"Georgië":{nl:"Georgië",en:"Georgia",de:"Georgien",es:"Georgia",fr:"Géorgie",it:"Georgia",pt:"Geórgia"},
"Noord-Ierland":{nl:"Noord-Ierland",en:"Northern Ireland",de:"Nordirland",es:"Irlanda del Norte",fr:"Irlande du Nord",it:"Irlanda del Nord",pt:"Irlanda do Norte"},
"Israël":{nl:"Israël",en:"Israel",de:"Israel",es:"Israel",fr:"Israël",it:"Israele",pt:"Israel"},
"Oostenrijk":{nl:"Oostenrijk",en:"Austria",de:"Österreich",es:"Austria",fr:"Autriche",it:"Austria",pt:"Áustria"},
"Ierland":{nl:"Ierland",en:"Ireland",de:"Irland",es:"Irlanda",fr:"Irlande",it:"Irlanda",pt:"Irlanda"},
"Kosovo":{nl:"Kosovo",en:"Kosovo",de:"Kosovo",es:"Kosovo",fr:"Kosovo",it:"Kosovo",pt:"Kosovo"},
"Polen":{nl:"Polen",en:"Poland",de:"Polen",es:"Polonia",fr:"Pologne",it:"Polonia",pt:"Polónia"},
"Bosnië en Herzegovina":{nl:"Bosnië en Herzegovina",en:"Bosnia and Herzegovina",de:"Bosnien und Herzegowina",es:"Bosnia y Herzegovina",fr:"Bosnie-Herzégovine",it:"Bosnia ed Erzegovina",pt:"Bósnia e Herzegovina"},
"Roemenië":{nl:"Roemenië",en:"Romania",de:"Rumänien",es:"Rumanía",fr:"Roumanie",it:"Romania",pt:"Roménia"},
"Zweden":{nl:"Zweden",en:"Sweden",de:"Schweden",es:"Suecia",fr:"Suède",it:"Svezia",pt:"Suécia"},
"Albanië":{nl:"Albanië",en:"Albania",de:"Albanien",es:"Albania",fr:"Albanie",it:"Albania",pt:"Albânia"},
"Finland":{nl:"Finland",en:"Finland",de:"Finnland",es:"Finlandia",fr:"Finlande",it:"Finlandia",pt:"Finlândia"},
"Belarus":{nl:"Belarus",en:"Belarus",de:"Belarus",es:"Bielorrusia",fr:"Biélorussie",it:"Bielorussia",pt:"Bielorrússia"},
"San Marino":{nl:"San Marino",en:"San Marino",de:"San Marino",es:"San Marino",fr:"Saint-Marin",it:"San Marino",pt:"São Marinho"},
"Montenegro":{nl:"Montenegro",en:"Montenegro",de:"Montenegro",es:"Montenegro",fr:"Monténégro",it:"Montenegro",pt:"Montenegro"},
"Armenië":{nl:"Armenië",en:"Armenia",de:"Armenien",es:"Armenia",fr:"Arménie",it:"Armenia",pt:"Arménia"},
"Cyprus":{nl:"Cyprus",en:"Cyprus",de:"Zypern",es:"Chipre",fr:"Chypre",it:"Cipro",pt:"Chipre"},
"Letland":{nl:"Letland",en:"Latvia",de:"Lettland",es:"Letonia",fr:"Lettonie",it:"Lettonia",pt:"Letónia"},
"Kazachstan":{nl:"Kazachstan",en:"Kazakhstan",de:"Kasachstan",es:"Kazajistán",fr:"Kazakhstan",it:"Kazakistan",pt:"Cazaquistão"},
"Slowakije":{nl:"Slowakije",en:"Slovakia",de:"Slowakei",es:"Eslovaquia",fr:"Slovaquie",it:"Slovacchia",pt:"Eslováquia"},
"Faeröer":{nl:"Faeröer",en:"Faroe Islands",de:"Färöer",es:"Islas Feroe",fr:"Îles Féroé",it:"Isole Faroe",pt:"Ilhas Faroé"},
"Moldavië":{nl:"Moldavië",en:"Moldova",de:"Moldau",es:"Moldavia",fr:"Moldavie",it:"Moldavia",pt:"Moldávia"},
"IJsland":{nl:"IJsland",en:"Iceland",de:"Island",es:"Islandia",fr:"Islande",it:"Islanda",pt:"Islândia"},
"Bulgarije":{nl:"Bulgarije",en:"Bulgaria",de:"Bulgarien",es:"Bulgaria",fr:"Bulgarie",it:"Bulgaria",pt:"Bulgária"},
"Estland":{nl:"Estland",en:"Estonia",de:"Estland",es:"Estonia",fr:"Estonie",it:"Estonia",pt:"Estónia"},
"Luxemburg":{nl:"Luxemburg",en:"Luxembourg",de:"Luxemburg",es:"Luxemburgo",fr:"Luxembourg",it:"Lussemburgo",pt:"Luxemburgo"},
"Gibraltar":{nl:"Gibraltar",en:"Gibraltar",de:"Gibraltar",es:"Gibraltar",fr:"Gibraltar",it:"Gibilterra",pt:"Gibraltar"},
"Malta":{nl:"Malta",en:"Malta",de:"Malta",es:"Malta",fr:"Malte",it:"Malta",pt:"Malta"},
"Andorra":{nl:"Andorra",en:"Andorra",de:"Andorra",es:"Andorra",fr:"Andorre",it:"Andorra",pt:"Andorra"},
"Litouwen":{nl:"Litouwen",en:"Lithuania",de:"Litauen",es:"Lituania",fr:"Lituanie",it:"Lituania",pt:"Lituânia"},
"Azerbeidzjan":{nl:"Azerbeidzjan",en:"Azerbaijan",de:"Aserbaidschan",es:"Azerbaiyán",fr:"Azerbaïdjan",it:"Azerbaigian",pt:"Azerbaijão"},
"Liechtenstein":{nl:"Liechtenstein",en:"Liechtenstein",de:"Liechtenstein",es:"Liechtenstein",fr:"Liechtenstein",it:"Liechtenstein",pt:"Liechtenstein"}
};

const flags: Record<string, string> = {
  "Frankrijk": "🇫🇷", "Italië": "🇮🇹", "België": "🇧🇪", "Turkije": "🇹🇷",
  "Duitsland": "🇩🇪", "Nederland": "🇳🇱", "Servië": "🇷🇸", "Griekenland": "🇬🇷",
  "Spanje": "🇪🇸", "Kroatië": "🇭🇷", "Engeland": "🏴", "Tsjechië": "🇨🇿",
  "Portugal": "🇵🇹", "Denemarken": "🇩🇰", "Noorwegen": "🇳🇴", "Wales": "🏴",
  "Schotland": "🏴", "Zwitserland": "🇨🇭", "Slovenië": "🇸🇮", "Noord-Macedonië": "🇲🇰",
  "Hongarije": "🇭🇺", "Oekraïne": "🇺🇦", "Georgië": "🇬🇪", "Noord-Ierland": "🇬🇧",
  "Israël": "🇮🇱", "Oostenrijk": "🇦🇹", "Ierland": "🇮🇪", "Kosovo": "🇽🇰",
  "Polen": "🇵🇱", "Bosnië en Herzegovina": "🇧🇦", "Roemenië": "🇷🇴", "Zweden": "🇸🇪",
  "Albanië": "🇦🇱", "Finland": "🇫🇮", "Belarus": "🇧🇾", "San Marino": "🇸🇲",
  "Montenegro": "🇲🇪", "Armenië": "🇦🇲", "Cyprus": "🇨🇾", "Letland": "🇱🇻",
  "Kazachstan": "🇰🇿", "Slowakije": "🇸🇰", "Faeröer": "🇫🇴", "Moldavië": "🇲🇩",
  "IJsland": "🇮🇸", "Bulgarije": "🇧🇬", "Estland": "🇪🇪", "Luxemburg": "🇱🇺",
  "Gibraltar": "🇬🇮", "Malta": "🇲🇹", "Andorra": "🇦🇩",
  "Litouwen": "🇱🇹", "Azerbeidzjan": "🇦🇿", "Liechtenstein": "🇱🇮",
};

const groupInfo: Array<{id:string; league:"A"|"B"|"C"|"D"; teams:string[]}> = [
  {id:"A1",league:"A",teams:["Frankrijk","Italië","België","Turkije"]},
  {id:"A2",league:"A",teams:["Duitsland","Nederland","Servië","Griekenland"]},
  {id:"A3",league:"A",teams:["Spanje","Kroatië","Engeland","Tsjechië"]},
  {id:"A4",league:"A",teams:["Portugal","Denemarken","Noorwegen","Wales"]},
  {id:"B1",league:"B",teams:["Schotland","Zwitserland","Slovenië","Noord-Macedonië"]},
  {id:"B2",league:"B",teams:["Hongarije","Oekraïne","Georgië","Noord-Ierland"]},
  {id:"B3",league:"B",teams:["Israël","Oostenrijk","Ierland","Kosovo"]},
  {id:"B4",league:"B",teams:["Polen","Bosnië en Herzegovina","Roemenië","Zweden"]},
  {id:"C1",league:"C",teams:["Albanië","Finland","Belarus","San Marino"]},
  {id:"C2",league:"C",teams:["Montenegro","Armenië","Cyprus","Letland"]},
  {id:"C3",league:"C",teams:["Kazachstan","Slowakije","Faeröer","Moldavië"]},
  {id:"C4",league:"C",teams:["IJsland","Bulgarije","Estland","Luxemburg"]},
  {id:"D1",league:"D",teams:["Gibraltar","Malta","Andorra"]},
  {id:"D2",league:"D",teams:["Litouwen","Azerbeidzjan","Liechtenstein"]},
];

const raw: Record<string, Array<[string,string,string,string?]>> = {
 A1:[
  ["25 sep","Italië","België"],["25 sep","Turkije","Frankrijk"],
  ["28 sep","België","Frankrijk"],["28 sep","Turkije","Italië"],
  ["2 okt","Frankrijk","Italië"],["2 okt","België","Turkije"],
  ["5 okt","Frankrijk","België"],["5 okt","Italië","Turkije"],
  ["12 nov","Italië","Frankrijk"],["12 nov","Turkije","België","18:00"],
  ["15 nov","België","Italië"],["15 nov","Frankrijk","Turkije"],
 ],
 A2:[
  ["24 sep","Nederland","Duitsland"],["24 sep","Servië","Griekenland"],
  ["27 sep","Servië","Nederland","18:00"],["27 sep","Duitsland","Griekenland"],
  ["1 okt","Griekenland","Nederland"],["1 okt","Duitsland","Servië"],
  ["4 okt","Nederland","Servië"],["4 okt","Griekenland","Duitsland"],
  ["13 nov","Nederland","Griekenland"],["13 nov","Servië","Duitsland"],
  ["16 nov","Duitsland","Nederland"],["16 nov","Griekenland","Servië"],
 ],
 A3:[
  ["26 sep","Tsjechië","Kroatië"],["26 sep","Engeland","Spanje"],
  ["29 sep","Tsjechië","Engeland"],["29 sep","Spanje","Kroatië"],
  ["3 okt","Kroatië","Engeland","18:00"],["3 okt","Spanje","Tsjechië"],
  ["6 okt","Kroatië","Spanje"],["6 okt","Engeland","Tsjechië"],
  ["12 nov","Engeland","Kroatië"],["12 nov","Tsjechië","Spanje"],
  ["15 nov","Kroatië","Tsjechië"],["15 nov","Spanje","Engeland"],
 ],
 A4:[
  ["24 sep","Noorwegen","Denemarken"],["24 sep","Portugal","Wales"],
  ["27 sep","Denemarken","Wales","18:00"],["27 sep","Noorwegen","Portugal"],
  ["1 okt","Denemarken","Portugal"],["1 okt","Wales","Noorwegen"],
  ["4 okt","Wales","Denemarken"],["4 okt","Portugal","Noorwegen"],
  ["14 nov","Portugal","Denemarken"],["14 nov","Noorwegen","Wales","18:00"],
  ["17 nov","Denemarken","Noorwegen"],["17 nov","Wales","Portugal"],
 ],
 B1:[
  ["26 sep","Slovenië","Schotland","15:00"],["26 sep","Noord-Macedonië","Zwitserland"],
  ["29 sep","Schotland","Zwitserland"],["29 sep","Slovenië","Noord-Macedonië"],
  ["3 okt","Noord-Macedonië","Schotland"],["3 okt","Zwitserland","Slovenië"],
  ["6 okt","Schotland","Slovenië"],["6 okt","Zwitserland","Noord-Macedonië"],
  ["13 nov","Schotland","Noord-Macedonië"],["13 nov","Slovenië","Zwitserland"],
  ["16 nov","Zwitserland","Schotland"],["16 nov","Noord-Macedonië","Slovenië"],
 ],
 B2:[
  ["25 sep","Georgië","Noord-Ierland","18:00"],["25 sep","Hongarije","Oekraïne"],
  ["28 sep","Georgië","Oekraïne","18:00"],["28 sep","Noord-Ierland","Hongarije"],
  ["2 okt","Hongarije","Georgië"],["2 okt","Oekraïne","Noord-Ierland"],
  ["5 okt","Noord-Ierland","Georgië"],["5 okt","Oekraïne","Hongarije"],
  ["14 nov","Georgië","Hongarije","18:00"],["14 nov","Noord-Ierland","Oekraïne"],
  ["17 nov","Oekraïne","Georgië"],["17 nov","Hongarije","Noord-Ierland"],
 ],
 B3:[
  ["24 sep","Oostenrijk","Israël"],["24 sep","Kosovo","Ierland"],
  ["27 sep","Oostenrijk","Kosovo","18:00"],["27 sep","Israël","Ierland"],
  ["1 okt","Ierland","Oostenrijk"],["1 okt","Israël","Kosovo"],
  ["4 okt","Kosovo","Oostenrijk","18:00"],["4 okt","Ierland","Israël"],
  ["14 nov","Oostenrijk","Ierland"],["14 nov","Kosovo","Israël","15:00"],
  ["17 nov","Israël","Oostenrijk"],["17 nov","Ierland","Kosovo"],
 ],
 B4:[
  ["25 sep","Polen","Bosnië en Herzegovina"],["25 sep","Zweden","Roemenië"],
  ["28 sep","Roemenië","Bosnië en Herzegovina"],["28 sep","Zweden","Polen"],
  ["2 okt","Bosnië en Herzegovina","Zweden"],["2 okt","Polen","Roemenië"],
  ["5 okt","Bosnië en Herzegovina","Polen"],["5 okt","Roemenië","Zweden"],
  ["14 nov","Zweden","Bosnië en Herzegovina"],["14 nov","Roemenië","Polen"],
  ["17 nov","Bosnië en Herzegovina","Roemenië"],["17 nov","Polen","Zweden"],
 ],
 C1:[
  ["26 sep","Albanië","Belarus"],["26 sep","San Marino","Finland","18:00"],
  ["29 sep","Finland","Belarus","18:00"],["29 sep","San Marino","Albanië"],
  ["3 okt","Finland","Albanië","15:00"],["3 okt","Belarus","San Marino","18:00"],
  ["6 okt","Albanië","San Marino"],["6 okt","Belarus","Finland"],
  ["12 nov","Albanië","Finland"],["12 nov","San Marino","Belarus"],
  ["15 nov","Belarus","Albanië","18:00"],["15 nov","Finland","San Marino","18:00"],
 ],
 C2:[
  ["25 sep","Armenië","Letland","18:00"],["25 sep","Montenegro","Cyprus"],
  ["28 sep","Armenië","Montenegro","18:00"],["28 sep","Letland","Cyprus","18:00"],
  ["2 okt","Cyprus","Armenië","18:00"],["2 okt","Letland","Montenegro","18:00"],
  ["5 okt","Montenegro","Armenië"],["5 okt","Cyprus","Letland","18:00"],
  ["12 nov","Armenië","Cyprus","18:00"],["12 nov","Montenegro","Letland"],
  ["15 nov","Letland","Armenië","15:00"],["15 nov","Cyprus","Montenegro","15:00"],
 ],
 C3:[
  ["26 sep","Faeröer","Kazachstan","18:00"],["26 sep","Slowakije","Moldavië"],
  ["29 sep","Moldavië","Faeröer","18:00"],["29 sep","Slowakije","Kazachstan"],
  ["2 okt","Faeröer","Slowakije"],["2 okt","Kazachstan","Moldavië","16:00"],
  ["6 okt","Kazachstan","Faeröer","16:00"],["6 okt","Moldavië","Slowakije"],
  ["13 nov","Slowakije","Faeröer"],["13 nov","Moldavië","Kazachstan","18:00"],
  ["16 nov","Faeröer","Moldavië","16:00"],["16 nov","Kazachstan","Slowakije","16:00"],
 ],
 C4:[
  ["26 sep","Bulgarije","Luxemburg","18:00"],["26 sep","IJsland","Estland","18:00"],
  ["29 sep","Bulgarije","Estland"],["29 sep","Luxemburg","IJsland"],
  ["3 okt","IJsland","Bulgarije","18:00"],["3 okt","Estland","Luxemburg","18:00"],
  ["6 okt","Luxemburg","Bulgarije"],["6 okt","Estland","IJsland"],
  ["13 nov","Bulgarije","IJsland"],["13 nov","Luxemburg","Estland"],
  ["16 nov","Estland","Bulgarije","18:00"],["16 nov","IJsland","Luxemburg","18:00"],
 ],
 D1:[
  ["24 sep","Andorra","Malta","18:00"],["27 sep","Gibraltar","Andorra","18:00"],
  ["1 okt","Malta","Gibraltar"],["4 okt","Malta","Andorra","18:00"],
  ["13 nov","Andorra","Gibraltar"],["16 nov","Gibraltar","Malta"],
 ],
 D2:[
  ["24 sep","Liechtenstein","Litouwen"],["27 sep","Litouwen","Azerbeidzjan","15:00"],
  ["1 okt","Azerbeidzjan","Liechtenstein","18:00"],["4 okt","Azerbeidzjan","Litouwen","15:00"],
  ["13 nov","Liechtenstein","Azerbeidzjan"],["16 nov","Litouwen","Liechtenstein","18:00"],
 ],
};

const monthLabels: Record<LanguageCode, Record<string,string>> = {
  nl:{sep:"SEP",okt:"OKT",nov:"NOV"}, en:{sep:"SEP",okt:"OCT",nov:"NOV"},
  de:{sep:"SEP",okt:"OKT",nov:"NOV"}, es:{sep:"SEP",okt:"OCT",nov:"NOV"},
  fr:{sep:"SEPT",okt:"OCT",nov:"NOV"}, it:{sep:"SET",okt:"OTT",nov:"NOV"},
  pt:{sep:"SET",okt:"OUT",nov:"NOV"}
};

const groups: Group[] = groupInfo.map((g) => ({
  ...g,
  matches: raw[g.id].map(([date,home,away,time], i) => ({
    id: `${g.id}-${i+1}`,
    date,
    time: time || "20:45",
    home,
    away,
  })),
}));

type Prediction = {home:string; away:string};

type StandingRow = {
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
};

function createEmptyStandings(teams: string[]): StandingRow[] {
  return teams.map((team) => ({
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDifference: 0,
    points: 0,
  }));
}

export default function NationsLeaguePage() {
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const t = translations[language];
  const country = (name:string) => countryNames[name]?.[language] ?? name;

  const [league, setLeague] = useState<"A"|"B"|"C"|"D">("A");
  const [selected, setSelected] = useState("A2");
  const [predictions, setPredictions] = useState<Record<string,Prediction>>({});
  const [saved, setSaved] = useState<Record<string,boolean>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loadingSaved, setLoadingSaved] = useState(true);
  const [selectedRound, setSelectedRound] = useState(0);

  const leagueGroups = useMemo(() => groups.filter(g => g.league === league), [league]);
  const group = groups.find(g => g.id === selected) ?? leagueGroups[0];

  const rounds = useMemo(() => {
    const dates: string[] = [];
    group.matches.forEach((match) => {
      if (!dates.includes(match.date)) dates.push(match.date);
    });

    return dates.map((date, index) => ({
      number: index + 1,
      date,
      matches: group.matches.filter((match) => match.date === date),
    }));
  }, [group]);

  const activeRound = rounds[selectedRound] ?? rounds[0];

  const standings = useMemo(() => {
    // De Nations League is op dit moment nog niet begonnen.
    // Daarom starten alle landen op 0. Deze structuur kan later direct
    // worden gevoed met echte uitslagen zonder de tabel opnieuw te bouwen.
    return createEmptyStandings(group.teams);
  }, [group]);

  useEffect(() => {
    setSelectedRound(0);
  }, [group.id]);

  useEffect(() => {
    const syncLanguage = () => {
      const stored = window.localStorage.getItem("voetiq-language");
      setLanguage(isLanguageCode(stored) ? stored : "nl");
    };
    const handleLanguageChange = (event: Event) => {
      const customEvent = event as CustomEvent<{language?:string}>;
      const next = customEvent.detail?.language ?? null;
      if (isLanguageCode(next)) setLanguage(next);
      else syncLanguage();
    };
    syncLanguage();
    window.addEventListener("voetiq-language-change", handleLanguageChange);
    window.addEventListener("storage", syncLanguage);
    return () => {
      window.removeEventListener("voetiq-language-change", handleLanguageChange);
      window.removeEventListener("storage", syncLanguage);
    };
  }, []);

  useEffect(() => {
    async function loadSavedPredictions() {
      setLoadingSaved(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoadingSaved(false);
        return;
      }

      const { data, error } = await supabase
        .from("tournament_predictions")
        .select("match_id, home_score, away_score")
        .eq("user_id", user.id)
        .eq("tournament", "nations-league-2026-27");

      if (error) {
        console.error("Kon toernooivoorspellingen niet laden:", error);
        setMessage(t.loadError);
        setLoadingSaved(false);
        return;
      }

      const predictionMap: Record<string, Prediction> = {};
      const savedMap: Record<string, boolean> = {};

      (data || []).forEach((row) => {
        predictionMap[row.match_id] = {
          home: String(row.home_score),
          away: String(row.away_score),
        };
        savedMap[row.match_id] = true;
      });

      setPredictions(predictionMap);
      setSaved(savedMap);
      setLoadingSaved(false);
    }

    loadSavedPredictions();
  }, []);

  const chooseLeague = (value:"A"|"B"|"C"|"D") => {
    setLeague(value);
    setSelectedRound(0);
    const first = groups.find(g => g.league === value);
    if (first) setSelected(first.id);
  };

  const chooseGroup = (groupId: string) => {
    setSelected(groupId);
    setSelectedRound(0);
    setMessage("");
  };

  const setScore = (matchId:string, side:"home"|"away", value:string) => {
    const clean = value.replace(/\D/g,"").slice(0,2);
    setPredictions(p => ({
      ...p,
      [matchId]: {...(p[matchId] ?? {home:"",away:""}), [side]:clean}
    }));
    setSaved(s => ({...s,[matchId]:false}));
  };

  const save = async (match: Match) => {
    if (saving) return;

    const p = predictions[match.id];

    if (!p || p.home === "" || p.away === "") {
      setMessage(t.complete);
      return;
    }

    const homeScore = Number(p.home);
    const awayScore = Number(p.away);

    if (
      !Number.isInteger(homeScore) ||
      !Number.isInteger(awayScore) ||
      homeScore < 0 ||
      awayScore < 0 ||
      homeScore > 20 ||
      awayScore > 20
    ) {
      setMessage(t.valid);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(t.login);
      return;
    }

    setSaving(match.id);
    setMessage("");

    const { error } = await supabase
      .from("tournament_predictions")
      .upsert(
        {
          user_id: user.id,
          tournament: "nations-league-2026-27",
          group_id: group.id,
          match_id: match.id,
          home_team: match.home,
          away_team: match.away,
          home_score: homeScore,
          away_score: awayScore,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,tournament,match_id",
        }
      );

    if (error) {
      console.error("Kon voorspelling niet opslaan:", error);
      setMessage(t.saveError);
      setSaving(null);
      return;
    }

    setSaved(s => ({ ...s, [match.id]: true }));
    setMessage(t.saveSuccess);
    setSaving(null);
  };

  return (
    <main className="nl-page">
      <div className="glow g1"/><div className="glow g2"/>
      <div className="shell">
        <div className="top">
          <Link href="/toernooien" className="back">← {t.back}</Link>
          <span className="brand"><i/> VOETIQ TOERNOOIEN</span>
        </div>

        <section className="hero">
          <div className="cup">🏆</div>
          <div>
            <span className="eyebrow">UEFA NATIONS LEAGUE • 2026/27</span>
            <h1>{t.titleBefore} <span>Nations League.</span></h1>
            <p>Kies een league en poule en vul jouw voorspelling voor iedere wedstrijd in.</p>
          </div>
        </section>

        <div className="notice">
          <span>⚡</span>
          <div>
            <strong>League phase: 24 september – 17 november 2026</strong>
            <p>
              {loadingSaved
                ? t.loading
                : t.account}
            </p>
          </div>
        </div>

        {message && <div className="message">{message}</div>}

        <div className="league-tabs">
          {(["A","B","C","D"] as const).map(l => (
            <button key={l} onClick={() => chooseLeague(l)} className={league===l?"active":""}>
              <span>{t.league}</span><strong>{l}</strong>
            </button>
          ))}
        </div>

        <section className="group-area">
          <div className="group-tabs">
            {leagueGroups.map(g => (
              <button key={g.id} onClick={() => chooseGroup(g.id)} className={group.id===g.id?"active":""}>
                {t.group} {g.id}
              </button>
            ))}
          </div>

          <div className="group-head">
            <div>
              <span className="small-label">{t.league} {group.league}</span>
              <h2>{t.group} {group.id}</h2>
            </div>
            <div className="team-pills">
              {group.teams.map(team => <span key={team}>{flags[team]} {country(team)}</span>)}
            </div>
          </div>

          {activeRound && (
            <div className="round-navigation">
              <button
                type="button"
                onClick={() => setSelectedRound((current) => Math.max(0, current - 1))}
                disabled={selectedRound === 0}
              >
                ← {t.previous}
              </button>

              <div className="round-title">
                <span>{t.round}</span>
                <strong>{activeRound.number} {t.of} {rounds.length}</strong>
                <small>{activeRound.date}</small>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRound((current) =>
                    Math.min(rounds.length - 1, current + 1)
                  )
                }
                disabled={selectedRound === rounds.length - 1}
              >
                {t.next} →
              </button>
            </div>
          )}

          <div className="round-dots">
            {rounds.map((round, index) => (
              <button
                type="button"
                key={`${group.id}-round-${round.number}`}
                className={selectedRound === index ? "active" : ""}
                onClick={() => setSelectedRound(index)}
                aria-label={`${t.goRound} ${round.number}`}
              >
                {round.number}
              </button>
            ))}
          </div>

          <div className="matches">
            {(activeRound?.matches ?? []).map((m, index) => {
              const p = predictions[m.id] ?? {home:"",away:""};
              const ok = saved[m.id];
              const [day, mon] = m.date.split(" ");
              return (
                <article className="match" key={m.id}>
                  <div className="match-number">#{index+1}</div>
                  <div className="date">
                    <strong>{day}</strong><span>{monthLabels[language][mon] ?? mon.toUpperCase()}</span><small>{m.time}</small>
                  </div>

                  <div className="prediction">
                    <div className="team home">
                      <span>{flags[m.home]}</span><strong>{country(m.home)}</strong>
                    </div>

                    <div className="score">
                      <input aria-label={`${country(m.home)} score`} inputMode="numeric" value={p.home} onChange={e=>setScore(m.id,"home",e.target.value)} placeholder="-" />
                      <b>:</b>
                      <input aria-label={`${country(m.away)} score`} inputMode="numeric" value={p.away} onChange={e=>setScore(m.id,"away",e.target.value)} placeholder="-" />
                    </div>

                    <div className="team away">
                      <strong>{country(m.away)}</strong><span>{flags[m.away]}</span>
                    </div>
                  </div>

                  <button
                    className={ok ? "save saved" : "save"}
                    onClick={() => save(m)}
                    disabled={saving === m.id}
                  >
                    {saving === m.id
                      ? t.saving
                      : ok
                        ? t.saved
                        : t.save}
                  </button>
                </article>
              );
            })}
          </div>

          <section className="standings-card">
            <div className="standings-heading">
              <div>
                <span className="small-label">{t.current}</span>
                <h3>{t.standing} {group.id}</h3>
              </div>
              <span className="standings-league">{t.league} {group.league}</span>
            </div>

            <div className="standings-scroll">
              <table className="standings-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t.country}</th>
                    <th title={t.played}>GS</th>
                    <th title={t.won}>W</th>
                    <th title={t.drawn}>G</th>
                    <th title={t.lost}>V</th>
                    <th title={t.gf}>DV</th>
                    <th title={t.ga}>DT</th>
                    <th title={t.gd}>DS</th>
                    <th title={t.points}>P</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((row, index) => (
                    <tr key={row.team}>
                      <td className="position">
                        <span className={index === 0 ? "position-mark first" : index === 1 ? "position-mark second" : "position-mark"}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="standing-team">
                        <span>{flags[row.team]}</span>
                        <strong>{country(row.team)}</strong>
                      </td>
                      <td>{row.played}</td>
                      <td>{row.won}</td>
                      <td>{row.drawn}</td>
                      <td>{row.lost}</td>
                      <td>{row.goalsFor}</td>
                      <td>{row.goalsAgainst}</td>
                      <td>{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                      <td className="standing-points">{row.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="standings-legend">
              <span><i className="legend-dot first"/> {t.winner}</span>
              <span><i className="legend-dot second"/> {t.second}</span>
              <span className="standings-note">{t.note}</span>
            </div>
          </section>
        </section>

        <div className="points-info">
          <div className="pi-icon">🎯</div>
          <div><span>{t.system}</span><h3>{t.accurate}</h3><p>{t.systemText}</p></div>
        </div>
      </div>

      <style jsx global>{`
        *{box-sizing:border-box}
        .nl-page{position:relative;min-height:calc(100vh - 86px);overflow:hidden;padding:34px 0 90px;background:radial-gradient(circle at 50% 0%,rgba(46,230,129,.09),transparent 31%),#03140d;color:#fff}
        .shell{position:relative;z-index:2;width:min(1100px,calc(100% - 40px));margin:auto}
        .glow{position:absolute;border-radius:50%;filter:blur(30px);pointer-events:none}.g1{width:420px;height:420px;top:-300px;left:calc(50% - 210px);background:rgba(46,230,129,.12)}.g2{width:300px;height:300px;right:-190px;top:600px;background:rgba(46,230,129,.05)}
        .top{display:flex;justify-content:space-between;align-items:center;margin-bottom:42px}.back{color:#8ba095;text-decoration:none;font-size:11px;font-weight:850}.brand{display:flex;align-items:center;gap:8px;color:#63eda0;font-size:9px;font-weight:950;letter-spacing:1.4px}.brand i{width:7px;height:7px;border-radius:50%;background:#2ee681;box-shadow:0 0 12px #2ee681}
        .hero{display:flex;align-items:center;gap:22px;margin-bottom:26px}.cup{width:82px;height:82px;flex:0 0 82px;display:flex;align-items:center;justify-content:center;border:1px solid rgba(46,230,129,.17);border-radius:20px;background:rgba(46,230,129,.07);font-size:38px}.eyebrow,.small-label{display:block;margin-bottom:7px;color:#56ea98;font-size:9px;font-weight:950;letter-spacing:1.4px}.hero h1{margin:0;font-size:clamp(34px,5vw,50px);letter-spacing:-1.7px;line-height:1.04}.hero h1 span{color:#2ee681}.hero p{margin:10px 0 0;color:#81998c;font-size:12px}
        .notice{margin-bottom:20px;padding:14px 17px;display:flex;gap:12px;align-items:flex-start;border:1px solid rgba(46,230,129,.12);border-radius:11px;background:rgba(46,230,129,.035)}.notice>span{font-size:18px}.notice strong{font-size:10px}.notice p{margin:3px 0 0;color:#70887b;font-size:9px}
        .message{margin:-8px 0 20px;padding:11px 14px;border:1px solid rgba(46,230,129,.14);border-radius:9px;background:rgba(46,230,129,.045);color:#9fb4a9;font-size:10px;font-weight:750}
        .league-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}.league-tabs button{padding:12px;border:1px solid rgba(255,255,255,.06);border-radius:10px;background:rgba(255,255,255,.02);color:#738a7e;cursor:pointer}.league-tabs button span{display:block;font-size:7px;font-weight:900;letter-spacing:1px}.league-tabs button strong{font-size:18px}.league-tabs button.active{border-color:rgba(46,230,129,.28);background:rgba(46,230,129,.075);color:#54eb98}
        .group-area{padding:23px;border:1px solid rgba(255,255,255,.065);border-radius:17px;background:linear-gradient(145deg,rgba(8,34,22,.97),rgba(5,25,16,.97))}
        .group-tabs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:24px}.group-tabs button{padding:8px 11px;border:1px solid rgba(255,255,255,.06);border-radius:8px;background:rgba(255,255,255,.025);color:#778e82;cursor:pointer;font-size:9px;font-weight:850}.group-tabs button.active{border-color:rgba(46,230,129,.2);background:#2ee681;color:#032014}
        .group-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.055)}.group-head h2{margin:0;font-size:25px}.team-pills{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:6px}.team-pills span{padding:6px 8px;border-radius:7px;background:rgba(255,255,255,.03);color:#9cb0a5;font-size:8px;font-weight:800}
        .round-navigation{margin-top:18px;padding:10px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px;border:1px solid rgba(46,230,129,.10);border-radius:12px;background:rgba(46,230,129,.025)}.round-navigation>button{width:fit-content;padding:9px 12px;border:1px solid rgba(46,230,129,.13);border-radius:8px;background:rgba(46,230,129,.05);color:#67eea2;font-size:9px;font-weight:900;cursor:pointer}.round-navigation>button:last-child{justify-self:end}.round-navigation>button:disabled{opacity:.28;cursor:default}.round-title{text-align:center}.round-title span{display:block;color:#5ae99a;font-size:7px;font-weight:950;letter-spacing:1.2px}.round-title strong{display:block;margin-top:2px;font-size:15px}.round-title small{display:block;margin-top:2px;color:#6f887b;font-size:8px;text-transform:uppercase}.round-dots{display:flex;justify-content:center;gap:6px;margin:10px 0 2px}.round-dots button{width:27px;height:27px;padding:0;border:1px solid rgba(255,255,255,.06);border-radius:7px;background:rgba(255,255,255,.025);color:#71877b;font-size:8px;font-weight:900;cursor:pointer}.round-dots button.active{border-color:#2ee681;background:#2ee681;color:#032014}
        .matches{display:grid;gap:8px;padding-top:14px}.match{min-height:75px;padding:10px 11px;display:grid;grid-template-columns:28px 63px 1fr 100px;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.05);border-radius:10px;background:rgba(255,255,255,.018)}.match-number{color:#526a5d;font-size:8px;font-weight:900}.date{display:flex;flex-direction:column;text-align:center}.date strong{font-size:15px}.date span{color:#4fe994;font-size:7px;font-weight:950;letter-spacing:1px}.date small{margin-top:2px;color:#657d70;font-size:7px}
        .prediction{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:13px}.team{display:flex;align-items:center;gap:7px;min-width:0}.team.home{justify-content:flex-end;text-align:right}.team.away{justify-content:flex-start}.team span{font-size:19px}.team strong{font-size:10px;line-height:1.2}.score{display:flex;align-items:center;gap:5px}.score input{width:38px;height:38px;border:1px solid rgba(46,230,129,.16);border-radius:8px;outline:none;background:#061d13;color:#fff;text-align:center;font-size:15px;font-weight:950}.score input:focus{border-color:#2ee681;box-shadow:0 0 0 2px rgba(46,230,129,.06)}.score b{color:#526a5d}
        .save{padding:9px 10px;border:1px solid rgba(46,230,129,.15);border-radius:8px;background:rgba(46,230,129,.06);color:#55eb99;cursor:pointer;font-size:8px;font-weight:950}.save.saved{background:#2ee681;color:#032014}.save:disabled{opacity:.55;cursor:default}
        .standings-card{margin-top:24px;padding:18px;border:1px solid rgba(46,230,129,.10);border-radius:13px;background:rgba(3,20,13,.48)}.standings-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;margin-bottom:13px}.standings-heading .small-label{margin-bottom:4px}.standings-heading h3{margin:0;font-size:17px}.standings-league{padding:6px 8px;border:1px solid rgba(46,230,129,.12);border-radius:7px;background:rgba(46,230,129,.04);color:#66ec9f;font-size:8px;font-weight:900;text-transform:uppercase}.standings-scroll{overflow-x:auto;border:1px solid rgba(255,255,255,.045);border-radius:10px}.standings-table{width:100%;min-width:650px;border-collapse:collapse}.standings-table th{padding:9px 10px;background:rgba(255,255,255,.025);border-bottom:1px solid rgba(255,255,255,.055);color:#60796c;font-size:7px;font-weight:950;letter-spacing:.7px;text-align:center}.standings-table th:nth-child(2){text-align:left}.standings-table td{padding:10px;border-bottom:1px solid rgba(255,255,255,.04);color:#93a99d;font-size:9px;font-weight:800;text-align:center}.standings-table tbody tr:last-child td{border-bottom:0}.position{width:40px}.position-mark{width:22px;height:22px;display:inline-flex;align-items:center;justify-content:center;border-left:2px solid transparent;border-radius:5px;background:rgba(255,255,255,.025);color:#8ba095}.position-mark.first{border-left-color:#2ee681;background:rgba(46,230,129,.07);color:#67eea2}.position-mark.second{border-left-color:#4aa8ff;background:rgba(74,168,255,.06);color:#7dbdff}.standing-team{display:flex;align-items:center;gap:8px;text-align:left!important;white-space:nowrap}.standing-team span{font-size:17px}.standing-team strong{color:#dbe7e1;font-size:9px}.standing-points{color:#fff!important;font-size:11px!important;font-weight:950!important}.standings-legend{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-top:10px;color:#6f877a;font-size:7px;font-weight:800}.standings-legend>span{display:flex;align-items:center;gap:5px}.legend-dot{width:7px;height:7px;border-radius:2px;background:#2ee681}.legend-dot.second{background:#4aa8ff}.standings-note{margin-left:auto!important;color:#526b5e!important}
        .points-info{margin-top:18px;padding:19px 22px;display:flex;gap:16px;align-items:center;border:1px dashed rgba(255,255,255,.09);border-radius:13px;background:rgba(255,255,255,.015)}.pi-icon{font-size:27px}.points-info span{color:#4be991;font-size:8px;font-weight:950;letter-spacing:1.2px}.points-info h3{margin:3px 0;font-size:14px}.points-info p{margin:0;color:#6e8679;font-size:9px}
        @media(max-width:760px){.brand{display:none}.hero{align-items:flex-start;flex-direction:column}.league-tabs{grid-template-columns:repeat(2,1fr)}.group-head{align-items:flex-start;flex-direction:column}.team-pills{justify-content:flex-start}.match{grid-template-columns:45px 1fr 78px}.match-number{display:none}.prediction{grid-column:2/3}.save{grid-column:3/4}.date{grid-column:1/2;grid-row:1}.team strong{font-size:9px}}
        @media(max-width:520px){.standings-card{padding:13px}.standings-heading{align-items:flex-start}.standings-note{width:100%;margin-left:0!important}.round-navigation{grid-template-columns:1fr 1fr}.round-title{grid-column:1/-1;grid-row:1}.round-navigation>button{grid-row:2}.round-navigation>button:last-child{justify-self:end}.nl-page{padding-top:23px}.shell{width:min(100% - 24px,1100px)}.group-area{padding:15px}.match{grid-template-columns:45px 1fr;padding:12px 8px}.prediction{grid-column:1/-1;grid-row:2}.date{grid-row:1}.save{grid-column:2/3;grid-row:1}.team{flex-direction:column;gap:2px}.team.home{flex-direction:column-reverse;text-align:center}.team.away{text-align:center}.score input{width:36px;height:36px}.team-pills span{font-size:7px}}
      `}</style>
    </main>
  );
}
