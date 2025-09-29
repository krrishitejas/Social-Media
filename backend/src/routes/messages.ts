import { Router, Request, Response } from 'express';

const router = Router();

// Get conversations
router.get('/conversations', (req: Request, res: Response) => {
  try {
    // Mock response
    res.json({
      success: true,
      conversations: [
        {
          id: '1',
          participants: [
            { id: '1', username: 'user1', fullName: 'User 1', avatar: 'https://example.com/avatar1.jpg' },
            { id: '2', username: 'user2', fullName: 'User 2', avatar: 'https://example.com/avatar2.jpg' },
          ],
          lastMessage: {
            id: '1',
            content: 'Hello!',
            timestamp: new Date().toISOString(),
            read: false,
          },
          unreadCount: 1,
        },
      ],
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

// Send message
router.post('/send', (req: Request, res: Response) => {
  try {
    const { conversationId, userId, content, type = 'text' } = req.body;

    // Mock response
    res.status(201).json({
      success: true,
      message: {
        id: '1',
        conversationId,
        userId,
        content,
        type,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;