import { NextRequest, NextResponse } from 'next/server';
import { startOfYear, differenceInWeeks } from 'date-fns';
import { prisma } from '@/lib/prisma';

// GET - Récupère l'historique complet des cotisations d'un joueur
export async function GET(
  request: NextRequest,
  { params }: { params: { playerId: string } }
) {
  try {
    const { playerId } = params;
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const currentYear = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    // Vérifier si le joueur existe
    const player = await prisma.player.findUnique({
      where: { id: playerId },
      select: {
        id: true,
        fullName: true,
        alias: true,
        profilePhoto: true,
        status: true,
      }
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Joueur introuvable.' },
        { status: 404 }
      );
    }

    // Récupérer toutes les cotisations du joueur pour l'année
    const contributions = await prisma.contribution.findMany({
      where: {
        playerId,
        week: {
          year: currentYear
        }
      },
      include: {
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

    // Calculer le nombre de semaines écoulées
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const now = new Date();
    const weeksElapsed = Math.min(
      differenceInWeeks(now, yearStart) + 1,
      52
    );

    // Calculer les statistiques
    const totalPaid = contributions.reduce((sum, contrib) => sum + contrib.amountPaid, 0);
    const weeksPaid = Math.floor(totalPaid / 200);
    const expectedAmount = weeksElapsed * 200;
    const balance = totalPaid - expectedAmount;

    // Déterminer le statut
    let status: 'up_to_date' | 'late' | 'very_late' | 'ahead';
    if (balance >= 0) {
      status = balance > 0 ? 'ahead' : 'up_to_date';
    } else if (balance >= -400) {
      status = 'late';
    } else {
      status = 'very_late';
    }

    // Récupérer toutes les semaines de l'année pour voir lesquelles ne sont pas payées
    const allWeeks = await prisma.contributionWeek.findMany({
      where: {
        year: currentYear
      },
      orderBy: {
        weekNumber: 'asc'
      }
    });

    const paidWeekIds = new Set(contributions.map(c => c.weekId));
    const unpaidWeeks = allWeeks
      .filter(week => !paidWeekIds.has(week.id))
      .filter(week => week.weekNumber <= weeksElapsed);

    return NextResponse.json({
      player,
      contributions,
      unpaidWeeks,
      stats: {
        year: currentYear,
        weeksElapsed,
        weeksPaid,
        totalPaid,
        expectedAmount,
        balance,
        status,
        contributionsCount: contributions.length,
        unpaidWeeksCount: unpaidWeeks.length
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'historique.' },
      { status: 500 }
    );
  }
}