import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { validatePassword } from "@/lib/password-validation";
import { createAuditLog } from "@/lib/audit-log";

export async function POST(req: NextRequest) {
  try {
    // Rate limiting par IP (3 inscriptions max par heure)
    const ip = req.headers.get("x-forwarded-for") ||
               req.headers.get("x-real-ip") ||
               "unknown";
    const identifier = ip.split(",")[0].trim();
    const userAgent = req.headers.get("user-agent") || "unknown";

    const rateLimitResult = checkRateLimit(`register:${identifier}`, {
      maxAttempts: 3,
      windowMs: 60 * 60 * 1000, // 1 heure
      blockDurationMs: 60 * 60 * 1000, // Blocage 1 heure
    });

    if (!rateLimitResult.success) {
      const blockedMinutes = rateLimitResult.blockedUntil
        ? Math.ceil((rateLimitResult.blockedUntil - Date.now()) / 60000)
        : 60;

      // Log du rate limit dépassé
      await createAuditLog({
        action: "RATE_LIMIT_EXCEEDED",
        ip: identifier,
        userAgent,
        details: { reason: "register_attempts", blockedMinutes },
      });

      return NextResponse.json(
        { error: `Trop de tentatives d'inscription. Réessayez dans ${blockedMinutes} minute(s).` },
        { status: 429 }
      );
    }

    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Validation de l'email
    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }

    // Validation du mot de passe (politique renforcée)
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      // Log de tentative échouée (validation)
      await createAuditLog({
        action: "REGISTER_FAILED",
        email,
        ip: identifier,
        userAgent,
        details: { reason: "weak_password", errors: passwordValidation.errors },
      });

      return NextResponse.json({
        error: `Mot de passe trop faible. Requis: ${passwordValidation.errors.join(", ")}`
      }, { status: 400 });
    }

    try {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        // Log de tentative échouée (email déjà utilisé)
        await createAuditLog({
          action: "REGISTER_FAILED",
          email,
          ip: identifier,
          userAgent,
          details: { reason: "email_already_exists" },
        });

        return NextResponse.json({ error: "Email déjà utilisé" }, { status: 400 });
      }

      const passwordHash = await hashPassword(password);

      const user = await prisma.user.create({
        data: { fullName, email, passwordHash },
      });

      // Inscription réussie : réinitialiser le rate limit
      resetRateLimit(`register:${identifier}`);

      // Log d'inscription réussie
      await createAuditLog({
        action: "REGISTER_SUCCESS",
        userId: user.id,
        email: user.email,
        ip: identifier,
        userAgent,
        details: { fullName },
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