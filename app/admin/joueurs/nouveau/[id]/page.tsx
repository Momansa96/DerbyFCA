"use client";
import { useEffect, useState } from "react";
import PlayerForm from "@/components/PlayerForm";

export default function ModifierJoueurPage({
  params,
}: {
  params: { id: string };
}) {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await fetch(`/api/players/${params.id}`);
        if (!response.ok) throw new Error("Joueur non trouvé");
        const data = await response.json();
        setPlayer(data);
      } catch (error) {
        console.error("Erreur lors du chargement du joueur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayer();
  }, [params.id]);

  const handleSubmit = async (data: any) => {
    const response = await fetch(`/api/players/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la modification du joueur");
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!player) {
    return <div>Joueur non trouvé</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Modifier le Joueur</h1>
      <PlayerForm player={player} onSubmit={handleSubmit} />
    </div>
  );
}