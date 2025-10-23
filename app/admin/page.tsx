"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import Link from 'next/link';
import { motion } from "framer-motion";
import CarteDernierDerby from "@/components/dashboard/CarteDernierDerby";
import CarteGestionJoueurs from "@/components/dashboard/CarteGestionJoueur";
import CarteProchainMatch from "@/components/dashboard/CarteProchainMatch";
import CarteAdhesions from "@/components/dashboard/CarteAdhesions";
import CarteStatistiques from "@/components/dashboard/CarteStatistiques";
import CarteCotisations from "@/components/dashboard/CarteCotisations";

export default function AdminPage() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn();
    }
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0A0E27]">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-400 font-medium">Chargement...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0A0E27]">
        <p className="text-gray-400">Vous n&apos;êtes pas autorisé à accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Tableau de bord</h1>
          </div>
          <p className="text-gray-400 text-sm">Vue d&apos;ensemble de la gestion du FCA</p>
        </div>

        {/* Cartes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Nouveau Tirage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Link
              href="/admin/tirage"
              className="block bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all group"
            >
              <CarteDernierDerby />
            </Link>
          </motion.div>

          {/* Gestion des Joueurs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/admin/joueurs"
              className="block bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all group"
            >
              <CarteGestionJoueurs />
            </Link>
          </motion.div>

          {/* Matchs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/admin/matches"
              className="block bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all group"
            >
              <CarteProchainMatch />
            </Link>
          </motion.div>

          {/* Cotisations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/admin/cotisations"
              className="block bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all group"
            >
              <CarteCotisations />
            </Link>
          </motion.div>

          {/* Adhésions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/admin/adhesions"
              className="block bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all group"
            >
              <CarteAdhesions />
            </Link>
          </motion.div>

          {/* Statistiques */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              href="/admin/statistiques"
              className="block bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl hover:border-cyan-500/50 transition-all group"
            >
              <CarteStatistiques />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}