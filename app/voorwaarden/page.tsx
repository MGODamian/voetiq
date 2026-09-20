"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type Section = {
  title: string;
  text: string[];
};

type Copy = {
  back: string;
  kicker: string;
  title: string;
  intro: string;
  updated: string;
  updatedDate: string;
  sections: Section[];
  privacy: string;
  home: string;
};

const copy: Record<LanguageCode, Copy> = {
  nl: {
    back: "Terug naar VoetIQ",
    kicker: "VOETIQ • JURIDISCH",
    title: "Algemene voorwaarden",
    intro:
      "Deze voorwaarden gelden voor het gebruik van VoetIQ. Door een account aan te maken of VoetIQ te gebruiken, ga je akkoord met deze voorwaarden.",
    updated: "Laatst bijgewerkt",
    updatedDate: "20 september 2026",
    sections: [
      {
        title: "1. Over VoetIQ",
        text: [
          "VoetIQ is een voetbalvoorspellingsplatform waarop gebruikers uitslagen kunnen voorspellen, punten kunnen verdienen, ranglijsten kunnen bekijken en aan poules, challenges en achievements kunnen deelnemen.",
          "VoetIQ is bedoeld voor entertainment. Punten, ranks, achievements en posities binnen VoetIQ hebben geen geldwaarde en kunnen niet worden ingewisseld voor geld.",
        ],
      },
      {
        title: "2. Account",
        text: [
          "Voor bepaalde onderdelen van VoetIQ heb je een account nodig. Je bent verantwoordelijk voor het correct invullen van je gegevens en voor het veilig houden van je inloggegevens.",
          "Je mag geen account gebruiken om andere gebruikers te misleiden, te hinderen of de werking van VoetIQ te verstoren.",
        ],
      },
      {
        title: "3. Gebruikersnaam en gedrag",
        text: [
          "Je gebruikersnaam en andere openbare informatie mogen niet beledigend, discriminerend, misleidend of onrechtmatig zijn en mogen geen rechten van anderen schenden.",
          "Misbruik, manipulatie van scores of ranglijsten, geautomatiseerde aanvallen en pogingen om beveiliging te omzeilen zijn niet toegestaan.",
        ],
      },
      {
        title: "4. Voorspellingen en punten",
        text: [
          "Voorspellingen moeten worden opgeslagen binnen de mogelijkheden en deadlines die VoetIQ aanbiedt. De puntentelling wordt bepaald door de regels die op VoetIQ worden weergegeven.",
          "VoetIQ mag aantoonbare technische fouten in wedstrijdgegevens, uitslagen of puntentoekenning corrigeren wanneer dat nodig is om de werking van het platform te herstellen.",
        ],
      },
      {
        title: "5. Poules en openbare informatie",
        text: [
          "Gebruikers kunnen deelnemen aan poules. Afhankelijk van de functie kunnen je gebruikersnaam, punten, rank, achievements en voorspellingen van reeds begonnen wedstrijden zichtbaar zijn voor andere gebruikers.",
          "Deel uitnodigingscodes alleen met personen die je toegang tot een poule wilt geven.",
        ],
      },
      {
        title: "6. Premium",
        text: [
          "VoetIQ kan Premium-functies aanbieden. Premium geeft geen extra wedstrijdpunten en verandert je positie in de ranglijst niet op een pay-to-win-manier.",
          "Zolang Premium als 'binnenkort beschikbaar' wordt weergegeven, kan er via VoetIQ nog geen betaald Premium-abonnement worden afgesloten. Voor betaalde diensten kunnen later aanvullende voorwaarden gelden.",
        ],
      },
      {
        title: "7. Beschikbaarheid en wijzigingen",
        text: [
          "We proberen VoetIQ goed beschikbaar te houden, maar kunnen niet garanderen dat de dienst altijd zonder storingen, fouten of onderbrekingen werkt.",
          "Functies, competities, puntregels of onderdelen van VoetIQ kunnen worden aangepast wanneer dat nodig is. Belangrijke wijzigingen worden waar passend duidelijk gemaakt.",
        ],
      },
      {
        title: "8. Externe gegevens",
        text: [
          "VoetIQ kan wedstrijdinformatie en andere gegevens van externe databronnen gebruiken. Daardoor kunnen gegevens vertraagd, tijdelijk niet beschikbaar of onjuist zijn.",
          "VoetIQ is niet verantwoordelijk voor storingen of fouten die uitsluitend afkomstig zijn van externe diensten buiten onze controle.",
        ],
      },
      {
        title: "9. Aansprakelijkheid",
        text: [
          "VoetIQ wordt aangeboden als entertainmentdienst. Voor zover wettelijk toegestaan zijn we niet aansprakelijk voor indirecte schade die ontstaat door het gebruik of tijdelijk niet beschikbaar zijn van VoetIQ.",
          "Niets in deze voorwaarden beperkt rechten die je volgens dwingend toepasselijk consumentenrecht hebt.",
        ],
      },
      {
        title: "10. Accountmaatregelen",
        text: [
          "Bij fraude, misbruik, beveiligingsaanvallen of ernstige overtreding van deze voorwaarden kan toegang tot VoetIQ worden beperkt of een account worden geschorst.",
          "Waar redelijk houden we rekening met de aard en ernst van de overtreding.",
        ],
      },
      {
        title: "11. Privacy",
        text: [
          "Voor informatie over de verwerking van persoonsgegevens geldt het Privacybeleid van VoetIQ. Dat beleid vormt een afzonderlijke uitleg over privacy en gegevensgebruik.",
        ],
      },
      {
        title: "12. Wijzigingen in deze voorwaarden",
        text: [
          "Deze voorwaarden kunnen worden aangepast wanneer VoetIQ verandert of wanneer dat juridisch noodzakelijk is. De datum bovenaan deze pagina laat zien wanneer de voorwaarden voor het laatst zijn bijgewerkt.",
        ],
      },
    ],
    privacy: "Privacybeleid",
    home: "Naar homepage",
  },

  en: {
    back: "Back to VoetIQ",
    kicker: "VOETIQ • LEGAL",
    title: "Terms and Conditions",
    intro:
      "These terms apply to your use of VoetIQ. By creating an account or using VoetIQ, you agree to these terms.",
    updated: "Last updated",
    updatedDate: "20 September 2026",
    sections: [
      { title: "1. About VoetIQ", text: ["VoetIQ is a football prediction platform where users can predict results, earn points, view leaderboards and participate in pools, challenges and achievements.", "VoetIQ is intended for entertainment. Points, ranks, achievements and positions within VoetIQ have no monetary value and cannot be exchanged for money."] },
      { title: "2. Account", text: ["Some parts of VoetIQ require an account. You are responsible for providing correct information and keeping your login details secure.", "You may not use an account to mislead or harass other users or disrupt the operation of VoetIQ."] },
      { title: "3. Username and conduct", text: ["Your username and other public information must not be offensive, discriminatory, misleading or unlawful and must not infringe the rights of others.", "Abuse, manipulation of scores or leaderboards, automated attacks and attempts to bypass security are not permitted."] },
      { title: "4. Predictions and points", text: ["Predictions must be saved within the options and deadlines offered by VoetIQ. Scoring is determined by the rules displayed on VoetIQ.", "VoetIQ may correct demonstrable technical errors in match data, results or awarded points when necessary to restore proper operation."] },
      { title: "5. Pools and public information", text: ["Users can join pools. Depending on the feature, your username, points, rank, achievements and predictions for matches that have already started may be visible to other users.", "Only share invitation codes with people you want to give access to a pool."] },
      { title: "6. Premium", text: ["VoetIQ may offer Premium features. Premium does not provide extra match points and does not alter leaderboard positions in a pay-to-win manner.", "While Premium is shown as 'coming soon', no paid Premium subscription can be purchased through VoetIQ. Additional terms may apply to paid services in the future."] },
      { title: "7. Availability and changes", text: ["We aim to keep VoetIQ available, but cannot guarantee that the service will always operate without outages, errors or interruptions.", "Features, competitions, scoring rules or parts of VoetIQ may be changed when necessary. Important changes will be communicated where appropriate."] },
      { title: "8. External data", text: ["VoetIQ may use match information and other data from external data providers. Information may therefore be delayed, temporarily unavailable or incorrect.", "VoetIQ is not responsible for failures or errors caused solely by external services outside our control."] },
      { title: "9. Liability", text: ["VoetIQ is provided as an entertainment service. To the extent permitted by law, we are not liable for indirect loss arising from the use or temporary unavailability of VoetIQ.", "Nothing in these terms limits rights you have under mandatory applicable consumer law."] },
      { title: "10. Account measures", text: ["In cases of fraud, abuse, security attacks or serious breaches of these terms, access to VoetIQ may be restricted or an account suspended.", "Where reasonable, we take the nature and seriousness of the violation into account."] },
      { title: "11. Privacy", text: ["Information about the processing of personal data is provided in VoetIQ's Privacy Policy. That policy separately explains privacy and data use."] },
      { title: "12. Changes to these terms", text: ["These terms may be updated when VoetIQ changes or when legally necessary. The date at the top of this page shows when the terms were last updated."] },
    ],
    privacy: "Privacy Policy",
    home: "Go to homepage",
  },

  de: {
    back: "Zurück zu VoetIQ", kicker: "VOETIQ • RECHTLICH", title: "Allgemeine Geschäftsbedingungen",
    intro: "Diese Bedingungen gelten für die Nutzung von VoetIQ. Mit der Erstellung eines Kontos oder der Nutzung von VoetIQ stimmst du diesen Bedingungen zu.",
    updated: "Zuletzt aktualisiert", updatedDate: "20. September 2026",
    sections: [
      { title:"1. Über VoetIQ", text:["VoetIQ ist eine Fußball-Tippplattform, auf der Nutzer Ergebnisse vorhersagen, Punkte sammeln, Ranglisten ansehen und an Tipprunden, Challenges und Achievements teilnehmen können.","VoetIQ dient der Unterhaltung. Punkte, Ränge, Achievements und Platzierungen haben keinen Geldwert und können nicht gegen Geld eingetauscht werden."]},
      { title:"2. Konto", text:["Für bestimmte Bereiche ist ein Konto erforderlich. Du bist für korrekte Angaben und die Sicherheit deiner Anmeldedaten verantwortlich.","Ein Konto darf nicht dazu verwendet werden, andere Nutzer zu täuschen oder zu belästigen oder den Betrieb von VoetIQ zu stören."]},
      { title:"3. Benutzername und Verhalten", text:["Öffentliche Angaben dürfen nicht beleidigend, diskriminierend, irreführend oder rechtswidrig sein und keine Rechte Dritter verletzen.","Missbrauch, Manipulation von Punkten oder Ranglisten, automatisierte Angriffe und Versuche, Sicherheitsmaßnahmen zu umgehen, sind nicht erlaubt."]},
      { title:"4. Tipps und Punkte", text:["Tipps müssen innerhalb der von VoetIQ angebotenen Möglichkeiten und Fristen gespeichert werden. Die Punktevergabe richtet sich nach den auf VoetIQ angezeigten Regeln.","Nachweisbare technische Fehler bei Spieldaten, Ergebnissen oder Punkten dürfen korrigiert werden."]},
      { title:"5. Tipprunden und öffentliche Informationen", text:["Je nach Funktion können Benutzername, Punkte, Rang, Achievements und Tipps zu bereits begonnenen Spielen für andere Nutzer sichtbar sein.","Teile Einladungscodes nur mit Personen, denen du Zugang geben möchtest."]},
      { title:"6. Premium", text:["Premium gibt keine zusätzlichen Spielpunkte und verändert Ranglisten nicht nach einem Pay-to-win-Prinzip.","Solange Premium als demnächst verfügbar angezeigt wird, kann über VoetIQ noch kein kostenpflichtiges Premium-Abonnement abgeschlossen werden."]},
      { title:"7. Verfügbarkeit und Änderungen", text:["Wir bemühen uns um eine zuverlässige Verfügbarkeit, können einen jederzeit fehlerfreien Betrieb jedoch nicht garantieren.","Funktionen, Wettbewerbe, Punkteregeln oder andere Bereiche können bei Bedarf angepasst werden."]},
      { title:"8. Externe Daten", text:["VoetIQ kann Daten externer Anbieter verwenden. Informationen können deshalb verspätet, vorübergehend nicht verfügbar oder fehlerhaft sein.","Für Fehler, die ausschließlich durch externe Dienste außerhalb unserer Kontrolle verursacht werden, übernehmen wir keine Verantwortung."]},
      { title:"9. Haftung", text:["VoetIQ ist ein Unterhaltungsdienst. Soweit gesetzlich zulässig, haften wir nicht für indirekte Schäden durch Nutzung oder vorübergehende Nichtverfügbarkeit.","Zwingende Verbraucherrechte bleiben unberührt."]},
      { title:"10. Kontomaßnahmen", text:["Bei Betrug, Missbrauch, Sicherheitsangriffen oder schweren Verstößen kann der Zugang eingeschränkt oder ein Konto gesperrt werden.","Soweit angemessen berücksichtigen wir Art und Schwere des Verstoßes."]},
      { title:"11. Datenschutz", text:["Informationen zur Verarbeitung personenbezogener Daten findest du in der Datenschutzerklärung von VoetIQ."]},
      { title:"12. Änderungen", text:["Diese Bedingungen können bei Änderungen an VoetIQ oder aus rechtlichen Gründen aktualisiert werden. Das Datum oben zeigt die letzte Aktualisierung."]},
    ], privacy:"Datenschutzerklärung", home:"Zur Startseite"
  },

  es: {
    back:"Volver a VoetIQ", kicker:"VOETIQ • LEGAL", title:"Términos y condiciones",
    intro:"Estas condiciones se aplican al uso de VoetIQ. Al crear una cuenta o utilizar VoetIQ, aceptas estas condiciones.",
    updated:"Última actualización", updatedDate:"20 de septiembre de 2026",
    sections:[
      {title:"1. Sobre VoetIQ",text:["VoetIQ es una plataforma de pronósticos de fútbol donde los usuarios pueden predecir resultados, ganar puntos, consultar clasificaciones y participar en grupos, retos y logros.","VoetIQ está destinado al entretenimiento. Los puntos, rangos, logros y posiciones no tienen valor monetario."]},
      {title:"2. Cuenta",text:["Algunas funciones requieren una cuenta. Eres responsable de proporcionar datos correctos y mantener seguras tus credenciales.","No puedes utilizar una cuenta para engañar o molestar a otros usuarios ni para alterar el funcionamiento de VoetIQ."]},
      {title:"3. Nombre de usuario y conducta",text:["La información pública no puede ser ofensiva, discriminatoria, engañosa o ilegal ni vulnerar derechos de terceros.","No se permite manipular puntuaciones o clasificaciones, realizar ataques automatizados ni eludir la seguridad."]},
      {title:"4. Pronósticos y puntos",text:["Los pronósticos deben guardarse dentro de los plazos y opciones ofrecidos. La puntuación se determina según las reglas mostradas en VoetIQ.","VoetIQ puede corregir errores técnicos demostrables en datos, resultados o puntos."]},
      {title:"5. Grupos e información pública",text:["Según la función, tu nombre de usuario, puntos, rango, logros y pronósticos de partidos ya iniciados pueden ser visibles para otros usuarios.","Comparte los códigos de invitación solo con personas a las que quieras dar acceso."]},
      {title:"6. Premium",text:["Premium no concede puntos de partido adicionales ni modifica la clasificación mediante un sistema pay-to-win.","Mientras Premium figure como próximamente, todavía no se puede contratar una suscripción Premium de pago a través de VoetIQ."]},
      {title:"7. Disponibilidad y cambios",text:["Intentamos mantener VoetIQ disponible, pero no podemos garantizar un servicio siempre libre de errores o interrupciones.","Las funciones, competiciones o reglas de puntuación pueden modificarse cuando sea necesario."]},
      {title:"8. Datos externos",text:["VoetIQ puede utilizar proveedores externos de datos, por lo que cierta información puede retrasarse, no estar disponible temporalmente o ser incorrecta.","No somos responsables de errores causados exclusivamente por servicios externos fuera de nuestro control."]},
      {title:"9. Responsabilidad",text:["VoetIQ se ofrece como servicio de entretenimiento. En la medida permitida por la ley, no respondemos por daños indirectos derivados de su uso o indisponibilidad temporal.","Nada limita los derechos obligatorios que te correspondan como consumidor."]},
      {title:"10. Medidas sobre cuentas",text:["En caso de fraude, abuso, ataques de seguridad o infracciones graves, el acceso puede restringirse o la cuenta suspenderse.","Cuando sea razonable, tendremos en cuenta la naturaleza y gravedad de la infracción."]},
      {title:"11. Privacidad",text:["El tratamiento de datos personales se explica por separado en la Política de privacidad de VoetIQ."]},
      {title:"12. Cambios en estas condiciones",text:["Estas condiciones pueden actualizarse cuando cambie VoetIQ o cuando sea legalmente necesario. La fecha superior indica la última actualización."]},
    ], privacy:"Política de privacidad", home:"Ir al inicio"
  },

  fr: {
    back:"Retour à VoetIQ", kicker:"VOETIQ • JURIDIQUE", title:"Conditions générales",
    intro:"Ces conditions s'appliquent à l'utilisation de VoetIQ. En créant un compte ou en utilisant VoetIQ, tu acceptes ces conditions.",
    updated:"Dernière mise à jour", updatedDate:"20 septembre 2026",
    sections:[
      {title:"1. À propos de VoetIQ",text:["VoetIQ est une plateforme de pronostics de football permettant de prédire des résultats, gagner des points, consulter des classements et participer à des ligues, challenges et achievements.","VoetIQ est destiné au divertissement. Les points, rangs, achievements et positions n'ont aucune valeur monétaire."]},
      {title:"2. Compte",text:["Certaines fonctions nécessitent un compte. Tu es responsable de l'exactitude de tes informations et de la sécurité de tes identifiants.","Un compte ne peut pas être utilisé pour tromper ou harceler d'autres utilisateurs ni perturber VoetIQ."]},
      {title:"3. Nom d'utilisateur et comportement",text:["Les informations publiques ne doivent pas être offensantes, discriminatoires, trompeuses ou illégales ni porter atteinte aux droits d'autrui.","La manipulation des scores ou classements, les attaques automatisées et le contournement de la sécurité sont interdits."]},
      {title:"4. Pronostics et points",text:["Les pronostics doivent être enregistrés dans les délais et selon les possibilités proposées. Les points suivent les règles affichées sur VoetIQ.","VoetIQ peut corriger les erreurs techniques démontrables concernant les données, résultats ou points."]},
      {title:"5. Ligues et informations publiques",text:["Selon la fonction, ton nom d'utilisateur, tes points, ton rang, tes achievements et tes pronostics pour des matchs déjà commencés peuvent être visibles par d'autres utilisateurs.","Ne partage les codes d'invitation qu'avec les personnes auxquelles tu souhaites donner accès."]},
      {title:"6. Premium",text:["Premium n'accorde aucun point de match supplémentaire et ne modifie pas le classement selon un principe pay-to-win.","Tant que Premium est indiqué comme bientôt disponible, aucun abonnement Premium payant ne peut être souscrit via VoetIQ."]},
      {title:"7. Disponibilité et modifications",text:["Nous cherchons à maintenir VoetIQ disponible, sans pouvoir garantir un fonctionnement permanent sans erreur ni interruption.","Les fonctions, compétitions ou règles de points peuvent être modifiées si nécessaire."]},
      {title:"8. Données externes",text:["VoetIQ peut utiliser des fournisseurs de données externes. Certaines informations peuvent donc être retardées, indisponibles ou incorrectes.","Nous ne sommes pas responsables des erreurs provenant exclusivement de services externes hors de notre contrôle."]},
      {title:"9. Responsabilité",text:["VoetIQ est fourni comme service de divertissement. Dans les limites autorisées par la loi, nous ne sommes pas responsables des dommages indirects liés à son utilisation ou à son indisponibilité temporaire.","Les droits impératifs des consommateurs restent applicables."]},
      {title:"10. Mesures concernant les comptes",text:["En cas de fraude, abus, attaque de sécurité ou violation grave, l'accès peut être limité ou un compte suspendu.","Lorsque cela est raisonnable, la nature et la gravité de la violation sont prises en compte."]},
      {title:"11. Vie privée",text:["Le traitement des données personnelles est expliqué séparément dans la Politique de confidentialité de VoetIQ."]},
      {title:"12. Modification des conditions",text:["Ces conditions peuvent être mises à jour lorsque VoetIQ évolue ou lorsque la loi l'exige. La date ci-dessus indique la dernière mise à jour."]},
    ], privacy:"Politique de confidentialité", home:"Accueil"
  },

  it: {
    back:"Torna a VoetIQ", kicker:"VOETIQ • LEGALE", title:"Termini e condizioni",
    intro:"Questi termini si applicano all'utilizzo di VoetIQ. Creando un account o utilizzando VoetIQ, accetti questi termini.",
    updated:"Ultimo aggiornamento", updatedDate:"20 settembre 2026",
    sections:[
      {title:"1. Informazioni su VoetIQ",text:["VoetIQ è una piattaforma di pronostici calcistici in cui gli utenti possono prevedere risultati, guadagnare punti, consultare classifiche e partecipare a gruppi, sfide e achievement.","VoetIQ è destinato all'intrattenimento. Punti, rank, achievement e posizioni non hanno valore monetario."]},
      {title:"2. Account",text:["Alcune funzioni richiedono un account. Sei responsabile della correttezza dei dati e della sicurezza delle credenziali.","Non puoi usare un account per ingannare o molestare altri utenti o interferire con il funzionamento di VoetIQ."]},
      {title:"3. Nome utente e comportamento",text:["Le informazioni pubbliche non devono essere offensive, discriminatorie, ingannevoli o illegali né violare diritti altrui.","Sono vietati manipolazione di punteggi o classifiche, attacchi automatizzati e tentativi di aggirare la sicurezza."]},
      {title:"4. Pronostici e punti",text:["I pronostici devono essere salvati entro i termini e secondo le opzioni offerte. Il punteggio segue le regole mostrate su VoetIQ.","VoetIQ può correggere errori tecnici dimostrabili nei dati, risultati o punti."]},
      {title:"5. Gruppi e informazioni pubbliche",text:["A seconda della funzione, nome utente, punti, rank, achievement e pronostici di partite già iniziate possono essere visibili ad altri utenti.","Condividi i codici di invito solo con le persone a cui vuoi dare accesso."]},
      {title:"6. Premium",text:["Premium non assegna punti partita extra e non modifica le classifiche secondo un sistema pay-to-win.","Finché Premium è indicato come prossimamente disponibile, non è possibile acquistare un abbonamento Premium a pagamento tramite VoetIQ."]},
      {title:"7. Disponibilità e modifiche",text:["Cerchiamo di mantenere VoetIQ disponibile, ma non possiamo garantire un servizio sempre privo di errori o interruzioni.","Funzioni, competizioni o regole di punteggio possono essere modificate quando necessario."]},
      {title:"8. Dati esterni",text:["VoetIQ può utilizzare fornitori esterni di dati. Le informazioni possono quindi essere ritardate, temporaneamente indisponibili o errate.","Non siamo responsabili di errori causati esclusivamente da servizi esterni fuori dal nostro controllo."]},
      {title:"9. Responsabilità",text:["VoetIQ è un servizio di intrattenimento. Nei limiti consentiti dalla legge, non siamo responsabili per danni indiretti derivanti dall'uso o dalla temporanea indisponibilità.","Restano invariati i diritti inderogabili dei consumatori."]},
      {title:"10. Misure sull'account",text:["In caso di frode, abuso, attacchi alla sicurezza o gravi violazioni, l'accesso può essere limitato o l'account sospeso.","Quando ragionevole, consideriamo natura e gravità della violazione."]},
      {title:"11. Privacy",text:["Il trattamento dei dati personali è spiegato separatamente nella Politica sulla privacy di VoetIQ."]},
      {title:"12. Modifiche ai termini",text:["Questi termini possono essere aggiornati quando VoetIQ cambia o quando richiesto dalla legge. La data sopra indica l'ultimo aggiornamento."]},
    ], privacy:"Politica sulla privacy", home:"Vai alla home"
  },

  pt: {
    back:"Voltar ao VoetIQ", kicker:"VOETIQ • LEGAL", title:"Termos e condições",
    intro:"Estes termos aplicam-se à utilização do VoetIQ. Ao criares uma conta ou utilizares o VoetIQ, aceitas estes termos.",
    updated:"Última atualização", updatedDate:"20 de setembro de 2026",
    sections:[
      {title:"1. Sobre o VoetIQ",text:["O VoetIQ é uma plataforma de previsões de futebol onde os utilizadores podem prever resultados, ganhar pontos, consultar classificações e participar em grupos, desafios e achievements.","O VoetIQ destina-se a entretenimento. Pontos, ranks, achievements e posições não têm valor monetário."]},
      {title:"2. Conta",text:["Algumas funcionalidades exigem uma conta. És responsável pela correção dos teus dados e pela segurança das credenciais.","Não podes usar uma conta para enganar ou incomodar outros utilizadores nem perturbar o funcionamento do VoetIQ."]},
      {title:"3. Nome de utilizador e comportamento",text:["As informações públicas não podem ser ofensivas, discriminatórias, enganosas ou ilegais nem violar direitos de terceiros.","Não são permitidos manipulação de pontuações ou classificações, ataques automatizados ou tentativas de contornar a segurança."]},
      {title:"4. Previsões e pontos",text:["As previsões devem ser guardadas dentro dos prazos e opções oferecidos. A pontuação segue as regras apresentadas no VoetIQ.","O VoetIQ pode corrigir erros técnicos demonstráveis em dados, resultados ou pontos."]},
      {title:"5. Grupos e informação pública",text:["Dependendo da funcionalidade, o teu nome de utilizador, pontos, rank, achievements e previsões de jogos já iniciados podem ser visíveis a outros utilizadores.","Partilha códigos de convite apenas com pessoas a quem queres dar acesso."]},
      {title:"6. Premium",text:["Premium não concede pontos de jogo extra nem altera classificações segundo um modelo pay-to-win.","Enquanto Premium aparecer como brevemente disponível, ainda não é possível adquirir uma subscrição Premium paga através do VoetIQ."]},
      {title:"7. Disponibilidade e alterações",text:["Tentamos manter o VoetIQ disponível, mas não podemos garantir um serviço sempre sem erros ou interrupções.","Funcionalidades, competições ou regras de pontuação podem ser alteradas quando necessário."]},
      {title:"8. Dados externos",text:["O VoetIQ pode utilizar fornecedores externos de dados. As informações podem, por isso, sofrer atrasos, ficar temporariamente indisponíveis ou estar incorretas.","Não somos responsáveis por erros causados exclusivamente por serviços externos fora do nosso controlo."]},
      {title:"9. Responsabilidade",text:["O VoetIQ é disponibilizado como serviço de entretenimento. Na medida permitida por lei, não somos responsáveis por danos indiretos decorrentes da utilização ou indisponibilidade temporária.","Os direitos obrigatórios dos consumidores permanecem aplicáveis."]},
      {title:"10. Medidas sobre contas",text:["Em caso de fraude, abuso, ataques de segurança ou violações graves, o acesso pode ser limitado ou uma conta suspensa.","Quando razoável, consideramos a natureza e gravidade da violação."]},
      {title:"11. Privacidade",text:["O tratamento de dados pessoais é explicado separadamente na Política de privacidade do VoetIQ."]},
      {title:"12. Alterações aos termos",text:["Estes termos podem ser atualizados quando o VoetIQ mudar ou quando for legalmente necessário. A data acima mostra a última atualização."]},
    ], privacy:"Política de privacidade", home:"Ir para o início"
  },
};

function isLanguageCode(value: string | null): value is LanguageCode {
  return !!value && ["nl", "en", "de", "es", "fr", "it", "pt"].includes(value);
}

export default function VoorwaardenPage() {
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const t = copy[language];

  useEffect(() => {
    const saved = window.localStorage.getItem("voetiq-language");
    if (isLanguageCode(saved)) setLanguage(saved);

    const onLanguage = (event: Event) => {
      const custom = event as CustomEvent<{ language?: string }>;
      if (isLanguageCode(custom.detail?.language || null)) {
        setLanguage(custom.detail!.language as LanguageCode);
      }
    };

    window.addEventListener("voetiq-language-change", onLanguage);
    return () => window.removeEventListener("voetiq-language-change", onLanguage);
  }, []);

  return (
    <main className="legal-page">
      <div className="shell">
        <Link href="/" className="back">← {t.back}</Link>

        <header>
          <div className="kicker">⚽ {t.kicker}</div>
          <h1>{t.title}</h1>
          <p className="intro">{t.intro}</p>
          <div className="updated">{t.updated}: {t.updatedDate}</div>
        </header>

        <div className="content">
          {t.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>

        <footer>
          <Link href="/privacy">{t.privacy}</Link>
          <span>•</span>
          <Link href="/">{t.home}</Link>
        </footer>
      </div>

      <style jsx>{`
        .legal-page {
          min-height: 100vh;
          background:
            radial-gradient(circle at 50% 0%, rgba(46,230,129,.12), transparent 30%),
            #03130c;
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
