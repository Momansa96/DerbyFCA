import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Validation de l'email
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);

      const user = await prisma.user.create({
        data: { fullName, email, passwordHash },
      });

      return NextResponse.json({ 
        message: "Utilisateur créé",
        user: { id: user.id, email: user.email, fullName: user.fullName }
      }, { status: 201 });
    } catch (dbError) {
      console.error("Erreur base de données:", dbError);
      return NextResponse.json({ error: "Erreur lors de la création de l'utilisateur" }, { status: 500 });
    }
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}