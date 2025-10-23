import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT - Modifier une cotisation existante
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { amountPaid, paymentDate, notes } = body;

    const contribution = await prisma.contribution.update({
      where: { id },
      data: {
        ...(amountPaid !== undefined && { amountPaid: parseInt(amountPaid) }),
        ...(paymentDate && { paymentDate: new Date(paymentDate) }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        player: {
          select: {
            id: true,
            fullName: true,
          }
        },
        week: {
          select: {
            year: true,
            weekNumber: true,
          }
        }
      }
    });

    return NextResponse.json(contribution, { status: 200 });
  } catch (error: any) {
    console.error('Erreur lors de la modification de la cotisation:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Cotisation introuvable.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la modification de la cotisation.' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une cotisation
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await prisma.contribution.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Cotisation supprimée avec succès.' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Erreur lors de la suppression de la cotisation:', error);

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Cotisation introuvable.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la cotisation.' },
      { status: 500 }
    );
  }
}