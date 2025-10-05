"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import TermsModal from "@/components/adhesion/TermsModal";

export default function AdhesionPage() {
  const router = useRouter();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            ⚽ Rejoignez le FCA !
          </h1>
          <p className="text-xl text-cyan-200">
            Football Club Atrokpocodji - Demande d'adhésion
          </p>
        </div>

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-6"
        >
          {/* Informations personnelles */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">
              📋 Informations personnelles
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lastName" className="block mb-1 font-semibold text-gray-700">
                  Nom *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${errors.lastName ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
              </div>

              <div>
                <label htmlFor="firstName" className="block mb-1 font-semibold text-gray-700">
                  Prénom *
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${errors.firstName ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="email" className="block mb-1 font-semibold text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${errors.email ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="whatsapp" className="block mb-1 font-semibold text-gray-700">
                  WhatsApp (actif) *
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  placeholder="+229 XX XX XX XX"
                  value={form.whatsapp}
                  onChange={handleChange}
                  className={`input input-bordered w-full ${errors.whatsapp ? "border-red-500" : ""}`}
                  disabled={isSubmitting}
                />
                {errors.whatsapp && <p className="text-red-600 text-sm mt-1">{errors.whatsapp}</p>}
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="profession" className="block mb-1 font-semibold text-gray-700">
                Profession *
              </label>
              <input
                id="profession"
                name="profession"
                type="text"
                placeholder="Ex: Étudiant, Développeur, Commerçant..."
                value={form.profession}
                onChange={handleChange}
                className={`input input-bordered w-full ${errors.profession ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              {errors.profession && <p className="text-red-600 text-sm mt-1">{errors.profession}</p>}
            </div>
          </section>

          {/* Football */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">
              ⚽ Football
            </h2>

            <div>
              <label htmlFor="motivation" className="block mb-1 font-semibold text-gray-700">
                Pourquoi souhaitez-vous rejoindre le FCA ? *
              </label>
              <textarea
                id="motivation"
                name="motivation"
                rows={4}
                placeholder="Parlez-nous de vos motivations, votre expérience footballistique, vos objectifs..."
                value={form.motivation}
                onChange={handleChange}
                className={`textarea textarea-bordered w-full ${errors.motivation ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              <p className="text-sm text-gray-500 mt-1">
                {form.motivation.length}/20 caractères minimum
              </p>
              {errors.motivation && <p className="text-red-600 text-sm mt-1">{errors.motivation}</p>}
            </div>

            <div className="mt-4">
              <label htmlFor="availability" className="block mb-2 font-semibold text-gray-700">
                Disponibilité le samedi (jour des matchs) *
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    value="AVAILABLE"
                    checked={form.availability === "AVAILABLE"}
                    onChange={handleChange}
                    className="radio radio-primary"
                    disabled={isSubmitting}
                  />
                  <span className="text-gray-700">✅ Oui, je suis disponible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    value="SOMETIMES"
                    checked={form.availability === "SOMETIMES"}
                    onChange={handleChange}
                    className="radio radio-primary"
                    disabled={isSubmitting}
                  />
                  <span className="text-gray-700">⚠️ Parfois disponible</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="availability"
                    value="NOT_AVAILABLE"
                    checked={form.availability === "NOT_AVAILABLE"}
                    onChange={handleChange}
                    className="radio radio-primary"
                    disabled={isSubmitting}
                  />
                  <span className="text-gray-700">❌ Non, pas disponible</span>
                </label>
              </div>
            </div>
          </section>

          {/* Conditions */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-700 mb-4 border-b pb-2">
              📜 Conditions d'adhésion
            </h2>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <button
                type="button"
                onClick={() => setShowTermsModal(true)}
                className="text-indigo-600 hover:text-indigo-700 font-semibold underline"
              >
                📖 Lire les conditions d'adhésion
              </button>
              <p className="text-sm text-gray-600 mt-2">
                (Frais: 2000 FCFA | Cotisation: 200 FCFA/semaine)
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={form.acceptedTerms}
                onChange={handleChange}
                className={`checkbox checkbox-primary mt-1 ${errors.acceptedTerms ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
              <span className="text-gray-700">
                J'ai lu et j'accepte les conditions d'adhésion, les règles du club et le règlement intérieur
              </span>
            </label>
            {errors.acceptedTerms && (
              <p className="text-red-600 text-sm mt-2">{errors.acceptedTerms}</p>
            )}
          </section>

          {/* Bouton submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full text-lg py-3"
            >
              {isSubmitting ? "Envoi en cours..." : "✉️ Envoyer ma demande"}
            </button>
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