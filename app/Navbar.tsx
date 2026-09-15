"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
const [open, setOpen] = useState(false);
const [loggedIn, setLoggedIn] = useState(false);

useEffect(() => {
checkUser();

```
const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((event, session) => {
  setLoggedIn(!!session);

  if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
    setOpen(false);
  }
});

return () => {
  subscription.unsubscribe();
};
```

}, []);

async function checkUser() {
const {
data: { user },
} = await supabase.auth.getUser();

```
setLoggedIn(!!user);
```

}

function closeMenu() {
setOpen(false);
}

return (
<>
<header
style={{
position: "sticky",
top: 0,
zIndex: 1000,
background: "rgba(2, 14, 9, 0.92)",
borderBottom: "1px solid rgba(75,255,153,0.10)",
backdropFilter: "blur(16px)",
}}
>
<div
style={{
maxWidth: "1200px",
margin: "0 auto",
padding: "16px 20px",
display: "flex",
alignItems: "center",
justifyContent: "space-between",
}}
>
<Link
href="/"
onClick={closeMenu}
style={{
color: "white",
textDecoration: "none",
fontSize: "25px",
fontWeight: 900,
letterSpacing: "-1px",
}}
>
Voet<span style={{ color: "#2ee681" }}>IQ</span> </Link>

```
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu openen"
        aria-expanded={open}
        style={{
          width: "45px",
          height: "45px",
          borderRadius: "12px",
          border: "1px solid rgba(75,255,153,0.15)",
          background: "rgba(255,255,255,0.04)",
          color: "white",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "5px",
        }}
      >
        <span style={lineStyle} />
        <span style={lineStyle} />
        <span style={lineStyle} />
      </button>
    </div>
  </header>

  {open && (
    <>
      <div
        onClick={closeMenu}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(0,0,0,0.45)",
        }}
      />

      <nav
        style={{
          position: "fixed",
          top: "78px",
          right: "20px",
          zIndex: 999,
          width: "260px",
          background:
            "linear-gradient(145deg, #082418 0%, #04150d 100%)",
          border: "1px solid rgba(75,255,153,0.14)",
          borderRadius: "18px",
          padding: "10px",
          boxShadow: "0 25px 70px rgba(0,0,0,0.5)",
        }}
      >
        <Link href="/" onClick={closeMenu} style={menuItemStyle}>
          🏠
          <span>Home</span>
        </Link>

        <Link
          href="/wedstrijden"
          onClick={closeMenu}
          style={menuItemStyle}
        >
          ⚽
          <span>Wedstrijden</span>
        </Link>

        <Link
          href="/ranglijst"
          onClick={closeMenu}
          style={menuItemStyle}
        >
          🏆
          <span>Ranglijst</span>
        </Link>

        {loggedIn && (
          <Link
            href="/profiel"
            onClick={closeMenu}
            style={menuItemStyle}
          >
            👤
            <span>Mijn profiel</span>
          </Link>
        )}

        {!loggedIn && (
          <>
            <div
              style={{
                height: "1px",
                background: "rgba(255,255,255,0.07)",
                margin: "8px 4px",
              }}
            />

            <Link
              href="/inloggen"
              onClick={closeMenu}
              style={menuItemStyle}
            >
              🔑
              <span>Inloggen</span>
            </Link>

            <Link
              href="/registreren"
              onClick={closeMenu}
              style={menuItemStyle}
            >
              📝
              <span>Registreren</span>
            </Link>
          </>
        )}
      </nav>
    </>
  )}
</>
```

);
}

const lineStyle = {
width: "21px",
height: "2px",
background: "#2ee681",
borderRadius: "5px",
};

const menuItemStyle = {
dis
