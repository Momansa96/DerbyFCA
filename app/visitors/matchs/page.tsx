"use client";
import { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion } from "framer-motion";
import {
  Handshake,
  Flame,
  Theater,
  X,
} from "lucide-react";

// Types
type Match = {
  id: string;
  date: string;
  time: string;
  location: string;
  type: "friendly" | "derby" | "exhibition";
};

// Utils
const formatDate = (dateStr: string) =>
  new Date(dateStr).toISOString().split("T")[0];

const typeLabels = {
  derby: "Derby",
  friendly: "Match Amical",
  exhibition: "Exhibition",
};

const typeIcons = {
  derby: <Flame className="text-cyan-500" size={28} />,
  friendly: <Handshake className="text-indigo-500" size={28} />,
  exhibition: <Theater className="text-purple-500" size={28} />,
};

const NoMatchMessage = ({ message }: { message: string }) => (
  <p className="italic text-gray-500">{message}</p>
);

export default function MatchsPage() {
  const [date, setDate] = useState(new Date());
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (match: Match) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMatch(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch("/api/friendly-matches");
        if (!res.ok) throw new Error("Erreur de chargement");
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        setError("Impossible de récupérer les matchs");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const todayStr = useMemo(
    () => new Date().toISOString().split("T")[0],
    []
  );
  const selectedStr = useMemo(
    () => date.toISOString().split("T")[0],
    [date]
  );

  const todayMatches = useMemo(
    () => matches.filter((m) => formatDate(m.date) === todayStr),
    [matches, todayStr]
  );
  const filteredMatches = useMemo(
    () => matches.filter((m) => formatDate(m.date) === selectedStr),
    [matches, selectedStr]
  );
  const upcomingMatches = useMemo(
    () => matches.filter((m) => new Date(m.date) > new Date()),
    [matches]
  );
  const pastMatches = useMemo(
    () => matches.filter((m) => new Date(m.date) < new Date()),
    [matches]
  );

  const renderMatchCard = (match: Match) => (
    <motion.div
      key={match.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden bg-white/70 backdrop-blur-md border border-cyan-200 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)] transition-shadow duration-300 hover:scale-105"
    >
      <div
        className={`absolute top-0 left-0 w-full h-2 ${
          match.type === "derby"
            ? "bg-cyan-400"
            : match.type === "friendly"
            ? "bg-indigo-400"
            : "bg-purple-400"
        }`}
      />
      <div className="p-4 pt-6">
        <div className="flex items-center gap-2 mb-2">
          {typeIcons[match.type]}
          <h3 className="font-bold text-cyan-700 text-lg">
            {typeLabels[match.type]}
          </h3>
        </div>
        <p className="flex items-center gap-2 text-gray-700">
          🗓 <strong>Date :</strong>{" "}
          {new Date(match.date).toLocaleDateString("fr-FR")}
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          ⏰ <strong>Heure :</strong> {match.time}
        </p>
        <p className="flex items-center gap-2 text-gray-700">
          📍 <strong>Lieu :</strong> {match.location}
        </p>
        <div className="mt-4 text-right">
          <button
            onClick={() => openModal(match)}
            className="px-4 py-2 text-sm font-semibold text-white bg-cyan-500 hover:bg-cyan-600 rounded-lg transition"
            aria-label="Voir les détails du match"
            title="Détails du match"
          >
            Détails
          </button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8 px-4 md:px-0 max-w-5xl mx-auto text-gray-800">
      <h1 className="text-4xl mt-4 font-extrabold text-cyan-600 drop-shadow-[0_0_10px_rgba(6,182,212,0.2)]">
        Calendrier des Matchs
      </h1>

      <button
        className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 transition rounded-md font-semibold text-white"
        onClick={() => setShowAllMatches((prev) => !prev)}
        aria-label="Afficher tous les matchs"
        title={showAllMatches ? "Filtrer par date" : "Voir tous les matchs"}
      >
        {showAllMatches ? "Filtrer par date" : "Voir tous les matchs"}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white/70 backdrop-blur-md border border-cyan-200 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <div className="p-6">
            <Calendar
              onChange={(value) => {
                if (value instanceof Date) setDate(value);
              }}
              value={date}
              className="rounded-xl border-none calendar-custom"
            />
          </div>
        </div>

        <div className="space-y-6">
          {loading && (
            <p className="text-cyan-500 animate-pulse">Chargement des matchs...</p>
          )}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && showAllMatches === false && (
            <>
              <h2 className="text-2xl font-semibold text-cyan-600">
                Matchs du{" "}
                {date.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </h2>
              {filteredMatches.length === 0 ? (
                <NoMatchMessage message="Aucun match pour cette date." />
              ) : (
                filteredMatches.map(renderMatchCard)
              )}
            </>
          )}

          {!loading && showAllMatches && (
            <>
              <h2 className="text-2xl font-semibold text-cyan-600">
                Matchs d&apos;aujourd&apos;hui
              </h2>
              {todayMatches.length === 0 ? (
                <NoMatchMessage message="Aucun match aujourd'hui." />
              ) : (
                todayMatches.map(renderMatchCard)
              )}

              <h2 className="text-2xl font-semibold text-cyan-600 mt-6">
                Matchs à venir
              </h2>
              {upcomingMatches.length === 0 ? (
                <NoMatchMessage message="Aucun match à venir." />
              ) : (
                upcomingMatches.map(renderMatchCard)
              )}

              <h2 className="text-2xl font-semibold text-cyan-600 mt-6">
                Matchs passés
              </h2>
              {pastMatches.length === 0 ? (
                <NoMatchMessage message="Aucun match passé." />
              ) : (
                pastMatches.map(renderMatchCard)
              )}
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        .calendar-custom {
          background: transparent;
          border: none;
          color: #0e1726;
          font-family: 'Inter', sans-serif;
        }
        .calendar-custom button {
          background: transparent;
          border: none;
          color: #0e1726;
          padding: 0.5rem;
          border-radius: 0.375rem;
          transition: background-color 0.3s ease;
        }
        .calendar-custom button:hover {
          background-color: rgba(6, 182, 212, 0.15);
          cursor: pointer;
        }
        .calendar-custom .react-calendar__tile--active {
          background: #06b6d4;
          color: white;
          border-radius: 0.5rem;
        }
        .calendar-custom .react-calendar__tile--now {
          border: 2px solid #06b6d4;
          border-radius: 0.5rem;
        }
      `}</style>

      {isModalOpen && selectedMatch && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white text-gray-800 rounded-xl p-6 max-w-md w-full border border-cyan-200 shadow-lg relative"
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-cyan-500 hover:text-cyan-700 text-2xl"
              aria-label="Fermer le modal"
            >
              <X size={28} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-cyan-600">
              Détails du Match
            </h2>
            <div className="flex items-center gap-2 mb-3">
              {typeIcons[selectedMatch.type]}
              <span className="font-semibold text-cyan-700">
                {typeLabels[selectedMatch.type]}
              </span>
            </div>
            <p>
              <strong>Date :</strong>{" "}
              {new Date(selectedMatch.date).toLocaleDateString("fr-FR")}
            </p>
            <p>
              <strong>Heure :</strong> {selectedMatch.time}
            </p>
            <p>
              <strong>Lieu :</strong> {selectedMatch.location}
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
