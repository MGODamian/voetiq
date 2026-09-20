"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../../Navbar";
import { supabase } from "@/lib/supabase";

type Pool = {
  id: string;
  name: string;
  competition_code: string;
  invite_code: string;
  owner_id: string;
  description: string | null;
  pool_theme: "default" | "emerald" | "gold" | "midnight" | "champions";
};

const competitions: Record<string, string> = {
  DED: "🇳🇱 Eredivisie",
  PL: "🏴 Premier League",
  PD: "🇪🇸 La Liga",
  BL1: "🇩🇪 Bundesliga",
  SA: "🇮🇹 Serie A",
  FL1: "🇫🇷 Ligue 1",
  PPL: "🇵🇹 Primeira Liga",
  CL: "🏆 Champions League",
};

export default function PoolManagePage() {
  const router = useRouter();

  type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";
  const [language, setLanguage] = useState<LanguageCode>("nl");

  const translations: Record<LanguageCode, any> = {
    nl: {
      back: "← Terug naar poule", loading: "Poulebeheer laden...", manage: "POULEBEHEER",
      nameTitle: "Poulenaam wijzigen", nameHelp: "Kies een naam van 2 tot 40 tekens.",
      nameVisible: "De nieuwe naam is direct zichtbaar.", saving: "Opslaan...", saveName: "Naam opslaan",
      descTitle: "👑 Poulebeschrijving", descPremium: "Voeg een persoonlijke beschrijving van maximaal 200 tekens toe aan je poule.",
      descLocked: "Met VoetIQ Premium kun je een persoonlijke beschrijving aan je poule toevoegen.",
      descPlaceholder: "Bijvoorbeeld: Ajax-familiepoule 2026/27 – succes allemaal!",
      descVisible: "Deze tekst is zichtbaar op je poulepagina.", descSaving: "Beschrijving opslaan...",
      descSave: "👑 Beschrijving opslaan", unlock: "👑 Ontgrendel met VoetIQ Premium",
      themeTitle: "👑 Poulethema", themePremium: "Kies een eigen stijl voor de bovenkant van je poulepagina.",
      themeLocked: "Met VoetIQ Premium kun je je poule een eigen thema geven.", active: "✓ ACTIEF",
      inviteTitle: "Uitnodigingscode", inviteHelp: "Vernieuw de code als je niet meer wilt dat de oude uitnodigingslink gebruikt kan worden.",
      currentCode: "HUIDIGE CODE", codeSaving: "Nieuwe code maken...", codeRenew: "🔄 Uitnodigingscode vernieuwen",
      deleteTitle: "🗑️ Poule verwijderen", deleteHelp: "Verwijder deze poule permanent. De poule verdwijnt voor alle deelnemers en deze actie kan niet ongedaan worden gemaakt.",
      deleting: "Poule verwijderen...", delete: "🗑️ Poule verwijderen"
    },
    en: {
      back: "← Back to pool", loading: "Loading pool management...", manage: "POOL MANAGEMENT",
      nameTitle: "Change pool name", nameHelp: "Choose a name between 2 and 40 characters.",
      nameVisible: "The new name will be visible immediately.", saving: "Saving...", saveName: "Save name",
      descTitle: "👑 Pool description", descPremium: "Add a personal description of up to 200 characters to your pool.",
      descLocked: "With VoetIQ Premium you can add a personal description to your pool.",
      descPlaceholder: "For example: Ajax family pool 2026/27 – good luck everyone!",
      descVisible: "This text will be visible on your pool page.", descSaving: "Saving description...",
      descSave: "👑 Save description", unlock: "👑 Unlock with VoetIQ Premium",
      themeTitle: "👑 Pool theme", themePremium: "Choose your own style for the top of your pool page.",
      themeLocked: "With VoetIQ Premium you can give your pool its own theme.", active: "✓ ACTIVE",
      inviteTitle: "Invitation code", inviteHelp: "Renew the code if you no longer want the old invitation link to work.",
      currentCode: "CURRENT CODE", codeSaving: "Creating new code...", codeRenew: "🔄 Renew invitation code",
      deleteTitle: "🗑️ Delete pool", deleteHelp: "Permanently delete this pool. It will disappear for all participants and this action cannot be undone.",
      deleting: "Deleting pool...", delete: "🗑️ Delete pool"
    },
    de: {
      back: "← Zurück zum Tippspiel", loading: "Tippspielverwaltung wird geladen...", manage: "TIPPSPIELVERWALTUNG",
      nameTitle: "Tippspielname ändern", nameHelp: "Wähle einen Namen mit 2 bis 40 Zeichen.",
      nameVisible: "Der neue Name ist sofort sichtbar.", saving: "Speichern...", saveName: "Namen speichern",
      descTitle: "👑 Beschreibung", descPremium: "Füge deinem Tippspiel eine persönliche Beschreibung mit bis zu 200 Zeichen hinzu.",
      descLocked: "Mit VoetIQ Premium kannst du deinem Tippspiel eine persönliche Beschreibung hinzufügen.",
      descPlaceholder: "Zum Beispiel: Ajax-Familientippspiel 2026/27 – viel Erfolg!",
      descVisible: "Dieser Text wird auf deiner Tippspielseite angezeigt.", descSaving: "Beschreibung speichern...",
      descSave: "👑 Beschreibung speichern", unlock: "👑 Mit VoetIQ Premium freischalten",
      themeTitle: "👑 Tippspiel-Theme", themePremium: "Wähle einen eigenen Stil für den oberen Bereich deiner Tippspielseite.",
      themeLocked: "Mit VoetIQ Premium kannst du deinem Tippspiel ein eigenes Theme geben.", active: "✓ AKTIV",
      inviteTitle: "Einladungscode", inviteHelp: "Erneuere den Code, wenn der alte Einladungslink nicht mehr funktionieren soll.",
      currentCode: "AKTUELLER CODE", codeSaving: "Neuen Code erstellen...", codeRenew: "🔄 Einladungscode erneuern",
      deleteTitle: "🗑️ Tippspiel löschen", deleteHelp: "Lösche dieses Tippspiel dauerhaft. Es verschwindet für alle Teilnehmer und kann nicht wiederhergestellt werden.",
      deleting: "Tippspiel löschen...", delete: "🗑️ Tippspiel löschen"
    },
    es: {
      back: "← Volver a la porra", loading: "Cargando gestión de la porra...", manage: "GESTIÓN DE LA PORRA",
      nameTitle: "Cambiar nombre de la porra", nameHelp: "Elige un nombre de entre 2 y 40 caracteres.",
      nameVisible: "El nuevo nombre será visible inmediatamente.", saving: "Guardando...", saveName: "Guardar nombre",
      descTitle: "👑 Descripción de la porra", descPremium: "Añade una descripción personal de hasta 200 caracteres a tu porra.",
      descLocked: "Con VoetIQ Premium puedes añadir una descripción personal a tu porra.",
      descPlaceholder: "Por ejemplo: Porra familiar Ajax 2026/27 – ¡mucha suerte!",
      descVisible: "Este texto aparecerá en la página de tu porra.", descSaving: "Guardando descripción...",
      descSave: "👑 Guardar descripción", unlock: "👑 Desbloquear con VoetIQ Premium",
      themeTitle: "👑 Tema de la porra", themePremium: "Elige un estilo propio para la parte superior de tu página.",
      themeLocked: "Con VoetIQ Premium puedes darle a tu porra su propio tema.", active: "✓ ACTIVO",
      inviteTitle: "Código de invitación", inviteHelp: "Renueva el código si ya no quieres que funcione el enlace de invitación anterior.",
      currentCode: "CÓDIGO ACTUAL", codeSaving: "Creando nuevo código...", codeRenew: "🔄 Renovar código de invitación",
      deleteTitle: "🗑️ Eliminar porra", deleteHelp: "Elimina esta porra permanentemente. Desaparecerá para todos los participantes y no se puede deshacer.",
      deleting: "Eliminando porra...", delete: "🗑️ Eliminar porra"
    },
    fr: {
      back: "← Retour au groupe", loading: "Chargement de la gestion du groupe...", manage: "GESTION DU GROUPE",
      nameTitle: "Modifier le nom du groupe", nameHelp: "Choisissez un nom de 2 à 40 caractères.",
      nameVisible: "Le nouveau nom sera visible immédiatement.", saving: "Enregistrement...", saveName: "Enregistrer le nom",
      descTitle: "👑 Description du groupe", descPremium: "Ajoutez une description personnelle de 200 caractères maximum à votre groupe.",
      descLocked: "Avec VoetIQ Premium, vous pouvez ajouter une description personnelle à votre groupe.",
      descPlaceholder: "Par exemple : Groupe familial Ajax 2026/27 – bonne chance à tous !",
      descVisible: "Ce texte sera visible sur la page de votre groupe.", descSaving: "Enregistrement de la description...",
      descSave: "👑 Enregistrer la description", unlock: "👑 Débloquer avec VoetIQ Premium",
      themeTitle: "👑 Thème du groupe", themePremium: "Choisissez un style personnalisé pour le haut de la page de votre groupe.",
      themeLocked: "Avec VoetIQ Premium, vous pouvez donner un thème personnalisé à votre groupe.", active: "✓ ACTIF",
      inviteTitle: "Code d’invitation", inviteHelp: "Renouvelez le code si vous ne voulez plus que l’ancien lien d’invitation fonctionne.",
      currentCode: "CODE ACTUEL", codeSaving: "Création du nouveau code...", codeRenew: "🔄 Renouveler le code d’invitation",
      deleteTitle: "🗑️ Supprimer le groupe", deleteHelp: "Supprimez définitivement ce groupe. Il disparaîtra pour tous les participants et cette action est irréversible.",
      deleting: "Suppression du groupe...", delete: "🗑️ Supprimer le groupe"
    },
    it: {
      back: "← Torna al gruppo", loading: "Caricamento gestione gruppo...", manage: "GESTIONE GRUPPO",
      nameTitle: "Modifica nome del gruppo", nameHelp: "Scegli un nome da 2 a 40 caratteri.",
      nameVisible: "Il nuovo nome sarà visibile immediatamente.", saving: "Salvataggio...", saveName: "Salva nome",
      descTitle: "👑 Descrizione del gruppo", descPremium: "Aggiungi al gruppo una descrizione personale di massimo 200 caratteri.",
      descLocked: "Con VoetIQ Premium puoi aggiungere una descrizione personale al tuo gruppo.",
      descPlaceholder: "Ad esempio: Gruppo famiglia Ajax 2026/27 – buona fortuna a tutti!",
      descVisible: "Questo testo sarà visibile nella pagina del gruppo.", descSaving: "Salvataggio descrizione...",
      descSave: "👑 Salva descrizione", unlock: "👑 Sblocca con VoetIQ Premium",
      themeTitle: "👑 Tema del gruppo", themePremium: "Scegli uno stile personalizzato per la parte superiore della pagina del gruppo.",
      themeLocked: "Con VoetIQ Premium puoi dare al tuo gruppo un tema personalizzato.", active: "✓ ATTIVO",
      inviteTitle: "Codice di invito", inviteHelp: "Rinnova il codice se non vuoi più che il vecchio link di invito funzioni.",
      currentCode: "CODICE ATTUALE", codeSaving: "Creazione nuovo codice...", codeRenew: "🔄 Rinnova codice di invito",
      deleteTitle: "🗑️ Elimina gruppo", deleteHelp: "Elimina definitivamente questo gruppo. Scomparirà per tutti i partecipanti e l’azione non può essere annullata.",
      deleting: "Eliminazione gruppo...", delete: "🗑️ Elimina gruppo"
    },
    pt: {
      back: "← Voltar ao grupo", loading: "A carregar gestão do grupo...", manage: "GESTÃO DO GRUPO",
      nameTitle: "Alterar nome do grupo", nameHelp: "Escolhe um nome entre 2 e 40 caracteres.",
      nameVisible: "O novo nome ficará visível imediatamente.", saving: "A guardar...", saveName: "Guardar nome",
      descTitle: "👑 Descrição do grupo", descPremium: "Adiciona uma descrição pessoal de até 200 caracteres ao teu grupo.",
      descLocked: "Com o VoetIQ Premium podes adicionar uma descrição pessoal ao teu grupo.",
      descPlaceholder: "Por exemplo: Grupo familiar Ajax 2026/27 – boa sorte a todos!",
      descVisible: "Este texto ficará visível na página do teu grupo.", descSaving: "A guardar descrição...",
      descSave: "👑 Guardar descrição", unlock: "👑 Desbloquear com VoetIQ Premium",
      themeTitle: "👑 Tema do grupo", themePremium: "Escolhe um estilo próprio para o topo da página do teu grupo.",
      themeLocked: "Com o VoetIQ Premium podes dar ao teu grupo um tema próprio.", active: "✓ ATIVO",
      inviteTitle: "Código de convite", inviteHelp: "Renova o código se já não quiseres que o link de convite antigo funcione.",
      currentCode: "CÓDIGO ATUAL", codeSaving: "A criar novo código...", codeRenew: "🔄 Renovar código de convite",
      deleteTitle: "🗑️ Eliminar grupo", deleteHelp: "Elimina este grupo permanentemente. Desaparecerá para todos os participantes e esta ação não pode ser anulada.",
      deleting: "A eliminar grupo...", delete: "🗑️ Eliminar grupo"
    }
  };

  const t = translations[language];

  const [poolId, setPoolId] = useState("");
  const [pool, setPool] = useState<Pool | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [savingDescription, setSavingDescription] = useState(false);
  const [descriptionMessage, setDescriptionMessage] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [poolTheme, setPoolTheme] = useState<"default" | "emerald" | "gold" | "midnight" | "champions">("default");
  const [savingTheme, setSavingTheme] = useState(false);
  const [themeMessage, setThemeMessage] = useState("");
  const [themeError, setThemeError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [regeneratingCode, setRegeneratingCode] = useState(false);
  const [deletingPool, setDeletingPool] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const savedLanguage = localStorage.getItem("voetiq-language") as LanguageCode | null;
    if (savedLanguage && ["nl", "en", "de", "es", "fr", "it", "pt"].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }

    const handleLanguageChange = () => {
      const nextLanguage = localStorage.getItem("voetiq-language") as LanguageCode | null;
      if (nextLanguage && ["nl", "en", "de", "es", "fr", "it", "pt"].includes(nextLanguage)) {
        setLanguage(nextLanguage);
      }
    };

    window.addEventListener("voetiq-language-change", handleLanguageChange);

    const parts = window.location.pathname.split("/").filter(Boolean);
    const id = parts[1];

    if (!id) {
      setError("Deze poule kon niet worden gevonden.");
      setLoading(false);
      return;
    }

    setPoolId(id);
    loadPool(id);

    return () => {
      window.removeEventListener("voetiq-language-change", handleLanguageChange);
    };
  }, []);

  async function loadPool(id: string) {
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/inloggen?redirect=/poules/${id}/beheer`);
      return;
    }

    const { data, error: poolError } = await supabase
      .from("pools")
      .select("id, name, competition_code, invite_code, owner_id, description, pool_theme")
      .eq("id", id)
      .maybeSingle();

    if (poolError || !data) {
      console.error(poolError);
      setError("Deze poule bestaat niet of je hebt geen toegang.");
      setLoading(false);
      return;
    }

    if (data.owner_id !== user.id) {
      router.replace(`/poules/${id}`);
      return;
    }

    const { data: premiumProfile, error: premiumError } = await supabase
      .from("profiles")
      .select("is_premium, premium_expires_at")
      .eq("id", user.id)
      .maybeSingle();

    if (premiumError) {
      console.error(premiumError);
    }

    const premiumExpiresAt = premiumProfile?.premium_expires_at
      ? new Date(premiumProfile.premium_expires_at)
      : null;

    const premiumActive =
      premiumProfile?.is_premium === true &&
      (premiumExpiresAt === null ||
        (!Number.isNaN(premiumExpiresAt.getTime()) &&
          premiumExpiresAt.getTime() > Date.now()));

    setIsPremium(premiumActive);
    setPool(data);
    setName(data.name);
    setDescription(data.description || "");
    setPoolTheme(data.pool_theme || "default");
    setLoading(false);
  }

  async function saveName() {
    if (!pool) return;

    const cleanName = name.trim();

    if (cleanName.length < 2) {
      setError("De poulenaam moet minimaal 2 tekens bevatten.");
      setMessage("");
      return;
    }

    if (cleanName.length > 40) {
      setError("De poulenaam mag maximaal 40 tekens bevatten.");
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const { error: updateError } = await supabase.rpc("update_pool_name", {
      requested_pool_id: pool.id,
      new_name: cleanName,
    });

    if (updateError) {
      console.error(updateError);
      setError(updateError.message || "De poulenaam kon niet worden gewijzigd.");
      setSaving(false);
      return;
    }

    setPool({ ...pool, name: cleanName });
    setName(cleanName);
    setMessage("✓ Poulenaam succesvol gewijzigd.");
    setSaving(false);
  }

  async function saveDescription() {
    if (!pool || !isPremium) return;

    const cleanDescription = description.trim();

    if (cleanDescription.length > 200) {
      setDescriptionError("De poulebeschrijving mag maximaal 200 tekens bevatten.");
      setDescriptionMessage("");
      return;
    }

    setSavingDescription(true);
    setDescriptionError("");
    setDescriptionMessage("");

    const { error: updateError } = await supabase.rpc(
      "update_pool_description",
      {
        requested_pool_id: pool.id,
        new_description: cleanDescription,
      }
    );

    if (updateError) {
      console.error(updateError);
      setDescriptionError(
        updateError.message || "De poulebeschrijving kon niet worden opgeslagen."
      );
      setSavingDescription(false);
      return;
    }

    setPool({
      ...pool,
      description: cleanDescription || null,
    });
    setDescription(cleanDescription);
    setDescriptionMessage("✓ Poulebeschrijving succesvol opgeslagen.");
    setSavingDescription(false);
  }

  async function savePoolTheme(
    theme: "default" | "emerald" | "gold" | "midnight" | "champions"
  ) {
    if (!pool || !isPremium || savingTheme) return;

    setSavingTheme(true);
    setThemeError("");
    setThemeMessage("");

    const { error: updateError } = await supabase.rpc("update_pool_theme", {
      requested_pool_id: pool.id,
      new_theme: theme,
    });

    if (updateError) {
      console.error(updateError);
      setThemeError(
        updateError.message || "Het poulethema kon niet worden gewijzigd."
      );
      setSavingTheme(false);
      return;
    }

    setPoolTheme(theme);
    setPool({ ...pool, pool_theme: theme });
    setThemeMessage("✓ Poulethema succesvol gewijzigd.");
    setSavingTheme(false);
  }

  async function regenerateInviteCode() {
    if (!pool) return;

    const confirmed = window.confirm(
      "Weet je zeker dat je de uitnodigingscode wilt vernieuwen? De oude code werkt daarna niet meer."
    );

    if (!confirmed) return;

    setRegeneratingCode(true);
    setError("");
    setMessage("");

    const { data, error: regenerateError } = await supabase.rpc(
      "regenerate_pool_invite_code",
      {
        requested_pool_id: pool.id,
      }
    );

    if (regenerateError) {
      console.error(regenerateError);
      setError(
        regenerateError.message ||
          "De uitnodigingscode kon niet worden vernieuwd."
      );
      setRegeneratingCode(false);
      return;
    }

    const newCode = String(data || "");

    setPool({
      ...pool,
      invite_code: newCode,
    });

    setMessage("✓ Nieuwe uitnodigingscode aangemaakt.");
    setRegeneratingCode(false);
  }

  async function deletePool() {
    if (!pool) return;

    const confirmed = window.confirm(
      `Weet je zeker dat je "${pool.name}" permanent wilt verwijderen?\n\nDeze actie kan niet ongedaan worden gemaakt.`
    );

    if (!confirmed) return;

    const confirmedAgain = window.confirm(
      "Laatste controle: de poule wordt definitief verwijderd. Doorgaan?"
    );

    if (!confirmedAgain) return;

    setDeletingPool(true);
    setError("");
    setMessage("");

    const { error: deleteError } = await supabase.rpc("delete_pool", {
      requested_pool_id: pool.id,
    });

    if (deleteError) {
      console.error(deleteError);
      setError(deleteError.message || "De poule kon niet worden verwijderd.");
      setDeletingPool(false);
      return;
    }

    router.replace("/poules");
  }

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at 50% 0%, rgba(15, 122, 70, 0.20) 0%, transparent 32%), linear-gradient(180deg, #00170e 0%, #00110a 48%, #000d08 100%)",
          color: "white",
          padding: "38px 20px 80px",
        }}
      >
        <div style={{ maxWidth: "850px", margin: "0 auto" }}>
          <button
            onClick={() => router.push(`/poules/${poolId}`)}
            style={{
              border: 0,
              background: "transparent",
              color: "#41e58b",
              fontWeight: 800,
              cursor: "pointer",
              padding: 0,
              marginBottom: "22px",
              fontSize: "14px",
            }}
          >
            {t.back}
          </button>

          {loading ? (
            <div
              style={{
                background:
                  "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
                border: "1px solid rgba(80,190,130,0.20)",
                borderRadius: "20px",
                padding: "28px",
              }}
            >
              {t.loading}
            </div>
          ) : error && !pool ? (
            <div
              style={{
                background: "#2a1114",
                border: "1px solid rgba(255,100,100,0.25)",
                color: "#ffb4b4",
                borderRadius: "16px",
                padding: "18px",
                fontWeight: 700,
              }}
            >
              {error}
            </div>
          ) : pool ? (
            <>
              <section
                style={{
                  background:
                    "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
                  border: "1px solid rgba(80,190,130,0.20)",
                  borderRadius: "24px",
                  padding: "30px",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    color: "#83e7ae",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "1px",
                    marginBottom: "7px",
                  }}
                >
                  {t.manage}
                </div>

                <h1
                  style={{
                    margin: 0,
                    fontSize: "34px",
                    lineHeight: 1.15,
                  }}
                >
                  ⚙️ {pool.name}
                </h1>

                <p
                  style={{
                    margin: "10px 0 0",
                    color: "#a9bbb0",
                    lineHeight: 1.5,
                  }}
                >
                  {competitions[pool.competition_code] ||
                    pool.competition_code}
                </p>
              </section>

              <section
                style={{
                  background:
                    "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
                  border: "1px solid rgba(80,190,130,0.20)",
                  borderRadius: "20px",
                  padding: "24px",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 6px",
                    fontSize: "22px",
                  }}
                >
                  {t.nameTitle}
                </h2>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#a9bbb0",
                    fontSize: "14px",
                  }}
                >
                  {t.nameHelp}
                </p>

                <input
                  value={name}
                  maxLength={40}
                  onChange={(event) => {
                    setName(event.target.value);
                    setError("");
                    setMessage("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !saving) {
                      saveName();
                    }
                  }}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: "#00170e",
                    border: "1px solid rgba(80,190,130,0.28)",
                    borderRadius: "11px",
                    padding: "13px 14px",
                    color: "white",
                    outline: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "center",
                    marginTop: "8px",
                    color: "#7f978a",
                    fontSize: "12px",
                  }}
                >
                  <span>{t.nameVisible}</span>
                  <span>{name.length}/40</span>
                </div>

                {error && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "11px 13px",
                      borderRadius: "10px",
                      background: "#2a1114",
                      border: "1px solid rgba(255,100,100,0.20)",
                      color: "#ffb4b4",
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {error}
                  </div>
                )}

                {message && (
                  <div
                    style={{
                      marginTop: "14px",
                      padding: "11px 13px",
                      borderRadius: "10px",
                      background: "#0b3523",
                      border: "1px solid rgba(65,229,139,0.20)",
                      color: "#83e7ae",
                      fontSize: "13px",
                      fontWeight: 800,
                    }}
                  >
                    {message}
                  </div>
                )}

                <button
                  onClick={saveName}
                  disabled={
                    saving ||
                    name.trim().length < 2 ||
                    name.trim() === pool.name
                  }
                  style={{
                    marginTop: "18px",
                    border: 0,
                    borderRadius: "11px",
                    padding: "12px 18px",
                    background:
                      saving ||
                      name.trim().length < 2 ||
                      name.trim() === pool.name
                        ? "#17422f"
                        : "#08783e",
                    color:
                      saving ||
                      name.trim().length < 2 ||
                      name.trim() === pool.name
                        ? "#759987"
                        : "white",
                    fontWeight: 900,
                    cursor:
                      saving ||
                      name.trim().length < 2 ||
                      name.trim() === pool.name
                        ? "default"
                        : "pointer",
                  }}
                >
                  {saving ? t.saving : t.saveName}
                </button>
              </section>

              <section
                style={{
                  background: isPremium
                    ? "linear-gradient(145deg, rgba(82,57,8,0.88) 0%, rgba(20,18,8,0.98) 58%, #00170e 100%)"
                    : "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
                  border: isPremium
                    ? "1px solid rgba(250,204,21,0.28)"
                    : "1px solid rgba(80,190,130,0.20)",
                  borderRadius: "20px",
                  padding: "24px",
                  marginTop: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "6px",
                  }}
                >
                  <h2 style={{ margin: 0, fontSize: "22px" }}>
                    {t.descTitle}
                  </h2>

                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "999px",
                      border: "1px solid rgba(250,204,21,0.30)",
                      background: "rgba(250,204,21,0.10)",
                      padding: "6px 9px",
                      color: "#fde047",
                      fontSize: "10px",
                      fontWeight: 900,
                      letterSpacing: "0.8px",
                    }}
                  >
                    PREMIUM
                  </span>
                </div>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#a9bbb0",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  {isPremium ? t.descPremium : t.descLocked}
                </p>

                {isPremium ? (
                  <>
                    <textarea
                      value={description}
                      maxLength={200}
                      rows={4}
                      onChange={(event) => {
                        setDescription(event.target.value);
                        setDescriptionError("");
                        setDescriptionMessage("");
                      }}
                      placeholder={t.descPlaceholder}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        resize: "vertical",
                        minHeight: "105px",
                        background: "#00170e",
                        border: "1px solid rgba(250,204,21,0.25)",
                        borderRadius: "11px",
                        padding: "13px 14px",
                        color: "white",
                        outline: "none",
                        fontSize: "14px",
                        lineHeight: 1.5,
                        fontFamily: "inherit",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "12px",
                        marginTop: "8px",
                        color: "#9f9b80",
                        fontSize: "12px",
                      }}
                    >
                      <span>{t.descVisible}</span>
                      <span>{description.length}/200</span>
                    </div>

                    {descriptionError && (
                      <div
                        style={{
                          marginTop: "14px",
                          padding: "11px 13px",
                          borderRadius: "10px",
                          background: "#2a1114",
                          border: "1px solid rgba(255,100,100,0.20)",
                          color: "#ffb4b4",
                          fontSize: "13px",
                          fontWeight: 700,
                        }}
                      >
                        {descriptionError}
                      </div>
                    )}

                    {descriptionMessage && (
                      <div
                        style={{
                          marginTop: "14px",
                          padding: "11px 13px",
                          borderRadius: "10px",
                          background: "rgba(250,204,21,0.08)",
                          border: "1px solid rgba(250,204,21,0.20)",
                          color: "#fde68a",
                          fontSize: "13px",
                          fontWeight: 800,
                        }}
                      >
                        {descriptionMessage}
                      </div>
                    )}

                    <button
                      onClick={saveDescription}
                      disabled={
                        savingDescription ||
                        description.trim() === (pool.description || "")
                      }
                      style={{
                        marginTop: "18px",
                        border: 0,
                        borderRadius: "11px",
                        padding: "12px 18px",
                        background:
                          savingDescription ||
                          description.trim() === (pool.description || "")
                            ? "#4a4120"
                            : "#a16207",
                        color:
                          savingDescription ||
                          description.trim() === (pool.description || "")
                            ? "#9f9871"
                            : "white",
                        fontWeight: 900,
                        cursor:
                          savingDescription ||
                          description.trim() === (pool.description || "")
                            ? "default"
                            : "pointer",
                      }}
                    >
                      {savingDescription ? t.descSaving : t.descSave}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/premium")}
                    style={{
                      border: "1px solid rgba(250,204,21,0.30)",
                      borderRadius: "11px",
                      padding: "12px 18px",
                      background: "rgba(250,204,21,0.10)",
                      color: "#fde047",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {t.unlock}
                  </button>
                )}
              </section>

              <section
                style={{
                  background: isPremium
                    ? "linear-gradient(145deg, rgba(82,57,8,0.72) 0%, rgba(20,18,8,0.96) 58%, #00170e 100%)"
                    : "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
                  border: isPremium
                    ? "1px solid rgba(250,204,21,0.28)"
                    : "1px solid rgba(80,190,130,0.20)",
                  borderRadius: "20px",
                  padding: "24px",
                  marginTop: "18px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <h2 style={{ margin: 0, fontSize: "22px" }}>{t.themeTitle}</h2>
                  <span style={{ display: "inline-flex", borderRadius: "999px", border: "1px solid rgba(250,204,21,0.30)", background: "rgba(250,204,21,0.10)", padding: "6px 9px", color: "#fde047", fontSize: "10px", fontWeight: 900, letterSpacing: "0.8px" }}>
                    PREMIUM
                  </span>
                </div>

                <p style={{ margin: "8px 0 18px", color: "#a9bbb0", fontSize: "14px", lineHeight: 1.5 }}>
                  {isPremium ? t.themePremium : t.themeLocked}
                </p>

                {isPremium ? (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(125px, 1fr))", gap: "10px" }}>
                      {[
                        { id: "default", label: "Default", icon: "⚽", bg: "linear-gradient(135deg,#06271a,#00170e)", accent: "#41e58b" },
                        { id: "emerald", label: "Emerald", icon: "💚", bg: "linear-gradient(135deg,#063522,#075b36)", accent: "#6ee7a8" },
                        { id: "gold", label: "Gold", icon: "👑", bg: "linear-gradient(135deg,#2a2107,#6a4b08)", accent: "#fde047" },
                        { id: "midnight", label: "Midnight", icon: "🌙", bg: "linear-gradient(135deg,#07111f,#142b4a)", accent: "#93c5fd" },
                        { id: "champions", label: "Champions", icon: "🏆", bg: "linear-gradient(135deg,#070b2b,#27338c)", accent: "#c4b5fd" },
                      ].map((theme) => {
                        const selected = poolTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            onClick={() =>
                              savePoolTheme(
                                theme.id as "default" | "emerald" | "gold" | "midnight" | "champions"
                              )
                            }
                            disabled={savingTheme}
                            style={{
                              minHeight: "86px",
                              border: selected
                                ? `2px solid ${theme.accent}`
                                : "1px solid rgba(255,255,255,0.10)",
                              borderRadius: "13px",
                              background: theme.bg,
                              color: "white",
                              cursor: savingTheme ? "default" : "pointer",
                              padding: "12px",
                              textAlign: "left",
                              boxShadow: selected ? `0 0 0 2px ${theme.accent}22` : "none",
                              opacity: savingTheme ? 0.75 : 1,
                            }}
                          >
                            <div style={{ fontSize: "20px", marginBottom: "7px" }}>{theme.icon}</div>
                            <div style={{ fontWeight: 900, color: selected ? theme.accent : "white" }}>
                              {theme.label}
                            </div>
                            {selected && (
                              <div style={{ marginTop: "4px", fontSize: "10px", fontWeight: 900, color: theme.accent }}>
                                {t.active}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {themeError && (
                      <div style={{ marginTop: "14px", padding: "11px 13px", borderRadius: "10px", background: "#2a1114", border: "1px solid rgba(255,100,100,0.20)", color: "#ffb4b4", fontSize: "13px", fontWeight: 700 }}>
                        {themeError}
                      </div>
                    )}

                    {themeMessage && (
                      <div style={{ marginTop: "14px", padding: "11px 13px", borderRadius: "10px", background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.20)", color: "#fde68a", fontSize: "13px", fontWeight: 800 }}>
                        {themeMessage}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => router.push("/premium")}
                    style={{ border: "1px solid rgba(250,204,21,0.30)", borderRadius: "11px", padding: "12px 18px", background: "rgba(250,204,21,0.10)", color: "#fde047", fontWeight: 900, cursor: "pointer" }}
                  >
                    {t.unlock}
                  </button>
                )}
              </section>

              <section
                style={{
                  background:
                    "linear-gradient(145deg, #06271a 0%, #00170e 100%)",
                  border: "1px solid rgba(80,190,130,0.20)",
                  borderRadius: "20px",
                  padding: "24px",
                  marginTop: "18px",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 6px",
                    fontSize: "22px",
                  }}
                >
                  {t.inviteTitle}
                </h2>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#a9bbb0",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  {t.inviteHelp}
                </p>

                <div
                  style={{
                    background: "#00170e",
                    border: "1px solid rgba(80,190,130,0.25)",
                    borderRadius: "12px",
                    padding: "14px 16px",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      color: "#7f978a",
                      fontSize: "11px",
                      fontWeight: 900,
                      marginBottom: "5px",
                      letterSpacing: "0.8px",
                    }}
                  >
                    {t.currentCode}
                  </div>

                  <div
                    style={{
                      color: "white",
                      fontSize: "20px",
                      fontWeight: 900,
                      letterSpacing: "1px",
                    }}
                  >
                    {pool.invite_code}
                  </div>
                </div>

                <button
                  onClick={regenerateInviteCode}
                  disabled={regeneratingCode}
                  style={{
                    border: "1px solid rgba(65,229,139,0.22)",
                    borderRadius: "11px",
                    padding: "12px 18px",
                    background: regeneratingCode ? "#17422f" : "#0b3523",
                    color: regeneratingCode ? "#759987" : "#83e7ae",
                    fontWeight: 900,
                    cursor: regeneratingCode ? "default" : "pointer",
                  }}
                >
                  {regeneratingCode ? t.codeSaving : t.codeRenew}
                </button>
              </section>

              <section
                style={{
                  background: "linear-gradient(145deg, #241011 0%, #120708 100%)",
                  border: "1px solid rgba(255,95,95,0.24)",
                  borderRadius: "20px",
                  padding: "24px",
                  marginTop: "18px",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 6px",
                    fontSize: "22px",
                    color: "#ffb4b4",
                  }}
                >
                  {t.deleteTitle}
                </h2>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#c99b9b",
                    fontSize: "14px",
                    lineHeight: 1.55,
                  }}
                >
                  {t.deleteHelp}
                </p>

                <button
                  onClick={deletePool}
                  disabled={deletingPool}
                  style={{
                    border: "1px solid rgba(255,95,95,0.30)",
                    borderRadius: "11px",
                    padding: "12px 18px",
                    background: deletingPool ? "#35191a" : "#7d2024",
                    color: deletingPool ? "#a87979" : "white",
                    fontWeight: 900,
                    cursor: deletingPool ? "default" : "pointer",
                  }}
                >
                  {deletingPool ? t.deleting : t.delete}
                </button>
              </section>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
