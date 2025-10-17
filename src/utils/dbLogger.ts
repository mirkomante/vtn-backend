// Logger per database che usa Prisma con fallback sicuro
// Import dinamico per evitare circular dependency

export class DatabaseLogger {
  private static fallbackMode = false;
  private static fallbackLogs: Array<{
    level: string;
    message: string;
    category: string;
    metadata: any;
    timestamp: string;
  }> = [];

  static async info(message: string, metadata: any = {}) {
    await this.saveLog('info', message, 'app', metadata);
  }

  static async warn(message: string, metadata: any = {}) {
    await this.saveLog('warn', message, 'app', metadata);
  }

  static async error(message: string, metadata: any = {}) {
    await this.saveLog('error', message, 'error', metadata);
  }

  static async http(message: string, metadata: any = {}) {
    await this.saveLog('http', message, 'access', metadata);
  }

  static async debug(message: string, metadata: any = {}) {
    await this.saveLog('debug', message, 'app', metadata);
  }

  private static async saveLog(level: string, message: string, category: string, metadata: any = {}) {
    try {
      // Se in fallback mode, salva in memoria
      if (this.fallbackMode) {
        this.fallbackLogs.push({
          level,
          message,
          category,
          metadata,
          timestamp: new Date().toISOString()
        });
        
        // Log anche su console per debug
        console.log(`[${level.toUpperCase()}] ${message}`, metadata);
        return;
      }

      // Import dinamico per evitare circular dependency
      const { prisma } = await import('../app');
      
      await prisma.logs.create({
        data: {
          level,
          message,
          category,
          request_id: metadata.requestId,
          user_id: metadata.userId,
          ip_address: metadata.ip,
          user_agent: metadata.userAgent,
          method: metadata.method,
          url: metadata.url,
          status_code: metadata.statusCode,
          duration: metadata.duration,
          metadata: metadata
        }
      });
    } catch (error) {
      // Se errore, attiva fallback mode
      if (!this.fallbackMode) {
        console.warn('⚠️ Database logging fallito, attivando modalità fallback');
        this.fallbackMode = true;
        
        // Salva il log corrente in fallback
        this.fallbackLogs.push({
          level,
          message,
          category,
          metadata,
          timestamp: new Date().toISOString()
        });
      }
      
      // Log su console come fallback
      console.log(`[${level.toUpperCase()}] ${message}`, metadata);
    }
  }

  /**
   * Attiva modalità fallback
   */
  static enableFallbackMode(): void {
    this.fallbackMode = true;
    console.warn('⚠️ Database logger in modalità fallback');
  }

  /**
   * Disattiva modalità fallback
   */
  static disableFallbackMode(): void {
    this.fallbackMode = false;
    console.log('✅ Database logger ripristinato');
  }

  /**
   * Verifica se è in modalità fallback
   */
  static isInFallbackMode(): boolean {
    return this.fallbackMode;
  }

  /**
   * Ottiene i log in fallback
   */
  static getFallbackLogs(): Array<{
    level: string;
    message: string;
    category: string;
    metadata: any;
    timestamp: string;
  }> {
    return [...this.fallbackLogs];
  }

  /**
   * Pulisce i log in fallback
   */
  static clearFallbackLogs(): void {
    this.fallbackLogs = [];
  }

  /**
   * Ripristina i log in fallback al database quando disponibile
   */
  static async restoreFallbackLogs(): Promise<void> {
    if (this.fallbackLogs.length === 0) {
      return;
    }

    try {
      const { prisma } = await import('../app');
      
      // Crea tutti i log in fallback
      await prisma.logs.createMany({
        data: this.fallbackLogs.map(log => ({
          level: log.level,
          message: log.message,
          category: log.category,
          request_id: log.metadata.requestId,
          user_id: log.metadata.userId,
          ip_address: log.metadata.ip,
          user_agent: log.metadata.userAgent,
          method: log.metadata.method,
          url: log.metadata.url,
          status_code: log.metadata.statusCode,
          duration: log.metadata.duration,
          metadata: log.metadata
        }))
      });

      console.log(`✅ Ripristinati ${this.fallbackLogs.length} log dal fallback`);
      this.clearFallbackLogs();
      this.disableFallbackMode();
    } catch (error) {
      console.error('❌ Errore ripristino log fallback:', error);
    }
  }
}

export default DatabaseLogger;
