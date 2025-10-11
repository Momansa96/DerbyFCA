import { Derby, Match } from './types';

export const getMatchStatus = (match: Match, derby: Derby): string => {
    if (match.status === 'PENDING') return 'En attente';
    if (match.status === 'IN_PROGRESS') return 'En cours';
    if (match.status === 'COMPLETED') {
        const aiglesId = derby.team1.name === 'Aigles' ? derby.team1.id : derby.team2.id;
        const lionsId = derby.team1.name === 'Lions' ? derby.team1.id : derby.team2.id;

        if (match.winnerId === aiglesId) return 'Victoire Aigles';
        if (match.winnerId === lionsId) return 'Victoire Lions';
        return 'Match nul';
    }
    return 'Statut inconnu';
};

export const getAiglesId = (derby: Derby): string => {
    return derby.team1.name === 'Aigles' ? derby.team1.id : derby.team2.id;
};

export const getLionsId = (derby: Derby): string => {
    return derby.team1.name === 'Lions' ? derby.team1.id : derby.team2.id;
};

export const getTeamScore = (match: Match, derby: Derby, teamName: 'Aigles' | 'Lions'): number | null => {
    const teamId = teamName === 'Aigles' ? getAiglesId(derby) : getLionsId(derby);
    return match.team1Id === teamId ? match.score1 : match.score2;
};

export const getWinnerName = (derby: Derby): string => {
    if (!derby.winnerId) return '';
    const aiglesId = getAiglesId(derby);
    return derby.winnerId === aiglesId ? 'Aigles' : 'Lions';
};

export const filterDerbysByDate = (derbys: Derby[], dateFilter: string): Derby[] => {
    if (dateFilter === "ALL") return derbys;

    const now = new Date();
    const monthsAgo = dateFilter === "1M" ? 1 : dateFilter === "3M" ? 3 : 6;
    const cutoffDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, now.getDate());

    return derbys.filter((derby) => new Date(derby.createdAt) >= cutoffDate);
};

export const filterDerbysByStatus = (derbys: Derby[], statusFilter: string): Derby[] => {
    if (statusFilter === "ALL") return derbys;
    return derbys.filter((derby) => derby.status === statusFilter);
};