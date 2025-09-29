import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { notificationService, NotificationSettings } from '@services/notificationService';
import { Notification } from '@types';

export const useNotifications = () => {
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: notificationsData,
    isLoading,
    error,
    refetch,
  } = useQuery<{ notifications: Notification[]; nextCursor?: string; hasMore: boolean }>(
    ['notifications', cursor],
    () => notificationService.getNotifications(cursor),
    {
      keepPreviousData: true,
    }
  );

  const {
    data: settingsData,
    isLoading: settingsLoading,
    error: settingsError,
    refetch: refetchSettings,
  } = useQuery<NotificationSettings>(
    ['notification-settings'],
    () => notificationService.getNotificationSettings(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const {
    data: unreadCount,
    refetch: refetchUnreadCount,
  } = useQuery<number>(
    ['unread-count'],
    () => notificationService.getUnreadCount(),
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const markAsReadMutation = useMutation(
    (notificationId: string) => notificationService.markAsRead(notificationId),
    {
      onSuccess: (_, notificationId) => {
        // Update notification in cache
        queryClient.setQueryData(['notifications'], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            notifications: oldData.notifications.map((notif: Notification) => {
              if (notif.id === notificationId) {
                return { ...notif, isRead: true };
              }
              return notif;
            }),
          };
        });

        // Update unread count
        refetchUnreadCount();
      },
    }
  );

  const markAllAsReadMutation = useMutation(
    () => notificationService.markAllAsRead(),
    {
      onSuccess: () => {
        // Update all notifications in cache
        queryClient.setQueryData(['notifications'], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            notifications: oldData.notifications.map((notif: Notification) => ({
              ...notif,
              isRead: true,
            })),
          };
        });

        // Update unread count
        refetchUnreadCount();
      },
    }
  );

  const deleteNotificationMutation = useMutation(
    (notificationId: string) => notificationService.deleteNotification(notificationId),
    {
      onSuccess: (_, notificationId) => {
        // Remove notification from cache
        queryClient.setQueryData(['notifications'], (oldData: any) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            notifications: oldData.notifications.filter((notif: Notification) => notif.id !== notificationId),
          };
        });

        // Update unread count
        refetchUnreadCount();
      },
    }
  );

  const updateSettingsMutation = useMutation(
    (settings: Partial<NotificationSettings>) => notificationService.updateNotificationSettings(settings),
    {
      onSuccess: (updatedSettings) => {
        // Update settings in cache
        queryClient.setQueryData(['notification-settings'], updatedSettings);
      },
    }
  );

  const loadMore = useCallback(() => {
    if (notificationsData?.nextCursor && hasMore && !isLoading) {
      setCursor(notificationsData.nextCursor);
    }
  }, [notificationsData?.nextCursor, hasMore, isLoading]);

  const refresh = useCallback(() => {
    setCursor(undefined);
    setHasMore(true);
    refetch();
    refetchUnreadCount();
  }, [refetch, refetchUnreadCount]);

  const markAsRead = useCallback((notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  }, [markAsReadMutation]);

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const deleteNotification = useCallback((notificationId: string) => {
    deleteNotificationMutation.mutate(notificationId);
  }, [deleteNotificationMutation]);

  const updateSettings = useCallback((settings: Partial<NotificationSettings>) => {
    updateSettingsMutation.mutate(settings);
  }, [updateSettingsMutation]);

  useEffect(() => {
    if (notificationsData) {
      setHasMore(notificationsData.hasMore);
    }
  }, [notificationsData]);

  return {
    // Notifications data
    notifications: notificationsData?.notifications || [],
    settings: settingsData,
    unreadCount: unreadCount || 0,
    
    // Loading states
    isLoading,
    settingsLoading,
    
    // Error states
    error,
    settingsError,
    
    // Actions
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    
    // Pagination
    hasMore,
    nextCursor: notificationsData?.nextCursor,
    
    // Mutations
    markAsReadMutation,
    markAllAsReadMutation,
    deleteNotificationMutation,
    updateSettingsMutation,
  };
};

export const usePushNotifications = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    initializePushNotifications();
  }, []);

  const initializePushNotifications = async () => {
    try {
      // Request permissions
      const hasPermission = await notificationService.requestPermissions();
      setIsEnabled(hasPermission);

      if (hasPermission) {
        // Get push token (this would be implemented with react-native-push-notification)
        const pushToken = 'mock-push-token'; // Replace with actual token
        setToken(pushToken);
        
        // Register token with backend
        await notificationService.registerPushToken(pushToken);
      }
    } catch (error) {
      console.error('Push notification initialization error:', error);
    }
  };

  const scheduleLocalNotification = useCallback(async (title: string, message: string, data?: any) => {
    try {
      await notificationService.scheduleLocalNotification(title, message, data);
    } catch (error) {
      console.error('Schedule local notification error:', error);
    }
  }, []);

  const cancelAllNotifications = useCallback(async () => {
    try {
      await notificationService.cancelAllLocalNotifications();
    } catch (error) {
      console.error('Cancel notifications error:', error);
    }
  }, []);

  const unregisterToken = useCallback(async () => {
    try {
      await notificationService.unregisterPushToken();
      setToken(null);
    } catch (error) {
      console.error('Unregister token error:', error);
    }
  }, []);

  return {
    isEnabled,
    token,
    scheduleLocalNotification,
    cancelAllNotifications,
    unregisterToken,
  };
};
