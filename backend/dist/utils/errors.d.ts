export declare class AppError extends Error {
    readonly statusCode: number;
    readonly code: string;
    readonly details: Record<string, string[]> | undefined;
    constructor(statusCode: number, code: string, message: string, details?: Record<string, string[]>);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string);
}
export declare class UnauthorizedError extends AppError {
    constructor(message?: string);
}
export declare class ForbiddenError extends AppError {
    constructor(message?: string);
}
export declare class ValidationError extends AppError {
    constructor(details: Record<string, string[]>);
}
export declare class ConflictError extends AppError {
    constructor(message?: string);
}
//# sourceMappingURL=errors.d.ts.map