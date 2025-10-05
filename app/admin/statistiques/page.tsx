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

const cardStyle = "bg-slate-200 hover:shadow-2xl transition-all duration-300 rounded-xl p-4 shadow-lg";

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
  if (status === "loading") return <p>Chargement...</p>;
  if (loading) return <p className="text-center mt-10 text-gray-600">Chargement des statistiques...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Erreur : {error}</p>;
  if (!stats) return <p>Chargement...</p>;

  return (
    <div className="container mx-auto px-4 py-4 mt-4">
      <h1 className="text-3xl text-left font-extrabold text-cyan-800 mb-4">📊 Statistiques Générales</h1>

      <div className="flex justify-end mb-8">
        <select
          id="periode"
          value={periode}
          onChange={(e) => setPeriode(e.target.value)}
          className="select select-bordered border-blue-600"
          aria-label="Sélectionner la période des statistiques"
        >
          <option value="saison">Cette saison</option>
          <option value="mois">Ce mois</option>
          <option value="semaine">Cette semaine</option>
        </select>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* Derbys */}
        <motion.div className={cardStyle} whileHover={{ scale: 1.03 }}>
          <Trophy className="text-cyan-600 mb-2" size={32} />
          <h2 className="text-xl font-bold text-cyan-700 mb-3">Derbys</h2>
          <p>Total : {stats.derbys.total}</p>
          <p>Terminés : {stats.derbys.completes}</p>
          <p>En cours : {stats.derbys.enCours}</p>
          <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
            <motion.div
              className="bg-cyan-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.derbys.completes / 12) * 100}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
          <p className="text-sm text-gray-600">{((stats.derbys.completes / 12) * 100).toFixed(1)}% de progression (saison)</p>
        </motion.div>

        {/* Joueurs */}
        <motion.div className={cardStyle} whileHover={{ scale: 1.03 }}>
          <Users className="text-green-600 mb-2" size={32} />
          <h2 className="text-xl font-bold text-green-700 mb-3">Joueurs</h2>
          <p>Total : {stats.joueurs.total}</p>
          <p>Actifs : {stats.joueurs.actifs}</p>
          <p>Nouveaux : {stats.joueurs.nouveaux}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <motion.div
              className="bg-green-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.joueurs.actifs / stats.joueurs.total) * 100}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
          <p className="text-sm text-gray-600">
            Taux d&apos;activité : {((stats.joueurs.actifs / stats.joueurs.total) * 100).toFixed(1)}%
          </p>
        </motion.div>

        {/* Matchs */}
        <motion.div className={cardStyle} whileHover={{ scale: 1.03 }}>
          <CalendarCheck className="text-blue-600 mb-2" size={32} />
          <h2 className="text-xl font-bold text-blue-700 mb-3">Matchs</h2>
          <p>Matchs Gagnes: </p>
          <p>Matchs Nuls: </p>
          <p>Matchs Perdus: </p>
          <p>Moyenne de buts : {stats.matchs.moyenneButs}</p>
            
          
        </motion.div>

        {/* Classement */}
        <motion.div className={cardStyle} whileHover={{ scale: 1.03 }}>
          <BarChart3 className="text-purple-600 mb-2" size={32} />
          <h2 className="text-xl font-bold text-purple-700 mb-3">Classement</h2>
          <p>Meilleur Buteur : </p>
          <p>Meilleur Equipe: </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <motion.div
              className="bg-purple-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(stats.classement.points / 60) * 100}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
          <p className="text-sm text-gray-600">
            Progression : {((stats.classement.points / 60) * 100).toFixed(1)}%
          </p>
        </motion.div>
      </div>

      {/* GRAPHIQUES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Graphique 1 : Évolution des Derbys (Line Chart) */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Trophy className="text-cyan-600" size={24} />
            Évolution des Derbys (6 derniers mois)
          </h3>
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
                  },
                },
              },
            }}
          />
        </motion.div>

        {/* Graphique 2 : Répartition Victoires/Défaites (Pie Chart) */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 className="text-purple-600" size={24} />
            Bilan des Derbys
          </h3>
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
        className="bg-white rounded-xl p-6 shadow-lg mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="text-orange-600" size={24} />
          Top 5 Buteurs de la Saison
        </h3>
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
                },
              },
            },
          }}
        />
      </motion.div>
    </div>
  );
};

export default StatistiquesPage;
