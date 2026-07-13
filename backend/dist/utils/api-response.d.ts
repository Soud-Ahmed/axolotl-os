import type { Response } from 'express';
import type { PaginationMeta } from '../types/api.js';
export declare function sendSuccess<T>(res: Response, data: T, status?: number, meta?: PaginationMeta): void;
export declare function sendError(res: Response, status: number, code: string, message: string, details?: Record<string, string[]>): void;
//# sourceMappingURL=api-response.d.ts.map