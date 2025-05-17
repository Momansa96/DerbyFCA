import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Total derbys
    const totalDerbys = await prisma.derby.count();

    // Derbys gagnés (exemple : on considère que winnerId non null = gagné)
    const derbysGagnes = await prisma.derby.count({
      where: {
        winnerId: { not: null },
      },
    });

    const derbysPerdus = totalDerbys - derbysGagnes;
    const pourcentageVictoire = totalDerbys > 0 ? (derbysGagnes / totalDerbys) * 100 : 0;

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

    // Moyenne de buts par match (sur tous les matchs joués)
    const totalButs = await prisma.goal.count({
      where: {
        match: {
          date: {
            lt: now,
          },
        },
      },
    });

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
        gagnes: derbysGagnes,
        perdus: derbysPerdus,
        pourcentage: +pourcentageVictoire.toFixed(1),
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
