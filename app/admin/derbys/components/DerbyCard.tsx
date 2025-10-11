import { Trophy, Calendar, Award } from 'lucide-react';
import { Derby, Goal } from '../utils/types';
import { getWinnerName } from '../utils/derbyHelpers';
import { TeamPanel } from './TeamPanel';
import { MatchCard } from './MatchCard';
import { DerbyRecap } from './DerbyRecap';

interface DerbyCardProps {
    derby: Derby;
    editingMatch: string | null;
    scores: { [key: string]: { team1: number; team2: number } };
    goals: { [key: string]: Goal[] };
    editingGoals: string | null;
    onEditMatch: (match: any) => void;
    onScoreChange: (matchId: string, team: 'team1' | 'team2', value: string) => void;
    onToggleEditingGoals: (matchId: string | null) => void;
    onAddGoal: (matchId: string, teamId: string, playerId: string, isOwnGoal: boolean, derby: Derby) => void;
    onRemoveGoal: (matchId: string, goalId: string) => void;
    onSubmitScore: (matchId: string) => void;
}

export const DerbyCard = ({
    derby,
    editingMatch,
    scores,
    goals,
    editingGoals,
    onEditMatch,
    onScoreChange,
    onToggleEditingGoals,
    onAddGoal,
    onRemoveGoal,
    onSubmitScore
}: DerbyCardProps) => {
    const allMatchesCompleted = derby.matches.every(match => match.status === 'COMPLETED');

    return (
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4 sm:p-6 backdrop-blur-sm transition-all hover:border-gray-600/50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-xl font-bold text-white">
                            Derby du {new Date(derby.createdAt).toLocaleDateString('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            })}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            derby.status === 'PENDING'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                            {derby.status === 'PENDING' ? 'En attente' : 'Terminé'}
                        </div>
                    </div>
                </div>
                {derby.winnerId && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-yellow-400 font-semibold px-4 py-2 rounded-full">
                        <Award className="w-4 h-4" />
                        Vainqueur: {getWinnerName(derby)}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                <TeamPanel team={derby.team1} colorScheme="blue" />
                <TeamPanel team={derby.team2} colorScheme="pink" />
            </div>

            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Matches</h3>

                {allMatchesCompleted && <DerbyRecap derby={derby} />}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {derby.matches.map((match) => (
                        <MatchCard
                            key={match.id}
                            match={match}
                            derby={derby}
                            isEditing={editingMatch === match.id}
                            scores={scores[match.id]}
                            goals={goals[match.id] || []}
                            editingGoals={editingGoals === match.id}
                            onEdit={() => onEditMatch(match)}
                            onScoreChange={onScoreChange}
                            onToggleEditingGoals={() => onToggleEditingGoals(editingGoals === match.id ? null : match.id)}
                            onAddGoal={onAddGoal}
                            onRemoveGoal={onRemoveGoal}
                            onSubmit={() => onSubmitScore(match.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};