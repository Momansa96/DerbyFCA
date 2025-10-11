import { useState } from 'react';
import { Goal, Derby } from '../utils/types';

export const useGoalEditor = () => {
    const [goals, setGoals] = useState<{ [key: string]: Goal[] }>({});
    const [editingGoals, setEditingGoals] = useState<string | null>(null);

    const initializeGoals = (matchId: string, initialGoals: Goal[]) => {
        setGoals(prev => ({
            ...prev,
            [matchId]: initialGoals || []
        }));
    };

    const handleAddGoal = (matchId: string, teamId: string, playerId: string, isOwnGoal: boolean, derby: Derby) => {
        const player = [...derby.team1.players, ...derby.team2.players].find(p => p.id === playerId);
        if (!player) {
            console.error('Joueur non trouvé');
            return;
        }

        setGoals(prev => ({
            ...prev,
            [matchId]: [...(prev[matchId] || []), {
                id: crypto.randomUUID(),
                playerId,
                teamId,
                isOwnGoal,
                player: {
                    id: player.id,
                    fullName: player.fullName,
                    profilePhoto: player.profilePhoto
                }
            }]
        }));
    };

    const handleRemoveGoal = (matchId: string, goalId: string) => {
        setGoals(prev => ({
            ...prev,
            [matchId]: prev[matchId].filter(goal => goal.id !== goalId)
        }));
    };

    const toggleEditingGoals = (matchId: string | null) => {
        setEditingGoals(matchId);
    };

    return {
        goals,
        editingGoals,
        initializeGoals,
        handleAddGoal,
        handleRemoveGoal,
        toggleEditingGoals
    };
};