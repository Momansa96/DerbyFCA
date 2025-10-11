import { Target } from 'lucide-react';
import { Match, Derby } from '../utils/types';
import { getTeamScore } from '../utils/derbyHelpers';

interface MatchDisplayProps {
    match: Match;
    derby: Derby;
}

export const MatchDisplay = ({ match, derby }: MatchDisplayProps) => {
    const aiglesScore = getTeamScore(match, derby, 'Aigles');
    const lionsScore = getTeamScore(match, derby, 'Lions');

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                    <div className="text-xs font-semibold text-cyan-400 mb-1">Aigles</div>
                    <div className="text-3xl font-black text-white">{aiglesScore ?? '-'}</div>
                </div>
                <div className="text-gray-600 text-xl font-bold px-4">VS</div>
                <div className="text-center flex-1">
                    <div className="text-xs font-semibold text-pink-400 mb-1">Lions</div>
                    <div className="text-3xl font-black text-white">{lionsScore ?? '-'}</div>
                </div>
            </div>

            {match.goals && match.goals.length > 0 && (
                <div className="mt-4 space-y-3 pt-4 border-t border-gray-700/50">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <h4 className="font-semibold text-sm text-gray-300">Buteurs</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                            {match.goals
                                .filter(goal => goal.teamId === match.team1Id)
                                .map(goal => (
                                    <div key={goal.id} className="text-sm flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded px-2 py-1">
                                        <span className="text-cyan-400 font-medium">⚽</span>
                                        <span className="text-gray-300">{goal.player?.fullName}</span>
                                        {goal.isOwnGoal && <span className="text-red-400 text-xs">(CSC)</span>}
                                    </div>
                                ))}
                        </div>
                        <div className="space-y-1">
                            {match.goals
                                .filter(goal => goal.teamId === match.team2Id)
                                .map(goal => (
                                    <div key={goal.id} className="text-sm flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded px-2 py-1">
                                        <span className="text-pink-400 font-medium">⚽</span>
                                        <span className="text-gray-300">{goal.player?.fullName}</span>
                                        {goal.isOwnGoal && <span className="text-red-400 text-xs">(CSC)</span>}
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};