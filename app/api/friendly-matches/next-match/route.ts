import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const now = new Date();

    // Trouver le prochain match dont la date est >= maintenant
    const nextMatch = await prisma.friendlyMatch.findFirst({
      where: {
        date: {
          gte: now.toISOString(),
        },
      },
      orderBy: {
        date: "asc",
      },
      
    });

    if (!nextMatch) {
      return NextResponse.json({ message: "Aucun match à venir" }, { status: 404 });
    }

    return NextResponse.json(nextMatch);
  } catch (error) {
    console.error("Erreur lors de la récupération du prochain match :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
