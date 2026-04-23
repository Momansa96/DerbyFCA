"use client";

import { motion } from "framer-motion";
import { User, Plus } from "lucide-react";

export type FormationPosition = "GK" | "DEF" | "MID" | "ATT_L" | "ATT_R";

export type SlotPlayer = {
  id: string;
  fullName: string;
  alias?: string | null;
  profilePhoto?: string | null;
  number?: number | null;
};

export type FormationSlots = Partial<Record<FormationPosition, SlotPlayer | null>>;

type Props = {
  slots: FormationSlots;
  editable?: boolean;
  onSlotClick?: (position: FormationPosition) => void;
  theme?: "dark" | "light";
  opponentLabel?: string;
};

const POSITIONS: Array<{
  key: FormationPosition;
  label: string;
  top: string;
  left: string;
}> = [
  { key: "ATT_L", label: "ATT", top: "18%", left: "30%" },
  { key: "ATT_R", label: "ATT", top: "18%", left: "70%" },
  { key: "MID", label: "MIL", top: "45%", left: "50%" },
  { key: "DEF", label: "DEF", top: "68%", left: "50%" },
  { key: "GK", label: "GB", top: "88%", left: "50%" },
];

export default function FormationField({
  slots,
  editable = false,
  onSlotClick,
  theme = "light",
  opponentLabel,
}: Props) {
  const isDark = theme === "dark";

  return (
    <div
      className={`relative w-full mx-auto rounded-2xl overflow-hidden shadow-lg ${
        isDark
          ? "bg-gradient-to-b from-green-800 to-green-900 border border-green-700/50"
          : "bg-gradient-to-b from-green-600 to-green-700 border border-green-800/30"
      }`}
      style={{ aspectRatio: "3/4", maxWidth: 420 }}
    >
      {/* Lignes du terrain */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Ligne de but adverse (haut) */}
        <div className="absolute top-[5%] left-[15%] right-[15%] h-[10%] border-2 border-white/40 border-b-0" />
        <div className="absolute top-[5%] left-[35%] right-[35%] h-[5%] border-2 border-white/40 border-b-0" />
        {/* Ligne médiane */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40" />
        <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/40" />
        <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60" />
        {/* Ligne de but FCA (bas) */}
        <div className="absolute bottom-[5%] left-[15%] right-[15%] h-[10%] border-2 border-white/40 border-t-0" />
        <div className="absolute bottom-[5%] left-[35%] right-[35%] h-[5%] border-2 border-white/40 border-t-0" />
        {/* Contour */}
        <div className="absolute inset-[2%] border-2 border-white/40 rounded-lg" />
      </div>

      {/* Label adversaire (haut) */}
      {opponentLabel && (
        <div className="absolute top-2 left-0 right-0 flex justify-center z-10">
          <span className="bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full border border-white/20">
            vs {opponentLabel}
          </span>
        </div>
      )}

      {/* Slots */}
      {POSITIONS.map((pos) => {
        const player = slots[pos.key] ?? null;
        return (
          <PlayerSlot
            key={pos.key}
            position={pos.key}
            label={pos.label}
            top={pos.top}
            left={pos.left}
            player={player}
            editable={editable}
            onClick={() => editable && onSlotClick?.(pos.key)}
          />
        );
      })}
    </div>
  );
}

function PlayerSlot({
  position,
  label,
  top,
  left,
  player,
  editable,
  onClick,
}: {
  position: FormationPosition;
  label: string;
  top: string;
  left: string;
  player: SlotPlayer | null;
  editable: boolean;
  onClick: () => void;
}) {
  const displayName = player?.alias || player?.fullName || "";
  const shortName = displayName.split(" ").slice(-1)[0] || displayName;

  return (
    <motion.button
      type="button"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      whileHover={editable ? { scale: 1.05 } : undefined}
      whileTap={editable ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={!editable}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group ${
        editable ? "cursor-pointer" : "cursor-default"
      }`}
      style={{ top, left }}
    >
      <div
        className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 flex items-center justify-center shadow-lg transition-all ${
          player
            ? "bg-white border-white"
            : "bg-black/30 border-white/60 border-dashed backdrop-blur-sm group-hover:bg-black/40"
        }`}
      >
        {player?.profilePhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={player.profilePhoto}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : player ? (
          <User className="w-7 h-7 text-gray-400" />
        ) : editable ? (
          <Plus className="w-6 h-6 text-white/80" />
        ) : (
          <User className="w-7 h-7 text-white/50" />
        )}

        {/* Badge position */}
        <span className="absolute -bottom-1 -right-1 bg-gradient-to-br from-cyan-500 to-indigo-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow">
          {label}
        </span>

        {/* Numéro maillot */}
        {player?.number != null && (
          <span className="absolute -top-1 -left-1 bg-white text-gray-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow border border-gray-200">
            {player.number}
          </span>
        )}
      </div>

      {/* Nom */}
      <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md max-w-[90px] truncate shadow">
        {player ? shortName : "Vide"}
      </span>
    </motion.button>
  );
}
