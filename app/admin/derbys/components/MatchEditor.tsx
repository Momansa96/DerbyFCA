import { Target, Check, EyeOff, Eye } from 'lucide-react';
import { Match, Derby, Goal } from '../utils/types';
import { GoalManager } from './GoalManager';

interface MatchEditorProps {
    match: Match;
    derby: Derby;
    scores: { team1: number; team2: number };
    goals: Goal[];
    editingGoals: boolean;
    onScoreChange: (matchId: string, team: 'team1' | 'team2', value: string) => void;
    onToggleEditingGoals: () => void;
    onAddGoal: (matchId: string, teamId: string, playerId: string, isOwnGoal: boolean, derby: Derby) => void;
    onRemoveGoal: (matchId: string, goalId: string) => void;
    onSubmit: () => void;
}

export const MatchEditor = ({
    match,
    derby,
    scores,
    goals,
    editingGoals,
    onScoreChange,
    onToggleEditingGoals,
    onAddGoal,
    onRemoveGoal,
    onSubmit
}: MatchEditorProps) => {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                    <div className="text-xs font-semibold text-cyan-400 mb-2">Aigles</div>
                    <input
                        type="number"
                        min="0"
                        value={scores.team1}
                        onChange={(e) => onScoreChange(match.id, 'team1', e.target.value)}
                        className="w-full text-center bg-gray-700/50 border border-cyan-500/30 text-white text-2xl font-bold rounded-lg p-2 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    />
                </div>
                <div className="text-gray-600 text-lg font-bold">VS</div>
                <div className="flex-1">
                    <div className="text-xs font-semibold text-pink-400 mb-2">Lions</div>
                    <input
                        type="number"
                        min="0"
                        value={scores.team2}
                        onChange={(e) => onScoreChange(match.id, 'team2', e.target.value)}
                        className="w-full text-center bg-gray-700/50 border border-pink-500/30 text-white text-2xl font-bold rounded-lg p-2 focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500 transition-all"
                    />
                </div>
            </div>

            <div className="mt-4">
                <button
                    onClick={onToggleEditingGoals}
                    className="w-full flex items-center justify-center gap-2 bg-gray-700/50 border border-gray-600/50 text-gray-300 px-4 py-3 rounded-lg hover:bg-gray-700 hover:border-gray-600 transition-all"
                >
                    {editingGoals ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {editingGoals ? 'Masquer les buteurs' : 'Gérer les buteurs'}
                </button>

                {editingGoals && (
                    <GoalManager
                        match={match}
                        derby={derby}
                        goals={goals}
                        onAddGoal={onAddGoal}
                        onRemoveGoal={onRemoveGoal}
                    />
                )}
            </div>

            <button
                onClick={onSubmit}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg font-semibold transition-all hover:scale-[1.02]"
            >
                <Check className="w-5 h-5" />
                Valider
            </button>
        </div>
    );
};