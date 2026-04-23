import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

type GoalEntry = {
  playerId: string;
  assistPlayerId?: string | null;
  minute?: number | null;
};

/**
 * PUT /api/friendly-matches/[id]/result
 * Enregistre le score final + les buteurs FCA.
 * Body : { ourScore: number, opponentScore: number, goals: GoalEntry[], notes?: string, status?: "SCHEDULED"|"COMPLETED" }
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = params;
    const body = await req.json();
    const {
      ourScore,
      opponentScore,
      goals = [],
      notes,
      status = "COMPLETED",
    }: {
      ourScore: number;
      opponentScore: number;
      goals: GoalEntry[];
      notes?: string;
      status?: "SCHEDULED" | "COMPLETED";
    } = body;

    if (
      typeof ourScore !== "number" ||
      typeof opponentScore !== "number" ||
      ourScore < 0 ||
      opponentScore < 0
    ) {
      return NextResponse.json({ error: "Scores invalides" }, { status: 400 });
    }
    if (!Array.isArray(goals)) {
      return NextResponse.json({ error: "Liste de buts invalide" }, { status: 400 });
    }
    // Cohérence : nb de buteurs FCA == ourScore
    if (goals.length !== ourScore) {
      return NextResponse.json(
        { error: `Le nombre de buteurs (${goals.length}) doit correspondre au score FCA (${ourScore})` },
        { status: 400 }
      );
    }
    for (const g of goals) {
      if (!g.playerId) {
        return NextResponse.json({ error: "Chaque but doit avoir un buteur" }, { status: 400 });
      }
      if (g.assistPlayerId && g.assistPlayerId === g.playerId) {
        return NextResponse.json(
          { error: "Le passeur ne peut pas être le buteur" },
          { status: 400 }
        );
      }
    }

    const match = await prisma.friendlyMatch.findUnique({ where: { id } });
    if (!match) {
      return NextResponse.json({ error: "Match introuvable" }, { status: 404 });
    }

    await prisma.$transaction([
      prisma.friendlyMatchGoal.deleteMany({ where: { friendlyMatchId: id } }),
      prisma.friendlyMatchGoal.createMany({
        data: goals.map((g) => ({
          friendlyMatchId: id,
          playerId: g.playerId,
          assistPlayerId: g.assistPlayerId || null,
          minute: g.minute ?? null,
        })),
      }),
      prisma.friendlyMatch.update({
        where: { id },
        data: {
          ourScore,
          opponentScore,
          notes: notes ?? null,
          status,
        },
      }),
    ]);

    const updated = await prisma.friendlyMatch.findUnique({
      where: { id },
      include: {
        goals: {
          include: {
            player: { select: { id: true, fullName: true, alias: true, profilePhoto: true } },
            assistPlayer: { select: { id: true, fullName: true, alias: true, profilePhoto: true } },
          },
          orderBy: { minute: "asc" },
        },
      },
    });

    return NextResponse.json({ message: "Résultat enregistré", match: updated });
  } catch (error) {
    console.error("Erreur PUT result:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement du résultat" },
      { status: 500 }
    );
  }
}
