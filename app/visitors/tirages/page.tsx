"use client";

import { useState, useEffect } from "react";
import Loader from "@/components/Loader";

type Player = {
  id: string;
  fullName: string;
};

type Team = {
  id: string;
  name: string;
  players: Player[];
};

type Goal = {
  id: string;
  player: Player;
  teamId: string;
  isOwnGoal: boolean;
};

type Match = {
  id: string;
  date: string;
  team1Id: string;
  team2Id: string;
  score1?: number | null;
  score2?: number | null;
  status: string;
  goals?: Goal[];
};

type Derby = {
  id: string;
  team1: Team;
  team2: Team;
  matches: Match[];
  createdAt: string;
};

export default function DerbysPage() {
  const [derbys, setDerbys] = useState<Derby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDerbys() {
      try {
        const res = await fetch("/api/derbys");
        if (!res.ok) throw new Error("Erreur lors de la récupération des derbys");
        const data = await res.json();

        setDerbys(data.derbys);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDerbys();
  }, []);

  if (loading) return <Loader />;
  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        Erreur : {error}
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-5xl font-extrabold text-center text-indigo-800 mb-14 drop-shadow-lg tracking-tight">
        🏟️ Historique des Derbys
      </h1>

      {derbys.length === 0 ? (
        <p className="text-center text-gray-500 text-lg italic">
          Aucun derby trouvé pour le moment.
        </p>
      ) : (
        <div className="relative border-l-4 border-indigo-300 pl-6 space-y-12">

          {derbys.map((derby, index) => (
            <div
              key={derby.id}
              className="relative group bg-white p-8 rounded-2xl border border-indigo-200 shadow-md hover:shadow-xl transition duration-300"
            >
              {/* Timeline dot */}
              <span className="absolute -left-[15px] top-6 w-4 h-4 bg-indigo-500 rounded-full border-4 border-white shadow-md group-hover:scale-110 transition-transform" />

              {/* Badge Dernier match */}
              {index === 0 && (
                <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full shadow-sm animate-pulse">
                  🎖 Dernier match
                </div>
              )}

              {/* Header Derby */}
              <header className="text-left mb-6">
                <h2 className="text-3xl font-bold text-indigo-800">
                  ⚔️ {derby.team1.name} <span className="text-gray-500">vs</span> {derby.team2.name}
                </h2>
                <p className="text-sm text-gray-500 italic mt-1">
                  Tirage du {new Date(derby.createdAt).toLocaleDateString()}
                </p>
              </header>

              {/* Composition équipes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                {[derby.team1, derby.team2].map((team, i) => (
                  <section key={team.id}>
                    <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                      {i === 0 ? "Équipe 1" : "Équipe 2"} : {team.name}
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 max-h-44 overflow-y-auto">
                      {team.players.map((player) => (
                        <li key={player.id} className="truncate">{player.fullName}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              {/* Résultats des matchs */}
              <section>
                <h3 className="text-xl font-bold text-indigo-700 mb-3">
                  🧾 Résultats
                </h3>
                <ul className="space-y-5">
                  {derby.matches.map((match) => (
                    <li
                      key={match.id}
                      className="bg-indigo-50 rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                        <div className="text-indigo-800 font-medium">
                          📅 {new Date(match.date).toLocaleDateString()} — {derby.team1.name} vs {derby.team2.name}
                        </div>
                        <div className="text-indigo-900 font-bold text-lg">
                          {match.score1 !== null && match.score2 !== null
                            ? `${match.score1} - ${match.score2}`
                            : <span className="italic text-gray-500">{match.status}</span>}
                        </div>
                      </div>

                      {match.goals && match.goals.length > 0 && (
                        <div className="bg-white border border-indigo-200 rounded-md p-3 mt-2 max-h-40 overflow-y-auto shadow-inner">
                          <h4 className="font-semibold text-indigo-700 mb-2 text-sm">⚽ Buteurs :</h4>
                          <ul className="list-disc list-inside text-indigo-800 text-sm space-y-1">
                            {match.goals.map((goal) => (
                              <li
                                key={goal.id}
                                className={goal.isOwnGoal ? "italic text-red-600" : ""}
                              >
                                {goal.player.fullName} {goal.isOwnGoal && "(CSC)"}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          ))}
        </div>
      )}
    </div>

  );
}
