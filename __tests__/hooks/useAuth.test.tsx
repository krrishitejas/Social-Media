import { renderHook, act } from '@testing-library/react-hooks';
import { useAuth } from '../../src/hooks/useAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock auth service
jest.mock('../../src/services/authService', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getCurrentUser: jest.fn(),
  },
}));

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with no user', () => {
    const { result } = renderHook(() => useAuth());
    
    expect(result.current.user).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('loads user from storage on mount', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
    };
    
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));
    
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    
    await waitForNextUpdate();
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('handles login successfully', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
    };
    
    const { authService } = require('../../src/services/authService');
    authService.login.mockResolvedValue({ user: mockUser, token: 'mock-token' });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('handles login failure', async () => {
    const { authService } = require('../../src/services/authService');
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.login('test@example.com', 'wrong-password');
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Invalid credentials');
  });

  it('handles logout', async () => {
    const mockUser = {
      id: '1',
      username: 'testuser',
      email: 'test@example.com',
    };
    
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockUser));
    
    const { result, waitForNextUpdate } = renderHook(() => useAuth());
    await waitForNextUpdate();
    
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles registration successfully', async () => {
    const mockUser = {
      id: '1',
      username: 'newuser',
      email: 'new@example.com',
    };
    
    const { authService } = require('../../src/services/authService');
    authService.register.mockResolvedValue({ user: mockUser, token: 'mock-token' });
    
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.register({
        username: 'newuser',
        email: 'new@example.com',
        password: 'password',
        fullName: 'New User',
      });
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(authService.register).toHaveBeenCalledWith({
      username: 'newuser',
      email: 'new@example.com',
      password: 'password',
      fullName: 'New User',
    });
  });

  it('clears error when new action is performed', async () => {
    const { authService } = require('../../src/services/authService');
    authService.login.mockRejectedValue(new Error('Invalid credentials'));
    
    const { result } = renderHook(() => useAuth());
    
    // First login fails
    await act(async () => {
      await result.current.login('test@example.com', 'wrong-password');
    });
    
    expect(result.current.error).toBe('Invalid credentials');
    
    // Second login succeeds
    const mockUser = { id: '1', username: 'testuser', email: 'test@example.com' };
    authService.login.mockResolvedValue({ user: mockUser, token: 'mock-token' });
    
    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });
    
    expect(result.current.error).toBeNull();
    expect(result.current.user).toEqual(mockUser);
  });
});
