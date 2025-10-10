'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

type Props = {
  isAuthenticated: boolean;
  onLogout?: () => void;
};

export default function UserDropdown({ isAuthenticated, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer au clic en dehors
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fermer avec Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      {isAuthenticated ? (
        // Bouton authentifié
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="true"
          className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-400/40 hover:border-cyan-400/60 text-white rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg group-hover:scale-110 transition-transform">
            A
          </div>
          <span className="font-semibold text-sm">Admin</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      ) : (
        // Boutons non authentifié
        <div className="flex items-center gap-3">
          <Link
            href="/auth/sign-in"
            className="px-4 py-2 text-sm font-semibold text-white hover:text-cyan-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg"
          >
            Connexion
          </Link>
          <Link
            href="/auth/sign-up"
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all duration-200 transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900"
          >
            S&apos;inscrire
          </Link>
        </div>
      )}

      {/* Dropdown menu */}
      {open && isAuthenticated && (
        <div
          className="absolute top-full right-0 mt-2 w-56 bg-gradient-to-b from-indigo-950/98 to-black/98 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-2xl animate-fade-in z-50 overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-cyan-500/20 bg-cyan-500/5">
            <p className="text-xs text-cyan-400 font-semibold uppercase tracking-wide">
              Compte Administrateur
            </p>
          </div>

          {/* Menu items */}
          <div className="p-2">
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-3 py-2.5 text-white hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="font-semibold text-sm">Tableau de bord</span>
            </Link>

            <Link
              href="/admin/joueurs"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-3 py-2.5 text-white hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="font-semibold text-sm">Joueurs</span>
            </Link>

            <Link
              href="/admin/statistiques"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 px-3 py-2.5 text-white hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="font-semibold text-sm">Statistiques</span>
            </Link>
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-cyan-500/20">
            <button
              onClick={() => {
                onLogout?.();
                setOpen(false);
              }}
              className="group w-full flex items-center gap-3 px-3 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200"
            >
              <svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="font-semibold text-sm">Se déconnecter</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
