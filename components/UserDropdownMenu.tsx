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

  return (
    <div className="relative hidden lg:flex" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-2 px-4 py-2 border border-cyan-400 text-cyan-400 rounded-md hover:bg-cyan-400 hover:text-white transition"
      >
        <span>{isAuthenticated ? 'Bienvenue' : 'Compte'}</span>
        <svg
          className={`w-4 h-4 transform transition-transform ${
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

      {open && (
        <div
          className="absolute top-10 right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-xl animate-fade-in z-50 p-1 space-y-2"
        >
          {isAuthenticated ? (
            <>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                🧭 Tableau de bord
              </Link>
              <button
                onClick={() => {
                  onLogout?.();
                  setOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                🚪 Se déconnecter
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                🔐 Se connecter
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={() => setOpen(false)}
                className="block px-4 py-2 rounded-md hover:bg-gray-100 transition"
              >
                📝 S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
