"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import { supabase } from "@/lib/supabase";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

const copy = {
  nl: {
    kicker: "VOETIQ PREMIUM",
    title: "Haal meer uit iedere voorspelling.",
    subtitle:
      "Ontgrendel extra statistieken, profielopties en Premium-functies. Voorspellen blijft eerlijk: Premium geeft geen extra wedstrijdpunten.",
    monthly: "Maandelijks",
    price: "€2,99",
    perMonth: "per maand",
    cancel: "Maandelijks opzegbaar",
    button: "Binnenkort beschikbaar",
    activeButton: "👑 Jij hebt VoetIQ Premium",
    checking: "Premium-status controleren...",
    activeText: "Je Premium-abonnement is actief.",
    soon: "VoetIQ Premium is binnenkort beschikbaar.",
    included: "Inbegrepen bij Premium",
    features: [
      "Champions League voorspellen",
      "Volledig reclamevrij",
      "Uitgebreide persoonlijke statistieken",
      "Premium-badge op je profiel",
      "Extra profielpersonalisatie",
      "Meer opties voor poules",
      "Historische voorspellingstatistieken",
    ],
    fair: "Geen pay-to-win",
    fairText:
      "Premium verandert je punten, rang of kans om te winnen niet.",
  },

  en: {
    kicker: "VOETIQ PREMIUM",
    title: "Get more out of every prediction.",
    subtitle:
      "Unlock extra statistics, profile options and Premium features. Predictions stay fair: Premium gives no extra match points.",
    monthly: "Monthly",
    price: "€2.99",
    perMonth: "per month",
    cancel: "Cancel monthly",
    button: "Coming soon",
    activeButton: "👑 You have VoetIQ Premium",
    checking: "Checking Premium status...",
    activeText: "Your Premium subscription is active.",
    soon: "VoetIQ Premium is coming soon.",
    included: "Included with Premium",
    features: [
      "Predict Champions League matches",
      "Completely ad-free",
      "Advanced personal statistics",
      "Premium badge on your profile",
      "Extra profile customization",
      "More pool options",
      "Historical prediction statistics",
    ],
    fair: "No pay-to-win",
    fairText:
      "Premium does not change your points, rank or chance of winning.",
  },

  de: {
    kicker: "VOETIQ PREMIUM",
    title: "Hol mehr aus jeder Vorhersage heraus.",
    subtitle:
      "Schalte zusätzliche Statistiken, Profiloptionen und Premium-Funktionen frei. Premium gibt keine zusätzlichen Spielpunkte.",
    monthly: "Monatlich",
    price: "€2,99",
    perMonth: "pro Monat",
    cancel: "Monatlich kündbar",
    button: "Demnächst verfügbar",
    activeButton: "👑 Du hast VoetIQ Premium",
    checking: "Premium-Status wird geprüft...",
    activeText: "Dein Premium-Abonnement ist aktiv.",
    soon: "VoetIQ Premium ist demnächst verfügbar.",
    included: "In Premium enthalten",
    features: [
      "Champions League tippen",
      "Vollständig werbefrei",
      "Erweiterte persönliche Statistiken",
      "Premium-Abzeichen im Profil",
      "Zusätzliche Profilanpassung",
      "Mehr Optionen für Tipprunden",
      "Historische Tippstatistiken",
    ],
    fair: "Kein Pay-to-win",
    fairText:
      "Premium verändert deine Punkte, deinen Rang oder deine Gewinnchance nicht.",
  },

  es: {
    kicker: "VOETIQ PREMIUM",
    title: "Saca más partido a cada pronóstico.",
    subtitle:
      "Desbloquea estadísticas adicionales, opciones de perfil y funciones Premium. Premium no da puntos extra.",
    monthly: "Mensual",
    price: "€2,99",
    perMonth: "al mes",
    cancel: "Cancela mensualmente",
    button: "Próximamente",
    activeButton: "👑 Tienes VoetIQ Premium",
    checking: "Comprobando estado Premium...",
    activeText: "Tu suscripción Premium está activa.",
    soon: "VoetIQ Premium estará disponible próximamente.",
    included: "Incluido con Premium",
    features: [
      "Pronósticos de Champions League",
      "Completamente sin anuncios",
      "Estadísticas personales avanzadas",
      "Insignia Premium en tu perfil",
      "Personalización extra del perfil",
      "Más opciones para grupos",
      "Estadísticas históricas de pronósticos",
    ],
    fair: "Sin pay-to-win",
    fairText:
      "Premium no cambia tus puntos, rango ni posibilidades de ganar.",
  },

  fr: {
    kicker: "VOETIQ PREMIUM",
    title: "Profite davantage de chaque pronostic.",
    subtitle:
      "Débloque des statistiques supplémentaires, des options de profil et des fonctions Premium. Premium ne donne aucun point supplémentaire.",
    monthly: "Mensuel",
    price: "2,99 €",
    perMonth: "par mois",
    cancel: "Résiliable chaque mois",
    button: "Bientôt disponible",
    activeButton: "👑 Tu as VoetIQ Premium",
    checking: "Vérification du statut Premium...",
    activeText: "Ton abonnement Premium est actif.",
    soon: "VoetIQ Premium sera bientôt disponible.",
    included: "Inclus avec Premium",
    features: [
      "Pronostiquer la Champions League",
      "Entièrement sans publicité",
      "Statistiques personnelles avancées",
      "Badge Premium sur ton profil",
      "Personnalisation supplémentaire du profil",
      "Plus d’options pour les ligues",
      "Historique détaillé des pronostics",
    ],
    fair: "Pas de pay-to-win",
    fairText:
      "Premium ne modifie ni tes points, ni ton rang, ni tes chances de gagner.",
  },

  it: {
    kicker: "VOETIQ PREMIUM",
    title: "Ottieni di più da ogni pronostico.",
    subtitle:
      "Sblocca statistiche extra, opzioni profilo e funzioni Premium. Premium non assegna punti partita extra.",
    monthly: "Mensile",
    price: "€2,99",
    perMonth: "al mese",
    cancel: "Annullabile mensilmente",
    button: "Prossimamente",
    activeButton: "👑 Hai VoetIQ Premium",
    checking: "Controllo dello stato Premium...",
    activeText: "Il tuo abbonamento Premium è attivo.",
    soon: "VoetIQ Premium sarà disponibile prossimamente.",
    included: "Incluso con Premium",
    features: [
      "Pronostici Champions League",
      "Completamente senza pubblicità",
      "Statistiche personali avanzate",
      "Badge Premium sul profilo",
      "Personalizzazione extra del profilo",
      "Più opzioni per i gruppi",
      "Statistiche storiche dei pronostici",
    ],
    fair: "Niente pay-to-win",
    fairText:
      "Premium non modifica punti, posizione o possibilità di vincere.",
  },

  pt: {
    kicker: "VOETIQ PREMIUM",
    title: "Tira mais partido de cada prognóstico.",
    subtitle:
      "Desbloqueia estatísticas extra, opções de perfil e funcionalidades Premium. Premium não dá pontos extra.",
    monthly: "Mensal",
    price: "€2,99",
    perMonth: "por mês",
    cancel: "Cancelamento mensal",
    button: "Em breve",
    activeButton: "👑 Tens VoetIQ Premium",
    checking: "A verificar o estado Premium...",
    activeText: "A tua subscrição Premium está ativa.",
    soon: "O VoetIQ Premium estará disponível em breve.",
    included: "Incluído no Premium",
    features: [
      "Prever jogos da Champions League",
      "Completamente sem anúncios",
      "Estatísticas pessoais avançadas",
      "Distintivo Premium no perfil",
      "Personalização extra do perfil",
      "Mais opções para grupos",
      "Estatísticas históricas de prognósticos",
    ],
    fair: "Sem pay-to-win",
    fairText:
      "Premium não altera os teus pontos, classificação ou hipótese de ganhar.",
  },
} satisfies Record<LanguageCode, any>;

function validLanguage(value: string | null): value is LanguageCode {
  return ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value || "");
}

export default function PremiumPage() {
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [premiumLoading, setPremiumLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("voetiq-language");

    if (validLanguage(stored)) {
      setLanguage(stored);
    }

    const handleLanguage = (event: Event) => {
      const custom = event as CustomEvent<{ language?: string }>;

      if (validLanguage(custom.detail?.language || null)) {
        setLanguage(custom.detail.language as LanguageCode);
      }
    };

    window.addEventListener("voetiq-language-change", handleLanguage);

    return () => {
      window.removeEventListener("voetiq-language-change", handleLanguage);
    };
  }, []);

  useEffect(() => {
    async function loadPremiumStatus() {
      try {
        setPremiumLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setIsPremium(false);
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("is_premium, premium_expires_at")
          .eq("id", user.id)
          .maybeSingle();

        if (error || !data) {
          console.error("Premium status ophalen mislukt:", error);
          setIsPremium(false);
          return;
        }

        const premiumEnabled = data.is_premium === true;

        const premiumNotExpired =
          !data.premium_expires_at ||
          new Date(data.premium_expires_at).getTime() > Date.now();

        setIsPremium(premiumEnabled && premiumNotExpired);
      } catch (error) {
        console.error("Premium status ophalen mislukt:", error);
        setIsPremium(false);
      } finally {
        setPremiumLoading(false);
      }
    }

    loadPremiumStatus();
  }, []);

  const t = copy[language];

  return (
    <>
      <Navbar />

      <main className="premium-page">
        <section className="premium-hero">
          <div className="premium-kicker">👑 {t.kicker}</div>

          <h1>{t.title}</h1>

          <p>{t.subtitle}</p>
        </section>

        <section className="premium-grid">
          <div className={`plan-card ${isPremium ? "active-plan" : ""}`}>
            <div className="plan-top">
              <span>{t.monthly}</span>

              <span className="premium-chip">
                {isPremium ? "✓ PREMIUM" : "PREMIUM"}
              </span>
            </div>

            <div className="price">
              <strong>{t.price}</strong>
              <span>{t.perMonth}</span>
            </div>

            <div className="cancel">{t.cancel}</div>

            {premiumLoading ? (
              <button
                type="button"
                className="premium-button loading-button"
                disabled
              >
                {t.checking}
              </button>
            ) : isPremium ? (
              <button
                type="button"
                className="premium-button active-button"
                disabled
              >
                {t.activeButton}
              </button>
            ) : (
              <button type="button" className="premium-button coming-soon-button" disabled>
                {t.button}
              </button>
            )}

            <small>{isPremium ? t.activeText : t.soon}</small>
          </div>

          <div className="features-card">
            <h2>{t.included}</h2>

            <div className="features">
              {t.features.map((feature: string) => (
                <div className="feature" key={feature}>
                  <span>✓</span>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="fair-card">
          <div>⚽</div>

          <div>
            <strong>{t.fair}</strong>
            <p>{t.fairText}</p>
          </div>
        </section>
      </main>

      <style jsx>{`
        .premium-page {
          min-height: calc(100vh - 72px);
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(46, 230, 129, 0.12),
              transparent 34%
            ),
            #03130c;
          color: #f3fff8;
          padding: 72px 22px 90px;
        }

        .premium-hero {
          max-width: 820px;
          margin: 0 auto 42px;
          text-align: center;
        }

        .premium-kicker {
          display: inline-flex;
          padding: 8px 13px;
          border: 1px solid rgba(46, 230, 129, 0.25);
          background: rgba(46, 230, 129, 0.08);
          border-radius: 999px;
          color: #65f0a1;
          font-size: 12px;
          font-weight: 950;
          letter-spacing: 1px;
        }

        h1 {
          font-size: clamp(38px, 6vw, 68px);
          line-height: 1.02;
          letter-spacing: -2.8px;
          margin: 20px 0 16px;
        }

        .premium-hero p {
          max-width: 700px;
          margin: auto;
          color: #9eb4a8;
          font-size: 16px;
          line-height: 1.7;
        }

        .premium-grid {
          max-width: 1000px;
          margin: auto;
          display: grid;
          grid-template-columns: 0.85fr 1.15fr;
          gap: 18px;
        }

        .plan-card,
        .features-card,
        .fair-card {
          border: 1px solid rgba(46, 230, 129, 0.15);
          background: linear-gradient(145deg, #071e13, #05170f);
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
        }

        .plan-card,
        .features-card {
          border-radius: 22px;
          padding: 28px;
        }

        .active-plan {
          border-color: rgba(46, 230, 129, 0.5);
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.24),
            0 0 40px rgba(46, 230, 129, 0.08);
        }

        .plan-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-weight: 900;
        }

        .premium-chip {
          font-size: 10px;
          letter-spacing: 0.8px;
          color: #062b1a;
          background: #45ec8e;
          padding: 6px 9px;
          border-radius: 999px;
        }

        .price {
          margin-top: 34px;
          display: flex;
          align-items: end;
          gap: 9px;
        }

        .price strong {
          font-size: 47px;
          letter-spacing: -2px;
        }

        .price span,
        .cancel,
        small {
          color: #8ea79a;
        }

        .cancel {
          font-size: 13px;
          margin: 8px 0 24px;
        }

        .premium-button {
          width: 100%;
          border: 0;
          border-radius: 11px;
          background: #2ee681;
          color: #052c1b;
          padding: 14px;
          font-size: 14px;
          font-weight: 950;
          cursor: pointer;
        }

        .coming-soon-button {
          opacity: 0.72;
          cursor: not-allowed;
        }

        .active-button {
          background: #45ec8e;
          cursor: default;
        }

        .loading-button {
          opacity: 0.65;
          cursor: wait;
        }

        small {
          display: block;
          text-align: center;
          margin-top: 11px;
          font-size: 11px;
        }

        .features-card h2 {
          margin: 0 0 21px;
          font-size: 21px;
        }

        .features {
          display: grid;
          gap: 8px;
        }

        .feature {
          display: grid;
          grid-template-columns: 28px 1fr;
          gap: 9px;
          align-items: center;
          padding: 11px;
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.025);
        }

        .feature span {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: rgba(46, 230, 129, 0.12);
          color: #55ed98;
          font-weight: 950;
        }

        .feature p {
          margin: 0;
          color: #dcebe3;
          font-size: 13px;
          font-weight: 700;
        }

        .fair-card {
          max-width: 1000px;
          margin: 18px auto 0;
          border-radius: 16px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .fair-card > div:first-child {
          font-size: 27px;
        }

        .fair-card strong {
          color: #5bef9b;
        }

        .fair-card p {
          margin: 4px 0 0;
          color: #91a99c;
          font-size: 12px;
        }

        @media (max-width: 760px) {
          .premium-page {
            padding-top: 45px;
          }

          .premium-grid {
            grid-template-columns: 1fr;
          }

          h1 {
            letter-spacing: -1.7px;
          }

          .plan-card,
          .features-card {
            padding: 22px;
          }
        }
      `}</style>
    </>
  );
}
