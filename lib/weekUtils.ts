import { startOfWeek, endOfWeek, getWeek, getYear } from 'date-fns';
import { fr } from 'date-fns/locale';
import { prisma } from '@/lib/prisma';

/**
 * Normalise une date en UTC pour éviter les problèmes de timezone
 * Le serveur peut être en UTC mais les utilisateurs en GMT+1 (Bénin)
 */
function normalizeToUTC(date: Date): Date {
  return new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0, 0, 0, 0
  ));
}

/**
 * Calcule l'année et le numéro de semaine pour une date donnée
 * Utilise UTC pour éviter les décalages de timezone
 */
export function getWeekInfo(date: Date) {
  // Normaliser la date en UTC pour éviter les problèmes de timezone
  const utcDate = normalizeToUTC(date);

  const year = getYear(utcDate);
  const weekNumber = getWeek(utcDate, { locale: fr, weekStartsOn: 1 }); // Semaine commence le lundi
  const weekStartDate = normalizeToUTC(startOfWeek(utcDate, { locale: fr, weekStartsOn: 1 }));
  const weekEndDate = normalizeToUTC(endOfWeek(utcDate, { locale: fr, weekStartsOn: 1 }));

  return {
    year,
    weekNumber,
    weekStartDate,
    weekEndDate,
  };
}

/**
 * Trouve ou crée une semaine de cotisation pour une date donnée
 * Si la semaine existe déjà, elle est retournée
 * Sinon, elle est créée avec le montant par défaut (200 FCFA)
 * Utilise upsert pour éviter les race conditions
 */
export async function findOrCreateWeek(date: Date, amount: number = 200) {
  const { year, weekNumber, weekStartDate, weekEndDate } = getWeekInfo(date);

  // Utiliser upsert pour éviter les race conditions
  const week = await prisma.contributionWeek.upsert({
    where: {
      year_weekNumber: {
        year,
        weekNumber,
      },
    },
    update: {}, // Ne rien mettre à jour si existe déjà
    create: {
      year,
      weekNumber,
      weekStartDate,
      weekEndDate,
      amount,
    },
  });

  return week;
}

/**
 * Récupère toutes les semaines pour une année donnée
 * Utile pour l'affichage et la gestion
 */
export async function getWeeksByYear(year: number) {
  return await prisma.contributionWeek.findMany({
    where: { year },
    orderBy: { weekNumber: 'asc' },
    include: {
      contributions: {
        include: {
          player: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },
      },
    },
  });
}