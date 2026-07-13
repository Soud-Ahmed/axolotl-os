import { User, Article, MediaAsset, Task, Comment, ActivityLog, DashboardMetrics } from '../types/index.js';
declare class DbService {
    private supabase;
    private localDbInitialized;
    constructor();
    private initLocalDb;
    private readLocalDb;
    private writeLocalDb;
    private mapProfile;
    private mapProfileToDb;
    getProfiles(): Promise<User[]>;
    getProfileById(id: string): Promise<User | null>;
    getProfileByEmail(email: string): Promise<User | null>;
    getProfileWithPasswordByEmail(email: string): Promise<(User & {
        passwordHash: string;
    }) | null>;
    createProfileWithPassword(user: User, passwordHash: string): Promise<User>;
    createProfile(user: User): Promise<User>;
    updateProfile(id: string, updates: Partial<User>): Promise<User>;
    getArticles(): Promise<Article[]>;
    getArticleById(id: string): Promise<Article | null>;
    createArticle(article: Omit<Article, 'id' | 'createdAt' | 'updatedAt'> & {
        id?: string;
    }): Promise<Article>;
    updateArticle(id: string, updates: Partial<Article>): Promise<Article>;
    deleteArticle(id: string): Promise<boolean>;
    getTasks(): Promise<Task[]>;
    getTaskById(id: string): Promise<Task | null>;
    createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> & {
        id?: string;
    }): Promise<Task>;
    updateTask(id: string, updates: Partial<Task>): Promise<Task>;
    deleteTask(id: string): Promise<boolean>;
    getMediaAssets(): Promise<MediaAsset[]>;
    createMediaAsset(asset: Omit<MediaAsset, 'id' | 'createdAt'> & {
        id?: string;
    }): Promise<MediaAsset>;
    deleteMediaAsset(id: string): Promise<boolean>;
    getComments(articleId?: string, taskId?: string): Promise<Comment[]>;
    createComment(comment: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment>;
    deleteComment(id: string): Promise<boolean>;
    getActivityLogs(): Promise<ActivityLog[]>;
    createActivityLog(log: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<ActivityLog>;
    getDashboardMetrics(): Promise<DashboardMetrics>;
}
export declare const dbService: DbService;
export {};
//# sourceMappingURL=dbService.d.ts.map