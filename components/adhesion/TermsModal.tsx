"use client";

import { useState, useRef, useEffect } from "react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Réinitialiser le scroll quand on ouvre le modal
  useEffect(() => {
    if (isOpen) {
      setHasScrolledToBottom(false);
      if (contentRef.current) {
        contentRef.current.scrollTop = 0;
      }
    }
  }, [isOpen]);

  // Détecter le scroll jusqu'en bas
  const handleScroll = () => {
    if (!contentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const isBottom = scrollHeight - scrollTop - clientHeight < 10; // 10px de marge

    if (isBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    onAccept();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-700">
            📜 Conditions d&apos;adhésion - FCA
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Content scrollable */}
        <div
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-6 space-y-6"
        >
          {/* Règles du club */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              ⚽ Règles du club
            </h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <strong>Respect et fair-play</strong> : Comportement exemplaire envers les coéquipiers, adversaires et arbitres</li>
              <li>• <strong>Solidarité</strong> : L&apos;esprit d&apos;équipe avant tout</li>
              <li>• <strong>Assiduité</strong> : Présence régulière aux entraînements et matchs</li>
              <li>• <strong>Ponctualité</strong> : Respecter les horaires fixés</li>
              <li>• <strong>Discipline</strong> : Suivre les consignes du bureau et des capitaines</li>
            </ul>
          </section>

          {/* Frais d'adhésion */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              💰 Frais et cotisations
            </h3>
            <div className="space-y-3">
              <div className="bg-cyan-50 border-l-4 border-cyan-500 p-4 rounded">
                <p className="font-semibold text-cyan-900">Frais d&apos;adhésion</p>
                <p className="text-2xl font-bold text-cyan-700">2000 FCFA</p>
                <p className="text-sm text-cyan-600">Paiement unique à l&apos;inscription</p>
              </div>
              <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
                <p className="font-semibold text-indigo-900">Cotisation hebdomadaire</p>
                <p className="text-2xl font-bold text-indigo-700">200 FCFA / semaine</p>
                <p className="text-sm text-indigo-600">À payer chaque semaine pour participer aux activités</p>
              </div>
            </div>
          </section>

          {/* Règlement intérieur */}
          <section>
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              📋 Règlement intérieur
            </h3>
            <div className="space-y-3 text-gray-700">
              <div>
                <h4 className="font-semibold">Article 1 - Adhésion</h4>
                <p className="text-sm">Toute adhésion est valable pour la saison en cours et doit être renouvelée chaque année.</p>
              </div>
              <div>
                <h4 className="font-semibold">Article 2 - Cotisations</h4>
                <p className="text-sm">Les cotisations hebdomadaires sont obligatoires. Trois semaines consécutives non payées entraînent une suspension temporaire.</p>
              </div>
              <div>
                <h4 className="font-semibold">Article 3 - Comportement</h4>
                <p className="text-sm">Tout comportement antisportif, violent ou irrespectueux peut entraîner une exclusion définitive après décision du bureau.</p>
              </div>
              <div>
                <h4 className="font-semibold">Article 4 - Matchs et entraînements</h4>
                <p className="text-sm">Les matchs se déroulent le samedi. La présence est fortement encouragée pour maintenir la cohésion de l&apos;équipe.</p>
              </div>
              <div>
                <h4 className="font-semibold">Article 5 - Matériel</h4>
                <p className="text-sm">Chaque joueur est responsable de son équipement personnel (chaussures, protège-tibias). Le club fournit les maillots.</p>
              </div>
              <div>
                <h4 className="font-semibold">Article 6 - Communication</h4>
                <p className="text-sm">Un groupe WhatsApp est utilisé pour les communications officielles. Tous les membres doivent y être actifs.</p>
              </div>
            </div>
          </section>

          {/* Avertissement scroll */}
          {!hasScrolledToBottom && (
            <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-transparent pt-8 pb-4 text-center">
              <p className="text-sm text-gray-500 animate-bounce">
                ⬇️ Faites défiler jusqu&apos;en bas pour continuer
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-xl">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
            >
              Annuler
            </button>
            <button
              onClick={handleAccept}
              disabled={!hasScrolledToBottom}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                hasScrolledToBottom
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {hasScrolledToBottom ? "✓ J&apos;ai lu et j&apos;accepte" : "Lisez jusqu&apos;en bas"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}