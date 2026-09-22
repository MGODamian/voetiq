 "use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import Navbar from "../Navbar";

type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  username: string | null;
};

type Friendship = {
  id: number;
  requester_id: string;
  addressee_id: string;
  status: "pending" | "accepted" | "declined";
  created_at: string;
  requester?: Profile | null;
  addressee?: Profile | null;
};

export default function VriendenPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [friendships, setFriendships] = useState<Friendship[]>([]);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState<string | number | null>(null);

  useEffect(() => {
    loadPage();
  }, []);

  async function loadPage() {
    setLoading(true);
    setMessage("");

    const { data: authData } = await supabase.auth.getUser();
    const id = authData.user?.id ?? null;

    if (!id) {
      setMessage("Je moet ingelogd zijn om vrienden te gebruiken.");
      setLoading(false);
      return;
    }

    setUserId(id);

    const [profileResult, friendshipResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, first_name, last_name, username")
        .eq("id", id)
        .maybeSingle(),

      supabase
        .from("friendships")
        .select("*")
        .or(`requester_id.eq.${id},addressee_id.eq.${id}`)
        .order("created_at", { ascending: false }),
    ]);

    if (profileResult.error) {
      setMessage(profileResult.error.message);
    } else {
      setProfile(profileResult.data);
    }

    if (friendshipResult.error) {
      setMessage(friendshipResult.error.message);
    } else {
      const rows = friendshipResult.data ?? [];
      const otherIds = Array.from(
        new Set(
          rows.map((row) =>
            row.requester_id === id ? row.addressee_id : row.requester_id
          )
        )
      );

      if (otherIds.length > 0) {
        const { data: otherProfiles } = await supabase
          .from("profiles")
          .select("id, first_name, last_name, username")
          .in("id", otherIds);

        const profileMap = new Map(
          (otherProfiles ?? []).map((item) => [item.id, item])
        );

        setFriendships(
          rows.map((row) => ({
            ...row,
            requester:
              row.requester_id === id
                ? profileResult.data
                : profileMap.get(row.requester_id) ?? null,
            addressee:
              row.addressee_id === id
                ? profileResult.data
                : profileMap.get(row.addressee_id) ?? null,
          }))
        );
      } else {
        setFriendships(rows);
      }
    }

    setLoading(false);
  }

  async function searchPlayers() {
    const term = search.trim();

    if (term.length < 2) {
      setResults([]);
      return;
    }

    setSearching(true);
    setMessage("");

    const { data, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, username")
      .ilike("username", `%${term}%`)
      .neq("id", userId ?? "")
      .limit(10);

    if (error) {
      setMessage(error.message);
      setResults([]);
    } else {
      setResults(data ?? []);
    }

    setSearching(false);
  }

  async function sendFriendRequest(targetId: string) {
    if (!userId) return;

    setBusyId(targetId);
    setMessage("");

    const existing = friendships.find(
      (friendship) =>
        (friendship.requester_id === userId &&
          friendship.addressee_id === targetId) ||
        (friendship.requester_id === targetId &&
          friendship.addressee_id === userId)
    );

    if (existing) {
      setMessage(
        existing.status === "accepted"
          ? "Jullie zijn al vrienden."
          : "Er bestaat al een vriendverzoek."
      );
      setBusyId(null);
      return;
    }

    const { error } = await supabase.from("friendships").insert({
      requester_id: userId,
      addressee_id: targetId,
      status: "pending",
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Vriendverzoek verstuurd! 🎉");
      await loadPage();
    }

    setBusyId(null);
  }

  async function respondToRequest(
    friendshipId: number,
    status: "accepted" | "declined"
  ) {
    setBusyId(friendshipId);
    setMessage("");

    const { error } = await supabase
      .from("friendships")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", friendshipId);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        status === "accepted"
          ? "Vriendverzoek geaccepteerd! 👥"
          : "Vriendverzoek geweigerd."
      );
      await loadPage();
    }

    setBusyId(null);
  }

  async function removeFriend(friendshipId: number) {
    if (!window.confirm("Weet je zeker dat je deze vriend wilt verwijderen?")) {
      return;
    }

    setBusyId(friendshipId);
    setMessage("");

    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId);

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Vriendschap verwijderd.");
      await loadPage();
    }

    setBusyId(null);
  }

  function displayName(item: Profile | null | undefined) {
    if (!item) return "Onbekende speler";
    return item.username || `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "Speler";
  }

  const friends = useMemo(
    () =>
      friendships.filter(
        (item) => item.status === "accepted"
      ),
    [friendships]
  );

  const incoming = useMemo(
    () =>
      friendships.filter(
        (item) => item.status === "pending" && item.addressee_id === userId
      ),
    [friendships, userId]
  );

  const outgoing = useMemo(
    () =>
      friendships.filter(
        (item) => item.status === "pending" && item.requester_id === userId
      ),
    [friendships, userId]
  );

  function relationshipFor(targetId: string) {
    return friendships.find(
      (item) =>
        (item.requester_id === userId && item.addressee_id === targetId) ||
        (item.requester_id === targetId && item.addressee_id === userId)
    );
  }

  return (
    <div className="min-h-screen bg-[#06100b] text-white">
      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-10">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
            Sociaal
          </p>
          <h1 className="text-4xl font-black tracking-tight">Vrienden</h1>
          <p className="mt-2 text-sm text-white/60">
            Voeg andere VoetIQ-spelers toe en bouw je eigen voetbalcommunity.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-200">
            {message}
          </div>
        )}

        <section className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-bold">Spelers zoeken</h2>
          <p className="mt-1 text-sm text-white/50">
            Zoek op gebruikersnaam en stuur een vriendverzoek.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") searchPlayers();
              }}
              placeholder="Bijv. Voetbaltester"
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition focus:border-emerald-400/50"
            />
            <button
              onClick={searchPlayers}
              disabled={searching}
              className="rounded-2xl bg-emerald-400 px-6 py-3 text-sm font-bold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {searching ? "Zoeken..." : "Zoeken"}
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {results.map((player) => {
              const relationship = relationshipFor(player.id);

              return (
                <div
                  key={player.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                >
                  <div>
                    <div className="font-bold">{displayName(player)}</div>
                    <div className="text-xs text-white/40">
                      {player.first_name || player.last_name
                        ? `${player.first_name ?? ""} ${player.last_name ?? ""}`.trim()
                        : "VoetIQ-speler"}
                    </div>
                  </div>

                  {relationship?.status === "accepted" ? (
                    <span className="rounded-xl bg-emerald-400/10 px-4 py-2 text-xs font-bold text-emerald-300">
                      ✓ Vrienden
                    </span>
                  ) : relationship?.status === "pending" ? (
                    <span className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white/60">
                      {relationship.requester_id === userId
                        ? "Verzoek verstuurd"
                        : "Verzoek ontvangen"}
                    </span>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(player.id)}
                      disabled={busyId === player.id}
                      className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-black disabled:opacity-50"
                    >
                      {busyId === player.id ? "..." : "+ Vriend toevoegen"}
                    </button>
                  )}
                </div>
              );
            })}

            {!searching && search.trim().length >= 2 && results.length === 0 && (
              <p className="py-3 text-sm text-white/40">
                Geen spelers gevonden.
              </p>
            )}
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold">Vriendverzoeken</h2>

            <div className="mt-5 space-y-3">
              {incoming.length === 0 ? (
                <p className="text-sm text-white/40">
                  Je hebt geen nieuwe vriendverzoeken.
                </p>
              ) : (
                incoming.map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-white/10 bg-black/10 p-4"
                  >
                    <div className="font-bold">
                      {displayName(request.requester)}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => respondToRequest(request.id, "accepted")}
                        disabled={busyId === request.id}
                        className="rounded-xl bg-emerald-400 px-4 py-2 text-xs font-bold text-black disabled:opacity-50"
                      >
                        Accepteren
                      </button>

                      <button
                        onClick={() => respondToRequest(request.id, "declined")}
                        disabled={busyId === request.id}
                        className="rounded-xl bg-white/10 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                      >
                        Weigeren
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {outgoing.length > 0 && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/40">
                  Verstuurde verzoeken
                </p>

                <div className="space-y-2">
                  {outgoing.map((request) => (
                    <div
                      key={request.id}
                      className="rounded-xl bg-black/10 px-4 py-3 text-sm text-white/60"
                    >
                      {displayName(request.addressee)} — wacht op antwoord
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-xl font-bold">Mijn vrienden</h2>

            <div className="mt-5 space-y-3">
              {friends.length === 0 ? (
                <p className="text-sm text-white/40">
                  Je hebt nog geen vrienden. Zoek hierboven naar spelers.
                </p>
              ) : (
                friends.map((friendship) => {
                  const friend =
                    friendship.requester_id === userId
                      ? friendship.addressee
                      : friendship.requester;

                  return (
                    <div
                      key={friendship.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                    >
                      <div>
                        <div className="font-bold">{displayName(friend)}</div>
                        <div className="text-xs text-emerald-300">
                          ✓ Vriend
                        </div>
                      </div>

                      <button
                        onClick={() => removeFriend(friendship.id)}
                        disabled={busyId === friendship.id}
                        className="rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white/60 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
                      >
                        Verwijderen
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {loading && (
          <div className="fixed inset-x-0 bottom-6 mx-auto w-fit rounded-full bg-black/80 px-5 py-3 text-sm text-white/70 shadow-xl">
            Vrienden laden...
          </div>
        )}
      </main>
    </div>
  );
}
