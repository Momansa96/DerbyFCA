"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";
import { Users, Search, Eye, EyeOff, Calendar, FileText, TrendingUp } from "lucide-react";
import ApplicationCard from "@/components/adhesion/ApplicationCard";

interface Application {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  whatsapp: string;
  profession: string;
  motivation: string;
  availability: string;
  acceptedTerms: boolean;
  acceptedAt: Date | null;
  isViewed: boolean;
  viewedAt: Date | null;
  viewedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdhesionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [viewedFilter, setViewedFilter] = useState<string>("all"); // "all", "true", "false"

  // Protection de la page
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/sign-in");
    }
  }, [status, router]);

  // Debounce search (500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Charger les demandes
  const fetchApplications = async (page = 1) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      });

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      if (viewedFilter !== "all") {
        params.append("viewed", viewedFilter);
      }

      const res = await fetch(`/api/applications?${params.toString()}`);

      if (!res.ok) {
        throw new Error("Erreur lors du chargement");
      }

      const data = await res.json();
      setApplications(data.applications);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des demandes");
    } finally {
      setIsLoading(false);
    }
  };

  // Charger au montage et lors des changements de filtres
  useEffect(() => {
    if (status === "authenticated") {
      fetchApplications(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, debouncedSearch, viewedFilter]);

  // Gérer la mise à jour après marquage comme vue
  const handleMarkAsViewed = (id: string) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? { ...app, isViewed: true, viewedAt: new Date() }
          : app
      )
    );
  };

  // Navigation pagination
  const handlePageChange = (newPage: number) => {
    fetchApplications(newPage);
  };

  // Calculer les stats avec useMemo
  const stats = useMemo(() => {
    const newApps = applications.filter((a) => !a.isViewed).length;
    const viewedApps = applications.filter((a) => a.isViewed).length;
    const todayApps = applications.filter((a) => {
      const createdDate = new Date(a.createdAt);
      const today = new Date();
      return createdDate.toDateString() === today.toDateString();
    }).length;

    return {
      total: pagination.total,
      new: newApps,
      viewed: viewedApps,
      today: todayApps,
    };
  }, [applications, pagination.total]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0E27]">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Demandes d&apos;Adhésion</h1>
          </div>
          <p className="text-gray-400 text-sm">Gérez les demandes d&apos;adhésion au FCA</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span className="text-xs text-gray-400">Total</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.total}</div>
            <div className="text-xs text-gray-500 mt-1">Demandes reçues</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-orange-400" />
              <span className="text-xs text-gray-400">Nouvelles</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.new}</div>
            <div className="text-xs text-gray-500 mt-1">À traiter</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <EyeOff className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Vues</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.viewed}</div>
            <div className="text-xs text-gray-500 mt-1">Déjà traitées</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="text-xs text-gray-400">Aujourd&apos;hui</span>
            </div>
            <div className="text-2xl font-black text-white">{stats.today}</div>
            <div className="text-xs text-gray-500 mt-1">Nouvelles demandes</div>
          </motion.div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewedFilter("all")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                viewedFilter === "all"
                  ? "bg-cyan-500 text-black"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setViewedFilter("false")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                viewedFilter === "false"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
              }`}
            >
              Nouvelles
            </button>
            <button
              onClick={() => setViewedFilter("true")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                viewedFilter === "true"
                  ? "bg-green-500 text-white"
                  : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
              }`}
            >
              Vues
            </button>
          </div>
        </div>

        {/* Applications List */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-2xl">
            <Users className="mx-auto h-16 w-16 text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Aucune demande</h3>
            <p className="text-gray-400 text-sm">Aucune demande ne correspond aux critères</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application, index) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onMarkAsViewed={handleMarkAsViewed}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-700/50 rounded-xl p-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 rounded-lg bg-gray-800/50 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                ← Préc.
              </button>
              <span className="px-4 py-2 text-gray-300 font-semibold">
                Page {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 rounded-lg bg-gray-800/50 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
              >
                Suiv. →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}