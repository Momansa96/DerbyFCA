import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/teams/[id] - Modifier la composition d'une équipe
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { playersToAdd, playersToRemove } = await req.json();
    const teamId = params.id;

    // Vérifier que l'équipe existe
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        players: true,
        team1Matches: {
          include: {
            goals: true,
            yellowCards: true,
            redCards: true,
          },
        },
        team2Matches: {
          include: {
            goals: true,
            yellowCards: true,
            redCards: true,
          },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    // Valider les joueurs à retirer
    if (playersToRemove && playersToRemove.length > 0) {
      // Récupérer tous les matchs de l'équipe (team1 ou team2)
      const allMatches = [...team.team1Matches, ...team.team2Matches];

      for (const playerId of playersToRemove) {
        // Vérifier si le joueur a des statistiques dans les matchs complétés
        const hasStats = allMatches.some((match) => {
          if (match.status !== "COMPLETED") return false;

          return (
            match.goals.some((goal) => goal.playerId === playerId || goal.assistPlayerId === playerId) ||
            match.yellowCards.some((card) => card.playerId === playerId) ||
            match.redCards.some((card) => card.playerId === playerId)
          );
        });

        if (hasStats) {
          const player = await prisma.player.findUnique({
            where: { id: playerId },
            select: { fullName: true },
          });

          return NextResponse.json(
            {
              error: `Impossible de retirer ${player?.fullName}. Ce joueur a déjà des statistiques dans des matchs complétés.`,
            },
            { status: 400 }
          );
        }
      }

      // Vérifier que l'équipe aura au moins 5 joueurs après suppression
      const remainingPlayersCount =
        team.players.length -
        playersToRemove.length +
        (playersToAdd?.length || 0);

      if (remainingPlayersCount < 5) {
        return NextResponse.json(
          {
            error: `Une équipe doit avoir au moins 5 joueurs. Après cette modification, l'équipe n'aura que ${remainingPlayersCount} joueur(s).`,
          },
          { status: 400 }
        );
      }
    }

    // Vérifier que les joueurs à ajouter existent
    if (playersToAdd && playersToAdd.length > 0) {
      const existingPlayers = await prisma.player.findMany({
        where: {
          id: { in: playersToAdd },
          status: "ACTIF",
        },
      });

      if (existingPlayers.length !== playersToAdd.length) {
        return NextResponse.json(
          { error: "Un ou plusieurs joueurs n'existent pas ou ne sont pas actifs" },
          { status: 400 }
        );
      }

      // Vérifier que les joueurs ne sont pas déjà dans une autre équipe du même derby
      const derby = await prisma.derby.findFirst({
        where: {
          OR: [{ team1Id: teamId }, { team2Id: teamId }],
        },
        include: {
          team1: { include: { players: true } },
          team2: { include: { players: true } },
        },
      });

      if (derby) {
        const otherTeam = derby.team1Id === teamId ? derby.team2 : derby.team1;
        const otherTeamPlayerIds = otherTeam.players.map((p) => p.id);

        const conflictingPlayers = playersToAdd.filter((id: string) =>
          otherTeamPlayerIds.includes(id)
        );

        if (conflictingPlayers.length > 0) {
          return NextResponse.json(
            {
              error: "Un ou plusieurs joueurs font déjà partie de l'équipe adverse dans ce derby",
            },
            { status: 400 }
          );
        }
      }
    }

    // Mettre à jour l'équipe
    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: {
        players: {
          ...(playersToAdd && playersToAdd.length > 0
            ? { connect: playersToAdd.map((id: string) => ({ id })) }
            : {}),
          ...(playersToRemove && playersToRemove.length > 0
            ? { disconnect: playersToRemove.map((id: string) => ({ id })) }
            : {}),
        },
      },
      include: {
        players: true,
      },
    });

    return NextResponse.json({
      success: true,
      team: updatedTeam,
      message: "Équipe mise à jour avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'équipe:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour de l'équipe",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// GET /api/teams/[id] - Récupérer les détails d'une équipe
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const teamId = params.id;

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        players: {
          orderBy: { fullName: "asc" },
        },
      },
    });

    if (!team) {
      return NextResponse.json(
        { error: "Équipe non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(team);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'équipe:", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de l'équipe",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}