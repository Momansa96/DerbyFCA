import { useState, useEffect } from "react";
import { FileText, AlertCircle } from "lucide-react";

export default function CarteAdhesions() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/applications/count")
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count);
        setLoading(false);
      })
      .catch(() => {
        setCount(null);
        setLoading(false);
      });
  }, []);

  return (
    <div className="card-body p-6 flex flex-col items-start relative">
      <FileText className="h-10 w-10 text-indigo-500 mb-3 group-hover:scale-110 transition-transform" />
      <h2 className="card-title text-xl font-semibold mb-2 text-gray-800">
        Adhésions
      </h2>
      <p className="text-gray-600 mb-4">Gérer les demandes d&apos;adhésion</p>
      <p className="text-sm text-gray-500">
        {loading ? (
          "Chargement..."
        ) : count !== null && count > 0 ? (
          <span className="flex items-center gap-1">
            <AlertCircle className="h-4 w-4 text-red-500 animate-pulse" />
            <strong className="text-red-600">{count} nouvelle{count > 1 ? "s" : ""}</strong>
          </span>
        ) : (
          "Aucune nouvelle demande"
        )}
      </p>
      {count !== null && count > 0 && (
        <span className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          {count}
        </span>
      )}
    </div>
  );
}