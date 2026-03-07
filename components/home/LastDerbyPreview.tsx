"use client";

import { useState, useEffect } from "react";
import { Flame, Trophy, Target, ChevronRight, Clock } from "lucide-react";
import Link from "next/link";

// ─── Types ───

type Player = { id: string; fullName: string };
type Team = { id: string; name: string; players: Player[] };
type Goal = { id: string; player: Player; isOwnGoal: boolean };
type Match = {
  id: string;
  date: string;
  score1?: number | null;
  score2?: number | null;
  status: string;
  winnerId?: string | null;
  goals?: Goal[];
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

// ─── Helpers ───

function getTeamEmoji(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("aigle")) return "🦅";
  if (lower.includes("lion")) return "🦁";
  return "⚽";
}

function getTeamColor(name: string) {
  return name.toLowerCase().includes("lion")
    ? { bg: "bg-orange-500", light: "bg-orange-50", text: "text-orange-600", icon: "text-orange-500" }
    : { bg: "bg-primary", light: "bg-primary/5", text: "text-primary", icon: "text-primary" };
}

// ─── Component ───

export default function LastDerbyPreview() {
  const [derby, setDerby] = useState<Derby | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLastDerby() {
      try {
        const res = await fetch("/api/derbys?take=1");
        if (!res.ok) return;
        const data = await res.json();
        if (data.derbys && data.derbys.length > 0) {
          setDerby(data.derbys[0]);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchLastDerby();
  }, []);

  if (loading || !derby) return null;

  const completedMatches = derby.matches.filter(m => m.status === "COMPLETED");
  const pendingMatches = derby.matches.filter(m => m.status !== "COMPLETED");
  const allMatches = [...derby.matches].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const totalGoals = completedMatches.reduce(
    (acc, m) => acc + (m.goals?.length || 0), 0
  );

  const isFinished = derby.status === "COMPLETED" || completedMatches.length === derby.matches.length;

  // Winner only if derby is fully completed
  let winnerName: string | null = null;
  if (isFinished) {
    if (derby.winnerId) {
      winnerName = derby.winnerId === derby.team1.id ? derby.team1.name : derby.team2.name;
    } else {
      let t1 = 0, t2 = 0;
      completedMatches.forEach(m => {
        if (m.winnerId === derby.team1.id) t1++;
        else if (m.winnerId === derby.team2.id) t2++;
      });
      if (t1 > t2) winnerName = derby.team1.name;
      else if (t2 > t1) winnerName = derby.team2.name;
    }
  }

  // Top scorer
  const goalCounts: Record<string, { name: string; count: number }> = {};
  completedMatches.forEach(m => {
    m.goals?.forEach(g => {
      if (!g.isOwnGoal) {
        if (!goalCounts[g.player.id]) {
          goalCounts[g.player.id] = { name: g.player.fullName, count: 0 };
        }
        goalCounts[g.player.id].count++;
      }
    });
  });
  const sortedScorers = Object.values(goalCounts).sort((a, b) => b.count - a.count);
  const topCount = sortedScorers[0]?.count ?? 0;
  const topScorers = sortedScorers.filter(s => s.count === topCount);

  const derbyDate = new Date(derby.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const team1Color = getTeamColor(derby.team1.name);
  const team2Color = getTeamColor(derby.team2.name);

  return (
    <section className="bg-white border-y border-gray-200 py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-secondary mb-1">
              {isFinished ? "Dernier derby" : "Derby en cours"}
            </h2>
            <p className="text-gray-500 text-sm capitalize">{derbyDate} &middot; {completedMatches.length}/{derby.matches.length} matchs joués</p>
          </div>
          <Link
            href="/visitors/tirages"
            className="hidden sm:inline-flex items-center gap-1.5 text-primary hover:text-primary-dark font-semibold text-sm transition-colors"
          >
            Tous les derbys
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Teams header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${team1Color.light} rounded-full flex items-center justify-center text-xl sm:text-2xl`}>
              {getTeamEmoji(derby.team1.name)}
            </div>
            <div>
              <h3 className={`font-heading font-bold text-base sm:text-lg ${team1Color.text}`}>{derby.team1.name}</h3>
              <p className="text-gray-400 text-xs">{derby.team1.players.length} joueurs</p>
            </div>
          </div>

          <span className="font-heading font-bold text-gray-300 text-sm">VS</span>

          <div className="flex items-center gap-3 flex-row-reverse">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${team2Color.light} rounded-full flex items-center justify-center text-xl sm:text-2xl`}>
              {getTeamEmoji(derby.team2.name)}
            </div>
            <div className="text-right">
              <h3 className={`font-heading font-bold text-base sm:text-lg ${team2Color.text}`}>{derby.team2.name}</h3>
              <p className="text-gray-400 text-xs">{derby.team2.players.length} joueurs</p>
            </div>
          </div>
        </div>

        {/* Match-by-match history */}
        <div className="space-y-2 mb-8">
          {allMatches.map((match, idx) => {
            const isCompleted = match.status === "COMPLETED";
            const matchDate = new Date(match.date).toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });

            const team1Won = match.winnerId === derby.team1.id;
            const team2Won = match.winnerId === derby.team2.id;
            const isDraw = isCompleted && !match.winnerId;

            return (
              <div
                key={match.id}
                className={`flex items-center gap-2 sm:gap-4 px-3 sm:px-4 py-3 rounded-lg sm:rounded-xl border transition-colors ${
                  isCompleted
                    ? "bg-white border-gray-200"
                    : "bg-gray-50 border-dashed border-gray-200"
                }`}
              >
                {/* Match number */}
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-500">J{idx + 1}</span>
                </div>

                {/* Date */}
                <div className="flex-shrink-0 w-20 sm:w-28">
                  <span className="text-xs sm:text-sm text-gray-500 capitalize">{matchDate}</span>
                </div>

                {/* Score row */}
                {isCompleted ? (
                  <div className="flex-1 flex items-center justify-center gap-3">
                    <span className={`font-heading font-bold text-lg sm:text-xl ${team1Won ? team1Color.text : isDraw ? "text-gray-500" : "text-gray-400"}`}>
                      {match.score1}
                    </span>
                    <span className="text-gray-300 text-sm">-</span>
                    <span className={`font-heading font-bold text-lg sm:text-xl ${team2Won ? team2Color.text : isDraw ? "text-gray-500" : "text-gray-400"}`}>
                      {match.score2}
                    </span>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <span className="text-xs text-gray-400 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      A venir
                    </span>
                  </div>
                )}

                {/* Result indicator */}
                <div className="flex-shrink-0 w-14 sm:w-20 text-right">
                  {isCompleted && (
                    <span className={`text-[10px] sm:text-xs font-semibold px-1.5 sm:px-2 py-1 rounded-md truncate max-w-full inline-block ${
                      team1Won
                        ? `${team1Color.light} ${team1Color.text}`
                        : team2Won
                        ? `${team2Color.light} ${team2Color.text}`
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {team1Won
                        ? derby.team1.name
                        : team2Won
                        ? derby.team2.name
                        : "Nul"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-surface border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-5">
          {/* Status */}
          <div className="text-center min-w-0">
            <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-accent-dark mx-auto mb-1 sm:mb-1.5" />
            <div className="text-xs sm:text-sm font-bold text-secondary truncate">
              {isFinished
                ? winnerName || "Egalité"
                : `${completedMatches.length}/${derby.matches.length} joués`}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              {isFinished ? "Vainqueur" : "En cours"}
            </div>
          </div>

          {/* Total goals */}
          <div className="text-center min-w-0">
            <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1 sm:mb-1.5" />
            <div className="text-xs sm:text-sm font-bold text-secondary">{totalGoals}</div>
            <div className="text-[10px] sm:text-xs text-gray-400">Buts marqués</div>
          </div>

          {/* Top scorer(s) */}
          <div className="text-center min-w-0">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mx-auto mb-1 sm:mb-1.5" />
            <div className="text-xs sm:text-sm font-bold text-secondary truncate px-1">
              {topScorers.length > 0
                ? topScorers.map(s => s.name).join(", ")
                : "—"}
            </div>
            <div className="text-[10px] sm:text-xs text-gray-400">
              {topScorers.length > 1
                ? `${topCount} but${topCount > 1 ? "s" : ""} chacun`
                : topScorers.length === 1
                ? `${topCount} but${topCount > 1 ? "s" : ""}`
                : "Meilleur buteur"}
            </div>
          </div>
        </div>

        {/* Mobile link */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/visitors/tirages"
            className="inline-flex items-center gap-1.5 text-primary hover:text-primary-dark font-semibold text-sm transition-colors"
          >
            Tous les derbys
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
