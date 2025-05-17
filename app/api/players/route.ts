import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import upload from "@/middleware/upload";
import { unlink } from 'fs/promises';
import { writeFile, access, mkdir } from "fs/promises";
import path from "path";

// GET /api/players
export async function GET(req: NextRequest) {
  try {
    const players = await prisma.player.findMany({
      orderBy: { fullName: "asc" },
      include: {
        teams: { select: { id: true, name: true } }, // Inclure les équipes
        goals: { select: { id: true } }, // Compter les buts
      },
    });

    const formattedPlayers = players.map(player => ({
      ...player,
      joinDate: player.joinDate.toISOString(),
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
      goalsCount: player.goals.length,
      teams: player.teams.map(team => team.name),
    }));

    return NextResponse.json(formattedPlayers);
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Échec de la récupération des joueurs" },
      { status: 500 }
    );
  }
}


// GET /api/players/[id]
export async function GET_ID(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: params.id },
      include: {
        teams: true,
        goals: {
          include: {
            match: {
              select: {
                date: true,
                team1: true,
                team2: true,
                score1: true,
                score2: true,
              },
            },
          },
        },
      },
    });

    if (!player) {
      return NextResponse.json(
        { success: false, error: "Joueur introuvable" },
        { status: 404 }
      );
    }

    const formattedPlayer = {
      ...player,
      joinDate: player.joinDate.toISOString(),
      createdAt: player.createdAt.toISOString(),
      updatedAt: player.updatedAt.toISOString(),
      goals: player.goals.map(goal => ({
        ...goal,
        createdAt: goal.createdAt.toISOString(),
      })),
    };

    return NextResponse.json({ success: true, data: formattedPlayer });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}


// PUT /api/players/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await req.formData();
    const existingPlayer = await prisma.player.findUnique({
      where: { id: params.id },
    });

    if (!existingPlayer) {
      return NextResponse.json(
        { success: false, error: "Joueur introuvable" },
        { status: 404 }
      );
    }

    // Gestion de la mise à jour de la photo
    let profilePhotoUrl = existingPlayer.profilePhoto;
    const file = formData.get("profilePhoto") as File;

    if (file?.size > 0) {
      // Supprimer l'ancienne photo si elle existe
      if (existingPlayer.profilePhoto) {
        const oldFilePath = path.join(
          process.cwd(),
          'public',
          existingPlayer.profilePhoto
        );
        try {
          await unlink(oldFilePath);
        } catch (error) {
          console.error("Erreur suppression ancienne photo:", error);
        }
      }

      // Upload nouvelle photo
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'players');
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const filePath = path.join(uploadDir, fileName);
      
      const buffer = Buffer.from(await file.arrayBuffer());
      const arrayBuffer = await file.arrayBuffer();
await writeFile(filePath, new Uint8Array(arrayBuffer));

      
      profilePhotoUrl = `/uploads/players/${fileName}`;
    }

    // Mise à jour des données
    const updatedPlayer = await prisma.player.update({
      where: { id: params.id },
      data: {
        fullName: formData.get('fullName') as string || existingPlayer.fullName,
        alias: formData.get('alias') as string || existingPlayer.alias,
        bureauRole: formData.get('bureauRole') as string || existingPlayer.bureauRole,
        preferredPosition: formData.get('preferredPosition') as string || existingPlayer.preferredPosition,
        description: formData.get('description') as string || existingPlayer.description,
        number: formData.get('number') 
          ? parseInt(formData.get('number') as string) 
          : existingPlayer.number,
        status: formData.get('status') as string || existingPlayer.status,
        profilePhoto: profilePhotoUrl,
        phone: formData.get('phone') as string || existingPlayer.phone,
      },
    });

    return NextResponse.json({ success: true, data: updatedPlayer });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Échec de la mise à jour" },
      { status: 500 }
    );
  }
}


// DELETE /api/players/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.player.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: "Joueur supprimé" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression du joueur" },
      { status: 500 }
    );
  }
}

// Fonction pour sauvegarder le fichier
async function saveFile(file: File, fileName: string) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Chemin vers le dossier public/uploads/players
  const uploadDir = path.join(process.cwd(), "public", "uploads", "players");

  // Créer le dossier s'il n'existe pas
  await createDirIfNotExists(uploadDir);

  // Chemin complet du fichier
  const filePath = path.join(uploadDir, fileName);
  // Écrire le fichier
  await writeFile(filePath, new Uint8Array(buffer));
}

// Fonction pour créer le dossier s'il n'existe pas
async function createDirIfNotExists(dir: string) {
  try {
    await access(dir);
  } catch {
    await mkdir(dir, { recursive: true });
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
      
      const buffer = Buffer.from(await file.arrayBuffer());
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

