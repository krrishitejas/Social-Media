import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '@components/ThemeProvider';
import { useAuth } from '@hooks/useAuth';
import { useProfile } from '@hooks/useProfile';
import { Post, Highlight } from '@types';
import { RootStackParamList } from '@types';

const { width } = Dimensions.get('window');
const POST_SIZE = (width - 4) / 3;

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { colors, typography, spacing } = useTheme();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'tagged'>('posts');
  
  const {
    user: profileUser,
    posts,
    highlights,
    followersCount,
    followingCount,
    postsCount,
    isFollowing,
    isLoading,
    postsLoading,
    highlightsLoading,
    loadMorePosts,
    refresh,
    handleFollow,
    handleBlock,
  } = useProfile(user?.id || '');

  const tabs = [
    { key: 'posts', icon: 'grid-on' },
    { key: 'saved', icon: 'bookmark-border' },
    { key: 'tagged', icon: 'person-pin' },
  ] as const;

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleSettings = () => {
    navigation.navigate('Settings');
  };

  const handleFollowers = () => {
    navigation.navigate('Followers', { userId: user?.id || '' });
  };

  const handleFollowing = () => {
    navigation.navigate('Following', { userId: user?.id || '' });
  };

  const handlePostPress = (postId: string) => {
    navigation.navigate('Post', { postId });
  };

  const handleHighlightPress = (highlightId: string) => {
    // TODO: Navigate to highlight stories
    console.log('Highlight pressed:', highlightId);
  };

  const renderPost = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={() => handlePostPress(item.id)}
    >
      <Image
        source={{ uri: item.media[0]?.url }}
        style={styles.postImage}
        resizeMode="cover"
      />
      {item.media.length > 1 && (
        <View style={styles.multiMediaIndicator}>
          <Icon name="collections" size={16} color="#FFFFFF" />
        </View>
      )}
    </TouchableOpacity>
  );

  const renderHighlight = ({ item }: { item: Highlight }) => (
    <TouchableOpacity 
      style={styles.highlightItem}
      onPress={() => handleHighlightPress(item.id)}
    >
      <View style={styles.highlightImage}>
        <Image
          source={{ uri: item.coverImage }}
          style={styles.highlightCover}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.highlightTitle} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.profileInfo}>
        <Image
          source={{ uri: profileUser?.avatar }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{profileUser?.username}</Text>
          <Text style={styles.fullName}>{profileUser?.fullName}</Text>
          <Text style={styles.bio}>{profileUser?.bio || 'No bio yet'}</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <TouchableOpacity style={styles.stat} onPress={() => {}}>
          <Text style={styles.statNumber}>{postsCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stat} onPress={handleFollowers}>
          <Text style={styles.statNumber}>{followersCount}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.stat} onPress={handleFollowing}>
          <Text style={styles.statNumber}>{followingCount}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.primaryButton]}
          onPress={handleEditProfile}
        >
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={handleSettings}
        >
          <Text style={styles.secondaryButtonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {highlights.length > 0 && (
        <View style={styles.highlightsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {highlights.map((highlight) => (
              <View key={highlight.id}>
                {renderHighlight({ item: highlight })}
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="photo-camera" size={64} color={colors.text.disabled} />
      <Text style={styles.emptyText}>No posts yet</Text>
      <Text style={styles.emptySubtext}>
        Share your first post to get started
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.lg,
    },
    profileInfo: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.gray[300],
      marginRight: spacing.lg,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      ...typography.textStyles.h3,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    fullName: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    bio: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      marginBottom: spacing.sm,
    },
    stats: {
      flexDirection: 'row',
      marginBottom: spacing.lg,
    },
    stat: {
      alignItems: 'center',
      marginRight: spacing.xl,
    },
    statNumber: {
      ...typography.textStyles.h4,
      color: colors.text.primary,
    },
    statLabel: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    actions: {
      flexDirection: 'row',
      marginBottom: spacing.lg,
    },
    actionButton: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: 8,
      alignItems: 'center',
      marginRight: spacing.sm,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border.medium,
    },
    actionButtonText: {
      ...typography.textStyles.button,
      color: '#FFFFFF',
    },
    secondaryButtonText: {
      color: colors.text.primary,
    },
    highlightsSection: {
      marginBottom: spacing.md,
    },
    highlightItem: {
      alignItems: 'center',
      marginRight: spacing.md,
    },
    highlightImage: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.gray[200],
      marginBottom: spacing.xs,
      overflow: 'hidden',
    },
    highlightCover: {
      width: '100%',
      height: '100%',
    },
    highlightTitle: {
      ...typography.textStyles.caption,
      color: colors.text.primary,
      textAlign: 'center',
    },
    tabsContainer: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: colors.primary,
    },
    tabIcon: {
      marginBottom: spacing.xs,
    },
    content: {
      flex: 1,
    },
    postsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    postItem: {
      width: POST_SIZE,
      height: POST_SIZE,
      margin: 1,
      position: 'relative',
    },
    postImage: {
      width: '100%',
      height: '100%',
      backgroundColor: colors.gray[200],
    },
    multiMediaIndicator: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 12,
      padding: 4,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      ...typography.textStyles.h3,
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

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Icon
              name={tab.icon}
              size={24}
              color={activeTab === tab.key ? colors.primary : colors.text.secondary}
              style={styles.tabIcon}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {activeTab === 'posts' && (
          <FlatList
            data={posts}
            renderItem={renderPost}
            keyExtractor={(item) => item.id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={refresh}
                tintColor={colors.primary}
              />
            }
            onEndReached={loadMorePosts}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={renderEmpty}
          />
        )}
        
        {activeTab === 'saved' && (
          <View style={styles.emptyContainer}>
            <Icon name="bookmark" size={64} color={colors.text.disabled} />
            <Text style={styles.emptyText}>No saved posts</Text>
            <Text style={styles.emptySubtext}>
              Save posts to view them here
            </Text>
          </View>
        )}
        
        {activeTab === 'tagged' && (
          <View style={styles.emptyContainer}>
            <Icon name="person-pin" size={64} color={colors.text.disabled} />
            <Text style={styles.emptyText}>No tagged posts</Text>
            <Text style={styles.emptySubtext}>
              Posts you're tagged in will appear here
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};