import { useState } from 'react';
import { Trophy, Calendar, Award } from 'lucide-react';
import { Derby, Goal, YellowCard, RedCard } from '../utils/types';
import { getWinnerName } from '../utils/derbyHelpers';
import { TeamPanel } from './TeamPanel';
import { MatchCard } from './MatchCard';
import { DerbyRecap } from './DerbyRecap';
import { TeamManagementModal } from './TeamManagementModal';

interface DerbyCardProps {
    derby: Derby;
    editingMatch: string | null;
    scores: { [key: string]: { team1: number; team2: number } };
    goals: { [key: string]: Goal[] };
    yellowCards: { [key: string]: YellowCard[] };
    redCards: { [key: string]: RedCard[] };
    editingGoals: string | null;
    editingCards: string | null;
    onEditMatch: (match: any) => void;
    onScoreChange: (matchId: string, team: 'team1' | 'team2', value: string) => void;
    onToggleEditingGoals: (matchId: string | null) => void;
    onToggleEditingCards: (matchId: string | null) => void;
    onAddGoal: (matchId: string, teamId: string, playerId: string, isOwnGoal: boolean, derby: Derby, assistPlayerId?: string) => void;
    onRemoveGoal: (matchId: string, goalId: string) => void;
    onAddYellowCard: (matchId: string, playerId: string, derby: Derby) => void;
    onAddRedCard: (matchId: string, playerId: string, derby: Derby) => void;
    onRemoveYellowCard: (matchId: string, cardId: string) => void;
    onRemoveRedCard: (matchId: string, cardId: string) => void;
    onSubmitScore: (matchId: string) => void;
    onTeamUpdate?: () => void;
}

export const DerbyCard = ({
    derby,
    editingMatch,
    scores,
    goals,
    yellowCards,
    redCards,
    editingGoals,
    editingCards,
    onEditMatch,
    onScoreChange,
    onToggleEditingGoals,
    onToggleEditingCards,
    onAddGoal,
    onRemoveGoal,
    onAddYellowCard,
    onAddRedCard,
    onRemoveYellowCard,
    onRemoveRedCard,
    onSubmitScore,
    onTeamUpdate
}: DerbyCardProps) => {
    const allMatchesCompleted = derby.matches.every(match => match.status === 'COMPLETED');
    const [managingTeam, setManagingTeam] = useState<'team1' | 'team2' | null>(null);

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
                <TeamPanel
                    team={derby.team1}
                    colorScheme="blue"
                    onManage={() => setManagingTeam('team1')}
                />
                <TeamPanel
                    team={derby.team2}
                    colorScheme="pink"
                    onManage={() => setManagingTeam('team2')}
                />
            </div>

            {/* Modal de gestion d'équipe */}
            {managingTeam && (
                <TeamManagementModal
                    team={managingTeam === 'team1' ? derby.team1 : derby.team2}
                    unavailablePlayers={managingTeam === 'team1'
                        ? derby.team2.players.map(p => p.id)
                        : derby.team1.players.map(p => p.id)
                    }
                    onClose={() => setManagingTeam(null)}
                    onUpdate={() => {
                        setManagingTeam(null);
                        onTeamUpdate?.();
                    }}
                />
            )}

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
                            yellowCards={yellowCards[match.id] || []}
                            redCards={redCards[match.id] || []}
                            editingGoals={editingGoals === match.id}
                            editingCards={editingCards === match.id}
                            onEdit={() => onEditMatch(match)}
                            onScoreChange={onScoreChange}
                            onToggleEditingGoals={() => onToggleEditingGoals(editingGoals === match.id ? null : match.id)}
                            onToggleEditingCards={() => onToggleEditingCards(editingCards === match.id ? null : match.id)}
                            onAddGoal={onAddGoal}
                            onRemoveGoal={onRemoveGoal}
                            onAddYellowCard={onAddYellowCard}
                            onAddRedCard={onAddRedCard}
                            onRemoveYellowCard={onRemoveYellowCard}
                            onRemoveRedCard={onRemoveRedCard}
                            onSubmit={() => onSubmitScore(match.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};