"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Home,
  Plane,
  Users,
  Goal as GoalIcon,
  Plus,
  Trash2,
  Save,
  X,
  User as UserIcon,
  Trophy,
  Check,
} from "lucide-react";
import FormationField, {
  FormationPosition,
  FormationSlots,
  SlotPlayer,
} from "@/components/matchs/FormationField";

type Player = {
  id: string;
  fullName: string;
  alias?: string | null;
  profilePhoto?: string | null;
  number?: number | null;
};

type Composition = {
  id: string;
  playerId: string;
  role: "TITULAIRE" | "REMPLACANT";
  position: FormationPosition | null;
  player: Player;
};

type MatchGoal = {
  id: string;
  playerId: string;
  assistPlayerId: string | null;
  minute: number | null;
  player: Player;
  assistPlayer: Player | null;
};

type FriendlyMatch = {
  id: string;
  type: string;
  date: string;
  time: string;
  location: string;
  place: string;
  opponent: string;
  ourScore: number | null;
  opponentScore: number | null;
  status: string;
  notes: string | null;
  compositions: Composition[];
  goals: MatchGoal[];
};

type GoalDraft = {
  playerId: string;
  assistPlayerId: string;
  minute: string;
};

const POSITION_LABEL: Record<FormationPosition, string> = {
  GK: "Gardien",
  DEF: "Défenseur",
  MID: "Milieu",
  ATT_L: "Attaquant G",
  ATT_R: "Attaquant D",
};

export default function AdminMatchDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const matchId = params.id;

  const [match, setMatch] = useState<FriendlyMatch | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  // Composition state
  const [slots, setSlots] = useState<FormationSlots>({});
  const [remplacants, setRemplacants] = useState<SlotPlayer[]>([]);
  const [picker, setPicker] = useState<
    | { kind: "position"; position: FormationPosition }
    | { kind: "remplacant" }
    | null
  >(null);
  const [savingCompo, setSavingCompo] = useState(false);

  // Result state
  const [ourScore, setOurScore] = useState("");
  const [opponentScore, setOpponentScore] = useState("");
  const [notes, setNotes] = useState("");
  const [goals, setGoals] = useState<GoalDraft[]>([]);
  const [savingResult, setSavingResult] = useState(false);

  const [tab, setTab] = useState<"compo" | "result">("compo");

  useEffect(() => {
    if (!matchId) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [matchRes, playersRes] = await Promise.all([
        fetch(`/api/friendly-matches/${matchId}`),
        fetch(`/api/players`),
      ]);
      if (!matchRes.ok) throw new Error("Match introuvable");
      if (!playersRes.ok) throw new Error("Chargement joueurs échoué");
      const matchData: FriendlyMatch = await matchRes.json();
      const playersData: Player[] = await playersRes.json();
      setMatch(matchData);
      setPlayers(playersData);

      // Hydrater la compo
      const nextSlots: FormationSlots = {};
      const nextBench: SlotPlayer[] = [];
      for (const c of matchData.compositions) {
        const sp: SlotPlayer = {
          id: c.player.id,
          fullName: c.player.fullName,
          alias: c.player.alias,
          profilePhoto: c.player.profilePhoto,
          number: c.player.number,
        };
        if (c.role === "TITULAIRE" && c.position) {
          nextSlots[c.position] = sp;
        } else {
          nextBench.push(sp);
        }
      }
      setSlots(nextSlots);
      setRemplacants(nextBench);

      // Hydrater le résultat
      setOurScore(matchData.ourScore?.toString() ?? "");
      setOpponentScore(matchData.opponentScore?.toString() ?? "");
      setNotes(matchData.notes ?? "");
      setGoals(
        matchData.goals.map((g) => ({
          playerId: g.playerId,
          assistPlayerId: g.assistPlayerId ?? "",
          minute: g.minute?.toString() ?? "",
        }))
      );
    } catch (e: any) {
      toast.error(e.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  // Joueurs déjà sur le terrain ou sur le banc
  const usedPlayerIds = useMemo(() => {
    const set = new Set<string>();
    for (const p of Object.values(slots)) if (p) set.add(p.id);
    for (const r of remplacants) set.add(r.id);
    return set;
  }, [slots, remplacants]);

  const availableForPicker = useMemo(() => {
    return players.filter((p) => !usedPlayerIds.has(p.id));
  }, [players, usedPlayerIds]);

  const handleSlotClick = (position: FormationPosition) => {
    setPicker({ kind: "position", position });
  };

  const handlePickerSelect = (player: Player) => {
    if (!picker) return;
    const sp: SlotPlayer = {
      id: player.id,
      fullName: player.fullName,
      alias: player.alias,
      profilePhoto: player.profilePhoto,
      number: player.number,
    };
    if (picker.kind === "position") {
      setSlots((prev) => ({ ...prev, [picker.position]: sp }));
    } else {
      setRemplacants((prev) => [...prev, sp]);
    }
    setPicker(null);
  };

  const handleClearSlot = (position: FormationPosition) => {
    setSlots((prev) => {
      const next = { ...prev };
      delete next[position];
      return next;
    });
  };

  const handleRemoveRemplacant = (playerId: string) => {
    setRemplacants((prev) => prev.filter((r) => r.id !== playerId));
  };

  const handleSaveCompo = async () => {
    setSavingCompo(true);
    try {
      const entries = [
        ...(Object.entries(slots) as Array<[FormationPosition, SlotPlayer | null]>)
          .filter(([, p]) => p)
          .map(([position, p]) => ({
            playerId: p!.id,
            role: "TITULAIRE" as const,
            position,
          })),
        ...remplacants.map((r) => ({
          playerId: r.id,
          role: "REMPLACANT" as const,
          position: null,
        })),
      ];

      const res = await fetch(`/api/friendly-matches/${matchId}/composition`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast.success("Composition enregistrée");
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setSavingCompo(false);
    }
  };

  // === Résultat ===
  const ourScoreNum = parseInt(ourScore || "0", 10) || 0;
  const goalsExpected = ourScoreNum;

  const handleAddGoal = () => {
    setGoals((prev) => [...prev, { playerId: "", assistPlayerId: "", minute: "" }]);
  };

  const handleUpdateGoal = (index: number, field: keyof GoalDraft, value: string) => {
    setGoals((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
    );
  };

  const handleRemoveGoal = (index: number) => {
    setGoals((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveResult = async () => {
    if (ourScore === "" || opponentScore === "") {
      toast.error("Renseignez les deux scores");
      return;
    }
    if (goals.length !== goalsExpected) {
      toast.error(
        `${goalsExpected} buteur(s) attendu(s) mais ${goals.length} renseigné(s)`
      );
      return;
    }
    if (goals.some((g) => !g.playerId)) {
      toast.error("Chaque but doit avoir un buteur");
      return;
    }

    setSavingResult(true);
    try {
      const res = await fetch(`/api/friendly-matches/${matchId}/result`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ourScore: parseInt(ourScore, 10),
          opponentScore: parseInt(opponentScore, 10),
          notes: notes || null,
          status: "COMPLETED",
          goals: goals.map((g) => ({
            playerId: g.playerId,
            assistPlayerId: g.assistPlayerId || null,
            minute: g.minute ? parseInt(g.minute, 10) : null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      toast.success("Résultat enregistré");
      // refresh
      loadAll();
    } catch (e: any) {
      toast.error(e.message || "Erreur");
    } finally {
      setSavingResult(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center text-white">
        Match introuvable
      </div>
    );
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

  // Liste de joueurs autorisés dans le select buteur : titulaires + remplaçants uniquement
  const playersOnSheet: Player[] = [
    ...(Object.values(slots).filter(Boolean) as SlotPlayer[]),
    ...remplacants,
  ].map((sp) => ({
    id: sp.id,
    fullName: sp.fullName,
    alias: sp.alias,
    profilePhoto: sp.profilePhoto,
    number: sp.number,
  }));

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white pt-4 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <Link
          href="/admin/matches"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux matchs
        </Link>

        <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-2xl p-5 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    match.type === "officiel"
                      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                      : "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  }`}
                >
                  {match.type === "officiel" ? "Match Officiel" : "Match Amical"}
                </span>
                {match.place === "domicile" ? (
                  <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                    <Home className="w-3.5 h-3.5" /> Domicile
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-orange-400 text-xs">
                    <Plane className="w-3.5 h-3.5" /> Extérieur
                  </span>
                )}
                {match.status === "COMPLETED" && (
                  <span className="px-2 py-0.5 rounded-md bg-green-500/15 border border-green-500/40 text-green-400 text-xs font-bold">
                    TERMINÉ
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">
                FCA vs {match.opponent}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {formatDate(match.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {match.time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" /> {match.location}
                </span>
              </div>
            </div>

            {match.status === "COMPLETED" &&
              match.ourScore != null &&
              match.opponentScore != null && (
                <div className="flex items-center gap-2 self-start">
                  <div className="text-center px-4 py-3 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 border border-cyan-500/30 rounded-xl">
                    <div className="text-[10px] text-gray-400 mb-1 font-semibold">FCA</div>
                    <div className="text-3xl font-black text-white">{match.ourScore}</div>
                  </div>
                  <div className="text-gray-500 text-xl font-black">—</div>
                  <div className="text-center px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl">
                    <div className="text-[10px] text-gray-400 mb-1 font-semibold truncate max-w-[80px]">
                      {match.opponent}
                    </div>
                    <div className="text-3xl font-black text-white">{match.opponentScore}</div>
                  </div>
                </div>
              )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-900/50 border border-gray-800 rounded-xl p-1 w-fit">
          <button
            onClick={() => setTab("compo")}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              tab === "compo"
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            Composition
          </button>
          <button
            onClick={() => setTab("result")}
            className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              tab === "result"
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Résultat
          </button>
        </div>

        {/* === Tab Composition === */}
        {tab === "compo" && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Terrain */}
            <div>
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-3">
                Formation 1-1-2
              </h2>
              <FormationField
                slots={slots}
                editable
                onSlotClick={handleSlotClick}
                theme="dark"
                opponentLabel={match.opponent}
              />

              {/* Actions par slot (clear) */}
              <div className="mt-4 grid grid-cols-5 gap-2">
                {(["GK", "DEF", "MID", "ATT_L", "ATT_R"] as FormationPosition[]).map(
                  (pos) => (
                    <button
                      key={pos}
                      onClick={() => handleClearSlot(pos)}
                      disabled={!slots[pos]}
                      className="px-2 py-1.5 rounded-lg text-[10px] font-bold bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      × {POSITION_LABEL[pos]}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Remplaçants + save */}
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider">
                    Banc des remplaçants ({remplacants.length})
                  </h2>
                  <button
                    onClick={() => setPicker({ kind: "remplacant" })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter
                  </button>
                </div>

                {remplacants.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-6">
                    Aucun remplaçant
                  </p>
                ) : (
                  <div className="space-y-2">
                    {remplacants.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-3 bg-gray-800/40 border border-gray-700/50 rounded-lg p-2.5"
                      >
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 flex items-center justify-center">
                          {r.profilePhoto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.profilePhoto} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">{r.alias || r.fullName}</p>
                          {r.number != null && (
                            <p className="text-xs text-gray-500">#{r.number}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveRemplacant(r.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveCompo}
                disabled={savingCompo}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {savingCompo ? "Enregistrement..." : "Enregistrer la composition"}
              </button>
            </div>
          </div>
        )}

        {/* === Tab Résultat === */}
        {tab === "result" && (
          <div className="space-y-6">
            {playersOnSheet.length === 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-300 text-sm">
                ⚠️ Renseignez d'abord la composition pour pouvoir sélectionner les buteurs.
              </div>
            )}

            {/* Score */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-5">
              <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider mb-4">
                Score final
              </h2>
              <div className="flex items-center justify-center gap-6">
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-2 font-semibold">FCA</div>
                  <input
                    type="number"
                    min={0}
                    value={ourScore}
                    onChange={(e) => setOurScore(e.target.value)}
                    className="w-20 h-20 text-4xl font-black text-center bg-gray-800 border-2 border-cyan-500/40 rounded-2xl focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div className="text-gray-500 text-3xl font-black">—</div>
                <div className="text-center">
                  <div className="text-xs text-gray-400 mb-2 font-semibold truncate max-w-[120px]">
                    {match.opponent}
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={opponentScore}
                    onChange={(e) => setOpponentScore(e.target.value)}
                    className="w-20 h-20 text-4xl font-black text-center bg-gray-800 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Buteurs FCA */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-black text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <GoalIcon className="w-4 h-4" />
                  Buteurs FCA ({goals.length} / {goalsExpected})
                </h2>
                <button
                  onClick={handleAddGoal}
                  disabled={goals.length >= goalsExpected || playersOnSheet.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" /> But
                </button>
              </div>

              {goals.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-6">
                  {ourScoreNum === 0
                    ? "Aucun but FCA — rien à saisir"
                    : `Ajoutez ${goalsExpected} buteur(s)`}
                </p>
              ) : (
                <div className="space-y-3">
                  {goals.map((g, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[auto_1fr_1fr_auto_auto] gap-2 items-center bg-gray-800/40 border border-gray-700/50 rounded-lg p-2.5"
                    >
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-black flex items-center justify-center">
                        {i + 1}
                      </div>
                      <select
                        value={g.playerId}
                        onChange={(e) => handleUpdateGoal(i, "playerId", e.target.value)}
                        className="px-2 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500/50"
                      >
                        <option value="">Buteur...</option>
                        {playersOnSheet.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.alias || p.fullName}
                          </option>
                        ))}
                      </select>
                      <select
                        value={g.assistPlayerId}
                        onChange={(e) => handleUpdateGoal(i, "assistPlayerId", e.target.value)}
                        className="px-2 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50"
                      >
                        <option value="">Passeur (opt.)</option>
                        {playersOnSheet
                          .filter((p) => p.id !== g.playerId)
                          .map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.alias || p.fullName}
                            </option>
                          ))}
                      </select>
                      <input
                        type="number"
                        min={1}
                        max={120}
                        placeholder="min"
                        value={g.minute}
                        onChange={(e) => handleUpdateGoal(i, "minute", e.target.value)}
                        className="w-14 px-2 py-1.5 bg-gray-900 border border-gray-700 rounded-lg text-sm text-center text-white focus:outline-none focus:border-cyan-500/50"
                      />
                      <button
                        onClick={() => handleRemoveGoal(i)}
                        className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-xl p-5">
              <label className="block text-sm font-black text-gray-400 uppercase tracking-wider mb-3">
                Notes (optionnel)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Commentaires sur le match..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <button
              onClick={handleSaveResult}
              disabled={savingResult}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              {savingResult ? "Enregistrement..." : "Valider le résultat"}
            </button>
          </div>
        )}
      </div>

      {/* Player Picker */}
      <AnimatePresence>
        {picker && (
          <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4"
            onClick={() => setPicker(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 border-t sm:border border-cyan-500/30 rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[80vh] overflow-hidden flex flex-col"
            >
              <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
                <h3 className="font-black text-white">
                  {picker.kind === "position"
                    ? `Choisir un ${POSITION_LABEL[picker.position]}`
                    : "Ajouter un remplaçant"}
                </h3>
                <button
                  onClick={() => setPicker(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="overflow-y-auto p-4 space-y-2">
                {availableForPicker.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    Tous les joueurs sont déjà placés
                  </p>
                ) : (
                  availableForPicker.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePickerSelect(p)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800/60 hover:bg-cyan-500/10 border border-gray-700/50 hover:border-cyan-500/40 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex-shrink-0 flex items-center justify-center">
                        {p.profilePhoto ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.profilePhoto} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{p.alias || p.fullName}</p>
                        {p.alias && (
                          <p className="text-xs text-gray-500">{p.fullName}</p>
                        )}
                      </div>
                      {p.number != null && (
                        <span className="text-xs font-black bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded-md">
                          #{p.number}
                        </span>
                      )}
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Toaster position="top-right" />
    </div>
  );
}
