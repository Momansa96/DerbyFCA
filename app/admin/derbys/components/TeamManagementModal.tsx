'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle, Check } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Player {
    id: string;
    fullName: string;
    profilePhoto: string | null;
    alias?: string;
}

interface Team {
    id: string;
    name: string;
    players: Player[];
}

interface TeamManagementModalProps {
    team: Team;
    onClose: () => void;
    onUpdate: () => void;
    unavailablePlayers: string[]; // IDs des joueurs de l'équipe adverse
}

export const TeamManagementModal = ({ team, onClose, onUpdate, unavailablePlayers }: TeamManagementModalProps) => {
    const [allPlayers, setAllPlayers] = useState<Player[]>([]);
    const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
    const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchAllPlayers();
    }, []);

    const fetchAllPlayers = async () => {
        try {
            const response = await fetch('/api/players');
            if (!response.ok) throw new Error('Erreur lors du chargement des joueurs');
            const data = await response.json();
            setAllPlayers(data.filter((p: Player) => p.id)); // Filtrer les joueurs valides
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors du chargement des joueurs');
        } finally {
            setLoading(false);
        }
    };

    const currentPlayerIds = team.players.map(p => p.id);
    const availableToAdd = allPlayers.filter(
        p => !currentPlayerIds.includes(p.id) && !unavailablePlayers.includes(p.id)
    );

    const toggleAddPlayer = (playerId: string) => {
        setSelectedToAdd(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
    };

    const toggleRemovePlayer = (playerId: string) => {
        setSelectedToRemove(prev =>
            prev.includes(playerId)
                ? prev.filter(id => id !== playerId)
                : [...prev, playerId]
        );
    };

    const handleSave = async () => {
        if (selectedToAdd.length === 0 && selectedToRemove.length === 0) {
            toast.error('Aucune modification à enregistrer');
            return;
        }

        // Vérifier le minimum de joueurs
        const newPlayerCount = team.players.length + selectedToAdd.length - selectedToRemove.length;
        if (newPlayerCount < 5) {
            toast.error('Une équipe doit avoir au moins 5 joueurs');
            return;
        }

        setSaving(true);
        try {
            const response = await fetch(`/api/teams/${team.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    playersToAdd: selectedToAdd.length > 0 ? selectedToAdd : undefined,
                    playersToRemove: selectedToRemove.length > 0 ? selectedToRemove : undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la mise à jour');
            }

            toast.success('Équipe mise à jour avec succès');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erreur:', error);
            toast.error(error instanceof Error ? error.message : 'Erreur lors de la mise à jour');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#0A0E27] border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">Gérer l&apos;équipe {team.name}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 text-gray-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-400"></div>
                        </div>
                    ) : (
                        <>
                            {/* Info */}
                            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-300">
                                        <p className="font-semibold mb-1">Important :</p>
                                        <ul className="space-y-1 text-blue-300/80">
                                            <li>• Une équipe doit avoir au moins 5 joueurs</li>
                                            <li>• Les joueurs ayant déjà joué ne peuvent pas être retirés</li>
                                            <li>• Les joueurs de l&apos;équipe adverse ne sont pas disponibles</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Joueurs actuels */}
                            <div>
                                <h3 className="text-lg font-bold text-white mb-4">
                                    Joueurs actuels ({team.players.length})
                                </h3>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {team.players.map((player) => {
                                        const isSelected = selectedToRemove.includes(player.id);
                                        return (
                                            <div
                                                key={player.id}
                                                className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                                                    isSelected
                                                        ? 'bg-red-500/10 border-red-500/30'
                                                        : 'bg-gray-800/30 border-gray-700/30'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={player.profilePhoto || '/images/avatar-default.png'}
                                                        alt={player.fullName}
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                    />
                                                    <div>
                                                        <div className="font-semibold text-white text-sm">
                                                            {player.fullName}
                                                        </div>
                                                        {player.alias && (
                                                            <div className="text-xs text-gray-400">
                                                                &quot;{player.alias}&quot;
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => toggleRemovePlayer(player.id)}
                                                    className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                                                        isSelected
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-gray-700/50 text-gray-400 hover:bg-red-500/20 hover:text-red-400'
                                                    }`}
                                                >
                                                    {isSelected ? (
                                                        <span className="flex items-center gap-1">
                                                            <Trash2 className="w-4 h-4" />
                                                            Retirer
                                                        </span>
                                                    ) : (
                                                        'Retirer'
                                                    )}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Joueurs disponibles */}
                            {availableToAdd.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4">
                                        Joueurs disponibles ({availableToAdd.length})
                                    </h3>
                                    <div className="space-y-2 max-h-60 overflow-y-auto">
                                        {availableToAdd.map((player) => {
                                            const isSelected = selectedToAdd.includes(player.id);
                                            return (
                                                <div
                                                    key={player.id}
                                                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                                                        isSelected
                                                            ? 'bg-green-500/10 border-green-500/30'
                                                            : 'bg-gray-800/30 border-gray-700/30'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <Image
                                                            src={player.profilePhoto || '/images/avatar-default.png'}
                                                            alt={player.fullName}
                                                            width={40}
                                                            height={40}
                                                            className="rounded-full"
                                                        />
                                                        <div>
                                                            <div className="font-semibold text-white text-sm">
                                                                {player.fullName}
                                                            </div>
                                                            {player.alias && (
                                                                <div className="text-xs text-gray-400">
                                                                    &quot;{player.alias}&quot;
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleAddPlayer(player.id)}
                                                        className={`px-3 py-2 rounded-lg font-semibold text-xs transition-all ${
                                                            isSelected
                                                                ? 'bg-green-500 text-white'
                                                                : 'bg-gray-700/50 text-gray-400 hover:bg-green-500/20 hover:text-green-400'
                                                        }`}
                                                    >
                                                        {isSelected ? (
                                                            <span className="flex items-center gap-1">
                                                                <Check className="w-4 h-4" />
                                                                Ajouté
                                                            </span>
                                                        ) : (
                                                            <span className="flex items-center gap-1">
                                                                <Plus className="w-4 h-4" />
                                                                Ajouter
                                                            </span>
                                                        )}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Résumé des changements */}
                            {(selectedToAdd.length > 0 || selectedToRemove.length > 0) && (
                                <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
                                    <h4 className="font-semibold text-white mb-2">Résumé des modifications :</h4>
                                    <div className="space-y-1 text-sm">
                                        {selectedToAdd.length > 0 && (
                                            <p className="text-green-400">
                                                ✓ {selectedToAdd.length} joueur(s) à ajouter
                                            </p>
                                        )}
                                        {selectedToRemove.length > 0 && (
                                            <p className="text-red-400">
                                                ✗ {selectedToRemove.length} joueur(s) à retirer
                                            </p>
                                        )}
                                        <p className="text-gray-400 pt-2">
                                            Effectif après modification :{' '}
                                            <span className="font-bold text-white">
                                                {team.players.length + selectedToAdd.length - selectedToRemove.length} joueurs
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || (selectedToAdd.length === 0 && selectedToRemove.length === 0)}
                        className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {saving ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                                Enregistrement...
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                Enregistrer
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};