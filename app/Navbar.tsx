"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "../Navbar";

type Pool = {
  id: string;
  name: string;
  competition_code: string;
  invite_code: string;
  owner_id: string;
  created_at: string;
};

const competitions = [
  { code: "DED", name: "Eredivisie", flag: "🇳🇱" },
  { code: "PL", name: "Premier League", flag: "🏴" },
  { code: "PD", name: "La Liga", flag: "🇪🇸" },
  { code: "BL1", name: "Bundesliga", flag: "🇩🇪" },
  { code: "SA", name: "Serie A", flag: "🇮🇹" },
  { code: "FL1", name: "Ligue 1", flag: "🇫🇷" },
  { code: "PPL", name: "Primeira Liga", flag: "🇵🇹" },
  { code: "CL", name: "Champions League", flag: "🏆" },
];

export default function PoulesPage() {
  const router = useRouter();

  const [pools, setPools] = useState<Pool[]>([]);
  const [poolName, setPoolName] = useState("");
  const [competition, setCompetition] = useState("DED");
  const [inviteCode, setInviteCode] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadPools();
  }, []);

  async function getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  }

  async function loadPools() {
    setLoading(true);

    const user = await getCurrentUser();

    if (!user) {
      router.push("/inloggen");
      return;
    }

    const { data: memberships, error: membershipError } =
      await supabase
        .from("pool_members")
        .select("pool_id")
        .eq("user_id", user.id);

    if (membershipError) {
      console.error(membershipError);
      setErrorMessage(
        "Je poules konden niet worden geladen."
      );
      setLoading(false);
      return;
    }

    const poolIds =
      memberships?.map((membership) => membership.pool_id) || [];

    if (poolIds.length === 0) {
      setPools([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("pools")
      .select(
        "id, name, competition_code, invite_code, owner_id, created_at"
      )
      .in("id", poolIds)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setErrorMessage(
        "Je poules konden niet worden geladen."
      );
    } else {
      setPools(data || []);
    }

    setLoading(false);
  }

  async function createPool() {
    setMessage("");
    setErrorMessage("");

    if (poolName.trim().length < 2) {
      setErrorMessage(
        "Geef je poule een naam van minimaal 2 tekens."
      );
      return;
    }

    setCreating(true);

    const { data, error } = await supabase.rpc(
      "create_pool",
      {
        pool_name: poolName.trim(),
        competition,
      }
    );

    if (error) {
      console.error(error);
      setErrorMessage(
        error.message || "De poule kon niet worden aangemaakt."
      );
      setCreating(false);
      return;
    }

    setPoolName("");
    setMessage("Poule succesvol aangemaakt! 🎉");
    setCreating(false);

    await loadPools();

    if (data) {
      router.push(`/poules/${data}`);
    }
  }

  async function joinPool() {
    setMessage("");
    setErrorMessage("");

    if (!inviteCode.trim()) {
      setErrorMessage(
        "Vul eerst een uitnodigingscode in."
      );
      return;
    }

    setJoining(true);

    const { data, error } = await supabase.rpc(
      "join_pool",
      {
        code: inviteCode.trim(),
      }
    );

    if (error) {
      console.error(error);
      setErrorMessage(
        error.message ||
          "Je kon niet deelnemen aan deze poule."
      );
      setJoining(false);
      return;
    }

    setInviteCode("");
    setMessage("Je bent toegevoegd aan de poule! ⚽");
    setJoining(false);

    await loadPools();

    if (data) {
      router.push(`/poules/${data}`);
    }
  }

  function getCompetition(code: string) {
    return (
      competitions.find(
        (item) => item.code === code
      ) || {
        code,
        name: code,
        flag: "⚽",
      }
    );
  }

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "#f4f7f5",
          padding: "40px 20px 80px",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              marginBottom: "32px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "#dff7e8",
                color: "#08783e",
                padding: "7px 13px",
                borderRadius: "999px",
                fontSize: "13px",
                fontWeight: 800,
                marginBottom: "12px",
              }}
            >
              SPEEL SAMEN
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "42px",
                color: "#10251a",
              }}
            >
              VoetIQ Poules
            </h1>

            <p
              style={{
                color: "#617067",
                fontSize: "17px",
                marginTop: "10px",
              }}
            >
              Maak een poule met vrienden en ontdek wie
              écht het meeste verstand van voetbal heeft.
            </p>
          </div>

          {message && (
            <div
              style={{
                padding: "14px 18px",
                background: "#dcfce7",
                color: "#166534",
                borderRadius: "12px",
                marginBottom: "20px",
                fontWeight: 700,
              }}
            >
              {message}
            </div>
          )}

          {errorMessage && (
            <div
              style={{
                padding: "14px 18px",
                background: "#fee2e2",
                color: "#991b1b",
                borderRadius: "12px",
                marginBottom: "20px",
                fontWeight: 700,
              }}
            >
              {errorMessage}
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "48px",
            }}
          >
            <section
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "26px",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.06)",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "10px",
                }}
              >
                🏆
              </div>

              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#10251a",
                }}
              >
                Poule maken
              </h2>

              <p
                style={{
                  color: "#6b776f",
                  marginBottom: "22px",
                }}
              >
                Start je eigen competitie en nodig je
                vrienden uit.
              </p>

              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "7px",
                }}
              >
                Naam van de poule
              </label>

              <input
                value={poolName}
                onChange={(event) =>
                  setPoolName(event.target.value)
                }
                placeholder="Bijv. Damian & Friends"
                maxLength={50}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "1px solid #d7ddd9",
                  marginBottom: "18px",
                  fontSize: "15px",
                }}
              />

              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "7px",
                }}
              >
                Competitie
              </label>

              <select
                value={competition}
                onChange={(event) =>
                  setCompetition(event.target.value)
                }
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  border: "1px solid #d7ddd9",
                  marginBottom: "20px",
                  background: "white",
                  fontSize: "15px",
                }}
              >
                {competitions.map((item) => (
                  <option
                    key={item.code}
                    value={item.code}
                  >
                    {item.flag} {item.name}
                  </option>
                ))}
              </select>

              <button
                onClick={createPool}
                disabled={creating}
                style={{
                  width: "100%",
                  border: 0,
                  borderRadius: "10px",
                  padding: "14px",
                  background: "#08783e",
                  color: "white",
                  fontWeight: 800,
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                {creating
                  ? "Poule maken..."
                  : "Poule aanmaken →"}
              </button>
            </section>

            <section
              style={{
                background: "#0d3d27",
                color: "white",
                borderRadius: "20px",
                padding: "26px",
                boxShadow:
                  "0 8px 30px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  marginBottom: "10px",
                }}
              >
                ⚽
              </div>

              <h2
                style={{
                  margin: "0 0 8px",
                }}
              >
                Poule joinen
              </h2>

              <p
                style={{
                  color: "#c9ded1",
                  marginBottom: "22px",
                }}
              >
                Heb je een uitnodigingscode gekregen?
                Vul hem hieronder in.
              </p>

              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "7px",
                }}
              >
                Uitnodigingscode
              </label>

              <input
                value={inviteCode}
                onChange={(event) =>
                  setInviteCode(
                    event.target.value.toUpperCase()
                  )
                }
                placeholder="VQ-ABC123"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px",
                  borderRadius: "10px",
                  border: "1px solid #315f48",
                  marginBottom: "20px",
                  background: "#164c33",
                  color: "white",
                  fontSize: "17px",
                  fontWeight: 800,
                  letterSpacing: "1px",
                }}
              />

              <button
                onClick={joinPool}
                disabled={joining}
                style={{
                  width: "100%",
                  border: 0,
                  borderRadius: "10px",
                  padding: "14px",
                  background: "white",
                  color: "#0d3d27",
                  fontWeight: 800,
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                {joining
                  ? "Bezig met joinen..."
                  : "Deelnemen aan poule →"}
              </button>
            </section>
          </div>

          <section>
            <h2
              style={{
                color: "#10251a",
                marginBottom: "18px",
                fontSize: "27px",
              }}
            >
              Mijn poules
            </h2>

            {loading ? (
              <p>Je poules worden geladen...</p>
            ) : pools.length === 0 ? (
              <div
                style={{
                  background: "white",
                  padding: "32px",
                  borderRadius: "18px",
                  textAlign: "center",
                  color: "#68756d",
                }}
              >
                Je zit nog niet in een poule. Maak er
                hierboven één of join met een code.
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: "16px",
                }}
              >
                {pools.map((pool) => {
                  const comp = getCompetition(
                    pool.competition_code
                  );

                  return (
                    <button
                      key={pool.id}
                      onClick={() =>
                        router.push(
                          `/poules/${pool.id}`
                        )
                      }
                      style={{
                        textAlign: "left",
                        background: "white",
                        border: "1px solid #e3e9e5",
                        borderRadius: "16px",
                        padding: "20px",
                        cursor: "pointer",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "25px",
                        }}
                      >
                        {comp.flag}
                      </div>

                      <h3
                        style={{
                          margin: "9px 0 5px",
                          fontSize: "19px",
                          color: "#10251a",
                        }}
                      >
                        {pool.name}
                      </h3>

                      <div
                        style={{
                          color: "#69766e",
                          fontSize: "14px",
                        }}
                      >
                        {comp.name}
                      </div>

                      <div
                        style={{
                          marginTop: "16px",
                          color: "#08783e",
                          fontWeight: 800,
                        }}
                      >
                        Bekijk poule →
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
