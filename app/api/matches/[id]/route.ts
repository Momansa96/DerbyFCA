import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { scoreTeam1, scoreTeam2, goals, yellowCards, redCards } = await request.json();
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
      const playerIds = Array.from(
        new Set(goals.map((goal: any) => goal.playerId))
      ) as string[];
      const teamIds = Array.from(
        new Set(goals.map((goal: any) => goal.teamId))
      ) as string[];

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

    // Supprimer les buts, cartons jaunes et cartons rouges existants
    await prisma.goal.deleteMany({
      where: { matchId },
    });
    await prisma.yellowCard.deleteMany({
      where: { matchId },
    });
    await prisma.redCard.deleteMany({
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
          assistPlayerId: goal.assistPlayerId || null,
        })),
      });
    }

    // Créer les cartons jaunes
    if (yellowCards && yellowCards.length > 0) {
      console.log("Creating yellow cards:", yellowCards);
      await prisma.yellowCard.createMany({
        data: yellowCards.map((card: any) => ({
          matchId,
          playerId: card.playerId,
          minute: card.minute || null,
          reason: card.reason || null,
        })),
      });
    }

    // Créer les cartons rouges
    if (redCards && redCards.length > 0) {
      console.log("Creating red cards:", redCards);
      await prisma.redCard.createMany({
        data: redCards.map((card: any) => ({
          matchId,
          playerId: card.playerId,
          minute: card.minute || null,
          reason: card.reason || null,
        })),
      });
    }

    // Récupérer le match mis à jour avec les buts et cartons
    const matchWithGoals = await prisma.match.findUnique({
      where: { id: matchId },
      include: {
        goals: {
          include: {
            player: true,
            assistPlayer: true,
          },
        },
        yellowCards: {
          include: {
            player: true,
          },
        },
        redCards: {
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
      (match: any) => match.status === "COMPLETED"
    );

    // Si tous les matchs sont terminés, calculer le vainqueur du derby
    if (allMatchesCompleted) {
      // Récupérer les IDs des équipes du derby
      const derby = await prisma.derby.findUnique({
        where: { id: existingMatch.derbyId },
        include: { team1: true, team2: true },
      });
      if (!derby) {
        return NextResponse.json(
          { error: "Derby non trouvé" },
          { status: 404 }
        );
      }
      // Identifier les équipes par leur nom, pas leur position
      const aiglesId = derby.team1.name === "Aigles" ? derby.team1.id : derby.team2.id;
      const lionsId = derby.team1.name === "Lions" ? derby.team1.id : derby.team2.id;

      // Compter les victoires par équipe
      const aiglesWins = allMatches.filter(
        (match: any) => match.winnerId === aiglesId
      ).length;
      const lionsWins = allMatches.filter(
        (match: any) => match.winnerId === lionsId
      ).length;

      let winnerId: string | null = null;

      console.log("=== CALCUL VAINQUEUR DERBY ===");
      console.log("Aigles ID:", aiglesId);
      console.log("Lions ID:", lionsId);
      console.log("Victoires Aigles:", aiglesWins);
      console.log("Victoires Lions:", lionsWins);

      if (aiglesWins > lionsWins) {
        winnerId = aiglesId;
        console.log("→ Vainqueur par victoires: AIGLES");
      } else if (lionsWins > aiglesWins) {
        winnerId = lionsId;
        console.log("→ Vainqueur par victoires: LIONS");
      } else {
        // Égalité de victoires, départage par différence de buts
        console.log("→ Égalité de victoires, départage par buts...");
        let aiglesGoals = 0;
        let lionsGoals = 0;

        for (const match of allMatches) {
          console.log(`Match: score1=${match.score1}, score2=${match.score2}, team1Id=${match.team1Id}, winnerId=${match.winnerId}`);

          // Déterminer qui est qui dans ce match spécifique
          if (match.team1Id === aiglesId) {
            // Aigles sont team1 dans ce match
            aiglesGoals += match.score1 ?? 0;
            lionsGoals += match.score2 ?? 0;
            console.log(`  → Aigles +${match.score1 ?? 0}, Lions +${match.score2 ?? 0}`);
          } else if (match.team1Id === lionsId) {
            // Lions sont team1 dans ce match (équipes inversées)
            lionsGoals += match.score1 ?? 0;
            aiglesGoals += match.score2 ?? 0;
            console.log(`  → Lions +${match.score1 ?? 0}, Aigles +${match.score2 ?? 0} (inversé)`);
          }
        }

        console.log("Total buts Aigles:", aiglesGoals);
        console.log("Total buts Lions:", lionsGoals);

        if (aiglesGoals > lionsGoals) {
          winnerId = aiglesId;
          console.log("→ Vainqueur par buts: AIGLES");
        } else if (lionsGoals > aiglesGoals) {
          winnerId = lionsId;
          console.log("→ Vainqueur par buts: LIONS");
        } else {
          console.log("→ ÉGALITÉ PARFAITE (winnerId = null)");
        }
        // Sinon, toujours égalité parfaite (winnerId = null)
      }

      console.log("WINNER ID FINAL:", winnerId);
      console.log("==============================");

      await prisma.derby.update({
        where: { id: existingMatch.derbyId },
        data: {
          status: "COMPLETED",
          winnerId,
        },
      });
    }

    return NextResponse.json(matchWithGoals);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du match:", error);
    console.error("Stack trace:", error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        error: "Erreur lors de la mise à jour du match",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
