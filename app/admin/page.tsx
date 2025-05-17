"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Link from 'next/link';

export default function AdminPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn(); 
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-bold text-gray-900">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Vous n'êtes pas autorisé à accéder à cette page.</p>
      </div>
    );
  }


  return (
    <div className="space-y-10 px-4  md:px-0 max-w-5xl mx-auto text-gray-900">
      <h1 className="text-4xl font-bold mb-8 mt-16 border-b-2 border-gray-300 pb-2">
        Tableau de bord
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Nouveau Tirage */}
        <Link href="/admin/tirage" className="card bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer no-underline">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-semibold mb-2 text-gray-800">
              Nouveau Tirage
            </h2>
            <p className="text-gray-600 mb-4">
              Créer un nouveau tirage d&apos;équipes
            </p>
            {/* Exemple d’indicateur */}
            <p className="text-sm text-gray-500">Dernier tirage : 10 mai 2025</p>
          </div>
        </Link>

        {/* Gestion des Joueurs */}
        <Link href="/admin/joueurs" className="card bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer no-underline">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-semibold mb-2 text-gray-800">
              Gestion des Joueurs
            </h2>
            <p className="text-gray-600 mb-4">
              Ajouter ou modifier les joueurs
            </p>
            {/* Exemple d’indicateur */}
            <p className="text-sm text-gray-500">Total joueurs : 28</p>
          </div>
        </Link>

        {/* Matchs */}
        <Link href="/admin/matches" className="card bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer no-underline">
          <div className="card-body p-6">
            <h2 className="card-title text-xl font-semibold mb-2 text-gray-800">
              Matchs
            </h2>
            <p className="text-gray-600 mb-4">Programmer des matchs</p>
            {/* Exemple d’indicateur */}
            <p className="text-sm text-gray-500">Prochain match : 15 mai 2025</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
