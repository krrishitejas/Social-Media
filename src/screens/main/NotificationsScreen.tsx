import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { useNotifications } from '@hooks/useNotifications';
import { Notification } from '@types';

export const NotificationsScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    loadMore,
    refresh,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    hasMore,
  } = useNotifications();

  const filteredNotifications = activeFilter === 'unread' 
    ? notifications.filter(notif => !notif.isRead)
    : notifications;

  const handleNotificationPress = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    // TODO: Navigate to relevant screen based on notification type
    console.log('Notification pressed:', notification);
  };

  const handleNotificationLongPress = (notification: Notification) => {
    Alert.alert(
      'Notification Options',
      'Choose an action',
      [
        { text: 'Mark as Read', onPress: () => markAsRead(notification.id) },
        { text: 'Delete', onPress: () => handleDeleteNotification(notification.id), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleDeleteNotification = (notificationId: string) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => deleteNotification(notificationId), style: 'destructive' },
      ]
    );
  };

  const handleMarkAllAsRead = () => {
    Alert.alert(
      'Mark All as Read',
      'Are you sure you want to mark all notifications as read?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Mark All', onPress: markAllAsRead },
      ]
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return 'favorite';
      case 'comment':
        return 'chat-bubble';
      case 'follow':
        return 'person-add';
      case 'mention':
        return 'alternate-email';
      case 'message':
        return 'message';
      case 'story':
        return 'auto-awesome';
      case 'live':
        return 'live-tv';
      default:
        return 'notifications';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return colors.error;
      case 'comment':
        return colors.primary;
      case 'follow':
        return colors.success;
      case 'mention':
        return colors.warning;
      case 'message':
        return colors.link;
      case 'story':
        return colors.accent;
      case 'live':
        return colors.error;
      default:
        return colors.text.secondary;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.isRead && styles.unreadNotification]}
      onPress={() => handleNotificationPress(item)}
      onLongPress={() => handleNotificationLongPress(item)}
    >
      <View style={styles.notificationContent}>
        <View style={styles.iconContainer}>
          <Icon
            name={getNotificationIcon(item.type)}
            size={24}
            color={getNotificationColor(item.type)}
          />
        </View>
        
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationText} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.notificationTime}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
        </View>
        
        {item.user?.avatar && (
          <Image
            source={{ uri: item.user.avatar }}
            style={styles.userAvatar}
          />
        )}
        
        {!item.isRead && <View style={styles.unreadDot} />}
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Notifications</Text>
      
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllAsRead}>
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'all' && styles.activeFilterButton]}
        onPress={() => setActiveFilter('all')}
      >
        <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>
          All
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.filterButton, activeFilter === 'unread' && styles.activeFilterButton]}
        onPress={() => setActiveFilter('unread')}
      >
        <Text style={[styles.filterText, activeFilter === 'unread' && styles.activeFilterText]}>
          Unread ({unreadCount})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="notifications-none" size={64} color={colors.text.disabled} />
      <Text style={styles.emptyText}>
        {activeFilter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
      </Text>
      <Text style={styles.emptySubtext}>
        {activeFilter === 'unread' 
          ? 'You\'re all caught up!' 
          : 'You\'ll see notifications here when people interact with your content'
        }
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    headerTitle: {
      ...typography.textStyles.h3,
      color: colors.text.primary,
    },
    markAllButton: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    markAllText: {
      ...typography.textStyles.caption,
      color: colors.primary,
    },
    filtersContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    filterButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      borderRadius: 20,
      backgroundColor: colors.gray[100],
    },
    activeFilterButton: {
      backgroundColor: colors.primary,
    },
    filterText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    activeFilterText: {
      color: '#FFFFFF',
    },
    content: {
      flex: 1,
    },
    notificationItem: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    unreadNotification: {
      backgroundColor: colors.gray[50],
    },
    notificationContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.gray[100],
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.sm,
    },
    notificationInfo: {
      flex: 1,
    },
    notificationText: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    notificationTime: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    userAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginLeft: spacing.sm,
    },
    unreadDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
      marginLeft: spacing.sm,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      ...typography.textStyles.h4,
      color: colors.text.primary,
      marginTop: spacing.md,
      marginBottom: spacing.sm,
    },
    emptySubtext: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilters()}
      
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refresh}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
};