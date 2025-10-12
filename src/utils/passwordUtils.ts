import bcrypt from 'bcryptjs';

/**
 * Utility per la gestione sicura delle password
 */
export class PasswordUtils {
  private static readonly SALT_ROUNDS = 12;

  /**
   * Hasha una password in modo sicuro
   * @param password Password in chiaro
   * @returns Password hashata
   */
  static async hashPassword(password: string): Promise<string> {
    if (!password || password.trim() === '') {
      throw new Error('Password non può essere vuota');
    }
    
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verifica se una password corrisponde all'hash
   * @param password Password in chiaro
   * @param hashedPassword Password hashata
   * @returns True se la password è corretta
   */
  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    if (!password || !hashedPassword) {
      return false;
    }
    
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Valida la forza della password
   * @param password Password da validare
   * @returns Oggetto con validazione e messaggi
   */
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password è obbligatoria');
      return { isValid: false, errors };
    }
    
    if (password.length < 8) {
      errors.push('Password deve essere di almeno 8 caratteri');
    }
    
    if (password.length > 128) {
      errors.push('Password non può superare i 128 caratteri');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password deve contenere almeno una lettera maiuscola');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password deve contenere almeno una lettera minuscola');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password deve contenere almeno un numero');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password deve contenere almeno un carattere speciale');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
