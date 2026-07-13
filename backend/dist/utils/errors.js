export class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, code, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'AppError';
    }
}
export class NotFoundError extends AppError {
    constructor(resource = 'Resource') {
        super(404, 'NOT_FOUND', `${resource} not found`);
    }
}
export class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized') {
        super(401, 'UNAUTHORIZED', message);
    }
}
export class ForbiddenError extends AppError {
    constructor(message = 'Forbidden') {
        super(403, 'FORBIDDEN', message);
    }
}
export class ValidationError extends AppError {
    constructor(details) {
        super(400, 'VALIDATION_ERROR', 'Validation failed', details);
    }
}
export class ConflictError extends AppError {
    constructor(message = 'Resource already exists') {
        super(409, 'CONFLICT', message);
    }
}
//# sourceMappingURL=errors.js.map