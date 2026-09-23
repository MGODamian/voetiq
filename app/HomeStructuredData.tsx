export default function HomeStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "VoetIQ",
    alternateName: "VoetIQ voetbal voorspellen",
    url: "https://voetiq.nl/",
    inLanguage: "nl-NL",
    description:
      "VoetIQ is een gratis voetbalplatform waar je voetbalwedstrijden voorspelt, punten verdient, ranglijsten beklimt, toernooien voorspelt en voetbalgames speelt.",
    publisher: {
      "@type": "Organization",
      name: "VoetIQ",
      url: "https://voetiq.nl/",
    },
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
