"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

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

const monthMap: Record<string,string> = {sep:"SEP",okt:"OKT",nov:"NOV"};

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

export default function NationsLeaguePage() {
  const [league, setLeague] = useState<"A"|"B"|"C"|"D">("A");
  const [selected, setSelected] = useState("A2");
  const [predictions, setPredictions] = useState<Record<string,Prediction>>({});
  const [saved, setSaved] = useState<Record<string,boolean>>({});

  const leagueGroups = useMemo(() => groups.filter(g => g.league === league), [league]);
  const group = groups.find(g => g.id === selected) ?? leagueGroups[0];

  const chooseLeague = (value:"A"|"B"|"C"|"D") => {
    setLeague(value);
    const first = groups.find(g => g.league === value);
    if (first) setSelected(first.id);
  };

  const setScore = (matchId:string, side:"home"|"away", value:string) => {
    const clean = value.replace(/\D/g,"").slice(0,2);
    setPredictions(p => ({
      ...p,
      [matchId]: {...(p[matchId] ?? {home:"",away:""}), [side]:clean}
    }));
    setSaved(s => ({...s,[matchId]:false}));
  };

  const save = (matchId:string) => {
    const p = predictions[matchId];
    if (!p || p.home === "" || p.away === "") return;
    setSaved(s => ({...s,[matchId]:true}));
  };

  return (
    <main className="nl-page">
      <div className="glow g1"/><div className="glow g2"/>
      <div className="shell">
        <div className="top">
          <Link href="/toernooien" className="back">← Toernooien</Link>
          <span className="brand"><i/> VOETIQ TOERNOOIEN</span>
        </div>

        <section className="hero">
          <div className="cup">🏆</div>
          <div>
            <span className="eyebrow">UEFA NATIONS LEAGUE • 2026/27</span>
            <h1>Voorspel de <span>Nations League.</span></h1>
            <p>Kies een league en poule en vul jouw voorspelling voor iedere wedstrijd in.</p>
          </div>
        </section>

        <div className="notice">
          <span>⚡</span>
          <div><strong>League phase: 24 september – 17 november 2026</strong><p>Voorspellingen op deze pagina worden in deze eerste versie lokaal bijgehouden. Supabase-opslag koppelen we hierna.</p></div>
        </div>

        <div className="league-tabs">
          {(["A","B","C","D"] as const).map(l => (
            <button key={l} onClick={() => chooseLeague(l)} className={league===l?"active":""}>
              <span>LEAGUE</span><strong>{l}</strong>
            </button>
          ))}
        </div>

        <section className="group-area">
          <div className="group-tabs">
            {leagueGroups.map(g => (
              <button key={g.id} onClick={() => setSelected(g.id)} className={group.id===g.id?"active":""}>
                Groep {g.id}
              </button>
            ))}
          </div>

          <div className="group-head">
            <div>
              <span className="small-label">LEAGUE {group.league}</span>
              <h2>Groep {group.id}</h2>
            </div>
            <div className="team-pills">
              {group.teams.map(t => <span key={t}>{flags[t]} {t}</span>)}
            </div>
          </div>

          <div className="matches">
            {group.matches.map((m, index) => {
              const p = predictions[m.id] ?? {home:"",away:""};
              const ok = saved[m.id];
              const [day, mon] = m.date.split(" ");
              return (
                <article className="match" key={m.id}>
                  <div className="match-number">#{index+1}</div>
                  <div className="date">
                    <strong>{day}</strong><span>{monthMap[mon] ?? mon.toUpperCase()}</span><small>{m.time}</small>
                  </div>

                  <div className="prediction">
                    <div className="team home">
                      <span>{flags[m.home]}</span><strong>{m.home}</strong>
                    </div>

                    <div className="score">
                      <input aria-label={`${m.home} score`} inputMode="numeric" value={p.home} onChange={e=>setScore(m.id,"home",e.target.value)} placeholder="-" />
                      <b>:</b>
                      <input aria-label={`${m.away} score`} inputMode="numeric" value={p.away} onChange={e=>setScore(m.id,"away",e.target.value)} placeholder="-" />
                    </div>

                    <div className="team away">
                      <strong>{m.away}</strong><span>{flags[m.away]}</span>
                    </div>
                  </div>

                  <button className={ok?"save saved":"save"} onClick={()=>save(m.id)}>
                    {ok ? "✓ Opgeslagen" : "Opslaan"}
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <div className="points-info">
          <div className="pi-icon">🎯</div>
          <div><span>PUNTENSYSTEEM</span><h3>Voorspel zo nauwkeurig mogelijk</h3><p>Het definitieve puntensysteem en automatisch verwerken van uitslagen koppelen we samen met de database.</p></div>
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
        .league-tabs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:12px}.league-tabs button{padding:12px;border:1px solid rgba(255,255,255,.06);border-radius:10px;background:rgba(255,255,255,.02);color:#738a7e;cursor:pointer}.league-tabs button span{display:block;font-size:7px;font-weight:900;letter-spacing:1px}.league-tabs button strong{font-size:18px}.league-tabs button.active{border-color:rgba(46,230,129,.28);background:rgba(46,230,129,.075);color:#54eb98}
        .group-area{padding:23px;border:1px solid rgba(255,255,255,.065);border-radius:17px;background:linear-gradient(145deg,rgba(8,34,22,.97),rgba(5,25,16,.97))}
        .group-tabs{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:24px}.group-tabs button{padding:8px 11px;border:1px solid rgba(255,255,255,.06);border-radius:8px;background:rgba(255,255,255,.025);color:#778e82;cursor:pointer;font-size:9px;font-weight:850}.group-tabs button.active{border-color:rgba(46,230,129,.2);background:#2ee681;color:#032014}
        .group-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;padding-bottom:20px;border-bottom:1px solid rgba(255,255,255,.055)}.group-head h2{margin:0;font-size:25px}.team-pills{display:flex;justify-content:flex-end;flex-wrap:wrap;gap:6px}.team-pills span{padding:6px 8px;border-radius:7px;background:rgba(255,255,255,.03);color:#9cb0a5;font-size:8px;font-weight:800}
        .matches{display:grid;gap:8px;padding-top:14px}.match{min-height:75px;padding:10px 11px;display:grid;grid-template-columns:28px 63px 1fr 100px;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.05);border-radius:10px;background:rgba(255,255,255,.018)}.match-number{color:#526a5d;font-size:8px;font-weight:900}.date{display:flex;flex-direction:column;text-align:center}.date strong{font-size:15px}.date span{color:#4fe994;font-size:7px;font-weight:950;letter-spacing:1px}.date small{margin-top:2px;color:#657d70;font-size:7px}
        .prediction{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:13px}.team{display:flex;align-items:center;gap:7px;min-width:0}.team.home{justify-content:flex-end;text-align:right}.team.away{justify-content:flex-start}.team span{font-size:19px}.team strong{font-size:10px;line-height:1.2}.score{display:flex;align-items:center;gap:5px}.score input{width:38px;height:38px;border:1px solid rgba(46,230,129,.16);border-radius:8px;outline:none;background:#061d13;color:#fff;text-align:center;font-size:15px;font-weight:950}.score input:focus{border-color:#2ee681;box-shadow:0 0 0 2px rgba(46,230,129,.06)}.score b{color:#526a5d}
        .save{padding:9px 10px;border:1px solid rgba(46,230,129,.15);border-radius:8px;background:rgba(46,230,129,.06);color:#55eb99;cursor:pointer;font-size:8px;font-weight:950}.save.saved{background:#2ee681;color:#032014}
        .points-info{margin-top:18px;padding:19px 22px;display:flex;gap:16px;align-items:center;border:1px dashed rgba(255,255,255,.09);border-radius:13px;background:rgba(255,255,255,.015)}.pi-icon{font-size:27px}.points-info span{color:#4be991;font-size:8px;font-weight:950;letter-spacing:1.2px}.points-info h3{margin:3px 0;font-size:14px}.points-info p{margin:0;color:#6e8679;font-size:9px}
        @media(max-width:760px){.brand{display:none}.hero{align-items:flex-start;flex-direction:column}.league-tabs{grid-template-columns:repeat(2,1fr)}.group-head{align-items:flex-start;flex-direction:column}.team-pills{justify-content:flex-start}.match{grid-template-columns:45px 1fr 78px}.match-number{display:none}.prediction{grid-column:2/3}.save{grid-column:3/4}.date{grid-column:1/2;grid-row:1}.team strong{font-size:9px}}
        @media(max-width:520px){.nl-page{padding-top:23px}.shell{width:min(100% - 24px,1100px)}.group-area{padding:15px}.match{grid-template-columns:45px 1fr;padding:12px 8px}.prediction{grid-column:1/-1;grid-row:2}.date{grid-row:1}.save{grid-column:2/3;grid-row:1}.team{flex-direction:column;gap:2px}.team.home{flex-direction:column-reverse;text-align:center}.team.away{text-align:center}.score input{width:36px;height:36px}.team-pills span{font-size:7px}}
      `}</style>
    </main>
  );
}
