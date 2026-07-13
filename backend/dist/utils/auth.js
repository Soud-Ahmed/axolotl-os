import crypto from 'crypto';
const JWT_SECRET = process.env.JWT_SECRET || 'axolotl-os-super-secret-key-for-local-fallback';
/**
 * Hashes a password using PBKDF2 (native node crypto)
 */
export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}
/**
 * Compares a password with a stored hash
 */
export function comparePassword(password, storedHash) {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash)
        return false;
    const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return hash === verifyHash;
}
/**
 * Generates a lightweight secure token containing user ID and role
 */
export function generateToken(payload) {
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24 hours
    const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
    const signature = crypto
        .createHmac('sha256', JWT_SECRET)
        .update(`${header}.${body}`)
        .digest('base64url');
    return `${header}.${body}.${signature}`;
}
/**
 * Verifies a token and returns the payload, or null if invalid/expired
 */
export function verifyToken(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3)
            return null;
        const [header, body, signature] = parts;
        if (!header || !body || !signature)
            return null;
        const expectedSignature = crypto
            .createHmac('sha256', JWT_SECRET)
            .update(`${header}.${body}`)
            .digest('base64url');
        if (signature !== expectedSignature)
            return null;
        const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
        if (payload.exp && payload.exp < Date.now() / 1000) {
            return null; // Expired
        }
        return {
            userId: payload.userId,
            role: payload.role,
            email: payload.email,
        };
    }
    catch (error) {
        return null;
    }
}
//# sourceMappingURL=auth.js.map