import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { checkRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/applications
 * Créer une nouvelle demande d'adhésion (public)
 */
export async function POST(req: NextRequest) {
  try {
    // Rate limiting par IP (5 demandes par heure)
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const rateLimitResult = checkRateLimit(`adhesion:${ip}`, {
      maxAttempts: 5,
      windowMs: 60 * 60 * 1000, // 1 heure
      blockDurationMs: 60 * 60 * 1000, // Bloqué 1 heure
    });

    if (!rateLimitResult.success) {
      const blockedMinutes = rateLimitResult.blockedUntil
        ? Math.ceil((rateLimitResult.blockedUntil - Date.now()) / (60 * 1000))
        : 60;
      return NextResponse.json(
        { error: `Trop de demandes. Réessayez dans ${blockedMinutes} minute(s).` },
        { status: 429 }
      );
    }

    const data = await req.json();

    // Validation des champs requis
    const requiredFields = [
      "lastName",
      "firstName",
      "email",
      "whatsapp",
      "profession",
      "motivation",
      "availability",
      "acceptedTerms",
    ];

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Le champ ${field} est requis` },
          { status: 400 }
        );
      }
    }

    // Vérifier que les conditions sont acceptées
    if (data.acceptedTerms !== true) {
      return NextResponse.json(
        { error: "Vous devez accepter les conditions d'adhésion" },
        { status: 400 }
      );
    }

    // Validation de l'email
    if (!/\S+@\S+\.\S+/.test(data.email)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    // Validation de la disponibilité
    const validAvailability = ["AVAILABLE", "NOT_AVAILABLE", "SOMETIMES"];
    if (!validAvailability.includes(data.availability)) {
      return NextResponse.json(
        { error: "Disponibilité invalide" },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existing = await prisma.membershipApplication.findFirst({
      where: { email: data.email.toLowerCase().trim() },
    });

    if (existing) {
      // Ne pas révéler que l'email existe déjà (prévention email enumeration)
      // Retourner un succès générique
      return NextResponse.json(
        {
          message: "Demande d'adhésion envoyée avec succès",
          application: {
            id: existing.id,
            firstName: data.firstName,
            email: data.email,
          },
        },
        { status: 201 }
      );
    }

    // Validation du format WhatsApp (E.164 international format)
    const whatsappRegex = /^\+[1-9]\d{1,14}$/;
    if (!whatsappRegex.test(data.whatsapp.trim())) {
      return NextResponse.json(
        { error: "Format WhatsApp invalide. Utilisez le format international (ex: +22912345678)" },
        { status: 400 }
      );
    }

    // Créer la demande
    const application = await prisma.membershipApplication.create({
      data: {
        lastName: data.lastName.trim(),
        firstName: data.firstName.trim(),
        email: data.email.toLowerCase().trim(),
        whatsapp: data.whatsapp.trim(),
        profession: data.profession.trim(),
        motivation: data.motivation.trim(),
        availability: data.availability,
        acceptedTerms: true,
        acceptedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        message: "Demande d'adhésion envoyée avec succès",
        application: {
          id: application.id,
          firstName: application.firstName,
          email: application.email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur création demande:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la demande" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/applications
 * Récupérer toutes les demandes (admin uniquement)
 */
export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Paramètres de requête
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const viewedFilter = searchParams.get("viewed"); // "true", "false", ou null (tous)

    const skip = (page - 1) * limit;

    // Construction du filtre
    const where: any = {};

    // Filtre de recherche (nom, prénom, email)
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Filtre viewed/non viewed
    if (viewedFilter === "true") {
      where.isViewed = true;
    } else if (viewedFilter === "false") {
      where.isViewed = false;
    }

    // Récupérer les demandes avec pagination
    const [applications, total] = await Promise.all([
      prisma.membershipApplication.findMany({
        where,
        orderBy: [{ isViewed: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.membershipApplication.count({ where }),
    ]);

    return NextResponse.json({
      applications,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Erreur récupération demandes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des demandes" },
      { status: 500 }
    );
  }
}