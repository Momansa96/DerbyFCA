import { useState } from 'react';
import { Match, Goal } from '../utils/types';

export const useMatchEditor = (onSuccess: () => void) => {
    const [editingMatch, setEditingMatch] = useState<string | null>(null);
    const [scores, setScores] = useState<{ [key: string]: { team1: number; team2: number } }>({});
    const [error, setError] = useState<string | null>(null);

    const handleScoreChange = (matchId: string, team: 'team1' | 'team2', value: string) => {
        const numValue = parseInt(value) || 0;
        setScores(prev => ({
            ...prev,
            [matchId]: {
                ...prev[matchId],
                [team]: numValue
            }
        }));
    };

    const startEditing = (match: Match) => {
        setEditingMatch(match.id);
        setScores(prev => ({
            ...prev,
            [match.id]: {
                team1: match.score1 || 0,
                team2: match.score2 || 0
            }
        }));
    };

    const cancelEditing = () => {
        setEditingMatch(null);
    };

    const handleScoreSubmit = async (matchId: string, matchGoals: Goal[]) => {
        try {
            const matchScores = scores[matchId];
            if (!matchScores) return;

            const response = await fetch(`/api/matches/${matchId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    scoreTeam1: matchScores.team1,
                    scoreTeam2: matchScores.team2,
                    goals: matchGoals
                }),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour du score');
            }

            setEditingMatch(null);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    return {
        editingMatch,
        scores,
        error,
        handleScoreChange,
        startEditing,
        cancelEditing,
        handleScoreSubmit
    };
};