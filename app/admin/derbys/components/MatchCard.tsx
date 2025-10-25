import { Calendar, Edit2 } from 'lucide-react';
import { Match, Derby, Goal, YellowCard, RedCard } from '../utils/types';
import { getMatchStatus } from '../utils/derbyHelpers';
import { MatchDisplay } from './MatchDisplay';
import { MatchEditor } from './MatchEditor';

interface MatchCardProps {
    match: Match;
    derby: Derby;
    isEditing: boolean;
    scores?: { team1: number; team2: number };
    goals?: Goal[];
    yellowCards?: YellowCard[];
    redCards?: RedCard[];
    editingGoals: boolean;
    editingCards: boolean;
    onEdit: () => void;
    onScoreChange: (matchId: string, team: 'team1' | 'team2', value: string) => void;
    onToggleEditingGoals: () => void;
    onToggleEditingCards: () => void;
    onAddGoal: (matchId: string, teamId: string, playerId: string, isOwnGoal: boolean, derby: Derby, assistPlayerId?: string) => void;
    onRemoveGoal: (matchId: string, goalId: string) => void;
    onAddYellowCard: (matchId: string, playerId: string, derby: Derby) => void;
    onAddRedCard: (matchId: string, playerId: string, derby: Derby) => void;
    onRemoveYellowCard: (matchId: string, cardId: string) => void;
    onRemoveRedCard: (matchId: string, cardId: string) => void;
    onSubmit: () => void;
}

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'PENDING':
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'IN_PROGRESS':
            return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case 'COMPLETED':
            return 'bg-green-500/20 text-green-400 border-green-500/30';
        default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

export const MatchCard = ({
    match,
    derby,
    isEditing,
    scores,
    goals = [],
    yellowCards = [],
    redCards = [],
    editingGoals,
    editingCards,
    onEdit,
    onScoreChange,
    onToggleEditingGoals,
    onToggleEditingCards,
    onAddGoal,
    onRemoveGoal,
    onAddYellowCard,
    onAddRedCard,
    onRemoveYellowCard,
    onRemoveRedCard,
    onSubmit
}: MatchCardProps) => {
    return (
        <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4 hover:border-gray-600/50 transition-all backdrop-blur-sm">
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="font-medium text-gray-300 text-sm">
                        {new Date(match.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusStyle(match.status)}`}>
                    {getMatchStatus(match, derby)}
                </span>
            </div>

            {isEditing && scores ? (
                <MatchEditor
                    match={match}
                    derby={derby}
                    scores={scores}
                    goals={goals}
                    yellowCards={yellowCards}
                    redCards={redCards}
                    editingGoals={editingGoals}
                    editingCards={editingCards}
                    onScoreChange={onScoreChange}
                    onToggleEditingGoals={onToggleEditingGoals}
                    onToggleEditingCards={onToggleEditingCards}
                    onAddGoal={onAddGoal}
                    onRemoveGoal={onRemoveGoal}
                    onAddYellowCard={onAddYellowCard}
                    onAddRedCard={onAddRedCard}
                    onRemoveYellowCard={onRemoveYellowCard}
                    onRemoveRedCard={onRemoveRedCard}
                    onSubmit={onSubmit}
                />
            ) : (
                <div className="space-y-4">
                    <MatchDisplay match={match} derby={derby} />
                    {match.status !== 'COMPLETED' && (
                        <button
                            onClick={onEdit}
                            className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-lg font-semibold transition-all hover:scale-[1.02]"
                        >
                            <Edit2 className="w-4 h-4" />
                            Modifier
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};