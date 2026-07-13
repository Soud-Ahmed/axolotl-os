import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/database.js';
class DbService {
    supabase = null;
    localDbInitialized = false;
    constructor() {
        if (config.isSupabaseConfigured()) {
            const key = config.supabase.serviceRoleKey || config.supabase.anonKey;
            this.supabase = createClient(config.supabase.url, key, {
                auth: {
                    persistSession: false,
                },
            });
            console.log('Supabase client initialized successfully in DbService.');
        }
        else {
            console.log('Supabase not configured. Using local JSON database at:', config.localDbPath);
            this.initLocalDb();
        }
    }
    async initLocalDb() {
        if (this.localDbInitialized)
            return;
        try {
            const dbDir = path.dirname(config.localDbPath);
            if (!fs.existsSync(dbDir)) {
                await fsPromises.mkdir(dbDir, { recursive: true });
            }
            if (!fs.existsSync(config.localDbPath)) {
                const initialData = {
                    profiles: [],
                    articles: [],
                    media_assets: [],
                    tasks: [],
                    comments: [],
                    activity_logs: [],
                };
                await fsPromises.writeFile(config.localDbPath, JSON.stringify(initialData, null, 2), 'utf-8');
            }
            this.localDbInitialized = true;
        }
        catch (error) {
            console.error('Failed to initialize local JSON database:', error);
        }
    }
    async readLocalDb() {
        await this.initLocalDb();
        try {
            const data = await fsPromises.readFile(config.localDbPath, 'utf-8');
            return JSON.parse(data);
        }
        catch (error) {
            console.error('Error reading local JSON database:', error);
            return {
                profiles: [],
                articles: [],
                media_assets: [],
                tasks: [],
                comments: [],
                activity_logs: [],
            };
        }
    }
    async writeLocalDb(data) {
        await this.initLocalDb();
        try {
            await fsPromises.writeFile(config.localDbPath, JSON.stringify(data, null, 2), 'utf-8');
        }
        catch (error) {
            console.error('Error writing local JSON database:', error);
        }
    }
    mapProfile(row) {
        return {
            id: row.id,
            email: row.email,
            name: row.full_name || row.fullName || row.name || row.email.split('@')[0],
            fullName: row.full_name || row.fullName || row.name || row.email.split('@')[0],
            role: row.role,
            avatarUrl: row.avatar_url || row.avatarUrl || null,
            companyName: row.company_name || row.companyName || 'Axolotl Web Media',
            status: row.status || 'active',
            createdAt: row.created_at || row.createdAt,
            updatedAt: row.updated_at || row.updatedAt || row.created_at || row.createdAt,
        };
    }
    mapProfileToDb(user) {
        const dbRow = {};
        if (user.id !== undefined)
            dbRow.id = user.id;
        if (user.email !== undefined)
            dbRow.email = user.email;
        if (user.fullName !== undefined)
            dbRow.full_name = user.fullName;
        if (user.fullName === undefined && user.name !== undefined)
            dbRow.full_name = user.name;
        if (user.avatarUrl !== undefined)
            dbRow.avatar_url = user.avatarUrl;
        if (user.companyName !== undefined)
            dbRow.company_name = user.companyName;
        if (user.role !== undefined)
            dbRow.role = user.role;
        if (user.status !== undefined)
            dbRow.status = user.status;
        if (user.createdAt !== undefined)
            dbRow.created_at = user.createdAt;
        if (user.updatedAt !== undefined)
            dbRow.updated_at = user.updatedAt;
        return dbRow;
    }
    // --- Profiles / Users ---
    async getProfiles() {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase.from('profiles').select('*');
                if (error)
                    throw error;
                return (data || []).map(row => this.mapProfile(row));
            }
            catch (err) {
                console.warn('Supabase query getProfiles failed, using local fallback:', err);
                const db = await this.readLocalDb();
                return db.profiles.map((p) => this.mapProfile(p));
            }
        }
        else {
            const db = await this.readLocalDb();
            return db.profiles.map((p) => this.mapProfile(p));
        }
    }
    async getProfileById(id) {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase.from('profiles').select('*').eq('id', id).single();
                if (error)
                    return null;
                return this.mapProfile(data);
            }
            catch (err) {
                console.warn('Supabase query getProfileById failed:', err);
                const db = await this.readLocalDb();
                const prof = db.profiles.find((p) => p.id === id);
                return prof ? this.mapProfile(prof) : null;
            }
        }
        else {
            const db = await this.readLocalDb();
            const prof = db.profiles.find((p) => p.id === id);
            return prof ? this.mapProfile(prof) : null;
        }
    }
    async getProfileByEmail(email) {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase.from('profiles').select('*').eq('email', email).single();
                if (error)
                    return null;
                return this.mapProfile(data);
            }
            catch (err) {
                console.warn('Supabase query getProfileByEmail failed:', err);
                const db = await this.readLocalDb();
                const prof = db.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
                if (!prof)
                    return null;
                const { passwordHash, ...user } = prof;
                return this.mapProfile(user);
            }
        }
        else {
            const db = await this.readLocalDb();
            const prof = db.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
            if (!prof)
                return null;
            const { passwordHash, ...user } = prof;
            return this.mapProfile(user);
        }
    }
    async getProfileWithPasswordByEmail(email) {
        if (this.supabase) {
            return null;
        }
        else {
            const db = await this.readLocalDb();
            const prof = db.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
            if (!prof)
                return null;
            return {
                ...this.mapProfile(prof),
                passwordHash: prof.passwordHash
            };
        }
    }
    async createProfileWithPassword(user, passwordHash) {
        if (this.supabase) {
            throw new Error('Use Supabase auth client for Supabase registrations');
        }
        else {
            const db = await this.readLocalDb();
            db.profiles.push({ ...this.mapProfile(user), passwordHash });
            await this.writeLocalDb(db);
            return this.mapProfile(user);
        }
    }
    async createProfile(user) {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase.from('profiles').insert(this.mapProfileToDb(user)).select().single();
                if (error)
                    throw error;
                return this.mapProfile(data);
            }
            catch (err) {
                console.warn('Supabase createProfile failed, using local:', err);
                const db = await this.readLocalDb();
                db.profiles.push(this.mapProfile(user));
                await this.writeLocalDb(db);
                return this.mapProfile(user);
            }
        }
        else {
            const db = await this.readLocalDb();
            db.profiles.push(this.mapProfile(user));
            await this.writeLocalDb(db);
            return this.mapProfile(user);
        }
    }
    async updateProfile(id, updates) {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase.from('profiles').update(this.mapProfileToDb(updates)).eq('id', id).select().single();
                if (error)
                    throw error;
                return this.mapProfile(data);
            }
            catch (err) {
                console.warn('Supabase updateProfile failed, using local:', err);
                const db = await this.readLocalDb();
                const idx = db.profiles.findIndex((p) => p.id === id);
                if (idx === -1)
                    throw new Error('Profile not found');
                db.profiles[idx] = { ...db.profiles[idx], ...updates };
                await this.writeLocalDb(db);
                return this.mapProfile(db.profiles[idx]);
            }
        }
        else {
            const db = await this.readLocalDb();
            const idx = db.profiles.findIndex((p) => p.id === id);
            if (idx === -1)
                throw new Error('Profile not found');
            db.profiles[idx] = { ...db.profiles[idx], ...updates };
            await this.writeLocalDb(db);
            return this.mapProfile(db.profiles[idx]);
        }
    }
    // --- Articles ---
    async getArticles() {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase
                    .from('articles')
                    .select('*, profiles:author_id(*)');
                if (error)
                    throw error;
                return (data || []).map(art => ({
                    ...art,
                    author: art.profiles || undefined,
                }));
            }
            catch (err) {
                console.warn('Supabase query getArticles failed, using local fallback:', err);
                const db = await this.readLocalDb();
                return db.articles.map((art) => ({
                    ...art,
                    author: db.profiles.find((p) => p.id === art.authorId) || undefined,
                }));
            }
        }
        else {
            const db = await this.readLocalDb();
            return db.articles.map((art) => ({
                ...art,
                author: db.profiles.find((p) => p.id === art.authorId) || undefined,
            }));
        }
    }
    async getArticleById(id) {
        if (this.supabase) {
            const { data, error } = await this.supabase
                .from('articles')
                .select('*, profiles:author_id(*)')
                .eq('id', id)
                .single();
            if (error)
                return null;
            return {
                ...data,
                author: data.profiles || undefined,
            };
        }
        else {
            const db = await this.readLocalDb();
            const art = db.articles.find((a) => a.id === id);
            if (!art)
                return null;
            return {
                ...art,
                author: db.profiles.find((p) => p.id === art.authorId) || undefined,
            };
        }
    }
    async createArticle(article) {
        const now = new Date().toISOString();
        const newArt = {
            id: article.id || crypto.randomUUID(),
            title: article.title,
            content: article.content,
            summary: article.summary,
            status: article.status,
            publishDate: article.publishDate,
            authorId: article.authorId,
            category: article.category,
            tags: article.tags,
            coverImage: article.coverImage,
            createdAt: now,
            updatedAt: now,
        };
        if (this.supabase) {
            const { data, error } = await this.supabase.from('articles').insert({
                id: newArt.id,
                title: newArt.title,
                content: newArt.content,
                summary: newArt.summary,
                status: newArt.status,
                publish_date: newArt.publishDate,
                author_id: newArt.authorId,
                category: newArt.category,
                tags: newArt.tags,
                cover_image: newArt.coverImage,
                created_at: newArt.createdAt,
                updated_at: newArt.updatedAt,
            }).select().single();
            if (error)
                throw error;
            return data;
        }
        else {
            const db = await this.readLocalDb();
            db.articles.push(newArt);
            await this.writeLocalDb(db);
            return newArt;
        }
    }
    async updateArticle(id, updates) {
        const now = new Date().toISOString();
        if (this.supabase) {
            const supabaseUpdates = { ...updates, updated_at: now };
            if (updates.publishDate !== undefined)
                supabaseUpdates.publish_date = updates.publishDate;
            if (updates.authorId !== undefined)
                supabaseUpdates.author_id = updates.authorId;
            if (updates.coverImage !== undefined)
                supabaseUpdates.cover_image = updates.coverImage;
            delete supabaseUpdates.publishDate;
            delete supabaseUpdates.authorId;
            delete supabaseUpdates.coverImage;
            delete supabaseUpdates.author;
            const { data, error } = await this.supabase.from('articles').update(supabaseUpdates).eq('id', id).select().single();
            if (error)
                throw error;
            return data;
        }
        else {
            const db = await this.readLocalDb();
            const idx = db.articles.findIndex((a) => a.id === id);
            if (idx === -1)
                throw new Error('Article not found');
            db.articles[idx] = { ...db.articles[idx], ...updates, updatedAt: now };
            await this.writeLocalDb(db);
            return db.articles[idx];
        }
    }
    async deleteArticle(id) {
        if (this.supabase) {
            const { error } = await this.supabase.from('articles').delete().eq('id', id);
            if (error)
                throw error;
            return true;
        }
        else {
            const db = await this.readLocalDb();
            const filter = db.articles.filter((a) => a.id !== id);
            if (filter.length === db.articles.length)
                return false;
            db.articles = filter;
            await this.writeLocalDb(db);
            return true;
        }
    }
    // --- Tasks ---
    async getTasks() {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase
                    .from('tasks')
                    .select('*, assigneeProfiles:assignee_id(*), reporterProfiles:reporter_id(*)');
                if (error)
                    throw error;
                return (data || []).map(task => ({
                    ...task,
                    assignee: task.assigneeProfiles || undefined,
                    reporter: task.reporterProfiles || undefined,
                }));
            }
            catch (err) {
                console.warn('Supabase query getTasks failed, using local fallback:', err);
                const db = await this.readLocalDb();
                return db.tasks.map((task) => ({
                    ...task,
                    assignee: db.profiles.find((p) => p.id === task.assigneeId) || undefined,
                    reporter: db.profiles.find((p) => p.id === task.reporterId) || undefined,
                }));
            }
        }
        else {
            const db = await this.readLocalDb();
            return db.tasks.map((task) => ({
                ...task,
                assignee: db.profiles.find((p) => p.id === task.assigneeId) || undefined,
                reporter: db.profiles.find((p) => p.id === task.reporterId) || undefined,
            }));
        }
    }
    async getTaskById(id) {
        if (this.supabase) {
            const { data, error } = await this.supabase
                .from('tasks')
                .select('*, assigneeProfiles:assignee_id(*), reporterProfiles:reporter_id(*)')
                .eq('id', id)
                .single();
            if (error)
                return null;
            return {
                ...data,
                assignee: data.assigneeProfiles || undefined,
                reporter: data.reporterProfiles || undefined,
            };
        }
        else {
            const db = await this.readLocalDb();
            const task = db.tasks.find((t) => t.id === id);
            if (!task)
                return null;
            return {
                ...task,
                assignee: db.profiles.find((p) => p.id === task.assigneeId) || undefined,
                reporter: db.profiles.find((p) => p.id === task.reporterId) || undefined,
            };
        }
    }
    async createTask(task) {
        const now = new Date().toISOString();
        const newTask = {
            id: task.id || crypto.randomUUID(),
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            assigneeId: task.assigneeId,
            reporterId: task.reporterId,
            dueDate: task.dueDate,
            createdAt: now,
            updatedAt: now,
        };
        if (this.supabase) {
            const { data, error } = await this.supabase.from('tasks').insert({
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                priority: newTask.priority,
                assignee_id: newTask.assigneeId,
                reporter_id: newTask.reporterId,
                due_date: newTask.dueDate,
                created_at: newTask.createdAt,
                updated_at: newTask.updatedAt,
            }).select().single();
            if (error)
                throw error;
            return data;
        }
        else {
            const db = await this.readLocalDb();
            db.tasks.push(newTask);
            await this.writeLocalDb(db);
            return newTask;
        }
    }
    async updateTask(id, updates) {
        const now = new Date().toISOString();
        if (this.supabase) {
            const supabaseUpdates = { ...updates, updated_at: now };
            if (updates.assigneeId !== undefined)
                supabaseUpdates.assignee_id = updates.assigneeId;
            if (updates.reporterId !== undefined)
                supabaseUpdates.reporter_id = updates.reporterId;
            if (updates.dueDate !== undefined)
                supabaseUpdates.due_date = updates.dueDate;
            delete supabaseUpdates.assigneeId;
            delete supabaseUpdates.reporterId;
            delete supabaseUpdates.dueDate;
            delete supabaseUpdates.assignee;
            delete supabaseUpdates.reporter;
            const { data, error } = await this.supabase.from('tasks').update(supabaseUpdates).eq('id', id).select().single();
            if (error)
                throw error;
            return data;
        }
        else {
            const db = await this.readLocalDb();
            const idx = db.tasks.findIndex((t) => t.id === id);
            if (idx === -1)
                throw new Error('Task not found');
            db.tasks[idx] = { ...db.tasks[idx], ...updates, updatedAt: now };
            await this.writeLocalDb(db);
            return db.tasks[idx];
        }
    }
    async deleteTask(id) {
        if (this.supabase) {
            const { error } = await this.supabase.from('tasks').delete().eq('id', id);
            if (error)
                throw error;
            return true;
        }
        else {
            const db = await this.readLocalDb();
            const filter = db.tasks.filter((t) => t.id !== id);
            if (filter.length === db.tasks.length)
                return false;
            db.tasks = filter;
            await this.writeLocalDb(db);
            return true;
        }
    }
    // --- Media Assets ---
    async getMediaAssets() {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase.from('media_assets').select('*, profiles:uploaded_by(*)');
                if (error)
                    throw error;
                return (data || []).map(asset => ({
                    ...asset,
                    uploader: asset.profiles || undefined,
                }));
            }
            catch (err) {
                console.warn('Supabase query getMediaAssets failed, using local fallback:', err);
                const db = await this.readLocalDb();
                return db.media_assets.map((asset) => ({
                    ...asset,
                    uploader: db.profiles.find((p) => p.id === asset.uploadedBy) || undefined,
                }));
            }
        }
        else {
            const db = await this.readLocalDb();
            return db.media_assets.map((asset) => ({
                ...asset,
                uploader: db.profiles.find((p) => p.id === asset.uploadedBy) || undefined,
            }));
        }
    }
    async createMediaAsset(asset) {
        const now = new Date().toISOString();
        const newAsset = {
            id: asset.id || crypto.randomUUID(),
            fileName: asset.fileName,
            fileUrl: asset.fileUrl,
            fileType: asset.fileType,
            fileSize: asset.fileSize,
            uploadedBy: asset.uploadedBy,
            createdAt: now,
        };
        if (this.supabase) {
            const { data, error } = await this.supabase.from('media_assets').insert({
                id: newAsset.id,
                file_name: newAsset.fileName,
                file_url: newAsset.fileUrl,
                file_type: newAsset.fileType,
                file_size: newAsset.fileSize,
                uploaded_by: newAsset.uploadedBy,
                created_at: newAsset.createdAt,
            }).select().single();
            if (error)
                throw error;
            return data;
        }
        else {
            const db = await this.readLocalDb();
            db.media_assets.push(newAsset);
            await this.writeLocalDb(db);
            return newAsset;
        }
    }
    async deleteMediaAsset(id) {
        if (this.supabase) {
            const { error } = await this.supabase.from('media_assets').delete().eq('id', id);
            if (error)
                throw error;
            return true;
        }
        else {
            const db = await this.readLocalDb();
            const filter = db.media_assets.filter((a) => a.id !== id);
            if (filter.length === db.media_assets.length)
                return false;
            db.media_assets = filter;
            await this.writeLocalDb(db);
            return true;
        }
    }
    // --- Comments ---
    async getComments(articleId, taskId) {
        if (this.supabase) {
            let query = this.supabase.from('comments').select('*, profiles:user_id(*)');
            if (articleId)
                query = query.eq('article_id', articleId);
            if (taskId)
                query = query.eq('task_id', taskId);
            const { data, error } = await query;
            if (error)
                throw error;
            return (data || []).map(comment => ({
                ...comment,
                user: comment.profiles || undefined,
            }));
        }
        else {
            const db = await this.readLocalDb();
            let comments = db.comments;
            if (articleId)
                comments = comments.filter((c) => c.articleId === articleId);
            if (taskId)
                comments = comments.filter((c) => c.taskId === taskId);
            return comments.map((c) => ({
                ...c,
                user: db.profiles.find((p) => p.id === c.userId) || undefined,
            }));
        }
    }
    async createComment(comment) {
        const now = new Date().toISOString();
        const newComment = {
            id: crypto.randomUUID(),
            content: comment.content,
            userId: comment.userId,
            articleId: comment.articleId,
            taskId: comment.taskId,
            createdAt: now,
        };
        if (this.supabase) {
            const { data, error } = await this.supabase.from('comments').insert({
                id: newComment.id,
                content: newComment.content,
                user_id: newComment.userId,
                article_id: newComment.articleId,
                task_id: newComment.taskId,
                created_at: newComment.createdAt,
            }).select().single();
            if (error)
                throw error;
            return data;
        }
        else {
            const db = await this.readLocalDb();
            db.comments.push(newComment);
            await this.writeLocalDb(db);
            return newComment;
        }
    }
    async deleteComment(id) {
        if (this.supabase) {
            const { error } = await this.supabase.from('comments').delete().eq('id', id);
            if (error)
                throw error;
            return true;
        }
        else {
            const db = await this.readLocalDb();
            const filter = db.comments.filter((c) => c.id !== id);
            if (filter.length === db.comments.length)
                return false;
            db.comments = filter;
            await this.writeLocalDb(db);
            return true;
        }
    }
    // --- Activity Logs ---
    async getActivityLogs() {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase.from('activity_logs').select('*').order('created_at', { ascending: false }).limit(20);
                if (error)
                    throw error;
                return data || [];
            }
            catch (err) {
                console.warn('Supabase query getActivityLogs failed, using local fallback:', err);
                const db = await this.readLocalDb();
                return [...db.activity_logs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);
            }
        }
        else {
            const db = await this.readLocalDb();
            return [...db.activity_logs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 20);
        }
    }
    async createActivityLog(log) {
        const now = new Date().toISOString();
        const newLog = {
            id: crypto.randomUUID(),
            userId: log.userId,
            userName: log.userName,
            userRole: log.userRole,
            action: log.action,
            entityType: log.entityType,
            entityId: log.entityId,
            entityName: log.entityName,
            createdAt: now,
        };
        if (this.supabase) {
            const { data, error } = await this.supabase.from('activity_logs').insert({
                id: newLog.id,
                user_id: newLog.userId,
                user_name: newLog.userName,
                user_role: newLog.userRole,
                action: newLog.action,
                entity_type: newLog.entityType,
                entity_id: newLog.entityId,
                entity_name: newLog.entityName,
                created_at: newLog.createdAt,
            }).select().single();
            if (error)
                throw error;
            return data;
        }
        else {
            const db = await this.readLocalDb();
            db.activity_logs.push(newLog);
            await this.writeLocalDb(db);
            return newLog;
        }
    }
    // --- Dashboard Metrics ---
    async getDashboardMetrics() {
        const articles = await this.getArticles();
        const tasks = await this.getTasks();
        const assets = await this.getMediaAssets();
        const logs = await this.getActivityLogs();
        const totalArticles = articles.length;
        const publishedArticles = articles.filter(a => a.status === 'published').length;
        const pendingReviews = articles.filter(a => a.status === 'review').length;
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(t => t.status === 'done').length;
        const totalAssets = assets.length;
        // Simulated views count
        const viewsTotal = 142850;
        const viewsTrend = [12000, 15000, 14000, 18000, 22000, 25000, 36850];
        return {
            totalArticles,
            publishedArticles,
            pendingReviews,
            totalTasks,
            completedTasks,
            totalAssets,
            viewsTotal,
            viewsTrend,
            recentActivity: logs,
        };
    }
}
export const dbService = new DbService();
//# sourceMappingURL=dbService.js.map