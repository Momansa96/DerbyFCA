import { useState, useEffect } from "react";
import { DollarSign } from "lucide-react";

export default function CarteCotisations() {
  const [stats, setStats] = useState<{
    totalCollected: number;
    totalExpected: number;
    playersUpToDate: number;
    totalPlayers: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contributions/summary")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setLoading(false);
      })
      .catch(() => {
        setStats(null);
        setLoading(false);
      });
  }, []);

  const collectionRate = stats
    ? ((stats.totalCollected / stats.totalExpected) * 100).toFixed(0)
    : 0;

  return (
    <div className="p-6 flex flex-col items-start h-full">
      <DollarSign className="h-10 w-10 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
      <h2 className="text-xl font-semibold mb-2 text-white">
        Gestion des Cotisations
      </h2>
      <p className="text-gray-400 mb-4">Suivi des cotisations hebdomadaires</p>
      {loading ? (
        <p className="text-sm text-gray-500">Chargement...</p>
      ) : stats ? (
        <div className="flex space-x-2 text-sm">
          <p className="text-gray-400">
            Taux de collecte : <span className="font-bold text-cyan-400">{collectionRate}%</span>
          </p>
          <p className="text-gray-400">
            À jour : <span className="font-bold text-green-400">{stats.playersUpToDate}/{stats.totalPlayers}</span>
          </p>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Données indisponibles</p>
      )}
    </div>
  );
}