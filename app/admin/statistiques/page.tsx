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

interface Stats {
  derbys: {
    total: number;
    gagnes: number;
    perdus: number;
    pourcentage: number;
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
          <p>Restants : {12-stats.derbys.total}</p>
          <div className="w-full bg-gray-300 rounded-full h-2.5 mt-2">
            <motion.div
              className="bg-cyan-600 h-2.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${stats.derbys.pourcentage}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
          <p className="text-sm text-gray-600">{stats.derbys.pourcentage.toFixed(1)}% de victoires</p>
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
    </div>
  );
};

export default StatistiquesPage;
