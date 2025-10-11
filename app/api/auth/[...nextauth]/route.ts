import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { checkRateLimit, resetRateLimit } from "../../../../lib/rate-limit";
import { createAuditLog } from "../../../../lib/audit-log";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Obtenir l'IP du client pour le rate limiting
        const ip = req.headers?.["x-forwarded-for"] ||
                   req.headers?.["x-real-ip"] ||
                   "unknown";
        const identifier = typeof ip === "string" ? ip : ip?.[0] || "unknown";
        const userAgent = req.headers?.["user-agent"] || "unknown";

        // Vérifier le rate limiting (5 tentatives par minute)
        const rateLimitResult = checkRateLimit(identifier, {
          maxAttempts: 5,
          windowMs: 60 * 1000, // 1 minute
          blockDurationMs: 15 * 60 * 1000, // Blocage 15 minutes
        });

        if (!rateLimitResult.success) {
          const blockedMinutes = rateLimitResult.blockedUntil
            ? Math.ceil((rateLimitResult.blockedUntil - Date.now()) / 60000)
            : 15;

          // Log du rate limit dépassé
          await createAuditLog({
            action: "RATE_LIMIT_EXCEEDED",
            email: credentials.email,
            ip: identifier,
            userAgent,
            details: { reason: "login_attempts", blockedMinutes },
          });

          throw new Error(
            `Trop de tentatives de connexion. Réessayez dans ${blockedMinutes} minute(s).`
          );
        }

        // Recherche utilisateur en base
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          // Log de tentative échouée (utilisateur inexistant)
          await createAuditLog({
            action: "LOGIN_FAILED",
            email: credentials.email,
            ip: identifier,
            userAgent,
            details: { reason: "user_not_found" },
          });
          return null;
        }

        // Vérifier si le compte est révoqué
        if (user.status === "REVOKED") {
          await createAuditLog({
            action: "LOGIN_FAILED",
            userId: user.id,
            email: credentials.email,
            ip: identifier,
            userAgent,
            details: { reason: "account_revoked" },
          });
          throw new Error("Votre compte a été révoqué. Contactez un administrateur.");
        }

        // Vérifie le mot de passe (ex : bcrypt)
        const isValid = await verifyPassword(credentials.password, user.passwordHash);

        if (!isValid) {
          // Log de tentative échouée (mauvais mot de passe)
          await createAuditLog({
            action: "LOGIN_FAILED",
            userId: user.id,
            email: credentials.email,
            ip: identifier,
            userAgent,
            details: { reason: "invalid_password" },
          });
          return null;
        }

        // Connexion réussie : réinitialiser le rate limit
        resetRateLimit(identifier);

        // Log de connexion réussie
        await createAuditLog({
          action: "LOGIN_SUCCESS",
          userId: user.id,
          email: credentials.email,
          ip: identifier,
          userAgent,
        });

        // Retourne l'objet user (sans le hash)
        return { id: user.id, name: user.fullName, email: user.email };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 jours (en secondes)
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 jours (en secondes)
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async jwt({ token, user }: { token: any, user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/sign-in",
    signOut: "/auth/sign-out",
  },
} satisfies NextAuthOptions;

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
