"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
    });
    setIsSubmitting(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect");
    } else {
      router.push("/admin");
      router.refresh(); // Rafraîchit la page pour mettre à jour l'état de la session
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-black px-4">
      <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl max-w-md w-full p-8 border border-indigo-400/30 space-y-6">
        <h1 className="text-3xl font-extrabold text-indigo-700 text-center mb-6">Connexion Administrateur</h1>

        <div>
          <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="input input-bordered w-full"
            required
            disabled={isSubmitting}
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting ? "Connexion en cours..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
