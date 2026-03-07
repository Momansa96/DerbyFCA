"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Trophy, Target, TrendingUp, BarChart3, ChevronRight, X } from "lucide-react";

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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-500 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-lg font-bold text-red-700 mb-2">Erreur</h2>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-secondary pt-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-secondary">Classement Buteurs</h1>
          </div>
          <p className="text-gray-500 text-sm">Saison {new Date().getFullYear()} - {sortedPlayers.length} joueurs</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-accent-dark" />
              <span className="text-xs sm:text-sm text-gray-500">Top Scorer</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-secondary mb-1">{topScorer?.goalsCount || 0}</div>
            <div className="text-xs text-gray-400 truncate">{topScorer?.fullName || "N/A"}</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm text-gray-500">Total</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-secondary mb-1">
              {sortedPlayers.reduce((acc, p) => acc + p.goalsCount, 0)}
            </div>
            <div className="text-xs text-gray-400">Buts marqués</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
              <span className="text-xs sm:text-sm text-gray-500">Moyenne</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-secondary mb-1">{avgGoals}</div>
            <div className="text-xs text-gray-400">Buts/joueur</div>
          </div>
        </div>

        {/* Top 3 Podium */}
        {sortedPlayers.length >= 3 && (
          <div className="mb-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg sm:text-xl font-heading font-bold text-secondary flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent-dark" /> Top 3
                </h2>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">Meilleurs buteurs</span>
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
                        className="rounded-full object-cover border-[3px] border-gray-300"
                      />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow">
                      2
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-secondary text-center mb-1 line-clamp-1 px-1">
                    {sortedPlayers[1]?.fullName}
                  </h3>
                  <div className="flex items-center gap-1 bg-gray-100 px-2 sm:px-3 py-1 rounded-lg">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <span className="text-sm sm:text-base font-bold text-gray-600">{sortedPlayers[1]?.goalsCount}</span>
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
                        className="rounded-full object-cover border-[3px] border-accent shadow-lg"
                      />
                      <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3">
                        <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-accent-dark" />
                      </div>
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-accent rounded-full flex items-center justify-center text-secondary font-bold text-sm sm:text-base shadow-md">
                      1
                    </div>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-accent-dark text-center mb-1 line-clamp-1 px-1">
                    {sortedPlayers[0]?.fullName}
                  </h3>
                  <div className="flex items-center gap-1.5 bg-accent/15 border border-accent/30 px-3 sm:px-4 py-1.5 rounded-lg">
                    <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent-dark" />
                    <span className="text-base sm:text-lg font-bold text-accent-dark">{sortedPlayers[0]?.goalsCount}</span>
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
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow">
                      3
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-secondary text-center mb-1 line-clamp-1 px-1">
                    {sortedPlayers[2]?.fullName}
                  </h3>
                  <div className="flex items-center gap-1 bg-orange-50 px-2 sm:px-3 py-1 rounded-lg">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                    <span className="text-sm sm:text-base font-bold text-orange-600">{sortedPlayers[2]?.goalsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-bold text-secondary">Classement complet</h2>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("compact")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === "compact"
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-secondary"
              }`}
            >
              Compact
            </button>
            <button
              onClick={() => setViewMode("expanded")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                viewMode === "expanded"
                  ? "bg-primary text-white"
                  : "text-gray-500 hover:text-secondary"
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

            const rankColors = {
              1: { bar: "bg-accent", badge: "bg-accent text-secondary", border: "border-accent/30" },
              2: { bar: "bg-gray-400", badge: "bg-gray-400 text-white", border: "border-gray-300" },
              3: { bar: "bg-orange-500", badge: "bg-orange-500 text-white", border: "border-orange-300" },
            };

            const defaultStyle = { bar: "bg-primary", badge: "bg-gray-100 text-gray-600", border: "border-gray-200" };
            const style = isTop3 ? rankColors[rank as 1 | 2 | 3] : defaultStyle;

            return (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                className={`group relative bg-white hover:bg-gray-50 border ${style.border} transition-colors cursor-pointer rounded-xl overflow-hidden shadow-sm`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${style.bar}`} />

                <div className="p-3 sm:p-4 pl-5 sm:pl-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center font-bold text-sm sm:text-base ${style.badge}`}>
                      {rank}
                    </div>

                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                      <Image
                        src={player.profilePhoto || "/images/default.jpeg"}
                        alt={player.fullName}
                        fill
                        className="rounded-full object-cover border border-gray-200"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-secondary truncate">
                        {player.fullName}
                      </h3>
                      {viewMode === "expanded" && player.alias && (
                        <p className="text-xs text-gray-400 truncate">&quot;{player.alias}&quot;</p>
                      )}
                      {viewMode === "expanded" && player.preferredPosition && (
                        <p className="text-xs text-gray-400 mt-0.5">{player.preferredPosition}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
                      {viewMode === "expanded" && (
                        <div className="hidden sm:flex items-center gap-2 text-gray-400">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-sm">{player.matchesPlayed || 0} matchs</span>
                        </div>
                      )}

                      <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-bold text-sm ${
                        isTop3 ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-600"
                      }`}>
                        <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>{player.goalsCount}</span>
                      </div>

                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
                    </div>
                  </div>

                  {viewMode === "expanded" && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">Progression</span>
                        <span className="text-xs text-gray-500">
                          {topScorer ? Math.round((player.goalsCount / topScorer.goalsCount) * 100) : 0}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
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

      {selectedPlayer && <PlayerModal player={selectedPlayer} onClose={() => setSelectedPlayer(null)} />}
    </div>
  );
}

function PlayerModal({ player, onClose }: { player: Player; onClose: () => void }) {
  const avgGoalsPerMatch = player.matchesPlayed && player.matchesPlayed > 0
    ? (player.goalsCount / player.matchesPlayed).toFixed(2)
    : "0.00";

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-secondary transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 pb-6">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 mb-4">
              <Image
                src={player.profilePhoto || "/images/default.jpeg"}
                alt={player.fullName}
                fill
                className="rounded-full object-cover border-4 border-primary/20 shadow-md"
              />
            </div>

            <h2 className="text-2xl font-heading font-bold text-secondary mb-1 text-center">
              {player.fullName}
            </h2>
            {player.alias && (
              <p className="text-base text-primary font-semibold mb-2">&quot;{player.alias}&quot;</p>
            )}
            {player.preferredPosition && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">
                {player.preferredPosition}
              </span>
            )}
          </div>
        </div>

        <div className="px-8 pb-8">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-primary/5 border border-primary/15 rounded-xl p-5 text-center">
              <Target className="w-7 h-7 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-secondary mb-1">{player.goalsCount}</div>
              <div className="text-xs text-gray-500 font-medium">Buts marqués</div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
              <TrendingUp className="w-7 h-7 text-gray-500 mx-auto mb-2" />
              <div className="text-3xl font-bold text-secondary mb-1">{player.matchesPlayed || 0}</div>
              <div className="text-xs text-gray-500 font-medium">Matchs joués</div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">Statistiques</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Moyenne buts/match</span>
                <span className="text-base font-bold text-secondary">{avgGoalsPerMatch}</span>
              </div>
              {player.number && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Numéro</span>
                  <span className="text-base font-bold text-secondary">#{player.number}</span>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
