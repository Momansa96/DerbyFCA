import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/players/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: params.id },
    });
    if (!player) {
      return NextResponse.json({ error: "Joueur non trouvé" }, { status: 404 });
    }
    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PUT /api/players/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const player = await prisma.player.update({
      where: { id: params.id },
      data: {
        fullName: data.fullName,
        alias: data.alias || null,
        bureauRole: data.bureauRole || null,
        preferredPosition: data.preferredPosition || null,
        description: data.description || null,
        status: data.status,
        joinDate: data.joinDate ? new Date(data.joinDate) : undefined,
        phone: data.phone || null,
        ...(data.number !== undefined && { number: data.number }),
      },
    });
    return NextResponse.json(player);
  } catch (error) {
    console.error("Erreur lors de la mise à jour:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du joueur" },
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
