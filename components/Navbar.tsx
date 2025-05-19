"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    signOut({ redirect: false });
    setIsMenuOpen(false);
    router.push("/");
  };

  // Organisation des liens selon le rôle
  const adminLinks = [
    { name: "Tirage", href: "/admin/tirage" },
    { name: "Matches", href: "/admin/matches" },
    { name: "Joueurs", href: "/admin/joueurs" },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-primary/80 backdrop-blur-lg shadow-lg transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-black text-cyan-400 tracking-widest drop-shadow-glass hover:text-cyan-300 transition"
        >
          FCA Derby Manager
        </Link>

        {/* Menu desktop */}
        <ul className="hidden lg:flex space-x-8 text-white font-semibold">
          {(session?.user ? adminLinks : visitorLinks).map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="relative px-2 py-1 hover:text-cyan-400 transition group"
              >
                <span className="group-hover:underline group-hover:underline-offset-4 transition-all">
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Section Auth desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          {session?.user ? (
            <div className="flex items-center space-x-4">
              <span className="text-cyan-300 font-semibold">
                Bienvenue
              </span>
              <Link
                href="/admin"
                className="btn btn-sm btn-cyan hover:bg-cyan-600 transition"
              >
                Tableau de bord
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-sm btn-outline btn-cyan hover:btn-primary transition"
              >
                Se déconnecter
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/auth/sign-up"
                className="btn btn-sm btn-outline btn-cyan hover:btn-primary transition"
              >
                Se connecter
              </Link>
              <Link
                href="/auth/sign-in"
                className="btn btn-sm btn-cyan hover:bg-cyan-600 transition"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          aria-label="Ouvrir le menu"
          className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center group text-cyan-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span
            className={`block h-1 w-7 rounded bg-current transition-transform duration-300 ease-in-out origin-center ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block h-1 w-7 rounded bg-current my-1 transition-opacity duration-300 ease-in-out ${
              isMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`block h-1 w-7 rounded bg-current transition-transform duration-300 ease-in-out origin-center ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Menu mobile animé */}
      <div
        className={`fixed inset-0 w-full h-full dark:bg-primary/80 rounded-md z-40 lg:hidden transition-transform duration-500 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        
      >
        <div className="flex flex-col h-full w-full dark:bg-primary/80 backdrop-blur-lg rounded-md shadow-lg ">
          <ul className="flex flex-col mt-14 dark:bg-primary/80 space-y-6 p-6 text-xl  font-bold text-white">
            {session?.user ? (
              <>
                <li className="text-cyan-300 font-semibold mb-2">
                  Bienvenue FCA !
                </li>
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setIsMenuOpen(false)}
                    className="block hover:text-cyan-400 transition"
                  >
                    Tableau de bord
                  </Link>
                </li>
                {adminLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block hover:text-cyan-400 transition"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-black btn btn-outline bg-slate-200 border-primary/80 mt-4"
                  >
                    Se déconnecter
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="text-cyan-300 font-semibold mb-2">
                  Bienvenue au FCA !
                </li>
                {visitorLinks.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="block hover:text-cyan-400 transition"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
                <div className="flex w-full space-x-4 mt-6">
                  <Link
                    href="/auth/sign-up"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn btn-outline bg-cyan-400 btn-cyan"
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/auth/sign-in"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn btn-cyan"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              </>
            )}
          </ul>
          {/* Bouton de fermeture */}
          <button
            aria-label="Fermer le menu"
            className="absolute top-6 right-6 text-cyan-400"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
