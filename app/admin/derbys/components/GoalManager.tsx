import { X, Plus, UserPlus } from 'lucide-react';
import { Goal, Derby, Match } from '../utils/types';
import { useState } from 'react';

interface GoalManagerProps {
    match: Match;
    derby: Derby;
    goals: Goal[];
    onAddGoal: (matchId: string, teamId: string, playerId: string, isOwnGoal: boolean, derby: Derby, assistPlayerId?: string) => void;
    onRemoveGoal: (matchId: string, goalId: string) => void;
}

export const GoalManager = ({ match, derby, goals, onAddGoal, onRemoveGoal }: GoalManagerProps) => {
    const [pendingGoalTeam1, setPendingGoalTeam1] = useState<{ playerId: string; isOwnGoal: boolean } | null>(null);
    const [pendingGoalTeam2, setPendingGoalTeam2] = useState<{ playerId: string; isOwnGoal: boolean } | null>(null);

    const handleScorerSelect = (teamId: string, value: string, isPendingTeam1: boolean) => {
        if (!value) return;

        const parts = value.split('-');
        const isOwnGoal = parts.pop() === 'true';
        const playerId = parts.join('-');

        if (isPendingTeam1) {
            setPendingGoalTeam1({ playerId, isOwnGoal });
        } else {
            setPendingGoalTeam2({ playerId, isOwnGoal });
        }
    };

    const handleAssistSelect = (teamId: string, assistPlayerId: string, isPendingTeam1: boolean) => {
        const pending = isPendingTeam1 ? pendingGoalTeam1 : pendingGoalTeam2;
        if (!pending) return;

        onAddGoal(match.id, teamId, pending.playerId, pending.isOwnGoal, derby, assistPlayerId || undefined);

        if (isPendingTeam1) {
            setPendingGoalTeam1(null);
        } else {
            setPendingGoalTeam2(null);
        }
    };

    const cancelPending = (isPendingTeam1: boolean) => {
        if (isPendingTeam1) {
            setPendingGoalTeam1(null);
        } else {
            setPendingGoalTeam2(null);
        }
    };

    return (
        <div className="mt-4 space-y-4 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Équipe Aigles */}
                <div className="space-y-3">
                    <h4 className="font-bold text-cyan-400 text-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Buteurs Aigles
                    </h4>

                    {!pendingGoalTeam1 ? (
                        <select
                            className="w-full bg-gray-700/50 border border-cyan-500/30 text-white rounded-lg p-2 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                            onChange={(e) => {
                                handleScorerSelect(match.team1Id, e.target.value, true);
                                e.target.value = '';
                            }}
                        >
                            <option value="">Ajouter un buteur...</option>
                            <optgroup label="Aigles">
                                {derby.team1.players.map(player => (
                                    <option key={player.id} value={`${player.id}-false`}>
                                        {player.fullName}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Lions (CSC)">
                                {derby.team2.players.map(player => (
                                    <option key={player.id} value={`${player.id}-true`}>
                                        {player.fullName} (CSC)
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    ) : (
                        <div className="space-y-2 bg-cyan-500/5 border border-cyan-500/30 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white font-semibold">
                                    ⚽ Buteur sélectionné
                                </span>
                                <button
                                    onClick={() => cancelPending(true)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-xs text-gray-400 mb-2">Passeur (optionnel) :</div>
                            <select
                                className="w-full bg-gray-700/50 border border-cyan-500/30 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-cyan-500/50"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        handleAssistSelect(match.team1Id, e.target.value, true);
                                    }
                                    e.target.value = '';
                                }}
                            >
                                <option value="">Sélectionner un passeur...</option>
                                {derby.team1.players
                                    .filter(p => p.id !== pendingGoalTeam1.playerId)
                                    .map(player => (
                                        <option key={player.id} value={player.id}>
                                            {player.fullName}
                                        </option>
                                    ))}
                                {derby.team2.players.map(player => (
                                    <option key={player.id} value={player.id}>
                                        {player.fullName}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => handleAssistSelect(match.team1Id, '', true)}
                                className="w-full mt-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-400 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                            >
                                Valider sans passeur
                            </button>
                        </div>
                    )}

                    <div className="space-y-2">
                        {goals
                            .filter(goal => goal.teamId === match.team1Id)
                            .map(goal => (
                                <div key={goal.id} className="flex flex-col bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-lg group">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-300 flex-1">
                                            <span className="text-cyan-400 mr-1">⚽</span>
                                            {goal.player?.fullName || 'Joueur inconnu'}
                                            {goal.isOwnGoal && <span className="text-red-400 ml-1 text-xs">(CSC)</span>}
                                        </span>
                                        <button
                                            onClick={() => onRemoveGoal(match.id, goal.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {goal.assistPlayer && (
                                        <div className="text-xs text-gray-400 mt-1 ml-5">
                                            <UserPlus className="w-3 h-3 inline mr-1" />
                                            Passe: {goal.assistPlayer.fullName}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>

                {/* Équipe Lions */}
                <div className="space-y-3">
                    <h4 className="font-bold text-pink-400 text-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Buteurs Lions
                    </h4>

                    {!pendingGoalTeam2 ? (
                        <select
                            className="w-full bg-gray-700/50 border border-pink-500/30 text-white rounded-lg p-2 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
                            onChange={(e) => {
                                handleScorerSelect(match.team2Id, e.target.value, false);
                                e.target.value = '';
                            }}
                        >
                            <option value="">Ajouter un buteur...</option>
                            <optgroup label="Lions">
                                {derby.team2.players.map(player => (
                                    <option key={player.id} value={`${player.id}-false`}>
                                        {player.fullName}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Aigles (CSC)">
                                {derby.team1.players.map(player => (
                                    <option key={player.id} value={`${player.id}-true`}>
                                        {player.fullName} (CSC)
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                    ) : (
                        <div className="space-y-2 bg-pink-500/5 border border-pink-500/30 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-white font-semibold">
                                    ⚽ Buteur sélectionné
                                </span>
                                <button
                                    onClick={() => cancelPending(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-xs text-gray-400 mb-2">Passeur (optionnel) :</div>
                            <select
                                className="w-full bg-gray-700/50 border border-pink-500/30 text-white rounded-lg p-2 text-sm focus:ring-2 focus:ring-pink-500/50"
                                onChange={(e) => {
                                    if (e.target.value) {
                                        handleAssistSelect(match.team2Id, e.target.value, false);
                                    }
                                    e.target.value = '';
                                }}
                            >
                                <option value="">Sélectionner un passeur...</option>
                                {derby.team2.players
                                    .filter(p => p.id !== pendingGoalTeam2.playerId)
                                    .map(player => (
                                        <option key={player.id} value={player.id}>
                                            {player.fullName}
                                        </option>
                                    ))}
                                {derby.team1.players.map(player => (
                                    <option key={player.id} value={player.id}>
                                        {player.fullName}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => handleAssistSelect(match.team2Id, '', false)}
                                className="w-full mt-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-400 px-3 py-2 rounded-lg text-sm font-semibold transition-all"
                            >
                                Valider sans passeur
                            </button>
                        </div>
                    )}

                    <div className="space-y-2">
                        {goals
                            .filter(goal => goal.teamId === match.team2Id)
                            .map(goal => (
                                <div key={goal.id} className="flex flex-col bg-pink-500/10 border border-pink-500/20 p-2 rounded-lg group">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-300 flex-1">
                                            <span className="text-pink-400 mr-1">⚽</span>
                                            {goal.player?.fullName || 'Joueur inconnu'}
                                            {goal.isOwnGoal && <span className="text-red-400 ml-1 text-xs">(CSC)</span>}
                                        </span>
                                        <button
                                            onClick={() => onRemoveGoal(match.id, goal.id)}
                                            className="text-red-400 hover:text-red-300 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {goal.assistPlayer && (
                                        <div className="text-xs text-gray-400 mt-1 ml-5">
                                            <UserPlus className="w-3 h-3 inline mr-1" />
                                            Passe: {goal.assistPlayer.fullName}
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};