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
  AlertTriangle,
  Radio,
  Goal as GoalIcon,
  User as UserIcon,
  Home,
  Plane,
} from "lucide-react";
import FormationField, {
  FormationPosition,
  FormationSlots,
  SlotPlayer,
} from "@/components/matchs/FormationField";

// Types
type MatchPlayer = {
  id: string;
  fullName: string;
  alias?: string | null;
  profilePhoto?: string | null;
  number?: number | null;
};

type Composition = {
  id: string;
  playerId: string;
  role: "TITULAIRE" | "REMPLACANT";
  position: FormationPosition | null;
  player: MatchPlayer;
};

type MatchGoal = {
  id: string;
  playerId: string;
  assistPlayerId: string | null;
  minute: number | null;
  player: MatchPlayer;
  assistPlayer: MatchPlayer | null;
};

type Match = {
  id: string;
  type: string; // "officiel" | "amical" | "exhibition" | (legacy values)
  date: string;
  time: string;
  location: string;
  place: string;
  opponent: string;
  status?: string;
  ourScore?: number | null;
  opponentScore?: number | null;
  notes?: string | null;
  compositions: Composition[];
  goals: MatchGoal[];
};

const typeConfig: Record<
  string,
  {
    label: string;
    icon: any;
    accentColor: string;
    iconBg: string;
    iconColor: string;
    borderColor: string;
    bgColor: string;
    badge: string;
  }
> = {
  officiel: {
    label: "Match Officiel",
    icon: Trophy,
    accentColor: "bg-indigo-500",
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
    borderColor: "border-indigo-200",
    bgColor: "bg-indigo-50",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  amical: {
    label: "Match Amical",
    icon: Users,
    accentColor: "bg-primary",
    iconBg: "bg-primary/5",
    iconColor: "text-primary",
    borderColor: "border-primary/20",
    bgColor: "bg-primary/5",
    badge: "bg-primary/5 text-primary border-primary/20",
  },
  exhibition: {
    label: "Exhibition",
    icon: Trophy,
    accentColor: "bg-purple-500",
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    borderColor: "border-purple-200",
    bgColor: "bg-purple-50",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
  derby: {
    label: "Derby",
    icon: Flame,
    accentColor: "bg-orange-500",
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
  },
};

const getConfig = (type: string) => typeConfig[type] || typeConfig.amical;

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

  const now = useMemo(() => new Date(), []);
  const todayMatches = useMemo(
    () =>
      matches.filter((m) => {
        const matchDate = new Date(m.date);
        return matchDate.toDateString() === now.toDateString();
      }),
    [matches, now]
  );

  const upcomingMatches = useMemo(
    () =>
      matches
        .filter((m) => new Date(m.date) > now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [matches, now]
  );

  const pastMatches = useMemo(
    () =>
      matches
        .filter((m) => new Date(m.date) < now)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [matches, now]
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
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 rounded-xl shadow-sm p-8 max-w-md text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-red-600 mb-2">Erreur</h2>
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-secondary pt-2">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-heading text-secondary">Calendrier</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Saison {new Date().getFullYear()} &bull; {stats.total} matchs
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm text-gray-500">Total</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-secondary">{stats.total}</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm text-gray-500">A venir</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-secondary">{stats.upcoming}</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <span className="text-xs sm:text-sm text-gray-500">Passes</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-secondary">{stats.past}</div>
          </div>
        </div>

        {/* Today's Matches */}
        {todayMatches.length > 0 && (
          <div className="mb-8">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Radio className="w-5 h-5 text-green-600" />
                <h2 className="text-lg sm:text-xl font-heading text-secondary">
                  En direct &bull; Aujourd&apos;hui
                </h2>
              </div>
              <div className="grid gap-4">
                {todayMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    isLive
                    onClick={() => setSelectedMatch(match)}
                  />
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
            { key: "upcoming", label: "A venir" },
            { key: "past", label: "Passes" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterType(filter.key as any)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex-shrink-0 cursor-pointer ${
                filterType === filter.key
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600 hover:text-secondary hover:bg-gray-200"
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
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 border border-gray-200">
                <CalendarIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">Aucun match</h3>
              <p className="text-gray-400 text-sm">Aucun match pour cette periode</p>
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
      {selectedMatch && (
        <MatchModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
      )}
    </div>
  );
}

// === Match Card ===
function MatchCard({
  match,
  isLive = false,
  onClick,
}: {
  match: Match;
  isLive?: boolean;
  onClick: () => void;
}) {
  const config = getConfig(match.type);
  const Icon = config.icon;
  const matchDate = new Date(match.date);
  const isPast = matchDate < new Date();
  const hasResult =
    match.status === "COMPLETED" && match.ourScore != null && match.opponentScore != null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClick}
      className={`group relative bg-white border ${
        isLive ? "border-green-300" : "border-gray-200"
      } hover:shadow-md transition-all cursor-pointer rounded-xl overflow-hidden shadow-sm`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accentColor}`} />

      <div className="p-4 sm:p-5 pl-5 sm:pl-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${config.iconBg} border ${config.borderColor} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${config.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-secondary truncate">
                  {config.label} &bull; vs {match.opponent}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${config.badge}`}
                  >
                    {match.type.toUpperCase()}
                  </span>
                  {hasResult && (
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200">
                      {match.ourScore} - {match.opponentScore}
                    </span>
                  )}
                  {isPast && !hasResult && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                      TERMINE
                    </span>
                  )}
                  {isLive && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-green-50 text-green-700 border border-green-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">
                  {matchDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{match.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="truncate">{match.location}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <ChevronRight className="w-6 h-6 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// === Modal ===
function MatchModal({ match, onClose }: { match: Match; onClose: () => void }) {
  const config = getConfig(match.type);
  const Icon = config.icon;
  const matchDate = new Date(match.date);
  const hasResult =
    match.status === "COMPLETED" && match.ourScore != null && match.opponentScore != null;

  const titulaires = match.compositions.filter((c) => c.role === "TITULAIRE");
  const remplacants = match.compositions.filter((c) => c.role === "REMPLACANT");

  const slots: FormationSlots = {};
  for (const t of titulaires) {
    if (t.position) {
      slots[t.position] = {
        id: t.player.id,
        fullName: t.player.fullName,
        alias: t.player.alias,
        profilePhoto: t.player.profilePhoto,
        number: t.player.number,
      };
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-secondary transition-all z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className={`relative p-6 sm:p-8 ${config.bgColor} border-b ${config.borderColor}`}>
          <div className="flex items-center gap-4 mb-4">
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${config.iconBg} border ${config.borderColor} flex items-center justify-center flex-shrink-0`}
            >
              <Icon className={`w-7 h-7 sm:w-8 sm:h-8 ${config.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-heading text-secondary mb-1 truncate">
                FCA vs {match.opponent}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-md border ${config.badge}`}>
                  {config.label}
                </span>
                {match.place === "domicile" ? (
                  <span className="inline-flex items-center gap-1 text-green-700 text-xs font-semibold">
                    <Home className="w-3 h-3" /> Domicile
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-orange-700 text-xs font-semibold">
                    <Plane className="w-3 h-3" /> Extérieur
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Score */}
          {hasResult && (
            <div className="flex items-center justify-center gap-4 mt-4 bg-white rounded-xl border border-gray-200 p-4">
              <div className="text-center flex-1">
                <div className="text-[11px] text-gray-500 mb-1 font-semibold uppercase tracking-wide">
                  FCA
                </div>
                <div className="text-4xl font-black text-secondary">{match.ourScore}</div>
              </div>
              <div className="text-gray-300 text-2xl font-black">—</div>
              <div className="text-center flex-1">
                <div className="text-[11px] text-gray-500 mb-1 font-semibold uppercase tracking-wide truncate">
                  {match.opponent}
                </div>
                <div className="text-4xl font-black text-secondary">{match.opponentScore}</div>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Infos */}
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <CalendarIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Date</div>
                <div className="text-sm font-bold text-secondary">
                  {matchDate.toLocaleDateString("fr-FR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Heure</div>
                <div className="text-sm font-bold text-secondary">{match.time}</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-xs text-gray-500">Lieu</div>
                <div className="text-sm font-bold text-secondary">{match.location}</div>
              </div>
            </div>
          </div>

          {/* Composition */}
          {titulaires.length > 0 && (
            <div>
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Composition
              </h3>
              <FormationField slots={slots} opponentLabel={match.opponent} />

              {remplacants.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                    Remplaçants ({remplacants.length})
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {remplacants.map((r) => (
                      <div
                        key={r.id}
                        className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full pl-1 pr-3 py-1"
                      >
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                          {r.player.profilePhoto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={r.player.profilePhoto}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon className="w-3 h-3 text-gray-400" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-secondary">
                          {r.player.alias || r.player.fullName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Buteurs */}
          {match.goals.length > 0 && (
            <div>
              <h3 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <GoalIcon className="w-4 h-4" />
                Buteurs FCA
              </h3>
              <div className="space-y-2">
                {match.goals.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 flex items-center justify-center">
                      {g.player.profilePhoto ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={g.player.profilePhoto}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-secondary truncate">
                        {g.player.alias || g.player.fullName}
                      </p>
                      {g.assistPlayer && (
                        <p className="text-xs text-gray-500 truncate">
                          Passe&nbsp;: {g.assistPlayer.alias || g.assistPlayer.fullName}
                        </p>
                      )}
                    </div>
                    {g.minute != null && (
                      <span className="text-xs font-black bg-primary/10 text-primary px-2 py-1 rounded-md">
                        {g.minute}&apos;
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {match.notes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="text-xs font-black text-amber-800 uppercase mb-1">Notes</h4>
              <p className="text-sm text-amber-900 whitespace-pre-wrap">{match.notes}</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
}
