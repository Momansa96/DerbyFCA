"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Users,
  CalendarCheck,
  BarChart3,
  TrendingUp,
  Target,
  Award,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Stats {
  derbys: {
    total: number;
    completes: number;
    enCours: number;
    victoiresAigles: number;
    victoiresLions: number;
    nuls: number;
    pourcentageAigles: number;
    pourcentageLions: number;
  };
  joueurs: {
    total: number;
    actifs: number;
    nouveaux: number;
  };
  matchs: {
    joues: number;
    aVenir: number;
    moyenneButs: number;
  };
  classement: {
    position: number;
    points: number;
    differenceButs: number;
  };
}

const StatistiquesPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [periode, setPeriode] = useState("saison");
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/statistiques");
        if (!res.ok) throw new Error("Erreur lors du chargement des statistiques");
        const data = await res.json();
        setStats(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [periode]);

  if (status === "unauthenticated") {
    router.push("/");
    return null;
  }

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E27]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">Erreur</h3>
          </div>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Statistiques</h1>
            </div>
            <p className="text-gray-400 text-sm">Aperçu des performances du FCA</p>
          </div>

          <select
            id="periode"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            aria-label="Sélectionner la période des statistiques"
          >
            <option value="saison">Cette saison</option>
            <option value="mois">Ce mois</option>
            <option value="semaine">Cette semaine</option>
          </select>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Derbys */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl p-5 hover:border-cyan-500/50 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Trophy className="w-6 h-6 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Derbys</h2>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="text-white font-bold">{stats.derbys.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Terminés</span>
              <span className="text-cyan-400 font-semibold">{stats.derbys.completes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">En cours</span>
              <span className="text-orange-400 font-semibold">{stats.derbys.enCours}</span>
            </div>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 mt-3">
            <motion.div
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.derbys.completes / 12) * 100}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((stats.derbys.completes / 12) * 100).toFixed(1)}% progression saison
          </p>
        </motion.div>

        {/* Joueurs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-5 hover:border-green-500/50 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Joueurs</h2>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total</span>
              <span className="text-white font-bold">{stats.joueurs.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Actifs</span>
              <span className="text-green-400 font-semibold">{stats.joueurs.actifs}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Nouveaux</span>
              <span className="text-blue-400 font-semibold">{stats.joueurs.nouveaux}</span>
            </div>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 mt-3">
            <motion.div
              className="bg-gradient-to-r from-green-500 to-green-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.joueurs.actifs / stats.joueurs.total) * 100}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((stats.joueurs.actifs / stats.joueurs.total) * 100).toFixed(1)}% taux d&apos;activité
          </p>
        </motion.div>

        {/* Matchs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/30 rounded-xl p-5 hover:border-blue-500/50 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <CalendarCheck className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Matchs</h2>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Joués</span>
              <span className="text-white font-bold">{stats.matchs.joues}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">À venir</span>
              <span className="text-blue-400 font-semibold">{stats.matchs.aVenir}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Moy. buts</span>
              <span className="text-orange-400 font-semibold">{stats.matchs.moyenneButs.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-700/30">
            <Target className="w-4 h-4 text-blue-400" />
            <p className="text-xs text-gray-400">Performance offensive</p>
          </div>
        </motion.div>

        {/* Classement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-5 hover:border-purple-500/50 transition-all"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Award className="w-6 h-6 text-purple-400" />
            </div>
            <h2 className="text-lg font-bold text-white">Classement</h2>
          </div>
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Position</span>
              <span className="text-white font-bold">#{stats.classement.position}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Points</span>
              <span className="text-purple-400 font-semibold">{stats.classement.points}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Goal avg</span>
              <span className={`font-semibold ${stats.classement.differenceButs >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stats.classement.differenceButs >= 0 ? '+' : ''}{stats.classement.differenceButs}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-700/30 rounded-full h-2 mt-3">
            <motion.div
              className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.classement.points / 60) * 100}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {((stats.classement.points / 60) * 100).toFixed(1)}% progression
          </p>
        </motion.div>
      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Graphique 1 : Évolution des Derbys (Line Chart) */}
        <motion.div
          className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="text-cyan-400" size={20} />
            <h3 className="text-lg font-bold text-white">Évolution des Derbys</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">6 derniers mois</p>
          <Line
            data={{
              labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
              datasets: [
                {
                  label: 'Derbys joués',
                  data: [1, 2, 1, 3, 2, stats.derbys.total > 9 ? 2 : 1],
                  borderColor: 'rgb(6, 182, 212)',
                  backgroundColor: 'rgba(6, 182, 212, 0.2)',
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    color: 'rgb(156, 163, 175)',
                    font: { size: 12 },
                  },
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                    color: 'rgb(156, 163, 175)',
                  },
                  grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                  },
                },
                x: {
                  ticks: {
                    color: 'rgb(156, 163, 175)',
                  },
                  grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                  },
                },
              },
            }}
          />
        </motion.div>

        {/* Graphique 2 : Répartition Victoires/Défaites (Pie Chart) */}
        <motion.div
          className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="text-purple-400" size={20} />
            <h3 className="text-lg font-bold text-white">Bilan des Derbys</h3>
          </div>
          <p className="text-xs text-gray-500 mb-4">Répartition des résultats</p>
          <Pie
            data={{
              labels: ['Victoires Aigles', 'Victoires Lions', 'Nuls'],
              datasets: [
                {
                  label: 'Résultats',
                  data: [
                    stats.derbys.victoiresAigles,
                    stats.derbys.victoiresLions,
                    stats.derbys.nuls,
                  ],
                  backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',  // Bleu pour Aigles
                    'rgba(236, 72, 153, 0.8)',  // Rose pour Lions
                    'rgba(156, 163, 175, 0.8)', // Gris pour nuls
                  ],
                  borderColor: [
                    'rgb(59, 130, 246)',
                    'rgb(236, 72, 153)',
                    'rgb(156, 163, 175)',
                  ],
                  borderWidth: 2,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    color: 'rgb(156, 163, 175)',
                    font: { size: 12 },
                    padding: 15,
                  },
                },
                title: {
                  display: false,
                },
              },
            }}
          />
        </motion.div>
      </div>

      {/* Graphique 3 : Top 5 Buteurs (Bar Chart) */}
      <motion.div
        className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-orange-400" size={20} />
          <h3 className="text-lg font-bold text-white">Top 5 Buteurs</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">Meilleurs buteurs de la saison</p>
        <Bar
          data={{
            labels: ['Joueur 1', 'Joueur 2', 'Joueur 3', 'Joueur 4', 'Joueur 5'],
            datasets: [
              {
                label: 'Buts marqués',
                data: [12, 9, 7, 6, 5],
                backgroundColor: [
                  'rgba(251, 146, 60, 0.8)', // Orange
                  'rgba(251, 146, 60, 0.7)',
                  'rgba(251, 146, 60, 0.6)',
                  'rgba(251, 146, 60, 0.5)',
                  'rgba(251, 146, 60, 0.4)',
                ],
                borderColor: 'rgb(251, 146, 60)',
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y', // Barres horizontales
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: false,
              },
            },
            scales: {
              x: {
                beginAtZero: true,
                ticks: {
                  stepSize: 2,
                  color: 'rgb(156, 163, 175)',
                },
                grid: {
                  color: 'rgba(156, 163, 175, 0.1)',
                },
              },
              y: {
                ticks: {
                  color: 'rgb(156, 163, 175)',
                },
                grid: {
                  color: 'rgba(156, 163, 175, 0.1)',
                },
              },
            },
          }}
        />
      </motion.div>
      </div>
    </div>
  );
};

export default StatistiquesPage;
