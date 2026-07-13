import { Router } from 'express';
import { dbService } from '../../services/dbService.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
const router = Router();
// GET /api/v1/users
router.get('/', requireAuth, requireRole(['super_admin', 'admin']), async (req, res) => {
    try {
        const profiles = await dbService.getProfiles();
        return res.status(200).json(profiles);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});
// GET /api/v1/users/:id
router.get('/:id', requireAuth, requireRole(['super_admin', 'admin']), async (req, res) => {
    try {
        const id = req.params.id;
        const profile = await dbService.getProfileById(id);
        if (!profile) {
            return res.status(404).json({ error: 'Not Found', message: 'User not found' });
        }
        return res.status(200).json(profile);
    }
    catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});
// PUT /api/v1/users/:id
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const id = req.params.id;
        const authReq = req;
        // Allow users to update their own profile, or super_admins to update anyone's profile
        if (authReq.user.id !== id && authReq.user.role !== 'super_admin') {
            return res.status(403).json({ error: 'Forbidden', message: 'You can only update your own profile' });
        }
        const { name, fullName, avatarUrl, role } = req.body;
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (fullName !== undefined)
            updates.fullName = fullName;
        if (avatarUrl !== undefined)
            updates.avatarUrl = avatarUrl;
        // Only super_admins can change user roles
        if (role !== undefined && authReq.user.role === 'super_admin') {
            updates.role = role;
        }
        const updatedProfile = await dbService.updateProfile(id, updates);
        // Create activity log
        await dbService.createActivityLog({
            userId: authReq.user.id,
            userName: authReq.user.name,
            userRole: authReq.user.role,
            action: `Updated profile of: ${updatedProfile.name}`,
            entityType: 'user',
            entityId: id,
            entityName: updatedProfile.name
        });
        return res.status(200).json(updatedProfile);
    }
    catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});
export default router;
//# sourceMappingURL=users.js.map