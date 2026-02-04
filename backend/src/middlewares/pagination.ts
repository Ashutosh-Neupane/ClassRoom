import { Request, Response, NextFunction } from 'express';

export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const parsePagination = (req: Request): { page: number; limit: number } => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
  
  return { page, limit };
};

export const createPaginationResult = (
  total: number,
  page: number,
  limit: number
): PaginationResult => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit)
});