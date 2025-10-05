"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { validatePassword, getPasswordStrength, getPasswordStrengthLabel } from "@/lib/password-validation";

export default function RegisterPage() {
  const router = useRouter();
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

    // Validation renforcée du mot de passe
    const passwordValidation = validatePassword(form.password);
    if (!passwordValidation.isValid) {
      errs.password = passwordValidation.errors.join(", ");
    }

    if (form.confirmPassword !== form.password) errs.confirmPassword = "Mots de passe différents";
    return errs;
  };

  // Calcul de la force du mot de passe
  const passwordStrength = getPasswordStrength(form.password);
  const strengthInfo = getPasswordStrengthLabel(passwordStrength);

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

      // Étape 1 : Inscription
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur inscription");
      }

      // Étape 2 : Auto-login après inscription réussie
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (loginResult?.error) {
        // Si l'auto-login échoue, rediriger vers la page de connexion
        alert("Inscription réussie ! Veuillez vous connecter.");
        router.push("/auth/sign-in");
      } else {
        // Auto-login réussi, rediriger vers l'admin
        router.push("/admin");
        router.refresh();
      }
    } catch (error: any) {
      alert(error.message || "Erreur lors de l'inscription");
      setIsSubmitting(false);
    }
    // Note : on ne met pas setIsSubmitting(false) en cas de succès car on redirige
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
            minLength={8}
          />

          {/* Indicateur de force du mot de passe */}
          {form.password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      strengthInfo.color === "red" ? "bg-red-500" :
                      strengthInfo.color === "orange" ? "bg-orange-500" :
                      strengthInfo.color === "yellow" ? "bg-yellow-500" :
                      "bg-green-500"
                    }`}
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  />
                </div>
                <span className={`text-xs font-medium ${
                  strengthInfo.color === "red" ? "text-red-600" :
                  strengthInfo.color === "orange" ? "text-orange-600" :
                  strengthInfo.color === "yellow" ? "text-yellow-600" :
                  "text-green-600"
                }`}>
                  {strengthInfo.label}
                </span>
              </div>
              <p className="text-xs text-gray-600">
                Requis: 8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre
              </p>
            </div>
          )}

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
            minLength={8}
          />
          {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting ? "Inscription et connexion..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}