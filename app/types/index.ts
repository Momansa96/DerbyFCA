export interface User {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
}

export interface Player {
  id: string;
  full_name: string;
  position: string | null;
  goals: number;
  matches_played: number;
}

export interface Draw {
  id: string;
  date: string;
  created_by: string;
  teams: DrawTeam[];
}

export interface DrawTeam {
  id: string;
  draw_id: string;
  team_number: number;
  players: Player[];
}

export interface Match {
  id: string;
  date: string;
  type: 'derby' | 'friendly' | 'exhibition';
  location: string | null;
  comments: MatchComment[];
}

export interface MatchComment {
  id: string;
  match_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: User;
}