/**
 * Hashes a password using PBKDF2 (native node crypto)
 */
export declare function hashPassword(password: string): string;
/**
 * Compares a password with a stored hash
 */
export declare function comparePassword(password: string, storedHash: string): boolean;
/**
 * Generates a lightweight secure token containing user ID and role
 */
export declare function generateToken(payload: {
    userId: string;
    role: string;
    email: string;
}): string;
/**
 * Verifies a token and returns the payload, or null if invalid/expired
 */
export declare function verifyToken(token: string): {
    userId: string;
    role: string;
    email: string;
} | null;
//# sourceMappingURL=auth.d.ts.map