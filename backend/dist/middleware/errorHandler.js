export function errorHandler(err, req, res, next) {
    console.error('Unhandled Server Error:', err);
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({
        error: err.name || 'Error',
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
}
//# sourceMappingURL=errorHandler.js.map