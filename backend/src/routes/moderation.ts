import { Router, Request, Response } from 'express';

const router = Router();

// Get reports
router.get('/reports', (req: Request, res: Response) => {
  try {
    // Mock response
    res.json({
      success: true,
      reports: [
        {
          id: '1',
          reporterId: '1',
          targetType: 'post',
          targetId: '1',
          reason: 'inappropriate',
          description: 'This content is inappropriate',
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ error: 'Failed to get reports' });
  }
});

// Create report
router.post('/reports', (req: Request, res: Response) => {
  try {
    const { reporterId, targetType, targetId, reason, description } = req.body;

    // Mock response
    res.status(201).json({
      success: true,
      report: {
        id: '1',
        reporterId,
        targetType,
        targetId,
        reason,
        description,
        status: 'pending',
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ error: 'Failed to create report' });
  }
});

export default router;