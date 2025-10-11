"use client";

import { useState, useEffect, useMemo } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Search, Users, Trophy, UserCheck, Edit, Trash2, User, Mail, Phone, Calendar, Award, X } from "lucide-react";

interface Player {
  id: string;
  fullName: string;
  alias: string | null;
  bureauRole: string | null;
  profilePhoto: string | null;
  preferredPosition: string | null;
  description: string | null;
  number: number | null;
  status: 'ACTIF' | 'BLESSE' | 'PAUSE';
  joinDate: Date;
  email: string | null;
  phone: string | null;
}

export default function JoueursPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    alias: '',
    bureauRole: '',
    profilePhoto: null as File | null,
    preferredPosition: '',
    description: '',
    number: '',
    status: 'ACTIF',
    joinDate: new Date().toISOString().split('T')[0],
    email: '',
    phone: ''
  });

  // Stats
  const stats = useMemo(() => ({
    total: players.length,
    actif: players.filter(p => p.status === "ACTIF").length,
    bureau: players.filter(p => p.bureauRole).length,
  }), [players]);

  // Filtered players
  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return p.fullName.toLowerCase().includes(query) ||
               (p.alias && p.alias.toLowerCase().includes(query));
      }
      return true;
    });
  }, [players, filterStatus, searchQuery]);

  // Charger les joueurs au montage du composant
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/players');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors du chargement des joueurs');
      }
      const data = await response.json();
      console.log('Joueurs récupérés:', data);
      setPlayers(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des joueurs');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setFormData({
      fullName: player.fullName,
      alias: player.alias || '',
      bureauRole: player.bureauRole || '',
      profilePhoto: null,
      preferredPosition: player.preferredPosition || '',
      description: player.description || '',
      number: player.number ? player.number.toString() : '',
      status: player.status,
      joinDate: new Date(player.joinDate).toISOString().split('T')[0],
      email: player.email || '',
      phone: player.phone || ''
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profilePhoto: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingPlayer
        ? `/api/players/${editingPlayer.id}`
        : '/api/players';

      const method = editingPlayer ? 'PUT' : 'POST';

      if (editingPlayer) {
        // Pour la modification, on envoie en JSON
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            alias: formData.alias,
            bureauRole: formData.bureauRole,
            preferredPosition: formData.preferredPosition || null,
            description: formData.description,
            number: formData.number ? Number(formData.number) : null,
            status: formData.status,
            joinDate: formData.joinDate,
            email: formData.email,
            phone: formData.phone,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de l\'opération');
        }
        toast.success('Joueur modifié avec succès');
      } else {
        // Pour la création, on garde le FormData pour l'upload de fichier
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (value !== null) {
            if (key === 'number') {
              if (value && value.toString().trim() !== '') {
                formDataToSend.append(key, Number(value).toString());
              } else {
                formDataToSend.append(key, '');
              }
            } else if (key === 'profilePhoto' && value instanceof File) {
              formDataToSend.append(key, value);
            } else if (typeof value === 'string') {
              formDataToSend.append(key, value || '');
            }
          }
        });

        const response = await fetch(url, {
          method,
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Erreur lors de l\'opération');
        }
        toast.success('Joueur créé avec succès');
      }

      await fetchPlayers();
      resetForm();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Une erreur est survenue lors de l\'opération');
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      alias: '',
      bureauRole: '',
      profilePhoto: null,
      preferredPosition: '',
      description: '',
      number: '',
      status: 'ACTIF',
      joinDate: new Date().toISOString().split('T')[0],
      email: '',
      phone: ''
    });
    setEditingPlayer(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    const player = players.find(p => p.id === id);
    if (player) {
      setPlayerToDelete(player);
      setDeleteModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!playerToDelete) return;

    try {
      const response = await fetch(`/api/players/${playerToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      toast.success('Joueur supprimé avec succès');
      await fetchPlayers();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeleteModalOpen(false);
      setPlayerToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Gestion des Joueurs</h1>
          </div>
          <p className="text-gray-400 text-sm">Gérez l'effectif du FCA</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Joueurs</p>
                <p className="text-3xl font-bold text-cyan-400">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Actifs</p>
                <p className="text-3xl font-bold text-green-400">{stats.actif}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/20 rounded-xl p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Bureau</p>
                <p className="text-3xl font-bold text-indigo-400">{stats.bureau}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un joueur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
              />
            </div>

            {/* Status Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterStatus === "all"
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setFilterStatus("ACTIF")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterStatus === "ACTIF"
                    ? "bg-green-500 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                }`}
              >
                Actif
              </button>
              <button
                onClick={() => setFilterStatus("BLESSE")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterStatus === "BLESSE"
                    ? "bg-red-500 text-white"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                }`}
              >
                Blessé
              </button>
              <button
                onClick={() => setFilterStatus("PAUSE")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  filterStatus === "PAUSE"
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800/50 text-gray-400 hover:bg-gray-700/50"
                }`}
              >
                Pause
              </button>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-12 text-center"
          >
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-300 mb-2">Aucun joueur trouvé</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterStatus !== "all"
                ? "Aucun résultat ne correspond à vos critères"
                : "Commencez par ajouter un nouveau joueur"}
            </p>
            {!searchQuery && filterStatus === "all" && (
              <button
                onClick={() => { resetForm(); setIsModalOpen(true); }}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
              >
                <Plus className="w-5 h-5 inline mr-2" />
                Ajouter un joueur
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl overflow-hidden hover:border-cyan-500/50 transition-all group"
              >
                {/* Avatar + Info */}
                <div className="relative h-48 bg-gray-900/50">
                  <img
                    src={player.profilePhoto || '/images/avatar-default.png'}
                    alt={player.fullName}
                    className="w-full h-full object-cover"
                  />
                  {player.bureauRole && (
                    <div className="absolute top-3 left-3 bg-indigo-500/90 px-2 py-1 rounded-lg backdrop-blur-sm">
                      <Award className="w-4 h-4 text-white inline mr-1" />
                      <span className="text-xs font-bold text-white">{player.bureauRole}</span>
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${
                    player.status === 'ACTIF' ? 'bg-green-500/90 text-white' :
                    player.status === 'BLESSE' ? 'bg-red-500/90 text-white' :
                    'bg-yellow-500/90 text-black'
                  }`}>
                    {player.status}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1">{player.fullName}</h3>
                  {player.alias && <p className="text-sm text-cyan-400 mb-2">"{player.alias}"</p>}

                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                    {player.preferredPosition && (
                      <span className="flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        {player.preferredPosition}
                      </span>
                    )}
                    {player.number && (
                      <span className="font-bold text-cyan-400">#{player.number}</span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(player)}
                      className="flex-1 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 text-sm font-semibold transition-all"
                    >
                      <Edit className="w-4 h-4 inline mr-1" />
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(player.id)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FAB Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => { resetForm(); setIsModalOpen(true); }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-50 p-0 sm:p-4"
            >
              <div className="bg-[#0A0E27] border border-gray-700/50 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header Sticky */}
                <div className="sticky top-0 bg-[#0A0E27] border-b border-gray-700/50 px-6 py-4 flex items-center justify-between z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      {editingPlayer ? 'Modifier le joueur' : 'Ajouter un joueur'}
                    </h2>
                  </div>
                  <button
                    onClick={resetForm}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 hover:text-white transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="overflow-y-auto px-6 py-4 space-y-6">
                  {/* Section Informations personnelles */}
                  <div className="bg-gray-900/30 border border-gray-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <User className="w-5 h-5 text-cyan-400" />
                      Informations personnelles
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Nom complet *</label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Alias</label>
                        <input
                          type="text"
                          value={formData.alias}
                          onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Téléphone
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section Informations sportives */}
                  <div className="bg-gray-900/30 border border-gray-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-cyan-400" />
                      Informations sportives
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Poste préféré</label>
                        <select
                          value={formData.preferredPosition}
                          onChange={(e) => setFormData({ ...formData, preferredPosition: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        >
                          <option value="">Sélectionner un poste</option>
                          <option value="Attaquant">Attaquant</option>
                          <option value="Milieu">Milieu</option>
                          <option value="Défenseur">Défenseur</option>
                          <option value="Gardien">Gardien</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Numéro</label>
                        <input
                          type="number"
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Statut</label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        >
                          <option value="ACTIF">Actif</option>
                          <option value="BLESSE">Blessé</option>
                          <option value="PAUSE">En pause</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Date d'adhésion
                        </label>
                        <input
                          type="date"
                          value={formData.joinDate}
                          onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section Informations administratives */}
                  <div className="bg-gray-900/30 border border-gray-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-cyan-400" />
                      Informations administratives
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Poste dans le bureau</label>
                        <input
                          type="text"
                          value={formData.bureauRole}
                          onChange={(e) => setFormData({ ...formData, bureauRole: e.target.value })}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                          placeholder="Ex: Président, Trésorier, etc."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={4}
                          className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all resize-none"
                          placeholder="Description du joueur..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Section Photo de profil */}
                  <div className="bg-gray-900/30 border border-gray-700/30 rounded-xl p-4">
                    <h3 className="text-lg font-bold text-white mb-4">Photo de profil</h3>
                    <div className="flex items-center gap-6">
                      <div className="flex-shrink-0">
                        {formData.profilePhoto ? (
                          <img
                            src={URL.createObjectURL(formData.profilePhoto)}
                            alt="Aperçu"
                            className="h-24 w-24 rounded-full object-cover border-2 border-cyan-500"
                          />
                        ) : (
                          <div className="h-24 w-24 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                            <User className="h-12 w-12 text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="block w-full text-sm text-gray-400
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg file:border-0
                            file:text-sm file:font-semibold
                            file:bg-cyan-500/10 file:text-cyan-400
                            hover:file:bg-cyan-500/20 file:transition-all file:cursor-pointer"
                        />
                        <p className="mt-2 text-xs text-gray-500">
                          PNG, JPG, GIF jusqu'à 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action */}
                  <div className="sticky bottom-0 bg-[#0A0E27] border-t border-gray-700/50 pt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg text-gray-300 font-semibold transition-all"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all"
                    >
                      {editingPlayer ? 'Modifier' : 'Enregistrer'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modal de suppression */}
      <AnimatePresence>
        {deleteModalOpen && playerToDelete && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setDeleteModalOpen(false); setPlayerToDelete(null); }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="bg-[#0A0E27] border border-red-500/50 rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Confirmer la suppression</h2>
                </div>
                <p className="text-gray-400 mb-6">
                  Êtes-vous sûr de vouloir supprimer le joueur <span className="font-bold text-white">{playerToDelete.fullName}</span> ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => { setDeleteModalOpen(false); setPlayerToDelete(null); }}
                    className="flex-1 px-4 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg text-gray-300 font-semibold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-all"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}