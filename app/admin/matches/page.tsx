"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Sparkles, Calendar, Clock, MapPin, Users, Pencil, Trash2 } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Calendar className="text-cyan-400" />
            Gestion des Matchs
          </h1>
          <p className="text-gray-400">Programmez et gérez les matchs amicaux et officiels</p>
        </motion.div>

        {/* Liste des matchs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Users className="text-cyan-400" />
            Matchs programmés ({matches.length})
          </h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="loading loading-spinner loading-lg text-cyan-400"></div>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-xl p-12 text-center">
              <Calendar className="mx-auto h-16 w-16 text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg">
                Aucun match programmé pour le moment
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Utilisez le formulaire ci-dessous pour créer un nouveau match
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300">
                      Adversaire
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300">
                      Date & Heure
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300">
                      Lieu
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-cyan-300">
                      Stade
                    </th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-cyan-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {matches.map((match) => (
                    <tr key={match.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            match.type === "officiel"
                              ? "bg-cyan-500/20 text-cyan-300"
                              : "bg-purple-500/20 text-purple-300"
                          }`}
                        >
                          {match.type === "officiel" ? "Officiel" : "Amical"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">{match.opponent}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatDate(match.date)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                          <Clock className="h-4 w-4" />
                          {match.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            match.place === "domicile"
                              ? "bg-green-500/20 text-green-300"
                              : "bg-orange-500/20 text-orange-300"
                          }`}
                        >
                          {match.place === "domicile" ? "🏠 Domicile" : "✈️ Extérieur"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-300">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          {match.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(match)}
                            className="p-2 hover:bg-cyan-500/20 rounded-lg transition-colors group"
                            title="Modifier"
                          >
                            <Pencil className="h-4 w-4 text-gray-400 group-hover:text-cyan-400" />
                          </button>
                          <button
                            onClick={() => confirmDelete(match)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors group"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Formulaire */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full max-w-3xl mx-auto p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl"
        >
          <h2 className="text-3xl font-bold text-center mb-2 flex justify-center items-center gap-2">
            <Sparkles className="text-cyan-400 animate-pulse" />
            {editingMatch ? "Modifier le match" : "Programmer un nouveau match"}
          </h2>
          {editingMatch && (
            <p className="text-center text-gray-400 mb-6">
              Modification : {editingMatch.opponent} - {formatDate(editingMatch.date)}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-8">
            {/* Type de match */}
            <div>
              <label htmlFor="type" className="block font-semibold mb-2 text-cyan-300">
                Type de match
              </label>
              <select
                id="type"
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                {matchTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "officiel" ? "Match Officiel" : "Match Amical"}
                  </option>
                ))}
              </select>
            </div>

            {/* Lieu du match */}
            <div>
              <label htmlFor="place" className="block font-semibold mb-2 text-cyan-300">
                Lieu (Domicile / Extérieur)
              </label>
              <select
                id="place"
                name="place"
                value={form.place}
                onChange={handleChange}
                className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              >
                <option value="">Sélectionnez un lieu</option>
                <option value="domicile">Domicile</option>
                <option value="extérieur">Extérieur</option>
              </select>
            </div>

            {/* Équipe adverse */}
            <div>
              <label htmlFor="opponent" className="block font-semibold mb-2 text-cyan-300">
                Équipe adverse
              </label>
              <input
                type="text"
                id="opponent"
                name="opponent"
                value={form.opponent}
                onChange={handleChange}
                placeholder="Nom du club adverse"
                className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date */}
              <div>
                <label htmlFor="date" className="block font-semibold mb-2 text-cyan-300">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>

              {/* Heure */}
              <div>
                <label htmlFor="time" className="block font-semibold mb-2 text-cyan-300">
                  Heure
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  required
                />
              </div>
            </div>

            {/* Nom du stade */}
            <div>
              <label htmlFor="location" className="block font-semibold mb-2 text-cyan-300">
                Nom du stade ou lieu exact
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Ex : Stade Municipal"
                className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                required
              />
            </div>

            {/* Boutons */}
            <div className="flex gap-4">
              {editingMatch && (
                <motion.button
                  type="button"
                  onClick={handleCancelEdit}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gray-600 hover:bg-gray-500 transition-colors text-white font-bold py-3 rounded-xl"
                >
                  Annuler
                </motion.button>
              )}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 transition-colors text-black font-bold py-3 rounded-xl shadow-lg shadow-cyan-600/50"
              >
                {isSubmitting
                  ? "Enregistrement..."
                  : editingMatch
                  ? "💾 Enregistrer les modifications"
                  : "🚀 Programmer"}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Modal de confirmation suppression */}
      {deleteModalOpen && matchToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 border border-red-500/50 rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-red-400 mb-4">
              Confirmer la suppression
            </h3>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir supprimer le match contre{" "}
              <span className="font-bold text-white">{matchToDelete.opponent}</span> prévu
              le {formatDate(matchToDelete.date)} ?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setMatchToDelete(null);
                }}
                className="flex-1 bg-gray-600 hover:bg-gray-500 transition-colors text-white font-bold py-2 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 hover:bg-red-500 transition-colors text-white font-bold py-2 rounded-lg"
              >
                Supprimer
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}