"use client";

import { useEffect, useState } from "react";
import Navbar from "../Navbar";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

const translations: Record<LanguageCode, any> = {
  nl: {
    eyebrow: "CONTACT",
    title: "We horen graag van je",
    intro: "Heb je een vraag over VoetIQ, loop je ergens tegenaan of kunnen we je ergens mee helpen? Neem gerust contact met ons op.",
    helpTitle: "Vragen of hulp nodig?",
    helpText: "Stuur ons een e-mail en vertel waar we je mee kunnen helpen. We proberen je zo snel mogelijk te beantwoorden.",
    feedbackTitle: "Tips & tops",
    feedbackText: "VoetIQ blijven we graag verbeteren. Heb je een goed idee, mis je een functie of zie je iets dat volgens jou beter kan? Of wil je juist laten weten wat je goed vindt? Alle tips én tops zijn welkom. Jouw feedback helpt ons om VoetIQ steeds beter te maken.",
    emailLabel: "E-mailadres", button: "E-mail ons →", note: "We proberen zo snel mogelijk te reageren."
  },
  en: {
    eyebrow: "CONTACT", title: "We'd love to hear from you",
    intro: "Do you have a question about VoetIQ, are you having an issue, or is there something we can help you with? Feel free to contact us.",
    helpTitle: "Questions or need help?", helpText: "Send us an email and tell us how we can help. We'll try to get back to you as soon as possible.",
    feedbackTitle: "Feedback & ideas", feedbackText: "We're always looking to improve VoetIQ. Have a great idea, miss a feature, or see something that could be better? Or would you like to tell us what you already enjoy? All feedback is welcome. Your input helps us make VoetIQ better and better.",
    emailLabel: "Email address", button: "Email us →", note: "We'll try to respond as soon as possible."
  },
  de: {
    eyebrow: "KONTAKT", title: "Wir freuen uns von dir zu hören",
    intro: "Hast du eine Frage zu VoetIQ, ein Problem oder können wir dir bei etwas helfen? Dann kontaktiere uns gerne.",
    helpTitle: "Fragen oder Hilfe benötigt?", helpText: "Schick uns eine E-Mail und sag uns, wobei wir dir helfen können. Wir versuchen, dir so schnell wie möglich zu antworten.",
    feedbackTitle: "Tipps & Feedback", feedbackText: "Wir möchten VoetIQ ständig verbessern. Hast du eine gute Idee, vermisst du eine Funktion oder siehst du etwas, das besser sein könnte? Oder möchtest du uns sagen, was dir besonders gut gefällt? Jede Rückmeldung ist willkommen und hilft uns, VoetIQ weiter zu verbessern.",
    emailLabel: "E-Mail-Adresse", button: "E-Mail senden →", note: "Wir versuchen, so schnell wie möglich zu antworten."
  },
  es: {
    eyebrow: "CONTACTO", title: "Nos encantará saber de ti",
    intro: "¿Tienes alguna pregunta sobre VoetIQ, algún problema o necesitas ayuda? No dudes en ponerte en contacto con nosotros.",
    helpTitle: "¿Preguntas o necesitas ayuda?", helpText: "Envíanos un correo y cuéntanos cómo podemos ayudarte. Intentaremos responderte lo antes posible.",
    feedbackTitle: "Ideas y comentarios", feedbackText: "Queremos seguir mejorando VoetIQ. ¿Tienes una buena idea, echas de menos alguna función o ves algo que podría mejorar? ¿O quieres contarnos qué te gusta? Todos los comentarios son bienvenidos. Tu opinión nos ayuda a hacer VoetIQ cada vez mejor.",
    emailLabel: "Correo electrónico", button: "Envíanos un correo →", note: "Intentaremos responder lo antes posible."
  },
  fr: {
    eyebrow: "CONTACT", title: "Nous serons ravis de vous lire",
    intro: "Vous avez une question sur VoetIQ, vous rencontrez un problème ou vous avez besoin d'aide ? N'hésitez pas à nous contacter.",
    helpTitle: "Une question ou besoin d'aide ?", helpText: "Envoyez-nous un e-mail et expliquez-nous comment nous pouvons vous aider. Nous essaierons de vous répondre au plus vite.",
    feedbackTitle: "Idées et retours", feedbackText: "Nous voulons continuer à améliorer VoetIQ. Vous avez une bonne idée, une fonctionnalité vous manque ou quelque chose pourrait être amélioré ? Ou vous souhaitez simplement nous dire ce que vous appréciez ? Tous vos retours sont les bienvenus et nous aident à rendre VoetIQ toujours meilleur.",
    emailLabel: "Adresse e-mail", button: "Nous écrire →", note: "Nous essaierons de répondre le plus rapidement possible."
  },
  it: {
    eyebrow: "CONTATTI", title: "Ci fa piacere sentirti",
    intro: "Hai una domanda su VoetIQ, hai riscontrato un problema o possiamo aiutarti in qualcosa? Contattaci pure.",
    helpTitle: "Domande o bisogno di aiuto?", helpText: "Mandaci un'e-mail e raccontaci come possiamo aiutarti. Cercheremo di risponderti il prima possibile.",
    feedbackTitle: "Idee e feedback", feedbackText: "Vogliamo continuare a migliorare VoetIQ. Hai una buona idea, ti manca una funzione o hai notato qualcosa che potrebbe essere migliorato? Oppure vuoi dirci cosa ti piace? Ogni feedback è benvenuto e ci aiuta a rendere VoetIQ sempre migliore.",
    emailLabel: "Indirizzo e-mail", button: "Scrivici →", note: "Cercheremo di rispondere il prima possibile."
  },
  pt: {
    eyebrow: "CONTACTO", title: "Gostamos de ouvir a tua opinião",
    intro: "Tens alguma pergunta sobre o VoetIQ, encontraste algum problema ou precisas de ajuda? Entra em contacto connosco.",
    helpTitle: "Perguntas ou precisas de ajuda?", helpText: "Envia-nos um e-mail e diz-nos como podemos ajudar. Tentaremos responder o mais rapidamente possível.",
    feedbackTitle: "Ideias e feedback", feedbackText: "Queremos continuar a melhorar o VoetIQ. Tens uma boa ideia, sentes falta de alguma funcionalidade ou viste algo que poderia ser melhor? Ou queres dizer-nos aquilo de que gostas? Todo o feedback é bem-vindo e ajuda-nos a tornar o VoetIQ cada vez melhor.",
    emailLabel: "Endereço de e-mail", button: "Enviar e-mail →", note: "Tentaremos responder o mais rapidamente possível."
  }
};

export default function ContactPage() {
  const [language, setLanguage] = useState<LanguageCode>("nl");

  useEffect(() => {
    const saved = (window.localStorage.getItem("voetiq-language") || "nl") as LanguageCode;
    setLanguage(saved in translations ? saved : "nl");
    const change = (event: Event) => {
      const next = ((event as CustomEvent<{ language?: string }>).detail?.language || "nl") as LanguageCode;
      setLanguage(next in translations ? next : "nl");
    };
    window.addEventListener("voetiq-language-change", change);
    return () => window.removeEventListener("voetiq-language-change", change);
  }, []);

  const t = translations[language];

  return (
    <main style={{ minHeight:"100vh", background:"radial-gradient(circle at 50% 12%, rgba(46,230,129,0.12), transparent 28%), #020d08", color:"white" }}>
      <Navbar />
      <section style={{ maxWidth:"900px", margin:"0 auto", padding:"72px 20px 90px" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ display:"inline-flex", padding:"8px 14px", borderRadius:"999px", background:"rgba(66,233,133,0.08)", border:"1px solid rgba(66,233,133,0.16)", color:"#42e985", fontSize:"11px", fontWeight:900, letterSpacing:"1px" }}>
            ✉️ {t.eyebrow}
          </div>
          <h1 style={{ margin:"20px 0 0", fontSize:"clamp(36px, 6vw, 58px)", lineHeight:1.05, fontWeight:950, letterSpacing:"-2px" }}>{t.title}</h1>
          <p style={{ maxWidth:"680px", margin:"18px auto 0", color:"#91a79a", fontSize:"16px", lineHeight:1.7 }}>{t.intro}</p>
        </div>

        <div style={{ marginTop:"42px", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"16px" }}>
          <InfoCard icon="💬" title={t.helpTitle} text={t.helpText} />
          <InfoCard icon="💡" title={t.feedbackTitle} text={t.feedbackText} />
        </div>

        <div style={{ marginTop:"20px", padding:"30px", borderRadius:"22px", background:"linear-gradient(145deg, rgba(8,35,23,0.98), rgba(3,18,11,0.98))", border:"1px solid rgba(66,233,133,0.14)", textAlign:"center" }}>
          <div style={{ color:"#71877a", fontSize:"11px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.9px" }}>{t.emailLabel}</div>
          <a href="mailto:contact@voetiq.nl" style={{ display:"inline-block", marginTop:"9px", color:"white", fontSize:"clamp(21px, 4vw, 30px)", fontWeight:950, textDecoration:"none", wordBreak:"break-word" }}>contact@voetiq.nl</a>
          <div>
            <a href="mailto:contact@voetiq.nl?subject=Contact%20VoetIQ" style={{ display:"inline-block", marginTop:"24px", padding:"13px 22px", borderRadius:"11px", background:"#42e985", color:"#021108", fontSize:"14px", fontWeight:900, textDecoration:"none" }}>{t.button}</a>
          </div>
          <p style={{ margin:"15px 0 0", color:"#60766a", fontSize:"12px" }}>{t.note}</p>
        </div>
      </section>
    </main>
  );
}

function InfoCard({ icon, title, text }: { icon:string; title:string; text:string }) {
  return (
    <article style={{ padding:"25px", borderRadius:"18px", background:"linear-gradient(145deg, rgba(8,35,23,0.96), rgba(3,18,11,0.96))", border:"1px solid rgba(75,255,153,0.10)" }}>
      <div style={{ fontSize:"28px" }}>{icon}</div>
      <h2 style={{ margin:"15px 0 8px", fontSize:"19px", fontWeight:950 }}>{title}</h2>
      <p style={{ margin:0, color:"#83998c", fontSize:"13px", lineHeight:1.7 }}>{text}</p>
    </article>
  );
}
