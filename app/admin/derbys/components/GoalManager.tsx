import { X, Plus } from 'lucide-react';
import { Goal, Derby, Match } from '../utils/types';

interface GoalManagerProps {
    match: Match;
    derby: Derby;
    goals: Goal[];
    onAddGoal: (matchId: string, teamId: string, playerId: string, isOwnGoal: boolean, derby: Derby) => void;
    onRemoveGoal: (matchId: string, goalId: string) => void;
}

export const GoalManager = ({ match, derby, goals, onAddGoal, onRemoveGoal }: GoalManagerProps) => {
    return (
        <div className="mt-4 space-y-4 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <h4 className="font-bold text-cyan-400 text-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Buteurs Aigles
                    </h4>
                    <select
                        className="w-full bg-gray-700/50 border border-cyan-500/30 text-white rounded-lg p-2 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                        onChange={(e) => {
                            const parts = e.target.value.split('-');
                            const isOwnGoal = parts.pop() === 'true';
                            const playerId = parts.join('-');
                            if (playerId) {
                                onAddGoal(match.id, match.team1Id, playerId, isOwnGoal, derby);
                                e.target.value = '';
                            }
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
                    <div className="space-y-2">
                        {goals
                            .filter(goal => goal.teamId === match.team1Id)
                            .map(goal => (
                                <div key={goal.id} className="flex justify-between items-center bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-lg group">
                                    <span className="text-sm text-gray-300">
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
                            ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <h4 className="font-bold text-pink-400 text-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Buteurs Lions
                    </h4>
                    <select
                        className="w-full bg-gray-700/50 border border-pink-500/30 text-white rounded-lg p-2 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
                        onChange={(e) => {
                            const parts = e.target.value.split('-');
                            const isOwnGoal = parts.pop() === 'true';
                            const playerId = parts.join('-');
                            if (playerId) {
                                onAddGoal(match.id, match.team2Id, playerId, isOwnGoal, derby);
                                e.target.value = '';
                            }
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
                    <div className="space-y-2">
                        {goals
                            .filter(goal => goal.teamId === match.team2Id)
                            .map(goal => (
                                <div key={goal.id} className="flex justify-between items-center bg-pink-500/10 border border-pink-500/20 p-2 rounded-lg group">
                                    <span className="text-sm text-gray-300">
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
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};