"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Briefcase, Calendar, MessageSquare, CheckCircle, Clock, ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

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
  index?: number;
}

export default function ApplicationCard({ application, onMarkAsViewed, index = 0 }: ApplicationCardProps) {
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

      toast.success("Demande marquée comme vue");

      // Callback pour mettre à jour la liste parent
      if (onMarkAsViewed) {
        onMarkAsViewed(application.id);
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setIsMarking(false);
    }
  };

  const getAvailabilityBadge = (availability: string) => {
    const badges = {
      AVAILABLE: {
        label: "Disponible",
        className: "bg-green-500/20 border border-green-500/30 text-green-400",
      },
      SOMETIMES: {
        label: "Parfois dispo",
        className: "bg-orange-500/20 border border-orange-500/30 text-orange-400",
      },
      NOT_AVAILABLE: {
        label: "Non disponible",
        className: "bg-red-500/20 border border-red-500/30 text-red-400",
      },
    };

    return badges[availability as keyof typeof badges] || {
      label: availability,
      className: "bg-gray-500/20 border border-gray-500/30 text-gray-400",
    };
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const availabilityBadge = getAvailabilityBadge(application.availability);
  const motivationPreview = application.motivation.length > 150
    ? application.motivation.substring(0, 150) + "..."
    : application.motivation;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`bg-gradient-to-br from-gray-800/40 to-gray-900/20 border rounded-xl p-4 sm:p-5 hover:border-cyan-500/50 transition-all ${
        application.isViewed ? "border-gray-700/50" : "border-orange-500/50"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-700/50">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold text-white">
              {application.firstName} {application.lastName}
            </h3>
            {!application.isViewed && (
              <span className="inline-flex items-center gap-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                Nouveau
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            Reçue le {formatDate(application.createdAt)}
          </div>
        </div>

        {!application.isViewed && (
          <button
            onClick={handleMarkAsViewed}
            disabled={isMarking}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg transition-all disabled:opacity-50"
          >
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">
              {isMarking ? "..." : "Marquer vue"}
            </span>
          </button>
        )}
      </div>

      {/* Informations principales */}
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <Mail className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <a
              href={`mailto:${application.email}`}
              className="text-sm text-cyan-400 hover:text-cyan-300 truncate block"
            >
              {application.email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Phone className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">WhatsApp</p>
            <a
              href={`https://wa.me/${application.whatsapp.replace(/\s/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-400 hover:text-green-300 truncate block"
            >
              {application.whatsapp}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Profession</p>
            <p className="text-sm text-white truncate">{application.profession}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 mb-1">Disponibilité samedi</p>
            <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-semibold ${availabilityBadge.className}`}>
              {availabilityBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Motivation */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-gray-400" />
          <p className="text-xs font-semibold text-gray-400">Motivation</p>
        </div>
        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
          {isExpanded ? application.motivation : motivationPreview}
        </p>
        {application.motivation.length > 150 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-sm font-semibold mt-3 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Réduire
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Lire la suite
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer - Info vue */}
      {application.isViewed && application.viewedAt && (
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-1 text-xs text-green-500">
            <Clock className="w-3 h-3" />
            Vue le {formatDate(application.viewedAt)}
          </div>
        </div>
      )}
    </motion.div>
  );
}