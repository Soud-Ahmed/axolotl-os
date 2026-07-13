export function sendSuccess(res, data, status = 200, meta) {
    const body = { success: true, data };
    if (meta)
        body.meta = meta;
    res.status(status).json(body);
}
export function sendError(res, status, code, message, details) {
    const body = {
        success: false,
        error: { code, message, ...(details ? { details } : {}) },
    };
    res.status(status).json(body);
}
//# sourceMappingURL=api-response.js.map