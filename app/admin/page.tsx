"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useEffect } from "react";
import Link from 'next/link';
import { UserCircleIcon, ArrowRightCircleIcon, UsersIcon, SquareXIcon, CalendarDaysIcon } from "lucide-react";
import CarteDernierDerby from "@/components/dashboard/CarteDernierDerby";
import CarteGestionJoueurs from "@/components/dashboard/CarteGestionJoueur";
import CarteProchainMatch from "@/components/dashboard/CarteProchainMatch";

export default function AdminPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <p className="text-2xl font-bold text-gray-900 animate-pulse">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p>Vous n&apos;êtes pas autorisé à accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Header */}
      <header className="flex items-center justify-between py-6 px-6 md:px-12 bg-white/80 shadow-sm sticky top-0 z-10 backdrop-blur">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <SquareXIcon className="h-7 w-7 text-blue-600" />
          Tableau de bord
        </h1>
        
      </header>

      {/* Cartes */}
      <main className="space-y-10 px-4 md:px-0 max-w-5xl mx-auto text-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {/* Nouveau Tirage */}
          <Link href="/admin/tirage" className="group card bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-2xl transition-all cursor-pointer no-underline hover:-translate-y-1">
            <CarteDernierDerby />
          </Link>

          {/* Gestion des Joueurs */}
          <Link href="/admin/joueurs" className="group card bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-2xl transition-all cursor-pointer no-underline hover:-translate-y-1">
            <CarteGestionJoueurs />
          </Link>

          {/* Matchs */}
          <Link href="/admin/matches" className="group card bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-2xl transition-all cursor-pointer no-underline hover:-translate-y-1">
            <CarteProchainMatch />
          </Link>
        </div>
      </main>
    </div>
  );
}
