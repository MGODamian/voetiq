export default function HomeStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VoetIQ",
    url: "https://voetiq.nl/",
    inLanguage: "nl-NL",
    description:
      "VoetIQ is een gratis voetbalvoorspellingsgame waarin je voetbalwedstrijden voorspelt, punten verdient en met vrienden en andere voetbalfans speelt.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
