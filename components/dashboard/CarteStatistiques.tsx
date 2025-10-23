import { useState, useEffect } from "react";
import { BarChart3 } from "lucide-react";

interface Stats {
  totalDerbys: number;
  totalJoueurs: number;
  totalMatchs: number;
}

export default function CarteStatistiques() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch basique - on pourrait créer une API dédiée
    Promise.all([
      fetch("/api/derbys").then(res => res.json()),
      fetch("/api/players/count").then(res => res.json()),
      fetch("/api/friendly-matches").then(res => res.json()),
    ])
      .then(([derbys, playersData, matches]) => {
        setStats({
          totalDerbys: Array.isArray(derbys) ? derbys.length : 0,
          totalJoueurs: playersData.count || 0,
          totalMatchs: Array.isArray(matches) ? matches.length : 0,
        });
        setLoading(false);
      })
      .catch(() => {
        setStats(null);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-6 flex flex-col items-start h-full">
      <BarChart3 className="h-10 w-10 text-yellow-400 mb-3 group-hover:scale-110 transition-transform" />
      <h2 className="text-xl font-semibold mb-2 text-white">
        Statistiques
      </h2>
      {loading ? (
        <p className="text-sm text-gray-500">Chargement...</p>
      ) : stats ? (
        <div className="flex space-x-2 items-center  text-sm text-gray-400 space-y-1">
          <p>⚽ {stats.totalDerbys} derby{stats.totalDerbys > 1 ? "s" : ""}</p>
          <p>👥 {stats.totalJoueurs} joueur{stats.totalJoueurs > 1 ? "s" : ""}</p>
          <p>📅 {stats.totalMatchs} match{stats.totalMatchs > 1 ? "s" : ""}</p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Données non disponibles</p>
      )}
    </div>
  );
}