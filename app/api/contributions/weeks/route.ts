import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth/requireAdmin';

// GET - Liste toutes les semaines (avec filtrage par année optionnel)
export async function GET(request: NextRequest) {
  // Vérifier l'authentification
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');

    const where = year ? { year: parseInt(year) } : {};

    const weeks = await prisma.contributionWeek.findMany({
      where,
      orderBy: [
        { year: 'desc' },
        { weekNumber: 'asc' }
      ],
      include: {
        contributions: {
          include: {
            player: {
              select: {
                id: true,
                fullName: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json(weeks, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des semaines:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des semaines.' },
      { status: 500 }
    );
  }
}

// POST - Créer une semaine manuellement
export async function POST(request: NextRequest) {
  // Vérifier l'authentification
  const { error: authError } = await requireAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { year, weekNumber, weekStartDate, weekEndDate, amount } = body;

    if (!year || !weekNumber || !weekStartDate || !weekEndDate) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis (year, weekNumber, weekStartDate, weekEndDate).' },
        { status: 400 }
      );
    }

    const week = await prisma.contributionWeek.create({
      data: {
        year,
        weekNumber,
        weekStartDate: new Date(weekStartDate),
        weekEndDate: new Date(weekEndDate),
        amount: amount || 200,
      },
    });

    return NextResponse.json(week, { status: 201 });
  } catch (error: any) {
    console.error('Erreur lors de la création de la semaine:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Cette semaine existe déjà pour cette année.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de la semaine.' },
      { status: 500 }
    );
  }
}