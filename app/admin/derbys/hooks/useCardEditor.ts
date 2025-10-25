import { useState } from 'react';
import { YellowCard, RedCard, Derby } from '../utils/types';

export const useCardEditor = () => {
    const [yellowCards, setYellowCards] = useState<{ [key: string]: YellowCard[] }>({});
    const [redCards, setRedCards] = useState<{ [key: string]: RedCard[] }>({});

    const initializeCards = (matchId: string, initialYellowCards: YellowCard[], initialRedCards: RedCard[]) => {
        setYellowCards(prev => ({
            ...prev,
            [matchId]: initialYellowCards || []
        }));
        setRedCards(prev => ({
            ...prev,
            [matchId]: initialRedCards || []
        }));
    };

    const handleAddYellowCard = (matchId: string, playerId: string, derby: Derby) => {
        const player = [...derby.team1.players, ...derby.team2.players].find(p => p.id === playerId);
        if (!player) {
            console.error('Joueur non trouvé');
            return;
        }

        setYellowCards(prev => ({
            ...prev,
            [matchId]: [...(prev[matchId] || []), {
                id: crypto.randomUUID(),
                matchId,
                playerId,
                player: {
                    id: player.id,
                    fullName: player.fullName,
                    profilePhoto: player.profilePhoto
                }
            }]
        }));
    };

    const handleAddRedCard = (matchId: string, playerId: string, derby: Derby) => {
        const player = [...derby.team1.players, ...derby.team2.players].find(p => p.id === playerId);
        if (!player) {
            console.error('Joueur non trouvé');
            return;
        }

        setRedCards(prev => ({
            ...prev,
            [matchId]: [...(prev[matchId] || []), {
                id: crypto.randomUUID(),
                matchId,
                playerId,
                player: {
                    id: player.id,
                    fullName: player.fullName,
                    profilePhoto: player.profilePhoto
                }
            }]
        }));
    };

    const handleRemoveYellowCard = (matchId: string, cardId: string) => {
        setYellowCards(prev => ({
            ...prev,
            [matchId]: prev[matchId].filter(card => card.id !== cardId)
        }));
    };

    const handleRemoveRedCard = (matchId: string, cardId: string) => {
        setRedCards(prev => ({
            ...prev,
            [matchId]: prev[matchId].filter(card => card.id !== cardId)
        }));
    };

    return {
        yellowCards,
        redCards,
        initializeCards,
        handleAddYellowCard,
        handleAddRedCard,
        handleRemoveYellowCard,
        handleRemoveRedCard
    };
};