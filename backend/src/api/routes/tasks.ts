import { Router, Request, Response } from 'express';
import { dbService } from '../../services/dbService.js';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth.js';
import { TaskStatus, TaskPriority } from '../../types/index.js';

const router = Router();

// GET /api/v1/tasks
router.get('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    let tasks = await dbService.getTasks();

    // Client filter: only tasks assigned to or reported by them
    if (authReq.user!.role === 'client') {
      tasks = tasks.filter(t => t.assigneeId === authReq.user!.id || t.reporterId === authReq.user!.id);
    }

    return res.status(200).json(tasks);
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /api/v1/tasks/:id
router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const task = await dbService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Not Found', message: 'Task not found' });
    }

    // Client guard
    if (authReq.user!.role === 'client' && task.assigneeId !== authReq.user!.id && task.reporterId !== authReq.user!.id) {
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
    }

    return res.status(200).json(task);
  } catch (error: any) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /api/v1/tasks
router.post('/', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const { title, description, status, priority, assigneeId, dueDate } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Validation Error', message: 'Task title is required' });
    }

    // Clients cannot assign tasks to other users
    let finalAssignee = assigneeId;
    if (authReq.user!.role === 'client') {
      finalAssignee = authReq.user!.id;
    }

    const newTask = await dbService.createTask({
      title,
      description: description || '',
      status: (status as TaskStatus) || 'todo',
      priority: (priority as TaskPriority) || 'medium',
      assigneeId: finalAssignee,
      reporterId: authReq.user!.id,
      dueDate
    });

    // Create activity log
    await dbService.createActivityLog({
      userId: authReq.user!.id,
      userName: authReq.user!.name,
      userRole: authReq.user!.role,
      action: `Created task: ${title}`,
      entityType: 'task',
      entityId: newTask.id,
      entityName: title
    });

    return res.status(201).json(newTask);
  } catch (error: any) {
    console.error('Error creating task:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// PUT /api/v1/tasks/:id
router.put('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const task = await dbService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Not Found', message: 'Task not found' });
    }

    // Client guard
    if (authReq.user!.role === 'client' && task.assigneeId !== authReq.user!.id && task.reporterId !== authReq.user!.id) {
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
    }

    const { title, description, status, priority, assigneeId, dueDate } = req.body;
    const updates: Partial<typeof task> = {};

    if (title !== undefined && authReq.user!.role !== 'client') updates.title = title;
    if (description !== undefined && authReq.user!.role !== 'client') updates.description = description;
    if (status !== undefined) updates.status = status;
    if (priority !== undefined && authReq.user!.role !== 'client') updates.priority = priority;
    if (assigneeId !== undefined && authReq.user!.role !== 'client') updates.assigneeId = assigneeId;
    if (dueDate !== undefined && authReq.user!.role !== 'client') updates.dueDate = dueDate;

    const updatedTask = await dbService.updateTask(id, updates);

    // Create activity log
    await dbService.createActivityLog({
      userId: authReq.user!.id,
      userName: authReq.user!.name,
      userRole: authReq.user!.role,
      action: `Updated task: ${updatedTask.title} (Status: ${updatedTask.status})`,
      entityType: 'task',
      entityId: id,
      entityName: updatedTask.title
    });

    return res.status(200).json(updatedTask);
  } catch (error: any) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// DELETE /api/v1/tasks/:id
router.delete('/:id', requireAuth, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const authReq = req as AuthenticatedRequest;
    const task = await dbService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Not Found', message: 'Task not found' });
    }

    // Clients cannot delete tasks
    if (authReq.user!.role === 'client') {
      return res.status(403).json({ error: 'Forbidden', message: 'Clients cannot delete tasks' });
    }

    await dbService.deleteTask(id);

    // Create activity log
    await dbService.createActivityLog({
      userId: authReq.user!.id,
      userName: authReq.user!.name,
      userRole: authReq.user!.role,
      action: `Deleted task: ${task.title}`,
      entityType: 'task',
      entityId: id,
      entityName: task.title
    });

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// --- Comments for Tasks ---

// GET /api/v1/tasks/:id/comments
router.get('/:id/comments', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const task = await dbService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Not Found', message: 'Task not found' });
    }

    // Client guard
    if (authReq.user!.role === 'client' && task.assigneeId !== authReq.user!.id && task.reporterId !== authReq.user!.id) {
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
    }

    const comments = await dbService.getComments(undefined, id);
    return res.status(200).json(comments);
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// POST /api/v1/tasks/:id/comments
router.post('/:id/comments', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const id = req.params.id as string;
    const task = await dbService.getTaskById(id);
    if (!task) {
      return res.status(404).json({ error: 'Not Found', message: 'Task not found' });
    }

    // Client guard
    if (authReq.user!.role === 'client' && task.assigneeId !== authReq.user!.id && task.reporterId !== authReq.user!.id) {
      return res.status(403).json({ error: 'Forbidden', message: 'Access denied' });
    }

    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ error: 'Validation Error', message: 'Comment content is required' });
    }

    const comment = await dbService.createComment({
      content,
      userId: authReq.user!.id,
      taskId: id
    });

    return res.status(201).json(comment);
  } catch (error: any) {
    console.error('Error posting comment:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
