import { Router } from 'express';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { config } from '../../config/database.js';
import { dbService } from '../../services/dbService.js';
import { hashPassword, comparePassword, generateToken } from '../../utils/auth.js';
import { requireAuth } from '../../middleware/auth.js';
const router = Router();
// POST /signup
router.post('/signup', async (req, res) => {
    try {
        const { email, password, name, fullName, role } = req.body;
        const resolvedName = name || fullName;
        if (!email || !password || !resolvedName) {
            return res.status(400).json({ error: 'Validation Error', message: 'Email, password, and name are required' });
        }
        const requestedRole = role || 'client';
        if (config.isSupabaseConfigured()) {
            // Initialize Supabase Client
            const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
            const supabase = createClient(config.supabase.url, key, { auth: { persistSession: false } });
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: resolvedName,
                        role: requestedRole
                    }
                }
            });
            if (error || !data.user) {
                return res.status(400).json({ error: 'Supabase Auth Error', message: error?.message || 'Registration failed' });
            }
            // Generate local token containing session jwt if needed or let client handle session directly.
            // Usually, when using Supabase Auth with backend, the client gets the Supabase access token directly.
            // To keep API responses uniform, we return the user and the session access token if available.
            const token = data.session?.access_token || '';
            // Return user profile
            const profile = await dbService.getProfileById(data.user.id);
            const userObj = profile || {
                id: data.user.id,
                email: data.user.email,
                name: resolvedName,
                fullName: resolvedName,
                role: requestedRole,
                companyName: 'Axolotl Web Media',
                avatarUrl: null,
                status: 'active',
                createdAt: data.user.created_at,
                updatedAt: data.user.created_at
            };
            return res.status(201).json({
                user: { ...userObj, fullName: userObj.name },
                accessToken: token,
                refreshToken: token
            });
        }
        else {
            // Local fallback mode
            const existingUser = await dbService.getProfileByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Conflict Error', message: 'Email is already registered' });
            }
            const userId = crypto.randomUUID();
            const now = new Date().toISOString();
            const passwordHash = hashPassword(password);
            const newUser = {
                id: userId,
                email,
                name: resolvedName,
                fullName: resolvedName,
                role: requestedRole,
                avatarUrl: null,
                companyName: 'Axolotl Web Media',
                status: 'active',
                createdAt: now,
                updatedAt: now,
            };
            await dbService.createProfileWithPassword(newUser, passwordHash);
            // Create activity log
            await dbService.createActivityLog({
                userId,
                userName: resolvedName,
                userRole: requestedRole,
                action: 'Signed up',
                entityType: 'user',
                entityId: userId,
                entityName: resolvedName
            });
            const token = generateToken({ userId, role: requestedRole, email });
            return res.status(201).json({
                user: { ...newUser, fullName: newUser.name },
                accessToken: token,
                refreshToken: token
            });
        }
    }
    catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message || 'Signup failed' });
    }
});
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Validation Error', message: 'Email and password are required' });
        }
        if (config.isSupabaseConfigured()) {
            const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
            const supabase = createClient(config.supabase.url, key, { auth: { persistSession: false } });
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });
            if (error || !data.user || !data.session) {
                return res.status(401).json({ error: 'Unauthorized', message: error?.message || 'Invalid email or password' });
            }
            const profile = await dbService.getProfileById(data.user.id);
            const userObj = profile || {
                id: data.user.id,
                email: data.user.email,
                name: email.split('@')[0],
                fullName: email.split('@')[0],
                role: 'client',
                companyName: 'Axolotl Web Media',
                avatarUrl: null,
                status: 'active',
                createdAt: data.user.created_at,
                updatedAt: data.user.created_at
            };
            return res.status(200).json({
                user: { ...userObj, fullName: userObj.name },
                accessToken: data.session.access_token,
                refreshToken: data.session.refresh_token || data.session.access_token
            });
        }
        else {
            // Local fallback mode
            const userWithPass = await dbService.getProfileWithPasswordByEmail(email);
            if (!userWithPass || !comparePassword(password, userWithPass.passwordHash)) {
                return res.status(401).json({ error: 'Unauthorized', message: 'Invalid email or password' });
            }
            const { passwordHash, ...user } = userWithPass;
            // Create activity log
            await dbService.createActivityLog({
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                action: 'Logged in',
                entityType: 'user',
                entityId: user.id,
                entityName: user.name
            });
            const token = generateToken({ userId: user.id, role: user.role, email: user.email });
            return res.status(200).json({
                user: { ...user, fullName: user.name },
                accessToken: token,
                refreshToken: token
            });
        }
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message || 'Login failed' });
    }
};
// POST /login
router.post('/login', handleLogin);
// POST /signin
router.post('/signin', handleLogin);
// GET /me
router.get('/me', requireAuth, async (req, res) => {
    const authReq = req;
    return res.status(200).json({
        user: authReq.user
    });
});
export default router;
//# sourceMappingURL=auth.js.map