import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { findOrCreateWeek, getWeekInfo } from '@/lib/weekUtils';
import { requireAdmin } from '@/lib/auth/requireAdmin';
import { validateContribution, validateContributionBatch } from '@/lib/validations/contributions';

// GET - Liste toutes les cotisations (avec filtres optionnels)
// NOTE: Requiert authentification admin
export async function GET(request: NextRequest) {
  // Vérifier l'authentification admin
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const weekId = searchParams.get('weekId');
    const year = searchParams.get('year');
    const date = searchParams.get('date');

    const where: any = {};

    if (playerId) {
      where.playerId = playerId;
    }

    if (weekId) {
      where.weekId = weekId;
    }

    // Filtre par date : trouver la semaine correspondante
    if (date) {
      const { year: weekYear, weekNumber } = getWeekInfo(new Date(date));
      const week = await prisma.contributionWeek.findUnique({
        where: { year_weekNumber: { year: weekYear, weekNumber } },
      });
      if (week) {
        where.weekId = week.id;
      } else {
        // Aucune semaine n'existe pour cette date, donc aucune cotisation
        return NextResponse.json([], { status: 200 });
      }
    } else if (year) {
      where.week = {
        year: parseInt(year)
      };
    }

    const contributions = await prisma.contribution.findMany({
      where,
      include: {
        player: {
          select: {
            id: true,
            fullName: true,
            alias: true,
            profilePhoto: true,
          }
        },
        week: {
          select: {
            id: true,
            year: true,
            weekNumber: true,
            weekStartDate: true,
            weekEndDate: true,
            amount: true,
          }
        }
      },
      orderBy: {
        paymentDate: 'desc'
      }
    });

    return NextResponse.json(contributions, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des cotisations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des cotisations.' },
      { status: 500 }
    );
  }
}

// POST - Créer une ou plusieurs cotisations
export async function POST(request: NextRequest) {
  // Vérifier l'authentification
  const { error: authError, session } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();

    // Détection: batch (tableau) ou single (objet)
    const isBatch = Array.isArray(body);

    // Validation avec Zod
    const validation = isBatch
      ? validateContributionBatch(body)
      : validateContribution(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Erreur de validation',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const payments = validation.data as any[];
    const paymentsArray = Array.isArray(payments) ? payments : [payments];

    // Validation commune: paymentDate
    const paymentDate = paymentsArray[0]?.paymentDate;
    if (!paymentDate) {
      return NextResponse.json(
        { error: 'Le champ paymentDate est requis.' },
        { status: 400 }
      );
    }

    // Créer ou récupérer la semaine UNE SEULE FOIS
    const date = new Date(paymentDate);
    const week = await findOrCreateWeek(date);

    const results = {
      success: [] as any[],
      errors: [] as any[],
    };

    // Traiter chaque paiement individuellement (pas de transaction interactive
    // car une erreur P2002 corrompt la transaction PostgreSQL entière)
    for (const payment of paymentsArray) {
      const { playerId, amountPaid, notes, recordedBy } = payment;

      if (!playerId) {
        results.errors.push({
          playerId: null,
          error: 'playerId manquant',
        });
        continue;
      }

      try {
        // Vérifier si le joueur existe
        const player = await prisma.player.findUnique({
          where: { id: playerId },
        });

        if (!player) {
          results.errors.push({
            playerId,
            error: 'Joueur introuvable',
          });
          continue;
        }

        // Vérifier si le joueur a déjà payé cette semaine
        const existing = await prisma.contribution.findUnique({
          where: {
            playerId_weekId: {
              playerId,
              weekId: week.id,
            },
          },
        });

        if (existing) {
          results.errors.push({
            playerId,
            error: 'Ce joueur a déjà payé pour cette semaine',
          });
          continue;
        }

        // Créer la cotisation
        const contribution = await prisma.contribution.create({
          data: {
            playerId,
            weekId: week.id,
            amountPaid: amountPaid ? parseInt(amountPaid.toString()) : 200,
            paymentDate: date,
            notes,
            recordedBy,
          },
          include: {
            player: {
              select: {
                id: true,
                fullName: true,
              },
            },
            week: {
              select: {
                year: true,
                weekNumber: true,
              },
            },
          },
        });

        results.success.push(contribution);
      } catch (error: any) {
        results.errors.push({
          playerId,
          error: error.message || 'Erreur inconnue',
        });
      }
    }

    // Mode single: retourner l'objet directement ou erreur
    if (!isBatch) {
      if (results.success.length > 0) {
        return NextResponse.json(results.success[0], { status: 201 });
      } else {
        const error = results.errors[0];
        if (error.error === 'Ce joueur a déjà payé pour cette semaine') {
          return NextResponse.json({ error: error.error }, { status: 409 });
        }
        return NextResponse.json({ error: error.error }, { status: 404 });
      }
    }

    // Mode batch: retourner le résumé
    return NextResponse.json(
      {
        success: results.success.length,
        errors: results.errors.length,
        data: results,
      },
      { status: results.errors.length > 0 ? 207 : 201 }
    );
  } catch (error: any) {
    console.error('Erreur lors de la création de la cotisation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la cotisation.' },
      { status: 500 }
    );
  }
}