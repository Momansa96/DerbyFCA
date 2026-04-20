"use client";

import { useState, useEffect } from "react";
import { Trophy, Users, Calendar, Target, ChevronDown, ChevronUp, Flame, Award, UserPlus, Circle, Square, AlertTriangle } from "lucide-react";

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
  assistPlayer?: Player | null;
  teamId: string;
  isOwnGoal: boolean;
};

type YellowCard = {
  id: string;
  player: Player;
};

type RedCard = {
  id: string;
  player: Player;
};

type Match = {
  id: string;
  date: string;
  team1Id: string;
  team2Id: string;
  score1?: number | null;
  score2?: number | null;
  status: string;
  winnerId?: string | null;
  goals?: Goal[];
  yellowCards?: YellowCard[];
  redCards?: RedCard[];
};

type Derby = {
  id: string;
  team1: Team;
  team2: Team;
  matches: Match[];
  createdAt: string;
  status: string;
  winnerId?: string | null;
};

export default function DerbysPage() {
  const [derbys, setDerbys] = useState<Derby[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDerby, setExpandedDerby] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDerbys() {
      try {
        const res = await fetch("/api/derbys");
        if (!res.ok) throw new Error("Erreur lors de la récupération des derbys");
        const data = await res.json();

        setDerbys(data.derbys);
        // Auto-expand first derby
        if (data.derbys.length > 0) {
          setExpandedDerby(data.derbys[0].id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchDerbys();
  }, []);

  const toggleExpand = (derbyId: string) => {
    setExpandedDerby(expandedDerby === derbyId ? null : derbyId);
  };

  const getDerbyWinner = (derby: Derby) => {
    // Si le derby est terminé, utiliser le winnerId
    if (derby.status === "COMPLETED" && derby.winnerId) {
      const winnerTeam = derby.winnerId === derby.team1.id ? derby.team1 : derby.team2;
      return {
        winner: winnerTeam.name,
        color: winnerTeam.name === "Aigles" ? "green" : "orange",
        status: "completed"
      };
    }

    // Sinon calculer manuellement (fallback)
    const completedMatches = derby.matches.filter(m => m.status === "COMPLETED");

    if (completedMatches.length === 0) {
      return { winner: "En attente", color: "gray", status: "pending" };
    }

    if (completedMatches.length < derby.matches.length) {
      return { winner: "En cours", color: "yellow", status: "in_progress" };
    }

    // Calculer le vainqueur si pas de winnerId
    let team1Wins = 0;
    let team2Wins = 0;

    completedMatches.forEach((match) => {
      if (match.winnerId === derby.team1.id) team1Wins++;
      else if (match.winnerId === derby.team2.id) team2Wins++;
    });

    if (team1Wins > team2Wins) return { winner: derby.team1.name, color: "green", status: "completed" };
    if (team2Wins > team1Wins) return { winner: derby.team2.name, color: "orange", status: "completed" };

    // Départage par buts
    let team1Goals = 0;
    let team2Goals = 0;

    completedMatches.forEach((match) => {
      team1Goals += match.score1 ?? 0;
      team2Goals += match.score2 ?? 0;
    });

    if (team1Goals > team2Goals) return { winner: derby.team1.name, color: "green", status: "completed" };
    if (team2Goals > team1Goals) return { winner: derby.team2.name, color: "orange", status: "completed" };

    return { winner: "Égalité parfaite", color: "gray", status: "draw" };
  };

  const getMatchStatus = (match: Match, derby: Derby) => {
    if (match.status !== "COMPLETED") return "En attente";

    if (!match.winnerId) return "Match nul";

    const winner = match.winnerId === derby.team1.id ? derby.team1.name : derby.team2.name;
    return `Victoire ${winner}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
          </div>
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
            <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-secondary">Derbys</h1>
          </div>
          <p className="text-gray-500 text-sm">Historique des tirages &bull; {derbys.length} derbys</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
              <span className="text-xs sm:text-sm text-gray-500">Total</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-secondary">{derbys.length}</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm text-gray-500">Matchs</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-secondary">
              {derbys.reduce((acc, d) => acc + d.matches.length, 0)}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span className="text-xs sm:text-sm text-gray-500">Buts</span>
            </div>
            <div className="text-xl sm:text-2xl font-black text-secondary">
              {derbys.reduce(
                (acc, d) =>
                  acc +
                  d.matches.reduce(
                    (mAcc, m) => mAcc + (m.goals?.length || 0),
                    0
                  ),
                0
              )}
            </div>
          </div>
        </div>

        {/* Derbys List */}
        {derbys.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 border border-gray-200">
              <Flame className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-500 mb-2">Aucun derby</h3>
            <p className="text-gray-400 text-sm">Aucun derby disponible pour le moment</p>
          </div>
        ) : (
          <div className="space-y-4">
            {derbys.map((derby, index) => {
              const isExpanded = expandedDerby === derby.id;
              const winnerInfo = getDerbyWinner(derby);

              return (
                <div
                  key={derby.id}
                  className="relative bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition-all"
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />

                  {/* Header - Clickable */}
                  <div
                    onClick={() => toggleExpand(derby.id)}
                    className="p-4 sm:p-5 pl-5 sm:pl-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-500 flex items-center justify-center flex-shrink-0">
                            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-heading font-bold text-secondary truncate">
                              Derby {derby.team1.name} vs {derby.team2.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              {index === 0 && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-green-100 text-green-700 flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                  DERNIER
                                </span>
                              )}
                              <span className="text-xs text-gray-500">
                                {new Date(derby.createdAt).toLocaleDateString("fr-FR", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Winner badge */}
                        <div className="flex items-center gap-2 mt-3">
                          {winnerInfo.status === "completed" ? (
                            <Trophy className="w-4 h-4 text-accent-dark" />
                          ) : (
                            <Award className="w-4 h-4 text-gray-400" />
                          )}
                          <span
                            className={`text-sm font-bold ${
                              winnerInfo.color === "green"
                                ? "text-primary"
                                : winnerInfo.color === "orange"
                                ? "text-orange-600"
                                : winnerInfo.color === "yellow"
                                ? "text-yellow-600"
                                : "text-gray-500"
                            }`}
                          >
                            {winnerInfo.status === "pending"
                              ? "En attente de résultats"
                              : winnerInfo.status === "in_progress"
                              ? "En cours..."
                              : `Vainqueur: ${winnerInfo.winner}`
                            }
                          </span>
                        </div>
                      </div>

                      {/* Expand icon */}
                      <div className="flex items-center">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {/* Teams */}
                      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        {[
                          { team: derby.team1, color: "green" },
                          { team: derby.team2, color: "orange" },
                        ].map(({ team, color }) => (
                          <div
                            key={team.id}
                            className={`rounded-xl p-4 border ${
                              color === "green"
                                ? "bg-green-50 border-green-200"
                                : "bg-orange-50 border-orange-200"
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <Users
                                className={`w-5 h-5 ${
                                  color === "green" ? "text-primary" : "text-orange-600"
                                }`}
                              />
                              <h4
                                className={`font-bold text-base ${
                                  color === "green" ? "text-primary" : "text-orange-600"
                                }`}
                              >
                                {team.name}
                              </h4>
                              <span className="ml-auto text-xs text-gray-500">
                                {team.players.length} joueurs
                              </span>
                            </div>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                              {team.players.map((player) => (
                                <div
                                  key={player.id}
                                  className="text-sm text-gray-700 flex items-center gap-2"
                                >
                                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                  {player.fullName}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Matches */}
                      <div className="p-4 sm:p-6 pt-0 space-y-3">
                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Résultats des matchs
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                          {(() => {
                            // Séparer terminés (du + récent au + ancien) et à venir (chronologique)
                            const completed = derby.matches
                              .filter((m) => m.status === "COMPLETED")
                              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                            const upcoming = derby.matches
                              .filter((m) => m.status !== "COMPLETED")
                              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                            // Ordre : dernier terminé, prochain à venir, puis le reste
                            const ordered = [
                              ...(completed[0] ? [completed[0]] : []),
                              ...(upcoming[0] ? [upcoming[0]] : []),
                              ...completed.slice(1),
                              ...upcoming.slice(1),
                            ];

                            return ordered.map((match, idx) => (
                            <div
                              key={match.id}
                              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-all shadow-sm"
                            >
                              {/* Match header */}
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                    <span className="text-xs font-bold text-gray-600">#{idx + 1}</span>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {new Date(match.date).toLocaleDateString("fr-FR", {
                                      day: "numeric",
                                      month: "short"
                                    })}
                                  </span>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                                  match.status === "COMPLETED"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {match.status === "COMPLETED" ? "Terminé" : "À venir"}
                                </span>
                              </div>

                              {/* Score */}
                              <div className="text-center mb-3">
                                <div className="text-2xl font-black">
                                  {match.score1 !== null && match.score1 !== undefined && match.score2 !== null && match.score2 !== undefined ? (
                                    <>
                                      <span className={match.score1 > match.score2 ? "text-primary" : "text-gray-400"}>
                                        {match.score1}
                                      </span>
                                      <span className="text-gray-300 mx-2">-</span>
                                      <span className={match.score2 > match.score1 ? "text-orange-600" : "text-gray-400"}>
                                        {match.score2}
                                      </span>
                                    </>
                                  ) : (
                                    <span className="text-sm text-gray-400 font-normal">- - -</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {getMatchStatus(match, derby)}
                                </div>
                              </div>

                              {/* Goals, Cards */}
                              {match.status === "COMPLETED" && (
                                <div className="space-y-2">
                                  {/* Goals */}
                                  {match.goals && match.goals.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                      <div className="flex items-center gap-1 mb-1">
                                        <Target className="w-3 h-3 text-primary" />
                                        <span className="text-xs font-bold text-gray-500">Buteurs</span>
                                      </div>
                                      <div className="space-y-1">
                                        {match.goals.map((goal) => (
                                          <div key={goal.id} className="text-xs text-gray-700">
                                            <div className="flex items-center gap-1">
                                              <Circle className="w-3 h-3 text-primary fill-primary" />
                                              <span className={goal.isOwnGoal ? "text-red-600" : ""}>
                                                {goal.player.fullName}
                                              </span>
                                              {goal.isOwnGoal && (
                                                <span className="text-red-600 font-bold">(CSC)</span>
                                              )}
                                            </div>
                                            {goal.assistPlayer && (
                                              <div className="ml-4 text-gray-500 flex items-center gap-1">
                                                <UserPlus className="w-3 h-3" />
                                                <span>Passe: {goal.assistPlayer.fullName}</span>
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Cards */}
                                  {((match.yellowCards && match.yellowCards.length > 0) ||
                                    (match.redCards && match.redCards.length > 0)) && (
                                    <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                                      <div className="flex items-center gap-1 mb-1">
                                        <span className="text-xs font-bold text-gray-500">Cartons</span>
                                      </div>
                                      <div className="space-y-1">
                                        {match.yellowCards?.map((card) => (
                                          <div key={card.id} className="text-xs text-gray-700 flex items-center gap-1">
                                            <Square className="w-3 h-3 text-yellow-500 fill-yellow-400" />
                                            {card.player.fullName}
                                          </div>
                                        ))}
                                        {match.redCards?.map((card) => (
                                          <div key={card.id} className="text-xs text-gray-700 flex items-center gap-1">
                                            <Square className="w-3 h-3 text-red-600 fill-red-500" />
                                            {card.player.fullName}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ));
                          })()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
