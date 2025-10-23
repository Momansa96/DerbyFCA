import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

/**
 * Vérifie qu'un utilisateur est authentifié et a les droits admin
 * À utiliser dans les API routes qui nécessitent une authentification
 *
 * @returns Session si authentifié, sinon NextResponse avec erreur 401/403
 */
export async function requireAdmin() {
  const session = await getServerSession(authOptions);

  // Pas de session = pas connecté
  if (!session || !session.user) {
    return {
      error: NextResponse.json(
        { error: 'Non authentifié. Veuillez vous connecter.' },
        { status: 401 }
      ),
      session: null,
    };
  }

  // Note: Pour l'instant tous les users connectés sont considérés comme admin
  // Si vous ajoutez un champ "role" plus tard, vérifiez ici :
  // if (session.user.role !== 'ADMIN') {
  //   return {
  //     error: NextResponse.json(
  //       { error: 'Accès refusé. Droits administrateur requis.' },
  //       { status: 403 }
  //     ),
  //     session: null,
  //   };
  // }

  return {
    error: null,
    session,
  };
}