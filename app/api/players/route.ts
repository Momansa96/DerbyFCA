import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
        goals: { select: { id: true } }, // Compter les buts
        yellowCards: { select: { id: true } }, // Compter les cartons jaunes
        redCards: { select: { id: true } }, // Compter les cartons rouges
      },
    });

    const formattedPlayers = players.map((player: any) => {
      // matchesPlayed = nombre de matchs COMPLETED distincts où l'une des
      // équipes du joueur a joué (team1 ou team2). Set pour dédupliquer si
      // un joueur appartient à plusieurs équipes ayant joué le même match.
      const matchIdSet = new Set<string>();
      for (const team of player.teams) {
        for (const m of team.team1Matches) matchIdSet.add(m.id);
        for (const m of team.team2Matches) matchIdSet.add(m.id);
      }

      return {
        ...player,
        joinDate: player.joinDate.toISOString(),
        createdAt: player.createdAt.toISOString(),
        updatedAt: player.updatedAt.toISOString(),
        goalsCount: player.goals.length,
        yellowCount: player.yellowCards.length,
        redCount: player.redCards.length,
        matchesPlayed: matchIdSet.size,
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

    // Gestion de la photo de profil
    let profilePhotoUrl = null;
    const file = formData.get("profilePhoto") as File;
    
    if (file?.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: "Format d'image non supporté" },
          { status: 400 }
        );
      }

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'players');
      await mkdir(uploadDir, { recursive: true });

      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);

      const arrayBuffer = await file.arrayBuffer();
      await writeFile(filePath, new Uint8Array(arrayBuffer));

      
      profilePhotoUrl = `/uploads/players/${fileName}`;
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

