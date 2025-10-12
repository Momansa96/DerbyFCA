"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { validatePassword, getPasswordStrength, getPasswordStrengthLabel } from "@/lib/password-validation";
import { User, Mail, Lock, Shield, AlertCircle, Loader2, CheckCircle2, UserPlus } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    <div className="min-h-screen bg-[#0A0E27] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-cyan-500/50"
          >
            <UserPlus className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Créer un compte
          </h1>
          <p className="text-gray-400 text-sm">
            Rejoignez l&apos;administration du FCA
          </p>
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-2xl p-6 sm:p-8 backdrop-blur-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-gray-300 mb-2">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-900/50 border ${errors.fullName ? 'border-red-500/50' : 'border-gray-700/50'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="John Doe"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-4 py-3 bg-gray-900/50 border ${errors.email ? 'border-red-500/50' : 'border-gray-700/50'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="admin@fca.com"
                  required
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 bg-gray-900/50 border ${errors.password ? 'border-red-500/50' : 'border-gray-700/50'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <span className="text-xs">🙈</span> : <span className="text-xs">👁️</span>}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(passwordStrength / 4) * 100}%` }}
                        className={`h-full transition-all duration-300 ${
                          strengthInfo.color === "red" ? "bg-red-500" :
                          strengthInfo.color === "orange" ? "bg-orange-500" :
                          strengthInfo.color === "yellow" ? "bg-yellow-500" :
                          "bg-green-500"
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${
                      strengthInfo.color === "red" ? "text-red-400" :
                      strengthInfo.color === "orange" ? "text-orange-400" :
                      strengthInfo.color === "yellow" ? "text-yellow-400" :
                      "text-green-400"
                    }`}>
                      {strengthInfo.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Requis: 8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-300 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-11 pr-12 py-3 bg-gray-900/50 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-gray-700/50'} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <span className="text-xs">🙈</span> : <span className="text-xs">👁️</span>}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.confirmPassword}
                </p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
                <p className="text-green-400 text-xs mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Les mots de passe correspondent
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-6"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Création du compte...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Créer mon compte</span>
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 pt-6 border-t border-gray-700/50">
            <p className="text-center text-xs text-gray-500">
              En vous inscrivant, vous acceptez les conditions d&apos;utilisation
            </p>
          </div>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="inline-flex items-center gap-2 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>Vos données sont protégées</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}