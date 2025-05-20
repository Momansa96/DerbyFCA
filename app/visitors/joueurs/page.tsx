"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BadgeCheck, User, Shield, X, Mail, Phone } from "lucide-react";

export default function JoueursPage() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players");
      if (!response.ok) throw new Error("Erreur lors du chargement des joueurs");
      const data = await response.json();
      const formattedPlayers = data.map((player: any) => ({
        id: player.id,
        fullName: player.fullName,
        preferredPosition: player.preferredPosition || "Non défini",
        number: player.number || Math.floor(Math.random() * 99) + 1,
        profilePhoto: player.profilePhoto || "/images/default.jpeg",
        status: player.status,
        alias: player.alias,
        description: player.description,
        bureauRole: player.bureauRole,
        joinDate: player.joinDate,
        email: player.email,
        phone: player.phone,
        teams: player.teams || [],
        goalsCount: player.goals?.length || 0,
        ownGoals: player.goals?.filter((g: any) => g.isOwnGoal).length || 0,
      }));

      setPlayers(formattedPlayers);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPositionColor = (position: string) => {
    switch (position) {
      case "Attaquant":
        return "bg-gradient-to-r from-pink-400 to-red-500";
      case "Milieu":
        return "bg-gradient-to-r from-green-400 to-cyan-500";
      case "Défenseur":
        return "bg-gradient-to-r from-blue-400 to-indigo-500";
      case "Gardien":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="space-y-8 px-4 md:px-0 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold text-cyan-600 drop-shadow-[0_0_10px_rgba(6,182,212,0.2)] mb-8">
        Effectif du FCA
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {players.map((player) => (
            <div
              key={player.id}
              className="group relative bg-white/70 backdrop-blur-lg border border-cyan-100 rounded-2xl shadow-lg hover:shadow-cyan-400/30 transition-all duration-300 cursor-pointer overflow-hidden"
              onClick={() => setSelectedPlayer(player)}
            >
              {/* Badge statut */}
              {player.status === "Actif" && (
                <span className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1 text-xs rounded-full flex items-center gap-1 shadow">
                  <BadgeCheck size={16} /> Actif
                </span>
              )}
              {player.status === "Blessé" && (
                <span className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 text-xs rounded-full flex items-center gap-1 shadow">
                  <Shield size={16} /> Blessé
                </span>
              )}

              <figure className="relative h-60 rounded-t-2xl overflow-hidden">
                <Image
                  width={160}
                  height={160}
                  src={player.profilePhoto}
                  alt={`Photo de ${player.fullName}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3 flex justify-between items-end">
                  <span className="text-white font-extrabold text-2xl drop-shadow">
                    #{player.number}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-semibold drop-shadow shadow ${getPositionColor(
                      player.preferredPosition
                    )}`}
                  >
                    {player.preferredPosition}
                  </span>
                </div>
              </figure>
              <div className="p-4 space-y-1">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <User size={20} className="text-cyan-500" />
                  {player.fullName}
                </h2>
                {player.alias && (
                  <span className="inline-block text-cyan-600 font-semibold text-sm">
                    {player.alias}
                  </span>
                )}
                {player.bureauRole && (
                  <span className="inline-block bg-cyan-100 text-cyan-700 rounded-full px-2 py-0.5 text-xs font-semibold ml-2">
                    {player.bureauRole}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="player-dialog-title"
        >
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-cyan-100 ring-opacity-30 relative animate-fade-in">
            {/* En-tête */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 p-8 border-b border-cyan-100">
              <div className="flex-shrink-0">
                <Image
                  width={160}
                  height={160}
                  src={selectedPlayer.profilePhoto || "/images/default.jpeg"}
                  alt={`Photo de ${selectedPlayer.fullName}`}
                  className="rounded-full object-cover shadow-lg border-4 border-cyan-100"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2
                  id="player-dialog-title"
                  className="text-3xl font-extrabold text-cyan-700 leading-tight flex flex-wrap items-center gap-2"
                >
                  {selectedPlayer.fullName}
                  {selectedPlayer.alias && (
                    <span className="text-cyan-400 font-semibold text-xl">
                      ({selectedPlayer.alias})
                    </span>
                  )}
                </h2>
                <p className="mt-2 text-lg text-gray-600 font-medium flex items-center gap-2 justify-center md:justify-start">
                  {selectedPlayer.preferredPosition || "Poste non défini"}
                  <span className="font-semibold text-cyan-600">#{selectedPlayer.number ?? "N/A"}</span>
                </p>
                {selectedPlayer.bureauRole && (
                  <p className="mt-1 text-cyan-600 font-semibold">{selectedPlayer.bureauRole}</p>
                )}
                <p className="mt-2 text-gray-500">
                  <span className="font-semibold">Statut :</span> {selectedPlayer.status}
                </p>
                <p className="mt-1 text-gray-500">
                  <span className="font-semibold">Date d’adhésion :</span>{" "}
                  {selectedPlayer.joinDate ? new Date(selectedPlayer.joinDate).toLocaleDateString() : "N/A"}
                </p>
                {selectedPlayer.email && (
                  <p className="mt-1 text-gray-500 break-all flex items-center gap-2">
                    <Mail size={16} className="text-cyan-500" />
                    <span className="font-semibold">Email :</span> {selectedPlayer.email}
                  </p>
                )}
                {selectedPlayer.phone && (
                  <p className="mt-1 text-gray-500 flex items-center gap-2">
                    <Phone size={16} className="text-cyan-500" />
                    <span className="font-semibold">Téléphone :</span> {selectedPlayer.phone}
                  </p>
                )}
              </div>
              {/* Bouton fermer */}
              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-6 right-6 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md transition"
                aria-label="Fermer la fenêtre"
                title="Fermer"
              >
                <X size={24} />
              </button>
            </div>
            {/* Corps du modal */}
            <div className="p-8 space-y-8">
              {selectedPlayer.description && (
                <section>
                  <h3 className="text-2xl font-semibold text-cyan-700 mb-3 border-b border-cyan-200 inline-block pb-1">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{selectedPlayer.description}</p>
                </section>
              )}
              <section>
                <h3 className="text-2xl font-semibold text-cyan-700 mb-3 border-b border-cyan-200 inline-block pb-1">
                  Statistiques
                </h3>
                <ul className="text-gray-700 space-y-2 text-lg">
                  <li>
                    <span className="font-semibold">Buts marqués :</span> {selectedPlayer.goalsCount ?? 0}
                  </li>
                  <li>
                    <span className="font-semibold">Buts contre son camp :</span> {selectedPlayer.ownGoals ?? 0}
                  </li>
                  {/* Ajoute ici d’autres stats ou barres de progression si besoin */}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
