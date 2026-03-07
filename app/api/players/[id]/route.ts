import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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
    const contentType = req.headers.get("content-type") || "";
    let data: Record<string, any>;
    let profilePhotoUrl: string | undefined;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Gestion de la photo
      const file = formData.get("profilePhoto") as File;
      if (file?.size > 0) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
          return NextResponse.json(
            { error: "Format d'image non supporté" },
            { status: 400 }
          );
        }

        const uploadDir = path.join(process.cwd(), "public", "uploads", "players");
        await mkdir(uploadDir, { recursive: true });

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const filePath = path.join(uploadDir, fileName);

        const arrayBuffer = await file.arrayBuffer();
        await writeFile(filePath, new Uint8Array(arrayBuffer));

        profilePhotoUrl = `/uploads/players/${fileName}`;
      }

      data = {
        fullName: formData.get("fullName") as string,
        alias: formData.get("alias") as string,
        bureauRole: formData.get("bureauRole") as string,
        preferredPosition: formData.get("preferredPosition") as string,
        description: formData.get("description") as string,
        number: formData.get("number") ? parseInt(formData.get("number") as string) : null,
        status: formData.get("status") as string,
        joinDate: formData.get("joinDate") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
      };
    } else {
      data = await req.json();
    }

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
        email: data.email || null,
        phone: data.phone || null,
        ...(data.number !== undefined && { number: data.number }),
        ...(profilePhotoUrl && { profilePhoto: profilePhotoUrl }),
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
