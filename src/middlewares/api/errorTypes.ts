/**
 * Tipi di errore standardizzati per le API
 */

export enum ErrorCode {
  // Errori di validazione
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  // Errori di autenticazione e autorizzazione
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Errori di risorsa
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  RESOURCE_LOCKED = 'RESOURCE_LOCKED',
  
  // Errori di input
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Errori di rate limiting
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Errori di database
  DATABASE_ERROR = 'DATABASE_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  QUERY_ERROR = 'QUERY_ERROR',
  CONSTRAINT_ERROR = 'CONSTRAINT_ERROR',
  
  // Errori di business logic
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  OPERATION_NOT_ALLOWED = 'OPERATION_NOT_ALLOWED',
  INSUFFICIENT_PERMISSIONS = 'INSUFFICIENT_PERMISSIONS',
  
  // Errori di sistema
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  
  // Errori di configurazione
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  FEATURE_DISABLED = 'FEATURE_DISABLED'
}

export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: any;
  field?: string;
  timestamp: string;
  requestId?: string;
}

export interface ErrorResponse {
  success: false;
  error: ApiError;
  meta: {
    timestamp: string;
    requestId?: string;
    version: string;
  };
}

/**
 * Mappatura dei codici di errore ai messaggi utente-friendly
 */
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.VALIDATION_ERROR]: 'I dati forniti non sono validi',
  [ErrorCode.UNAUTHORIZED]: 'Autenticazione richiesta',
  [ErrorCode.FORBIDDEN]: 'Accesso negato',
  [ErrorCode.TOKEN_EXPIRED]: 'Token scaduto',
  [ErrorCode.INVALID_TOKEN]: 'Token non valido',
  [ErrorCode.NOT_FOUND]: 'Risorsa non trovata',
  [ErrorCode.RESOURCE_CONFLICT]: 'Conflitto nella risorsa',
  [ErrorCode.RESOURCE_LOCKED]: 'Risorsa bloccata',
  [ErrorCode.INVALID_INPUT]: 'Input non valido',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'Campo obbligatorio mancante',
  [ErrorCode.INVALID_FORMAT]: 'Formato non valido',
  [ErrorCode.TOO_MANY_REQUESTS]: 'Troppe richieste',
  [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Limite di richieste superato',
  [ErrorCode.DATABASE_ERROR]: 'Errore del database',
  [ErrorCode.CONNECTION_ERROR]: 'Errore di connessione',
  [ErrorCode.QUERY_ERROR]: 'Errore nella query',
  [ErrorCode.CONSTRAINT_ERROR]: 'Violazione di vincolo',
  [ErrorCode.BUSINESS_RULE_VIOLATION]: 'Violazione di regola di business',
  [ErrorCode.OPERATION_NOT_ALLOWED]: 'Operazione non consentita',
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: 'Permessi insufficienti',
  [ErrorCode.INTERNAL_ERROR]: 'Errore interno del server',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Servizio non disponibile',
  [ErrorCode.TIMEOUT]: 'Timeout della richiesta',
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: 'Errore del servizio esterno',
  [ErrorCode.CONFIGURATION_ERROR]: 'Errore di configurazione',
  [ErrorCode.FEATURE_DISABLED]: 'Funzionalità disabilitata'
};

/**
 * Mappatura dei codici di errore ai codici HTTP
 */
export const ERROR_HTTP_STATUS: Record<ErrorCode, HttpStatusCode> = {
  [ErrorCode.VALIDATION_ERROR]: HttpStatusCode.BAD_REQUEST,
  [ErrorCode.UNAUTHORIZED]: HttpStatusCode.UNAUTHORIZED,
  [ErrorCode.FORBIDDEN]: HttpStatusCode.FORBIDDEN,
  [ErrorCode.TOKEN_EXPIRED]: HttpStatusCode.UNAUTHORIZED,
  [ErrorCode.INVALID_TOKEN]: HttpStatusCode.UNAUTHORIZED,
  [ErrorCode.NOT_FOUND]: HttpStatusCode.NOT_FOUND,
  [ErrorCode.RESOURCE_CONFLICT]: HttpStatusCode.CONFLICT,
  [ErrorCode.RESOURCE_LOCKED]: HttpStatusCode.CONFLICT,
  [ErrorCode.INVALID_INPUT]: HttpStatusCode.BAD_REQUEST,
  [ErrorCode.MISSING_REQUIRED_FIELD]: HttpStatusCode.BAD_REQUEST,
  [ErrorCode.INVALID_FORMAT]: HttpStatusCode.BAD_REQUEST,
  [ErrorCode.TOO_MANY_REQUESTS]: HttpStatusCode.TOO_MANY_REQUESTS,
  [ErrorCode.RATE_LIMIT_EXCEEDED]: HttpStatusCode.TOO_MANY_REQUESTS,
  [ErrorCode.DATABASE_ERROR]: HttpStatusCode.INTERNAL_SERVER_ERROR,
  [ErrorCode.CONNECTION_ERROR]: HttpStatusCode.SERVICE_UNAVAILABLE,
  [ErrorCode.QUERY_ERROR]: HttpStatusCode.INTERNAL_SERVER_ERROR,
  [ErrorCode.CONSTRAINT_ERROR]: HttpStatusCode.BAD_REQUEST,
  [ErrorCode.BUSINESS_RULE_VIOLATION]: HttpStatusCode.UNPROCESSABLE_ENTITY,
  [ErrorCode.OPERATION_NOT_ALLOWED]: HttpStatusCode.FORBIDDEN,
  [ErrorCode.INSUFFICIENT_PERMISSIONS]: HttpStatusCode.FORBIDDEN,
  [ErrorCode.INTERNAL_ERROR]: HttpStatusCode.INTERNAL_SERVER_ERROR,
  [ErrorCode.SERVICE_UNAVAILABLE]: HttpStatusCode.SERVICE_UNAVAILABLE,
  [ErrorCode.TIMEOUT]: HttpStatusCode.GATEWAY_TIMEOUT,
  [ErrorCode.EXTERNAL_SERVICE_ERROR]: HttpStatusCode.BAD_GATEWAY,
  [ErrorCode.CONFIGURATION_ERROR]: HttpStatusCode.INTERNAL_SERVER_ERROR,
  [ErrorCode.FEATURE_DISABLED]: HttpStatusCode.SERVICE_UNAVAILABLE
};
