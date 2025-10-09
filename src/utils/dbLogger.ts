// Logger per database che usa Prisma
// Import dinamico per evitare circular dependency

export class DatabaseLogger {
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
      console.error('Error saving log to database:', error);
    }
  }
}

export default DatabaseLogger;
