"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const matchTypes = ["officiel", "amical"];

export default function AdminMatchsPage() {
  const [form, setForm] = useState({
    type: matchTypes[0],
    date: "",
    time: "",
    location: "",
    place: "",      // <-- nouveau
    opponent: "",   // <-- nouveau
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!form.date || !form.time || !form.location || !form.place || !form.opponent) {
      alert("Veuillez remplir tous les champs.");
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      const res = await fetch("/api/friendly-matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Une erreur est survenue.");
        return;
      }
  
      alert(`Match ${form.type} programmé le ${form.date} à ${form.time}.`);
  
      setForm({
        type: matchTypes[0],
        date: "",
        time: "",
        location: "",
        place: "",
        opponent: "",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement.");
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white p-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-3xl p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-center mb-8 tracking-wider flex justify-center items-center gap-2">
          <Sparkles className="text-cyan-400 animate-pulse" /> Programmer un Match
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Type de match */}
          <div>
            <label htmlFor="type" className="block font-semibold mb-2 text-cyan-300">
              Type de match
            </label>
            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {matchTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "officiel" ? "Match Officiel" : "Match Amical"}
                </option>
              ))}
            </select>
          </div>

          {/* Lieu du match : Domicile / Extérieur */}
          <div>
            <label htmlFor="place" className="block font-semibold mb-2 text-cyan-300">
              Lieu (Domicile / Extérieur)
            </label>
            <select
              id="place"
              name="place"
              value={form.place}
              onChange={handleChange}
              className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            >
              <option value="">Sélectionnez un lieu</option>
              <option value="domicile">Domicile</option>
              <option value="extérieur">Extérieur</option>
            </select>
          </div>

          {/* Équipe adverse */}
          <div>
            <label htmlFor="opponent" className="block font-semibold mb-2 text-cyan-300">
              Équipe adverse
            </label>
            <input
              type="text"
              id="opponent"
              name="opponent"
              value={form.opponent}
              onChange={handleChange}
              placeholder="Nom du club adverse"
              className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block font-semibold mb-2 text-cyan-300">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Heure */}
          <div>
            <label htmlFor="time" className="block font-semibold mb-2 text-cyan-300">
              Heure
            </label>
            <input
              type="time"
              id="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Nom du stade */}
          <div>
            <label htmlFor="location" className="block font-semibold mb-2 text-cyan-300">
              Nom du stade ou lieu exact
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Ex : Stade Municipal"
              className="w-full bg-black/30 text-white border border-cyan-500 p-3 rounded-lg backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          {/* Bouton de soumission */}
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-cyan-500 hover:bg-cyan-400 transition-colors text-black font-bold py-3 rounded-xl shadow-lg shadow-cyan-600/50"
          >
            {isSubmitting ? "Enregistrement..." : "🚀 Programmer"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
