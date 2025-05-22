import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const count = await prisma.player.count();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Erreur lors du comptage des joueurs:", error);
    return NextResponse.json(
      { error: "Erreur lors du comptage des joueurs" },
      { status: 500 }
    );
  }
}
