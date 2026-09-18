"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();

  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
      setMobileOpen(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function checkUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    setLoggedIn(!!user);
  }

  async function handleLogout() {
    await supabase.auth.signOut({ scope: "local" });
    setMobileOpen(false);
    window.location.href = "/";
  }

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      <header className="voetiq-header">
        <div className="voetiq-navbar">
          <Link href="/" className="voetiq-logo">
            Voet<span>IQ</span>
          </Link>

          <nav className="desktop-nav">
            <NavLink
              href="/"
              label="Home"
              active={isActive("/")}
            />

            <NavLink
              href="/wedstrijden"
              label="Wedstrijden"
              active={isActive("/wedstrijden")}
            />

            <NavLink
              href="/poules"
              label="Poules"
              active={isActive("/poules")}
            />

            <NavLink
              href="/ranglijst"
              label="Ranglijst"
              active={isActive("/ranglijst")}
            />

            <a
              href="/#hoe-werkt-het"
              className="nav-link"
            >
              Hoe werkt het?
            </a>
          </nav>

          <div className="desktop-account">
            {loggedIn ? (
              <>
                <Link
                  href="/profiel"
                  className={
                    isActive("/profiel")
                      ? "profile-button active-profile"
                      : "profile-button"
                  }
                >
                  Mijn profiel
                </Link>

                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/inloggen"
                  className="login-link"
                >
                  Inloggen
                </Link>

                <Link
                  href="/registreren"
                  className="register-button"
                >
                  Speel gratis
                </Link>
              </>
            )}
          </div>

          <button
            className="mobile-menu-button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu openen"
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>

        {mobileOpen && (
          <div className="mobile-menu">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/wedstrijden"
              onClick={() => setMobileOpen(false)}
            >
              Wedstrijden
            </Link>

            <Link
              href="/poules"
              onClick={() => setMobileOpen(false)}
            >
              Poules
            </Link>

            <Link
              href="/ranglijst"
              onClick={() => setMobileOpen(false)}
            >
              Ranglijst
            </Link>

            <a
              href="/#hoe-werkt-het"
              onClick={() => setMobileOpen(false)}
            >
              Hoe werkt het?
            </a>

            <div className="mobile-divider" />

            {loggedIn ? (
              <>
                <Link
                  href="/profiel"
                  onClick={() => setMobileOpen(false)}
                >
                  Mijn profiel
                </Link>

                <button onClick={handleLogout}>
                  Uitloggen
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/inloggen"
                  onClick={() => setMobileOpen(false)}
                >
                  Inloggen
                </Link>

                <Link
                  href="/registreren"
                  onClick={() => setMobileOpen(false)}
                  className="mobile-register"
                >
                  Speel gratis
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      <style jsx global>{`
        .voetiq-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(4, 22, 14, 0.97);
          border-bottom: 1px solid rgba(75, 255, 153, 0.12);
          backdrop-filter: blur(16px);
          box-shadow: 0 3px 18px rgba(0, 0, 0, 0.12);
        }

        .voetiq-navbar {
          max-width: 1200px;
          min-height: 72px;
          margin: 0 auto;
          padding: 0 24px;

          display: flex;
          align-items: center;
          gap: 36px;
        }

        .voetiq-logo {
          color: white;
          text-decoration: none;
          font-size: 27px;
          font-weight: 950;
          letter-spacing: -1.4px;
          white-space: nowrap;
        }

        .voetiq-logo span {
          color: #2ee681;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 6px;
          flex: 1;
        }

        .nav-link {
          position: relative;
          display: flex;
          align-items: center;
          height: 72px;
          padding: 0 14px;

          color: #c9d8d0;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;

          transition:
            color 0.18s ease,
            background 0.18s ease;
        }

        .nav-link:hover {
          color: white;
        }

        .nav-link.active {
          color: #62ef9d;
        }

        .nav-link.active::after {
          content: "";
          position: absolute;
          left: 14px;
          right: 14px;
          bottom: 0;
          height: 3px;
          background: #2ee681;
          border-radius: 5px 5px 0 0;
        }

        .desktop-account {
          display: flex;
          align-items: center;
          gap: 10px;
          white-space: nowrap;
        }

        .login-link {
          color: #e7f3ec;
          text-decoration: none;
          font-size: 14px;
          font-weight: 800;
          padding: 10px 12px;
        }

        .register-button {
          background: #2ee681;
          color: #052c1b;
          text-decoration: none;
          padding: 11px 17px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 900;
          transition:
            transform 0.18s ease,
            background 0.18s ease;
        }

        .register-button:hover {
          background: #55ed98;
          transform: translateY(-1px);
        }

        .profile-button {
          color: #e9f5ee;
          text-decoration: none;
          padding: 10px 13px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
        }

        .profile-button:hover,
        .active-profile {
          background: rgba(255, 255, 255, 0.07);
          color: #5bef9b;
        }

        .logout-button {
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
          color: #dce9e2;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
        }

        .logout-button:hover {
          background: rgba(255, 255, 255, 0.08);
          color: white;
        }

        .mobile-menu-button {
          display: none;
          width: 43px;
          height: 43px;
          border: 1px solid rgba(75, 255, 153, 0.15);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          cursor: pointer;

          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
        }

        .mobile-menu-button span {
          width: 20px;
          height: 2px;
          background: #2ee681;
          border-radius: 10px;
        }

        .mobile-menu {
          display: none;
        }

        @media (max-width: 950px) {
          .desktop-nav,
          .desktop-account {
            display: none;
          }

          .voetiq-navbar {
            justify-content: space-between;
            min-height: 68px;
          }

          .mobile-menu-button {
            display: flex;
          }

          .mobile-menu {
            display: flex;
            flex-direction: column;
            padding: 8px 20px 20px;
            background: #061b11;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
          }

          .mobile-menu a,
          .mobile-menu button {
            width: 100%;
            box-sizing: border-box;
            padding: 14px 12px;
            color: #e8f4ed;
            text-decoration: none;
            font-size: 15px;
            font-weight: 750;
            text-align: left;
            border: none;
            background: transparent;
            border-radius: 8px;
            cursor: pointer;
          }

          .mobile-menu a:hover,
          .mobile-menu button:hover {
            background: rgba(255, 255, 255, 0.05);
          }

          .mobile-divider {
            height: 1px;
            background: rgba(255, 255, 255, 0.08);
            margin: 7px 0;
          }

          .mobile-menu .mobile-register {
            background: #2ee681;
            color: #052c1b;
            margin-top: 5px;
            text-align: center;
          }
        }

        @media (max-width: 600px) {
          .voetiq-navbar {
            padding: 0 16px;
          }

          .voetiq-logo {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={
        active ? "nav-link active" : "nav-link"
      }
    >
      {label}
    </Link>
  );
}
