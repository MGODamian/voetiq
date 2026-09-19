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


type LanguageCode = "nl" | "en" | "de" | "es" | "fr" | "it" | "pt";

type TranslationKey =
  | "playTogether" | "pools" | "intro" | "createPool" | "createDescription"
  | "poolName" | "poolNamePlaceholder" | "competition" | "creating" | "createButton"
  | "joinPool" | "joinDescription" | "inviteCode" | "joining" | "joinButton"
  | "myPools" | "loadingPools" | "noPools" | "viewPool" | "loadError"
  | "nameTooShort" | "createError" | "created" | "inviteRequired" | "joinError" | "joined";

const translations: Record<LanguageCode, Record<TranslationKey, string>> = {
  nl: {
    playTogether:"SPEEL SAMEN", pools:"Poules", intro:"Maak een poule met vrienden en ontdek wie écht het meeste verstand van voetbal heeft.",
    createPool:"Poule maken", createDescription:"Start je eigen competitie en nodig je vrienden uit.", poolName:"Naam van de poule",
    poolNamePlaceholder:"Bijv. Damian & Friends", competition:"Competitie", creating:"Poule maken...", createButton:"Poule aanmaken",
    joinPool:"Poule joinen", joinDescription:"Heb je een uitnodigingscode gekregen? Vul hem hieronder in.", inviteCode:"Uitnodigingscode",
    joining:"Bezig met joinen...", joinButton:"Deelnemen aan poule", myPools:"Mijn poules", loadingPools:"Je poules worden geladen...",
    noPools:"Je zit nog niet in een poule. Maak er hierboven één of join met een code.", viewPool:"Bekijk poule",
    loadError:"Je poules konden niet worden geladen.", nameTooShort:"Geef je poule een naam van minimaal 2 tekens.",
    createError:"De poule kon niet worden aangemaakt.", created:"Poule succesvol aangemaakt!", inviteRequired:"Vul eerst een uitnodigingscode in.",
    joinError:"Je kon niet deelnemen aan deze poule.", joined:"Je bent toegevoegd aan de poule!"
  },
  en: {
    playTogether:"PLAY TOGETHER", pools:"Pools", intro:"Create a pool with friends and find out who really knows football best.",
    createPool:"Create a pool", createDescription:"Start your own competition and invite your friends.", poolName:"Pool name",
    poolNamePlaceholder:"e.g. Damian & Friends", competition:"Competition", creating:"Creating pool...", createButton:"Create pool",
    joinPool:"Join a pool", joinDescription:"Received an invitation code? Enter it below.", inviteCode:"Invitation code",
    joining:"Joining...", joinButton:"Join pool", myPools:"My pools", loadingPools:"Loading your pools...",
    noPools:"You haven't joined a pool yet. Create one above or join with a code.", viewPool:"View pool",
    loadError:"Your pools could not be loaded.", nameTooShort:"Give your pool a name of at least 2 characters.",
    createError:"The pool could not be created.", created:"Pool created successfully!", inviteRequired:"Enter an invitation code first.",
    joinError:"You could not join this pool.", joined:"You have joined the pool!"
  },
  de: {
    playTogether:"GEMEINSAM SPIELEN", pools:"Tipprunden", intro:"Erstelle eine Tipprunde mit Freunden und findet heraus, wer sich wirklich am besten mit Fußball auskennt.",
    createPool:"Tipprunde erstellen", createDescription:"Starte deinen eigenen Wettbewerb und lade deine Freunde ein.", poolName:"Name der Tipprunde",
    poolNamePlaceholder:"z. B. Damian & Friends", competition:"Wettbewerb", creating:"Tipprunde wird erstellt...", createButton:"Tipprunde erstellen",
    joinPool:"Tipprunde beitreten", joinDescription:"Du hast einen Einladungscode erhalten? Gib ihn unten ein.", inviteCode:"Einladungscode",
    joining:"Beitritt läuft...", joinButton:"Tipprunde beitreten", myPools:"Meine Tipprunden", loadingPools:"Deine Tipprunden werden geladen...",
    noPools:"Du bist noch in keiner Tipprunde. Erstelle oben eine oder tritt mit einem Code bei.", viewPool:"Tipprunde ansehen",
    loadError:"Deine Tipprunden konnten nicht geladen werden.", nameTooShort:"Gib deiner Tipprunde einen Namen mit mindestens 2 Zeichen.",
    createError:"Die Tipprunde konnte nicht erstellt werden.", created:"Tipprunde erfolgreich erstellt!", inviteRequired:"Gib zuerst einen Einladungscode ein.",
    joinError:"Du konntest dieser Tipprunde nicht beitreten.", joined:"Du bist der Tipprunde beigetreten!"
  },
  es: {
    playTogether:"JUEGA CON AMIGOS", pools:"Grupos", intro:"Crea un grupo con tus amigos y descubre quién sabe realmente más de fútbol.",
    createPool:"Crear un grupo", createDescription:"Crea tu propia competición e invita a tus amigos.", poolName:"Nombre del grupo",
    poolNamePlaceholder:"p. ej. Damian & Friends", competition:"Competición", creating:"Creando grupo...", createButton:"Crear grupo",
    joinPool:"Unirse a un grupo", joinDescription:"¿Has recibido un código de invitación? Introdúcelo a continuación.", inviteCode:"Código de invitación",
    joining:"Uniéndote...", joinButton:"Unirse al grupo", myPools:"Mis grupos", loadingPools:"Cargando tus grupos...",
    noPools:"Todavía no perteneces a ningún grupo. Crea uno arriba o únete con un código.", viewPool:"Ver grupo",
    loadError:"No se han podido cargar tus grupos.", nameTooShort:"Pon a tu grupo un nombre de al menos 2 caracteres.",
    createError:"No se ha podido crear el grupo.", created:"¡Grupo creado correctamente!", inviteRequired:"Introduce primero un código de invitación.",
    joinError:"No has podido unirte a este grupo.", joined:"¡Te has unido al grupo!"
  },
  fr: {
    playTogether:"JOUEZ ENSEMBLE", pools:"Ligues", intro:"Créez une ligue avec vos amis et découvrez qui s’y connaît vraiment le mieux en football.",
    createPool:"Créer une ligue", createDescription:"Créez votre propre compétition et invitez vos amis.", poolName:"Nom de la ligue",
    poolNamePlaceholder:"ex. Damian & Friends", competition:"Compétition", creating:"Création de la ligue...", createButton:"Créer la ligue",
    joinPool:"Rejoindre une ligue", joinDescription:"Vous avez reçu un code d’invitation ? Saisissez-le ci-dessous.", inviteCode:"Code d’invitation",
    joining:"Connexion en cours...", joinButton:"Rejoindre la ligue", myPools:"Mes ligues", loadingPools:"Chargement de vos ligues...",
    noPools:"Vous n’avez encore rejoint aucune ligue. Créez-en une ci-dessus ou rejoignez-en une avec un code.", viewPool:"Voir la ligue",
    loadError:"Vos ligues n’ont pas pu être chargées.", nameTooShort:"Donnez à votre ligue un nom d’au moins 2 caractères.",
    createError:"La ligue n’a pas pu être créée.", created:"Ligue créée avec succès !", inviteRequired:"Saisissez d’abord un code d’invitation.",
    joinError:"Vous n’avez pas pu rejoindre cette ligue.", joined:"Vous avez rejoint la ligue !"
  },
  it: {
    playTogether:"GIOCA INSIEME", pools:"Gruppi", intro:"Crea un gruppo con i tuoi amici e scopri chi ne sa davvero di più di calcio.",
    createPool:"Crea un gruppo", createDescription:"Crea la tua competizione e invita i tuoi amici.", poolName:"Nome del gruppo",
    poolNamePlaceholder:"es. Damian & Friends", competition:"Competizione", creating:"Creazione gruppo...", createButton:"Crea gruppo",
    joinPool:"Unisciti a un gruppo", joinDescription:"Hai ricevuto un codice d’invito? Inseriscilo qui sotto.", inviteCode:"Codice d’invito",
    joining:"Accesso in corso...", joinButton:"Unisciti al gruppo", myPools:"I miei gruppi", loadingPools:"Caricamento dei tuoi gruppi...",
    noPools:"Non fai ancora parte di un gruppo. Creane uno qui sopra oppure unisciti con un codice.", viewPool:"Visualizza gruppo",
    loadError:"Non è stato possibile caricare i tuoi gruppi.", nameTooShort:"Dai al gruppo un nome di almeno 2 caratteri.",
    createError:"Non è stato possibile creare il gruppo.", created:"Gruppo creato con successo!", inviteRequired:"Inserisci prima un codice d’invito.",
    joinError:"Non è stato possibile unirti a questo gruppo.", joined:"Ti sei unito al gruppo!"
  },
  pt: {
    playTogether:"JOGA EM CONJUNTO", pools:"Grupos", intro:"Cria um grupo com os teus amigos e descobre quem percebe realmente mais de futebol.",
    createPool:"Criar um grupo", createDescription:"Cria a tua própria competição e convida os teus amigos.", poolName:"Nome do grupo",
    poolNamePlaceholder:"ex.: Damian & Friends", competition:"Competição", creating:"A criar grupo...", createButton:"Criar grupo",
    joinPool:"Entrar num grupo", joinDescription:"Recebeste um código de convite? Introduz-o abaixo.", inviteCode:"Código de convite",
    joining:"A entrar...", joinButton:"Entrar no grupo", myPools:"Os meus grupos", loadingPools:"A carregar os teus grupos...",
    noPools:"Ainda não estás em nenhum grupo. Cria um acima ou entra com um código.", viewPool:"Ver grupo",
    loadError:"Não foi possível carregar os teus grupos.", nameTooShort:"Dá ao teu grupo um nome com pelo menos 2 caracteres.",
    createError:"Não foi possível criar o grupo.", created:"Grupo criado com sucesso!", inviteRequired:"Introduz primeiro um código de convite.",
    joinError:"Não foi possível entrar neste grupo.", joined:"Entraste no grupo!"
  }
};

function isLanguageCode(value: string): value is LanguageCode {
  return ["nl","en","de","es","fr","it","pt"].includes(value);
}

function translateServerMessage(message: unknown, language: LanguageCode): string {
  if (typeof message !== "string" || !message.trim()) return "";
  const known: Record<string, TranslationKey> = {
    "De poule kon niet worden aangemaakt.":"createError",
    "Je kon niet deelnemen aan deze poule.":"joinError",
    "Vul eerst een uitnodigingscode in.":"inviteRequired"
  };
  const key=known[message];
  return key ? translations[language][key] : message;
}

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
  const [language, setLanguage] = useState<LanguageCode>("nl");
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("voetiq-language");
    const initialLanguage: LanguageCode =
      savedLanguage && isLanguageCode(savedLanguage) ? savedLanguage : "nl";

    setLanguage(initialLanguage);
    document.documentElement.lang = initialLanguage;

    function handleLanguageChange(event: Event) {
      const customEvent = event as CustomEvent<{ language?: string }>;
      const nextLanguage = customEvent.detail?.language;

      if (nextLanguage && isLanguageCode(nextLanguage)) {
        setLanguage(nextLanguage);
        document.documentElement.lang = nextLanguage;
      }
    }

    window.addEventListener("voetiq-language-change", handleLanguageChange);
    loadPools();

    return () => {
      window.removeEventListener("voetiq-language-change", handleLanguageChange);
    };
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
        t("loadError")
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
        t("loadError")
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
        t("nameTooShort")
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
        translateServerMessage(error.message, language) || t("createError")
      );
      setCreating(false);
      return;
    }

    setPoolName("");
    setMessage(`${t("created")} 🎉`);
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
        t("inviteRequired")
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
        translateServerMessage(error.message, language) || t("joinError")
      );
      setJoining(false);
      return;
    }

    setInviteCode("");
    setMessage(`${t("joined")} ⚽`);
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

  const t = (key: TranslationKey) =>
    translations[language][key] || translations.nl[key];

  return (
    <>
      <Navbar />

      <main
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at 50% 0%, rgba(15, 122, 70, 0.20) 0%, transparent 32%), linear-gradient(180deg, #00170e 0%, #00110a 48%, #000d08 100%)",
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
              {t("playTogether")}
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "42px",
                color: "white",
              }}
            >
              VoetIQ {t("pools")}
            </h1>

            <p
              style={{
                color: "#a9bbb0",
                fontSize: "17px",
                marginTop: "10px",
              }}
            >
              {t("intro")}
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
                background: "linear-gradient(145deg, #0b3523 0%, #082719 100%)",
                color: "white",
                border: "1px solid rgba(65,229,139,0.10)",
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
                  color: "white",
                }}
              >
                {t("createPool")}
              </h2>

              <p
                style={{
                  color: "#b7c9bf",
                  marginBottom: "22px",
                }}
              >
                {t("createDescription")}
              </p>

              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  color: "#eaf5ef",
                  marginBottom: "7px",
                }}
              >
                {t("poolName")}
              </label>

              <input
                value={poolName}
                onChange={(event) =>
                  setPoolName(event.target.value)
                }
                placeholder={t("poolNamePlaceholder")}
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
                  color: "#eaf5ef",
                  marginBottom: "7px",
                }}
              >
                {t("competition")}
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
                  ? t("creating")
                  : `${t("createButton")} →`}
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
                {t("joinPool")}
              </h2>

              <p
                style={{
                  color: "#c9ded1",
                  marginBottom: "22px",
                }}
              >
                {t("joinDescription")}
              </p>

              <label
                style={{
                  display: "block",
                  fontWeight: 700,
                  marginBottom: "7px",
                }}
              >
                {t("inviteCode")}
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
                {joining ? t("joining") : `${t("joinButton")} →`}
              </button>
            </section>
          </div>

          <section>
            <h2
              style={{
                color: "white",
                marginBottom: "18px",
                fontSize: "27px",
              }}
            >
              {t("myPools")}
            </h2>

            {loading ? (
              <p style={{ color: "#a9bbb0" }}>{t("loadingPools")}</p>
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
                {t("noPools")}
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
                        background: "linear-gradient(145deg, #0b3523 0%, #082719 100%)",
                        color: "white",
                        border: "1px solid rgba(65,229,139,0.10)",
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
                          color: "white",
                        }}
                      >
                        {pool.name}
                      </h3>

                      <div
                        style={{
                          color: "#b7c9bf",
                          fontSize: "14px",
                        }}
                      >
                        {comp.name}
                      </div>

                      <div
                        style={{
                          marginTop: "16px",
                          color: "#41e58b",
                          fontWeight: 800,
                        }}
                      >
                        {t("viewPool")} →
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
