"use client";

import { motion } from "framer-motion";
import { User, Plus, Shield } from "lucide-react";

export type FormationPosition = "GK" | "DEF" | "ATT_L" | "ATT_C" | "ATT_R";

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

const FORMATION_LABEL = "1-1-3";

// FCA dans sa moitié (50-100%), formation 5x5 : GK + DEF + 3 ATT alignés sur la médiane
const POSITIONS: Array<{
  key: FormationPosition;
  label: string;
  top: string;
  left: string;
  line: number;
}> = [
  { key: "ATT_L", label: "ATT", top: "55%", left: "22%", line: 2 },
  { key: "ATT_C", label: "ATT", top: "55%", left: "50%", line: 2 },
  { key: "ATT_R", label: "ATT", top: "55%", left: "78%", line: 2 },
  { key: "DEF", label: "DEF", top: "76%", left: "50%", line: 1 },
  { key: "GK", label: "GB", top: "92%", left: "50%", line: 0 },
];

// Adversaire en miroir dans sa moitié (0-50%), même formation 1-1-3
const OPPONENT_SILHOUETTES = [
  { key: "OPP_GK", top: "8%", left: "50%", size: 34 },
  { key: "OPP_DEF", top: "24%", left: "50%", size: 34 },
  { key: "OPP_ATT_L", top: "45%", left: "22%", size: 34 },
  { key: "OPP_ATT_C", top: "45%", left: "50%", size: 34 },
  { key: "OPP_ATT_R", top: "45%", left: "78%", size: 34 },
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
    <div className="w-full mx-auto" style={{ maxWidth: 460 }}>
      {/* Bandeau broadcast */}
      <div
        className={`rounded-t-2xl px-3 py-2 flex items-center justify-between gap-2 border-x border-t ${
          isDark
            ? "bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-gray-700/60"
            : "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-gray-800/60"
        }`}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-fca.jpeg"
            alt="FCA"
            className="w-7 h-7 rounded-full border-2 border-cyan-400/60 object-cover flex-shrink-0 shadow"
          />
          <span className="text-white text-xs font-black tracking-wider">FCA</span>
        </div>

        <div className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 flex-shrink-0">
          <span className="text-white text-[10px] font-black tracking-[0.2em]">
            {FORMATION_LABEL}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="text-white text-xs font-black tracking-wider truncate uppercase">
            {opponentLabel || "Adversaire"}
          </span>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-red-300/50 flex items-center justify-center flex-shrink-0 shadow">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      </div>

      {/* Terrain */}
      <div
        className="relative overflow-hidden rounded-b-2xl border-x border-b border-gray-800/60 shadow-2xl"
        style={{
          aspectRatio: "3/4",
          background: isDark
            ? `repeating-linear-gradient(180deg, #0f4d2a 0%, #0f4d2a 8.33%, #14633a 8.33%, #14633a 16.66%)`
            : `repeating-linear-gradient(180deg, #1a6e3e 0%, #1a6e3e 8.33%, #228b4f 8.33%, #228b4f 16.66%)`,
        }}
      >
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: "inset 0 0 80px rgba(0,0,0,0.45)" }}
        />

        {/* Lignes du terrain (SVG, dimensions logiques 300x400) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 300 400"
          preserveAspectRatio="none"
        >
          <g
            stroke="white"
            strokeOpacity="0.55"
            strokeWidth="1.4"
            fill="none"
            vectorEffect="non-scaling-stroke"
          >
            {/* Contour */}
            <rect x="6" y="6" width="288" height="388" rx="3" />
            {/* Ligne médiane */}
            <line x1="6" y1="200" x2="294" y2="200" />
            {/* Rond central */}
            <circle cx="150" cy="200" r="38" />
            {/* Surface adverse (haut) */}
            <rect x="60" y="6" width="180" height="46" />
            <rect x="105" y="6" width="90" height="18" />
            <path d="M 130 52 A 22 22 0 0 0 170 52" />
            {/* Surface FCA (bas) */}
            <rect x="60" y="348" width="180" height="46" />
            <rect x="105" y="376" width="90" height="18" />
            <path d="M 130 348 A 22 22 0 0 1 170 348" />
          </g>
          {/* Points (penalty + centre) */}
          <g fill="white" fillOpacity="0.7">
            <circle cx="150" cy="200" r="2" />
            <circle cx="150" cy="40" r="2" />
            <circle cx="150" cy="360" r="2" />
          </g>
        </svg>

        {/* Silhouettes adverses (matérialisation sans composition) */}
        {OPPONENT_SILHOUETTES.map((s, i) => (
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.06, duration: 0.4 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ top: s.top, left: s.left }}
          >
            <div
              className="rounded-full bg-gradient-to-br from-red-600 to-red-900 border-2 border-white/50 flex items-center justify-center shadow-lg"
              style={{ width: s.size, height: s.size }}
            >
              <Shield className="w-4 h-4 text-white/90" />
            </div>
          </motion.div>
        ))}

        {/* Joueurs FCA */}
        {POSITIONS.map((pos) => {
          const player = slots[pos.key] ?? null;
          return (
            <PlayerSlot
              key={pos.key}
              position={pos.key}
              label={pos.label}
              top={pos.top}
              left={pos.left}
              line={pos.line}
              player={player}
              editable={editable}
              onClick={() => editable && onSlotClick?.(pos.key)}
            />
          );
        })}
      </div>
    </div>
  );
}

function PlayerSlot({
  label,
  top,
  left,
  line,
  player,
  editable,
  onClick,
}: {
  position: FormationPosition;
  label: string;
  top: string;
  left: string;
  line: number;
  player: SlotPlayer | null;
  editable: boolean;
  onClick: () => void;
}) {
  const fullName = player?.fullName || "";
  const firstName = fullName.split(" ")[0] || fullName;
  const enterDelay = 0.15 + line * 0.1;

  return (
    <motion.button
      type="button"
      initial={{ scale: 0, opacity: 0, y: 12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 18,
        delay: enterDelay,
      }}
      whileHover={editable ? { scale: 1.06 } : { scale: 1.03 }}
      whileTap={editable ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={!editable}
      className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 group z-10 ${
        editable ? "cursor-pointer" : "cursor-default"
      }`}
      style={{ top, left }}
    >
      {/* Halo */}
      <div className="relative">
        <div
          className={`absolute inset-0 rounded-full blur-md transition-opacity ${
            player
              ? "bg-cyan-400/40 opacity-70 group-hover:opacity-100"
              : "bg-white/10 opacity-50"
          }`}
        />

        {/* Maillot (numéro) */}
        <div
          className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full border-[3px] flex items-center justify-center shadow-xl transition-all ${
            player
              ? "bg-gradient-to-br from-cyan-500 to-indigo-600 border-white"
              : "bg-black/40 border-white/70 border-dashed backdrop-blur-sm group-hover:bg-black/55 group-hover:border-white"
          }`}
        >
          {player ? (
            <span className="text-white text-base sm:text-lg font-black drop-shadow">
              {player.number ?? "—"}
            </span>
          ) : editable ? (
            <Plus className="w-5 h-5 text-white/85" />
          ) : (
            <User className="w-5 h-5 text-white/55" />
          )}

          {/* Badge position */}
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white text-gray-900 text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-md border border-gray-200 tracking-wider">
            {label}
          </span>
        </div>
      </div>

      {/* Prénom */}
      <span className="bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full max-w-[100px] truncate uppercase tracking-wide shadow-lg border border-white/20">
        {player ? firstName : "Vide"}
      </span>
    </motion.button>
  );
}
