import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Total derbys
    const totalDerbys = await prisma.derby.count();

    // Derbys terminés vs en cours
    const derbysCompletes = await prisma.derby.count({
      where: { status: "COMPLETED" },
    });

    const derbysEnCours = await prisma.derby.count({
      where: { status: "PENDING" },
    });

    // Récupérer tous les derbys terminés avec leurs équipes
    const derbys = await prisma.derby.findMany({
      where: { status: "COMPLETED" },
      include: {
        team1: true,
        team2: true
      },
    });

    // Compter les victoires par équipe
    let victoiresAigles = 0;
    let victoiresLions = 0;
    let matchsNuls = 0;

    for (const derby of derbys) {
      // Identifier les équipes par leur nom, pas leur position
      const aiglesId = derby.team1.name === "Aigles" ? derby.team1.id : derby.team2.id;
      const lionsId = derby.team1.name === "Lions" ? derby.team1.id : derby.team2.id;

      if (derby.winnerId === aiglesId) {
        victoiresAigles++;
      } else if (derby.winnerId === lionsId) {
        victoiresLions++;
      } else {
        // winnerId est null = match nul
        matchsNuls++;
      }
    }

    // Calculer les pourcentages (sur derbys terminés)
    const pourcentageAigles = derbysCompletes > 0
      ? (victoiresAigles / derbysCompletes) * 100
      : 0;

    const pourcentageLions = derbysCompletes > 0
      ? (victoiresLions / derbysCompletes) * 100
      : 0;

    // Joueurs total et actifs (status = "ACTIF")
    const totalJoueurs = await prisma.player.count();
    const joueursActifs = await prisma.player.count({
      where: {
        status: "ACTIF",
      },
    });

    // Joueurs nouveaux (exemple : joueurs inscrits dans le dernier mois)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const joueursNouveaux = await prisma.player.count({
      where: {
        joinDate: {
          gte: oneMonthAgo,
        },
      },
    });

    // Matchs joués et à venir
    const now = new Date();

    const matchsJoues = await prisma.match.count({
      where: {
        date: {
          lt: now,
        },
      },
    });

    const matchsAVenir = await prisma.match.count({
      where: {
        date: {
          gte: now,
        },
      },
    });

    // Moyenne de buts par match (sur tous les matchs joués) — derbys + exhibitions internes
    const totalButsDerby = await prisma.goal.count({
      where: {
        match: {
          date: {
            lt: now,
          },
        },
      },
    });

    const totalButsInterne = await prisma.friendlyMatchGoal.count({
      where: {
        friendlyMatch: {
          isInternal: true,
          status: "COMPLETED",
        },
      },
    });

    const totalButs = totalButsDerby + totalButsInterne;
    const moyenneButs = matchsJoues > 0 ? totalButs / matchsJoues : 0;

    // Classement (exemple simplifié)
    // Supposons que tu as un modèle ou une logique pour calculer la position, points, différence de buts
    // Ici on met des valeurs statiques à adapter selon ta logique métier
    const classement = {
      position: 2,
      points: 45,
      differenceButs: 12,
    };

    return NextResponse.json({
      derbys: {
        total: totalDerbys,
        completes: derbysCompletes,
        enCours: derbysEnCours,
        victoiresAigles,
        victoiresLions,
        nuls: matchsNuls,
        pourcentageAigles: +pourcentageAigles.toFixed(1),
        pourcentageLions: +pourcentageLions.toFixed(1),
      },
      joueurs: {
        total: totalJoueurs,
        actifs: joueursActifs,
        nouveaux: joueursNouveaux,
      },
      matchs: {
        joues: matchsJoues,
        aVenir: matchsAVenir,
        moyenneButs: +moyenneButs.toFixed(2),
      },
      classement,
    });
  } catch (error) {
    console.error("Erreur API statistiques:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
