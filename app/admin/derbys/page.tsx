'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Player {
    id: string;
    fullName: string;
    profilePhoto: string | null;
}

interface Team {
    id: string;
    name: string;
    players: Player[];
}

interface Goal {
    id: string;
    playerId: string;
    teamId: string;
    isOwnGoal: boolean;
    player: Player;
}

interface Match {
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

interface Derby {
    id: string;
    createdAt: string;
    status: string;
    team1: Team;
    team2: Team;
    matches: Match[];
    winnerId: string | null;
}

export default function AdminDerbysPage() {
    const [derbys, setDerbys] = useState<Derby[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingMatch, setEditingMatch] = useState<string | null>(null);
    const [scores, setScores] = useState<{ [key: string]: { team1: number; team2: number } }>({});
    const [goals, setGoals] = useState<{ [key: string]: Goal[] }>({});
    const [editingGoals, setEditingGoals] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(1);
    const [total, setTotal] = useState(0);

    // Filtres
    const [statusFilter, setStatusFilter] = useState<string>("ALL"); // ALL, PENDING, COMPLETED
    const [dateFilter, setDateFilter] = useState<string>("ALL"); // ALL, 1M, 3M, 6M


    const fetchDerbys = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/derbys?skip=${(page - 1) * pageSize}&take=${pageSize}`);
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des derbys');
            }
            const data = await response.json();

            // Filtrer côté client (l'API ne supporte pas encore les filtres)
            let filteredDerbys = data.derbys;

            // Filtre par statut
            if (statusFilter !== "ALL") {
                filteredDerbys = filteredDerbys.filter((derby: Derby) => derby.status === statusFilter);
            }

            // Filtre par date
            if (dateFilter !== "ALL") {
                const now = new Date();
                const monthsAgo = dateFilter === "1M" ? 1 : dateFilter === "3M" ? 3 : 6;
                const cutoffDate = new Date(now.setMonth(now.getMonth() - monthsAgo));
                filteredDerbys = filteredDerbys.filter((derby: Derby) =>
                    new Date(derby.createdAt) >= cutoffDate
                );
            }

            setDerbys(filteredDerbys);
            setTotal(data.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchDerbys();
    }, [page, statusFilter, dateFilter]);



    const getMatchStatus = (match: Match, derby: Derby) => {
        if (match.status === 'PENDING') return 'En attente';
        if (match.status === 'IN_PROGRESS') return 'En cours';
        if (match.status === 'COMPLETED') {
            // Identifier Aigles et Lions par leur nom
            const aiglesId = derby.team1.name === 'Aigles' ? derby.team1.id : derby.team2.id;
            const lionsId = derby.team1.name === 'Lions' ? derby.team1.id : derby.team2.id;

            if (match.winnerId === aiglesId) return 'Victoire Aigles';
            if (match.winnerId === lionsId) return 'Victoire Lions';
            return 'Match nul';
        }
        return 'Statut inconnu';
    };

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

    const handleEditMatch = (match: Match) => {
        setEditingMatch(match.id);
        setScores(prev => ({
            ...prev,
            [match.id]: {
                team1: match.score1 || 0,
                team2: match.score2 || 0
            }
        }));
        setGoals(prev => ({
            ...prev,
            [match.id]: match.goals || []
        }));
    };

    const handleAddGoal = (matchId: string, teamId: string, playerId: string, isOwnGoal: boolean = false) => {

        const derby = derbys.find(d => d.matches.some(m => m.id === matchId));
        if (!derby) {
            <div>Derby non trouvé</div>
            return;
        }

        const player = [...derby.team1.players, ...derby.team2.players].find(p => p.id === playerId);
        if (!player) {
            <div>Joueur non trouvé</div>
            return;
        }


        setGoals(prev => {
            const newGoals = {
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
            };
            return newGoals;
        });
    };

    const handleRemoveGoal = (matchId: string, goalId: string) => {
        setGoals(prev => ({
            ...prev,
            [matchId]: prev[matchId].filter(goal => goal.id !== goalId)
        }));
    };

    const handleScoreSubmit = async (matchId: string) => {
        try {
            const matchScores = scores[matchId];
            const matchGoals = goals[matchId] || [];

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

            fetchDerbys();
            setEditingMatch(null);
            setEditingGoals(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                <h1 className="text-3xl text-left sm:text-3xl font-bold">Recapitulatif Derbys</h1>
                <Link
                    href="/admin/tirage"
                    className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                    Nouveau tirage
                </Link>
            </div>

            {/* Barre de filtres */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Filtre par statut */}
                    <div>
                        <label htmlFor="statusFilter" className="block text-sm font-semibold mb-2 text-gray-700">
                            📊 Filtrer par statut
                        </label>
                        <select
                            id="statusFilter"
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1); // Reset à la page 1
                            }}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="ALL">Tous les derbys</option>
                            <option value="PENDING">En attente</option>
                            <option value="COMPLETED">Terminés</option>
                        </select>
                    </div>

                    {/* Filtre par date */}
                    <div>
                        <label htmlFor="dateFilter" className="block text-sm font-semibold mb-2 text-gray-700">
                            📅 Filtrer par période
                        </label>
                        <select
                            id="dateFilter"
                            value={dateFilter}
                            onChange={(e) => {
                                setDateFilter(e.target.value);
                                setPage(1); // Reset à la page 1
                            }}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="ALL">Toutes les périodes</option>
                            <option value="1M">Dernier mois</option>
                            <option value="3M">3 derniers mois</option>
                            <option value="6M">6 derniers mois</option>
                        </select>
                    </div>
                </div>

                {/* Indicateur filtres actifs */}
                {(statusFilter !== "ALL" || dateFilter !== "ALL") && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-semibold">Filtres actifs:</span>
                        {statusFilter !== "ALL" && (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                {statusFilter === "PENDING" ? "En attente" : "Terminés"}
                            </span>
                        )}
                        {dateFilter !== "ALL" && (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                {dateFilter === "1M" ? "Dernier mois" : dateFilter === "3M" ? "3 mois" : "6 mois"}
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setStatusFilter("ALL");
                                setDateFilter("ALL");
                                setPage(1);
                            }}
                            className="ml-2 text-red-600 hover:text-red-700 font-semibold"
                        >
                            ✕ Réinitialiser
                        </button>
                    </div>
                )}
            </div>

            <div className="space-y-8">
                {derbys.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <p className="text-gray-500 text-lg">
                            Aucun derby trouvé avec les filtres sélectionnés
                        </p>
                        <button
                            onClick={() => {
                                setStatusFilter("ALL");
                                setDateFilter("ALL");
                                setPage(1);
                            }}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
                        >
                            Réinitialiser les filtres
                        </button>
                    </div>
                ) : derbys.map((derby) => (
                    <div key={derby.id} className="bg-white rounded-lg  shadow-lg p-4 sm:p-6 transition-all hover:shadow-xl">
                        <div className="flex justify-center gap-2 mt-6 mb-6">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                Précédent
                            </button>
                            <span className="px-4 py-2">{page} / {Math.ceil(total / pageSize)}</span>
                            <button
                                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                                onClick={() => setPage(p => p + 1)}
                                disabled={page * pageSize >= total}
                            >
                                Suivant
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <div>
                                <h2 className="text-xl font-bold">
                                    Derby du {new Date(derby.createdAt).toLocaleDateString()}
                                </h2>
                                <p className="text-gray-600">
                                    Statut: {derby.status === 'PENDING' ? 'En attente' : 'Terminé'}
                                </p>
                            </div>
                            {derby.winnerId && (
                                <div className="text-green-600 font-semibold bg-green-50 px-4 py-2 rounded-full">
                                    Vainqueur: {derby.winnerId === (derby.team1.name === 'Aigles' ? derby.team1.id : derby.team2.id) ? 'Aigles' : 'Lions'}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-4 text-blue-600">Aigles</h3>
                                <ul className="space-y-2">
                                    {derby.team1.players.map((player) => (
                                        <li key={player.id} className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <Image
                                                src={player.profilePhoto || '/images/default.jpeg'}
                                                alt={player.fullName}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                            <span>{player.fullName}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-pink-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-4 text-pink-600">Lions</h3>
                                <ul className="space-y-2">
                                    {derby.team2.players.map((player) => (
                                        <li key={player.id} className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                            <Image
                                                src={player.profilePhoto || '/images/default.jpeg'}
                                                alt={player.fullName}
                                                width={32}
                                                height={32}
                                                className="rounded-full"
                                            />
                                            <span>{player.fullName}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Matches</h3>

                            {derby.matches.every(match => match.status === 'COMPLETED') && (
                                <div className="mb-6 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg p-4 sm:p-6 text-white shadow-lg animate-fade-in">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                        <h4 className="text-xl sm:text-2xl font-bold">Récapitulatif du Derby</h4>
                                        <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                            {new Date(derby.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                                        <div className="bg-white/10 rounded-lg p-4">
                                            <h5 className="text-lg font-semibold mb-2">Aigles</h5>
                                            <div className="space-y-2">
                                                {derby.team1.players.map(player => (
                                                    <div key={player.id} className="flex items-center space-x-2">
                                                        <Image
                                                            src={player.profilePhoto || '/images/default.jpeg'}
                                                            alt={player.fullName}
                                                            width={24}
                                                            height={24}
                                                            className="rounded-full"
                                                        />
                                                        <span>{player.fullName}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-white/10 rounded-lg p-4">
                                            <h5 className="text-lg font-semibold mb-2">Lions</h5>
                                            <div className="space-y-2">
                                                {derby.team2.players.map(player => (
                                                    <div key={player.id} className="flex items-center space-x-2">
                                                        <Image
                                                            src={player.profilePhoto || '/images/default.jpeg'}
                                                            alt={player.fullName}
                                                            width={24}
                                                            height={24}
                                                            className="rounded-full"
                                                        />
                                                        <span>{player.fullName}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {derby.matches.map((match, index) => {
                                            // Identifier Aigles et Lions
                                            const aiglesId = derby.team1.name === 'Aigles' ? derby.team1.id : derby.team2.id;
                                            const lionsId = derby.team1.name === 'Lions' ? derby.team1.id : derby.team2.id;

                                            // Déterminer les scores selon l'ordre réel
                                            const aiglesScore = match.team1Id === aiglesId ? match.score1 : match.score2;
                                            const lionsScore = match.team1Id === lionsId ? match.score1 : match.score2;

                                            return (
                                                <div key={match.id} className="bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-colors">
                                                    <div className="text-sm text-white/80 mb-1">Match {index + 1}</div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="font-bold">{aiglesScore}</span>
                                                        <span className="text-white/60">-</span>
                                                        <span className="font-bold">{lionsScore}</span>
                                                    </div>
                                                    <div className="text-xs text-white/60 mt-1">
                                                        {new Date(match.date).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {derby.winnerId && (
                                        <div className="mt-6 text-center">
                                            <div className="text-sm text-white/80 mb-1">Vainqueur du Derby</div>
                                            <div className="text-2xl font-bold animate-bounce">
                                                {derby.winnerId === (derby.team1.name === 'Aigles' ? derby.team1.id : derby.team2.id) ? 'Aigles' : 'Lions'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {derby.matches.map((match) => (
                                    <div key={match.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium">
                                                {new Date(match.date).toLocaleDateString()}
                                            </span>
                                            <span className="text-sm text-gray-600">{getMatchStatus(match, derby)}</span>
                                        </div>
                                        {editingMatch === match.id ? (
                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                                    <div className="text-center">
                                                        <div className="font-medium">Aigles</div>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={scores[match.id]?.team1 || 0}
                                                            onChange={(e) => handleScoreChange(match.id, 'team1', e.target.value)}
                                                            className="w-16 text-center border rounded p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div className="text-gray-400">vs</div>
                                                    <div className="text-center">
                                                        <div className="font-medium">Lions</div>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={scores[match.id]?.team2 || 0}
                                                            onChange={(e) => handleScoreChange(match.id, 'team2', e.target.value)}
                                                            className="w-16 text-center border rounded p-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => setEditingGoals(match.id)}
                                                        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors"
                                                    >
                                                        {editingGoals === match.id ? 'Masquer les buteurs' : 'Gérer les buteurs'}
                                                    </button>

                                                    {editingGoals === match.id && (
                                                        <div className="mt-4 space-y-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium text-blue-600">Aigles</h4>
                                                                    <div className="flex gap-2">
                                                                        <select
                                                                            className="flex-1 border rounded p-2"
                                                                            onChange={(e) => {
                                                                                const parts = e.target.value.split('-');
                                                                                const isOwnGoal = parts.pop() === 'true';
                                                                                const playerId = parts.join('-');
                                                                                if (playerId) {
                                                                                    handleAddGoal(match.id, match.team1Id, playerId, isOwnGoal);
                                                                                    e.target.value = '';
                                                                                }
                                                                            }}
                                                                        >
                                                                            <option value="">Ajouter un buteur</option>
                                                                            <optgroup label="Aigles">
                                                                                {derby.team1.players.map(player => (
                                                                                    <option key={player.id} value={`${player.id}-false`}>
                                                                                        {player.fullName}
                                                                                    </option>
                                                                                ))}
                                                                            </optgroup>
                                                                            <optgroup label="Lions (CSC)">
                                                                                {derby.team2.players.map(player => (
                                                                                    <option key={player.id} value={`${player.id}-true`}>
                                                                                        {player.fullName} (CSC)
                                                                                    </option>
                                                                                ))}
                                                                            </optgroup>
                                                                        </select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        {(goals[match.id] || [])
                                                                            .filter(goal => goal.teamId === match.team1Id)
                                                                            .map(goal => {
                                                                                return (
                                                                                    <div key={goal.id} className="flex justify-between items-center bg-blue-50 p-2 rounded">
                                                                                        <span>
                                                                                            {goal.player?.fullName || 'Joueur inconnu'}
                                                                                            {goal.isOwnGoal && <span className="text-red-500 ml-1">(CSC)</span>}
                                                                                        </span>
                                                                                        <button
                                                                                            onClick={() => handleRemoveGoal(match.id, goal.id)}
                                                                                            className="text-red-500 hover:text-red-700"
                                                                                        >
                                                                                            ×
                                                                                        </button>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium text-pink-600">Lions</h4>
                                                                    <div className="flex gap-2">
                                                                        <select
                                                                            className="flex-1 border rounded p-2"
                                                                            onChange={(e) => {
                                                                                const parts = e.target.value.split('-');
                                                                                const isOwnGoal = parts.pop() === 'true';
                                                                                const playerId = parts.join('-');
                                                                                if (playerId) {
                                                                                    handleAddGoal(match.id, match.team2Id, playerId, isOwnGoal);
                                                                                    e.target.value = '';
                                                                                }
                                                                            }}
                                                                        >
                                                                            <option value="">Ajouter un buteur</option>
                                                                            <optgroup label="Lions">
                                                                                {derby.team2.players.map(player => (
                                                                                    <option key={player.id} value={`${player.id}-false`}>
                                                                                        {player.fullName}
                                                                                    </option>
                                                                                ))}
                                                                            </optgroup>
                                                                            <optgroup label="Aigles (CSC)">
                                                                                {derby.team1.players.map(player => (
                                                                                    <option key={player.id} value={`${player.id}-true`}>
                                                                                        {player.fullName} (CSC)
                                                                                    </option>
                                                                                ))}
                                                                            </optgroup>
                                                                        </select>
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        {(goals[match.id] || [])
                                                                            .filter(goal => goal.teamId === match.team2Id)
                                                                            .map(goal => {
                                                                                return (
                                                                                    <div key={goal.id} className="flex justify-between items-center bg-pink-50 p-2 rounded">
                                                                                        <span>
                                                                                            {goal.player?.fullName || 'Joueur inconnu'}
                                                                                            {goal.isOwnGoal && <span className="text-red-500 ml-1">(CSC)</span>}
                                                                                        </span>
                                                                                        <button
                                                                                            onClick={() => handleRemoveGoal(match.id, goal.id)}
                                                                                            className="text-red-500 hover:text-red-700"
                                                                                        >
                                                                                            ×
                                                                                        </button>
                                                                                    </div>
                                                                                );
                                                                            })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => handleScoreSubmit(match.id)}
                                                    className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                                >
                                                    Valider
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                                                    {(() => {
                                                        // Identifier Aigles et Lions
                                                        const aiglesId = derby.team1.name === 'Aigles' ? derby.team1.id : derby.team2.id;
                                                        const lionsId = derby.team1.name === 'Lions' ? derby.team1.id : derby.team2.id;

                                                        // Déterminer les scores selon l'ordre réel
                                                        const aiglesScore = match.team1Id === aiglesId ? match.score1 : match.score2;
                                                        const lionsScore = match.team1Id === lionsId ? match.score1 : match.score2;

                                                        return (
                                                            <>
                                                                <div className="text-center">
                                                                    <div className="font-medium">Aigles</div>
                                                                    <div className="text-2xl font-bold">{aiglesScore ?? '-'}</div>
                                                                </div>
                                                                <div className="text-gray-400">vs</div>
                                                                <div className="text-center">
                                                                    <div className="font-medium">Lions</div>
                                                                    <div className="text-2xl font-bold">{lionsScore ?? '-'}</div>
                                                                </div>
                                                            </>
                                                        );
                                                    })()}
                                                </div>

                                                {match.goals && match.goals.length > 0 && (
                                                    <div className="mt-4 space-y-2">
                                                        <h4 className="font-medium text-gray-700">Buteurs</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                {match.goals
                                                                    .filter(goal => goal.teamId === match.team1Id)
                                                                    .map(goal => (
                                                                        <div key={goal.id} className="text-sm text-blue-600">
                                                                            {goal.player?.fullName}
                                                                            {goal.isOwnGoal && <span className="text-red-500 ml-1">(CSC)</span>}
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                            <div className="space-y-1">
                                                                {match.goals
                                                                    .filter(goal => goal.teamId === match.team2Id)
                                                                    .map(goal => (
                                                                        <div key={goal.id} className="text-sm text-pink-600">
                                                                            {goal.player?.fullName}
                                                                            {goal.isOwnGoal && <span className="text-red-500 ml-1">(CSC)</span>}
                                                                        </div>
                                                                    ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {match.status !== 'COMPLETED' && (
                                                    <button
                                                        onClick={() => handleEditMatch(match)}
                                                        className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                                    >
                                                        Modifier
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 