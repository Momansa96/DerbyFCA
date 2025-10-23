import { NextRequest, NextResponse } from 'next/server';
import { startOfYear, addWeeks, endOfWeek, startOfWeek } from 'date-fns';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { year } = await request.json();

    if (!year || typeof year !== 'number') {
      return NextResponse.json(
        { error: 'Année invalide. Veuillez fournir une année valide.' },
        { status: 400 }
      );
    }

    // Vérifier si les semaines existent déjà pour cette année
    const existingWeeks = await prisma.contributionWeek.findMany({
      where: { year },
    });

    if (existingWeeks.length > 0) {
      return NextResponse.json(
        {
          error: `Les semaines pour l'année ${year} existent déjà (${existingWeeks.length} semaines trouvées).`,
          existingCount: existingWeeks.length
        },
        { status: 409 }
      );
    }

    // Générer les 52 semaines de l'année
    const weeks = [];
    const yearStart = startOfYear(new Date(year, 0, 1));

    for (let weekNum = 1; weekNum <= 52; weekNum++) {
      const weekStartDate = startOfWeek(addWeeks(yearStart, weekNum - 1), { weekStartsOn: 1 }); // Lundi
      const weekEndDate = endOfWeek(addWeeks(yearStart, weekNum - 1), { weekStartsOn: 1 }); // Dimanche

      weeks.push({
        year,
        weekNumber: weekNum,
        weekStartDate,
        weekEndDate,
        amount: 200, // Montant par défaut
      });
    }

    // Insérer toutes les semaines en une seule transaction
    const createdWeeks = await prisma.contributionWeek.createMany({
      data: weeks,
    });

    return NextResponse.json(
      {
        message: `${createdWeeks.count} semaines ont été générées avec succès pour l'année ${year}.`,
        year,
        count: createdWeeks.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la génération des semaines:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des semaines.' },
      { status: 500 }
    );
  }
}