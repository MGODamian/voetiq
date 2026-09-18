"use client";

import Navbar from "../Navbar";

export default function HoeWerktHetPage() {
  return (
    <>
      <Navbar />

      <main className="page">
        <section className="hero">
          <div className="badge">⚽ ZO WERKT VOETIQ</div>

          <h1>
            Voorspel. Scoor.
            <span> Klim.</span>
          </h1>

          <p>
            Voorspel de uitslagen van voetbalwedstrijden,
            verdien punten en neem het op tegen vrienden en
            andere spelers.
          </p>
        </section>

        <section className="steps">
          <div className="step">
            <div className="number">1</div>
            <div className="icon">⚽</div>
            <h2>Voorspel wedstrijden</h2>
            <p>
              Vul vóór de aftrap jouw voorspelling in.
              Zodra de wedstrijd begint, staat je voorspelling
              vast.
            </p>
          </div>

          <div className="step">
            <div className="number">2</div>
            <div className="icon">🎯</div>
            <h2>Verdien punten</h2>
            <p>
              Hoe dichter je voorspelling bij de echte uitslag
              zit, hoe meer punten je verdient.
            </p>
          </div>

          <div className="step">
            <div className="number">3</div>
            <div className="icon">🏆</div>
            <h2>Klim in het klassement</h2>
            <p>
              Vergelijk je punten met andere spelers en probeer
              bovenaan het klassement te eindigen.
            </p>
          </div>
        </section>

        <section className="scoring">
          <div className="sectionHeader">
            <div>
              <span className="eyebrow">VOETIQ PUNTENSYSTEEM</span>
              <h2>Niet iedere uitslag is evenveel waard.</h2>
            </div>

            <div className="formula">
              10 + (doelpunten × 2)
            </div>
          </div>

          <p className="intro">
            Een exacte uitslag met veel doelpunten is moeilijker
            te voorspellen. Daarom levert zo&apos;n voorspelling
            meer punten op.
          </p>

          <div className="examples">
            <div className="example">
              <span>Echte uitslag</span>
              <strong>0 - 0</strong>
              <b>10 punten</b>
            </div>

            <div className="example">
              <span>Echte uitslag</span>
              <strong>1 - 0</strong>
              <b>12 punten</b>
            </div>

            <div className="example">
              <span>Echte uitslag</span>
              <strong>1 - 1</strong>
              <b>14 punten</b>
            </div>

            <div className="example">
              <span>Echte uitslag</span>
              <strong>2 - 1</strong>
              <b>16 punten</b>
            </div>

            <div className="example highlight">
              <span>Echte uitslag</span>
              <strong>6 - 5</strong>
              <b>32 punten 🔥</b>
            </div>
          </div>
        </section>

        <section className="distance">
          <div className="distanceText">
            <span className="eyebrow">BIJNA GOED?</span>

            <h2>Dan kun je nog steeds punten verdienen.</h2>

            <p>
              Heb je de juiste winnaar of het gelijkspel goed?
              Dan kijken we hoe ver jouw voorspelling van de
              echte uitslag af zit.
            </p>

            <div className="rule">
              <div className="ruleIcon">−2</div>
              <div>
                <strong>2 punten eraf per doelpunt afwijking</strong>
                <p>
                  We tellen de afwijking van beide teams bij
                  elkaar op.
                </p>
              </div>
            </div>

            <div className="rule">
              <div className="ruleIcon">✓</div>
              <div>
                <strong>Minimaal 2 punten</strong>
                <p>
                  Zolang je de juiste winnaar of het juiste
                  gelijkspel hebt voorspeld.
                </p>
              </div>
            </div>

            <div className="rule">
              <div className="ruleIcon">✕</div>
              <div>
                <strong>Verkeerde wedstrijduitkomst = 0</strong>
                <p>
                  Heb je de verkeerde winnaar voorspeld of een
                  gelijkspel gemist? Dan krijg je 0 punten.
                </p>
              </div>
            </div>
          </div>

          <div className="scoreCard">
            <div className="scoreHeader">
              <span>VOORBEELD</span>
              <b>Echte uitslag</b>
            </div>

            <div className="realScore">
              <span>Thuis</span>
              <strong>6</strong>
              <div>–</div>
              <strong>5</strong>
              <span>Uit</span>
            </div>

            <div className="scoreRows">
              <div className="scoreRow exact">
                <span>6 - 5</span>
                <small>Exact</small>
                <b>32 pt</b>
              </div>

              <div className="scoreRow">
                <span>5 - 5</span>
                <small>1 doelpunt afwijking</small>
                <b>30 pt</b>
              </div>

              <div className="scoreRow">
                <span>5 - 4</span>
                <small>2 doelpunten afwijking</small>
                <b>28 pt</b>
              </div>

              <div className="scoreRow">
                <span>4 - 3</span>
                <small>4 doelpunten afwijking</small>
                <b>24 pt</b>
              </div>

              <div className="scoreRow">
                <span>3 - 2</span>
                <small>6 doelpunten afwijking</small>
                <b>20 pt</b>
              </div>

              <div className="scoreRow wrong">
                <span>5 - 6</span>
                <small>Verkeerde winnaar</small>
                <b>0 pt</b>
              </div>
            </div>
          </div>
        </section>

        <section className="drawExample">
          <div>
            <span className="eyebrow">NOG EEN VOORBEELD</span>
            <h2>De wedstrijd eindigt in 1-1</h2>
            <p>
              Een exacte 1-1 is maximaal 14 punten waard.
              Voorspel je ook een gelijkspel, maar zit je verder
              van de uitslag af? Dan verlies je per afwijkend
              doelpunt 2 punten.
            </p>
          </div>

          <div className="miniScores">
            <div>
              <span>1 - 1</span>
              <b>14 punten</b>
            </div>

            <div>
              <span>2 - 2</span>
              <b>10 punten</b>
            </div>

            <div>
              <span>3 - 3</span>
              <b>6 punten</b>
            </div>

            <div>
              <span>4 - 4</span>
              <b>2 punten</b>
            </div>
          </div>
        </section>

        <section className="why">
          <span className="eyebrow">WAAROM DIT SYSTEEM?</span>
          <h2>Elke voorspelling telt anders.</h2>

          <p>
            Een spectaculaire uitslag exact voorspellen wordt
            extra beloond. Tegelijkertijd krijg je ook punten
            wanneer je de juiste wedstrijduitkomst hebt en dicht
            bij de echte score zit. Zo ontstaat er meer verschil
            tussen spelers in het klassement.
          </p>

          <a href="/wedstrijden">
            Voorspel wedstrijden →
          </a>
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
