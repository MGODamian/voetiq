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
    const parts = window.location.pathname.split("/").filter(Boolean);
    const id = parts[1];

    if (!id) {
      setError("Deze poule kon niet worden gevonden.");
      setLoading(false);
      return;
    }

    setPoolId(id);
    loadPool(id);
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
            ← Terug naar poule
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
              Poulebeheer laden...
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
                  POULEBEHEER
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
                  Poulenaam wijzigen
                </h2>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#a9bbb0",
                    fontSize: "14px",
                  }}
                >
                  Kies een naam van 2 tot en met 40 tekens.
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
                  <span>De nieuwe naam wordt direct zichtbaar.</span>
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
                  {saving ? "Opslaan..." : "Naam opslaan"}
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
                    👑 Poulebeschrijving
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
                  {isPremium
                    ? "Voeg een persoonlijke beschrijving van maximaal 200 tekens toe aan je poule."
                    : "Met VoetIQ Premium kun je een persoonlijke beschrijving aan je poule toevoegen."}
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
                      placeholder="Bijvoorbeeld: Ajax-familiepoule 2026/27 – succes allemaal!"
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
                      <span>Deze tekst wordt zichtbaar op je poulepagina.</span>
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
                      {savingDescription
                        ? "Beschrijving opslaan..."
                        : "👑 Beschrijving opslaan"}
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
                    👑 Ontgrendel met VoetIQ Premium
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
                  <h2 style={{ margin: 0, fontSize: "22px" }}>👑 Poulethema</h2>
                  <span style={{ display: "inline-flex", borderRadius: "999px", border: "1px solid rgba(250,204,21,0.30)", background: "rgba(250,204,21,0.10)", padding: "6px 9px", color: "#fde047", fontSize: "10px", fontWeight: 900, letterSpacing: "0.8px" }}>
                    PREMIUM
                  </span>
                </div>

                <p style={{ margin: "8px 0 18px", color: "#a9bbb0", fontSize: "14px", lineHeight: 1.5 }}>
                  {isPremium
                    ? "Kies een eigen stijl voor de bovenkant van je poulepagina."
                    : "Met VoetIQ Premium kun je je poule een eigen thema geven."}
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
                                ✓ ACTIEF
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
                    👑 Ontgrendel met VoetIQ Premium
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
                  Uitnodigingscode
                </h2>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#a9bbb0",
                    fontSize: "14px",
                    lineHeight: 1.5,
                  }}
                >
                  Vernieuw de code als je niet meer wilt dat de oude
                  uitnodigingslink gebruikt kan worden.
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
                    HUIDIGE CODE
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
                  {regeneratingCode
                    ? "Nieuwe code maken..."
                    : "🔄 Uitnodigingscode vernieuwen"}
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
                  🗑️ Poule verwijderen
                </h2>

                <p
                  style={{
                    margin: "0 0 18px",
                    color: "#c99b9b",
                    fontSize: "14px",
                    lineHeight: 1.55,
                  }}
                >
                  Verwijder deze poule permanent. De poule verdwijnt voor alle
                  deelnemers en deze actie kan niet ongedaan worden gemaakt.
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
                  {deletingPool ? "Poule verwijderen..." : "🗑️ Poule verwijderen"}
                </button>
              </section>
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
