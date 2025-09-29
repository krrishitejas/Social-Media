import { device, expect, element, by, waitFor } from 'detox';

describe('Social Media App E2E Tests', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  describe('Authentication Flow', () => {
    it('should show login screen on app launch', async () => {
      await expect(element(by.id('login-screen'))).toBeVisible();
    });

    it('should navigate to register screen', async () => {
      await element(by.id('register-button')).tap();
      await expect(element(by.id('register-screen'))).toBeVisible();
    });

    it('should show validation errors for empty fields', async () => {
      await element(by.id('login-button')).tap();
      await expect(element(by.text('Email is required'))).toBeVisible();
      await expect(element(by.text('Password is required'))).toBeVisible();
    });

    it('should login with valid credentials', async () => {
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      await waitFor(element(by.id('home-screen')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Home Feed', () => {
    beforeEach(async () => {
      // Login first
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    });

    it('should display home feed', async () => {
      await expect(element(by.id('home-screen'))).toBeVisible();
      await expect(element(by.id('feed-list'))).toBeVisible();
    });

    it('should switch between algorithmic and following modes', async () => {
      await element(by.id('following-tab')).tap();
      await expect(element(by.id('following-tab'))).toBeVisible();
      
      await element(by.id('algorithmic-tab')).tap();
      await expect(element(by.id('algorithmic-tab'))).toBeVisible();
    });

    it('should like a post', async () => {
      await element(by.id('like-button-0')).tap();
      await expect(element(by.id('like-button-0'))).toBeVisible();
    });

    it('should bookmark a post', async () => {
      await element(by.id('bookmark-button-0')).tap();
      await expect(element(by.id('bookmark-button-0'))).toBeVisible();
    });
  });

  describe('Search and Explore', () => {
    beforeEach(async () => {
      // Login first
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    });

    it('should navigate to search screen', async () => {
      await element(by.id('search-tab')).tap();
      await expect(element(by.id('search-screen'))).toBeVisible();
    });

    it('should search for users', async () => {
      await element(by.id('search-tab')).tap();
      await element(by.id('search-input')).typeText('testuser');
      await element(by.id('search-button')).tap();
      
      await waitFor(element(by.id('search-results')))
        .toBeVisible()
        .withTimeout(3000);
    });

    it('should navigate to explore screen', async () => {
      await element(by.id('explore-tab')).tap();
      await expect(element(by.id('explore-screen'))).toBeVisible();
    });
  });

  describe('Post Creation', () => {
    beforeEach(async () => {
      // Login first
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    });

    it('should navigate to camera screen', async () => {
      await element(by.id('camera-tab')).tap();
      await expect(element(by.id('camera-screen'))).toBeVisible();
    });

    it('should create a new post', async () => {
      await element(by.id('camera-tab')).tap();
      await element(by.id('add-media-button')).tap();
      // Mock media selection
      await element(by.id('media-selected')).tap();
      
      await element(by.id('caption-input')).typeText('Test post caption');
      await element(by.id('share-button')).tap();
      
      await waitFor(element(by.text('Post created successfully')))
        .toBeVisible()
        .withTimeout(5000);
    });
  });

  describe('Profile', () => {
    beforeEach(async () => {
      // Login first
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    });

    it('should navigate to profile screen', async () => {
      await element(by.id('profile-tab')).tap();
      await expect(element(by.id('profile-screen'))).toBeVisible();
    });

    it('should display user posts grid', async () => {
      await element(by.id('profile-tab')).tap();
      await expect(element(by.id('posts-grid'))).toBeVisible();
    });

    it('should edit profile', async () => {
      await element(by.id('profile-tab')).tap();
      await element(by.id('edit-profile-button')).tap();
      await expect(element(by.id('edit-profile-screen'))).toBeVisible();
    });
  });

  describe('Stories', () => {
    beforeEach(async () => {
      // Login first
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    });

    it('should display stories ring', async () => {
      await expect(element(by.id('stories-ring'))).toBeVisible();
    });

    it('should view a story', async () => {
      await element(by.id('story-0')).tap();
      await expect(element(by.id('story-viewer'))).toBeVisible();
    });

    it('should create a new story', async () => {
      await element(by.id('add-story-button')).tap();
      await expect(element(by.id('story-creator'))).toBeVisible();
    });
  });

  describe('Navigation', () => {
    beforeEach(async () => {
      // Login first
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      await waitFor(element(by.id('home-screen'))).toBeVisible().withTimeout(5000);
    });

    it('should navigate between all main tabs', async () => {
      // Home
      await element(by.id('home-tab')).tap();
      await expect(element(by.id('home-screen'))).toBeVisible();

      // Search
      await element(by.id('search-tab')).tap();
      await expect(element(by.id('search-screen'))).toBeVisible();

      // Camera
      await element(by.id('camera-tab')).tap();
      await expect(element(by.id('camera-screen'))).toBeVisible();

      // Notifications
      await element(by.id('notifications-tab')).tap();
      await expect(element(by.id('notifications-screen'))).toBeVisible();

      // Profile
      await element(by.id('profile-tab')).tap();
      await expect(element(by.id('profile-screen'))).toBeVisible();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors gracefully', async () => {
      // Simulate network error
      await device.setURLBlacklist(['.*']);
      
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      await expect(element(by.text('Network error'))).toBeVisible();
    });

    it('should show loading states', async () => {
      await element(by.id('email-input')).typeText('test@example.com');
      await element(by.id('password-input')).typeText('password123');
      await element(by.id('login-button')).tap();
      
      await expect(element(by.id('loading-indicator'))).toBeVisible();
    });
  });
});
