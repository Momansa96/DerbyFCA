/**
 * Système de logs d'audit pour tracer les événements de sécurité
 */

import { prisma } from "./prisma";

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "REGISTER_SUCCESS"
  | "REGISTER_FAILED"
  | "LOGOUT"
  | "PASSWORD_RESET_REQUEST"
  | "PASSWORD_RESET_SUCCESS"
  | "RATE_LIMIT_EXCEEDED";

export interface AuditLogData {
  action: AuditAction;
  userId?: string;
  email?: string;
  ip?: string;
  userAgent?: string;
  details?: Record<string, any>;
}

/**
 * Créer un log d'audit
 * @param data - Données du log
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        action: data.action,
        userId: data.userId,
        email: data.email,
        ip: data.ip,
        userAgent: data.userAgent,
        details: data.details ? JSON.stringify(data.details) : null,
      },
    });
  } catch (error) {
    // Ne pas bloquer l'exécution si le log échoue
    console.error("Erreur lors de la création du log d'audit:", error);
  }
}

/**
 * Récupérer les logs d'audit pour un utilisateur
 * @param userId - ID de l'utilisateur
 * @param limit - Nombre max de logs à retourner
 */
export async function getAuditLogs(userId?: string, limit: number = 100) {
  return prisma.auditLog.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/**
 * Récupérer les tentatives de connexion échouées récentes
 * @param email - Email à vérifier
 * @param minutesAgo - Nombre de minutes dans le passé
 */
export async function getRecentFailedLogins(
  email: string,
  minutesAgo: number = 15
) {
  const since = new Date(Date.now() - minutesAgo * 60 * 1000);

  return prisma.auditLog.findMany({
    where: {
      action: "LOGIN_FAILED",
      email,
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Récupérer les événements suspects (rate limiting, tentatives multiples)
 * @param hoursAgo - Nombre d'heures dans le passé
 */
export async function getSuspiciousActivity(hoursAgo: number = 24) {
  const since = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);

  return prisma.auditLog.findMany({
    where: {
      OR: [
        { action: "RATE_LIMIT_EXCEEDED" },
        { action: "LOGIN_FAILED" },
      ],
      createdAt: { gte: since },
    },
    orderBy: { createdAt: "desc" },
  });
}