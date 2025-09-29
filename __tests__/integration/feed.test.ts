import { renderHook, act } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useFeed } from '../../src/hooks/useFeed';

// Mock feed service
jest.mock('../../src/services/feedService', () => ({
  feedService: {
    getFeed: jest.fn(),
    getStories: jest.fn(),
    likePost: jest.fn(),
    unlikePost: jest.fn(),
    bookmarkPost: jest.fn(),
    unbookmarkPost: jest.fn(),
    sharePost: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useFeed Hook Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch feed data successfully', async () => {
    const mockFeedData = {
      items: [
        {
          type: 'post',
          data: {
            id: '1',
            caption: 'Test post',
            user: { id: 'user1', username: 'testuser' },
            media: [{ url: 'https://example.com/image.jpg' }],
            likesCount: 10,
            commentsCount: 5,
            isLiked: false,
            isBookmarked: false,
          },
        },
      ],
      nextCursor: 'cursor123',
      hasMore: true,
    };

    const mockStories = [
      {
        id: 'story1',
        user: { id: 'user1', username: 'testuser', avatar: 'https://example.com/avatar.jpg' },
        media: { url: 'https://example.com/story.jpg' },
        createdAt: '2023-01-01T00:00:00Z',
      },
    ];

    const { feedService } = require('../../src/services/feedService');
    feedService.getFeed.mockResolvedValue(mockFeedData);
    feedService.getStories.mockResolvedValue(mockStories);

    const { result, waitForNextUpdate } = renderHook(() => useFeed('algorithmic'), {
      wrapper: createWrapper(),
    });

    await waitForNextUpdate();

    expect(result.current.posts).toHaveLength(1);
    expect(result.current.stories).toHaveLength(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasMore).toBe(true);
  });

  it('should handle like post action', async () => {
    const mockFeedData = {
      items: [
        {
          type: 'post',
          data: {
            id: '1',
            caption: 'Test post',
            user: { id: 'user1', username: 'testuser' },
            media: [{ url: 'https://example.com/image.jpg' }],
            likesCount: 10,
            commentsCount: 5,
            isLiked: false,
            isBookmarked: false,
          },
        },
      ],
      nextCursor: null,
      hasMore: false,
    };

    const { feedService } = require('../../src/services/feedService');
    feedService.getFeed.mockResolvedValue(mockFeedData);
    feedService.getStories.mockResolvedValue([]);
    feedService.likePost.mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() => useFeed('algorithmic'), {
      wrapper: createWrapper(),
    });

    await waitForNextUpdate();

    await act(async () => {
      result.current.handleLike('1', false);
    });

    expect(feedService.likePost).toHaveBeenCalledWith('1');
  });

  it('should handle unlike post action', async () => {
    const mockFeedData = {
      items: [
        {
          type: 'post',
          data: {
            id: '1',
            caption: 'Test post',
            user: { id: 'user1', username: 'testuser' },
            media: [{ url: 'https://example.com/image.jpg' }],
            likesCount: 10,
            commentsCount: 5,
            isLiked: true,
            isBookmarked: false,
          },
        },
      ],
      nextCursor: null,
      hasMore: false,
    };

    const { feedService } = require('../../src/services/feedService');
    feedService.getFeed.mockResolvedValue(mockFeedData);
    feedService.getStories.mockResolvedValue([]);
    feedService.unlikePost.mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() => useFeed('algorithmic'), {
      wrapper: createWrapper(),
    });

    await waitForNextUpdate();

    await act(async () => {
      result.current.handleLike('1', true);
    });

    expect(feedService.unlikePost).toHaveBeenCalledWith('1');
  });

  it('should handle bookmark post action', async () => {
    const mockFeedData = {
      items: [
        {
          type: 'post',
          data: {
            id: '1',
            caption: 'Test post',
            user: { id: 'user1', username: 'testuser' },
            media: [{ url: 'https://example.com/image.jpg' }],
            likesCount: 10,
            commentsCount: 5,
            isLiked: false,
            isBookmarked: false,
          },
        },
      ],
      nextCursor: null,
      hasMore: false,
    };

    const { feedService } = require('../../src/services/feedService');
    feedService.getFeed.mockResolvedValue(mockFeedData);
    feedService.getStories.mockResolvedValue([]);
    feedService.bookmarkPost.mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() => useFeed('algorithmic'), {
      wrapper: createWrapper(),
    });

    await waitForNextUpdate();

    await act(async () => {
      result.current.handleBookmark('1', false);
    });

    expect(feedService.bookmarkPost).toHaveBeenCalledWith('1');
  });

  it('should handle share post action', async () => {
    const mockFeedData = {
      items: [
        {
          type: 'post',
          data: {
            id: '1',
            caption: 'Test post',
            user: { id: 'user1', username: 'testuser' },
            media: [{ url: 'https://example.com/image.jpg' }],
            likesCount: 10,
            commentsCount: 5,
            isLiked: false,
            isBookmarked: false,
          },
        },
      ],
      nextCursor: null,
      hasMore: false,
    };

    const { feedService } = require('../../src/services/feedService');
    feedService.getFeed.mockResolvedValue(mockFeedData);
    feedService.getStories.mockResolvedValue([]);
    feedService.sharePost.mockResolvedValue(undefined);

    const { result, waitForNextUpdate } = renderHook(() => useFeed('algorithmic'), {
      wrapper: createWrapper(),
    });

    await waitForNextUpdate();

    await act(async () => {
      result.current.handleShare('1', 'twitter');
    });

    expect(feedService.sharePost).toHaveBeenCalledWith('1', 'twitter');
  });

  it('should handle feed refresh', async () => {
    const mockFeedData = {
      items: [],
      nextCursor: null,
      hasMore: false,
    };

    const { feedService } = require('../../src/services/feedService');
    feedService.getFeed.mockResolvedValue(mockFeedData);
    feedService.getStories.mockResolvedValue([]);

    const { result, waitForNextUpdate } = renderHook(() => useFeed('algorithmic'), {
      wrapper: createWrapper(),
    });

    await waitForNextUpdate();

    await act(async () => {
      result.current.refresh();
    });

    expect(feedService.getFeed).toHaveBeenCalledTimes(2);
    expect(feedService.getStories).toHaveBeenCalledTimes(2);
  });

  it('should handle load more', async () => {
    const mockFeedData = {
      items: [],
      nextCursor: 'cursor123',
      hasMore: true,
    };

    const { feedService } = require('../../src/services/feedService');
    feedService.getFeed.mockResolvedValue(mockFeedData);
    feedService.getStories.mockResolvedValue([]);

    const { result, waitForNextUpdate } = renderHook(() => useFeed('algorithmic'), {
      wrapper: createWrapper(),
    });

    await waitForNextUpdate();

    await act(async () => {
      result.current.loadMore();
    });

    expect(feedService.getFeed).toHaveBeenCalledTimes(2);
  });

  it('should handle errors gracefully', async () => {
    const { feedService } = require('../../src/services/feedService');
    feedService.getFeed.mockRejectedValue(new Error('Network error'));
    feedService.getStories.mockResolvedValue([]);

    const { result, waitForNextUpdate } = renderHook(() => useFeed('algorithmic'), {
      wrapper: createWrapper(),
    });

    await waitForNextUpdate();

    expect(result.current.error).toBeTruthy();
    expect(result.current.isLoading).toBe(false);
  });
});
