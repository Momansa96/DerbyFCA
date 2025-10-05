"use client";

import { useState } from "react";

interface Application {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  whatsapp: string;
  profession: string;
  motivation: string;
  availability: string;
  acceptedTerms: boolean;
  acceptedAt: Date | null;
  isViewed: boolean;
  viewedAt: Date | null;
  viewedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ApplicationCardProps {
  application: Application;
  onMarkAsViewed?: (id: string) => void;
}

export default function ApplicationCard({ application, onMarkAsViewed }: ApplicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const handleMarkAsViewed = async () => {
    if (isMarking || application.isViewed) return;

    setIsMarking(true);
    try {
      const res = await fetch(`/api/applications/${application.id}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        throw new Error("Erreur lors de la mise à jour");
      }

      // Callback pour mettre à jour la liste parent
      if (onMarkAsViewed) {
        onMarkAsViewed(application.id);
      }
    } catch (error) {
      alert("Erreur lors de la mise à jour");
    } finally {
      setIsMarking(false);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    const badges = {
      AVAILABLE: {
        label: "✅ Disponible",
        className: "badge badge-success",
      },
      SOMETIMES: {
        label: "⚠️ Parfois disponible",
        className: "badge badge-warning",
      },
      NOT_AVAILABLE: {
        label: "❌ Non disponible",
        className: "badge badge-error",
      },
    };

    return badges[availability as keyof typeof badges] || {
      label: availability,
      className: "badge",
    };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const availabilityBadge = getAvailabilityBadge(application.availability);
  const motivationPreview = application.motivation.length > 100
    ? application.motivation.substring(0, 100) + "..."
    : application.motivation;

  return (
    <div
      className={`card bg-base-100 shadow-md border-l-4 ${
        application.isViewed ? "border-l-gray-300" : "border-l-indigo-600"
      }`}
    >
      <div className="card-body">
        {/* Header avec statut */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="card-title text-xl">
              {application.firstName} {application.lastName}
              {!application.isViewed && (
                <span className="badge badge-primary badge-sm ml-2">Nouveau</span>
              )}
            </h3>
            <p className="text-sm text-gray-500">
              Demande envoyée le {formatDate(application.createdAt)}
            </p>
          </div>
          {!application.isViewed && (
            <button
              onClick={handleMarkAsViewed}
              disabled={isMarking}
              className="btn btn-sm btn-outline btn-primary"
            >
              {isMarking ? "..." : "✓ Marquer comme vue"}
            </button>
          )}
        </div>

        {/* Informations principales */}
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm font-semibold text-gray-600">📧 Email</p>
            <p className="text-gray-800">
              <a href={`mailto:${application.email}`} className="link link-primary">
                {application.email}
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">📱 WhatsApp</p>
            <p className="text-gray-800">
              <a
                href={`https://wa.me/${application.whatsapp.replace(/\s/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="link link-primary"
              >
                {application.whatsapp}
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">💼 Profession</p>
            <p className="text-gray-800">{application.profession}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-600">📅 Disponibilité samedi</p>
            <span className={availabilityBadge.className}>{availabilityBadge.label}</span>
          </div>
        </div>

        {/* Motivation */}
        <div className="mt-4">
          <p className="text-sm font-semibold text-gray-600 mb-2">💭 Motivation</p>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-800 whitespace-pre-wrap">
              {isExpanded ? application.motivation : motivationPreview}
            </p>
            {application.motivation.length > 100 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-semibold mt-2"
              >
                {isExpanded ? "▲ Réduire" : "▼ Lire la suite"}
              </button>
            )}
          </div>
        </div>

        {/* Footer - Info vue */}
        {application.isViewed && application.viewedAt && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500">
              ✓ Vue le {formatDate(application.viewedAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}