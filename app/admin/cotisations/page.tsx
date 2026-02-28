"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import {
  DollarSign,
  Users,
  TrendingUp,
  Calendar,
  Plus,
  History,
  Settings,
  AlertCircle,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import ContributionSummaryCard from '@/components/cotisations/ContributionSummaryCard';
import ContributionProgressBar from '@/components/cotisations/ContributionProgressBar';

interface Stats {
  totalPlayers: number;
  totalCollected: number;
  totalExpected: number;
  playersUpToDate: number;
  playersLate: number;
  weeksElapsed: number;
  year: number;
}

interface PlayerSummary {
  playerId: string;
  fullName: string;
  alias: string | null;
  profilePhoto: string | null;
  totalPaid: number;
  weeksPaid: number;
  weeksElapsed: number;
  expectedAmount: number;
  balance: number;
  status: 'up_to_date' | 'late' | 'very_late' | 'ahead';
  lastContribution: {
    date: string;
    amount: number;
    weekNumber: number;
  } | null;
}

export default function CotisationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [players, setPlayers] = useState<PlayerSummary[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/contributions/summary');
      if (!response.ok) throw new Error('Erreur lors du chargement des statistiques');
      const data = await response.json();
      setStats(data.stats);
      setPlayers(data.summary || []);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des statistiques');
    } finally {
      setLoading(false);
    }
  };

  const collectionRate = stats ? ((stats.totalCollected / stats.totalExpected) * 100).toFixed(1) : 0;

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (player.alias && player.alias.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'up_to_date') return matchesSearch && (player.status === 'up_to_date' || player.status === 'ahead');
    if (filterStatus === 'late') return matchesSearch && (player.status === 'late' || player.status === 'very_late');
    return matchesSearch;
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ahead':
        return { color: 'text-blue-400', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30', icon: TrendingUp, label: 'En avance' };
      case 'up_to_date':
        return { color: 'text-green-400', bgColor: 'bg-green-500/10', borderColor: 'border-green-500/30', icon: CheckCircle, label: 'À jour' };
      case 'late':
        return { color: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', icon: AlertTriangle, label: 'En retard' };
      case 'very_late':
        return { color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', icon: XCircle, label: 'Très en retard' };
      default:
        return { color: 'text-gray-400', bgColor: 'bg-gray-500/10', borderColor: 'border-gray-500/30', icon: CheckCircle, label: 'Inconnu' };
    }
  };

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

            {/* Liste des joueurs et leurs redevances */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-6"
            >
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                Situation des membres
              </h2>

              {/* Recherche et filtres */}
              <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un membre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                <div className="flex gap-2">
                  {[
                    { key: 'all', label: 'Tous', activeClass: 'bg-cyan-500 text-white' },
                    { key: 'up_to_date', label: 'À jour', activeClass: 'bg-green-500 text-white' },
                    { key: 'late', label: 'En retard', activeClass: 'bg-orange-500 text-white' },
                  ].map(f => (
                    <button
                      key={f.key}
                      onClick={() => setFilterStatus(f.key)}
                      className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                        filterStatus === f.key
                          ? f.activeClass
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Liste */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredPlayers.map((player, index) => {
                  const config = getStatusConfig(player.status);
                  const Icon = config.icon;

                  return (
                    <motion.div
                      key={player.playerId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-4 rounded-lg border ${config.borderColor} bg-gray-900/30`}
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Photo + Nom */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Image
                            src={player.profilePhoto || '/images/avatar-default.png'}
                            alt={player.fullName}
                            width={44}
                            height={44}
                            className="rounded-full object-cover border-2 border-gray-700 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <h3 className="font-bold text-white text-sm truncate">{player.fullName}</h3>
                            {player.alias && (
                              <p className="text-xs text-cyan-400 truncate">&quot;{player.alias}&quot;</p>
                            )}
                          </div>
                        </div>

                        {/* Barre de progression */}
                        <div className="flex-1 w-full sm:w-auto">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Semaines payées</span>
                            <span className="font-semibold text-white">{player.weeksPaid} / {player.weeksElapsed}</span>
                          </div>
                          <ContributionProgressBar
                            weeksPaid={player.weeksPaid}
                            weeksElapsed={player.weeksElapsed}
                            showLabel={false}
                          />
                        </div>

                        {/* Solde + Statut */}
                        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                          <p className={`text-lg font-bold ${config.color}`}>
                            {player.balance >= 0 ? '+' : ''}{player.balance.toLocaleString()} F
                          </p>
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                            <Icon size={12} className={config.color} />
                            <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {filteredPlayers.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Aucun membre trouvé
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}