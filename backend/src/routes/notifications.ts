import { Router, Request, Response } from 'express';

const router = Router();

// Get notifications
router.get('/', (req: Request, res: Response) => {
  try {
    // Mock response
    res.json({
      success: true,
      notifications: [
        {
          id: '1',
          type: 'like',
          message: 'Someone liked your post',
          timestamp: new Date().toISOString(),
          read: false,
          user: {
            id: '1',
            username: 'user1',
            fullName: 'User 1',
            avatar: 'https://example.com/avatar1.jpg',
          },
        },
      ],
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Failed to get notifications' });
  }
});

// Mark notification as read
router.put('/:id/read', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Mock response
    res.json({ success: true });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

export default router;