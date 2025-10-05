/**
 * Système de rate limiting pour prévenir les attaques brute force
 * Utilise une Map en mémoire pour tracker les tentatives par identifiant (IP, email, etc.)
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
  blockedUntil?: number;
}

// Map pour stocker les tentatives par identifiant
const attempts = new Map<string, RateLimitRecord>();

// Nettoyage automatique des anciennes entrées toutes les 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attempts.entries()) {
    if (now > record.resetAt && (!record.blockedUntil || now > record.blockedUntil)) {
      attempts.delete(key);
    }
  }
}, 10 * 60 * 1000);

interface RateLimitOptions {
  maxAttempts?: number;      // Nombre max de tentatives (défaut: 5)
  windowMs?: number;          // Fenêtre de temps en ms (défaut: 60000 = 1 min)
  blockDurationMs?: number;   // Durée de blocage en ms (défaut: 15 min)
}

interface RateLimitResult {
  success: boolean;
  remaining?: number;
  resetAt?: number;
  blockedUntil?: number;
}

/**
 * Vérifie et enregistre une tentative
 * @param identifier - Identifiant unique (IP, email, etc.)
 * @param options - Options de configuration
 * @returns Résultat avec statut, tentatives restantes, etc.
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const {
    maxAttempts = 5,
    windowMs = 60 * 1000, // 1 minute par défaut
    blockDurationMs = 15 * 60 * 1000, // 15 minutes de blocage
  } = options;

  const now = Date.now();
  const record = attempts.get(identifier);

  // Si l'utilisateur est bloqué
  if (record?.blockedUntil && now < record.blockedUntil) {
    return {
      success: false,
      blockedUntil: record.blockedUntil,
    };
  }

  // Si pas d'enregistrement ou fenêtre expirée, réinitialiser
  if (!record || now > record.resetAt) {
    attempts.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      remaining: maxAttempts - 1,
      resetAt: now + windowMs,
    };
  }

  // Incrémenter le compteur
  record.count++;

  // Si limite atteinte, bloquer l'utilisateur
  if (record.count > maxAttempts) {
    record.blockedUntil = now + blockDurationMs;
    attempts.set(identifier, record);
    return {
      success: false,
      blockedUntil: record.blockedUntil,
    };
  }

  // Mise à jour de l'enregistrement
  attempts.set(identifier, record);

  return {
    success: true,
    remaining: maxAttempts - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Réinitialise le compteur pour un identifiant (après succès par exemple)
 * @param identifier - Identifiant à réinitialiser
 */
export function resetRateLimit(identifier: string): void {
  attempts.delete(identifier);
}

/**
 * Obtient les informations de rate limit pour un identifiant sans incrémenter
 * @param identifier - Identifiant à vérifier
 */
export function getRateLimitInfo(identifier: string): RateLimitResult {
  const now = Date.now();
  const record = attempts.get(identifier);

  if (!record) {
    return { success: true };
  }

  if (record.blockedUntil && now < record.blockedUntil) {
    return {
      success: false,
      blockedUntil: record.blockedUntil,
    };
  }

  return {
    success: true,
    remaining: record.count,
    resetAt: record.resetAt,
  };
}