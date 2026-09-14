export default function Home() {
  return (
    <main className="min-h-screen bg-green-700 text-white">
      <header className="border-b border-green-500 bg-green-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <h1 className="text-3xl font-bold">
            ⚽ VoetIQ
          </h1>

          <nav className="flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-green-200">
              Home
            </a>
            <a href="#wedstrijden" className="hover:text-green-200">
              Wedstrijden
            </a>
            <a href="#ranglijst" className="hover:text-green-200">
              Ranglijst
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-200">
          Voetbal voorspellen
        </p>

        <h2 className="text-5xl font-extrabold tracking-tight">
          Voorspel. Scoor. Win.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-green-100">
          Voorspel voetbalwedstrijden, verdien punten en klim naar de
          top van de VoetIQ-ranglijst.
        </p>
      </section>

      <section
        id="wedstrijden"
        className="mx-auto max-w-6xl px-6 pb-16"
      >
        <h3 className="mb-6 text-2xl font-bold">
          🔮 Wedstrijden voorspellen
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 text-gray-900 shadow-lg">
            <p className="mb-4 text-sm text-gray-500">
              Eredivisie
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">Ajax</span>
              <span className="text-gray-400">vs</span>
              <span className="text-xl font-bold">PSV</span>
            </div>

            <p className="mt-3 text-center text-sm text-gray-500">
              Voorspel de uitslag
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <input
                type="number"
                min="0"
                max="20"
                placeholder="0"
                className="w-20 rounded-lg border p-3 text-center text-xl"
              />

              <span className="text-xl font-bold">-</span>

              <input
                type="number"
                min="0"
                max="20"
                placeholder="0"
                className="w-20 rounded-lg border p-3 text-center text-xl"
              />
            </div>

            <button className="mt-5 w-full rounded-lg bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800">
              Voorspelling opslaan
            </button>
          </div>

          <div className="rounded-2xl bg-white p-6 text-gray-900 shadow-lg">
            <p className="mb-4 text-sm text-gray-500">
              Eredivisie
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xl font-bold">Feyenoord</span>
              <span className="text-gray-400">vs</span>
              <span className="text-xl font-bold">AZ</span>
            </div>

            <p className="mt-3 text-center text-sm text-gray-500">
              Voorspel de uitslag
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <input
                type="number"
                min="0"
                max="20"
                placeholder="0"
                className="w-20 rounded-lg border p-3 text-center text-xl"
              />

              <span className="text-xl font-bold">-</span>

              <input
                type="number"
                min="0"
                max="20"
                placeholder="0"
                className="w-20 rounded-lg border p-3 text-center text-xl"
              />
            </div>

            <button className="mt-5 w-full rounded-lg bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800">
              Voorspelling opslaan
            </button>
          </div>
        </div>
      </section>

      <section
        id="ranglijst"
        className="mx-auto max-w-6xl px-6 pb-20"
      >
        <div className="rounded-2xl bg-green-800 p-8">
          <h3 className="mb-6 text-2xl font-bold">
            🏆 VoetIQ Ranglijst
          </h3>

          <div className="space-y-3">
            <div className="flex justify-between rounded-lg bg-green-700 p-4">
              <span>🥇 Speler 1</span>
              <span className="font-bold">120 punten</span>
            </div>

            <div className="flex justify-between rounded-lg bg-green-700 p-4">
              <span>🥈 Speler 2</span>
              <span className="font-bold">110 punten</span>
            </div>

            <div className="flex justify-between rounded-lg bg-green-700 p-4">
              <span>🥉 Speler 3</span>
              <span className="font-bold">95 punten</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-green-500 bg-green-800 py-8 text-center text-sm text-green-200">
        © 2026 VoetIQ — Voorspel de voetbalwereld.
      </footer>
    </main>
  );
}
