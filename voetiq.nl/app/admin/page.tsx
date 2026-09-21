"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type AdminUser = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
  created_at: string;
  is_premium: boolean | null;
};

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    setError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      window.location.href = "/inloggen?redirect=/admin";
      return;
    }

    try {
      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
        cache: "no-store",
      });

      if (response.status === 401) {
        window.location.href = "/inloggen?redirect=/admin";
        return;
      }

      if (response.status === 403) {
        setError("Je hebt geen toegang tot het VoetIQ-beheerpaneel.");
        setAuthorized(false);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gebruikers konden niet worden geladen.");
      }

      setUsers(data.users ?? []);
      setAuthorized(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Er ging iets mis bij het laden van de gebruikers."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("nl-NL", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(date));
  }

  const today = new Date();

  const newToday = users.filter((user) => {
    const created = new Date(user.created_at);

    return (
      created.getFullYear() === today.getFullYear() &&
      created.getMonth() === today.getMonth() &&
      created.getDate() === today.getDate()
    );
  }).length;

  const premiumUsers = users.filter((user) => user.is_premium).length;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at 50% -10%, rgba(0,190,90,0.18), transparent 35%), linear-gradient(135deg, #03150d 0%, #061f14 45%, #020806 100%)",
        color: "white",
        padding: "32px 20px 70px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
            marginBottom: "30px",
          }}
        >
          <div>
            <a
              href="/"
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "30px",
                fontWeight: 900,
                letterSpacing: "-1.5px",
              }}
            >
              Voet<span style={{ color: "#2ee681" }}>IQ</span>
            </a>

            <div
              style={{
                marginTop: "8px",
                color: "#82978d",
                fontSize: "13px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Beheerpaneel
            </div>
          </div>

          <a
            href="/"
            style={{
              background: "rgba(46,230,129,0.1)",
              border: "1px solid rgba(46,230,129,0.2)",
              color: "#5cf09e",
              padding: "11px 16px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 800,
            }}
          >
            ← Terug naar VoetIQ
          </a>
        </header>

        {loading && (
          <section style={cardStyle}>
            <div
              style={{
                color: "#9eb1a7",
                textAlign: "center",
                padding: "35px",
              }}
            >
              Beheerpaneel laden...
            </div>
          </section>
        )}

        {!loading && error && (
          <section
            style={{
              ...cardStyle,
              border: "1px solid rgba(255,80,80,0.25)",
            }}
          >
            <div
              style={{
                color: "#ffaaaa",
                textAlign: "center",
                padding: "30px",
              }}
            >
              {error}
            </div>
          </section>
        )}

        {!loading && authorized && (
          <>
            <section
              style={{
                marginBottom: "28px",
              }}
            >
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: "30px",
                  letterSpacing: "-1px",
                }}
              >
                Gebruikers
              </h1>

              <p
                style={{
                  margin: 0,
                  color: "#84998f",
                  fontSize: "14px",
                }}
              >
                Bekijk de geregistreerde accounts van VoetIQ.
              </p>
            </section>

            <div
              className="stats-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "14px",
                marginBottom: "25px",
              }}
            >
              <StatCard
                label="Totaal accounts"
                value={users.length}
                icon="👥"
              />

              <StatCard
                label="Vandaag geregistreerd"
                value={newToday}
                icon="🆕"
              />

              <StatCard
                label="Premium"
                value={premiumUsers}
                icon="⭐"
              />
            </div>

            <section style={cardStyle}>
              <div
                style={{
                  padding: "20px 22px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "15px",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: "17px",
                    }}
                  >
                    Alle gebruikers
                  </div>

                  <div
                    style={{
                      color: "#748a7f",
                      fontSize: "12px",
                      marginTop: "4px",
                    }}
                  >
                    Nieuwste registraties staan bovenaan
                  </div>
                </div>

                <button
                  onClick={loadUsers}
                  style={{
                    border: "1px solid rgba(46,230,129,0.2)",
                    background: "rgba(46,230,129,0.08)",
                    color: "#51e995",
                    borderRadius: "9px",
                    padding: "9px 12px",
                    cursor: "pointer",
                    fontWeight: 800,
                    fontSize: "12px",
                  }}
                >
                  Vernieuwen
                </button>
              </div>

              <div
                style={{
                  overflowX: "auto",
                }}
              >
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    minWidth: "760px",
                  }}
                >
                  <thead>
                    <tr>
                      <TableHeader>Gebruikersnaam</TableHeader>
                      <TableHeader>Naam</TableHeader>
                      <TableHeader>Geregistreerd</TableHeader>
                      <TableHeader>Premium</TableHeader>
                      <TableHeader>User ID</TableHeader>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        style={{
                          borderTop: "1px solid rgba(255,255,255,0.045)",
                        }}
                      >
                        <TableCell>
                          <span
                            style={{
                              color: "#4bea91",
                              fontWeight: 900,
                            }}
                          >
                            {user.username || "Geen gebruikersnaam"}
                          </span>
                        </TableCell>

                        <TableCell>
                          {[user.first_name, user.last_name]
                            .filter(Boolean)
                            .join(" ") || "—"}
                        </TableCell>

                        <TableCell>{formatDate(user.created_at)}</TableCell>

                        <TableCell>
                          {user.is_premium ? (
                            <span
                              style={{
                                color: "#ffd96a",
                                fontWeight: 800,
                              }}
                            >
                              PREMIUM
                            </span>
                          ) : (
                            <span style={{ color: "#70847a" }}>Gratis</span>
                          )}
                        </TableCell>

                        <TableCell>
                          <code
                            style={{
                              color: "#70847a",
                              fontSize: "11px",
                            }}
                          >
                            {user.id}
                          </code>
                        </TableCell>
                      </tr>
                    ))}

                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{
                            padding: "35px",
                            textAlign: "center",
                            color: "#758a80",
                          }}
                        >
                          Nog geen gebruikers gevonden.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 700px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </main>
  );
}

const cardStyle = {
  background: "rgba(7, 28, 19, 0.9)",
  border: "1px solid rgba(75,255,153,0.1)",
  borderRadius: "18px",
  overflow: "hidden",
  boxShadow: "0 20px 60px rgba(0,0,0,0.22)",
};

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: string;
}) {
  return (
    <div
      style={{
        ...cardStyle,
        padding: "20px",
      }}
    >
      <div
        style={{
          fontSize: "21px",
          marginBottom: "12px",
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: "27px",
          fontWeight: 900,
          color: "#ffffff",
        }}
      >
        {value}
      </div>

      <div
        style={{
          color: "#789086",
          fontSize: "12px",
          marginTop: "5px",
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th
      style={{
        padding: "13px 18px",
        textAlign: "left",
        color: "#72877d",
        fontSize: "11px",
        textTransform: "uppercase",
        letterSpacing: "0.7px",
        fontWeight: 800,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </th>
  );
}

function TableCell({ children }: { children: React.ReactNode }) {
  return (
    <td
      style={{
        padding: "16px 18px",
        fontSize: "13px",
        color: "#c5d3cc",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </td>
  );
}
