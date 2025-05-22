"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Player {
  id: string;
  fullName: string;
  profilePhoto: string | null;
  preferredPosition: string | null;
  alias?: string;
}

interface Team {
  id: string;
  players: Player[];
}

export default function AdminTiragesPage() {
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [team1, setTeam1] = useState<Player[]>([]);
  const [team2, setTeam2] = useState<Player[]>([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des joueurs');
      }
      const data = await response.json();
      setPlayers(data);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des joueurs');
    } finally {
      setLoading(false);
    }
  };

  const togglePlayer = (id: string) => {
    setSelectedPlayers((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPlayers.length < 10) {
      setError("Veuillez sélectionner au moins 10 joueurs");
      return;
    }
    setError(null);
    setIsShuffling(true);

    // Mélanger les joueurs
    const selectedPlayersData = players.filter(player => selectedPlayers.includes(player.id));
    const shuffled = [...selectedPlayersData].sort(() => Math.random() - 0.5);
    const half = Math.ceil(shuffled.length / 2);
    setTeam1(shuffled.slice(0, half));
    setTeam2(shuffled.slice(half));

    // Attendre 5 secondes
    await new Promise(resolve => setTimeout(resolve, 5000));
    setIsShuffling(false);
  };

  const handleValidate = async () => {
    try {
      setIsValidating(true);
      setError(null);

      const response = await fetch('/api/derbys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team1Players: team1.map((player: Player) => player.id),
          team2Players: team2.map((player: Player) => player.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du derby');
      }

      // Rediriger vers la page des derbys
      window.location.href = '/admin/derbys';
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isShuffling) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
        <div className="relative w-64 h-64">
          {/* Carte 1 */}
          <div className="absolute top-0 left-0 w-32 h-48 bg-white rounded-lg shadow-lg transform animate-shuffle-1">
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">1</span>
            </div>
          </div>
          {/* Carte 2 */}
          <div className="absolute top-0 right-0 w-32 h-48 bg-white rounded-lg shadow-lg transform animate-shuffle-2">
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">2</span>
            </div>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-700 animate-pulse">
          Tirage en cours...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lancer un Nouveau Tirage</h1>

      {teams.length === 0 ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Sélectionnez les joueurs présents</h2>
              <div className="text-sm text-gray-600">
                {selectedPlayers.length} joueur{selectedPlayers.length > 1 ? 's' : ''} sélectionné{selectedPlayers.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
              {players.map((player) => (
                <label
                  key={player.id}
                  className={`relative flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedPlayers.includes(player.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                    }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedPlayers.includes(player.id)}
                    onChange={() => togglePlayer(player.id)}
                  />
                  <div className="flex-shrink-0">
                    <Image
                      width={48}
                      height={48}
                      src={player.profilePhoto || '/images/avatar-default.png'}
                      alt={player.fullName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white"
                    />
                  </div>
                  <div className="flex-grow">
                    <div className="font-medium text-gray-900 text-lg">{player.fullName}</div>
                    {player.alias && (
                      <div className="text-sm text-gray-500">&quot;{player.alias}&quot;</div>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlayers.includes(player.id)
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                    }`}>
                    {selectedPlayers.includes(player.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Minimum 10 joueurs requis
              </div>
              <button
                type="submit"
                disabled={selectedPlayers.length < 10 || isSubmitting}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${selectedPlayers.length < 10
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {isSubmitting ? "Création en cours..." : "Lancer le tirage"}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teams.map((team) => (
              <div key={team.id} className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-center">
                  Équipe {team.id}
                </h2>
                <div className="space-y-3">
                  {team.players.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center space-x-3 p-2 bg-gray-50 rounded"
                    >
                      <Image
                        width={40}
                        height={40}
                        src={player.profilePhoto || '/images/avatar-default.png'}
                        alt={player.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{player.fullName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => {
                setTeams([]);
                setSelectedPlayers([]);
              }}
              className="btn btn-secondary"
            >
              Nouveau tirage
            </button>
          </div>
        </div>
      )}

      {!isShuffling && team1.length > 0 && team2.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-center space-x-8">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4 text-blue-600">Aigles</h3>
              <ul className="space-y-2">
                {team1.map((player) => (
                  <li key={player.id} className="flex items-center space-x-2">
                    <Image
                      width={32}
                      height={32}
                      src={player.profilePhoto || '/images/avatar-default.png'}
                      alt={player.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{player.fullName}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h3 className="text-xl font-bold mb-4 text-pink-600">Lions</h3>
              <ul className="space-y-2">
                {team2.map((player) => (
                  <li key={player.id} className="flex items-center space-x-2">
                    <Image
                      width={32}
                      height={32}
                      src={player.profilePhoto || '/images/avatar-default.png'}
                      alt={player.fullName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{player.fullName}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isValidating ? 'Validation en cours...' : 'Valider le tirage'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
