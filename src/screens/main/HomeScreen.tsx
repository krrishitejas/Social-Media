import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '@components/ThemeProvider';
import { useAuth } from '@hooks/useAuth';
import { useFeed } from '@hooks/useFeed';
import { PostCard } from '@components/PostCard';
import { StoryRing } from '@components/StoryRing';
import { Header } from '@components/Header';
import { RootStackParamList } from '@types';
import { Post, Story } from '@types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { colors, spacing } = useTheme();
  const { user } = useAuth();
  
  const [feedMode, setFeedMode] = useState<'algorithmic' | 'following'>('algorithmic');
  
  const {
    posts,
    stories,
    isLoading,
    storiesLoading,
    error,
    storiesError,
    loadMore,
    refresh,
    handleLike,
    handleBookmark,
    handleShare,
    hasMore,
  } = useFeed(feedMode);

  const handlePostPress = (postId: string) => {
    navigation.navigate('Post', { postId });
  };

  const handleStoryPress = (storyId: string) => {
    // TODO: Navigate to story viewer
    console.log('Story pressed:', storyId);
  };

  const handleModeToggle = () => {
    setFeedMode(prev => prev === 'algorithmic' ? 'following' : 'algorithmic');
  };

  const renderStory = ({ item }: { item: Story }) => (
    <StoryRing
      story={item}
      onPress={() => handleStoryPress(item.id)}
    />
  );

  const renderPost = ({ item }: { item: Post }) => (
    <PostCard
      post={item}
      onPress={() => handlePostPress(item.id)}
      onLike={(postId, isLiked) => handleLike(postId, isLiked)}
      onBookmark={(postId, isBookmarked) => handleBookmark(postId, isBookmarked)}
      onShare={(postId, platform) => handleShare(postId, platform)}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Header onModeToggle={handleModeToggle} currentMode={feedMode} />
      {stories.length > 0 && (
        <FlatList
          data={stories}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesContainer}
        />
      )}
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No posts yet</Text>
      <Text style={styles.emptySubtext}>
        Follow some people to see their posts here
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      backgroundColor: colors.background.primary,
    },
    storiesContainer: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    content: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    emptyText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    emptySubtext: {
      fontSize: 14,
      color: colors.text.secondary,
      textAlign: 'center',
    },
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
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
        contentContainerStyle={styles.content}
      />
    </View>
  );
};
