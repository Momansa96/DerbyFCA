import { NextRequest, NextResponse } from 'next/server';
import { startOfYear, differenceInWeeks } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAdmin';

// GET - Récupère le résumé des cotisations pour tous les joueurs
// NOTE: Accessible publiquement (pour page visiteurs)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year');
    const currentYear = yearParam ? parseInt(yearParam) : new Date().getFullYear();

    // Récupérer tous les joueurs actifs
    const players = await prisma.player.findMany({
      where: {
        status: 'ACTIF'
      },
      include: {
        contributions: {
          where: {
            week: {
              year: currentYear
            }
          },
          include: {
            week: true
          }
        }
      },
      orderBy: {
        fullName: 'asc'
      }
    });

    // Calculer le résumé pour chaque joueur
    const summary = players.map(player => {
      // Calculer le total payé
      const totalPaid = player.contributions.reduce((sum, contrib) => sum + contrib.amountPaid, 0);

      // Calculer le nombre de semaines payées (nombre de contributions uniques)
      const weeksPaid = player.contributions.length;

      // Calculer les semaines écoulées depuis adhésion ou début d'année
      const yearStart = startOfYear(new Date(currentYear, 0, 1));
      const now = new Date();
      const joinDate = player.joinDate ? new Date(player.joinDate) : yearStart;

      // Si le joueur a rejoint cette année, compter depuis joinDate
      // Sinon, compter depuis le 1er janvier
      const startDate = joinDate > yearStart ? joinDate : yearStart;
      const weeksElapsed = Math.max(
        1, // Au minimum 1 semaine
        Math.floor(differenceInWeeks(now, startDate)) + 1
      );

      // Calculer le montant attendu (200 FCFA par semaine)
      const expectedAmount = weeksElapsed * 200;

      // Calculer le solde (positif = avance, négatif = retard)
      const balance = totalPaid - expectedAmount;

      // Trouver la dernière cotisation (sans muter le tableau original)
      const lastContribution = player.contributions.length > 0
        ? [...player.contributions].sort((a, b) =>
            new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()
          )[0]
        : null;

      // Déterminer le statut
      let status: 'up_to_date' | 'late' | 'very_late' | 'ahead';
      if (balance >= 0) {
        status = balance > 0 ? 'ahead' : 'up_to_date';
      } else if (balance >= -400) {
        status = 'late';
      } else {
        status = 'very_late';
      }

      return {
        playerId: player.id,
        fullName: player.fullName,
        alias: player.alias,
        profilePhoto: player.profilePhoto,
        totalPaid,
        weeksPaid,
        weeksElapsed,
        expectedAmount,
        balance,
        status,
        lastContribution: lastContribution ? {
          date: lastContribution.paymentDate,
          amount: lastContribution.amountPaid,
          weekNumber: lastContribution.week.weekNumber
        } : null,
        contributionsCount: player.contributions.length
      };
    });

    // Statistiques globales
    // Pour les stats globales, utiliser les semaines depuis le 1er janvier
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const now = new Date();
    const globalWeeksElapsed = Math.floor(differenceInWeeks(now, yearStart)) + 1;

    const stats = {
      totalPlayers: players.length,
      totalCollected: summary.reduce((sum, p) => sum + p.totalPaid, 0),
      totalExpected: summary.reduce((sum, p) => sum + p.expectedAmount, 0),
      playersUpToDate: summary.filter(p => p.status === 'up_to_date' || p.status === 'ahead').length,
      playersLate: summary.filter(p => p.status === 'late' || p.status === 'very_late').length,
      weeksElapsed: globalWeeksElapsed,
      year: currentYear
    };

    return NextResponse.json({
      summary,
      stats
    }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération du résumé:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du résumé.' },
      { status: 500 }
    );
  }
}