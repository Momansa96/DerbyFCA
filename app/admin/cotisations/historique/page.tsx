"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Trash2, Edit } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';

interface Contribution {
  id: string;
  amountPaid: number;
  paymentDate: string;
  notes: string | null;
  player: {
    id: string;
    fullName: string;
    profilePhoto: string | null;
  };
  week: {
    year: number;
    weekNumber: number;
  };
}

export default function HistoriquePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchContributions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearFilter]);

  const fetchContributions = async () => {
    try {
      const response = await fetch(`/api/contributions?year=${yearFilter}`);
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setContributions(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de l\'historique');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, playerName: string) => {
    if (!confirm(`Supprimer la cotisation de ${playerName} ?`)) return;

    try {
      const response = await fetch(`/api/contributions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      toast.success('Cotisation supprimée avec succès');
      fetchContributions();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const filteredContributions = contributions.filter(c =>
    c.player.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin/cotisations')}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour au dashboard
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-indigo-500 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Historique des cotisations</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un joueur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(parseInt(e.target.value))}
                  className="px-4 py-2.5 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => new Date().getFullYear() - i).map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Joueur</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Semaine</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Montant</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Notes</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {filteredContributions.map((contrib, index) => (
                      <motion.tr
                        key={contrib.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-gray-800/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src={contrib.player.profilePhoto || '/images/avatar-default.png'}
                              alt={contrib.player.fullName}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <span className="font-medium text-white">{contrib.player.fullName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-300">
                          Semaine {contrib.week.weekNumber}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-cyan-400">{contrib.amountPaid} FCFA</span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">
                          {new Date(contrib.paymentDate).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-sm">
                          {contrib.notes || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(contrib.id, contrib.player.fullName)}
                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {filteredContributions.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Aucune cotisation trouvée
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}