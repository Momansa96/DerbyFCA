"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Plus,
  History,
  Settings,
  AlertCircle
} from 'lucide-react';
import ContributionSummaryCard from '@/components/cotisations/ContributionSummaryCard';

interface Stats {
  totalPlayers: number;
  totalCollected: number;
  totalExpected: number;
  playersUpToDate: number;
  playersLate: number;
  weeksElapsed: number;
  year: number;
}

export default function CotisationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/contributions/summary');
      if (!response.ok) throw new Error('Erreur lors du chargement des statistiques');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const collectionRate = stats ? ((stats.totalCollected / stats.totalExpected) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Gestion des Cotisations</h1>
          </div>
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-cyan-400" />
              Comment ça marche ?
            </h2>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-semibold text-white">💰 Montant :</span> Chaque membre cotise <span className="text-cyan-400 font-bold">200 FCFA</span> chaque samedi pour financer les activités du club.
              </p>
              <p>
                <span className="font-semibold text-white">📅 Enregistrement :</span> Allez sur <span className="text-cyan-400 font-semibold">&quot;Enregistrer des paiements&quot;</span>, sélectionnez la date du samedi, cochez les membres présents et enregistrez.
              </p>
              <p>
                <span className="font-semibold text-white">📊 Suivi :</span> Les statistiques ci-dessous vous permettent de suivre en temps réel qui est à jour et qui est en retard.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            {stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <ContributionSummaryCard
                  title="Total collecté"
                  value={`${stats.totalCollected.toLocaleString()} FCFA`}
                  subtitle={`sur ${stats.totalExpected.toLocaleString()} attendus`}
                  icon={DollarSign}
                  color="cyan"
                  delay={0.1}
                />
                <ContributionSummaryCard
                  title="Taux de collecte"
                  value={`${collectionRate}%`}
                  subtitle={`Semaine ${stats.weeksElapsed}/52`}
                  icon={TrendingUp}
                  color="green"
                  delay={0.2}
                />
                <ContributionSummaryCard
                  title="Membres à jour"
                  value={stats.playersUpToDate}
                  subtitle={`sur ${stats.totalPlayers} membres`}
                  icon={Users}
                  color="indigo"
                  delay={0.3}
                />
                <ContributionSummaryCard
                  title="Membres en retard"
                  value={stats.playersLate}
                  subtitle="Nécessite un suivi"
                  icon={AlertCircle}
                  color={stats.playersLate > 0 ? 'orange' : 'green'}
                  delay={0.4}
                />
              </div>
            )}

            {/* Actions rapides */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Actions rapides
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push('/admin/cotisations/enregistrer')}
                  className="p-4 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all group"
                >
                  <Plus className="w-6 h-6 text-white mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white text-left">Enregistrer des paiements</h3>
                  <p className="text-sm text-white/80 text-left mt-1">
                    Enregistrer les cotisations du samedi
                  </p>
                </button>

                <button
                  onClick={() => router.push('/admin/cotisations/historique')}
                  className="p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all group"
                >
                  <History className="w-6 h-6 text-gray-300 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white text-left">Historique</h3>
                  <p className="text-sm text-gray-400 text-left mt-1">
                    Consulter l&apos;historique complet
                  </p>
                </button>

                <button
                  onClick={() => router.push('/admin/cotisations/semaines')}
                  className="p-4 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg transition-all group"
                >
                  <Settings className="w-6 h-6 text-gray-300 mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-bold text-white text-left">Gestion des semaines</h3>
                  <p className="text-sm text-gray-400 text-left mt-1">
                    Gérer les semaines de cotisation
                  </p>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}