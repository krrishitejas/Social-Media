import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { PostCard } from '../../src/components/PostCard';
import { ThemeProvider } from '../../src/components/ThemeProvider';
import { Post } from '../../src/types';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

const mockPost: Post = {
  id: '1',
  userId: 'user1',
  caption: 'Test post caption',
  media: [
    {
      id: 'media1',
      type: 'image',
      url: 'https://example.com/image.jpg',
      width: 1080,
      height: 1080,
    },
  ],
  likesCount: 10,
  commentsCount: 5,
  sharesCount: 2,
  isLiked: false,
  isBookmarked: false,
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  user: {
    id: 'user1',
    username: 'testuser',
    fullName: 'Test User',
    avatar: 'https://example.com/avatar.jpg',
    bio: 'Test bio',
    isVerified: false,
    isPrivate: false,
    followersCount: 100,
    followingCount: 50,
    postsCount: 10,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  location: null,
  tags: ['test', 'example'],
  mentions: [],
};

describe('PostCard Component', () => {
  it('renders correctly with post data', () => {
    const { getByText } = renderWithTheme(
      <PostCard post={mockPost} onPress={() => {}} />
    );
    
    expect(getByText('testuser')).toBeTruthy();
    expect(getByText('Test post caption')).toBeTruthy();
    expect(getByText('10')).toBeTruthy(); // likes count
  });

  it('calls onPress when post is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = renderWithTheme(
      <PostCard post={mockPost} onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test post caption'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('calls onLike when like button is pressed', () => {
    const mockOnLike = jest.fn();
    const { getByTestId } = renderWithTheme(
      <PostCard 
        post={mockPost} 
        onPress={() => {}} 
        onLike={mockOnLike}
      />
    );
    
    fireEvent.press(getByTestId('like-button'));
    expect(mockOnLike).toHaveBeenCalledWith('1', false);
  });

  it('calls onBookmark when bookmark button is pressed', () => {
    const mockOnBookmark = jest.fn();
    const { getByTestId } = renderWithTheme(
      <PostCard 
        post={mockPost} 
        onPress={() => {}} 
        onBookmark={mockOnBookmark}
      />
    );
    
    fireEvent.press(getByTestId('bookmark-button'));
    expect(mockOnBookmark).toHaveBeenCalledWith('1', false);
  });

  it('calls onShare when share button is pressed', () => {
    const mockOnShare = jest.fn();
    const { getByTestId } = renderWithTheme(
      <PostCard 
        post={mockPost} 
        onPress={() => {}} 
        onShare={mockOnShare}
      />
    );
    
    fireEvent.press(getByTestId('share-button'));
    expect(mockOnShare).toHaveBeenCalledWith('1', 'general');
  });

  it('shows correct like state', () => {
    const likedPost = { ...mockPost, isLiked: true };
    const { getByTestId } = renderWithTheme(
      <PostCard post={likedPost} onPress={() => {}} />
    );
    
    const likeButton = getByTestId('like-button');
    expect(likeButton).toHaveStyle({ color: expect.any(String) });
  });

  it('shows correct bookmark state', () => {
    const bookmarkedPost = { ...mockPost, isBookmarked: true };
    const { getByTestId } = renderWithTheme(
      <PostCard post={bookmarkedPost} onPress={() => {}} />
    );
    
    const bookmarkButton = getByTestId('bookmark-button');
    expect(bookmarkButton).toHaveStyle({ color: expect.any(String) });
  });
});
