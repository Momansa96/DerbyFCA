/**
 * Validation de la politique de mot de passe
 * Requis: 8+ caractères, 1 majuscule, 1 minuscule, 1 chiffre
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valide la force d'un mot de passe
 * @param password - Le mot de passe à valider
 * @returns Résultat avec statut et liste d'erreurs
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  // Minimum 8 caractères
  if (password.length < 8) {
    errors.push("Au moins 8 caractères");
  }

  // Au moins une majuscule
  if (!/[A-Z]/.test(password)) {
    errors.push("Au moins 1 lettre majuscule");
  }

  // Au moins une minuscule
  if (!/[a-z]/.test(password)) {
    errors.push("Au moins 1 lettre minuscule");
  }

  // Au moins un chiffre
  if (!/[0-9]/.test(password)) {
    errors.push("Au moins 1 chiffre");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Obtient la force du mot de passe (0-4)
 * @param password - Le mot de passe à évaluer
 * @returns Score de 0 (très faible) à 4 (fort)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;

  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

  return Math.min(strength, 4);
}

/**
 * Obtient le label de force du mot de passe
 * @param strength - Score de force (0-4)
 * @returns Label et couleur
 */
export function getPasswordStrengthLabel(strength: number): {
  label: string;
  color: string;
} {
  switch (strength) {
    case 0:
    case 1:
      return { label: "Très faible", color: "red" };
    case 2:
      return { label: "Faible", color: "orange" };
    case 3:
      return { label: "Moyen", color: "yellow" };
    case 4:
      return { label: "Fort", color: "green" };
    default:
      return { label: "Inconnu", color: "gray" };
  }
}