import { useState, useEffect } from "react";
import { CalendarDaysIcon } from "lucide-react";

export default function CarteDernierDerby() {
  const [dernierDerby, setDernierDerby] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/derbys/last")
      .then((res) => res.json())
      .then((data) => {
        setDernierDerby(data.date);
        setLoading(false);
      })
      .catch(() => {
        setDernierDerby(null);
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
    <div className="p-6 flex flex-col items-start h-full">
      <CalendarDaysIcon className="h-10 w-10 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
      <h2 className="text-xl font-semibold mb-2 text-white">
        Nouveau Tirage
      </h2>
      <p className="text-gray-400 mb-4">
        Créer un nouveau tirage d&apos;équipes
      </p>
      <p className="text-sm text-gray-500">
        Dernier derby : {loading ? "Chargement..." : formatDate(dernierDerby)}
      </p>
    </div>
  );
}
