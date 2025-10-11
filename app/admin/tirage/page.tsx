"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, CheckCircle2, Shuffle, RefreshCw, Check, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

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
      toast.error('Erreur lors du chargement des joueurs');
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
      toast.error("Veuillez sélectionner au moins 10 joueurs");
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

  const handleReshuffle = async () => {
    // Refaire le tirage avec les mêmes joueurs sélectionnés
    setError(null);
    setIsShuffling(true);

    // Réinitialiser les équipes temporairement
    setTeam1([]);
    setTeam2([]);

    // Attendre 5 secondes (animation)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Mélanger à nouveau les joueurs
    const selectedPlayersData = players.filter(player => selectedPlayers.includes(player.id));
    const shuffled = [...selectedPlayersData].sort(() => Math.random() - 0.5);
    const half = Math.ceil(shuffled.length / 2);
    setTeam1(shuffled.slice(0, half));
    setTeam2(shuffled.slice(half));

    setIsShuffling(false);
  };

  const handleValidate = async () => {
    try {
      setIsValidating(true);

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

      toast.success('Derby créé avec succès !');
      // Rediriger vers la page des derbys
      setTimeout(() => {
        window.location.href = '/admin/derbys';
      }, 1000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsValidating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0A0E27]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (isShuffling) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0A0E27] space-y-8">
        <div className="relative w-80 h-80">
          {/* Carte Aigles (Cyan) */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-40 h-56 -translate-x-1/2 -translate-y-1/2"
            animate={{
              x: [0, -100, -100, 0],
              y: [0, 0, 0, 0],
              rotate: [0, -15, -15, 0],
              scale: [1, 1.1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 border-2 border-cyan-400">
              <Shuffle className="w-12 h-12 text-white mb-3" />
              <span className="text-white text-3xl font-black">Aigles</span>
              <div className="mt-2 text-cyan-200 text-sm">Équipe 1</div>
            </div>
          </motion.div>

          {/* Carte Lions (Purple) */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-40 h-56 -translate-x-1/2 -translate-y-1/2"
            animate={{
              x: [0, 100, 100, 0],
              y: [0, 0, 0, 0],
              rotate: [0, 15, 15, 0],
              scale: [1, 1.1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-6 border-2 border-purple-400">
              <Shuffle className="w-12 h-12 text-white mb-3" />
              <span className="text-white text-3xl font-black">Lions</span>
              <div className="mt-2 text-purple-200 text-sm">Équipe 2</div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl font-black text-white mb-2"
          >
            Tirage en cours...
          </motion.div>
          <div className="text-gray-400 text-sm">Création des équipes</div>
        </motion.div>

        {/* Progress bar */}
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Nouveau Tirage Derby</h1>
          </div>
          <p className="text-gray-400 text-sm">Sélectionnez les joueurs présents et lancez le tirage des équipes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-black text-white">{players.length}</div>
            <div className="text-xs text-gray-500 mt-1">Joueurs</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Sélectionnés</span>
            </div>
            <div className="text-2xl font-black text-white">{selectedPlayers.length}</div>
            <div className="text-xs text-gray-500 mt-1">Joueurs présents</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-gradient-to-br ${selectedPlayers.length >= 10 ? 'from-purple-500/10 to-purple-600/5 border-purple-500/30' : 'from-orange-500/10 to-orange-600/5 border-orange-500/30'} border rounded-xl p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <Shuffle className={`w-4 h-4 ${selectedPlayers.length >= 10 ? 'text-purple-400' : 'text-orange-400'}`} />
              <span className="text-xs text-gray-400">Minimum</span>
            </div>
            <div className={`text-2xl font-black ${selectedPlayers.length >= 10 ? 'text-white' : 'text-orange-400'}`}>10</div>
            <div className="text-xs text-gray-500 mt-1">Requis</div>
          </motion.div>
        </div>

      {teams.length === 0 ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Sélectionnez les joueurs présents</h2>
              <div className="text-sm text-gray-400">
                {selectedPlayers.length} joueur{selectedPlayers.length > 1 ? 's' : ''} sélectionné{selectedPlayers.length > 1 ? 's' : ''}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2">
              {players.map((player, index) => (
                <motion.label
                  key={player.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`relative flex items-center space-x-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedPlayers.includes(player.id)
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-gray-700/50 bg-gray-800/30 hover:border-cyan-500/50 hover:bg-gray-800/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedPlayers.includes(player.id)}
                    onChange={() => togglePlayer(player.id)}
                  />
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 ${
                      selectedPlayers.includes(player.id)
                        ? "border-cyan-400"
                        : "border-gray-600"
                    }`}>
                      <Image
                        width={48}
                        height={48}
                        src={player.profilePhoto || '/images/avatar-default.png'}
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{player.fullName}</div>
                    {player.alias && (
                      <div className="text-xs text-gray-400 truncate">&quot;{player.alias}&quot;</div>
                    )}
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedPlayers.includes(player.id)
                      ? "border-cyan-500 bg-cyan-500"
                      : "border-gray-600"
                  }`}>
                    {selectedPlayers.includes(player.id) && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>
                </motion.label>
              ))}
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-400">
                {selectedPlayers.length >= 10 ? (
                  <span className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Prêt pour le tirage
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-orange-400">
                    <AlertCircle className="w-4 h-4" />
                    Minimum 10 joueurs requis
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={selectedPlayers.length < 10 || isSubmitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all ${
                  selectedPlayers.length < 10
                    ? "bg-gray-600/50 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600"
                }`}
              >
                <Shuffle className="w-5 h-5" />
                {isSubmitting ? "Tirage en cours..." : "Lancer le tirage"}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          {/* Title */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-black text-white mb-2">Résultat du Tirage</h2>
            <p className="text-gray-400 text-sm">Voici la composition des deux équipes</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Équipe Aigles (Cyan) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/20 rounded-xl">
                    <Shuffle className="w-8 h-8 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-cyan-400">Aigles</h3>
                    <p className="text-sm text-gray-400">Équipe 1</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white">{team1.length}</div>
                  <div className="text-xs text-gray-500">Joueurs</div>
                </div>
              </div>

              <div className="space-y-3">
                {team1.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl border border-cyan-500/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400 flex-shrink-0">
                      <Image
                        width={40}
                        height={40}
                        src={player.profilePhoto || '/images/avatar-default.png'}
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-semibold text-white truncate">{player.fullName}</div>
                      {player.alias && (
                        <div className="text-xs text-gray-400 truncate">&quot;{player.alias}&quot;</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Équipe Lions (Purple) */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Shuffle className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-purple-400">Lions</h3>
                    <p className="text-sm text-gray-400">Équipe 2</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black text-white">{team2.length}</div>
                  <div className="text-xs text-gray-500">Joueurs</div>
                </div>
              </div>

              <div className="space-y-3">
                {team2.map((player, index) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3 p-3 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl border border-purple-500/20 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400 flex-shrink-0">
                      <Image
                        width={40}
                        height={40}
                        src={player.profilePhoto || '/images/avatar-default.png'}
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="font-semibold text-white truncate">{player.fullName}</div>
                      {player.alias && (
                        <div className="text-xs text-gray-400 truncate">&quot;{player.alias}&quot;</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={handleReshuffle}
              disabled={isValidating}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-600 hover:to-indigo-600 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-5 h-5" />
              Refaire le tirage
            </button>
            <button
              onClick={handleValidate}
              disabled={isValidating}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              {isValidating ? 'Validation en cours...' : 'Valider le tirage'}
            </button>
          </motion.div>
        </motion.div>
      )}

      </div>
      <Toaster position="top-right" />
    </div>
  );
}
