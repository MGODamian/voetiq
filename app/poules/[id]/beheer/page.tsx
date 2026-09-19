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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      .select("id, name, competition_code, invite_code, owner_id")
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

    setPool(data);
    setName(data.name);
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
            </>
          ) : null}
        </div>
      </main>
    </>
  );
}
