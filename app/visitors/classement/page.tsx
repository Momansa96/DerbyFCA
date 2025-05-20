"use client";

import { useState, useEffect, useMemo } from "react";

type Player = {
  id: string;
  fullName: string;
  alias?: string;
  number?: number;
  teams: string[];
  goalsCount: number;
  matchesPlayed?: number;
};

type SortKey = "position" | "fullName" | "goalsCount";
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 10;

export default function ClassementPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("position");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");

  useEffect(() => {
    async function fetchPlayers() {
      try {
        const res = await fetch("/api/players");
        if (!res.ok) throw new Error("Erreur lors de la récupération des joueurs");
        const data = await res.json();
        setPlayers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPlayers();
  }, []);

  // Filtrage par recherche
  const filteredPlayers = useMemo(() => {
    return players.filter((p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase())
    );
  }, [players, search]);

  // Tri dynamique
  const sortedPlayers = useMemo(() => {
    let sorted = [...filteredPlayers];
    if (sortKey === "position") {
      sorted.sort((a, b) => b.goalsCount - a.goalsCount);
    } else if (sortKey === "fullName") {
      sorted.sort((a, b) =>
        sortDirection === "asc"
          ? a.fullName.localeCompare(b.fullName)
          : b.fullName.localeCompare(a.fullName)
      );
    } else if (sortKey === "goalsCount") {
      sorted.sort((a, b) =>
        sortDirection === "asc" ? a.goalsCount - b.goalsCount : b.goalsCount - a.goalsCount
      );
    }
    return sorted;
  }, [filteredPlayers, sortKey, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(sortedPlayers.length / PAGE_SIZE);
  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sortedPlayers.slice(start, start + PAGE_SIZE);
  }, [sortedPlayers, currentPage]);

  // Gestion changement tri
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-400 animate-pulse">Chargement...</p>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-500 font-semibold">Erreur : {error}</p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-white">
      <h1 className="text-5xl font-extrabold text-cyan-400 drop-shadow-lg text-center mb-8">
        Classement des Buteurs
      </h1>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher un joueur"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full max-w-md shadow-md rounded-lg p-3 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
          aria-label="Rechercher un joueur"
        />

        <div className="flex gap-3">
          <button
            onClick={() => setViewMode("table")}
            aria-pressed={viewMode === "table"}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === "table"
                ? "bg-cyan-600 text-white shadow-lg"
                : "bg-white text-cyan-600 hover:bg-cyan-100"
            }`}
            title="Vue tableau"
          >
            Tableau
          </button>
          <button
            onClick={() => setViewMode("cards")}
            aria-pressed={viewMode === "cards"}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              viewMode === "cards"
                ? "bg-cyan-600 text-white shadow-lg"
                : "bg-white text-cyan-600 hover:bg-cyan-100"
            }`}
            title="Vue cartes"
          >
            Cartes
          </button>
        </div>
      </div>

      {viewMode === "table" ? (
        <div className="overflow-x-auto rounded-xl shadow-xl border border-cyan-600 bg-indigo-900/60 backdrop-blur-lg">
          <table className="w-full min-w-[600px] text-left text-white">
            <thead className="bg-cyan-700/90 cursor-pointer select-none">
              <tr>
                <th
                  className="px-6 py-4 text-lg font-semibold"
                  onClick={() => handleSort("position")}
                  aria-sort={
                    sortKey === "position"
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  scope="col"
                >
                  Position {sortKey === "position" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-6 py-4 text-lg font-semibold"
                  onClick={() => handleSort("fullName")}
                  aria-sort={
                    sortKey === "fullName"
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  scope="col"
                >
                  Joueur {sortKey === "fullName" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </th>
                <th
                  className="px-6 py-4 text-lg font-semibold"
                  onClick={() => handleSort("goalsCount")}
                  aria-sort={
                    sortKey === "goalsCount"
                      ? sortDirection === "asc"
                        ? "ascending"
                        : "descending"
                      : "none"
                  }
                  scope="col"
                >
                  Buts {sortKey === "goalsCount" ? (sortDirection === "asc" ? "▲" : "▼") : ""}
                </th>
                <th className="px-6 py-4 text-lg font-semibold">Titre joueur</th>
              </tr>
            </thead>
            <tbody>
              {paginatedPlayers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-6 text-gray-400">
                    Aucun joueur trouvé.
                  </td>
                </tr>
              ) : (
                paginatedPlayers.map((player, index) => {
                  const globalIndex = (currentPage - 1) * PAGE_SIZE + index;
                  let titre = "";
                  let titreStyle = "";
                  let emoji = "";
                  if (globalIndex === 0) {
                    titre = "PICHICHI";
                    titreStyle = "text-yellow-400 font-bold";
                    emoji = "🥇";
                  } else if (globalIndex === 1) {
                    titre = "Second couteau";
                    titreStyle = "text-slate-300 font-semibold";
                    emoji = "🥈";
                  } else if (globalIndex === players.length - 1) {
                    titre = "DJOKPOTO";
                    titreStyle = "text-red-500 font-semibold italic";
                    emoji = "🥉";
                  } else {
                    titre = "-";
                    titreStyle = "text-gray-400";
                  }

                  return (
                    <tr
                      key={player.id}
                      className={`transition-colors duration-300 hover:bg-cyan-700/40 cursor-pointer ${
                        globalIndex === 0
                          ? "bg-cyan-600/40 font-bold text-yellow-300"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-lg">{globalIndex + 1}</td>
                      <td className="px-6 py-4 flex flex-col md:flex-row md:items-center md:gap-3 text-lg">
                        <span>{player.fullName}</span>
                        {player.alias && (
                          <span className="text-xs text-cyan-300 italic md:ml-2">
                            ({player.alias})
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-lg">{player.goalsCount}</td>
                      <td
                        className={`px-6 py-4 text-lg flex items-center gap-2 ${titreStyle}`}
                      >
                        <span>{emoji}</span> {titre}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {paginatedPlayers.length === 0 ? (
            <p className="text-center text-gray-400 col-span-full">
              Aucun joueur trouvé.
            </p>
          ) : (
            paginatedPlayers.map((player, index) => {
              const globalIndex = (currentPage - 1) * PAGE_SIZE + index;
              let titre = "";
              let titreStyle = "";
              let emoji = "";
              if (globalIndex === 0) {
                titre = "PICHICHI";
                titreStyle = "text-yellow-400 font-bold";
                emoji = "🥇";
              } else if (globalIndex === 1) {
                titre = "Second couteau";
                titreStyle = "text-slate-300 font-semibold";
                emoji = "🥈";
              } else if (globalIndex === players.length - 1) {
                titre = "DJOKPOTO";
                titreStyle = "text-red-500 font-semibold italic";
                emoji = "🥉";
              } else {
                titre = "-";
                titreStyle = "text-gray-400";
              }

              return (
                <div
                  key={player.id}
                  className="bg-indigo-900/60 backdrop-blur-md border border-cyan-600 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-cyan-400/50 transition"
                  title={`${player.fullName} (${player.alias ?? "Pas d'alias"})`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-cyan-400 font-bold text-xl">
                      #{player.number ?? globalIndex + 1}
                    </span>
                    <span className={`text-lg flex items-center gap-2 ${titreStyle}`}>
                      <span>{emoji}</span> {titre}
                    </span>
                  </div>
                  <h3 className="text-white font-extrabold text-lg mb-1">
                    {player.fullName}
                  </h3>
                  {player.alias && (
                    <p className="text-cyan-300 italic mb-2">({player.alias})</p>
                  )}
                  <p className="text-white/80 font-semibold">
                    Buts marqués : {player.goalsCount}
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          className="flex justify-center items-center gap-3 mt-8"
          aria-label="Pagination des joueurs"
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-md bg-cyan-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Page précédente"
          >
            ←
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              aria-current={currentPage === i + 1 ? "page" : undefined}
              className={`px-4 py-1 rounded-md font-semibold transition ${
                currentPage === i + 1
                  ? "bg-cyan-500 text-white shadow-lg"
                  : "bg-white text-cyan-600 hover:bg-cyan-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-md bg-cyan-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Page suivante"
          >
            →
          </button>
        </nav>
      )}
    </div>
  );
}
