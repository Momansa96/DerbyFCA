"use client";
import PlayerForm from "@/components/PlayerForm";

export default function NouveauJoueurPage() {
  const handleSubmit = async (data: any) => {
    const response = await fetch("/api/players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la création du joueur");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nouveau Joueur</h1>
      <PlayerForm onSubmit={handleSubmit} />
    </div>
  );
}