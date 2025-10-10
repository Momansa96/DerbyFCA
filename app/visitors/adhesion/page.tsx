"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TermsModal from "@/components/adhesion/TermsModal";

export default function AdhesionPage() {
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    lastName: "",
    firstName: "",
    email: "",
    whatsapp: "",
    profession: "",
    motivation: "",
    availability: "AVAILABLE",
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validation par étape
  const validateStep = (step: number) => {
    const errs: { [key: string]: string } = {};

    if (step === 1) {
      if (!form.lastName.trim()) errs.lastName = "Nom requis";
      if (!form.firstName.trim()) errs.firstName = "Prénom requis";
      if (!form.email.trim()) {
        errs.email = "Email requis";
      } else if (!/\S+@\S+\.\S+/.test(form.email)) {
        errs.email = "Email invalide";
      }
      if (!form.whatsapp.trim()) {
        errs.whatsapp = "Numéro WhatsApp requis";
      } else if (!/^\+[1-9]\d{1,14}$/.test(form.whatsapp.trim())) {
        errs.whatsapp = "Format invalide. Ex: +22912345678";
      }
      if (!form.profession.trim()) errs.profession = "Profession requise";
    }

    if (step === 2) {
      if (!form.motivation.trim()) {
        errs.motivation = "Motivation requise";
      } else if (form.motivation.trim().length < 20) {
        errs.motivation = "Minimum 20 caractères";
      }
    }

    if (step === 3) {
      if (!form.acceptedTerms) {
        errs.acceptedTerms = "Vous devez accepter les conditions";
      }
    }

    return errs;
  };

  const nextStep = () => {
    const stepErrors = validateStep(currentStep);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    setCurrentStep(prev => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setErrors({});
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });

    // Effacer l'erreur du champ modifié
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const errs: { [key: string]: string } = {};

    if (!form.lastName.trim()) errs.lastName = "Nom requis";
    if (!form.firstName.trim()) errs.firstName = "Prénom requis";
    if (!form.email.trim()) {
      errs.email = "Email requis";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Email invalide";
    }

    // Validation WhatsApp (format international E.164)
    if (!form.whatsapp.trim()) {
      errs.whatsapp = "Numéro WhatsApp requis";
    } else if (!/^\+[1-9]\d{1,14}$/.test(form.whatsapp.trim())) {
      errs.whatsapp = "Format invalide. Ex: +22912345678";
    }

    if (!form.profession.trim()) errs.profession = "Profession requise";
    if (!form.motivation.trim()) {
      errs.motivation = "Motivation requise";
    } else if (form.motivation.trim().length < 20) {
      errs.motivation = "Minimum 20 caractères";
    }
    if (!form.acceptedTerms) {
      errs.acceptedTerms = "Vous devez accepter les conditions";
    }

    return errs;
  };

  const handleTermsAccept = () => {
    setForm({ ...form, acceptedTerms: true });
    setErrors({ ...errors, acceptedTerms: "" });
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
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la soumission");
      }

      // Succès
      toast.success(
        `Votre demande a été envoyée avec succès ! Merci ${form.firstName}, nous examinerons votre candidature et vous contacterons bientôt via WhatsApp.`,
        { duration: 5000 }
      );

      // Réinitialiser le formulaire
      setForm({
        lastName: "",
        firstName: "",
        email: "",
        whatsapp: "",
        profession: "",
        motivation: "",
        availability: "AVAILABLE",
        acceptedTerms: false,
      });

      // Optionnel : rediriger vers la page d'accueil
      // router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la soumission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-cyan-600/20 via-indigo-600/20 to-purple-600/20 border-b border-cyan-500/20">
        <div className="absolute inset-0 bg-[url('/images/default.jpeg')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-full px-4 py-2 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-sm font-semibold text-cyan-300">Recrutement ouvert</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Rejoignez le <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">FCA</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Intégrez une communauté passionnée de football à Atrokpocodji. Développez vos compétences, créez des liens et vivez l&apos;esprit d&apos;équipe.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-cyan-400 mb-1">50+</div>
                <div className="text-xs sm:text-sm text-gray-400">Membres actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-indigo-400 mb-1">10+</div>
                <div className="text-xs sm:text-sm text-gray-400">Matchs/mois</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-purple-400 mb-1">5ans</div>
                <div className="text-xs sm:text-sm text-gray-400">D&apos;expérience</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-700/50 rounded-full px-4 py-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">Entraînements réguliers</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-700/50 rounded-full px-4 py-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">Équipement fourni</span>
              </div>
              <div className="flex items-center gap-2 bg-gray-900/50 border border-gray-700/50 rounded-full px-4 py-2">
                <span className="text-green-400">✓</span>
                <span className="text-gray-300">Ambiance conviviale</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Pricing Card */}
        <div className="mb-8 bg-gradient-to-br from-emerald-500/10 via-cyan-500/10 to-blue-500/10 border border-emerald-500/30 rounded-2xl p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 rounded-full px-4 py-1.5 mb-4">
              <span className="text-emerald-400 text-sm font-bold">💰 Tarifs transparents</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Adhésion accessible</h2>
            <p className="text-gray-400 text-sm">Rejoignez-nous sans surprise, tout est inclus</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Frais d'adhésion */}
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wide mb-1">Frais unique</div>
                  <div className="text-3xl font-black text-white">2000<span className="text-lg text-gray-400 ml-1">FCFA</span></div>
                </div>
                <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg">🎫</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Frais d&apos;inscription à vie</p>
            </div>

            {/* Cotisation */}
            <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wide mb-1">Par semaine</div>
                  <div className="text-3xl font-black text-white">200<span className="text-lg text-gray-400 ml-1">FCFA</span></div>
                </div>
                <div className="w-10 h-10 bg-cyan-500/20 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg">📅</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Cotisation hebdomadaire</p>
            </div>
          </div>

          {/* Ce qui est inclus */}
          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Maillot officiel</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Accès aux matchs</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-green-400">✓</span>
              <span>Entraînements</span>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${currentStep >= 1 ? 'bg-cyan-500 border-cyan-500' : 'bg-gray-800 border-gray-700'}`}>
                {currentStep > 1 ? (
                  <span className="text-white text-sm">✓</span>
                ) : (
                  <span className="text-white font-bold text-sm">1</span>
                )}
              </div>
              <div className="ml-2 mr-4">
                <div className={`text-xs font-semibold ${currentStep >= 1 ? 'text-cyan-400' : 'text-gray-500'}`}>
                  Informations
                </div>
              </div>
            </div>

            {/* Line 1-2 */}
            <div className={`flex-1 h-0.5 max-w-[60px] sm:max-w-[100px] transition-all ${currentStep >= 2 ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>

            {/* Step 2 */}
            <div className="flex items-center mx-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${currentStep >= 2 ? 'bg-indigo-500 border-indigo-500' : 'bg-gray-800 border-gray-700'}`}>
                {currentStep > 2 ? (
                  <span className="text-white text-sm">✓</span>
                ) : (
                  <span className={`font-bold text-sm ${currentStep >= 2 ? 'text-white' : 'text-gray-500'}`}>2</span>
                )}
              </div>
              <div className="ml-2">
                <div className={`text-xs font-semibold ${currentStep >= 2 ? 'text-indigo-400' : 'text-gray-500'}`}>
                  Football
                </div>
              </div>
            </div>

            {/* Line 2-3 */}
            <div className={`flex-1 h-0.5 max-w-[60px] sm:max-w-[100px] transition-all ${currentStep >= 3 ? 'bg-purple-500' : 'bg-gray-700'}`}></div>

            {/* Step 3 */}
            <div className="flex items-center ml-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${currentStep >= 3 ? 'bg-purple-500 border-purple-500' : 'bg-gray-800 border-gray-700'}`}>
                {currentStep >= 3 ? (
                  <span className="text-white text-sm">✓</span>
                ) : (
                  <span className={`font-bold text-sm ${currentStep >= 3 ? 'text-white' : 'text-gray-500'}`}>3</span>
                )}
              </div>
              <div className="ml-2">
                <div className={`text-xs font-semibold ${currentStep >= 3 ? 'text-purple-400' : 'text-gray-500'}`}>
                  Validation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-br from-gray-800/40 to-gray-900/20 border border-gray-700/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8"
        >
          {/* Étape 1: Informations personnelles */}
          {currentStep === 1 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">📋</span>
              </div>
              <h2 className="text-xl font-black text-white">Informations personnelles</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-semibold text-gray-300">
                  Nom *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-900/50 border ${errors.lastName ? "border-red-500/50" : "border-gray-700/50"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
                  disabled={isSubmitting}
                />
                {errors.lastName && <p className="text-red-400 text-xs mt-1.5">{errors.lastName}</p>}
              </div>

              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-semibold text-gray-300">
                  Prénom *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-900/50 border ${errors.firstName ? "border-red-500/50" : "border-gray-700/50"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
                  disabled={isSubmitting}
                />
                {errors.firstName && <p className="text-red-400 text-xs mt-1.5">{errors.firstName}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-300">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-900/50 border ${errors.email ? "border-red-500/50" : "border-gray-700/50"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="whatsapp" className="block mb-2 text-sm font-semibold text-gray-300">
                  WhatsApp (actif) *
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="+229 XX XX XX XX"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-900/50 border ${errors.whatsapp ? "border-red-500/50" : "border-gray-700/50"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
                  disabled={isSubmitting}
                />
                {errors.whatsapp && <p className="text-red-400 text-xs mt-1.5">{errors.whatsapp}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="profession" className="block mb-2 text-sm font-semibold text-gray-300">
                Profession *
              </label>
              <input
                id="profession"
                name="profession"
                type="text"
                placeholder="Ex: Étudiant, Développeur, Commerçant..."
                value={form.profession}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900/50 border ${errors.profession ? "border-red-500/50" : "border-gray-700/50"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all`}
                disabled={isSubmitting}
              />
              {errors.profession && <p className="text-red-400 text-xs mt-1.5">{errors.profession}</p>}
            </div>
          </section>
          )}

          {/* Étape 2: Football */}
          {currentStep === 2 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 border border-indigo-500/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚽</span>
              </div>
              <h2 className="text-xl font-black text-white">Football</h2>
            </div>

            <div>
              <label htmlFor="motivation" className="block mb-2 text-sm font-semibold text-gray-300">
                Pourquoi souhaitez-vous rejoindre le FCA ? *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows={5}
                placeholder="Parlez-nous de vos motivations, votre expérience footballistique, vos objectifs..."
                value={form.motivation}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-900/50 border ${errors.motivation ? "border-red-500/50" : "border-gray-700/50"} rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none`}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                {form.motivation.length}/20 caractères minimum
              </p>
              {errors.motivation && <p className="text-red-400 text-xs mt-1.5">{errors.motivation}</p>}
            </div>

            <div className="mt-6">
              <label className="block mb-3 text-sm font-semibold text-gray-300">
                Disponibilité le samedi (jour des matchs) *
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 transition-all">
                  <input
                    type="radio"
                    name="availability"
                    value="AVAILABLE"
                    checked={form.availability === "AVAILABLE"}
                    onChange={handleChange}
                    className="w-4 h-4 text-cyan-500 bg-gray-900 border-gray-700 focus:ring-cyan-500 focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-white">✅ Oui, je suis disponible</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 transition-all">
                  <input
                    type="radio"
                    name="availability"
                    value="SOMETIMES"
                    checked={form.availability === "SOMETIMES"}
                    onChange={handleChange}
                    className="w-4 h-4 text-cyan-500 bg-gray-900 border-gray-700 focus:ring-cyan-500 focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-white">⚠️ Parfois disponible</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-3 transition-all">
                  <input
                    type="radio"
                    name="availability"
                    value="NOT_AVAILABLE"
                    checked={form.availability === "NOT_AVAILABLE"}
                    onChange={handleChange}
                    className="w-4 h-4 text-cyan-500 bg-gray-900 border-gray-700 focus:ring-cyan-500 focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <span className="text-sm text-white">❌ Non, pas disponible</span>
                </label>
              </div>
            </div>
          </section>
          )}

          {/* Étape 3: Conditions */}
          {currentStep === 3 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-lg flex items-center justify-center">
                <span className="text-lg">📜</span>
              </div>
              <h2 className="text-xl font-black text-white">Conditions d&apos;adhésion</h2>
            </div>

            <div className="bg-gradient-to-br from-gray-900/50 to-gray-900/30 border border-gray-700/50 rounded-xl p-5 mb-6">
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline transition-colors"
              >
                📖 Lire les conditions d&apos;adhésion
              </button>
              <p className="text-sm text-gray-400 mt-2">
                Frais: 2000 FCFA | Cotisation: 200 FCFA/semaine
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer bg-gray-900/30 hover:bg-gray-900/50 border border-gray-700/50 rounded-xl px-4 py-4 transition-all">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={form.acceptedTerms}
                onChange={handleChange}
                className={`w-5 h-5 mt-0.5 rounded border-2 ${errors.acceptedTerms ? "border-red-500/50" : "border-gray-700"} bg-gray-900 text-cyan-500 focus:ring-2 focus:ring-cyan-500/50 transition-all`}
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-300">
                J&apos;ai lu et j&apos;accepte les conditions d&apos;adhésion, les règles du club et le règlement intérieur
              </span>
            </label>
            {errors.acceptedTerms && (
              <p className="text-red-400 text-xs mt-2">{errors.acceptedTerms}</p>
            )}
          </section>
          )}

          {/* Boutons de navigation */}
          <div className="flex gap-4 pt-8 border-t border-gray-700/50 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700 text-white font-semibold rounded-xl transition-all"
              >
                ← Précédent
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold rounded-xl transition-all"
              >
                Suivant →
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Envoi en cours...
                  </span>
                ) : (
                  "✉️ Envoyer ma demande"
                )}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Modal conditions */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAccept}
      />

      {/* Toast notifications */}
      <Toaster position="top-right" />
    </div>
  );
}