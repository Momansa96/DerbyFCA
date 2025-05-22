import { useState, useEffect } from "react";
import {  Trophy } from "lucide-react";

export default function CarteProchainMatch() {
  const [nextMatchDate, setNextMatchDate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/friendly-matches/next-match")
      .then((res) => res.json())
      .then((data) => {
        setNextMatchDate(data.date);
        setLoading(false);
      })
      .catch(() => {
        setNextMatchDate(null);
        setLoading(false);
      });
  }, []);

  function formatDate(dateStr: string | null) {
    if (!dateStr) return "Non disponible";
    return new Date(dateStr).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="card-body p-6 flex flex-col items-start">
      <Trophy className="h-10 w-10 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
      <h2 className="card-title text-xl font-semibold mb-2 text-gray-800">
        Matchs
      </h2>
      <p className="text-gray-600 mb-4">Programmation des matchs</p>
      <p className="text-sm text-gray-500">
        Prochain match : {loading ? "Chargement..." : formatDate(nextMatchDate)}
      </p>
    </div>
  );
}
