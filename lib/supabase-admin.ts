import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Client Supabase côté serveur uniquement, avec la clé service_role.
// NE JAMAIS importer ce fichier dans un composant client : la clé service_role
// contourne les RLS et ne doit jamais être exposée au navigateur.
//
// Le client est créé de façon paresseuse (au premier appel) pour ne pas exiger
// la clé au moment du build Next.js.
let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (_supabaseAdmin) return _supabaseAdmin;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Configuration Supabase manquante (NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY)"
    );
  }

  _supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  return _supabaseAdmin;
}

// Bucket de stockage des photos de joueurs (à créer dans Supabase Storage).
export const PLAYERS_BUCKET = "players";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

/**
 * Téléverse une photo de profil de joueur dans Supabase Storage et renvoie
 * l'URL publique. Lance une erreur en cas de type non supporté ou d'échec d'upload.
 */
export async function uploadPlayerPhoto(file: File): Promise<string> {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Format d'image non supporté");
  }

  const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();
  const supabaseAdmin = getSupabaseAdmin();

  const { error } = await supabaseAdmin.storage
    .from(PLAYERS_BUCKET)
    .upload(fileName, arrayBuffer, {
      contentType: file.type,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Échec de l'upload de la photo : ${error.message}`);
  }

  const { data } = supabaseAdmin.storage
    .from(PLAYERS_BUCKET)
    .getPublicUrl(fileName);

  return data.publicUrl;
}