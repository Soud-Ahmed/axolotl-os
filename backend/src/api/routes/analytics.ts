import { Router, Request, Response } from 'express';
import { dbService } from '../../services/dbService.js';
import { requireAuth, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();

// GET /api/v1/analytics/metrics
router.get('/metrics', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const metrics = await dbService.getDashboardMetrics();
    return res.status(200).json(metrics);
  } catch (error: any) {
    console.error('Error fetching analytics metrics:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

// GET /api/v1/analytics/activity
router.get('/activity', requireAuth, async (req: Request, res: Response) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const activity = await dbService.getActivityLogs();
    return res.status(200).json(activity);
  } catch (error: any) {
    console.error('Error fetching activity logs:', error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
});

export default router;
