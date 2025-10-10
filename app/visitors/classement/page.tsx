"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Trophy, Target, TrendingUp, BarChart3, ChevronDown, X, Circle } from "lucide-react";

type Player = {
  id: string;
  fullName: string;
  alias?: string;
  number?: number;
  profilePhoto?: string;
  preferredPosition?: string;
  teams: string[];
  goalsCount: number;
  matchesPlayed?: number;
};

type SortKey = "position" | "fullName" | "goalsCount";

export default function ClassementPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [viewMode, setViewMode] = useState<"compact" | "expanded">("compact");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("/api/players");
        if (!res.ok) throw new Error("Erreur lors de la récupération des joueurs");
        const data = await res.json();

        const formattedPlayers = data.map((player: any) => ({
          id: player.id,
          fullName: player.fullName,
          alias: player.alias,
          number: player.number,
          profilePhoto: player.profilePhoto || "/images/default.jpeg",
          preferredPosition: player.preferredPosition,
          teams: player.teams || [],
          goalsCount: player.goals?.length || 0,
          matchesPlayed: player.matchesPlayed || 0,
        }));

        setPlayers(formattedPlayers);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.goalsCount - a.goalsCount);
  }, [players]);

  const topScorer = sortedPlayers[0];
  const avgGoals = sortedPlayers.length > 0
    ? (sortedPlayers.reduce((acc, p) => acc + p.goalsCount, 0) / sortedPlayers.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-red-400 mb-2">Erreur</h2>
          <p className="text-red-300/80 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Classement Buteurs</h1>
          </div>
          <p className="text-gray-400 text-sm">Saison 2025 • {sortedPlayers.length} joueurs</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-xs sm:text-sm text-gray-400">Top Scorer</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mb-1">{topScorer?.goalsCount || 0}</div>
            <div className="text-xs text-gray-500 truncate">{topScorer?.fullName || "N/A"}</div>
          </div>

          <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-500/5 border border-indigo-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
              <span className="text-xs sm:text-sm text-gray-400">Total</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mb-1">
              {sortedPlayers.reduce((acc, p) => acc + p.goalsCount, 0)}
            </div>
            <div className="text-xs text-gray-500">Buts marqués</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
              <span className="text-xs sm:text-sm text-gray-400">Moyenne</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white mb-1">{avgGoals}</div>
            <div className="text-xs text-gray-500">Buts/joueur</div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {sortedPlayers.length >= 3 && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/30 border border-gray-700/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-white">🏆 Top 3</h2>
                <span className="text-xs text-gray-500 bg-gray-700/50 px-3 py-1 rounded-full">Meilleurs buteurs</span>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-6">
                {/* 2nd */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                      <Image
                        src={sortedPlayers[1]?.profilePhoto || "/images/default.jpeg"}
                        alt={sortedPlayers[1]?.fullName}
                        fill
                        className="rounded-full object-cover border-[3px] border-gray-400"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-lg">
                      2
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white text-center mb-1 line-clamp-1 px-1">
                    {sortedPlayers[1]?.fullName}
                  </h3>
                  <div className="flex items-center gap-1 bg-gray-700/50 px-2 sm:px-3 py-1 rounded-lg">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
                    <span className="text-sm sm:text-base font-bold text-gray-300">{sortedPlayers[1]?.goalsCount}</span>
                  </div>
                </div>

                {/* 1st */}
                <div className="flex flex-col items-center -mt-4">
                  <div className="relative mb-3">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
                      <Image
                        src={sortedPlayers[0]?.profilePhoto || "/images/default.jpeg"}
                        alt={sortedPlayers[0]?.fullName}
                        fill
                        className="rounded-full object-cover border-[3px] border-yellow-400 shadow-xl shadow-yellow-400/30"
                      />
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 drop-shadow-lg" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-black text-sm sm:text-base shadow-xl">
                      1
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-yellow-400 text-center mb-1 line-clamp-1 px-1">
                    {sortedPlayers[0]?.fullName}
                  </h3>
                  <div className="flex items-center gap-1.5 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 px-3 sm:px-4 py-1.5 rounded-lg">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    <span className="text-base sm:text-lg font-black text-yellow-400">{sortedPlayers[0]?.goalsCount}</span>
                  </div>
                </div>

                {/* 3rd */}
                <div className="flex flex-col items-center">
                  <div className="relative mb-3">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                      <Image
                        src={sortedPlayers[2]?.profilePhoto || "/images/default.jpeg"}
                        alt={sortedPlayers[2]?.fullName}
                        fill
                        className="rounded-full object-cover border-[3px] border-orange-400"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-black text-xs sm:text-sm shadow-lg">
                      3
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-white text-center mb-1 line-clamp-1 px-1">
                    {sortedPlayers[2]?.fullName}
                  </h3>
                  <div className="flex items-center gap-1 bg-gray-700/50 px-2 sm:px-3 py-1 rounded-lg">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-orange-400" />
                    <span className="text-sm sm:text-base font-bold text-orange-400">{sortedPlayers[2]?.goalsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Classement complet</h2>
          <div className="flex gap-2 bg-gray-800/50 p-1 rounded-lg border border-gray-700/50">
            <button
              onClick={() => setViewMode("compact")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === "compact"
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setViewMode("expanded")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                viewMode === "expanded"
                  ? "bg-cyan-500 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Détails
            </button>
          </div>
        </div>

        {/* Rankings List */}
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const isLast = rank === sortedPlayers.length;

            return (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className={`group relative bg-gradient-to-br from-gray-800/40 to-gray-900/20 hover:from-gray-800/60 hover:to-gray-900/40 border transition-all cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden ${
                  isTop3
                    ? rank === 1
                      ? "border-yellow-500/30 hover:border-yellow-500/50"
                      : rank === 2
                      ? "border-gray-400/30 hover:border-gray-400/50"
                      : "border-orange-400/30 hover:border-orange-400/50"
                    : isLast
                    ? "border-red-500/30 hover:border-red-500/50"
                    : "border-gray-700/50 hover:border-cyan-500/50"
                }`}
              >
                {/* Rank indicator bar */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 ${
                    isTop3
                      ? rank === 1
                        ? "bg-gradient-to-b from-yellow-400 to-yellow-600"
                        : rank === 2
                        ? "bg-gradient-to-b from-gray-300 to-gray-500"
                        : "bg-gradient-to-b from-orange-400 to-orange-600"
                      : isLast
                      ? "bg-gradient-to-b from-red-400 to-red-600"
                      : "bg-gradient-to-b from-cyan-400 to-indigo-500"
                  }`}
                />

                <div className="p-3 sm:p-4 pl-5 sm:pl-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Rank */}
                    <div
                      className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-black text-sm sm:text-base ${
                        isTop3
                          ? rank === 1
                            ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
                            : rank === 2
                            ? "bg-gradient-to-br from-gray-300 to-gray-500 text-white"
                            : "bg-gradient-to-br from-orange-400 to-orange-600 text-white"
                          : isLast
                          ? "bg-gradient-to-br from-red-500/20 to-red-600/20 text-red-400 border border-red-500/30"
                          : "bg-gray-700/50 text-gray-400"
                      }`}
                    >
                      {rank}
                    </div>

                    {/* Avatar */}
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                      <Image
                        src={player.profilePhoto || "/images/default.jpeg"}
                        alt={player.fullName}
                        fill
                        className={`rounded-full object-cover ${
                          isTop3
                            ? "border-2"
                            : "border border-gray-700"
                        } ${
                          rank === 1
                            ? "border-yellow-400"
                            : rank === 2
                            ? "border-gray-400"
                            : rank === 3
                            ? "border-orange-400"
                            : ""
                        }`}
                      />
                    </div>

                    {/* Player info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-white truncate">
                        {player.fullName}
                      </h3>
                      {viewMode === "expanded" && player.alias && (
                        <p className="text-xs text-gray-400 truncate">&quot;{player.alias}&quot;</p>
                      )}
                      {viewMode === "expanded" && player.preferredPosition && (
                        <p className="text-xs text-gray-500 mt-0.5">{player.preferredPosition}</p>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                      {viewMode === "expanded" && (
                        <div className="hidden sm:flex items-center gap-2 text-gray-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">{player.matchesPlayed || 0} matchs</span>
                        </div>
                      )}

                      <div
                        className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold ${
                          isTop3
                            ? rank === 1
                              ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400"
                              : rank === 2
                              ? "bg-gray-500/10 border border-gray-400/30 text-gray-300"
                              : "bg-orange-500/10 border border-orange-400/30 text-orange-400"
                            : isLast
                            ? "bg-red-500/10 border border-red-500/30 text-red-400"
                            : "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                        }`}
                      >
                        <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span className="text-sm sm:text-base">{player.goalsCount}</span>
                      </div>

                      <ChevronDown className="w-5 h-5 text-gray-600 group-hover:text-cyan-400 transition-colors rotate-[-90deg]" />
                    </div>
                  </div>

                  {/* Progress bar */}
                  {viewMode === "expanded" && (
                    <div className="mt-3 pt-3 border-t border-gray-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Progression</span>
                        <span className="text-xs text-gray-400">
                          {topScorer ? Math.round((player.goalsCount / topScorer.goalsCount) * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isTop3
                              ? rank === 1
                                ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                                : rank === 2
                                ? "bg-gradient-to-r from-gray-300 to-gray-500"
                                : "bg-gradient-to-r from-orange-400 to-orange-600"
                              : "bg-gradient-to-r from-cyan-400 to-indigo-500"
                          }`}
                          style={{
                            width: topScorer
                              ? `${(player.goalsCount / topScorer.goalsCount) * 100}%`
                              : "0%",
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Player Modal */}
      {selectedPlayer && <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
    </div>
  );
}

// Modal Player Details
function PlayerModal({ player, onClose }: { player: Player; onClose: () => void }) {
  const avgGoalsPerMatch = player.matchesPlayed && player.matchesPlayed > 0
    ? (player.goalsCount / player.matchesPlayed).toFixed(2)
    : "0.00";

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-gray-900 to-[#0A0E27] border border-gray-700/50 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-800/50 hover:bg-gray-800 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="relative p-8 pb-6">
          <div className="flex flex-col items-center">
            <div className="relative w-28 h-28 mb-4">
              <Image
                src={player.profilePhoto || "/images/default.jpeg"}
                alt={player.fullName}
                fill
                className="rounded-full object-cover border-4 border-cyan-500 shadow-xl shadow-cyan-500/20"
              />
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-white mb-1 text-center">
              {player.fullName}
            </h2>
            {player.alias && (
              <p className="text-lg text-cyan-400 font-semibold mb-2">&quot;{player.alias}&quot;</p>
            )}
            {player.preferredPosition && (
              <span className="inline-block bg-gray-800/50 border border-gray-700/50 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">
                {player.preferredPosition}
              </span>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-2xl p-5 text-center">
              <Target className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <div className="text-3xl font-black text-white mb-1">{player.goalsCount}</div>
              <div className="text-xs text-gray-400 font-medium">Buts marqués</div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/30 rounded-2xl p-5 text-center">
              <TrendingUp className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
              <div className="text-3xl font-black text-white mb-1">{player.matchesPlayed || 0}</div>
              <div className="text-xs text-gray-400 font-medium">Matchs joués</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="bg-gray-800/30 border border-gray-700/30 rounded-2xl p-5 mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">Statistiques</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Moyenne buts/match</span>
                <span className="text-base font-bold text-white">{avgGoalsPerMatch}</span>
              </div>
              {player.number && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Numéro</span>
                  <span className="text-base font-bold text-white">#{player.number}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}