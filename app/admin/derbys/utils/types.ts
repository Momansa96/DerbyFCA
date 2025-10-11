export interface Player {
    id: string;
    fullName: string;
    profilePhoto: string | null;
}

export interface Team {
    id: string;
    name: string;
    players: Player[];
}

export interface Goal {
    id: string;
    playerId: string;
    teamId: string;
    isOwnGoal: boolean;
    player: Player;
}

export interface Match {
    id: string;
    date: string;
    status: string;
    score1: number | null;
    score2: number | null;
    team1Id: string;
    team2Id: string;
    winnerId: string | null;
    goals: Goal[];
}

export interface Derby {
    id: string;
    createdAt: string;
    status: string;
    team1: Team;
    team2: Team;
    matches: Match[];
    winnerId: string | null;
}

export type StatusFilter = "ALL" | "PENDING" | "COMPLETED";
export type DateFilter = "ALL" | "1M" | "3M" | "6M";