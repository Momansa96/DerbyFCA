"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { BadgeCheck, User, Shield, X, Mail, Phone, TrendingUp, Target, Award, Zap, Crosshair, Hand, Circle } from "lucide-react";

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
        preferredPosition: player.preferredPosition || "Non defini",
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
        return "bg-red-500";
      case "Milieu":
        return "bg-primary";
      case "Defenseur":
        return "bg-blue-500";
      case "Gardien":
        return "bg-accent-dark";
      default:
        return "bg-gray-400";
    }
  };

  const getPositionIcon = (position: string) => {
    switch (position) {
      case "Attaquant":
        return <Zap size={14} />;
      case "Milieu":
        return <Crosshair size={14} />;
      case "Defenseur":
        return <Shield size={14} />;
      case "Gardien":
        return <Hand size={14} />;
      default:
        return <Circle size={14} />;
    }
  };

  const getPositionIconLg = (position: string) => {
    switch (position) {
      case "Attaquant":
        return <Zap size={18} />;
      case "Milieu":
        return <Crosshair size={18} />;
      case "Defenseur":
        return <Shield size={18} />;
      case "Gardien":
        return <Hand size={18} />;
      default:
        return <Circle size={18} />;
    }
  };

  // Separer les membres du bureau et les autres joueurs
  const bureauMembers = players.filter(p => p.bureauRole);
  const regularPlayers = players.filter(p => !p.bureauRole);

  return (
    <div className="min-h-screen bg-surface text-secondary pt-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-secondary">Effectif du FCA</h1>
          </div>
          <p className="text-gray-500 text-sm">
            Decouvrez les joueurs qui font la fierte du Football Club Atrokpocodji
          </p>
          <div className="mt-4 flex items-center gap-6 text-sm">
            <span className="flex items-center gap-2 text-gray-500">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              {players.length} joueurs actifs
            </span>
            {bureauMembers.length > 0 && (
              <span className="flex items-center gap-2 text-gray-500">
                <Award size={14} className="text-primary" />
                {bureauMembers.length} membres du bureau
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-500 font-medium">Chargement des joueurs...</p>
          </div>
        ) : (
          <>
            {/* Section Bureau */}
            {bureauMembers.length > 0 && (
              <div className="mb-12 sm:mb-16">
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl sm:text-2xl font-heading font-black text-secondary">
                      Bureau du Club
                    </h2>
                    <div className="h-px flex-1 bg-gray-200"></div>
                  </div>
                  <p className="text-gray-500 text-sm">
                    Mandat en cours - Saison {new Date().getFullYear()}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                  {bureauMembers.map((player) => (
                    <div
                      key={player.id}
                      className="group relative bg-white border border-gray-200 hover:border-primary/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                      onClick={() => setSelectedPlayer(player)}
                    >
                      {/* Badge Bureau */}
                      <div className="absolute top-3 left-3 right-3 z-10">
                        <div className="bg-primary text-white px-3 py-1.5 text-xs font-bold rounded-full flex items-center justify-center gap-1.5 shadow-sm">
                          <Award size={14} />
                          {player.bureauRole}
                        </div>
                      </div>

                      {/* Badge statut */}
                      {player.status === "ACTIF" && (
                        <div className="absolute top-12 right-3 z-10 bg-primary/10 text-primary px-2 py-1 text-xs font-bold rounded-full flex items-center gap-1">
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
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <div className="flex items-end justify-between">
                            <span className="text-white font-black text-4xl sm:text-5xl drop-shadow-lg">
                              #{player.number}
                            </span>
                            <div
                              className={`px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm ${getPositionColor(
                                player.preferredPosition
                              )} flex items-center gap-1.5`}
                            >
                              {getPositionIcon(player.preferredPosition)}
                              {player.preferredPosition}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5">
                        <h2 className="text-lg sm:text-xl font-bold text-secondary mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                          {player.fullName}
                        </h2>
                        {player.alias && (
                          <p className="text-primary font-semibold text-sm mb-2">
                            &quot;{player.alias}&quot;
                          </p>
                        )}
                        <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <Target size={16} className="text-primary" />
                            <span className="text-sm font-semibold">{player.goalsCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Section Membres */}
            <div>
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-secondary">
                    Membres du Club
                  </h2>
                  <div className="h-px flex-1 bg-gray-200"></div>
                </div>
                <p className="text-gray-500 text-sm sm:text-base">
                  {regularPlayers.length} joueur{regularPlayers.length > 1 ? 's' : ''} actif{regularPlayers.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {regularPlayers.map((player) => (
                  <div
                    key={player.id}
                    className="group relative bg-white border border-gray-200 hover:border-primary/40 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    {/* Badge statut */}
                    {player.status === "ACTIF" && (
                      <div className="absolute top-3 right-3 z-10 bg-primary/10 text-primary px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5">
                        <BadgeCheck size={14} />
                        Actif
                      </div>
                    )}
                    {player.status === "BLESSE" && (
                      <div className="absolute top-3 right-3 z-10 bg-orange-100 text-orange-700 px-3 py-1.5 text-xs font-bold rounded-full flex items-center gap-1.5">
                        <Shield size={14} />
                        Blesse
                      </div>
                    )}

                    {/* Image joueur */}
                    <div className="relative h-64 sm:h-72 overflow-hidden">
                      <Image
                        width={320}
                        height={320}
                        src={player.profilePhoto}
                        alt={`Photo de ${player.fullName}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                      {/* Numero et poste */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div className="flex items-end justify-between">
                          <div className="flex items-baseline gap-2">
                            <span className="text-white font-black text-4xl sm:text-5xl drop-shadow-lg">
                              #{player.number}
                            </span>
                          </div>
                          <div
                            className={`px-3 py-1.5 rounded-full text-white text-xs font-bold shadow-sm ${getPositionColor(
                              player.preferredPosition
                            )} flex items-center gap-1.5`}
                          >
                            {getPositionIcon(player.preferredPosition)}
                            {player.preferredPosition}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Infos joueur */}
                    <div className="p-4 sm:p-5">
                      <h2 className="text-lg sm:text-xl font-bold text-secondary mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                        {player.fullName}
                      </h2>

                      {player.alias && (
                        <p className="text-primary font-semibold text-sm mb-2">
                          &quot;{player.alias}&quot;
                        </p>
                      )}

                      {player.bureauRole && (
                        <div className="inline-flex items-center gap-1.5 bg-primary text-white rounded-full px-3 py-1 text-xs font-bold mb-3">
                          <Award size={12} />
                          {player.bureauRole}
                        </div>
                      )}

                      {/* Stats rapides */}
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Target size={16} className="text-primary" />
                          <span className="text-sm font-semibold">{player.goalsCount}</span>
                        </div>
                        {player.ownGoals > 0 && (
                          <div className="flex items-center gap-1.5 text-gray-600">
                            <TrendingUp size={16} className="text-red-500" />
                            <span className="text-sm font-semibold">{player.ownGoals}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && players.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-secondary mb-2">Aucun joueur</h3>
            <p className="text-gray-500">L&apos;effectif sera bientot disponible</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      {selectedPlayer && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="player-dialog-title"
          onClick={() => setSelectedPlayer(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header avec image de fond */}
            <div className="relative h-48 sm:h-64 bg-primary overflow-hidden">
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
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                aria-label="Fermer la fenetre"
              >
                <X size={20} />
              </button>

              {/* Badge poste */}
              <div className="absolute top-4 left-4">
                <div
                  className={`px-4 py-2 rounded-full text-white text-sm font-bold shadow-sm ${getPositionColor(
                    selectedPlayer.preferredPosition
                  )} flex items-center gap-2`}
                >
                  {getPositionIconLg(selectedPlayer.preferredPosition)}
                  {selectedPlayer.preferredPosition}
                </div>
              </div>

              {/* Numero */}
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
                        className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl object-cover shadow-xl border-4 border-white ring-4 ring-primary/20"
                      />
                      {selectedPlayer.status === "ACTIF" && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-white px-2 py-0.5 text-[10px] font-bold rounded-full flex items-center gap-1 shadow-sm">
                          <BadgeCheck size={10} />
                          <span className="hidden sm:inline">Actif</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Infos a droite de l'avatar */}
                  <div className="flex-1 min-w-0">
                    <h2
                      id="player-dialog-title"
                      className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 sm:mb-2 leading-tight"
                    >
                      {selectedPlayer.fullName}
                    </h2>

                    {selectedPlayer.alias && (
                      <p className="text-primary font-bold text-sm sm:text-base mb-2">
                        &quot;{selectedPlayer.alias}&quot;
                      </p>
                    )}

                    {/* Poste */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white text-xs font-bold shadow-sm ${getPositionColor(
                          selectedPlayer.preferredPosition
                        )}`}
                      >
                        {getPositionIcon(selectedPlayer.preferredPosition)}
                        {selectedPlayer.preferredPosition}
                      </div>

                      {selectedPlayer.bureauRole && (
                        <div className="inline-flex items-center gap-1.5 bg-primary text-white rounded-full px-3 py-1 text-xs font-bold shadow-sm">
                          <Award size={12} />
                          {selectedPlayer.bureauRole}
                        </div>
                      )}
                    </div>

                    {/* Infos complementaires mobile */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-2">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-900">#{selectedPlayer.number}</span>
                      </div>
                      {selectedPlayer.joinDate && (
                        <div className="flex items-center gap-1">
                          <BadgeCheck size={12} className="text-primary" />
                          <span>Depuis {new Date(selectedPlayer.joinDate).getFullYear()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 text-center">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-black text-primary">{selectedPlayer.goalsCount}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Buts</div>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-xl sm:text-2xl font-black text-gray-700">{selectedPlayer.teams?.length || 0}</div>
                    <div className="text-[10px] sm:text-xs text-gray-600 font-medium">Equipes</div>
                  </div>
                  {selectedPlayer.ownGoals > 0 && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
                      <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 mx-auto mb-1" />
                      <div className="text-xl sm:text-2xl font-black text-red-600">{selectedPlayer.ownGoals}</div>
                      <div className="text-[10px] sm:text-xs text-gray-600 font-medium">CSC</div>
                    </div>
                  )}
                </div>

                {/* Contact info */}
                {(selectedPlayer.email || selectedPlayer.phone) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                      Coordonnees
                    </h3>
                    <div className="space-y-2">
                      {selectedPlayer.email && (
                        <a
                          href={`mailto:${selectedPlayer.email}`}
                          className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Mail size={18} className="text-primary" />
                          </div>
                          <span className="text-sm font-medium">{selectedPlayer.email}</span>
                        </a>
                      )}
                      {selectedPlayer.phone && (
                        <a
                          href={`tel:${selectedPlayer.phone}`}
                          className="flex items-center gap-3 text-gray-700 hover:text-primary transition-colors group"
                        >
                          <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <Phone size={18} className="text-primary" />
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
                      A propos
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
