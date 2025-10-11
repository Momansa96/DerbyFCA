import Image from 'next/image';
import { Users } from 'lucide-react';
import { Team } from '../utils/types';

interface TeamPanelProps {
    team: Team;
    colorScheme: 'blue' | 'pink';
}

export const TeamPanel = ({ team, colorScheme }: TeamPanelProps) => {
    const config = colorScheme === 'blue'
        ? {
            gradient: 'from-cyan-500/10 to-blue-500/5',
            border: 'border-cyan-500/30',
            text: 'text-cyan-400',
            itemBg: 'bg-cyan-500/5 hover:bg-cyan-500/10 border-cyan-500/20'
        }
        : {
            gradient: 'from-pink-500/10 to-purple-500/5',
            border: 'border-pink-500/30',
            text: 'text-pink-400',
            itemBg: 'bg-pink-500/5 hover:bg-pink-500/10 border-pink-500/20'
        };

    return (
        <div className={`bg-gradient-to-br ${config.gradient} border ${config.border} rounded-xl p-4 backdrop-blur-sm`}>
            <div className="flex items-center gap-2 mb-4">
                <Users className={`w-5 h-5 ${config.text}`} />
                <h3 className={`text-lg font-bold ${config.text}`}>
                    {team.name}
                </h3>
            </div>
            <ul className="space-y-2">
                {team.players.map((player) => (
                    <li
                        key={player.id}
                        className={`flex items-center space-x-3 ${config.itemBg} border p-3 rounded-lg transition-all group`}
                    >
                        <div className="relative">
                            <Image
                                src={player.profilePhoto || '/images/default.jpeg'}
                                alt={player.fullName}
                                width={36}
                                height={36}
                                className="rounded-full ring-2 ring-gray-700/50 group-hover:ring-gray-600"
                            />
                        </div>
                        <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                            {player.fullName}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};