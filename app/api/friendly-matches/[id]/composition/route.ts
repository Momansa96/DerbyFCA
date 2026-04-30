import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/requireAdmin";

type CompositionEntry = {
  playerId: string;
  role: "TITULAIRE" | "REMPLACANT";
  position?: "GK" | "DEF" | "ATT_L" | "ATT_C" | "ATT_R" | null;
  side?: "HOME" | "AWAY";
};

const VALID_POSITIONS = ["GK", "DEF", "ATT_L", "ATT_C", "ATT_R"];
const VALID_SIDES = ["HOME", "AWAY"];

/**
 * PUT /api/friendly-matches/[id]/composition
 * Remplace la composition complète du match.
 * Body : { entries: CompositionEntry[] }
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
    const entries: CompositionEntry[] = body.entries ?? [];

    if (!Array.isArray(entries)) {
      return NextResponse.json({ error: "Format invalide" }, { status: 400 });
    }

    const match = await prisma.friendlyMatch.findUnique({ where: { id } });
    if (!match) {
      return NextResponse.json({ error: "Match introuvable" }, { status: 404 });
    }

    // Validation : pas de doublon de joueur
    const playerIds = entries.map((e) => e.playerId);
    if (new Set(playerIds).size !== playerIds.length) {
      return NextResponse.json(
        { error: "Un joueur ne peut apparaître qu'une fois" },
        { status: 400 }
      );
    }

    if (match.isInternal) {
      // === Mode interne : pas de positions, juste deux camps Équipe 1 / Équipe 2 ===
      for (const e of entries) {
        if (!e.side || !VALID_SIDES.includes(e.side)) {
          return NextResponse.json(
            { error: "Chaque joueur doit avoir un camp (HOME/AWAY)" },
            { status: 400 }
          );
        }
      }

      await prisma.$transaction([
        prisma.friendlyMatchPlayer.deleteMany({ where: { friendlyMatchId: id } }),
        prisma.friendlyMatchPlayer.createMany({
          data: entries.map((e) => ({
            friendlyMatchId: id,
            playerId: e.playerId,
            role: "TITULAIRE",
            position: null,
            side: e.side!,
          })),
        }),
      ]);
    } else {
      // === Mode externe (existant) : positions + titulaires/remplaçants ===
      const titulaires = entries.filter((e) => e.role === "TITULAIRE");
      const remplacants = entries.filter((e) => e.role === "REMPLACANT");

      const positions = titulaires.map((t) => t.position);
      if (positions.some((p) => !p || !VALID_POSITIONS.includes(p))) {
        return NextResponse.json(
          { error: "Chaque titulaire doit avoir une position valide" },
          { status: 400 }
        );
      }
      if (new Set(positions).size !== positions.length) {
        return NextResponse.json(
          { error: "Une position ne peut être attribuée qu'à un seul joueur" },
          { status: 400 }
        );
      }

      await prisma.$transaction([
        prisma.friendlyMatchPlayer.deleteMany({ where: { friendlyMatchId: id } }),
        prisma.friendlyMatchPlayer.createMany({
          data: [
            ...titulaires.map((t) => ({
              friendlyMatchId: id,
              playerId: t.playerId,
              role: "TITULAIRE",
              position: t.position!,
              side: "HOME",
            })),
            ...remplacants.map((r) => ({
              friendlyMatchId: id,
              playerId: r.playerId,
              role: "REMPLACANT",
              position: null,
              side: "HOME",
            })),
          ],
        }),
      ]);
    }

    const updated = await prisma.friendlyMatch.findUnique({
      where: { id },
      include: {
        compositions: {
          include: {
            player: {
              select: { id: true, fullName: true, alias: true, profilePhoto: true, number: true },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: "Composition enregistrée",
      match: updated,
    });
  } catch (error) {
    console.error("Erreur PUT composition:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'enregistrement de la composition" },
      { status: 500 }
    );
  }
}
