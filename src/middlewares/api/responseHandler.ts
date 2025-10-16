import { Request, Response, NextFunction } from 'express';
import { 
  ApiResponse, 
  CollectionResponse, 
  SingleResponse, 
  HealthCheckResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  SearchResponse,
  StatsResponse,
  ExportResponse,
  BatchResponse,
  ResponseOptions,
  API_RESPONSE_CONFIG,
  ResourceType as _ResourceType
} from './responseTypes';

/**
 * Estende l'oggetto Response di Express con metodi personalizzati
 */
declare global {
  namespace Express {
    interface Response {
      apiSuccess: <T = any>(data: T, options?: ResponseOptions) => void;
      apiCollection: <T = any>(data: T[], options?: ResponseOptions) => void;
      apiSingle: <T = any>(data: T, options?: ResponseOptions) => void;
      apiHealth: (status: 'healthy' | 'unhealthy', options?: ResponseOptions) => void;
      apiCreate: <T = any>(data: T, resource: string, id: string, options?: ResponseOptions) => void;
      apiUpdate: <T = any>(data: T, resource: string, id: string, options?: ResponseOptions) => void;
      apiDelete: (resource: string, id: string, options?: ResponseOptions) => void;
      apiSearch: <T = any>(data: T[], query: string, searchFields: string[], options?: ResponseOptions) => void;
      apiStats: <T = any>(data: T, resource: string, options?: ResponseOptions) => void;
      apiExport: <T = any>(data: T, format: string, filename: string, options?: ResponseOptions) => void;
      apiBatch: <T = any>(successful: T[], failed: Array<{item: any, error: string, index: number}>, resource: string, batchId: string, options?: ResponseOptions) => void;
    }
  }
}

/**
 * Genera un ID univoco per la richiesta se non esiste
 */
const getRequestId = (req: Request): string => {
  return (req as any).requestId || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Crea i metadati base per la risposta
 */
const createBaseMeta = (req: Request, options: ResponseOptions = {}): any => {
  const requestId = getRequestId(req);
  (req as any).requestId = requestId;

  const meta: any = {
    timestamp: new Date().toISOString(),
    version: options.version || API_RESPONSE_CONFIG.defaultVersion
  };

  if (API_RESPONSE_CONFIG.includeRequestId) {
    meta.requestId = requestId;
  }

  return meta;
};

/**
 * Crea i metadati di paginazione
 */
const createPaginationMeta = (pagination: ResponseOptions['pagination']): any => {
  if (!pagination) return undefined;

  const { page, limit, total } = pagination;
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
};

/**
 * Crea i metadati di filtro
 */
const createFilterMeta = (filters: ResponseOptions['filters']): any => {
  if (!filters) return undefined;

  return {
    applied: filters.applied,
    available: filters.available || {}
  };
};

/**
 * Crea i metadati di ordinamento
 */
const createSortingMeta = (sorting: ResponseOptions['sorting']): any => {
  if (!sorting) return undefined;

  return {
    sortBy: sorting.sortBy,
    sortOrder: sorting.sortOrder
  };
};

/**
 * Middleware per aggiungere metodi di risposta personalizzati
 */
export const responseHandler = (req: Request, res: Response, next: NextFunction) => {
  // Risposta di successo generica
  res.apiSuccess = <T = any>(data: T, options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta
    };
    res.json(response);
  };

  // Risposta per collezioni
  res.apiCollection = <T = any>(data: T[], options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    meta.count = data.length;

    if (options.pagination) {
      meta.pagination = createPaginationMeta(options.pagination);
    }

    if (options.filters) {
      meta.filters = createFilterMeta(options.filters);
    }

    if (options.sorting) {
      meta.sorting = createSortingMeta(options.sorting);
    }

    const response: CollectionResponse<T> = {
      success: true,
      data,
      meta
    };
    res.json(response);
  };

  // Risposta per singoli elementi
  res.apiSingle = <T = any>(data: T, options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    const response: SingleResponse<T> = {
      success: true,
      data,
      meta
    };
    res.json(response);
  };

  // Risposta per health check
  res.apiHealth = (status: 'healthy' | 'unhealthy', options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    const response: HealthCheckResponse = {
      success: true,
      data: {
        status,
        version: meta.version,
        timestamp: meta.timestamp,
        uptime: Math.floor(uptime),
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
          percentage: Math.round((memoryUsage.heapUsed / memoryUsage.heapTotal) * 100)
        }
      },
      meta
    };
    res.json(response);
  };

  // Risposta per creazione
  res.apiCreate = <T = any>(data: T, resource: string, id: string, options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    meta.resource = resource;
    meta.action = 'create';
    meta.id = id;

    const response: CreateResponse<T> = {
      success: true,
      data,
      meta
    };
    res.json(response);
  };

  // Risposta per aggiornamento
  res.apiUpdate = <T = any>(data: T, resource: string, id: string, options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    meta.resource = resource;
    meta.action = 'update';
    meta.id = id;

    const response: UpdateResponse<T> = {
      success: true,
      data,
      meta
    };
    res.json(response);
  };

  // Risposta per eliminazione
  res.apiDelete = (resource: string, id: string, options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    meta.resource = resource;
    meta.action = 'delete';
    meta.id = id;

    const response: DeleteResponse = {
      success: true,
      data: null,
      meta
    };
    res.json(response);
  };

  // Risposta per ricerca
  res.apiSearch = <T = any>(data: T[], query: string, searchFields: string[], options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    meta.count = data.length;
    meta.query = query;
    meta.searchFields = searchFields;

    if (options.pagination) {
      meta.pagination = createPaginationMeta(options.pagination);
    }

    if (options.filters) {
      meta.filters = createFilterMeta(options.filters);
    }

    if (options.sorting) {
      meta.sorting = createSortingMeta(options.sorting);
    }

    const response: SearchResponse<T> = {
      success: true,
      data,
      meta
    };
    res.json(response);
  };

  // Risposta per statistiche
  res.apiStats = <T = any>(data: T, resource: string, options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    meta.resource = resource;

    const response: StatsResponse<T> = {
      success: true,
      data,
      meta
    };
    res.json(response);
  };

  // Risposta per esportazione
  res.apiExport = <T = any>(data: T, format: string, filename: string, options: ResponseOptions = {}) => {
    const meta = createBaseMeta(req, options);
    meta.format = format;
    meta.filename = filename;
    meta.size = JSON.stringify(data).length;

    const response: ExportResponse<T> = {
      success: true,
      data,
      meta
    };
    res.json(response);
  };

  // Risposta per operazioni batch
  res.apiBatch = <T = any>(
    successful: T[], 
    failed: Array<{item: any, error: string, index: number}>, 
    resource: string, 
    batchId: string, 
    options: ResponseOptions = {}
  ) => {
    const meta = createBaseMeta(req, options);
    meta.resource = resource;
    meta.action = 'batch';
    meta.batchId = batchId;

    const response: BatchResponse<T> = {
      success: true,
      data: {
        successful,
        failed,
        summary: {
          total: successful.length + failed.length,
          successful: successful.length,
          failed: failed.length
        }
      },
      meta
    };
    res.json(response);
  };

  next();
};

/**
 * Utility per creare opzioni di risposta con paginazione
 */
export const createPaginationOptions = (
  page: number = 1, 
  limit: number = API_RESPONSE_CONFIG.defaultPaginationLimit, 
  total: number = 0
): ResponseOptions => {
  return {
    pagination: {
      page: Math.max(1, page),
      limit: Math.min(limit, API_RESPONSE_CONFIG.maxPaginationLimit),
      total: Math.max(0, total)
    }
  };
};

/**
 * Utility per creare opzioni di risposta con filtri
 */
export const createFilterOptions = (
  applied: Record<string, any>,
  available?: Record<string, string[]>
): ResponseOptions => {
  return {
    filters: {
      applied,
      available: available || {}
    }
  };
};

/**
 * Utility per creare opzioni di risposta con ordinamento
 */
export const createSortingOptions = (
  sortBy: string,
  sortOrder: 'asc' | 'desc' = 'asc'
): ResponseOptions => {
  return {
    sorting: {
      sortBy,
      sortOrder
    }
  };
};

/**
 * Utility per combinare opzioni di risposta
 */
export const combineResponseOptions = (...options: ResponseOptions[]): ResponseOptions => {
  return options.reduce((acc, curr) => ({
    ...acc,
    ...curr,
    pagination: curr.pagination || acc.pagination,
    filters: curr.filters || acc.filters,
    sorting: curr.sorting || acc.sorting,
    version: curr.version || acc.version,
    requestId: curr.requestId || acc.requestId
  }), {});
};
