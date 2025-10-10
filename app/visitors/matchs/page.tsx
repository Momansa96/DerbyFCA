"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  ChevronRight,
  Trophy,
  Users,
  Flame,
  X,
  Filter,
} from "lucide-react";

// Types
type Match = {
  id: string;
  date: string;
  time: string;
  location: string;
  type: "friendly" | "derby" | "exhibition";
};

// Utils
const formatDate = (dateStr: string) =>
  new Date(dateStr).toISOString().split("T")[0];

const typeConfig = {
  derby: {
    label: "Derby",
    icon: Flame,
    color: "from-orange-500 to-red-600",
    borderColor: "border-orange-500/50",
    bgColor: "from-orange-500/10 to-red-500/5",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  },
  friendly: {
    label: "Match Amical",
    icon: Users,
    color: "from-cyan-500 to-indigo-600",
    borderColor: "border-cyan-500/50",
    bgColor: "from-cyan-500/10 to-indigo-500/5",
    badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  },
  exhibition: {
    label: "Exhibition",
    icon: Trophy,
    color: "from-purple-500 to-pink-600",
    borderColor: "border-purple-500/50",
    bgColor: "from-purple-500/10 to-pink-500/5",
    badge: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
};

export default function MatchsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<"all" | "upcoming" | "past">("all");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/friendly-matches");
        if (!res.ok) throw new Error("Erreur de chargement");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        setError("Impossible de récupérer les matchs");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const now = new Date();
  const todayMatches = useMemo(
    () => matches.filter((m) => {
      const matchDate = new Date(m.date);
      return matchDate.toDateString() === now.toDateString();
    }),
    [matches]
  );

  const upcomingMatches = useMemo(
    () => matches.filter((m) => new Date(m.date) > now).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [matches]
  );

  const pastMatches = useMemo(
    () => matches.filter((m) => new Date(m.date) < now).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [matches]
  );

  const displayedMatches =
    filterType === "upcoming"
      ? upcomingMatches
      : filterType === "past"
      ? pastMatches
      : matches;

  const stats = {
    total: matches.length,
    upcoming: upcomingMatches.length,
    past: pastMatches.length,
  };

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
            <h1 className="text-2xl sm:text-3xl font-black text-white">Calendrier</h1>
          </div>
          <p className="text-gray-400 text-sm">Saison 2025 • {stats.total} matchs</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
              <span className="text-xs sm:text-sm text-gray-400">Total</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{stats.total}</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xs sm:text-sm text-gray-400">À venir</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{stats.upcoming}</div>
          </div>

          <div className="bg-gradient-to-br from-gray-500/10 to-gray-500/5 border border-gray-500/20 rounded-xl sm:rounded-2xl p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span className="text-xs sm:text-sm text-gray-400">Passés</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-white">{stats.past}</div>
          </div>
        </div>

        {/* Today's Matches */}
        {todayMatches.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h2 className="text-lg sm:text-xl font-bold text-white">🔴 En direct • Aujourd&apos;hui</h2>
              </div>
              <div className="grid gap-4">
                {todayMatches.map((match) => (
                  <MatchCard key={match.id} match={match} isLive onClick={() => setSelectedMatch(match)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filter Buttons */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
          {[
            { key: "all", label: "Tous" },
            { key: "upcoming", label: "À venir" },
            { key: "past", label: "Passés" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterType(filter.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 ${
                filterType === filter.key
                  ? "bg-cyan-500 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700/50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Matches List */}
        <div className="space-y-3">
          {displayedMatches.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4 border border-gray-700/50">
                <CalendarIcon className="w-8 h-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">Aucun match</h3>
              <p className="text-gray-500 text-sm">Aucun match pour cette période</p>
            </div>
          ) : (
            displayedMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => setSelectedMatch(match)}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedMatch && <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
    </div>
  );
}

// Match Card Component
function MatchCard({
  match,
  isLive = false,
  onClick,
}: {
  match: Match;
  isLive?: boolean;
  onClick: () => void;
}) {
  const config = typeConfig[match.type] || typeConfig.friendly; // Fallback to friendly
  const Icon = config.icon;
  const matchDate = new Date(match.date);
  const isPast = matchDate < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={`group relative bg-gradient-to-br from-gray-800/40 to-gray-900/20 hover:from-gray-800/60 hover:to-gray-900/40 border ${
        isLive ? "border-green-500/50" : config.borderColor
      } transition-all cursor-pointer rounded-xl sm:rounded-2xl overflow-hidden`}
    >
      {/* Left accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${config.color}`} />

      <div className="p-4 sm:p-5 pl-5 sm:pl-6">
        <div className="flex items-start justify-between gap-4">
          {/* Left section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-white truncate">{config.label}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${config.badge}`}>
                    {match.type.toUpperCase()}
                  </span>
                  {isPast && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-700/50 text-gray-400 border border-gray-600/50">
                      TERMINÉ
                    </span>
                  )}
                  {isLive && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-green-500/20 text-green-400 border border-green-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Match info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <CalendarIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">
                  {matchDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">{match.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="truncate">{match.location}</span>
              </div>
            </div>
          </div>

          {/* Right arrow */}
          <div className="flex items-center">
            <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Match Modal
function MatchModal({ match, onClose }: { match: Match; onClose: () => void }) {
  const config = typeConfig[match.type] || typeConfig.friendly; // Fallback to friendly
  const Icon = config.icon;
  const matchDate = new Date(match.date);

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
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
        <div className={`relative p-8 pb-6 bg-gradient-to-br ${config.bgColor} border-b border-gray-700/50`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-lg`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white mb-1">{config.label}</h2>
              <span className={`text-xs font-semibold px-3 py-1 rounded-md border ${config.badge}`}>
                {match.type.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="space-y-6">
            {/* Date */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-800/50 border border-gray-700/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Date</div>
                <div className="text-base font-bold text-white">
                  {matchDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-800/50 border border-gray-700/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-indigo-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Heure</div>
                <div className="text-base font-bold text-white">{match.time}</div>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-800/50 border border-gray-700/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Lieu</div>
                <div className="text-base font-bold text-white">{match.location}</div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-8 py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
}