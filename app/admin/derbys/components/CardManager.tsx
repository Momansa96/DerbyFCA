import { X, Plus, AlertTriangle, Square } from 'lucide-react';
import { YellowCard, RedCard, Derby, Match } from '../utils/types';

interface CardManagerProps {
    match: Match;
    derby: Derby;
    yellowCards: YellowCard[];
    redCards: RedCard[];
    onAddYellowCard: (matchId: string, playerId: string) => void;
    onAddRedCard: (matchId: string, playerId: string) => void;
    onRemoveYellowCard: (matchId: string, cardId: string) => void;
    onRemoveRedCard: (matchId: string, cardId: string) => void;
}

export const CardManager = ({
    match,
    derby,
    yellowCards,
    redCards,
    onAddYellowCard,
    onAddRedCard,
    onRemoveYellowCard,
    onRemoveRedCard
}: CardManagerProps) => {
    const allPlayers = [...derby.team1.players, ...derby.team2.players];

    return (
        <div className="mt-4 space-y-4 p-4 bg-gray-800/30 border border-gray-700/50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cartons Jaunes */}
                <div className="space-y-3">
                    <h4 className="font-bold text-yellow-400 text-sm flex items-center gap-2">
                        <Square className="w-4 h-4 fill-yellow-400" />
                        Cartons Jaunes
                    </h4>

                    <select
                        className="w-full bg-gray-700/50 border border-yellow-500/30 text-white rounded-lg p-2 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-all"
                        onChange={(e) => {
                            if (e.target.value) {
                                onAddYellowCard(match.id, e.target.value);
                                e.target.value = '';
                            }
                        }}
                    >
                        <option value="">Ajouter un carton jaune...</option>
                        <optgroup label="Aigles">
                            {derby.team1.players.map(player => (
                                <option key={player.id} value={player.id}>
                                    {player.fullName}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Lions">
                            {derby.team2.players.map(player => (
                                <option key={player.id} value={player.id}>
                                    {player.fullName}
                                </option>
                            ))}
                        </optgroup>
                    </select>

                    <div className="space-y-2">
                        {yellowCards.length === 0 ? (
                            <div className="text-xs text-gray-500 italic text-center py-2">
                                Aucun carton jaune
                            </div>
                        ) : (
                            yellowCards.map(card => (
                                <div
                                    key={card.id}
                                    className="flex justify-between items-center bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg group"
                                >
                                    <span className="text-sm text-gray-300">
                                        <Square className="w-3 h-3 inline mr-1 fill-yellow-400 text-yellow-400" />
                                        {card.player?.fullName || 'Joueur inconnu'}
                                    </span>
                                    <button
                                        onClick={() => onRemoveYellowCard(match.id, card.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Cartons Rouges */}
                <div className="space-y-3">
                    <h4 className="font-bold text-red-400 text-sm flex items-center gap-2">
                        <Square className="w-4 h-4 fill-red-400" />
                        Cartons Rouges
                    </h4>

                    <select
                        className="w-full bg-gray-700/50 border border-red-500/30 text-white rounded-lg p-2 focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all"
                        onChange={(e) => {
                            if (e.target.value) {
                                onAddRedCard(match.id, e.target.value);
                                e.target.value = '';
                            }
                        }}
                    >
                        <option value="">Ajouter un carton rouge...</option>
                        <optgroup label="Aigles">
                            {derby.team1.players.map(player => (
                                <option key={player.id} value={player.id}>
                                    {player.fullName}
                                </option>
                            ))}
                        </optgroup>
                        <optgroup label="Lions">
                            {derby.team2.players.map(player => (
                                <option key={player.id} value={player.id}>
                                    {player.fullName}
                                </option>
                            ))}
                        </optgroup>
                    </select>

                    <div className="space-y-2">
                        {redCards.length === 0 ? (
                            <div className="text-xs text-gray-500 italic text-center py-2">
                                Aucun carton rouge
                            </div>
                        ) : (
                            redCards.map(card => (
                                <div
                                    key={card.id}
                                    className="flex justify-between items-center bg-red-500/10 border border-red-500/20 p-2 rounded-lg group"
                                >
                                    <span className="text-sm text-gray-300">
                                        <Square className="w-3 h-3 inline mr-1 fill-red-400 text-red-400" />
                                        {card.player?.fullName || 'Joueur inconnu'}
                                    </span>
                                    <button
                                        onClick={() => onRemoveRedCard(match.id, card.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};