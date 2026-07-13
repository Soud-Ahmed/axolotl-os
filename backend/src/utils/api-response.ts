import type { Response } from 'express';
import type { ApiResponse, PaginationMeta } from '../types/api.js';

export function sendSuccess<T>(res: Response, data: T, status = 200, meta?: PaginationMeta): void {
  const body: ApiResponse<T> = { success: true, data };
  if (meta) body.meta = meta;
  res.status(status).json(body);
}

export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: Record<string, string[]>,
): void {
  const body: ApiResponse = {
    success: false,
    error: { code, message, ...(details ? { details } : {}) },
  };
  res.status(status).json(body);
}
