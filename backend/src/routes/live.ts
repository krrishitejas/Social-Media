import { Router, Request, Response } from 'express';

const router = Router();

// Get live streams
router.get('/streams', (req: Request, res: Response) => {
  try {
    // Mock response
    res.json({
      success: true,
      streams: [
        {
          id: '1',
          title: 'Live Stream',
          description: 'Test live stream',
          host: {
            id: '1',
            username: 'host',
            fullName: 'Host User',
            avatar: 'https://example.com/avatar.jpg',
          },
          viewerCount: 100,
          isLive: true,
          startedAt: new Date().toISOString(),
        },
      ],
    });
  } catch (error) {
    console.error('Get live streams error:', error);
    res.status(500).json({ error: 'Failed to get live streams' });
  }
});

// Create live stream
router.post('/create', (req: Request, res: Response) => {
  try {
    const { hostId, title, description, isPublic = true } = req.body;

    // Mock response
    res.status(201).json({
      success: true,
      stream: {
        id: '1',
        hostId,
        title,
        description,
        isPublic,
        streamKey: 'test-key',
        rtmpUrl: 'rtmp://localhost/live/test',
        hlsUrl: 'https://localhost/hls/test.m3u8',
        viewerCount: 0,
        isLive: true,
        startedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Create live stream error:', error);
    res.status(500).json({ error: 'Failed to create live stream' });
  }
});

export default router;