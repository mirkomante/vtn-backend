import { Request, Response } from 'express';

export interface PaginationConfig {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationResult {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationResponse {
  success: boolean;
  data?: any[];
  pagination?: PaginationResult;
  tableHtml?: string;
  paginationHtml?: string;
  title?: string;
  message?: string;
}

/**
 * Estrae i parametri di paginazione dalla richiesta
 */
export function getPaginationParams(req: Request, defaultLimit: number = 20): PaginationConfig {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || defaultLimit));
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Calcola le informazioni di paginazione
 */
export function calculatePagination(
  totalItems: number, 
  currentPage: number, 
  itemsPerPage: number
): PaginationResult {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    hasNextPage,
    hasPrevPage
  };
}

/**
 * Gestisce la risposta per richieste AJAX di paginazione
 */
export function handlePaginationResponse(
  req: Request,
  res: Response,
  data: any[],
  totalItems: number,
  paginationConfig: PaginationConfig,
  renderFunction: (data: any) => string,
  paginationRenderFunction: (pagination: PaginationResult) => string
): void {
  const isAjax = req.headers['x-requested-with'] === 'XMLHttpRequest';
  
  if (isAjax) {
    // Risposta AJAX
    const pagination = calculatePagination(
      totalItems, 
      paginationConfig.page, 
      paginationConfig.limit
    );

    const response: PaginationResponse = {
      success: true,
      data,
      pagination,
      tableHtml: renderFunction(data),
      paginationHtml: paginationRenderFunction(pagination)
    };

    res.json(response);
  } else {
    // Risposta normale (primo caricamento)
    const pagination = calculatePagination(
      totalItems, 
      paginationConfig.page, 
      paginationConfig.limit
    );

    res.render(req.path, {
      ...req.app.locals,
      items: data,
      pagination,
      totalItems
    });
  }
}

/**
 * Helper per creare query Prisma con paginazione
 */
export function createPaginatedQuery(
  _model: any,
  where: any = {},
  orderBy: any = {},
  paginationConfig: PaginationConfig
) {
  return {
    where,
    orderBy,
    skip: paginationConfig.offset,
    take: paginationConfig.limit
  };
}

/**
 * Helper per contare elementi con filtri
 */
export function createCountQuery(
  _model: any,
  where: any = {}
) {
  return {
    where
  };
}
