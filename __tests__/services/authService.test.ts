import { authService } from '../../src/services/authService';

// Mock fetch
global.fetch = jest.fn();

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockResponse = {
        user: {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
        },
        token: 'mock-jwt-token',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.login('test@example.com', 'password');

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password',
        }),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error for invalid credentials', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid credentials' }),
      });

      await expect(authService.login('test@example.com', 'wrong-password'))
        .rejects.toThrow('Login failed');
    });

    it('should handle network errors', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(authService.login('test@example.com', 'password'))
        .rejects.toThrow('Network error');
    });
  });

  describe('register', () => {
    it('should register successfully with valid data', async () => {
      const mockUserData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password',
        fullName: 'New User',
      };

      const mockResponse = {
        user: {
          id: '1',
          username: 'newuser',
          email: 'new@example.com',
        },
        token: 'mock-jwt-token',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await authService.register(mockUserData);

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockUserData),
      });

      expect(result).toEqual(mockResponse);
    });

    it('should throw error for duplicate email', async () => {
      const mockUserData = {
        username: 'newuser',
        email: 'existing@example.com',
        password: 'password',
        fullName: 'New User',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ error: 'Email already exists' }),
      });

      await expect(authService.register(mockUserData))
        .rejects.toThrow('Registration failed');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Logged out successfully' }),
      });

      await authService.logout();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await authService.getCurrentUser();

      expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token',
        },
      });

      expect(result).toEqual(mockUser);
    });

    it('should throw error for invalid token', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Invalid token' }),
      });

      await expect(authService.getCurrentUser())
        .rejects.toThrow('Failed to get current user');
    });
  });
});
