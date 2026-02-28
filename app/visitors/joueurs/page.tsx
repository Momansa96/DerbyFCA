"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BadgeCheck, User, Shield, X, Mail, Phone, TrendingUp, Target, Award } from "lucide-react";

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

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "Attaquant":
        return "⚡";
      case "Milieu":
        return "🎯";
      case "Défenseur":
        return "🛡️";
      case "Gardien":
        return "🧤";
      default:
        return "⚽";
    }
  };

  // Séparer les membres du bureau et les autres joueurs
  const bureauMembers = players.filter(p => p.bureauRole);
  const regularPlayers = players.filter(p => !p.bureauRole);

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Effectif du FCA</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Découvrez les joueurs qui font la fierté du Football Club Atrokpocodji
          </p>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
              {players.length} joueurs actifs
            </span>
            {bureauMembers.length > 0 && (
              <span className="flex items-center gap-2 text-gray-400">
                <Award size={14} className="text-indigo-400" />
                {bureauMembers.length} membres du bureau
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-400 font-medium">Chargement des joueurs...</p>
          </div>
        ) : (
          <>
            {/* Section Bureau */}
            {bureauMembers.length > 0 && (
              <div className="mb-12 sm:mb-16">
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      Bureau du Club
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-indigo-500/30 to-transparent"></div>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Mandat en cours • Saison {new Date().getFullYear()}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {bureauMembers.map((player, index) => (
                    <div
                      key={player.id}
                      className="group relative bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-indigo-500/30 hover:border-indigo-400 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => setSelectedPlayer(player)}
                    >
                      {/* Badge Bureau */}
                      <div className="absolute top-3 left-3 right-3 z-10">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-3 py-1.5 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-lg">
                          <Award size={14} />
                          {player.bureauRole}
                        </div>
                      </div>

                      {/* Badge statut */}
                      {player.status === "ACTIF" && (
                        <div className="absolute top-12 right-3 z-10 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <BadgeCheck size={12} />
                          Actif
                        </div>
                      )}

                      {/* Image joueur */}
                      <div className="relative h-64 sm:h-72 overflow-hidden">
                        <Image
                          width={320}
                          height={320}
                          src={player.profilePhoto}
                          alt={`Photo de ${player.fullName}`}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 via-indigo-900/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-end justify-between">
                            <span className="text-white font-black text-4xl sm:text-5xl drop-shadow-lg">
                              #{player.number}
                            </span>
                            <div
                              className={`px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-xl ${getPositionColor(
                                player.preferredPosition
                              )} flex items-center gap-1.5`}
                            >
                              <span>{getPositionIcon(player.preferredPosition)}</span>
                              {player.preferredPosition}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 bg-gray-900/50">
                        <h2 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-indigo-400 transition-colors">
                          {player.fullName}
                        </h2>
                        {player.alias && (
                          <p className="text-indigo-600 font-semibold text-sm mb-2">
                            &quot;{player.alias}&quot;
                          </p>
                        )}
                        <div className="flex items-center gap-3 pt-3 border-t border-gray-700/50">
                          <div className="flex items-center gap-1.5 text-gray-300">
                            <Target size={16} className="text-green-500" />
                            <span className="text-sm font-semibold">{player.goalsCount}</span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/0 to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Membres */}
            <div>
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                    Membres du Club
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
                </div>
                <p className="text-gray-400 text-sm sm:text-base">
                  {regularPlayers.length} joueur{regularPlayers.length > 1 ? 's' : ''} actif{regularPlayers.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {regularPlayers.map((player, index) => (
              <div
                key={player.id}
                className="group relative bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-cyan-500/30 hover:border-cyan-300 rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 cursor-pointer overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => setSelectedPlayer(player)}
              >
                {/* Badge statut */}
                {player.status === "ACTIF" && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                    <BadgeCheck size={14} />
                    Actif
                  </div>
                )}
                {player.status === "BLESSE" && (
                  <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-lg">
                    <Shield size={14} />
                    Blessé
                  </div>
                )}

                {/* Image joueur */}
                <div className="relative h-64 sm:h-72 overflow-hidden">
                  <Image
                    width={320}
                    height={320}
                    src={player.profilePhoto}
                    alt={`Photo de ${player.fullName}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Numéro et poste */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-end justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-white font-black text-4xl sm:text-5xl drop-shadow-lg">
                          #{player.number}
                        </span>
                      </div>
                      <div
                        className={`px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-xl ${getPositionColor(
                          player.preferredPosition
                        )} flex items-center gap-1.5`}
                      >
                        <span>{getPositionIcon(player.preferredPosition)}</span>
                        {player.preferredPosition}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Infos joueur */}
                <div className="p-4 sm:p-5 bg-gray-900/50">
                  <h2 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                    {player.fullName}
                  </h2>

                  {player.alias && (
                    <p className="text-cyan-600 font-semibold text-sm mb-2">
                      &quot;{player.alias}&quot;
                    </p>
                  )}

                  {player.bureauRole && (
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 text-indigo-700 rounded-full px-3 py-1 text-xs font-bold mb-3">
                      <Award size={12} />
                      {player.bureauRole}
                    </div>
                  )}

                  {/* Stats rapides */}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-700/50">
                    <div className="flex items-center gap-1.5 text-gray-300">
                      <Target size={16} className="text-green-500" />
                      <span className="text-sm font-semibold">{player.goalsCount}</span>
                    </div>
                    {player.ownGoals > 0 && (
                      <div className="flex items-center gap-1.5 text-gray-300">
                        <TrendingUp size={16} className="text-red-500" />
                        <span className="text-sm font-semibold">{player.ownGoals}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
              </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && players.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/50 rounded-full mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Aucun joueur</h3>
            <p className="text-gray-400">L&apos;effectif sera bientôt disponible</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="player-dialog-title"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="bg-gradient-to-br from-white to-gray-50 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border-2 border-cyan-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec image de fond */}
            <div className="relative h-48 sm:h-64 bg-gradient-to-br from-cyan-600 to-indigo-600 overflow-hidden">
              <Image
                width={800}
                height={256}
                src={selectedPlayer.profilePhoto || "/images/default.jpeg"}
                alt={`Background ${selectedPlayer.fullName}`}
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Bouton fermer */}
              <button
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Fermer la fenêtre"
              >
                <X size={20} />
              </button>

              {/* Badge poste */}
              <div className="absolute top-4 left-4">
                <div
                  className={`px-4 py-2 rounded-full text-white text-sm font-bold shadow-xl ${getPositionColor(
                    selectedPlayer.preferredPosition
                  )} flex items-center gap-2`}
                >
                  <span className="text-lg">{getPositionIcon(selectedPlayer.preferredPosition)}</span>
                  {selectedPlayer.preferredPosition}
                </div>
              </div>

              {/* Numéro */}
              <div className="absolute bottom-4 right-4">
                <div className="text-white/90 font-black text-6xl sm:text-7xl drop-shadow-2xl">
                  #{selectedPlayer.number}
                </div>
              </div>
            </div>

            {/* Contenu scrollable */}
            <div className="overflow-y-auto max-h-[calc(90vh-16rem)]">
              {/* Profile info */}
              <div className="p-6 sm:p-8">
                {/* Avatar + Infos principales */}
                <div className="flex items-start gap-4 sm:gap-6 mb-6">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Image
                        width={120}
                        height={120}
                        src={selectedPlayer.profilePhoto || "/images/default.jpeg"}
                        alt={`Photo de ${selectedPlayer.fullName}`}
                        className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl object-cover shadow-xl border-4 border-white ring-4 ring-cyan-500/20"
                      />
                      {selectedPlayer.status === "ACTIF" && (
                        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-lg">
                          <BadgeCheck size={10} />
                          <span className="hidden sm:inline">Actif</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Infos à droite de l'avatar */}
                  <div className="flex-1 min-w-0">
                    <h2
                      id="player-dialog-title"
                      className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 sm:mb-2 leading-tight"
                    >
                      {selectedPlayer.fullName}
                    </h2>

                    {selectedPlayer.alias && (
                      <p className="text-cyan-600 font-bold text-sm sm:text-base mb-2">
                        &quot;{selectedPlayer.alias}&quot;
                      </p>
                    )}

                    {/* Poste */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold shadow-md ${getPositionColor(
                          selectedPlayer.preferredPosition
                        )}`}
                      >
                        <span>{getPositionIcon(selectedPlayer.preferredPosition)}</span>
                        {selectedPlayer.preferredPosition}
                      </div>

                      {selectedPlayer.bureauRole && (
                        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full px-3 py-1 text-xs font-bold shadow-md">
                          <Award size={12} />
                          {selectedPlayer.bureauRole}
                        </div>
                      )}
                    </div>

                    {/* Infos complémentaires mobile */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">#{selectedPlayer.number}</span>
                      </div>
                      {selectedPlayer.joinDate && (
                        <div className="flex items-center gap-1">
                          <BadgeCheck size={12} className="text-indigo-500" />
                          <span>Depuis {new Date(selectedPlayer.joinDate).getFullYear()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-3 text-center">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-black text-green-700">{selectedPlayer.goalsCount}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Buts</div>
                  </div>
                  <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border border-cyan-200 rounded-xl p-3 text-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-black text-cyan-700">{selectedPlayer.teams?.length || 0}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Équipes</div>
                  </div>
                  {selectedPlayer.ownGoals > 0 && (
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-3 text-center">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mx-auto mb-1" />
                      <div className="text-xl sm:text-2xl font-black text-red-700">{selectedPlayer.ownGoals}</div>
                      <div className="text-[10px] sm:text-xs text-gray-600 font-medium">CSC</div>
                    </div>
                  )}
                </div>

                {/* Contact info */}
                {(selectedPlayer.email || selectedPlayer.phone) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      Coordonnées
                    </h3>
                    <div className="space-y-2">
                      {selectedPlayer.email && (
                        <a
                          href={`mailto:${selectedPlayer.email}`}
                          className="flex items-center gap-3 text-gray-700 hover:text-cyan-600 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                            <Mail size={18} className="text-cyan-600" />
                          </div>
                          <span className="text-sm font-medium">{selectedPlayer.email}</span>
                        </a>
                      )}
                      {selectedPlayer.phone && (
                        <a
                          href={`tel:${selectedPlayer.phone}`}
                          className="flex items-center gap-3 text-gray-700 hover:text-cyan-600 transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                            <Phone size={18} className="text-cyan-600" />
                          </div>
                          <span className="text-sm font-medium">{selectedPlayer.phone}</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {selectedPlayer.description && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      À propos
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{selectedPlayer.description}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
