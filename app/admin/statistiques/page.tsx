"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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


export default function StatistiquesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [periode, setPeriode] = useState('saison');

  // Nouveaux états pour les données dynamiques
  const [stats, setStats] = useState<Stats | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  // Redirection si non authentifié
  
  
  // Fetch des données dynamiques à chaque changement de période
  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/statistiques');
        if (!res.ok) throw new Error('Erreur lors du chargement des statistiques');
        const data = await res.json();
        setStats(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erreur inconnue');
        }
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
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">Statistiques</h1>

      <label htmlFor="periode" className="block mb-2 font-semibold">Période :</label>
      <select 
        id="periode"
        value={periode} 
        onChange={(e) => setPeriode(e.target.value)}
        className="select select-bordered mb-8"
        aria-label="Sélectionner la période des statistiques"
      >
        <option value="saison">Cette saison</option>
        <option value="mois">Ce mois</option>
        <option value="semaine">Cette semaine</option>
      </select>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Carte Derbys */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Derbys</h2>
          <div className="space-y-2">
            <p>Total: {stats.derbys.total}</p>
            <p>Gagnés: {stats.derbys.gagnes}</p>
            <p>Perdus: {stats.derbys.perdus}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-cyan-600 h-2.5 rounded-full" 
                style={{ width: `${stats.derbys.pourcentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">{stats.derbys.pourcentage.toFixed(1)}% de victoires</p>
          </div>
        </div>

        {/* Carte Joueurs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Joueurs</h2>
          <div className="space-y-2">
            <p>Total: {stats.joueurs.total}</p>
            <p>Actifs: {stats.joueurs.actifs}</p>
            <p>Nouveaux: {stats.joueurs.nouveaux}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${(stats.joueurs.actifs / stats.joueurs.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Taux d'activité: {((stats.joueurs.actifs / stats.joueurs.total) * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Carte Matchs */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Matchs</h2>
          <div className="space-y-2">
            <p>Joués: {stats.matchs.joues}</p>
            <p>À venir: {stats.matchs.aVenir}</p>
            <p>Moyenne de buts: {stats.matchs.moyenneButs}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(stats.matchs.joues / (stats.matchs.joues + stats.matchs.aVenir)) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Progression: {((stats.matchs.joues / (stats.matchs.joues + stats.matchs.aVenir)) * 100).toFixed(1)}%</p>
          </div>
        </div>

        {/* Carte Classement */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Classement</h2>
          <div className="space-y-2">
            <p>Position: {stats.classement.position}ème</p>
            <p>Points: {stats.classement.points}</p>
            <p>Différence de buts: {stats.classement.differenceButs}</p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-purple-600 h-2.5 rounded-full" 
                style={{ width: `${(stats.classement.points / 60) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">Progression: {((stats.classement.points / 60) * 100).toFixed(1)}%</p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique des performances */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Performances</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Graphique des performances à venir</p>
          </div>
        </div>

        {/* Graphique des buts */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Buts marqués/encaissés</h2>
          <div className="h-64 flex items-center justify-center">
            <p className="text-gray-500">Graphique des buts à venir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
