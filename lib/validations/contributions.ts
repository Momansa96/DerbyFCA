import { z } from 'zod';

/**
 * Schéma de validation pour une cotisation individuelle
 */
export const ContributionSchema = z.object({
  playerId: z
    .string({
      required_error: 'Le champ playerId est requis',
      invalid_type_error: 'playerId doit être une chaîne de caractères',
    })
    .uuid('playerId doit être un UUID valide'),

  paymentDate: z
    .string({
      required_error: 'Le champ paymentDate est requis',
    })
    .refine(
      (date) => {
        // Accepter format ISO (YYYY-MM-DDTHH:mm:ss.sssZ) ou simple (YYYY-MM-DD)
        const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)?$/;
        return isoRegex.test(date);
      },
      {
        message: 'paymentDate doit être au format YYYY-MM-DD ou ISO 8601',
      }
    )
    .refine(
      (date) => {
        const parsedDate = new Date(date);
        const now = new Date();
        // Autoriser jusqu'à 1 jour dans le futur (timezone)
        const maxFuture = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        return parsedDate <= maxFuture;
      },
      {
        message: 'paymentDate ne peut pas être dans le futur',
      }
    )
    .refine(
      (date) => {
        const parsedDate = new Date(date);
        // Pas plus de 2 ans dans le passé
        const minPast = new Date();
        minPast.setFullYear(minPast.getFullYear() - 2);
        return parsedDate >= minPast;
      },
      {
        message: 'paymentDate ne peut pas dater de plus de 2 ans',
      }
    ),

  amountPaid: z
    .number({
      invalid_type_error: 'amountPaid doit être un nombre',
    })
    .int('amountPaid doit être un nombre entier')
    .min(0, 'amountPaid ne peut pas être négatif')
    .max(100000, 'amountPaid ne peut pas dépasser 100 000 FCFA')
    .optional()
    .default(200),

  notes: z
    .string()
    .max(500, 'Les notes ne peuvent pas dépasser 500 caractères')
    .trim()
    .nullable()
    .optional()
    .transform((val) => {
      // Sanitize: supprimer HTML/scripts potentiels
      if (!val) return val;
      return val
        .replace(/<[^>]*>/g, '') // Supprimer balises HTML
        .replace(/javascript:/gi, '') // Supprimer javascript:
        .replace(/on\w+=/gi, ''); // Supprimer event handlers (onclick=, etc.)
    }),

  recordedBy: z
    .string()
    .uuid('recordedBy doit être un UUID valide')
    .optional(),
});

/**
 * Schéma pour un batch de cotisations
 */
export const ContributionBatchSchema = z.array(ContributionSchema).min(1, 'Le tableau de paiements ne peut pas être vide').max(100, 'Maximum 100 paiements par requête');

/**
 * Type TypeScript inféré du schéma
 */
export type ContributionInput = z.infer<typeof ContributionSchema>;
export type ContributionBatchInput = z.infer<typeof ContributionBatchSchema>;

/**
 * Fonction helper pour valider et retourner des erreurs formatées
 */
export function validateContribution(data: unknown) {
  const result = ContributionSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
      data: null,
    };
  }

  return {
    success: true,
    errors: [],
    data: result.data,
  };
}

/**
 * Fonction helper pour valider un batch
 */
export function validateContributionBatch(data: unknown) {
  const result = ContributionBatchSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
      data: null,
    };
  }

  return {
    success: true,
    errors: [],
    data: result.data,
  };
}