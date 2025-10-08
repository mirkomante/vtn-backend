/**
 * Tipi e interfacce per risposte JSON strutturate delle API
 */

export interface ApiResponse<T = any> {
  success: true;
  data: T;
  meta: ResponseMeta;
}

export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  version: string;
  count?: number;
  pagination?: PaginationMeta;
  filters?: FilterMeta;
  sorting?: SortingMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FilterMeta {
  applied: Record<string, any>;
  available: Record<string, string[]>;
}

export interface SortingMeta {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface CollectionResponse<T = any> extends ApiResponse<T[]> {
  meta: ResponseMeta & {
    count: number;
    pagination?: PaginationMeta;
    filters?: FilterMeta;
    sorting?: SortingMeta;
  };
}

export interface SingleResponse<T = any> extends ApiResponse<T> {
  meta: ResponseMeta;
}

export interface HealthCheckResponse extends ApiResponse<{
  status: 'healthy' | 'unhealthy';
  version: string;
  timestamp: string;
  uptime?: number;
  memory?: {
    used: number;
    total: number;
    percentage: number;
  };
}> {}

/**
 * Opzioni per la creazione di risposte
 */
export interface ResponseOptions {
  requestId?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
  filters?: {
    applied: Record<string, any>;
    available?: Record<string, string[]>;
  };
  sorting?: {
    sortBy: string;
    sortOrder: 'asc' | 'desc';
  };
  version?: string;
}

/**
 * Configurazione per le risposte API
 */
export interface ApiResponseConfig {
  defaultVersion: string;
  includeRequestId: boolean;
  includeTimestamps: boolean;
  includeMetadata: boolean;
  maxPaginationLimit: number;
  defaultPaginationLimit: number;
}

/**
 * Costanti per le risposte API
 */
export const API_RESPONSE_CONFIG: ApiResponseConfig = {
  defaultVersion: 'v1',
  includeRequestId: true,
  includeTimestamps: true,
  includeMetadata: true,
  maxPaginationLimit: 100,
  defaultPaginationLimit: 20
};

/**
 * Codici di stato per le risposte
 */
export enum ResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
  PARTIAL_SUCCESS = 'partial_success'
}

/**
 * Tipi di risorsa per le risposte
 */
export enum ResourceType {
  COLLECTION = 'collection',
  SINGLE = 'single',
  HEALTH_CHECK = 'health_check',
  ERROR = 'error'
}

/**
 * Metadati per le risorse
 */
export interface ResourceMeta {
  type: ResourceType;
  resource: string;
  action?: string;
  id?: string;
  parentId?: string;
}

/**
 * Risposta per operazioni di creazione
 */
export interface CreateResponse<T = any> extends SingleResponse<T> {
  meta: ResponseMeta & {
    resource: string;
    action: 'create';
    id: string;
  };
}

/**
 * Risposta per operazioni di aggiornamento
 */
export interface UpdateResponse<T = any> extends SingleResponse<T> {
  meta: ResponseMeta & {
    resource: string;
    action: 'update';
    id: string;
  };
}

/**
 * Risposta per operazioni di eliminazione
 */
export interface DeleteResponse extends ApiResponse<null> {
  meta: ResponseMeta & {
    resource: string;
    action: 'delete';
    id: string;
  };
}

/**
 * Risposta per operazioni di ricerca
 */
export interface SearchResponse<T = any> extends CollectionResponse<T> {
  meta: ResponseMeta & {
    count: number;
    query: string;
    searchFields: string[];
    pagination?: PaginationMeta;
    filters?: FilterMeta;
    sorting?: SortingMeta;
  };
}

/**
 * Risposta per statistiche
 */
export interface StatsResponse<T = any> extends ApiResponse<T> {
  meta: ResponseMeta & {
    resource: string;
    period?: string;
    granularity?: string;
  };
}

/**
 * Risposta per esportazione dati
 */
export interface ExportResponse<T = any> extends ApiResponse<T> {
  meta: ResponseMeta & {
    format: string;
    filename: string;
    size: number;
    expiresAt?: string;
  };
}

/**
 * Risposta per operazioni batch
 */
export interface BatchResponse<T = any> extends ApiResponse<{
  successful: T[];
  failed: Array<{
    item: any;
    error: string;
    index: number;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}> {
  meta: ResponseMeta & {
    resource: string;
    action: 'batch';
    batchId: string;
  };
}
