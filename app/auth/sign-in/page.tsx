"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!form.fullName.trim()) errs.fullName = "Nom complet requis";
    if (!form.email.trim()) errs.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Email invalide";
    if (form.password.length < 6) errs.password = "Mot de passe >= 6 caractères";
    if (form.confirmPassword !== form.password) errs.confirmPassword = "Mots de passe différents";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);

    try {
      // On ne prend que les champs nécessaires
      const { confirmPassword, ...formData } = form;
      
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Erreur inscription");
      }
      
      alert("Inscription réussie, connectez-vous !");
      setForm({ fullName: "", email: "", password: "", confirmPassword: "" });
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'inscription");
    } finally {
      setIsSubmitting(false);
    }
};

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-tr from-indigo-900 via-purple-900 to-black ">
      <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl max-w-md w-full p-8 border border-indigo-400/30 space-y-6">
        <h1 className="text-3xl font-extrabold text-indigo-700 text-center mb-6">Inscription Administrateur</h1>

        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block mb-1 font-semibold text-gray-700">Nom complet</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            value={form.fullName}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.fullName ? "input-error" : ""}`}
            disabled={isSubmitting}
            required
          />
          {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
            disabled={isSubmitting}
            required
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block mb-1 font-semibold text-gray-700">Mot de passe</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
            disabled={isSubmitting}
            required
            minLength={6}
          />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block mb-1 font-semibold text-gray-700">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`input input-bordered w-full ${errors.confirmPassword ? "input-error" : ""}`}
            disabled={isSubmitting}
            required
            minLength={6}
          />
          {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}
