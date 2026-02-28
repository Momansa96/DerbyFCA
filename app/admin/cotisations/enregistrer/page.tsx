"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import {
  Save,
  ArrowLeft,
  Search,
  Calendar,
  CheckCircle
} from 'lucide-react';

interface Player {
  id: string;
  fullName: string;
  alias: string | null;
  profilePhoto: string | null;
  status: string;
}

interface Payment {
  playerId: string;
  paid: boolean;
  amount: number;
  notes: string;
  alreadyPaid: boolean;
}

export default function EnregistrerCotisationsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
  );
  const [payments, setPayments] = useState<Record<string, Payment>>({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      fetchAlreadyPaid(selectedDate);
    }
  }, [selectedDate, players]);

  const fetchPlayers = async () => {
    try {
      const playersRes = await fetch('/api/players');

      if (!playersRes.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const playersData = await playersRes.json();
      setPlayers(playersData.filter((p: Player) => p.status === 'ACTIF'));

      // Initialiser les paiements
      const initialPayments: Record<string, Payment> = {};
      playersData
        .filter((p: Player) => p.status === 'ACTIF')
        .forEach((player: Player) => {
          initialPayments[player.id] = {
            playerId: player.id,
            paid: false,
            amount: 200,
            notes: '',
            alreadyPaid: false
          };
        });
      setPayments(initialPayments);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlreadyPaid = async (date: string) => {
    try {
      const res = await fetch(`/api/contributions?date=${date}`);
      if (!res.ok) return;

      const contributions = await res.json();
      const paidPlayerIds = new Set(contributions.map((c: any) => c.playerId));

      setPayments(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(playerId => {
          updated[playerId] = {
            ...updated[playerId],
            alreadyPaid: paidPlayerIds.has(playerId),
            paid: false,
          };
        });
        return updated;
      });
    } catch (error) {
      console.error('Erreur lors de la vérification des paiements:', error);
    }
  };

  const togglePayment = (playerId: string) => {
    if (payments[playerId]?.alreadyPaid) return;
    setPayments(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        paid: !prev[playerId].paid
      }
    }));
  };

  const toggleAll = () => {
    const selectablePlayers = Object.values(payments).filter(p => !p.alreadyPaid);
    const allPaid = selectablePlayers.every(p => p.paid);
    const newPayments = { ...payments };
    Object.keys(newPayments).forEach(playerId => {
      if (!newPayments[playerId].alreadyPaid) {
        newPayments[playerId].paid = !allPaid;
      }
    });
    setPayments(newPayments);
  };

  const updateAmount = (playerId: string, amount: string) => {
    const numAmount = parseInt(amount) || 0;
    setPayments(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        amount: numAmount
      }
    }));
  };

  const updateNotes = (playerId: string, notes: string) => {
    setPayments(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        notes
      }
    }));
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    const paymentsToSave = Object.values(payments).filter(p => p.paid);

    if (paymentsToSave.length === 0) {
      toast.error('Veuillez sélectionner au moins un joueur');
      return;
    }

    const confirmMessage = `Enregistrer ${paymentsToSave.length} cotisation(s) pour le ${new Date(selectedDate).toLocaleDateString('fr-FR')} ?`;
    if (!confirm(confirmMessage)) {
      return;
    }

    setSaving(true);

    try {
      // Envoyer toutes les cotisations en UNE SEULE requête (mode batch)
      const response = await fetch('/api/contributions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          paymentsToSave.map(payment => ({
            playerId: payment.playerId,
            paymentDate: selectedDate,
            amountPaid: payment.amount,
            ...(payment.notes ? { notes: payment.notes } : {}),
          }))
        ),
      });

      if (response.ok) {
        const result = await response.json();
        const successCount = result.success || 0;
        const errorCount = result.errors || 0;

        if (successCount > 0) {
          toast.success(`${successCount} cotisation(s) enregistrée(s) avec succès`);
        }
        if (errorCount > 0) {
          toast.error(`${errorCount} erreur(s) - certains joueurs ont peut-être déjà payé cette semaine`);
        }

        // Rafraîchir les joueurs déjà payés pour cette date
        await fetchAlreadyPaid(selectedDate);
      } else {
        const error = await response.json();
        console.error('Erreur:', error);
        toast.error('Erreur lors de l\'enregistrement');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(false);
    }
  };

  const filteredPlayers = players.filter(player =>
    player.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (player.alias && player.alias.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const paidCount = Object.values(payments).filter(p => p.paid && !p.alreadyPaid).length;
  const alreadyPaidCount = Object.values(payments).filter(p => p.alreadyPaid).length;

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-20">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
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
            <h1 className="text-2xl sm:text-3xl font-black text-white">Enregistrer des paiements</h1>
          </div>
          <p className="text-gray-400 text-sm">
            Sélectionnez une date et cochez les membres qui ont payé
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        ) : (
          <>
            {/* Sélection de la date */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-6 mb-6"
            >
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Date de paiement
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">
                La semaine sera créée automatiquement selon cette date
              </p>
            </motion.div>

            {/* Recherche et actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-6 mb-6"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex-1 w-full relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un joueur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                <button
                  onClick={toggleAll}
                  className="px-4 py-3 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 rounded-lg text-indigo-400 font-semibold transition-all"
                >
                  {Object.values(payments).every(p => p.paid) ? 'Tout décocher' : 'Tout cocher'}
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
                <span>{paidCount} joueur(s) sélectionné(s) • Total : {Object.values(payments).filter(p => p.paid && !p.alreadyPaid).reduce((sum, p) => sum + p.amount, 0).toLocaleString()} FCFA</span>
                {alreadyPaidCount > 0 && (
                  <span className="text-green-400">{alreadyPaidCount} déjà payé(s) cette semaine</span>
                )}
              </div>
            </motion.div>

            {/* Liste des joueurs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-6 mb-6"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                Liste des joueurs ({filteredPlayers.length})
              </h2>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredPlayers.map((player, index) => {
                  const isAlreadyPaid = payments[player.id]?.alreadyPaid;

                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-4 rounded-lg border ${
                        isAlreadyPaid
                          ? 'bg-green-500/10 border-green-500/30 opacity-60'
                          : payments[player.id]?.paid
                            ? 'bg-cyan-500/10 border-cyan-500/30'
                            : 'bg-gray-900/30 border-gray-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Checkbox ou indicateur déjà payé */}
                        {isAlreadyPaid ? (
                          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                        ) : (
                          <input
                            type="checkbox"
                            checked={payments[player.id]?.paid}
                            onChange={() => togglePayment(player.id)}
                            className="w-5 h-5 rounded cursor-pointer"
                          />
                        )}

                      {/* Photo */}
                      <Image
                        src={player.profilePhoto || '/images/avatar-default.png'}
                        alt={player.fullName}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />

                      {/* Infos */}
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{player.fullName}</h3>
                        {player.alias && (
                          <p className="text-sm text-gray-400">&quot;{player.alias}&quot;</p>
                        )}
                        {isAlreadyPaid && (
                          <p className="text-xs text-green-400 font-medium mt-0.5">Déjà payé cette semaine</p>
                        )}
                      </div>

                      {/* Montant */}
                      {!isAlreadyPaid && (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={payments[player.id]?.amount || 200}
                            onChange={(e) => updateAmount(player.id, e.target.value)}
                            disabled={!payments[player.id]?.paid}
                            className="w-24 px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white text-center focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:opacity-50"
                          />
                          <span className="text-gray-400 text-sm">FCFA</span>
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {payments[player.id]?.paid && !isAlreadyPaid && (
                      <div className="mt-3 pl-12">
                        <input
                          type="text"
                          placeholder="Notes (optionnel)"
                          value={payments[player.id]?.notes || ''}
                          onChange={(e) => updateNotes(player.id, e.target.value)}
                          className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                        />
                      </div>
                    )}
                  </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Bouton d'enregistrement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-end gap-4"
            >
              <button
                onClick={() => router.push('/admin/cotisations')}
                className="px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg text-gray-300 font-semibold transition-all"
              >
                Annuler
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving || paidCount === 0}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Enregistrer {paidCount} cotisation(s)
                  </>
                )}
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}