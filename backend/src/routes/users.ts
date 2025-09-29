import { Router, Request, Response } from 'express';

const router = Router();

// Get user profile
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Mock response
    res.json({
      success: true,
      user: {
        id,
        username: 'testuser',
        fullName: 'Test User',
        bio: 'Test bio',
        avatar: 'https://example.com/avatar.jpg',
        isVerified: false,
        createdAt: new Date().toISOString(),
        followersCount: 100,
        followingCount: 50,
        postsCount: 25,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user profile
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, bio, avatar } = req.body;

    // Mock response
    res.json({
      success: true,
      user: {
        id,
        fullName,
        bio,
        avatar,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

export default router;