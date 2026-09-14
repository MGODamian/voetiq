"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [predictions, setPredictions] = useState({
    ajaxHome: "",
    ajaxAway: "",
    feyenoordHome: "",
    feyenoordAway: "",
  });

  const [message, setMessage] = useState("");

  const savePrediction = async (
    matchName: string,
    homeScore: string,
    awayScore: string
  ) => {
    const home = Number(homeScore);
    const away = Number(awayScore);

    if (
      homeScore === "" ||
      awayScore === "" ||
      !Number.isInteger(home) ||
      !Number.isInteger(away) ||
      home < 0 ||
      away < 0 ||
      home > 20 ||
      away > 20
    ) {
      setMessage("Vul een geldige uitslag in (0 t/m 20).");
      return;
    }

    const { error } = await supabase.from("predictions").insert({
      match_name: matchName,
      home_score: home,
      away_score: away,
    });

    if (error) {
      console.error(error);
      setMessage(`Fout: ${error.message}`);
      return;
    }

    setMessage(`Voorspelling voor ${matchName} opgeslagen!`);
  };

  return (
    <main className="min-h-screen bg-green-950 text-white">
      <header className="border-b border-green-800 bg-green-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold">VoetIQ</h1>

          <nav className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-green-300">
              Home
            </a>
            <a href="#wedstrijden" className="hover:text-green-300">
              Wedstrijden
            </a>
            <a href="#ranglijst" className="hover:text-green-300">
              Ranglijst
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-green-300">
          Voetbal Voorspellen
        </p>

        <h2 className="text-5xl font-black tracking-tight sm:text-6xl">
          Voorspel. Scoor. Win.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-green-100">
          Voorspel voetbalwedstrijden, verdien punten en klim naar de top van
          de VoetIQ-ranglijst.
        </p>
      </section>

      <section
        id="wedstrijden"
        className="mx-auto grid max-w-6xl gap-6 px-6 pb-16 md:grid-cols-2"
      >
        <div className="rounded-2xl border border-green-800 bg-green-900 p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <span className="rounded-full bg-green-700 px-3 py-1 text-xs font-semibold">
              Eredivisie
            </span>
            <span className="text-sm text-green-300">Vandaag</span>
          </div>

          <h3 className="text-center text-2xl font-bold">Ajax – PSV</h3>

          <div className="mt-8 flex items-center justify-center gap-4">
            <input
              type="number"
              min="0"
              max="20"
              value={predictions.ajaxHome}
              onChange={(e) =>
                setPredictions({
                  ...predictions,
                  ajaxHome: e.target.value,
                })
              }
              className="w-20 rounded-xl bg-white px-4 py-3 text-center text-2xl font-bold text-black"
            />

            <span className="text-2xl font-bold">-</span>

            <input
              type="number"
              min="0"
              max="20"
              value={predictions.ajaxAway}
              onChange={(e) =>
                setPredictions({
                  ...predictions,
                  ajaxAway: e.target.value,
                })
              }
              className="w-20 rounded-xl bg-white px-4 py-3 text-center text-2xl font-bold text-black"
            />
          </div>

          <button
            onClick={() =>
              savePrediction(
                "Ajax - PSV",
                predictions.ajaxHome,
                predictions.ajaxAway
              )
            }
            className="mt-6 w-full rounded-xl bg-green-400 px-5 py-3 font-bold text-green-950 transition hover:bg-green-300"
          >
            Voorspelling opslaan
          </button>
        </div>

        <div className="rounded-2xl border border-green-800 bg-green-900 p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <span className="rounded-full bg-green-700 px-3 py-1 text-xs font-semibold">
              Eredivisie
            </span>
            <span className="text-sm text-green-300">Morgen</span>
          </div>

          <h3 className="text-center text-2xl font-bold">Feyenoord – AZ</h3>

          <div className="mt-8 flex items-center justify-center gap-4">
            <input
              type="number"
              min="0"
              max="20"
              value={predictions.feyenoordHome}
              onChange={(e) =>
                setPredictions({
                  ...predictions,
                  feyenoordHome: e.target.value,
                })
              }
              className="w-20 rounded-xl bg-white px-4 py-3 text-center text-2xl font-bold text-black"
            />

            <span className="text-2xl font-bold">-</span>

            <input
              type="number"
              min="0"
              max="20"
              value={predictions.feyenoordAway}
              onChange={(e) =>
                setPredictions({
                  ...predictions,
                  feyenoordAway: e.target.value,
                })
              }
              className="w-20 rounded-xl bg-white px-4 py-3 text-center text-2xl font-bold text-black"
            />
          </div>

          <button
            onClick={() =>
              savePrediction(
                "Feyenoord - AZ",
                predictions.feyenoordHome,
                predictions.feyenoordAway
              )
            }
            className="mt-6 w-full rounded-xl bg-green-400 px-5 py-3 font-bold text-green-950 transition hover:bg-green-300"
          >
            Voorspelling opslaan
          </button>
        </div>
      </section>

      {message && (
        <div className="mx-auto mb-12 max-w-2xl px-6">
          <div className="rounded-xl border border-green-700 bg-green-900 p-4 text-center font-semibold">
            {message}
          </div>
        </div>
      )}

      <section id="ranglijst" className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="mb-6 text-center text-3xl font-bold">Ranglijst</h2>

        <div className="overflow-hidden rounded-2xl border border-green-800 bg-green-900">
          <div className="grid grid-cols-3 border-b border-green-800 px-6 py-4 font-semibold text-green-300">
            <span>#</span>
            <span>Speler</span>
            <span className="text-right">Punten</span>
          </div>

          <div className="grid grid-cols-3 px-6 py-4">
            <span>1</span>
            <span>AjaxFan</span>
            <span className="text-right font-bold">1240</span>
          </div>

          <div className="grid grid-cols-3 border-t border-green-800 px-6 py-4">
            <span>2</span>
            <span>VoetbalPro</span>
            <span className="text-right font-bold">1185</span>
          </div>

          <div className="grid grid-cols-3 border-t border-green-800 px-6 py-4">
            <span>3</span>
            <span>Damian</span>
            <span className="text-right font-bold">1100</span>
          </div>
        </div>
      </section>

      <footer className="border-t border-green-800 bg-green-900 py-8 text-center text-sm text-green-300">
        © 2026 VoetIQ — Voorspel de wedstrijd.
      </footer>
    </main>
  );
}
