import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * GET /api/friendly-matches/[id]
 * Récupérer le détail d'un match (compo + buteurs inclus)
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const match = await prisma.friendlyMatch.findUnique({
      where: { id: params.id },
      include: {
        compositions: {
          include: {
            player: {
              select: { id: true, fullName: true, alias: true, profilePhoto: true, number: true },
            },
          },
        },
        goals: {
          include: {
            player: { select: { id: true, fullName: true, alias: true, profilePhoto: true } },
            assistPlayer: { select: { id: true, fullName: true, alias: true, profilePhoto: true } },
          },
          orderBy: { minute: 'asc' },
        },
      },
    });

    if (!match) {
      return NextResponse.json({ error: "Match introuvable" }, { status: 404 });
    }

    return NextResponse.json(match);
  } catch (error) {
    console.error("Erreur GET friendly-match:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * PUT /api/friendly-matches/[id]
 * Modifier un match (admin uniquement)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const { type, date, time, location, place, opponent } = body;

    // Validation
    if (!type || !date || !time || !location || !place || !opponent) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    // Vérifier que le match existe
    const existingMatch = await prisma.friendlyMatch.findUnique({
      where: { id },
    });

    if (!existingMatch) {
      return NextResponse.json(
        { error: "Match introuvable" },
        { status: 404 }
      );
    }

    // Mettre à jour
    const updatedMatch = await prisma.friendlyMatch.update({
      where: { id },
      data: {
        type,
        date,
        time,
        location,
        place,
        opponent,
      },
    });

    return NextResponse.json({
      message: "Match modifié avec succès",
      match: updatedMatch,
    });
  } catch (error) {
    console.error("Erreur modification match:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/friendly-matches/[id]
 * Supprimer un match (admin uniquement)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;

    // Vérifier que le match existe
    const existingMatch = await prisma.friendlyMatch.findUnique({
      where: { id },
    });

    if (!existingMatch) {
      return NextResponse.json(
        { error: "Match introuvable" },
        { status: 404 }
      );
    }

    // Supprimer
    await prisma.friendlyMatch.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Match supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression match:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}