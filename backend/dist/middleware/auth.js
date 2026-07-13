import { createClient } from '@supabase/supabase-js';
import { config } from '../config/database.js';
import { verifyToken } from '../utils/auth.js';
import { dbService } from '../services/dbService.js';
export async function requireAuth(req, res, next) {
    try {
        const authReq = req;
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Unauthorized', message: 'No authorization token provided' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Malformed authorization token' });
        }
        if (config.isSupabaseConfigured()) {
            const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
            const supabase = createClient(config.supabase.url, key, {
                auth: { persistSession: false }
            });
            const { data: { user }, error } = await supabase.auth.getUser(token);
            if (error || !user) {
                return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired Supabase session' });
            }
            const profile = await dbService.getProfileById(user.id);
            authReq.user = {
                id: profile?.id || user.id,
                email: profile?.email || user.email || '',
                role: profile?.role || user.user_metadata?.role || 'client',
                name: profile?.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            };
        }
        else {
            // Local fallback mode
            const payload = verifyToken(token);
            if (!payload) {
                return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
            }
            const profile = await dbService.getProfileById(payload.userId);
            if (!profile) {
                return res.status(401).json({ error: 'Unauthorized', message: 'User profile not found' });
            }
            authReq.user = {
                id: profile.id,
                email: profile.email,
                role: profile.role,
                name: profile.name,
            };
        }
        return next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: 'Authentication processing failed' });
    }
}
export function requireRole(roles) {
    return (req, res, next) => {
        const authReq = req;
        if (!authReq.user) {
            return res.status(401).json({ error: 'Unauthorized', message: 'Authentication required' });
        }
        if (!roles.includes(authReq.user.role)) {
            return res.status(403).json({ error: 'Forbidden', message: 'Insufficient permissions' });
        }
        return next();
    };
}
//# sourceMappingURL=auth.js.map