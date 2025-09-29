import { Router, Request, Response } from 'express';

const router = Router();

// Get posts feed
router.get('/feed', (req: Request, res: Response) => {
  try {
    // Mock response
    res.json({
      success: true,
      posts: [
        {
          id: '1',
          caption: 'Test post',
          user: {
            id: '1',
            username: 'testuser',
            fullName: 'Test User',
            avatar: 'https://example.com/avatar.jpg',
          },
          media: [
            {
              id: '1',
              url: 'https://example.com/image.jpg',
              type: 'image',
            },
          ],
          likesCount: 10,
          commentsCount: 5,
          createdAt: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ error: 'Failed to get feed' });
  }
});

// Create post
router.post('/', (req: Request, res: Response) => {
  try {
    const { userId, caption, mediaIds, location } = req.body;

    // Mock response
    res.status(201).json({
      success: true,
      post: {
        id: '1',
        userId,
        caption,
        location,
        media: mediaIds.map((id: string) => ({ id, url: 'https://example.com/image.jpg' })),
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

export default router;