"use client";

import { useState, useEffect } from "react";

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
        setDerbys(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDerbys();
  }, []);

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-600 animate-pulse">
        Chargement des derbys...
      </p>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-600 font-semibold">
        Erreur : {error}
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-md">
        Historique des Derbys
      </h1>

      {derbys.length === 0 && (
        <p className="text-center text-gray-500">Aucun derby trouvé.</p>
      )}

      <div className="space-y-12">
        {derbys.map((derby) => (
          <article
            key={derby.id}
            className="border border-indigo-300 rounded-2xl p-8 shadow-lg bg-white"
          >
            <h2 className="text-3xl font-bold text-indigo-800 mb-6 text-center">
              Derby : {derby.team1.name} vs {derby.team2.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-8">
              <section>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                  Composition de l&apos;{derby.team1.name}
                </h3>
                <ul className="list-disc list-inside max-h-48 overflow-y-auto px-2 text-gray-700">
                  {derby.team1.players.map((player) => (
                    <li key={player.id} className="truncate">
                      {player.fullName}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                  Composition de l&apos;{derby.team2.name}
                </h3>
                <ul className="list-disc list-inside max-h-48 overflow-y-auto px-2 text-gray-700">
                  {derby.team2.players.map((player) => (
                    <li key={player.id} className="truncate">
                      {player.fullName}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <section>
              <h3 className="text-2xl font-semibold text-indigo-700 mb-4 border-b border-indigo-300 pb-2">
                Tirages du {new Date(derby.createdAt).toLocaleDateString()}
              </h3>
              <ul className="space-y-6">
                {derby.matches.map((match) => (
                  <li
                    key={match.id}
                    className="bg-indigo-50 rounded-xl p-5 shadow-md flex flex-col md:flex-row md:justify-between md:items-center"
                  >
                    <div className="mb-3 md:mb-0 font-semibold text-indigo-800">
                      {new Date(match.date).toLocaleDateString()} - {derby.team1.name} vs {derby.team2.name}
                    </div>

                    <div className="text-indigo-900 font-bold text-lg">
                      {match.score1 !== null && match.score2 !== null
                        ? `${match.score1} - ${match.score2}`
                        : match.status}
                    </div>

                    {match.goals && match.goals.length > 0 && (
                      <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-auto bg-white border border-indigo-300 rounded-lg p-4 max-h-40 overflow-y-auto shadow-inner">
                        <h4 className="font-semibold text-indigo-700 mb-2">Buteurs :</h4>
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
          </article>
        ))}
      </div>
    </div>
  );
}
