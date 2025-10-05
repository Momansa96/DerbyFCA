"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
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

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📋 Demandes d'adhésion
          </h1>
          <p className="text-gray-600">
            Gérez les demandes d'adhésion au FCA
          </p>
        </div>

        {/* Filtres */}
        <div className="card bg-base-100 shadow-md mb-6">
          <div className="card-body">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Recherche */}
              <div>
                <label htmlFor="search" className="block text-sm font-semibold mb-2">
                  🔍 Rechercher
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Nom, prénom, email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>

              {/* Filtre vue/non vue */}
              <div>
                <label htmlFor="viewedFilter" className="block text-sm font-semibold mb-2">
                  👁️ Statut
                </label>
                <select
                  id="viewedFilter"
                  value={viewedFilter}
                  onChange={(e) => setViewedFilter(e.target.value)}
                  className="select select-bordered w-full"
                >
                  <option value="all">Toutes les demandes</option>
                  <option value="false">Non vues uniquement</option>
                  <option value="true">Vues uniquement</option>
                </select>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex items-center gap-4 text-sm">
              <div className="badge badge-lg badge-primary">
                Total: {pagination.total}
              </div>
              <div className="badge badge-lg">
                Nouvelles: {applications.filter((a) => !a.isViewed).length}
              </div>
            </div>
          </div>
        </div>

        {/* Liste des demandes */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : applications.length === 0 ? (
          <div className="card bg-base-100 shadow-md">
            <div className="card-body text-center py-12">
              <p className="text-gray-500 text-lg">
                Aucune demande d'adhésion trouvée
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onMarkAsViewed={handleMarkAsViewed}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="join">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="join-item btn"
              >
                «
              </button>
              <button className="join-item btn">
                Page {pagination.page} / {pagination.totalPages}
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="join-item btn"
              >
                »
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