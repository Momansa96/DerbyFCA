"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

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
        return "bg-red-600";
      case "Milieu":
        return "bg-green-600";
      case "Défenseur":
        return "bg-blue-600";
      default:
        return "bg-gray-500";
    }
  };



  return (
    <div className="space-y-8 px-4 md:px-0">
      <h1 className="text-4xl font-extrabold text-indigo-600">
        Effectif FCA
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {players.map((player) => (
            <div
              key={player.id}
              className="card bg-white shadow-lg rounded-xl cursor-pointer hover:shadow-indigo-500/50 transition-shadow duration-300"
              onClick={() => setSelectedPlayer(player)}
            >
              <figure className="relative h-64 rounded-t-xl overflow-hidden">
                <Image
                  width={100}
                  height={100}
                  src={player.profilePhoto}
                  alt={`Photo de ${player.fullName}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 flex justify-between items-center">
                  <span className="text-white font-bold text-xl drop-shadow">
                    #{player.number}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-white text-sm font-semibold drop-shadow ${getPositionColor(
                      player.preferredPosition
                    )}`}
                  >
                    {player.preferredPosition}
                  </span>
                </div>
              </figure>
              <div className="card-body p-4">
                <h2 className="card-title text-lg font-bold text-gray-800">
                  {player.fullName}
                </h2>
                <p className="text-gray-600">{player.alias}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-6 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="player-dialog-title"
        >
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ring-1 ring-black ring-opacity-5">

            {/* En-tête avec photo et infos principales */}
            <div className="relative flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 p-8 border-b border-gray-200">
              <div className="flex-shrink-0">
                <Image
                  width={160}
                  height={160}
                  src={selectedPlayer.profilePhoto || "/images/default.png"}
                  alt={`Photo de ${selectedPlayer.fullName}`}
                  className="rounded-full object-center object-contain shadow-lg"
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2
                  id="player-dialog-title"
                  className="text-4xl font-extrabold text-gray-900 leading-tight"
                >
                  {selectedPlayer.fullName}{" "}
                  {selectedPlayer.alias && (
                    <span className="text-indigo-600 font-semibold text-xl">({selectedPlayer.alias})</span>
                  )}
                </h2>

                <p className="mt-2 text-lg text-gray-600 font-medium">
                  {selectedPlayer.preferredPosition || "Poste non défini"} ·{" "}
                  <span className="font-semibold">#{selectedPlayer.number ?? "N/A"}</span>
                </p>

                {selectedPlayer.bureauRole && (
                  <p className="mt-1 text-indigo-600 font-semibold">{selectedPlayer.bureauRole}</p>
                )}

                <p className="mt-2 text-gray-500">
                  <span className="font-semibold">Statut :</span> {selectedPlayer.status}
                </p>

                <p className="mt-1 text-gray-500">
                  <span className="font-semibold">Date d’adhésion :</span>{" "}
                  {new Date(selectedPlayer.joinDate).toLocaleDateString()}
                </p>

                {selectedPlayer.email && (
                  <p className="mt-1 text-gray-500 break-all">
                    <span className="font-semibold">Email :</span> {selectedPlayer.email}
                  </p>
                )}

                {selectedPlayer.phone && (
                  <p className="mt-1 text-gray-500">
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
                <span className="text-2xl leading-none select-none">x</span>
              </button>
            </div>

            {/* Corps du modal */}
            <div className="p-8 space-y-8">
              {selectedPlayer.description && (
                <section>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3 border-b border-indigo-600 inline-block pb-1">
                    Description
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{selectedPlayer.description}</p>
                </section>
              )}

              <section>
                <h3 className="text-2xl font-semibold text-gray-900 mb-3 border-b border-indigo-600 inline-block pb-1">
                  Statistiques
                </h3>
                <ul className="text-gray-700 space-y-2 text-lg">
                  <li>
                    <span className="font-semibold">Buts marqués :</span> {selectedPlayer.goalsCount ?? 0}
                  </li>
                  <li>
                    <span className="font-semibold">Buts contre son camp :</span> {selectedPlayer.ownGoals ?? 0}
                  </li>
                  {/* Tu peux ajouter ici d’autres stats ou des barres de progression */}
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
