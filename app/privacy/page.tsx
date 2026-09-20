"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";
type Section = { title: string; text: string[] };

const copy: Record<LanguageCode, {
  back: string; kicker: string; title: string; intro: string;
  updated: string; date: string; sections: Section[];
  terms: string; home: string;
}> = {
  nl: {
    back: "Terug naar VoetIQ", kicker: "VOETIQ • PRIVACY", title: "Privacybeleid",
    intro: "Hier leggen we uit welke persoonsgegevens VoetIQ verwerkt, waarom dat gebeurt en welke rechten je daarbij hebt.",
    updated: "Laatst bijgewerkt", date: "20 september 2026",
    sections: [
      { title: "1. Welke gegevens verwerken we?", text: ["Bij het aanmaken van een account kunnen we je voornaam, achternaam, gebruikersnaam, e-mailadres en technische accountgegevens verwerken.", "Tijdens het gebruik verwerken we onder andere voorspellingen, punten, ranks, achievements, challengevoortgang, poulelidmaatschappen en, indien van toepassing, je Premium-status."] },
      { title: "2. Waarom gebruiken we deze gegevens?", text: ["We gebruiken deze gegevens om je account te laten werken, voorspellingen op te slaan, punten te berekenen, ranglijsten en poules te tonen, je profiel te beheren en VoetIQ veilig en betrouwbaar te laten functioneren.", "Gegevens kunnen ook worden gebruikt om technische fouten op te lossen en misbruik te voorkomen."] },
      { title: "3. Wat is zichtbaar voor andere spelers?", text: ["Je gebruikersnaam, punten, rank, achievements, competitieprestaties en eventueel je Premium-badge kunnen zichtbaar zijn voor andere spelers.", "Voorspellingen kunnen zichtbaar worden nadat een wedstrijd is begonnen. Je e-mailadres, voornaam, achternaam en wachtwoord worden niet als openbare profielinformatie weergegeven."] },
      { title: "4. Supabase en inloggen", text: ["VoetIQ gebruikt Supabase voor onder andere authenticatie en databasefunctionaliteit. Gegevens die nodig zijn voor je account en het gebruik van VoetIQ kunnen daarom via deze technische dienst worden verwerkt.", "VoetIQ slaat je wachtwoord niet zelf als leesbare tekst op."] },
      { title: "5. Browseropslag", text: ["VoetIQ gebruikt browseropslag voor functionele onderdelen, bijvoorbeeld je taalkeuze, bepaalde interfacevoorkeuren en gegevens die nodig zijn om je ingelogde sessie te laten werken."] },
      { title: "6. Externe voetbalgegevens", text: ["VoetIQ kan externe databronnen gebruiken voor wedstrijden, teams, uitslagen en wedstrijdstatussen. Je persoonlijke accountgegevens worden niet automatisch met zulke voetbalgegevensproviders gedeeld.", "Externe diensten kunnen een eigen privacybeleid hebben voor gegevens die zij zelf verwerken."] },
      { title: "7. Hoe lang bewaren we gegevens?", text: ["Persoonsgegevens worden niet langer bewaard dan redelijkerwijs nodig is voor het doel waarvoor ze worden gebruikt, het functioneren en beveiligen van je account of wettelijke verplichtingen.", "Wedstrijdhistorie en ranglijstgegevens kunnen aan je account gekoppeld blijven zolang je account en de betreffende functies bestaan."] },
      { title: "8. Beveiliging", text: ["We nemen redelijke technische en organisatorische maatregelen om accounts en persoonsgegevens te beschermen tegen ongeoorloofde toegang, verlies en misbruik.", "Geen enkele online dienst kan absolute beveiliging garanderen. Houd daarom ook zelf je wachtwoord geheim."] },
      { title: "9. Jouw privacyrechten", text: ["Afhankelijk van het toepasselijke privacyrecht kun je onder meer recht hebben op inzage, correctie, verwijdering, beperking van verwerking en in bepaalde gevallen overdraagbaarheid of bezwaar.", "Sommige gegevens kunnen niet direct worden verwijderd wanneer bewaring wettelijk noodzakelijk is of een geldige uitzondering van toepassing is."] },
      { title: "10. Premium en betalingen", text: ["Zolang VoetIQ Premium als 'binnenkort beschikbaar' wordt weergegeven, worden via deze functie nog geen Premium-betalingen verwerkt.", "Wanneer betaalde diensten later beschikbaar komen, wordt dit privacybeleid bijgewerkt met informatie over betaal- en abonnementsgegevens en eventuele betalingsdienstverleners."] },
      { title: "11. Wijzigingen", text: ["Dit privacybeleid kan worden aangepast wanneer VoetIQ verandert, nieuwe functies worden toegevoegd of wet- en regelgeving dat vereist. De datum bovenaan toont de laatste update."] },
      { title: "12. Contact", text: ["Voor privacyvragen of verzoeken over je persoonsgegevens kun je gebruikmaken van de contactmogelijkheid die VoetIQ beschikbaar stelt.", "Voor een commerciële lancering moet hier een definitief contactadres en, waar wettelijk vereist, aanvullende bedrijfsinformatie worden opgenomen."] },
    ],
    terms: "Algemene voorwaarden", home: "Naar homepage",
  },
  en: {
    back: "Back to VoetIQ", kicker: "VOETIQ • PRIVACY", title: "Privacy Policy",
    intro: "This policy explains which personal data VoetIQ processes, why it is processed and which rights you may have.",
    updated: "Last updated", date: "20 September 2026",
    sections: [
      { title:"1. What data do we process?", text:["When you create an account, we may process your first name, last name, username, email address and technical account data.","While using VoetIQ, we process information such as predictions, points, ranks, achievements, challenge progress, pool memberships and, where applicable, Premium status."] },
      { title:"2. Why do we use this data?", text:["We use this data to operate your account, save predictions, calculate points, show leaderboards and pools, manage your profile and keep VoetIQ secure and reliable.","Data may also be used to resolve technical errors and prevent abuse."] },
      { title:"3. What can other players see?", text:["Your username, points, rank, achievements, competition performance and any Premium badge may be visible to other players.","Predictions may become visible after a match has started. Your email address, first name, last name and password are not displayed as public profile information."] },
      { title:"4. Supabase and login", text:["VoetIQ uses Supabase for authentication and database functionality. Data needed for your account and use of VoetIQ may therefore be processed through this technical service.","VoetIQ does not itself store your password as readable text."] },
      { title:"5. Browser storage", text:["VoetIQ uses browser storage for functional purposes, such as your language choice, certain interface preferences and information required to maintain your signed-in session."] },
      { title:"6. External football data", text:["VoetIQ may use external data sources for matches, teams, results and match statuses. Your personal account data is not automatically shared with such football data providers.","External services may have their own privacy policies for data they process."] },
      { title:"7. How long do we keep data?", text:["Personal data is not kept longer than reasonably necessary for its purpose, account operation and security or legal obligations.","Match history and leaderboard information may remain linked to your account while your account and the relevant features exist."] },
      { title:"8. Security", text:["We take reasonable technical and organisational measures to protect accounts and personal data against unauthorised access, loss and misuse.","No online service can guarantee absolute security, so keep your password confidential."] },
      { title:"9. Your privacy rights", text:["Depending on applicable privacy law, you may have rights including access, correction, deletion, restriction of processing and, in some cases, portability or objection.","Some data cannot be deleted immediately where retention is legally required or a valid exception applies."] },
      { title:"10. Premium and payments", text:["While VoetIQ Premium is displayed as 'coming soon', Premium payments are not processed through this feature.","If paid services become available later, this policy will be updated with information about payment and subscription data and any payment providers."] },
      { title:"11. Changes", text:["This policy may be updated when VoetIQ changes, new features are introduced or laws require it. The date above shows the latest update."] },
      { title:"12. Contact", text:["For privacy questions or requests about your personal data, use the contact option made available by VoetIQ.","Before commercial launch, a final contact address and any legally required business information should be added here."] },
    ],
    terms:"Terms and Conditions", home:"Go to homepage",
  },
  de: {
    back:"Zurück zu VoetIQ", kicker:"VOETIQ • DATENSCHUTZ", title:"Datenschutzerklärung",
    intro:"Hier erklären wir, welche personenbezogenen Daten VoetIQ verarbeitet, warum dies geschieht und welche Rechte du haben kannst.",
    updated:"Zuletzt aktualisiert", date:"20. September 2026",
    sections:[
      {title:"1. Welche Daten verarbeiten wir?",text:["Bei der Kontoerstellung können Vorname, Nachname, Benutzername, E-Mail-Adresse und technische Kontodaten verarbeitet werden.","Bei der Nutzung verarbeiten wir unter anderem Tipps, Punkte, Ränge, Achievements, Challenge-Fortschritt, Tipprunden und gegebenenfalls den Premium-Status."]},
      {title:"2. Warum verwenden wir diese Daten?",text:["Die Daten werden für Konto, Tipps, Punkte, Ranglisten, Tipprunden, Profilfunktionen sowie Sicherheit und zuverlässigen Betrieb verwendet.","Sie können auch zur Fehlerbehebung und Missbrauchsverhinderung genutzt werden."]},
      {title:"3. Was sehen andere Spieler?",text:["Benutzername, Punkte, Rang, Achievements, Wettbewerbsleistungen und gegebenenfalls das Premium-Abzeichen können sichtbar sein.","Tipps können nach Spielbeginn sichtbar werden. E-Mail-Adresse, Vorname, Nachname und Passwort werden nicht öffentlich im Profil angezeigt."]},
      {title:"4. Supabase und Anmeldung",text:["VoetIQ nutzt Supabase für Authentifizierung und Datenbankfunktionen. Dafür erforderliche Konto- und Nutzungsdaten können über diesen technischen Dienst verarbeitet werden.","VoetIQ speichert dein Passwort nicht selbst als lesbaren Text."]},
      {title:"5. Browserspeicher",text:["VoetIQ verwendet Browserspeicher für funktionale Zwecke wie Sprache, bestimmte Oberflächenpräferenzen und die angemeldete Sitzung."]},
      {title:"6. Externe Fußballdaten",text:["Externe Quellen können für Spiele, Teams, Ergebnisse und Status verwendet werden. Persönliche Kontodaten werden nicht automatisch an solche Anbieter weitergegeben.","Externe Dienste können eigene Datenschutzrichtlinien haben."]},
      {title:"7. Speicherdauer",text:["Daten werden nicht länger als vernünftigerweise für Zweck, Kontobetrieb, Sicherheit oder gesetzliche Pflichten erforderlich gespeichert.","Spielhistorie und Ranglistendaten können mit dem Konto verbunden bleiben, solange Konto und Funktionen bestehen."]},
      {title:"8. Sicherheit",text:["Wir treffen angemessene technische und organisatorische Schutzmaßnahmen gegen unbefugten Zugriff, Verlust und Missbrauch.","Kein Onlinedienst kann absolute Sicherheit garantieren. Halte dein Passwort geheim."]},
      {title:"9. Deine Rechte",text:["Je nach anwendbarem Recht können Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung sowie gegebenenfalls Übertragbarkeit oder Widerspruch bestehen.","Manche Daten können bei gesetzlichen Aufbewahrungspflichten nicht sofort gelöscht werden."]},
      {title:"10. Premium und Zahlungen",text:["Solange Premium als demnächst verfügbar angezeigt wird, werden darüber keine Premium-Zahlungen verarbeitet.","Bei Einführung kostenpflichtiger Dienste wird diese Erklärung um Informationen zu Zahlungs- und Abonnementdaten ergänzt."]},
      {title:"11. Änderungen",text:["Diese Erklärung kann bei Änderungen an VoetIQ, neuen Funktionen oder gesetzlichen Anforderungen aktualisiert werden."]},
      {title:"12. Kontakt",text:["Für Datenschutzfragen kann die von VoetIQ bereitgestellte Kontaktmöglichkeit genutzt werden.","Vor dem kommerziellen Start sollten hier eine endgültige Kontaktadresse und erforderliche Unternehmensangaben ergänzt werden."]},
    ],
    terms:"Allgemeine Geschäftsbedingungen", home:"Zur Startseite",
  },
  es: {
    back:"Volver a VoetIQ", kicker:"VOETIQ • PRIVACIDAD", title:"Política de privacidad",
    intro:"Aquí explicamos qué datos personales procesa VoetIQ, por qué y qué derechos puedes tener.",
    updated:"Última actualización", date:"20 de septiembre de 2026",
    sections:[
      {title:"1. ¿Qué datos procesamos?",text:["Al crear una cuenta podemos procesar nombre, apellido, nombre de usuario, correo electrónico y datos técnicos de la cuenta.","Durante el uso procesamos pronósticos, puntos, rangos, logros, progreso de retos, grupos y, cuando corresponda, estado Premium."]},
      {title:"2. ¿Por qué usamos estos datos?",text:["Los usamos para gestionar tu cuenta, guardar pronósticos, calcular puntos, mostrar clasificaciones y grupos, gestionar tu perfil y mantener VoetIQ seguro y fiable.","También pueden utilizarse para corregir errores y prevenir abusos."]},
      {title:"3. ¿Qué ven otros jugadores?",text:["Tu nombre de usuario, puntos, rango, logros, rendimiento y posible insignia Premium pueden ser visibles.","Los pronósticos pueden hacerse visibles tras comenzar el partido. Tu correo, nombre, apellido y contraseña no se muestran públicamente."]},
      {title:"4. Supabase e inicio de sesión",text:["VoetIQ utiliza Supabase para autenticación y base de datos. Los datos necesarios para tu cuenta pueden procesarse mediante este servicio técnico.","VoetIQ no almacena por sí mismo tu contraseña como texto legible."]},
      {title:"5. Almacenamiento del navegador",text:["VoetIQ utiliza almacenamiento del navegador para funciones como idioma, preferencias de interfaz y mantenimiento de la sesión iniciada."]},
      {title:"6. Datos externos de fútbol",text:["Podemos usar fuentes externas para partidos, equipos, resultados y estados. Tus datos personales no se comparten automáticamente con esos proveedores.","Los servicios externos pueden tener sus propias políticas de privacidad."]},
      {title:"7. Conservación",text:["Los datos no se conservan más tiempo del razonablemente necesario para su finalidad, funcionamiento, seguridad u obligaciones legales.","El historial y las clasificaciones pueden seguir vinculados a tu cuenta mientras existan la cuenta y esas funciones."]},
      {title:"8. Seguridad",text:["Adoptamos medidas razonables para proteger cuentas y datos contra acceso no autorizado, pérdida y abuso.","Ningún servicio online garantiza seguridad absoluta. Mantén tu contraseña en secreto."]},
      {title:"9. Tus derechos",text:["Según la legislación aplicable, puedes tener derechos de acceso, rectificación, supresión, limitación y, en ciertos casos, portabilidad u oposición.","Algunos datos no pueden eliminarse inmediatamente si existe una obligación legal de conservarlos."]},
      {title:"10. Premium y pagos",text:["Mientras Premium aparezca como próximamente, esta función no procesa pagos Premium.","Cuando haya servicios de pago, la política se actualizará con información sobre pagos, suscripciones y proveedores."]},
      {title:"11. Cambios",text:["Esta política puede actualizarse cuando cambie VoetIQ, se añadan funciones o lo exija la ley."]},
      {title:"12. Contacto",text:["Para preguntas o solicitudes de privacidad utiliza la opción de contacto que VoetIQ ponga a disposición.","Antes del lanzamiento comercial deberá añadirse una dirección de contacto definitiva y la información empresarial legalmente necesaria."]},
    ],
    terms:"Términos y condiciones", home:"Ir al inicio",
  },
  fr: {
    back:"Retour à VoetIQ", kicker:"VOETIQ • CONFIDENTIALITÉ", title:"Politique de confidentialité",
    intro:"Nous expliquons ici quelles données personnelles VoetIQ traite, pourquoi et quels droits tu peux avoir.",
    updated:"Dernière mise à jour", date:"20 septembre 2026",
    sections:[
      {title:"1. Quelles données traitons-nous ?",text:["Lors de la création d'un compte, nous pouvons traiter prénom, nom, nom d'utilisateur, e-mail et données techniques du compte.","Pendant l'utilisation, nous traitons notamment pronostics, points, rangs, achievements, progression des challenges, ligues et, le cas échéant, statut Premium."]},
      {title:"2. Pourquoi utilisons-nous ces données ?",text:["Elles servent au compte, aux pronostics, au calcul des points, aux classements, aux ligues, au profil ainsi qu'à la sécurité et au fonctionnement de VoetIQ.","Elles peuvent aussi servir à corriger des erreurs et prévenir les abus."]},
      {title:"3. Que voient les autres joueurs ?",text:["Nom d'utilisateur, points, rang, achievements, performances et éventuel badge Premium peuvent être visibles.","Les pronostics peuvent devenir visibles après le début du match. E-mail, prénom, nom et mot de passe ne sont pas affichés publiquement."]},
      {title:"4. Supabase et connexion",text:["VoetIQ utilise Supabase pour l'authentification et la base de données. Les données nécessaires au compte peuvent donc être traitées via ce service technique.","VoetIQ ne stocke pas lui-même ton mot de passe sous forme de texte lisible."]},
      {title:"5. Stockage du navigateur",text:["VoetIQ utilise le stockage du navigateur pour des fonctions comme la langue, certaines préférences et le maintien de la session."]},
      {title:"6. Données de football externes",text:["Des sources externes peuvent être utilisées pour les matchs, équipes, résultats et statuts. Tes données personnelles ne sont pas automatiquement partagées avec ces fournisseurs.","Les services externes peuvent avoir leurs propres politiques de confidentialité."]},
      {title:"7. Conservation",text:["Les données ne sont pas conservées plus longtemps que raisonnablement nécessaire pour leur finalité, le compte, la sécurité ou les obligations légales.","L'historique et les classements peuvent rester liés au compte tant que celui-ci et les fonctions concernées existent."]},
      {title:"8. Sécurité",text:["Nous prenons des mesures raisonnables pour protéger comptes et données contre accès non autorisé, perte et abus.","Aucun service en ligne ne garantit une sécurité absolue. Garde ton mot de passe confidentiel."]},
      {title:"9. Tes droits",text:["Selon le droit applicable, tu peux disposer de droits d'accès, rectification, effacement, limitation et parfois portabilité ou opposition.","Certaines données ne peuvent pas être supprimées immédiatement lorsqu'une conservation est légalement requise."]},
      {title:"10. Premium et paiements",text:["Tant que Premium est indiqué comme bientôt disponible, cette fonction ne traite aucun paiement Premium.","Lors du lancement de services payants, la politique sera mise à jour concernant les paiements, abonnements et prestataires."]},
      {title:"11. Modifications",text:["Cette politique peut être mise à jour lorsque VoetIQ évolue, que des fonctions sont ajoutées ou que la loi l'exige."]},
      {title:"12. Contact",text:["Pour toute question ou demande relative à la confidentialité, utilise la possibilité de contact mise à disposition par VoetIQ.","Avant le lancement commercial, une adresse de contact définitive et les informations d'entreprise légalement requises devront être ajoutées."]},
    ],
    terms:"Conditions générales", home:"Accueil",
  },
  it: {
    back:"Torna a VoetIQ", kicker:"VOETIQ • PRIVACY", title:"Politica sulla privacy",
    intro:"Qui spieghiamo quali dati personali tratta VoetIQ, perché e quali diritti potresti avere.",
    updated:"Ultimo aggiornamento", date:"20 settembre 2026",
    sections:[
      {title:"1. Quali dati trattiamo?",text:["Quando crei un account possiamo trattare nome, cognome, nome utente, email e dati tecnici dell'account.","Durante l'uso trattiamo pronostici, punti, rank, achievement, progressi delle sfide, gruppi e, quando applicabile, stato Premium."]},
      {title:"2. Perché usiamo questi dati?",text:["Servono per account, pronostici, calcolo punti, classifiche, gruppi, profilo, sicurezza e funzionamento affidabile.","Possono essere usati anche per correggere errori e prevenire abusi."]},
      {title:"3. Cosa vedono gli altri giocatori?",text:["Nome utente, punti, rank, achievement, prestazioni ed eventuale badge Premium possono essere visibili.","I pronostici possono diventare visibili dopo l'inizio della partita. Email, nome, cognome e password non vengono mostrati pubblicamente."]},
      {title:"4. Supabase e accesso",text:["VoetIQ usa Supabase per autenticazione e database. I dati necessari all'account possono quindi essere trattati tramite questo servizio tecnico.","VoetIQ non memorizza direttamente la password come testo leggibile."]},
      {title:"5. Memoria del browser",text:["VoetIQ usa la memoria del browser per funzioni come lingua, preferenze dell'interfaccia e mantenimento della sessione."]},
      {title:"6. Dati calcistici esterni",text:["Possiamo usare fonti esterne per partite, squadre, risultati e stati. I dati personali dell'account non vengono automaticamente condivisi con tali fornitori.","I servizi esterni possono avere proprie informative sulla privacy."]},
      {title:"7. Conservazione",text:["I dati non vengono conservati più a lungo di quanto ragionevolmente necessario per finalità, account, sicurezza o obblighi legali.","Storico e classifiche possono restare collegati all'account finché esistono account e funzioni."]},
      {title:"8. Sicurezza",text:["Adottiamo misure ragionevoli per proteggere account e dati da accessi non autorizzati, perdita e abuso.","Nessun servizio online garantisce sicurezza assoluta. Mantieni segreta la password."]},
      {title:"9. I tuoi diritti",text:["In base alla legge applicabile puoi avere diritti di accesso, rettifica, cancellazione, limitazione e talvolta portabilità o opposizione.","Alcuni dati non possono essere eliminati immediatamente quando la conservazione è richiesta dalla legge."]},
      {title:"10. Premium e pagamenti",text:["Finché Premium è indicato come prossimamente disponibile, questa funzione non elabora pagamenti Premium.","Quando saranno disponibili servizi a pagamento, la politica sarà aggiornata con informazioni su pagamenti, abbonamenti e fornitori."]},
      {title:"11. Modifiche",text:["Questa politica può essere aggiornata quando VoetIQ cambia, vengono aggiunte funzioni o lo richiede la legge."]},
      {title:"12. Contatto",text:["Per domande o richieste sulla privacy usa l'opzione di contatto resa disponibile da VoetIQ.","Prima del lancio commerciale dovranno essere aggiunti un indirizzo di contatto definitivo e le informazioni aziendali richieste."]},
    ],
    terms:"Termini e condizioni", home:"Vai alla home",
  },
  pt: {
    back:"Voltar ao VoetIQ", kicker:"VOETIQ • PRIVACIDADE", title:"Política de privacidade",
    intro:"Aqui explicamos que dados pessoais o VoetIQ trata, porquê e que direitos podes ter.",
    updated:"Última atualização", date:"20 de setembro de 2026",
    sections:[
      {title:"1. Que dados tratamos?",text:["Ao criares uma conta podemos tratar nome, apelido, nome de utilizador, email e dados técnicos da conta.","Durante a utilização tratamos previsões, pontos, ranks, achievements, progresso de desafios, grupos e, quando aplicável, estado Premium."]},
      {title:"2. Porque usamos estes dados?",text:["São usados para conta, previsões, cálculo de pontos, classificações, grupos, perfil, segurança e funcionamento fiável.","Também podem ser usados para corrigir erros e prevenir abusos."]},
      {title:"3. O que veem os outros jogadores?",text:["Nome de utilizador, pontos, rank, achievements, desempenho e eventual distintivo Premium podem ser visíveis.","As previsões podem tornar-se visíveis após o início do jogo. Email, nome, apelido e palavra-passe não são mostrados publicamente."]},
      {title:"4. Supabase e início de sessão",text:["O VoetIQ usa Supabase para autenticação e base de dados. Os dados necessários à conta podem ser tratados através deste serviço técnico.","O VoetIQ não guarda diretamente a tua palavra-passe como texto legível."]},
      {title:"5. Armazenamento do navegador",text:["O VoetIQ usa armazenamento do navegador para funções como idioma, preferências da interface e manutenção da sessão iniciada."]},
      {title:"6. Dados externos de futebol",text:["Podemos usar fontes externas para jogos, equipas, resultados e estados. Os dados pessoais da conta não são automaticamente partilhados com esses fornecedores.","Serviços externos podem ter as suas próprias políticas de privacidade."]},
      {title:"7. Conservação",text:["Os dados não são conservados por mais tempo do que o razoavelmente necessário para a finalidade, conta, segurança ou obrigações legais.","Histórico e classificações podem permanecer ligados à conta enquanto esta e as funções existirem."]},
      {title:"8. Segurança",text:["Tomamos medidas razoáveis para proteger contas e dados contra acesso não autorizado, perda e abuso.","Nenhum serviço online garante segurança absoluta. Mantém a tua palavra-passe confidencial."]},
      {title:"9. Os teus direitos",text:["Dependendo da lei aplicável, podes ter direitos de acesso, correção, eliminação, limitação e, em certos casos, portabilidade ou oposição.","Alguns dados não podem ser eliminados imediatamente quando a conservação é legalmente necessária."]},
      {title:"10. Premium e pagamentos",text:["Enquanto Premium aparecer como brevemente disponível, esta função não processa pagamentos Premium.","Quando existirem serviços pagos, a política será atualizada com informação sobre pagamentos, subscrições e fornecedores."]},
      {title:"11. Alterações",text:["Esta política pode ser atualizada quando o VoetIQ mudar, forem adicionadas funcionalidades ou a lei o exigir."]},
      {title:"12. Contacto",text:["Para questões ou pedidos de privacidade utiliza a opção de contacto disponibilizada pelo VoetIQ.","Antes do lançamento comercial deverão ser adicionados um endereço de contacto definitivo e as informações empresariais legalmente exigidas."]},
    ],
    terms:"Termos e condições", home:"Ir para o início",
  },
};

function validLanguage(value: string | null): value is LanguageCode {
  return !!value && ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value);
}

export default function PrivacyPage() {
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const t = copy[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("voetiq-language");
    if (validLanguage(saved)) setLanguage(saved);

    const handleLanguage = (event: Event) => {
      const custom = event as CustomEvent<{ language?: string }>;
      if (validLanguage(custom.detail?.language || null)) {
        setLanguage(custom.detail!.language as LanguageCode);
      }
    };

    window.addEventListener("voetiq-language-change", handleLanguage);
    return () => window.removeEventListener("voetiq-language-change", handleLanguage);
  }, []);

  return (
    <main className="legal-page">
      <div className="shell">
        <Link href="/" className="back">← {t.back}</Link>

        <header>
          <div className="kicker">🔒 {t.kicker}</div>
          <h1>{t.title}</h1>
          <p className="intro">{t.intro}</p>
          <div className="updated">{t.updated}: {t.date}</div>
        </header>

        <div className="content">
          {t.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.text.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
        </div>

        <footer>
          <Link href="/voorwaarden">{t.terms}</Link>
          <span>•</span>
          <Link href="/">{t.home}</Link>
        </footer>
      </div>

      <style jsx>{`
        .legal-page {
          min-height: 100vh;
          background: radial-gradient(circle at 50% 0%, rgba(46,230,129,.12), transparent 30%), #03130c;
          color: #f3fff8;
          padding: 54px 20px 70px;
        }
        .shell { width: 100%; max-width: 900px; margin: 0 auto; }
        .back { color: #83a894; text-decoration: none; font-size: 13px; font-weight: 800; }
        header { padding: 46px 0 30px; border-bottom: 1px solid rgba(46,230,129,.14); }
        .kicker {
          display: inline-flex; padding: 7px 11px; border-radius: 999px;
          border: 1px solid rgba(46,230,129,.22); background: rgba(46,230,129,.07);
          color: #59ec98; font-size: 11px; font-weight: 950; letter-spacing: .8px;
        }
        h1 { margin: 18px 0 12px; font-size: clamp(36px, 7vw, 62px); letter-spacing: -2.4px; line-height: 1.02; }
        .intro { max-width: 760px; color: #a1b7ab; line-height: 1.7; font-size: 15px; }
        .updated { margin-top: 18px; color: #6f8b7c; font-size: 12px; font-weight: 700; }
        .content { display: grid; gap: 14px; padding-top: 28px; }
        section {
          padding: 22px; border-radius: 16px; border: 1px solid rgba(46,230,129,.12);
          background: linear-gradient(145deg, rgba(7,30,19,.96), rgba(5,23,15,.96));
        }
        h2 { margin: 0 0 12px; font-size: 18px; color: #eafff1; }
        section p { margin: 8px 0 0; color: #9db2a7; font-size: 14px; line-height: 1.72; }
        footer {
          display: flex; justify-content: center; flex-wrap: wrap; gap: 10px;
          margin-top: 30px; color: #557064; font-size: 12px;
        }
        footer a { color: #61df98; text-decoration: none; font-weight: 800; }
        @media (max-width: 560px) {
          .legal-page { padding: 30px 14px 54px; }
          header { padding-top: 34px; }
          h1 { letter-spacing: -1.6px; }
          section { padding: 18px; }
        }
      `}</style>
    </main>
  );
}
