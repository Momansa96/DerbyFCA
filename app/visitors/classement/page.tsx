'use client'

import { useState, useEffect } from "react";

type Player = {
  id: string;
  fullName: string;
  alias?: string;
  number?: number;
  teams: string[];
  goalsCount: number;
  matchesPlayed?: number;
};

export default function ClassementPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("/api/players");
        if (!res.ok) throw new Error("Erreur lors de la récupération des joueurs");
        const data = await res.json();
        setPlayers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  const filteredPlayers = players.filter(p =>
    p.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const sortedPlayers = [...filteredPlayers].sort((a, b) => b.goalsCount - a.goalsCount);

  if (loading) return <p className="text-center mt-10 text-gray-400 animate-pulse">Chargement...</p>;
  if (error) return <p className="text-center mt-10 text-red-500 font-semibold">Erreur : {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 text-white">
      <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-lg text-center mb-8">
        Classement des Buteurs
      </h1>

       <div className="flex justify-center">
       <input
          type="text"
          placeholder="Rechercher un joueur"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md mx-auto mb-8 shadow-md rounded-lg p-2 bg-white text-black placeholder-gray-400 focus:outline-none  transition"
        />
       </div>
        


      <div className="overflow-x-auto rounded-xl shadow-xl border border-cyan-600 bg-indigo-900/50 backdrop-blur-lg">
        <table className="w-full min-w-[600px] text-left text-white">
          <thead className="bg-cyan-700/80">
            <tr>
              <th className="px-6 py-4 text-lg font-semibold">Position</th>
              <th className="px-6 py-4 text-lg font-semibold">Joueur</th>
              <th className="px-6 py-4 text-lg font-semibold">Buts</th>
              <th className="px-6 py-4 text-lg font-semibold">Titre joueur</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index, arr) => {
              let titre = "";
              let titreStyle = "";
              let emoji = "";
              if (index === 0) {
                titre = "PICHICHI";
                titreStyle = "text-yellow-400 font-bold";
                emoji = "🥇";
              } else if (index === 1) {
                titre = "Second couteau";
                titreStyle = "text-slate-300 font-semibold";
                emoji = "🥈";
              } else if (index === arr.length - 1) {
                titre = "DJOKPOTO";
                titreStyle = "text-red-500 font-semibold italic";
                emoji = "🥉";
              } else {
                titre = "-";
                titreStyle = "text-gray-400";
              }

              return (
                <tr
                  key={player.id}
                  className={`transition-colors duration-300 hover:bg-cyan-700/40 cursor-pointer ${index === 0 ? "bg-cyan-600/40 font-bold text-yellow-300" : ""
                    }`}
                >
                  <td className="px-6 py-4 text-lg">{index + 1}</td>
                  <td className="px-6 py-4 flex flex-col md:flex-row md:items-center md:gap-3 text-lg">
                    <span>{player.fullName}</span>
                    {player.alias && (
                      <span className="text-xs text-cyan-300 italic md:ml-2">({player.alias})</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-lg">{player.goalsCount}</td>
                  <td className={`px-6 py-4 text-lg ${titreStyle} flex items-center gap-2`}>
                    <span>{emoji}</span> {titre}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
