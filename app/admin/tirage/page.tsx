"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, Check, AlertCircle, Trophy } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

interface Player {
  id: string;
  fullName: string;
  profilePhoto: string | null;
  preferredPosition: string | null;
  alias?: string;
}

type PlayerAssignment = 'team1' | 'team2' | 'absent';

export default function AdminTiragesPage() {
  const [playerAssignments, setPlayerAssignments] = useState<Record<string, PlayerAssignment>>({});
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

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
      // Initialiser tous les joueurs comme "absent" par défaut
      const initialAssignments: Record<string, PlayerAssignment> = {};
      data.forEach((player: Player) => {
        initialAssignments[player.id] = 'absent';
      });
      setPlayerAssignments(initialAssignments);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des joueurs');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour assigner un joueur à une équipe
  const assignPlayer = (playerId: string, assignment: PlayerAssignment) => {
    setPlayerAssignments(prev => ({
      ...prev,
      [playerId]: assignment
    }));
  };

  // Calculer les équipes actuelles
  const team1Players = players.filter(p => playerAssignments[p.id] === 'team1');
  const team2Players = players.filter(p => playerAssignments[p.id] === 'team2');
  const absentPlayers = players.filter(p => playerAssignments[p.id] === 'absent');

  // Validation des équipes
  const validateTeams = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (team1Players.length < 5) {
      errors.push('L\'équipe Aigles doit avoir au moins 5 joueurs');
    }
    if (team2Players.length < 5) {
      errors.push('L\'équipe Lions doit avoir au moins 5 joueurs');
    }

    const diff = Math.abs(team1Players.length - team2Players.length);
    if (diff > 1) {
      errors.push(`Les équipes doivent être équilibrées (différence actuelle: ${diff} joueurs)`);
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleValidate = async () => {
    const validation = validateTeams();

    if (!validation.isValid) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    try {
      setIsValidating(true);

      const response = await fetch('/api/derbys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team1Players: team1Players.map(p => p.id),
          team2Players: team2Players.map(p => p.id),
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du derby');
      }

      toast.success('Derby créé avec succès !');
      setTimeout(() => {
        window.location.href = '/admin/derbys';
      }, 1000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsValidating(false);
    }
  };

  const validation = validateTeams();

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

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-purple-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Nouveau Derby</h1>
          </div>
          <p className="text-gray-400 text-sm">Assignez chaque joueur à une équipe pour créer le derby</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Aigles</span>
            </div>
            <div className="text-2xl font-black text-white">{team1Players.length}</div>
            <div className="text-xs text-gray-500 mt-1">Joueurs</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Lions</span>
            </div>
            <div className="text-2xl font-black text-white">{team2Players.length}</div>
            <div className="text-xs text-gray-500 mt-1">Joueurs</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-400">Absents</span>
            </div>
            <div className="text-2xl font-black text-white">{absentPlayers.length}</div>
            <div className="text-xs text-gray-500 mt-1">Joueurs</div>
          </motion.div>
        </div>

        {/* Liste des joueurs avec sélecteurs radio */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Attribution des joueurs</h2>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {players.map((player, index) => {
              const assignment = playerAssignments[player.id] || 'absent';
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    assignment === 'team1'
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : assignment === 'team2'
                      ? 'bg-purple-500/10 border-purple-500/30'
                      : 'bg-gray-800/30 border-gray-700/30'
                  }`}
                >
                  {/* Joueur info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 flex-shrink-0 ${
                      assignment === 'team1'
                        ? 'border-cyan-400'
                        : assignment === 'team2'
                        ? 'border-purple-400'
                        : 'border-gray-600'
                    }`}>
                      <Image
                        width={48}
                        height={48}
                        src={player.profilePhoto || '/images/avatar-default.png'}
                        alt={player.fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm truncate">{player.fullName}</div>
                      {player.alias && (
                        <div className="text-xs text-gray-400 truncate">&quot;{player.alias}&quot;</div>
                      )}
                    </div>
                  </div>

                  {/* Radio buttons */}
                  <div className="flex gap-2 ml-4">
                    <label
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs font-semibold ${
                        assignment === 'team1'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-cyan-500/20 hover:text-cyan-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`player-${player.id}`}
                        checked={assignment === 'team1'}
                        onChange={() => assignPlayer(player.id, 'team1')}
                        className="hidden"
                      />
                      Aigles
                    </label>

                    <label
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs font-semibold ${
                        assignment === 'team2'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-purple-500/20 hover:text-purple-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`player-${player.id}`}
                        checked={assignment === 'team2'}
                        onChange={() => assignPlayer(player.id, 'team2')}
                        className="hidden"
                      />
                      Lions
                    </label>

                    <label
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg cursor-pointer transition-all text-xs font-semibold ${
                        assignment === 'absent'
                          ? 'bg-gray-600 text-white'
                          : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/20 hover:text-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`player-${player.id}`}
                        checked={assignment === 'absent'}
                        onChange={() => assignPlayer(player.id, 'absent')}
                        className="hidden"
                      />
                      Absent
                    </label>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Aperçu des équipes */}
        {(team1Players.length > 0 || team2Players.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Équipe Aigles */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-cyan-400">Aigles</h3>
                <div className="text-2xl font-black text-white">{team1Players.length}</div>
              </div>
              <div className="space-y-2">
                {team1Players.map((player, idx) => (
                  <div key={player.id} className="flex items-center gap-2 text-sm text-white">
                    <span className="text-cyan-400">{idx + 1}.</span>
                    <span className="truncate">{player.fullName}</span>
                  </div>
                ))}
                {team1Players.length === 0 && (
                  <div className="text-gray-500 text-sm italic">Aucun joueur assigné</div>
                )}
              </div>
            </motion.div>

            {/* Équipe Lions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-purple-400">Lions</h3>
                <div className="text-2xl font-black text-white">{team2Players.length}</div>
              </div>
              <div className="space-y-2">
                {team2Players.map((player, idx) => (
                  <div key={player.id} className="flex items-center gap-2 text-sm text-white">
                    <span className="text-purple-400">{idx + 1}.</span>
                    <span className="truncate">{player.fullName}</span>
                  </div>
                ))}
                {team2Players.length === 0 && (
                  <div className="text-gray-500 text-sm italic">Aucun joueur assigné</div>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {/* Messages de validation */}
        {!validation.isValid && validation.errors.length > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-orange-400 font-semibold mb-2">Conditions non remplies :</h4>
                <ul className="space-y-1 text-sm text-orange-300">
                  {validation.errors.map((error, idx) => (
                    <li key={idx}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Bouton de validation */}
        <div className="flex justify-center">
          <button
            onClick={handleValidate}
            disabled={!validation.isValid || isValidating}
            className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all ${
              validation.isValid
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 hover:scale-105'
                : 'bg-gray-600/50 cursor-not-allowed opacity-50'
            }`}
          >
            <Check className="w-5 h-5" />
            {isValidating ? 'Création en cours...' : 'Créer le Derby'}
          </button>
        </div>
      </div>
    </div>
  );
}