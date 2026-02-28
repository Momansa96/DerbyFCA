"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

interface Week {
  id: string;
  year: number;
  weekNumber: number;
  weekStartDate: string;
  weekEndDate: string;
  amount: number;
  contributions: any[];
}

export default function SemainesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchWeeks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearFilter]);

  const fetchWeeks = async () => {
    try {
      const response = await fetch(`/api/contributions/weeks?year=${yearFilter}`);
      if (!response.ok) throw new Error('Erreur lors du chargement');
      const data = await response.json();
      setWeeks(data);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des semaines');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl sm:text-3xl font-black text-white">Gestion des semaines</h1>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            <div className="mb-6">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {weeks.map((week, index) => (
                <motion.div
                  key={week.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.02 }}
                  className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Semaine {week.weekNumber}</h3>
                      <p className="text-xs text-gray-400">{week.year}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Début</span>
                      <span className="text-white">
                        {new Date(week.weekStartDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fin</span>
                      <span className="text-white">
                        {new Date(week.weekEndDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Montant</span>
                      <span className="text-cyan-400 font-semibold">{week.amount} FCFA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Paiements</span>
                      <span className="text-white font-semibold">{week.contributions.length}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {weeks.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                Aucune semaine trouvée pour {yearFilter}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}