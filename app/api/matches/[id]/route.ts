import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { scoreTeam1, scoreTeam2, goals } = await request.json();
    const matchId = params.id;

    // Vérifier d'abord si le match existe
    const existingMatch = await prisma.match.findUnique({
      where: { id: matchId },
      include: { derby: true },
    });

    if (!existingMatch) {
      return NextResponse.json({ error: "Match non trouvé" }, { status: 404 });
    }

    // Vérifier que tous les joueurs et équipes existent
    if (goals && goals.length > 0) {
      const playerIds = [...new Set(goals.map((goal: any) => goal.playerId))];
      const teamIds = [...new Set(goals.map((goal: any) => goal.teamId))];

      const existingPlayers = await prisma.player.findMany({
        where: { id: { in: playerIds } },
      });

      const existingTeams = await prisma.team.findMany({
        where: { id: { in: teamIds } },
      });

      if (existingPlayers.length !== playerIds.length) {
        return NextResponse.json(
          { error: "Un ou plusieurs joueurs n'existent pas" },
          { status: 400 }
        );
      }

      if (existingTeams.length !== teamIds.length) {
        return NextResponse.json(
          { error: "Une ou plusieurs équipes n'existent pas" },
          { status: 400 }
        );
      }
    }

    // Supprimer les buts existants
    await prisma.goal.deleteMany({
      where: { matchId },
    });

    // Mettre à jour le match
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        score1: scoreTeam1,
        score2: scoreTeam2,
        status: "COMPLETED",
        winnerId:
          scoreTeam1 > scoreTeam2
            ? existingMatch.team1Id
            : scoreTeam2 > scoreTeam1
            ? existingMatch.team2Id
            : null,
      },
    });

    // Créer les nouveaux buts
    if (goals && goals.length > 0) {
      await prisma.goal.createMany({
        data: goals.map((goal: any) => ({
          matchId,
          playerId: goal.playerId,
          teamId: goal.teamId,
          isOwnGoal: goal.isOwnGoal,
        })),
      });
    }

    // Récupérer le match mis à jour avec les buts
    const matchWithGoals = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        goals: {
          include: {
            player: true,
          },
        },
      },
    });

    // Vérifier si tous les matchs du derby sont terminés
    const allMatches = await prisma.match.findMany({
      where: { derbyId: existingMatch.derbyId },
    });

    const allMatchesCompleted = allMatches.every(
      (match) => match.status === "COMPLETED"
    );

    // Si tous les matchs sont terminés, mettre à jour le statut du derby
    if (allMatchesCompleted) {
      const team1Wins = allMatches.filter(
        (match) => match.winnerId === existingMatch.team1Id
      ).length;
      const team2Wins = allMatches.filter(
        (match) => match.winnerId === existingMatch.team2Id
      ).length;

      await prisma.derby.update({
        where: { id: existingMatch.derbyId },
        data: {
          status: "COMPLETED",
          winnerId:
            team1Wins > team2Wins
              ? existingMatch.team1Id
              : team2Wins > team1Wins
              ? existingMatch.team2Id
              : null,
        },
      });
    }

    return NextResponse.json(matchWithGoals);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du match:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du match" },
      { status: 500 }
    );
  }
}
