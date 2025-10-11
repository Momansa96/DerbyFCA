"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Sparkles, Calendar, Clock, MapPin, Users, Pencil, Trash2, Plus, Search, Filter, TrendingUp, Home, Plane, Trophy } from "lucide-react";

const matchTypes = ["officiel", "amical"];

interface Match {
  id: string;
  type: string;
  date: string;
  time: string;
  location: string;
  place: string;
  opponent: string;
  createdAt?: string;
}

export default function AdminMatchsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<Match | null>(null);

  const [form, setForm] = useState({
    type: matchTypes[0],
    date: "",
    time: "",
    location: "",
    place: "",
    opponent: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [formModalOpen, setFormModalOpen] = useState(false);

  // Charger les matchs au montage
  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/friendly-matches");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setMatches(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des matchs");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.date || !form.time || !form.location || !form.place || !form.opponent) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsSubmitting(true);

    try {
      const url = editingMatch
        ? `/api/friendly-matches/${editingMatch.id}`
        : "/api/friendly-matches";
      const method = editingMatch ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Une erreur est survenue");
      }

      toast.success(
        editingMatch
          ? "Match modifié avec succès !"
          : `Match ${form.type} programmé le ${form.date} à ${form.time}`
      );

      // Reset form
      setForm({
        type: matchTypes[0],
        date: "",
        time: "",
        location: "",
        place: "",
        opponent: "",
      });
      setEditingMatch(null);
      setFormModalOpen(false);

      // Recharger la liste
      fetchMatches();
    } catch (error: any) {
      console.error("Erreur lors de l'enregistrement :", error);
      toast.error(error.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setForm({
      type: match.type,
      date: match.date,
      time: match.time,
      location: match.location,
      place: match.place,
      opponent: match.opponent,
    });
    // Scroll vers le formulaire
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingMatch(null);
    setForm({
      type: matchTypes[0],
      date: "",
      time: "",
      location: "",
      place: "",
      opponent: "",
    });
  };

  const confirmDelete = (match: Match) => {
    setMatchToDelete(match);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!matchToDelete) return;

    try {
      const res = await fetch(`/api/friendly-matches/${matchToDelete.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Erreur lors de la suppression");
      }

      toast.success("Match supprimé avec succès");
      fetchMatches();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    } finally {
      setDeleteModalOpen(false);
      setMatchToDelete(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const stats = useMemo(() => {
    const now = new Date();
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return {
      total: matches.length,
      upcoming: matches.filter(m => new Date(m.date) >= now && new Date(m.date) <= next7Days).length,
      official: matches.filter(m => m.type === "officiel").length,
      friendly: matches.filter(m => m.type === "amical").length,
    };
  }, [matches]);

  const filteredMatches = useMemo(() => {
    return matches
      .filter(m => {
        if (filterType !== "all" && m.type !== filterType) return false;
        if (searchQuery && !m.opponent.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [matches, filterType, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Gestion des Matchs</h1>
          </div>
          <p className="text-gray-400 text-sm">Programmez et gérez les matchs amicaux et officiels</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Matchs programmés</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Prochains</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.upcoming}</div>
            <div className="text-xs text-gray-500 mt-1">7 prochains jours</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-gray-400">Officiels</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.official}</div>
            <div className="text-xs text-gray-500 mt-1">Matchs officiels</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-gray-400">Amicaux</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.friendly}</div>
            <div className="text-xs text-gray-500 mt-1">Matchs amicaux</div>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher un adversaire..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilterType("all")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === "all" ? "bg-cyan-500 text-black" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"}`}>
              Tous
            </button>
            <button onClick={() => setFilterType("officiel")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === "officiel" ? "bg-indigo-500 text-white" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"}`}>
              Officiels
            </button>
            <button onClick={() => setFilterType("amical")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === "amical" ? "bg-purple-500 text-white" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"}`}>
              Amicaux
            </button>
          </div>
        </div>

        {/* Matches Cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-2xl">
            <Calendar className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {searchQuery || filterType !== "all" ? "Aucun résultat" : "Aucun match programmé"}
            </h3>
            <p className="text-gray-400 text-sm">
              {searchQuery || filterType !== "all" ? "Essayez de modifier vos filtres" : "Cliquez sur le bouton + pour créer un match"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMatches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-4 sm:p-5 hover:border-cyan-500/50 transition-all group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Left: Type & Place */}
                  <div className="flex items-center gap-2 sm:w-32 flex-shrink-0">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${match.type === "officiel" ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "bg-purple-500/20 text-purple-400 border border-purple-500/30"}`}>
                      {match.type === "officiel" ? "Officiel" : "Amical"}
                    </span>
                    {match.place === "domicile" ? (
                      <Home className="w-4 h-4 text-green-400" />
                    ) : (
                      <Plane className="w-4 h-4 text-orange-400" />
                    )}
                  </div>

                  {/* Middle: Match Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                      vs {match.opponent}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(match.date)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {match.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {match.location}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    <button
                      onClick={() => handleEdit(match)}
                      className="p-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg transition-all group/btn"
                    >
                      <Pencil className="w-4 h-4 text-cyan-400" />
                    </button>
                    <button
                      onClick={() => confirmDelete(match)}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all group/btn"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* FAB - Floating Action Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        onClick={() => setFormModalOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full shadow-lg shadow-cyan-500/50 flex items-center justify-center hover:scale-110 transition-transform z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>

      {/* Form Modal */}
      <AnimatePresence>
        {(formModalOpen || editingMatch) && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4" onClick={() => { setFormModalOpen(false); handleCancelEdit(); }}>
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-t sm:border border-cyan-500/30 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 sm:p-6 flex items-center justify-between">
                <h2 className="text-xl font-black text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  {editingMatch ? "Modifier le match" : "Nouveau match"}
                </h2>
                <button onClick={() => { setFormModalOpen(false); handleCancelEdit(); }} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                  <span className="text-gray-400 text-2xl">×</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Type</label>
                    <select name="type" value={form.type} onChange={handleChange} className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50">
                      <option value="officiel">Match Officiel</option>
                      <option value="amical">Match Amical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Lieu</label>
                    <select name="place" value={form.place} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50">
                      <option value="">Sélectionner</option>
                      <option value="domicile">Domicile</option>
                      <option value="extérieur">Extérieur</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Adversaire</label>
                  <input type="text" name="opponent" value={form.opponent} onChange={handleChange} placeholder="Nom du club" required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50" />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Date</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Heure</label>
                    <input type="time" name="time" value={form.time} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Stade</label>
                  <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="Ex: Stade Municipal" required className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50" />
                </div>

                <div className="flex gap-3 pt-4">
                  {editingMatch && (
                    <button type="button" onClick={handleCancelEdit} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-bold transition-colors">
                      Annuler
                    </button>
                  )}
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed rounded-xl font-bold transition-all shadow-lg shadow-cyan-500/20">
                    {isSubmitting ? "En cours..." : (editingMatch ? "Enregistrer" : "Créer")}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && matchToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => { setDeleteModalOpen(false); setMatchToDelete(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-gray-900 border border-red-500/50 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-red-400 mb-4">Confirmer la suppression</h3>
              <p className="text-gray-300 mb-6">
                Supprimer le match contre <span className="font-bold text-white">{matchToDelete.opponent}</span> du {formatDate(matchToDelete.date)} ?
              </p>
              <div className="flex gap-3">
                <button onClick={() => { setDeleteModalOpen(false); setMatchToDelete(null); }} className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors">
                  Annuler
                </button>
                <button onClick={handleDelete} className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 rounded-lg font-bold transition-colors">
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
}