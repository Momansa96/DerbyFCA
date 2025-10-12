"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Shield, ShieldOff, ShieldCheck, UserX, UserCheck, Clock, Calendar, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import toast, { Toaster } from "react-hot-toast";

interface User {
  id: string;
  fullName: string;
  email: string;
  status: string;
  revokedAt: string | null;
  revokedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UsersManagementPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; user: User | null; action: "revoke" | "activate" }>({
    open: false,
    user: null,
    action: "revoke",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Erreur lors du chargement");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!confirmModal.user) return;

    setIsSubmitting(true);
    try {
      const newStatus = confirmModal.action === "revoke" ? "REVOKED" : "ACTIVE";
      const res = await fetch(`/api/users/${confirmModal.user.id}/toggle-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast.success(
        confirmModal.action === "revoke"
          ? `${confirmModal.user.fullName} a été révoqué`
          : `${confirmModal.user.fullName} a été réactivé`
      );

      fetchUsers();
      setConfirmModal({ open: false, user: null, action: "revoke" });
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.status === "ACTIVE").length,
      revoked: users.filter(u => u.status === "REVOKED").length,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    return users
      .filter(u => {
        if (filterStatus !== "all" && u.status !== filterStatus) return false;
        if (searchQuery && !u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) && !u.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [users, filterStatus, searchQuery]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Gestion des Utilisateurs</h1>
          </div>
          <p className="text-gray-400 text-sm">Gérez les accès des administrateurs du FCA</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Utilisateurs</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Actifs</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.active}</div>
            <div className="text-xs text-gray-500 mt-1">Comptes actifs</div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ShieldOff className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">Révoqués</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.revoked}</div>
            <div className="text-xs text-gray-500 mt-1">Accès révoqués</div>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilterStatus("all")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === "all" ? "bg-cyan-500 text-black" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"}`}>
              Tous
            </button>
            <button onClick={() => setFilterStatus("ACTIVE")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === "ACTIVE" ? "bg-green-500 text-white" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"}`}>
              Actifs
            </button>
            <button onClick={() => setFilterStatus("REVOKED")} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filterStatus === "REVOKED" ? "bg-red-500 text-white" : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"}`}>
              Révoqués
            </button>
          </div>
        </div>

        {/* Users List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-2xl">
            <Users className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Aucun utilisateur</h3>
            <p className="text-gray-400 text-sm">Aucun utilisateur ne correspond aux critères</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-4 sm:p-5 hover:border-cyan-500/50 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Avatar & Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${user.status === "ACTIVE" ? "bg-green-500/20 border border-green-500/30" : "bg-red-500/20 border border-red-500/30"}`}>
                      {user.status === "ACTIVE" ? (
                        <ShieldCheck className="w-6 h-6 text-green-400" />
                      ) : (
                        <ShieldOff className="w-6 h-6 text-red-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white truncate">{user.fullName}</h3>
                        {session?.user?.id === user.id && (
                          <span className="inline-flex items-center gap-1 bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full">
                            <Shield className="w-3 h-3" />
                            Vous
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Inscrit le {formatDate(user.createdAt)}
                        </div>
                        {user.revokedAt && (
                          <div className="flex items-center gap-1 text-red-400">
                            <Clock className="w-3 h-3" />
                            Révoqué le {formatDate(user.revokedAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 sm:flex-shrink-0">
                    {user.status === "ACTIVE" ? (
                      <button
                        onClick={() => setConfirmModal({ open: true, user, action: "revoke" })}
                        disabled={session?.user?.id === user.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <UserX className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-semibold text-red-400">Révoquer</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setConfirmModal({ open: true, user, action: "activate" })}
                        className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-all"
                      >
                        <UserCheck className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-green-400">Réactiver</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.open && confirmModal.user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setConfirmModal({ open: false, user: null, action: "revoke" })}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={(e) => e.stopPropagation()} className={`bg-gray-900 border ${confirmModal.action === "revoke" ? "border-red-500/50" : "border-green-500/50"} rounded-2xl p-6 max-w-md w-full`}>
              <div className="flex items-start gap-3 mb-4">
                <div className={`p-2 rounded-lg ${confirmModal.action === "revoke" ? "bg-red-500/20" : "bg-green-500/20"}`}>
                  <AlertCircle className={`w-6 h-6 ${confirmModal.action === "revoke" ? "text-red-400" : "text-green-400"}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {confirmModal.action === "revoke" ? "Révoquer l'accès" : "Réactiver l'accès"}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {confirmModal.action === "revoke" ? (
                      <>
                        Êtes-vous sûr de vouloir révoquer l&apos;accès de{" "}
                        <span className="font-bold text-white">{confirmModal.user.fullName}</span> ?
                        <br />
                        <br />
                        Cette personne ne pourra plus se connecter à l&apos;administration.
                      </>
                    ) : (
                      <>
                        Confirmer la réactivation de{" "}
                        <span className="font-bold text-white">{confirmModal.user.fullName}</span> ?
                        <br />
                        <br />
                        Cette personne pourra à nouveau se connecter.
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal({ open: false, user: null, action: "revoke" })}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-lg font-bold transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleToggleStatus}
                  disabled={isSubmitting}
                  className={`flex-1 py-2.5 rounded-lg font-bold transition-colors disabled:opacity-50 ${
                    confirmModal.action === "revoke"
                      ? "bg-red-600 hover:bg-red-500"
                      : "bg-green-600 hover:bg-green-500"
                  }`}
                >
                  {isSubmitting ? "En cours..." : (confirmModal.action === "revoke" ? "Révoquer" : "Réactiver")}
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