import { Router, Request, Response } from 'express';
import { dbService } from '../../services/dbService.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../../middleware/auth.js';
import { ArticleStatus } from '../../types/index.js';

const router = Router();

// GET /api/v1/articles
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const articles = await dbService.getArticles();
    return res.status(200).json(articles);
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /api/v1/articles/:id
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const article = await dbService.getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: 'Not Found', message: 'Article not found' });
    }
    return res.status(200).json(article);
  } catch (error: any) {
    console.error('Error fetching article:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /api/v1/articles
router.post('/', requireAuth, requireRole(['super_admin', 'admin']), async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { title, content, summary, status, publishDate, category, tags, coverImage } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Validation Error', message: 'Title and content are required' });
    }

    const newArticle = await dbService.createArticle({
      title,
      content,
      summary: summary || '',
      status: (status as ArticleStatus) || 'draft',
      publishDate,
      authorId: authReq.user!.id,
      category: category || 'General',
      tags: tags || [],
      coverImage
    });

    // Create activity log
    await dbService.createActivityLog({
      userId: authReq.user!.id,
      userName: authReq.user!.name,
      userRole: authReq.user!.role,
      action: `Created article: ${title}`,
      entityType: 'article',
      entityId: newArticle.id,
      entityName: title
    });

    return res.status(201).json(newArticle);
  } catch (error: any) {
    console.error('Error creating article:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /api/v1/articles/:id
router.put('/:id', requireAuth, requireRole(['super_admin', 'admin']), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const article = await dbService.getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: 'Not Found', message: 'Article not found' });
    }

    const { title, content, summary, status, publishDate, category, tags, coverImage } = req.body;
    const updates: Partial<typeof article> = {};
    
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (summary !== undefined) updates.summary = summary;
    if (status !== undefined) updates.status = status;
    if (publishDate !== undefined) updates.publishDate = publishDate;
    if (category !== undefined) updates.category = category;
    if (tags !== undefined) updates.tags = tags;
    if (coverImage !== undefined) updates.coverImage = coverImage;

    const updatedArticle = await dbService.updateArticle(id, updates);

    // Create activity log
    await dbService.createActivityLog({
      userId: authReq.user!.id,
      userName: authReq.user!.name,
      userRole: authReq.user!.role,
      action: `Updated article: ${updatedArticle.title}`,
      entityType: 'article',
      entityId: id,
      entityName: updatedArticle.title
    });

    return res.status(200).json(updatedArticle);
  } catch (error: any) {
    console.error('Error updating article:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// DELETE /api/v1/articles/:id
router.delete('/:id', requireAuth, requireRole(['super_admin', 'admin']), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const article = await dbService.getArticleById(id);
    if (!article) {
      return res.status(404).json({ error: 'Not Found', message: 'Article not found' });
    }

    await dbService.deleteArticle(id);

    // Create activity log
    await dbService.createActivityLog({
      userId: authReq.user!.id,
      userName: authReq.user!.name,
      userRole: authReq.user!.role,
      action: `Deleted article: ${article.title}`,
      entityType: 'article',
      entityId: id,
      entityName: article.title
    });

    return res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// --- Comments for Articles ---

// GET /api/v1/articles/:id/comments
router.get('/:id/comments', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const comments = await dbService.getComments(id, undefined);
    return res.status(200).json(comments);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /api/v1/articles/:id/comments
router.post('/:id/comments', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Validation Error', message: 'Comment content is required' });
    }

    const comment = await dbService.createComment({
      content,
      userId: authReq.user!.id,
      articleId: id
    });

    return res.status(201).json(comment);
  } catch (error: any) {
    console.error('Error posting comment:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
