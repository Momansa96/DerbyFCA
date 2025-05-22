import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Récupérer le dernier derby avec ses matchs
    const lastDerby = await prisma.derby.findFirst({
      include: { matches: true },
      orderBy: { createdAt: "desc" },
    });

    if (!lastDerby || !lastDerby.matches.length) {
      return NextResponse.json({ date: null });
    }

    // Trouver la date la plus récente parmi les matchs
    const lastMatchDate = lastDerby.matches.reduce((latest, match) => {
      const matchDate = new Date(match.date);
      return matchDate > latest ? matchDate : latest;
    }, new Date(0));

    return NextResponse.json({ date: lastMatchDate.toISOString() });
  } catch (error) {
    console.error("Erreur récupération dernier derby :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
