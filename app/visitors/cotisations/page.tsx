"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  DollarSign,
  TrendingUp,
  Users,
  Search,
  CheckCircle,
  AlertTriangle,
  XCircle,
  TrendingUpIcon
} from 'lucide-react';
import ContributionProgressBar from '@/components/cotisations/ContributionProgressBar';

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

interface Stats {
  totalPlayers: number;
  totalCollected: number;
  totalExpected: number;
  playersUpToDate: number;
  playersLate: number;
  weeksElapsed: number;
  year: number;
}

export default function CotisationsPublicPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<PlayerSummary[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const response = await fetch('/api/contributions/summary');
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setSummary(data.summary);
      setStats(data.stats);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSummary = summary.filter(player => {
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
        return {
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/10',
          borderColor: 'border-blue-500/30',
          icon: TrendingUpIcon,
          label: 'En avance',
        };
      case 'up_to_date':
        return {
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          icon: CheckCircle,
          label: 'À jour',
        };
      case 'late':
        return {
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          icon: AlertTriangle,
          label: 'En retard',
        };
      case 'very_late':
        return {
          color: 'text-red-400',
          bgColor: 'bg-red-500/10',
          borderColor: 'border-red-500/30',
          icon: XCircle,
          label: 'Très en retard',
        };
      default:
        return {
          color: 'text-gray-400',
          bgColor: 'bg-gray-500/10',
          borderColor: 'border-gray-500/30',
          icon: CheckCircle,
          label: 'Inconnu',
        };
    }
  };

  const collectionRate = stats ? ((stats.totalCollected / stats.totalExpected) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Tableau des Cotisations</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Suivi transparent des cotisations hebdomadaires • 200 FCFA par samedi
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 font-medium">Chargement des données...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            {stats && (
              <div className="flex mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Membres à jour</p>
                      <p className="text-2xl font-bold text-indigo-400">{stats.playersUpToDate}/{stats.totalPlayers}</p>
                      <p className="text-gray-500 text-xs mt-1">{stats.playersLate} en retard</p>
                    </div>
                    <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-indigo-400" />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Search & Filters */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un membre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setFilterStatus('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filterStatus === 'all'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                    }`}
                  >
                    Tous
                  </button>
                  <button
                    onClick={() => setFilterStatus('up_to_date')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filterStatus === 'up_to_date'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                    }`}
                  >
                    À jour
                  </button>
                  <button
                    onClick={() => setFilterStatus('late')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      filterStatus === 'late'
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50'
                    }`}
                  >
                    En retard
                  </button>
                </div>
              </div>
            </div>

            {/* Tableau */}
            <div className="grid grid-cols-1 gap-4">
              {filteredSummary.map((player, index) => {
                const config = getStatusConfig(player.status);
                const Icon = config.icon;

                return (
                  <motion.div
                    key={player.playerId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-gradient-to-br from-gray-800/40 to-gray-900/20 border ${config.borderColor} rounded-xl p-6 hover:border-cyan-500/50 transition-all`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Photo + Nom */}
                      <div className="flex items-center gap-4 flex-1">
                        <Image
                          src={player.profilePhoto || '/images/avatar-default.png'}
                          alt={player.fullName}
                          width={64}
                          height={64}
                          className="rounded-full object-cover border-2 border-gray-700"
                        />
                        <div>
                          <h3 className="text-lg font-bold text-white">{player.fullName}</h3>
                          {player.alias && (
                            <p className="text-sm text-cyan-400">&quot;{player.alias}&quot;</p>
                          )}
                          {player.lastContribution && (
                            <p className="text-xs text-gray-400 mt-1">
                              Dernier paiement : {new Date(player.lastContribution.date).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Semaines payées</span>
                          <span className="text-white font-semibold">{player.weeksPaid} / {player.weeksElapsed}</span>
                        </div>
                        <ContributionProgressBar
                          weeksPaid={player.weeksPaid}
                          weeksElapsed={player.weeksElapsed}
                          showLabel={false}
                        />
                      </div>

                      {/* Solde + Statut */}
                      <div className="text-right">
                        <div className="mb-2">
                          <p className="text-xs text-gray-400 mb-1">Solde</p>
                          <p className={`text-2xl font-bold ${config.color}`}>
                            {player.balance >= 0 ? '+' : ''}{player.balance} FCFA
                          </p>
                        </div>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${config.bgColor} ${config.borderColor} border`}>
                          <Icon size={14} className={config.color} />
                          <span className={`text-xs font-semibold ${config.color}`}>{config.label}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredSummary.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Aucun membre trouvé
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}