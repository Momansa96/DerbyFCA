"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TermsModal from "@/components/adhesion/TermsModal";
import {
  Check,
  Coins,
  Ticket,
  Calendar,
  ClipboardList,
  Trophy,
  FileText,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Send,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
    <div className="min-h-screen bg-surface text-secondary">
      {/* Hero Section */}
      <div className="bg-secondary">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-gray-600 rounded-full px-4 py-2 mb-6">
              <span className="inline-flex rounded-full h-2 w-2 bg-primary"></span>
              <span className="text-sm font-semibold text-gray-300">Recrutement ouvert</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 leading-tight">
              Rejoignez le <span className="text-primary">FCA</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              Intégrez une communauté passionnée de football à Atrokpocodji. Développez vos compétences, créez des liens et vivez l&apos;esprit d&apos;équipe.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-accent mb-1">50+</div>
                <div className="text-xs sm:text-sm text-gray-400">Membres actifs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-primary mb-1">10+</div>
                <div className="text-xs sm:text-sm text-gray-400">Matchs/mois</div>
              </div>
              <div className="text-center">
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">5ans</div>
                <div className="text-xs sm:text-sm text-gray-400">D&apos;expérience</div>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white/10 border border-gray-600 rounded-full px-4 py-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-gray-300">Entraînements réguliers</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-gray-600 rounded-full px-4 py-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-gray-300">Équipement fourni</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 border border-gray-600 rounded-full px-4 py-2">
                <Check className="w-4 h-4 text-primary" />
                <span className="text-gray-300">Ambiance conviviale</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Pricing Card */}
        <div className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-4">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-primary text-sm font-bold">Tarifs transparents</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-black text-secondary mb-2">Adhésion accessible</h2>
            <p className="text-gray-500 text-sm">Rejoignez-nous sans surprise, tout est inclus</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Frais d'adhésion */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Frais unique</div>
                  <div className="text-3xl font-black text-secondary">
                    <span className="text-primary">2000</span>
                    <span className="text-lg text-gray-400 ml-1">FCFA</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-gray-500">Frais d&apos;inscription à vie</p>
            </div>

            {/* Cotisation */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Par semaine</div>
                  <div className="text-3xl font-black text-secondary">
                    <span className="text-primary">200</span>
                    <span className="text-lg text-gray-400 ml-1">FCFA</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-gray-500">Cotisation hebdomadaire</p>
            </div>
          </div>

          {/* Ce qui est inclus */}
          <div className="mt-6 grid sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-4 h-4 text-primary" />
              <span>Maillot officiel</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-4 h-4 text-primary" />
              <span>Accès aux matchs</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-4 h-4 text-primary" />
              <span>Entraînements</span>
            </div>
          </div>
        </div>

        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${currentStep >= 1 ? 'bg-primary border-primary' : 'bg-gray-100 border-gray-300'}`}>
                {currentStep > 1 ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className="text-white font-bold text-sm">1</span>
                )}
              </div>
              <div className="ml-2 mr-4">
                <div className={`text-xs font-semibold ${currentStep >= 1 ? 'text-primary' : 'text-gray-400'}`}>
                  Informations
                </div>
              </div>
            </div>

            {/* Line 1-2 */}
            <div className={`flex-1 h-0.5 max-w-[60px] sm:max-w-[100px] transition-all ${currentStep >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>

            {/* Step 2 */}
            <div className="flex items-center mx-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${currentStep >= 2 ? 'bg-primary border-primary' : 'bg-gray-100 border-gray-300'}`}>
                {currentStep > 2 ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={`font-bold text-sm ${currentStep >= 2 ? 'text-white' : 'text-gray-400'}`}>2</span>
                )}
              </div>
              <div className="ml-2">
                <div className={`text-xs font-semibold ${currentStep >= 2 ? 'text-primary' : 'text-gray-400'}`}>
                  Football
                </div>
              </div>
            </div>

            {/* Line 2-3 */}
            <div className={`flex-1 h-0.5 max-w-[60px] sm:max-w-[100px] transition-all ${currentStep >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>

            {/* Step 3 */}
            <div className="flex items-center ml-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${currentStep >= 3 ? 'bg-primary border-primary' : 'bg-gray-100 border-gray-300'}`}>
                {currentStep >= 3 ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <span className={`font-bold text-sm ${currentStep >= 3 ? 'text-white' : 'text-gray-400'}`}>3</span>
                )}
              </div>
              <div className="ml-2">
                <div className={`text-xs font-semibold ${currentStep >= 3 ? 'text-primary' : 'text-gray-400'}`}>
                  Validation
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8"
        >
          {/* Étape 1: Informations personnelles */}
          {currentStep === 1 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-black text-secondary">Informations personnelles</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastName" className="block mb-2 text-sm font-semibold text-gray-700">
                  Nom *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border ${errors.lastName ? "border-red-400" : "border-gray-300"} rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                  disabled={isSubmitting}
                />
                {errors.lastName && <p className="text-red-600 text-xs mt-1.5">{errors.lastName}</p>}
              </div>

              <div>
                <label htmlFor="firstName" className="block mb-2 text-sm font-semibold text-gray-700">
                  Prénom *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border ${errors.firstName ? "border-red-400" : "border-gray-300"} rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                  disabled={isSubmitting}
                />
                {errors.firstName && <p className="text-red-600 text-xs mt-1.5">{errors.firstName}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-semibold text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border ${errors.email ? "border-red-400" : "border-gray-300"} rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-600 text-xs mt-1.5">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="whatsapp" className="block mb-2 text-sm font-semibold text-gray-700">
                  WhatsApp (actif) *
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="+229 XX XX XX XX"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border ${errors.whatsapp ? "border-red-400" : "border-gray-300"} rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                  disabled={isSubmitting}
                />
                {errors.whatsapp && <p className="text-red-600 text-xs mt-1.5">{errors.whatsapp}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="profession" className="block mb-2 text-sm font-semibold text-gray-700">
                Profession *
              </label>
              <input
                id="profession"
                name="profession"
                type="text"
                placeholder="Ex: Étudiant, Développeur, Commerçant..."
                value={form.profession}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${errors.profession ? "border-red-400" : "border-gray-300"} rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
                disabled={isSubmitting}
              />
              {errors.profession && <p className="text-red-600 text-xs mt-1.5">{errors.profession}</p>}
            </div>
          </section>
          )}

          {/* Étape 2: Football */}
          {currentStep === 2 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-black text-secondary">Football</h2>
            </div>

            <div>
              <label htmlFor="motivation" className="block mb-2 text-sm font-semibold text-gray-700">
                Pourquoi souhaitez-vous rejoindre le FCA ? *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows={5}
                placeholder="Parlez-nous de vos motivations, votre expérience footballistique, vos objectifs..."
                value={form.motivation}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border ${errors.motivation ? "border-red-400" : "border-gray-300"} rounded-xl text-secondary placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none`}
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                {form.motivation.length}/20 caractères minimum
              </p>
              {errors.motivation && <p className="text-red-600 text-xs mt-1.5">{errors.motivation}</p>}
            </div>

            <div className="mt-6">
              <label className="block mb-3 text-sm font-semibold text-gray-700">
                Disponibilité le samedi (jour des matchs) *
              </label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 transition-all">
                  <input
                    type="radio"
                    name="availability"
                    value="AVAILABLE"
                    checked={form.availability === "AVAILABLE"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-white border-gray-300 focus:ring-primary focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <span className="flex items-center gap-2 text-sm text-secondary">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    Oui, je suis disponible
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 transition-all">
                  <input
                    type="radio"
                    name="availability"
                    value="SOMETIMES"
                    checked={form.availability === "SOMETIMES"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-white border-gray-300 focus:ring-primary focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <span className="flex items-center gap-2 text-sm text-secondary">
                    <AlertTriangle className="w-4 h-4 text-accent-dark" />
                    Parfois disponible
                  </span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 transition-all">
                  <input
                    type="radio"
                    name="availability"
                    value="NOT_AVAILABLE"
                    checked={form.availability === "NOT_AVAILABLE"}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary bg-white border-gray-300 focus:ring-primary focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <span className="flex items-center gap-2 text-sm text-secondary">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Non, pas disponible
                  </span>
                </label>
              </div>
            </div>
          </section>
          )}

          {/* Étape 3: Conditions */}
          {currentStep === 3 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <h2 className="font-heading text-xl font-black text-secondary">Conditions d&apos;adhésion</h2>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="flex items-center gap-2 text-primary hover:text-primary-dark font-semibold underline transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Lire les conditions d&apos;adhésion
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Frais: 2000 FCFA | Cotisation: 200 FCFA/semaine
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-4 py-4 transition-all">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={form.acceptedTerms}
                onChange={handleChange}
                className={`w-5 h-5 mt-0.5 rounded border-2 ${errors.acceptedTerms ? "border-red-400" : "border-gray-300"} bg-white text-primary focus:ring-2 focus:ring-primary/50 transition-all`}
                disabled={isSubmitting}
              />
              <span className="text-sm text-gray-700">
                J&apos;ai lu et j&apos;accepte les conditions d&apos;adhésion, les règles du club et le règlement intérieur
              </span>
            </label>
            {errors.acceptedTerms && (
              <p className="text-red-600 text-xs mt-2">{errors.acceptedTerms}</p>
            )}
          </section>
          )}

          {/* Boutons de navigation */}
          <div className="flex gap-4 pt-8 border-t border-gray-200 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-secondary font-semibold rounded-xl transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl transition-all"
              >
                Suivant
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Envoi en cours...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Send className="w-4 h-4" />
                    Envoyer ma demande
                  </span>
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
