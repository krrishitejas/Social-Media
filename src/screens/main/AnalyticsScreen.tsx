import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { AdminStats, UserEngagement, ContentPerformance } from '@types';

const { width } = Dimensions.get('window');

export const AnalyticsScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'content' | 'revenue'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [topUsers, setTopUsers] = useState<UserEngagement[]>([]);
  const [topPosts, setTopPosts] = useState<ContentPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const tabs = [
    { key: 'overview', label: 'Overview', icon: 'dashboard' },
    { key: 'users', label: 'Users', icon: 'people' },
    { key: 'content', label: 'Content', icon: 'content-paste' },
    { key: 'revenue', label: 'Revenue', icon: 'attach-money' },
  ] as const;

  const timeRanges = [
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: '1y', label: '1 Year' },
  ] as const;

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      // TODO: Implement actual API calls
      const mockStats: AdminStats = {
        totalUsers: 12543,
        activeUsers: 8921,
        totalPosts: 45678,
        totalLikes: 234567,
        totalComments: 34567,
        totalShares: 12345,
        totalRevenue: 125430.50,
        engagementRate: 4.2,
        growthRate: 12.5,
        retentionRate: 78.3,
      };

      const mockTopUsers: UserEngagement[] = [
        {
          userId: '1',
          username: 'user1',
          postsCount: 45,
          likesReceived: 1234,
          commentsReceived: 234,
          sharesReceived: 56,
          followersCount: 5678,
          followingCount: 1234,
          engagementRate: 8.5,
        },
        {
          userId: '2',
          username: 'user2',
          postsCount: 32,
          likesReceived: 987,
          commentsReceived: 187,
          sharesReceived: 43,
          followersCount: 4321,
          followingCount: 987,
          engagementRate: 7.2,
        },
      ];

      const mockTopPosts: ContentPerformance[] = [
        {
          postId: '1',
          caption: 'Amazing sunset view from my window',
          likesCount: 1234,
          commentsCount: 234,
          sharesCount: 56,
          viewsCount: 5678,
          engagementRate: 8.5,
          reach: 12345,
          impressions: 23456,
        },
        {
          postId: '2',
          caption: 'New recipe I tried today',
          likesCount: 987,
          commentsCount: 187,
          sharesCount: 43,
          viewsCount: 4321,
          engagementRate: 7.2,
          reach: 9876,
          impressions: 18765,
        },
      ];

      setStats(mockStats);
      setTopUsers(mockTopUsers);
      setTopPosts(mockTopPosts);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStatCard = (title: string, value: string | number, icon: string, color: string, change?: number) => (
    <View style={styles.statCard}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={24} color={color} />
        <Text style={styles.statTitle}>{title}</Text>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {change !== undefined && (
        <View style={styles.statChange}>
          <Icon 
            name={change >= 0 ? 'trending-up' : 'trending-down'} 
            size={16} 
            color={change >= 0 ? colors.success : colors.error} 
          />
          <Text style={[styles.changeText, { color: change >= 0 ? colors.success : colors.error }]}>
            {Math.abs(change)}%
          </Text>
        </View>
      )}
    </View>
  );

  const renderOverview = () => (
    <ScrollView style={styles.overviewContainer}>
      <View style={styles.statsGrid}>
        {renderStatCard('Total Users', stats?.totalUsers.toLocaleString() || '0', 'people', colors.primary, 12.5)}
        {renderStatCard('Active Users', stats?.activeUsers.toLocaleString() || '0', 'person', colors.success, 8.3)}
        {renderStatCard('Total Posts', stats?.totalPosts.toLocaleString() || '0', 'post', colors.warning, 15.2)}
        {renderStatCard('Engagement Rate', `${stats?.engagementRate}%` || '0%', 'favorite', colors.error, 2.1)}
        {renderStatCard('Total Revenue', `$${stats?.totalRevenue.toLocaleString()}` || '$0', 'attach-money', colors.link, 18.7)}
        {renderStatCard('Growth Rate', `${stats?.growthRate}%` || '0%', 'trending-up', colors.accent, 5.4)}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>User Growth</Text>
        <View style={styles.chartPlaceholder}>
          <Icon name="show-chart" size={48} color={colors.text.disabled} />
          <Text style={styles.chartText}>Chart will be displayed here</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Engagement Metrics</Text>
        <View style={styles.chartPlaceholder}>
          <Icon name="bar-chart" size={48} color={colors.text.disabled} />
          <Text style={styles.chartText}>Chart will be displayed here</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderUsers = () => (
    <ScrollView style={styles.usersContainer}>
      <Text style={styles.sectionTitle}>Top Users by Engagement</Text>
      {topUsers.map((user, index) => (
        <View key={user.userId} style={styles.userItem}>
          <View style={styles.userRank}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.username}>{user.username}</Text>
            <Text style={styles.userStats}>
              {user.postsCount} posts • {user.followersCount} followers
            </Text>
          </View>
          <View style={styles.engagementInfo}>
            <Text style={styles.engagementRate}>{user.engagementRate}%</Text>
            <Text style={styles.engagementLabel}>Engagement</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderContent = () => (
    <ScrollView style={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Top Performing Posts</Text>
      {topPosts.map((post, index) => (
        <View key={post.postId} style={styles.postItem}>
          <View style={styles.postRank}>
            <Text style={styles.rankNumber}>{index + 1}</Text>
          </View>
          <View style={styles.postInfo}>
            <Text style={styles.postCaption} numberOfLines={2}>{post.caption}</Text>
            <View style={styles.postStats}>
              <View style={styles.postStat}>
                <Icon name="favorite" size={14} color={colors.error} />
                <Text style={styles.postStatText}>{post.likesCount}</Text>
              </View>
              <View style={styles.postStat}>
                <Icon name="chat-bubble" size={14} color={colors.primary} />
                <Text style={styles.postStatText}>{post.commentsCount}</Text>
              </View>
              <View style={styles.postStat}>
                <Icon name="share" size={14} color={colors.success} />
                <Text style={styles.postStatText}>{post.sharesCount}</Text>
              </View>
            </View>
          </View>
          <View style={styles.performanceInfo}>
            <Text style={styles.performanceRate}>{post.engagementRate}%</Text>
            <Text style={styles.performanceLabel}>Engagement</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );

  const renderRevenue = () => (
    <ScrollView style={styles.revenueContainer}>
      <View style={styles.revenueStats}>
        {renderStatCard('Total Revenue', `$${stats?.totalRevenue.toLocaleString()}` || '$0', 'attach-money', colors.primary, 18.7)}
        {renderStatCard('Monthly Revenue', '$45,230', 'calendar-today', colors.success, 12.3)}
        {renderStatCard('Average Order', '$23.45', 'shopping-cart', colors.warning, 5.6)}
        {renderStatCard('Conversion Rate', '3.2%', 'trending-up', colors.error, 1.8)}
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Revenue Trends</Text>
        <View style={styles.chartPlaceholder}>
          <Icon name="show-chart" size={48} color={colors.text.disabled} />
          <Text style={styles.chartText}>Revenue chart will be displayed here</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Analytics</Text>
      
      <View style={styles.timeRangeContainer}>
        {timeRanges.map((range) => (
          <TouchableOpacity
            key={range.key}
            style={[styles.timeRangeButton, timeRange === range.key && styles.activeTimeRangeButton]}
            onPress={() => setTimeRange(range.key)}
          >
            <Text
              style={[
                styles.timeRangeText,
                timeRange === range.key && styles.activeTimeRangeText,
              ]}
            >
              {range.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, activeTab === tab.key && styles.activeTab]}
          onPress={() => setActiveTab(tab.key)}
        >
          <Icon
            name={tab.icon}
            size={20}
            color={activeTab === tab.key ? colors.primary : colors.text.secondary}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === tab.key && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'content':
        return renderContent();
      case 'revenue':
        return renderRevenue();
      default:
        return null;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    headerTitle: {
      ...typography.textStyles.h3,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    timeRangeContainer: {
      flexDirection: 'row',
    },
    timeRangeButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginRight: spacing.sm,
      backgroundColor: colors.gray[100],
      borderRadius: 20,
    },
    activeTimeRangeButton: {
      backgroundColor: colors.primary,
    },
    timeRangeText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    activeTimeRangeText: {
      color: '#FFFFFF',
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    activeTabText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    overviewContainer: {
      flex: 1,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: spacing.md,
    },
    statCard: {
      width: (width - 48) / 2,
      backgroundColor: colors.background.primary,
      borderRadius: 8,
      padding: spacing.md,
      marginBottom: spacing.md,
      marginRight: spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    statTitle: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    statValue: {
      ...typography.textStyles.h4,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    statChange: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    changeText: {
      ...typography.textStyles.caption,
      marginLeft: spacing.xs,
    },
    chartContainer: {
      backgroundColor: colors.background.primary,
      borderRadius: 8,
      padding: spacing.md,
      margin: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    chartTitle: {
      ...typography.textStyles.h6,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    chartPlaceholder: {
      height: 200,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.gray[50],
      borderRadius: 8,
    },
    chartText: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      marginTop: spacing.sm,
    },
    usersContainer: {
      flex: 1,
    },
    contentContainer: {
      flex: 1,
    },
    revenueContainer: {
      flex: 1,
    },
    sectionTitle: {
      ...typography.textStyles.h5,
      color: colors.text.primary,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    userRank: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    rankNumber: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    userInfo: {
      flex: 1,
    },
    username: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    userStats: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    engagementInfo: {
      alignItems: 'center',
    },
    engagementRate: {
      ...typography.textStyles.h6,
      color: colors.primary,
    },
    engagementLabel: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    postItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    postRank: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.warning,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: spacing.md,
    },
    postInfo: {
      flex: 1,
    },
    postCaption: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    postStats: {
      flexDirection: 'row',
    },
    postStat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    postStatText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
      marginLeft: spacing.xs,
    },
    performanceInfo: {
      alignItems: 'center',
    },
    performanceRate: {
      ...typography.textStyles.h6,
      color: colors.warning,
    },
    performanceLabel: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    revenueStats: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: spacing.md,
    },
  });

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <View style={styles.content}>
        {renderContent()}
      </View>
    </View>
  );
};
