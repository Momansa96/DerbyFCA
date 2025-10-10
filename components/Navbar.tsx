"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import UserDropdown from "./UserDropdownMenu";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const router = useRouter();

  const handleLogout = () => {
    signOut({ redirect: false });
    setIsMenuOpen(false);
    router.push("/");
  };

  // Fetch count of new applications (admin only)
  useEffect(() => {
    if (!session?.user) return;

    const fetchCount = async () => {
      try {
        const res = await fetch("/api/applications/count");
        if (res.ok) {
          const data = await res.json();
          setNewApplicationsCount(data.count || 0);
        }
      } catch (error) {
        console.error("Erreur fetch count:", error);
      }
    };

    fetchCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [session]);

  // Organisation des liens selon le rôle
  const adminLinks = [
    { name: "Tirage", href: "/admin/tirage" },
    { name: "Matches", href: "/admin/matches" },
    { name: "Joueurs", href: "/admin/joueurs" },
    { name: "Adhésions", href: "/admin/adhesions", badge: newApplicationsCount },
    { name: "Statistiques", href: "/admin/statistiques" },
  ];

  const visitorLinks = [
    { name: "Derby", href: "/visitors/tirages" },
    { name: "Calendrier", href: "/visitors/matchs" },
    { name: "L'equipe", href: "/visitors/joueurs" },
    { name: "Statistiques", href: "/visitors/classement" },
    { name: "Le Club", href: "/visitors/club" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-indigo-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl shadow-2xl border-b border-cyan-500/20 transition-all duration-300">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <Image
                src="/images/default.jpeg"
                alt="Logo FCA"
                width={48}
                height={48}
                className="object-contain rounded-full ring-2 ring-cyan-400/50 group-hover:ring-cyan-400 transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300" />
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                FCA
              </div>
              <div className="text-xs text-cyan-400 font-medium -mt-1">
                Derby Manager
              </div>
            </div>
          </Link>

          {/* Menu desktop */}
          <ul className="hidden lg:flex items-center space-x-2">
            {(session?.user ? adminLinks : visitorLinks).map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="relative px-4 py-2 group transition-all duration-200 rounded-lg hover:bg-white/10"
                >
                  <span className="relative z-10 text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors duration-200">
                    {item.name}
                  </span>

                  {/* Badge notification */}
                  {'badge' in item && item.badge && item.badge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center animate-pulse shadow-lg shadow-red-500/50">
                      {item.badge}
                    </span>
                  )}

                  {/* Underline animation */}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-400 group-hover:w-3/4 transition-all duration-300 rounded-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Section Auth desktop */}
          <div className="hidden lg:block">
            <UserDropdown
              isAuthenticated={!!session?.user}
              onLogout={handleLogout}
            />
          </div>

          {/* Hamburger mobile */}
          <button
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center group text-cyan-300 hover:text-cyan-200 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span
              className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                isMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded-full bg-current my-1.5 transition-all duration-300 ease-in-out ${
                isMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
              }`}
            />
            <span
              className={`block h-0.5 w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
                isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Overlay backdrop mobile */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Menu mobile drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-gradient-to-b from-indigo-950/98 to-black/98 backdrop-blur-xl shadow-2xl z-50 lg:hidden transition-transform duration-300 ease-out border-l border-cyan-500/20 ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Header drawer */}
          <div className="flex items-center justify-between p-6 border-b border-cyan-500/20">
            <div className="flex items-center gap-3">
              <Image
                src="/images/default.jpeg"
                alt="Logo FCA"
                width={40}
                height={40}
                className="rounded-full ring-2 ring-cyan-400/50"
              />
              <div>
                <div className="text-white font-bold text-lg">FCA</div>
                <div className="text-cyan-400 text-xs font-medium -mt-1">Derby Manager</div>
              </div>
            </div>
            <button
              aria-label="Fermer le menu"
              className="text-cyan-400 hover:text-cyan-300 transition-colors p-2 hover:bg-white/10 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Menu items */}
          <nav className="flex-1 px-4 py-6">
            {session?.user ? (
              <>
                <div className="mb-6 px-3 py-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <p className="text-cyan-300 font-semibold text-sm">👋 Bienvenue Admin</p>
                </div>

                <Link
                  href="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-3 text-white hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all duration-200 group mb-2"
                >
                  <svg className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="font-semibold">Tableau de bord</span>
                </Link>

                <div className="space-y-1">
                  {adminLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-3 text-white hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all duration-200 group"
                    >
                      <span className="font-semibold">{item.name}</span>
                      {'badge' in item && item.badge && item.badge > 0 && (
                        <span className="bg-gradient-to-br from-red-500 to-red-600 text-white text-xs font-bold rounded-full min-w-[24px] h-6 px-2 flex items-center justify-center shadow-lg">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full mt-6 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Se déconnecter
                </button>
              </>
            ) : (
              <>
                <div className="mb-6 px-3 py-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                  <p className="text-cyan-300 font-semibold text-sm">👋 Bienvenue au FCA</p>
                </div>

                <div className="space-y-1 mb-6">
                  {visitorLinks.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-white hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all duration-200 group font-semibold"
                    >
                      {item.name}
                      <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                </div>

                <div className="space-y-3 pt-6 border-t border-cyan-500/20">
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              </>
            )}
          </nav>

          {/* Footer drawer */}
          <div className="p-4 border-t border-cyan-500/20 bg-black/30">
            <p className="text-xs text-gray-400 text-center">
              © 2025 Football Club Atrokpocodji
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
