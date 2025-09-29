import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { Report, ContentFilter } from '@types';

export const ModerationScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'reports' | 'filters' | 'settings'>('reports');
  const [reports, setReports] = useState<Report[]>([]);
  const [filters, setFilters] = useState<ContentFilter[]>([]);
  const [safetySettings, setSafetySettings] = useState({
    hideSensitiveContent: true,
    blockInappropriateUsers: true,
    filterSpam: true,
    moderateComments: true,
    requireApproval: false,
  });

  const tabs = [
    { key: 'reports', label: 'Reports', icon: 'report-problem' },
    { key: 'filters', label: 'Filters', icon: 'filter-list' },
    { key: 'settings', label: 'Settings', icon: 'settings' },
  ] as const;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // TODO: Implement actual API calls
      const mockReports: Report[] = [
        {
          id: '1',
          reporterId: 'user1',
          targetType: 'post',
          targetId: 'post1',
          reason: 'Inappropriate content',
          description: 'This post contains offensive material',
          status: 'pending',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
        {
          id: '2',
          reporterId: 'user2',
          targetType: 'user',
          targetId: 'user3',
          reason: 'Harassment',
          description: 'This user is sending threatening messages',
          status: 'reviewed',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z',
        },
      ];

      const mockFilters: ContentFilter[] = [
        {
          id: '1',
          name: 'Profanity Filter',
          description: 'Automatically filter out profane language',
          enabled: true,
          type: 'text',
          rules: ['profanity', 'offensive'],
        },
        {
          id: '2',
          name: 'Spam Detection',
          description: 'Detect and filter spam content',
          enabled: true,
          type: 'text',
          rules: ['spam', 'repetitive'],
        },
        {
          id: '3',
          name: 'Image Moderation',
          description: 'Moderate inappropriate images',
          enabled: true,
          type: 'image',
          rules: ['nudity', 'violence', 'inappropriate'],
        },
      ];

      setReports(mockReports);
      setFilters(mockFilters);
    } catch (error) {
      console.error('Error loading moderation data:', error);
    }
  };

  const handleReportAction = (reportId: string, action: 'approve' | 'dismiss' | 'investigate') => {
    Alert.alert(
      'Report Action',
      `Are you sure you want to ${action} this report?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: action.charAt(0).toUpperCase() + action.slice(1), onPress: () => {
          // TODO: Implement actual API call
          console.log(`${action} report:`, reportId);
        }},
      ]
    );
  };

  const handleFilterToggle = (filterId: string, enabled: boolean) => {
    setFilters(prev => prev.map(filter =>
      filter.id === filterId ? { ...filter, enabled } : filter
    ));
    // TODO: Implement actual API call
    console.log('Toggle filter:', filterId, enabled);
  };

  const handleSettingToggle = (setting: string, value: boolean) => {
    setSafetySettings(prev => ({ ...prev, [setting]: value }));
    // TODO: Implement actual API call
    console.log('Update setting:', setting, value);
  };

  const renderReport = ({ item }: { item: Report }) => (
    <View style={styles.reportItem}>
      <View style={styles.reportHeader}>
        <View style={styles.reportInfo}>
          <Text style={styles.reportType}>{item.targetType.toUpperCase()}</Text>
          <Text style={styles.reportReason}>{item.reason}</Text>
        </View>
        <View style={[styles.statusBadge, styles[`status${item.status.charAt(0).toUpperCase() + item.status.slice(1)}`]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <Text style={styles.reportDescription}>{item.description}</Text>
      
      <View style={styles.reportActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.approveButton]}
          onPress={() => handleReportAction(item.id, 'approve')}
        >
          <Icon name="check" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Approve</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.dismissButton]}
          onPress={() => handleReportAction(item.id, 'dismiss')}
        >
          <Icon name="close" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Dismiss</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.investigateButton]}
          onPress={() => handleReportAction(item.id, 'investigate')}
        >
          <Icon name="search" size={16} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Investigate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilter = ({ item }: { item: ContentFilter }) => (
    <View style={styles.filterItem}>
      <View style={styles.filterInfo}>
        <Text style={styles.filterName}>{item.name}</Text>
        <Text style={styles.filterDescription}>{item.description}</Text>
        <View style={styles.filterRules}>
          {item.rules.map((rule, index) => (
            <View key={index} style={styles.ruleTag}>
              <Text style={styles.ruleText}>{rule}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <Switch
        value={item.enabled}
        onValueChange={(value) => handleFilterToggle(item.id, value)}
        trackColor={{ false: colors.gray[300], true: colors.primary }}
        thumbColor={item.enabled ? '#FFFFFF' : colors.gray[500]}
      />
    </View>
  );

  const renderSettings = () => (
    <ScrollView style={styles.settingsContainer}>
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Content Moderation</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Hide Sensitive Content</Text>
            <Text style={styles.settingDescription}>
              Automatically hide posts that may contain sensitive content
            </Text>
          </View>
          <Switch
            value={safetySettings.hideSensitiveContent}
            onValueChange={(value) => handleSettingToggle('hideSensitiveContent', value)}
            trackColor={{ false: colors.gray[300], true: colors.primary }}
            thumbColor={safetySettings.hideSensitiveContent ? '#FFFFFF' : colors.gray[500]}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Block Inappropriate Users</Text>
            <Text style={styles.settingDescription}>
              Automatically block users who violate community guidelines
            </Text>
          </View>
          <Switch
            value={safetySettings.blockInappropriateUsers}
            onValueChange={(value) => handleSettingToggle('blockInappropriateUsers', value)}
            trackColor={{ false: colors.gray[300], true: colors.primary }}
            thumbColor={safetySettings.blockInappropriateUsers ? '#FFFFFF' : colors.gray[500]}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Filter Spam</Text>
            <Text style={styles.settingDescription}>
              Automatically detect and filter spam content
            </Text>
          </View>
          <Switch
            value={safetySettings.filterSpam}
            onValueChange={(value) => handleSettingToggle('filterSpam', value)}
            trackColor={{ false: colors.gray[300], true: colors.primary }}
            thumbColor={safetySettings.filterSpam ? '#FFFFFF' : colors.gray[500]}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Moderate Comments</Text>
            <Text style={styles.settingDescription}>
              Review comments before they appear publicly
            </Text>
          </View>
          <Switch
            value={safetySettings.moderateComments}
            onValueChange={(value) => handleSettingToggle('moderateComments', value)}
            trackColor={{ false: colors.gray[300], true: colors.primary }}
            thumbColor={safetySettings.moderateComments ? '#FFFFFF' : colors.gray[500]}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingName}>Require Approval</Text>
            <Text style={styles.settingDescription}>
              Require manual approval for all new posts
            </Text>
          </View>
          <Switch
            value={safetySettings.requireApproval}
            onValueChange={(value) => handleSettingToggle('requireApproval', value)}
            trackColor={{ false: colors.gray[300], true: colors.primary }}
            thumbColor={safetySettings.requireApproval ? '#FFFFFF' : colors.gray[500]}
          />
        </View>
      </View>
    </ScrollView>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Moderation</Text>
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
      case 'reports':
        return (
          <FlatList
            data={reports}
            renderItem={renderReport}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.reportsList}
          />
        );
      
      case 'filters':
        return (
          <FlatList
            data={filters}
            renderItem={renderFilter}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.filtersList}
          />
        );
      
      case 'settings':
        return renderSettings();
      
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
    reportsList: {
      padding: spacing.md,
    },
    reportItem: {
      backgroundColor: colors.background.primary,
      borderRadius: 8,
      padding: spacing.md,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    reportHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    reportInfo: {
      flex: 1,
    },
    reportType: {
      ...typography.textStyles.caption,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    reportReason: {
      ...typography.textStyles.body,
      color: colors.text.primary,
    },
    statusBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
    },
    statusPending: {
      backgroundColor: colors.warning,
    },
    statusReviewed: {
      backgroundColor: colors.primary,
    },
    statusResolved: {
      backgroundColor: colors.success,
    },
    statusDismissed: {
      backgroundColor: colors.gray[500],
    },
    statusText: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
    },
    reportDescription: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      marginBottom: spacing.md,
    },
    reportActions: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
    },
    approveButton: {
      backgroundColor: colors.success,
    },
    dismissButton: {
      backgroundColor: colors.gray[500],
    },
    investigateButton: {
      backgroundColor: colors.primary,
    },
    actionButtonText: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
      marginLeft: spacing.xs,
    },
    filtersList: {
      padding: spacing.md,
    },
    filterItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.primary,
      borderRadius: 8,
      padding: spacing.md,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    filterInfo: {
      flex: 1,
    },
    filterName: {
      ...typography.textStyles.h6,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    filterDescription: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
    },
    filterRules: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    ruleTag: {
      backgroundColor: colors.gray[100],
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: 12,
      marginRight: spacing.xs,
      marginBottom: spacing.xs,
    },
    ruleText: {
      ...typography.textStyles.caption,
      color: colors.text.primary,
    },
    settingsContainer: {
      flex: 1,
    },
    settingsSection: {
      padding: spacing.md,
    },
    sectionTitle: {
      ...typography.textStyles.h5,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.background.primary,
      borderRadius: 8,
      padding: spacing.md,
      marginBottom: spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    settingInfo: {
      flex: 1,
    },
    settingName: {
      ...typography.textStyles.h6,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    settingDescription: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
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
