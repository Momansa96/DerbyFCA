import { useState, useEffect } from "react";
import { UsersIcon } from "lucide-react";

export default function CarteGestionJoueurs() {
  const [totalJoueurs, setTotalJoueurs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/players/count") 
      .then((res) => res.json())
      .then((data) => {
        setTotalJoueurs(data.count);
        setLoading(false);
      })
      .catch(() => {
        setTotalJoueurs(null);
        setLoading(false);
      });
  }, []);

  return (
    <div className="card-body p-6 flex flex-col items-start">
      <UsersIcon className="h-10 w-10 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
      <h2 className="card-title text-xl font-semibold mb-2 text-gray-800">
        Gestion des Joueurs
      </h2>
      <p className="text-gray-600 mb-4">Adhesion et Mise ajour Profil</p>
      <p className="text-sm text-gray-500">
        Total joueurs : {loading ? "Chargement..." : totalJoueurs}
      </p>
    </div>
  );
}
