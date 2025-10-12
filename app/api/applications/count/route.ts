export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

/**
 * GET /api/applications/count
 * Compter les nouvelles demandes non vues (admin uniquement)
 */
export async function GET() {
  try {
    // Vérifier l'authentification admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Compter les demandes non vues
    const count = await prisma.membershipApplication.count({
      where: { isViewed: false },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Erreur comptage demandes:", error);
    return NextResponse.json(
      { error: "Erreur lors du comptage" },
      { status: 500 }
    );
  }
}