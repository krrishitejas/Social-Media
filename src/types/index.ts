/**
 * Core Type Definitions
 * Shared types and interfaces across the application
 */

// User types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  isVerified: boolean;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

// Post types
export interface Post {
  id: string;
  userId: string;
  user: User;
  caption: string;
  media: Media[];
  location?: Location;
  tags: string[];
  mentions: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Media types
export interface Media {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  width: number;
  height: number;
  duration?: number; // for videos
  order: number;
}

// Story types
export interface Story {
  id: string;
  userId: string;
  user: User;
  media: Media;
  isViewed: boolean;
  expiresAt: string;
  createdAt: string;
}

// Comment types
export interface Comment {
  id: string;
  postId: string;
  userId: string;
  user: User;
  content: string;
  parentId?: string; // for replies
  likesCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

// Like types
export interface Like {
  id: string;
  userId: string;
  user: User;
  targetType: 'post' | 'comment' | 'story';
  targetId: string;
  createdAt: string;
}

// Follow types
export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  follower: User;
  following: User;
  createdAt: string;
}

// Message types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  content?: string;
  media?: Media;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  isRead: boolean;
  isEdited: boolean;
  isDeleted: boolean;
  replyTo?: Message;
  createdAt: string;
  updatedAt: string;
}

// Conversation types
export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string; // for group chats
  description?: string; // for group chats
  avatar?: string; // for group chats
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isMuted: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'post';
  title: string;
  message: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

// Location types
export interface Location {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

// Search types
export interface SearchResult {
  users: User[];
  posts: Post[];
  hashtags: string[];
  locations: Location[];
}

// Feed types
export interface FeedItem {
  id: string;
  type: 'post' | 'story' | 'suggestion';
  data: Post | Story | User;
  createdAt: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Post: { postId: string };
  Profile: { userId: string };
  Chat: { conversationId: string };
  Camera: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Notifications: undefined;
  Search: undefined;
  Explore: undefined;
  Live: undefined;
  Shop: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Camera: undefined;
  Notifications: undefined;
  Profile: undefined;
};

// Theme types
export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof import('../design-system/colors').colors;
}

// Auth types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

// Form types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

// Component props types
export interface BaseComponentProps {
  style?: any;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface InputProps extends BaseComponentProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
}
