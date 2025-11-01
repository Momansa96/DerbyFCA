'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Trophy, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDerbys } from './hooks/useDerbys';
import { useMatchEditor } from './hooks/useMatchEditor';
import { useGoalEditor } from './hooks/useGoalEditor';
import { useCardEditor } from './hooks/useCardEditor';
import { DerbyFilters } from './components/DerbyFilters';
import { DerbyCard } from './components/DerbyCard';
import { Match } from './utils/types';

export default function AdminDerbysPage() {
    const {
        derbys,
        loading,
        error,
        page,
        setPage,
        pageSize,
        total,
        statusFilter,
        setStatusFilter,
        dateFilter,
        setDateFilter,
        resetFilters,
        refetch
    } = useDerbys();

    const { editingMatch, scores, handleScoreChange, startEditing, handleScoreSubmit } = useMatchEditor(refetch);
    const { goals, editingGoals, initializeGoals, handleAddGoal, handleRemoveGoal, toggleEditingGoals } = useGoalEditor();
    const {
        yellowCards,
        redCards,
        initializeCards,
        handleAddYellowCard,
        handleAddRedCard,
        handleRemoveYellowCard,
        handleRemoveRedCard
    } = useCardEditor();

    const [editingCards, setEditingCards] = useState<string | null>(null);

    const toggleEditingCards = (matchId: string | null) => {
        setEditingCards(matchId);
    };

    const handleEditMatch = (match: Match) => {
        startEditing(match);
        initializeGoals(match.id, match.goals || []);
        initializeCards(match.id, match.yellowCards || [], match.redCards || []);
    };

    const handleSubmitScore = async (matchId: string) => {
        await handleScoreSubmit(matchId, goals[matchId] || [], yellowCards[matchId] || [], redCards[matchId] || []);
        toggleEditingGoals(null);
        toggleEditingCards(null);
    };

    // Wrapper functions to include derby in card handlers
    const handleAddYellowCardWithDerby = (matchId: string, playerId: string, derby: any) => {
        handleAddYellowCard(matchId, playerId, derby);
    };

    const handleAddRedCardWithDerby = (matchId: string, playerId: string, derby: any) => {
        handleAddRedCard(matchId, playerId, derby);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0E27] flex justify-center items-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400"></div>
                    <Trophy className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-cyan-400" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0A0E27] flex justify-center items-center">
                <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl p-6 max-w-md">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-1 h-8 bg-gradient-to-b from-cyan-400 via-purple-500 to-pink-500 rounded-full"></div>
                            <h1 className="text-2xl sm:text-3xl font-black text-white">Récapitulatif Derbys</h1>
                        </div>
                        <p className="text-gray-400 text-sm">Gérez et suivez tous vos derbys Aigles vs Lions</p>
                    </div>
                    <Link
                        href="/admin/tirage"
                        className="group w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center gap-2"
                    >
                        <Plus className="w-5 h-5" />
                        Nouveau tirage
                    </Link>
                </div>

            <DerbyFilters
                statusFilter={statusFilter}
                dateFilter={dateFilter}
                onStatusChange={(value) => {
                    setStatusFilter(value);
                    setPage(1);
                }}
                onDateChange={(value) => {
                    setDateFilter(value);
                    setPage(1);
                }}
                onReset={resetFilters}
            />

                <div className="space-y-8">
                    {derbys.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-12 text-center backdrop-blur-sm"
                        >
                            <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400 text-lg mb-4">
                                Aucun derby trouvé avec les filtres sélectionnés
                            </p>
                            <button
                                onClick={resetFilters}
                                className="mt-4 px-6 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 font-semibold transition-all"
                            >
                                Réinitialiser les filtres
                            </button>
                        </motion.div>
                    ) : derbys.map((derby, index) => (
                        <motion.div
                            key={derby.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {/* Pagination */}
                            <div className="flex justify-center gap-3 mb-6">
                                <button
                                    className="group flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-700/50 text-gray-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800/50 hover:border-cyan-500/30 hover:text-cyan-400 transition-all"
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    Précédent
                                </button>
                                <div className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg">
                                    <span className="text-white font-semibold">{page}</span>
                                    <span className="text-gray-500 mx-2">/</span>
                                    <span className="text-gray-400">{Math.ceil(total / pageSize)}</span>
                                </div>
                                <button
                                    className="group flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-700/50 text-gray-400 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800/50 hover:border-purple-500/30 hover:text-purple-400 transition-all"
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page * pageSize >= total}
                                >
                                    Suivant
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <DerbyCard
                                derby={derby}
                                editingMatch={editingMatch}
                                scores={scores}
                                goals={goals}
                                yellowCards={yellowCards}
                                redCards={redCards}
                                editingGoals={editingGoals}
                                editingCards={editingCards}
                                onEditMatch={handleEditMatch}
                                onScoreChange={handleScoreChange}
                                onToggleEditingGoals={toggleEditingGoals}
                                onToggleEditingCards={toggleEditingCards}
                                onAddGoal={handleAddGoal}
                                onRemoveGoal={handleRemoveGoal}
                                onAddYellowCard={handleAddYellowCardWithDerby}
                                onAddRedCard={handleAddRedCardWithDerby}
                                onRemoveYellowCard={handleRemoveYellowCard}
                                onRemoveRedCard={handleRemoveRedCard}
                                onSubmitScore={handleSubmitScore}
                                onTeamUpdate={refetch}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}