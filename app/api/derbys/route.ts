import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/derbys
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { team1Players, team2Players } = data;

    if (!team1Players || !team2Players) {
      return NextResponse.json(
        { error: "Les données des équipes sont manquantes" },
        { status: 400 }
      );
    }

    // Créer les équipes
    const team1 = await prisma.team.create({
      data: {
        name: "Équipe 1",
        players: {
          connect: team1Players.map((playerId: string) => ({ id: playerId })),
        },
      },
    });

    const team2 = await prisma.team.create({
      data: {
        name: "Équipe 2",
        players: {
          connect: team2Players.map((playerId: string) => ({ id: playerId })),
        },
      },
    });

    // Créer le derby
    const derby = await prisma.derby.create({
      data: {
        team1Id: team1.id,
        team2Id: team2.id,
        matches: {
          create: [
            // Premier match
            {
              date: new Date(new Date().setDate(new Date().getDate() + 7)), // Prochain samedi
              team1Id: team1.id,
              team2Id: team2.id,
            },
            // Deuxième match
            {
              date: new Date(new Date().setDate(new Date().getDate() + 14)),
              team1Id: team2.id,
              team2Id: team1.id,
            },
            // Troisième match
            {
              date: new Date(new Date().setDate(new Date().getDate() + 21)),
              team1Id: team1.id,
              team2Id: team2.id,
            },
            // Quatrième match
            {
              date: new Date(new Date().setDate(new Date().getDate() + 28)),
              team1Id: team2.id,
              team2Id: team1.id,
            },
          ],
        },
      },
      include: {
        matches: true,
        team1: {
          include: {
            players: true,
          },
        },
        team2: {
          include: {
            players: true,
          },
        },
      },
    });

    return NextResponse.json(derby, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du derby:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du derby" },
      { status: 500 }
    );
  }
}

// GET /api/derbys
export async function GET(req: NextRequest) {
  try {
    const derbys = await prisma.derby.findMany({
      include: {
        matches: {
          include: {
            goals: {
              include: {
                player: true,
              },
            },
          },
        },
        team1: {
          include: {
            players: true,
          },
        },
        team2: {
          include: {
            players: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(derbys);
  } catch (error) {
    console.error("Erreur lors de la récupération des derbys:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des derbys" },
      { status: 500 }
    );
  }
}
