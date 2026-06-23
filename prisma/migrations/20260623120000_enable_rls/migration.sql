-- Activation de la Row-Level Security (RLS) sur toutes les tables du schéma public.
--
-- Pourquoi : la clé Supabase « anon » est publique (exposée dans le bundle client via
-- NEXT_PUBLIC_SUPABASE_ANON_KEY). Sans RLS, n'importe qui peut lire/écrire/supprimer
-- toutes les tables via l'API PostgREST de Supabase. Supabase a signalé ceci comme
-- vulnérabilité critique (rls_disabled_in_public).
--
-- Effet : ENABLE ROW LEVEL SECURITY (sans aucune policy) = refus total (deny-all) pour
-- les rôles « anon » et « authenticated » de PostgREST. AUCUNE policy n'est créée
-- volontairement : l'application n'accède PAS aux données via PostgREST, elle passe par
-- Prisma (DATABASE_URL, rôle propriétaire) qui CONTOURNE la RLS. Cette migration ne
-- casse donc pas l'app.
--
-- Note : on utilise « ENABLE » et NON « FORCE ROW LEVEL SECURITY ». FORCE appliquerait
-- la RLS même au rôle propriétaire utilisé par Prisma, ce qui bloquerait l'application.

ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Player" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Team" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Derby" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Match" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Goal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FriendlyMatch" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FriendlyMatchPlayer" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "FriendlyMatchGoal" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "MembershipApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContributionWeek" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Contribution" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "YellowCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RedCard" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_PlayerToTeam" ENABLE ROW LEVEL SECURITY;