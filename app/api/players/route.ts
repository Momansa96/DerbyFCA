import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { uploadPlayerPhoto } from "@/lib/supabase-admin";

// GET /api/players
export async function GET(req: NextRequest) {
  try {
    const players = await prisma.player.findMany({
      orderBy: { fullName: "asc" },
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            // Matchs joués via les équipes du joueur (status COMPLETED uniquement)
            team1Matches: {
              where: { status: "COMPLETED" },
              select: { id: true },
            },
            team2Matches: {
              where: { status: "COMPLETED" },
              select: { id: true },
            },
          },
        },
        goals: { select: { id: true } }, // Buts en derbys (Match)
        // Buts en exhibition interne — comptent comme les derbys
        friendlyGoals: {
          where: { friendlyMatch: { isInternal: true } },
          select: { id: true },
        },
        // Compositions d'exhibition interne où le joueur a participé (status COMPLETED)
        friendlyCompositions: {
          where: {
            friendlyMatch: { isInternal: true, status: "COMPLETED" },
          },
          select: { friendlyMatchId: true },
        },
        yellowCards: { select: { id: true } },
        redCards: { select: { id: true } },
      },
    });

    const formattedPlayers = players.map((player: any) => {
      // matchesPlayed = matchs derby COMPLETED + exhibitions internes COMPLETED jouées
      const matchIdSet = new Set<string>();
      for (const team of player.teams) {
        for (const m of team.team1Matches) matchIdSet.add(m.id);
        for (const m of team.team2Matches) matchIdSet.add(m.id);
      }
      const exhibitionPlayed = new Set<string>(
        player.friendlyCompositions.map((fmp: any) => fmp.friendlyMatchId)
      );

      return {
        ...player,
        joinDate: player.joinDate.toISOString(),
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString(),
        goalsCount: player.goals.length + player.friendlyGoals.length,
        yellowCount: player.yellowCards.length,
        redCount: player.redCards.length,
        matchesPlayed: matchIdSet.size + exhibitionPlayed.size,
        teams: player.teams.map((team: any) => team.name),
      };
    });

    return NextResponse.json(formattedPlayers);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Échec de la récupération des joueurs" },
      { status: 500 }
    );
  }
}


// POST /api/players
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    // Validation des champs requis
    const requiredFields = ['fullName', 'status'];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return NextResponse.json(
          { success: false, error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Gestion de la photo de profil (upload vers Supabase Storage)
    let profilePhotoUrl: string | null = null;
    const file = formData.get("profilePhoto") as File;

    if (file?.size > 0) {
      try {
        profilePhotoUrl = await uploadPlayerPhoto(file);
      } catch (e: any) {
        return NextResponse.json(
          { success: false, error: e?.message || "Échec de l'upload de la photo" },
          { status: 400 }
        );
      }
    }

    // Création du joueur
    const player = await prisma.player.create({
      data: {
        fullName: formData.get('fullName') as string,
        alias: formData.get('alias') as string || null,
        bureauRole: formData.get('bureauRole') as string || null,
        preferredPosition: formData.get('preferredPosition') as string || null,
        description: formData.get('description') as string || null,
        number: formData.get('number') ? parseInt(formData.get('number') as string) : null,
        status: formData.get('status') as string,
        profilePhoto: profilePhotoUrl,
        joinDate: new Date(formData.get('joinDate') as string || Date.now()),
        phone: formData.get('phone') as string || null,
      },
    });

    return NextResponse.json(
      { success: true, data: player },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur de création du joueur" },
      { status: 500 }
    );
  }
}

