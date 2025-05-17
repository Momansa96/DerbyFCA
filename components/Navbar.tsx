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
    signOut({
      redirect: false,
    });
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0  z-50 bg-primary/90 backdrop-blur-md shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors">
          FCA Derby Manager
        </Link>

        {/* Menu desktop */}
        <ul className="hidden lg:flex space-x-8 text-white font-semibold tracking-wide">
          {session?.user ? (
            // Menu pour administrateur
            <>
              <li>
                <Link href="/admin" className="hover:text-cyan-400 transition">
                  Tableau de bord
                </Link>
              </li>
              <li>
                <Link href="/admin/tirage" className="hover:text-cyan-400 transition">
                  Derby
                </Link>
              </li>
              <li>
                <Link href="/admin/matches" className="hover:text-cyan-400 transition">
                  Matches
                </Link>
              </li>
              <li>
                <Link href="/admin/joueurs" className="hover:text-cyan-400 transition">
                  Joueurs
                </Link>
              </li>
              <li>
                <Link href="/admin/statistiques" className="hover:text-cyan-400 transition">
                  Statistiques
                </Link>
              </li>
            </>
          ) : (
            // Menu pour visiteur
            <>
              <li>
                <Link href="/visitors/matchs" className="hover:text-cyan-400 transition">
                  Derby
                </Link>
              </li>
              <li>
                <Link href="/visitors/tirages" className="hover:text-cyan-400 transition">
                  Tirages
                </Link>
              </li>
              <li>
                <Link href="/visitors/joueurs" className="hover:text-cyan-400 transition">
                  Équipes
                </Link>
              </li>
              <li>
                <Link href="/visitors/classement" className="hover:text-cyan-400 transition">
                  Statistiques
                </Link>
              </li>
              <li>
                <Link href="/visitors/club" className="hover:text-cyan-400 transition">
                  Le Club
                </Link>
              </li>
            </>
          )}
        </ul>

        {/* Section Auth desktop */}
        <div className="hidden lg:flex items-center space-x-4">
          {session?.user ? (
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">Bonjour, {session.user.name}</span>
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
              <Link href="/auth/sign-up" className="btn btn-sm btn-outline btn-cyan hover:btn-primary transition">
                Se connecter
              </Link>
              <Link href="/auth/sign-in" className="btn btn-sm btn-cyan hover:bg-cyan-600 transition">
                S'inscrire
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          aria-label="Toggle menu"
          className="lg:hidden relative w-10 h-10 flex flex-col justify-center items-center group text-cyan-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className={`block h-1 w-7 rounded bg-current transition-transform duration-300 ease-in-out origin-center ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-1 w-7 rounded bg-current my-1 transition-opacity duration-300 ease-in-out ${isMenuOpen ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-1 w-7 rounded bg-current transition-transform duration-300 ease-in-out origin-center ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-primary/95 backdrop-blur-md shadow-lg border-t border-cyan-600">
          <ul className="flex flex-col px-6 py-4 space-y-4 text-white font-semibold tracking-wide">
            {session?.user ? (
              // Menu mobile pour administrateur
              <>
                <li className="text-cyan-300 font-semibold">Bonjour, {session.user.name}</li>
                <li>
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Tableau de bord
                  </Link>
                </li>
                <li>
                  <Link href="/admin/tirage" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Derby
                  </Link>
                </li>
                <li>
                  <Link href="/admin/matches" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Matches
                  </Link>
                </li>
                <li>
                  <Link href="/admin/joueurs" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Joueurs
                  </Link>
                </li>
                <li>
                  <Link href="/admin/statistiques" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Statistiques
                  </Link>
                </li>
                <hr className="border-cyan-600" />
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left btn btn-outline btn-cyan"
                  >
                    Se déconnecter
                  </button>
                </li>
              </>
            ) : (
              // Menu mobile pour visiteur
              <>
                <li>
                  <Link href="/derby" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Derby
                  </Link>
                </li>
                <li>
                  <Link href="/equipes" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Équipes
                  </Link>
                </li>
                <li>
                  <Link href="/joueurs" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Joueurs
                  </Link>
                </li>
                <li>
                  <Link href="/statistiques" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Statistiques
                  </Link>
                </li>
                <li>
                  <Link href="/club" onClick={() => setIsMenuOpen(false)} className="block hover:text-cyan-400 transition">
                    Le Club
                  </Link>
                </li>
                <hr className="border-cyan-600" />
                <div className="flex justify-start space-x-4 items-center">
                <li>
                  <Link href="/auth/sign-up" onClick={() => setIsMenuOpen(false)} className="block btn btn-outline btn-cyan text-center p-4">
                    Se connecter
                  </Link>
                </li>
                <li>
                  <Link href="/auth/sign-in" onClick={() => setIsMenuOpen(false)} className="block btn btn-cyan text-center p-4">
                    S'inscrire
                  </Link>
                </li>
                </div>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}