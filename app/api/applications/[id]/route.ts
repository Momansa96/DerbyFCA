import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * PATCH /api/applications/[id]
 * Marquer une demande comme vue (admin uniquement)
 */
export async function PATCH(
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

    // Vérifier que la demande existe
    const application = await prisma.membershipApplication.findUnique({
      where: { id },
    });

    if (!application) {
      return NextResponse.json(
        { error: "Demande introuvable" },
        { status: 404 }
      );
    }

    // Marquer comme vue
    const updated = await prisma.membershipApplication.update({
      where: { id },
      data: {
        isViewed: true,
        viewedAt: new Date(),
        viewedBy: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Demande marquée comme vue",
      application: updated,
    });
  } catch (error) {
    console.error("Erreur mise à jour demande:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}