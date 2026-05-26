import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import HomeTopLink from "./HomeTopLink";
import SectionLink from "./SectionLink";

const navLinkClass =
  "flex min-h-11 items-center rounded-xl px-3 py-2 text-sm font-medium transition hover:bg-zinc-100 md:min-h-0 md:py-1.5";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileProfileOpen, setMobileProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const dashboardPath = user?.role === "admin" ? "/admin" : "/member";

  useEffect(() => {
    queueMicrotask(() => {
      setOpen(false);
      setProfileOpen(false);
      setMobileProfileOpen(false);
    });
  }, [location.pathname, location.hash]);

  const handleLogout = () => {
    logout();
    toast.success("Anda telah logout");
    setOpen(false);
    setProfileOpen(false);
    setMobileProfileOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    if (!profileOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setProfileOpen(false);
    };
    const onPointer = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 text-zinc-800 shadow-sm backdrop-blur-md supports-backdrop-filter:bg-white/70">
      <div className="container-base flex min-h-14 items-center justify-between gap-3 py-2 md:min-h-16 md:py-0">
        <HomeTopLink
          className="flex min-h-11 min-w-11 shrink-0 items-center text-zinc-900 md:min-h-0"
          aria-label="Beranda Mamuri"
        >
          <img
            src="/logo.png"
            alt=""
            className="h-11 w-11 rounded object-contain md:h-14 md:w-14"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
        </HomeTopLink>
        <button
          type="button"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-zinc-300 bg-white px-3 text-sm font-semibold text-zinc-800 md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? "Tutup" : "Menu"}
        </button>
        <nav className="hidden items-center gap-1 md:flex md:gap-2 lg:gap-3" aria-label="Utama">
          <HomeTopLink className={navLinkClass}>
            Home
          </HomeTopLink>
          <SectionLink sectionId="about" className={navLinkClass}>
            About
          </SectionLink>
          <SectionLink sectionId="contact" className={navLinkClass}>
            Contact
          </SectionLink>
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath} className={navLinkClass}>
                Dashboard
              </Link>
              <div className="relative ml-1" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex min-h-10 items-center gap-1 rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm font-semibold transition hover:bg-zinc-50"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                >
                  Profile
                  <span className="text-xs text-zinc-500" aria-hidden>
                    {profileOpen ? "▲" : "▼"}
                  </span>
                </button>
                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-1 min-w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-lg"
                  >
                    <Link
                      role="menuitem"
                      to="/account/profile"
                      className="block px-4 py-2.5 text-sm text-zinc-800 hover:bg-zinc-100"
                      onClick={() => setProfileOpen(false)}
                    >
                      Ubah profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      className="w-full px-4 py-2.5 text-left text-sm text-zinc-800 hover:bg-zinc-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="btn-primary ml-1 px-4 py-2.5! text-sm">
              Login
            </Link>
          )}
        </nav>
      </div>
      {open && (
        <div id="mobile-nav" className="container-base border-t border-zinc-100 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1 rounded-2xl border border-zinc-200 bg-white p-2 shadow-md">
            <HomeTopLink className={navLinkClass}>
              Home
            </HomeTopLink>
            <SectionLink sectionId="about" className={navLinkClass}>
              About
            </SectionLink>
            <SectionLink sectionId="contact" className={navLinkClass}>
              Contact
            </SectionLink>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath} className={navLinkClass}>
                  Dashboard
                </Link>
                <div className="rounded-xl border border-zinc-100">
                  <button
                    type="button"
                    className="flex min-h-11 w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-zinc-800 hover:bg-zinc-50"
                    onClick={() => setMobileProfileOpen((p) => !p)}
                    aria-expanded={mobileProfileOpen}
                  >
                    Profile
                    <span className="text-xs text-zinc-500">{mobileProfileOpen ? "▲" : "▼"}</span>
                  </button>
                  {mobileProfileOpen && (
                    <div className="border-t border-zinc-100 pb-1">
                      <Link to="/account/profile" className={`${navLinkClass} pl-5`}>
                        Ubah profile
                      </Link>
                      <button type="button" className={`${navLinkClass} w-full pl-5 text-left`} onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary mt-1 min-h-12 w-full justify-center py-3 text-base">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
