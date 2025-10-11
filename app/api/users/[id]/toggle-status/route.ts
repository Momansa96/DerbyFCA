import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// PATCH /api/users/[id]/toggle-status - Activer/Révoquer un utilisateur
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { status } = body; // "ACTIVE" ou "REVOKED"

    // Empêcher l'utilisateur de se révoquer lui-même
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas révoquer votre propre compte" },
        { status: 400 }
      );
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur introuvable" },
        { status: 404 }
      );
    }

    // Mettre à jour le statut
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        status,
        revokedAt: status === "REVOKED" ? new Date() : null,
        revokedBy: status === "REVOKED" ? session.user.id : null,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        status: true,
        revokedAt: true,
        revokedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du statut:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du statut" },
      { status: 500 }
    );
  }
}