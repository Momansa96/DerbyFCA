import Image from 'next/image';
import { Trophy, Sparkles, Calendar as CalendarIcon } from 'lucide-react';
import { Derby } from '../utils/types';
import { getTeamScore, getWinnerName } from '../utils/derbyHelpers';

interface DerbyRecapProps {
    derby: Derby;
}

export const DerbyRecap = ({ derby }: DerbyRecapProps) => {
    return (
        <div className="mb-6 relative overflow-hidden bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-500/30 rounded-xl p-6 backdrop-blur-sm">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-pink-400/10 to-cyan-500/10 rounded-full blur-3xl -z-10" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                    <h4 className="text-xl sm:text-2xl font-black text-white">Récapitulatif du Derby</h4>
                </div>
                <div className="flex items-center gap-2 text-sm bg-gray-800/50 border border-gray-700/50 px-3 py-1 rounded-full">
                    <CalendarIcon className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-300">
                        {new Date(derby.createdAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-lg p-4 backdrop-blur-sm">
                    <h5 className="text-lg font-bold text-cyan-400 mb-3">Aigles</h5>
                    <div className="space-y-2">
                        {derby.team1.players.map(player => (
                            <div key={player.id} className="flex items-center space-x-2 text-gray-300 text-sm">
                                <Image
                                    src={player.profilePhoto || '/images/default.jpeg'}
                                    alt={player.fullName}
                                    width={28}
                                    height={28}
                                    className="rounded-full ring-2 ring-cyan-500/30"
                                />
                                <span>{player.fullName}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/5 border border-pink-500/20 rounded-lg p-4 backdrop-blur-sm">
                    <h5 className="text-lg font-bold text-pink-400 mb-3">Lions</h5>
                    <div className="space-y-2">
                        {derby.team2.players.map(player => (
                            <div key={player.id} className="flex items-center space-x-2 text-gray-300 text-sm">
                                <Image
                                    src={player.profilePhoto || '/images/default.jpeg'}
                                    alt={player.fullName}
                                    width={28}
                                    height={28}
                                    className="rounded-full ring-2 ring-pink-500/30"
                                />
                                <span>{player.fullName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {derby.matches.map((match, index) => {
                    const aiglesScore = getTeamScore(match, derby, 'Aigles');
                    const lionsScore = getTeamScore(match, derby, 'Lions');

                    return (
                        <div key={match.id} className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-3 hover:border-gray-600/50 transition-all">
                            <div className="text-xs text-gray-400 mb-1 font-semibold">Match {index + 1}</div>
                            <div className="flex justify-center items-center gap-2 my-2">
                                <span className="text-2xl font-black text-cyan-400">{aiglesScore}</span>
                                <span className="text-gray-600">-</span>
                                <span className="text-2xl font-black text-pink-400">{lionsScore}</span>
                            </div>
                            <div className="text-xs text-gray-500 text-center">
                                {new Date(match.date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short'
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {derby.winnerId && (
                <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-6 py-3 rounded-full">
                        <Trophy className="w-5 h-5 text-yellow-400 animate-pulse" />
                        <div className="text-sm text-yellow-400/80 font-semibold">Vainqueur du Derby</div>
                    </div>
                    <div className="text-3xl font-black text-white mt-3 animate-pulse">
                        {getWinnerName(derby)}
                    </div>
                </div>
            )}
        </div>
    );
};