import { Router } from 'express';
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { config } from '../../config/database.js';
import { dbService } from '../../services/dbService.js';
import { requireAuth } from '../../middleware/auth.js';
const router = Router();
// GET /api/v1/media
router.get('/', requireAuth, async (req, res) => {
    try {
        const authReq = req;
        let assets = await dbService.getMediaAssets();
        // Client filter: only files uploaded by them
        if (authReq.user.role === 'client') {
            assets = assets.filter(a => a.uploadedBy === authReq.user.id);
        }
        return res.status(200).json(assets);
    }
    catch (error) {
        console.error('Error fetching media assets:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});
// POST /api/v1/media/upload
// Expects JSON: { fileName: string, fileType: string, base64Data: string }
router.post('/upload', requireAuth, async (req, res) => {
    try {
        const authReq = req;
        const { fileName, fileType, base64Data } = req.body;
        if (!fileName || !fileType || !base64Data) {
            return res.status(400).json({ error: 'Validation Error', message: 'fileName, fileType, and base64Data are required' });
        }
        const fileBuffer = Buffer.from(base64Data, 'base64');
        const fileSize = fileBuffer.length;
        const fileId = crypto.randomUUID();
        const fileExt = path.extname(fileName) || `.${fileType.split('/')[1] || 'bin'}`;
        const storedFileName = `${fileId}${fileExt}`;
        let fileUrl = '';
        if (config.isSupabaseConfigured()) {
            // Supabase Storage
            const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
            const supabase = createClient(config.supabase.url, key, { auth: { persistSession: false } });
            const { data, error } = await supabase.storage
                .from('media')
                .upload(storedFileName, fileBuffer, {
                contentType: fileType,
                upsert: true,
            });
            if (error) {
                throw error;
            }
            // Get public URL
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(storedFileName);
            fileUrl = publicUrl;
        }
        else {
            // Local storage
            const uploadDir = config.uploadDir;
            if (!fs.existsSync(uploadDir)) {
                await fsPromises.mkdir(uploadDir, { recursive: true });
            }
            const filePath = path.join(uploadDir, storedFileName);
            await fsPromises.writeFile(filePath, fileBuffer);
            fileUrl = `${req.protocol}://${req.get('host')}/uploads/${storedFileName}`;
        }
        const asset = await dbService.createMediaAsset({
            fileName,
            fileUrl,
            fileType,
            fileSize,
            uploadedBy: authReq.user.id,
        });
        // Create activity log
        await dbService.createActivityLog({
            userId: authReq.user.id,
            userName: authReq.user.name,
            userRole: authReq.user.role,
            action: `Uploaded asset: ${fileName}`,
            entityType: 'media',
            entityId: asset.id,
            entityName: fileName
        });
        return res.status(201).json(asset);
    }
    catch (error) {
        console.error('Error uploading media:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});
// DELETE /api/v1/media/:id
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const authReq = req;
        const id = req.params.id;
        const assets = await dbService.getMediaAssets();
        const asset = assets.find(a => a.id === id);
        if (!asset) {
            return res.status(404).json({ error: 'Not Found', message: 'Asset not found' });
        }
        // Client guard: clients can only delete their own uploaded files
        if (authReq.user.role === 'client' && asset.uploadedBy !== authReq.user.id) {
            return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
        }
        // Delete database entry
        await dbService.deleteMediaAsset(id);
        // Delete physical file if local
        if (!config.isSupabaseConfigured()) {
            try {
                const storedFileName = path.basename(asset.fileUrl);
                const filePath = path.join(config.uploadDir, storedFileName);
                if (fs.existsSync(filePath)) {
                    await fsPromises.unlink(filePath);
                }
            }
            catch (err) {
                console.error('Failed to delete physical local file:', err);
            }
        }
        else {
            // Supabase Storage delete
            try {
                const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
                const supabase = createClient(config.supabase.url, key, { auth: { persistSession: false } });
                const storedFileName = path.basename(asset.fileUrl);
                await supabase.storage.from('media').remove([storedFileName]);
            }
            catch (err) {
                console.error('Failed to delete Supabase storage file:', err);
            }
        }
        // Create activity log
        await dbService.createActivityLog({
            userId: authReq.user.id,
            userName: authReq.user.name,
            userRole: authReq.user.role,
            action: `Deleted asset: ${asset.fileName}`,
            entityType: 'media',
            entityId: id,
            entityName: asset.fileName
        });
        return res.status(200).json({ message: 'Media asset deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting media asset:', error);
        return res.status(500).json({ error: 'Internal Server Error', message: error.message });
    }
});
export default router;
//# sourceMappingURL=media.js.map