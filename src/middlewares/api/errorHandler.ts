import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ErrorCode, HttpStatusCode, ERROR_MESSAGES, ERROR_HTTP_STATUS, ApiError, ErrorResponse } from './errorTypes';

/**
 * Classe personalizzata per errori API
 */
export class ApiErrorClass extends Error {
  public code: ErrorCode;
  public statusCode: HttpStatusCode;
  public details?: any;
  public field?: string;
  public isOperational: boolean;

  constructor(
    code: ErrorCode,
    message?: string,
    statusCode?: HttpStatusCode,
    details?: any,
    field?: string,
    isOperational: boolean = true
  ) {
    super(message || ERROR_MESSAGES[code]);
    this.code = code;
    this.statusCode = statusCode || ERROR_HTTP_STATUS[code];
    this.details = details;
    this.field = field;
    this.isOperational = isOperational;
    
    // Mantiene lo stack trace corretto
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Genera un ID univoco per la richiesta
 */
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Crea una risposta di errore standardizzata
 */
const createErrorResponse = (
  error: ApiErrorClass,
  requestId?: string
): ErrorResponse => {
  const apiError: ApiError = {
    code: error.code,
    message: error.message,
    details: error.details,
    field: error.field,
    timestamp: new Date().toISOString(),
    requestId: requestId
  };

  return {
    success: false,
    error: apiError,
    meta: {
      timestamp: new Date().toISOString(),
      requestId: requestId,
      version: 'v1'
    }
  };
};

/**
 * Gestisce errori Prisma specifici
 */
const handlePrismaError = (error: any): ApiErrorClass => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new ApiErrorClass(
          ErrorCode.RESOURCE_CONFLICT,
          'Risorsa già esistente',
          HttpStatusCode.CONFLICT,
          { field: error.meta?.target }
        );
      case 'P2025':
        return new ApiErrorClass(
          ErrorCode.NOT_FOUND,
          'Risorsa non trovata',
          HttpStatusCode.NOT_FOUND
        );
      case 'P2003':
        return new ApiErrorClass(
          ErrorCode.CONSTRAINT_ERROR,
          'Violazione di vincolo di chiave esterna',
          HttpStatusCode.BAD_REQUEST,
          { field: error.meta?.field_name }
        );
      case 'P2014':
        return new ApiErrorClass(
          ErrorCode.CONSTRAINT_ERROR,
          'Violazione di vincolo di relazione',
          HttpStatusCode.BAD_REQUEST
        );
      default:
        return new ApiErrorClass(
          ErrorCode.DATABASE_ERROR,
          'Errore del database',
          HttpStatusCode.INTERNAL_SERVER_ERROR,
          { prismaCode: error.code }
        );
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return new ApiErrorClass(
      ErrorCode.DATABASE_ERROR,
      'Errore sconosciuto del database',
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new ApiErrorClass(
      ErrorCode.DATABASE_ERROR,
      'Errore critico del database',
      HttpStatusCode.INTERNAL_SERVER_ERROR
    );
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new ApiErrorClass(
      ErrorCode.CONNECTION_ERROR,
      'Errore di connessione al database',
      HttpStatusCode.SERVICE_UNAVAILABLE
    );
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new ApiErrorClass(
      ErrorCode.VALIDATION_ERROR,
      'Errore di validazione del database',
      HttpStatusCode.BAD_REQUEST
    );
  }

  return new ApiErrorClass(
    ErrorCode.DATABASE_ERROR,
    'Errore del database',
    HttpStatusCode.INTERNAL_SERVER_ERROR
  );
};

/**
 * Gestisce errori di validazione di express-validator
 */
const handleValidationError = (error: any): ApiErrorClass => {
  return new ApiErrorClass(
    ErrorCode.VALIDATION_ERROR,
    'Dati di input non validi',
    HttpStatusCode.BAD_REQUEST,
    error.details || error.array?.() || error.errors
  );
};

/**
 * Gestisce errori di rate limiting
 */
const handleRateLimitError = (error: any): ApiErrorClass => {
  return new ApiErrorClass(
    ErrorCode.TOO_MANY_REQUESTS,
    error.message || 'Troppe richieste',
    HttpStatusCode.TOO_MANY_REQUESTS,
    {
      limit: error.limit,
      remaining: error.remaining,
      resetTime: error.resetTime
    }
  );
};

/**
 * Logga l'errore per debugging
 */
const logError = (error: ApiErrorClass, req: Request, requestId?: string) => {
  const logData = {
    requestId,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    error: {
      code: error.code,
      message: error.message,
      statusCode: error.statusCode,
      details: error.details,
      field: error.field,
      stack: error.stack
    },
    timestamp: new Date().toISOString()
  };

  if (error.statusCode >= 500) {
    console.error('[API ERROR]', JSON.stringify(logData, null, 2));
  } else {
    console.warn('[API WARNING]', JSON.stringify(logData, null, 2));
  }
};

/**
 * Middleware principale per la gestione degli errori
 */
export const apiErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Genera un ID univoco per la richiesta se non esiste
  const requestId = (req as any).requestId || generateRequestId();
  (req as any).requestId = requestId;

  let apiError: ApiErrorClass;

  // Gestisce diversi tipi di errori
  if (error instanceof ApiErrorClass) {
    apiError = error;
  } else if (error.name === 'ValidationError' || error.name === 'CastError') {
    apiError = handleValidationError(error);
  } else if (error.name === 'RateLimitError' || error.status === 429) {
    apiError = handleRateLimitError(error);
  } else if (error instanceof Prisma.PrismaClientKnownRequestError ||
             error instanceof Prisma.PrismaClientUnknownRequestError ||
             error instanceof Prisma.PrismaClientRustPanicError ||
             error instanceof Prisma.PrismaClientInitializationError ||
             error instanceof Prisma.PrismaClientValidationError) {
    apiError = handlePrismaError(error);
  } else if (error.name === 'JsonWebTokenError') {
    apiError = new ApiErrorClass(
      ErrorCode.INVALID_TOKEN,
      'Token non valido',
      HttpStatusCode.UNAUTHORIZED
    );
  } else if (error.name === 'TokenExpiredError') {
    apiError = new ApiErrorClass(
      ErrorCode.TOKEN_EXPIRED,
      'Token scaduto',
      HttpStatusCode.UNAUTHORIZED
    );
  } else if (error.name === 'SyntaxError' && error.status === 400) {
    apiError = new ApiErrorClass(
      ErrorCode.INVALID_INPUT,
      'Formato JSON non valido',
      HttpStatusCode.BAD_REQUEST
    );
  } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    apiError = new ApiErrorClass(
      ErrorCode.EXTERNAL_SERVICE_ERROR,
      'Servizio esterno non disponibile',
      HttpStatusCode.BAD_GATEWAY
    );
  } else if (error.code === 'ETIMEDOUT') {
    apiError = new ApiErrorClass(
      ErrorCode.TIMEOUT,
      'Timeout della richiesta',
      HttpStatusCode.GATEWAY_TIMEOUT
    );
  } else {
    // Errore generico
    apiError = new ApiErrorClass(
      ErrorCode.INTERNAL_ERROR,
      process.env.NODE_ENV === 'production' 
        ? 'Errore interno del server' 
        : error.message || 'Errore interno del server',
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      process.env.NODE_ENV === 'development' ? { originalError: error.message } : undefined,
      undefined,
      false
    );
  }

  // Logga l'errore
  logError(apiError, req, requestId);

  // Crea la risposta di errore
  const errorResponse = createErrorResponse(apiError, requestId);

  // Invia la risposta
  res.status(apiError.statusCode).json(errorResponse);
};

/**
 * Middleware per gestire route non trovate
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const requestId = generateRequestId();
  (req as any).requestId = requestId;

  const error = new ApiErrorClass(
    ErrorCode.NOT_FOUND,
    `Rotta non trovata: ${req.method} ${req.originalUrl}`,
    HttpStatusCode.NOT_FOUND
  );

  const errorResponse = createErrorResponse(error, requestId);
  res.status(HttpStatusCode.NOT_FOUND).json(errorResponse);
};

/**
 * Middleware per gestire errori di parsing JSON
 */
export const jsonErrorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    const requestId = generateRequestId();
    (req as any).requestId = requestId;

    const apiError = new ApiErrorClass(
      ErrorCode.INVALID_INPUT,
      'Formato JSON non valido',
      HttpStatusCode.BAD_REQUEST,
      { position: error.message }
    );

    const errorResponse = createErrorResponse(apiError, requestId);
    return res.status(HttpStatusCode.BAD_REQUEST).json(errorResponse);
  }
  next(error);
};

/**
 * Utility per creare errori API personalizzati
 */
export const createApiError = (
  code: ErrorCode,
  message?: string,
  statusCode?: HttpStatusCode,
  details?: any,
  field?: string
): ApiErrorClass => {
  return new ApiErrorClass(code, message, statusCode, details, field);
};

/**
 * Utility per creare errori di validazione
 */
export const createValidationError = (field: string, message: string, details?: any): ApiErrorClass => {
  return new ApiErrorClass(
    ErrorCode.VALIDATION_ERROR,
    message,
    HttpStatusCode.BAD_REQUEST,
    details,
    field
  );
};

/**
 * Utility per creare errori di risorsa non trovata
 */
export const createNotFoundError = (resource: string, id?: string): ApiErrorClass => {
  return new ApiErrorClass(
    ErrorCode.NOT_FOUND,
    `${resource} non trovato${id ? ` con ID: ${id}` : ''}`,
    HttpStatusCode.NOT_FOUND,
    { resource, id }
  );
};
