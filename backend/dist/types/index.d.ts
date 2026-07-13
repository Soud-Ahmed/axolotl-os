export type UserRole = 'super_admin' | 'admin' | 'client';
export interface User {
    id: string;
    email: string;
    name: string;
    fullName: string | null;
    role: UserRole;
    avatarUrl: string | null;
    companyName: string | null;
    status: string;
    createdAt: string;
    updatedAt: string;
}
export type ArticleStatus = 'draft' | 'review' | 'scheduled' | 'published';
export interface Article {
    id: string;
    title: string;
    content: string;
    summary: string;
    status: ArticleStatus;
    publishDate?: string;
    authorId: string;
    category: string;
    tags: string[];
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
}
export interface MediaAsset {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    uploadedBy: string;
    createdAt: string;
}
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeId?: string;
    reporterId: string;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}
export interface Comment {
    id: string;
    content: string;
    userId: string;
    articleId?: string;
    taskId?: string;
    createdAt: string;
}
export interface ActivityLog {
    id: string;
    userId: string;
    userName: string;
    userRole: UserRole;
    action: string;
    entityType: 'article' | 'task' | 'media' | 'user';
    entityId: string;
    entityName: string;
    createdAt: string;
}
export interface DashboardMetrics {
    totalArticles: number;
    publishedArticles: number;
    pendingReviews: number;
    totalTasks: number;
    completedTasks: number;
    totalAssets: number;
    viewsTotal: number;
    viewsTrend: number[];
    recentActivity: ActivityLog[];
}
//# sourceMappingURL=index.d.ts.map