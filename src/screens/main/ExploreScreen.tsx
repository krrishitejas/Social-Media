import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { useSearch } from '@hooks/useSearch';
import { Post } from '@types';

const { width } = Dimensions.get('window');
const POST_SIZE = (width - 4) / 3;

export const ExploreScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    trendingPosts,
    trendingHashtags,
    suggestedUsers,
    refetch,
  } = useSearch('', 'all');

  const categories = [
    { id: 'trending', name: 'Trending', icon: 'trending-up' },
    { id: 'fashion', name: 'Fashion', icon: 'checkroom' },
    { id: 'food', name: 'Food', icon: 'restaurant' },
    { id: 'travel', name: 'Travel', icon: 'flight' },
    { id: 'art', name: 'Art', icon: 'palette' },
    { id: 'music', name: 'Music', icon: 'music-note' },
    { id: 'sports', name: 'Sports', icon: 'sports' },
    { id: 'tech', name: 'Tech', icon: 'computer' },
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handlePostPress = (postId: string) => {
    // TODO: Navigate to post
    console.log('Post pressed:', postId);
  };

  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategoryItem,
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Icon
        name={item.icon}
        size={24}
        color={selectedCategory === item.id ? '#FFFFFF' : colors.text.primary}
      />
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.selectedCategoryText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderPostItem = ({ item }: { item: Post }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => handlePostPress(item.id)}
    >
      <Image source={{ uri: item.media[0]?.url }} style={styles.postImage} />
      {item.media.length > 1 && (
        <View style={styles.multiMediaIndicator}>
          <Icon name="collections" size={16} color="#FFFFFF" />
        </View>
      )}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.postGradient}
      />
      <View style={styles.postOverlay}>
        <Text style={styles.postCaption} numberOfLines={2}>
          {item.caption}
        </Text>
        <View style={styles.postStats}>
          <View style={styles.postStat}>
            <Icon name="favorite" size={14} color="#FFFFFF" />
            <Text style={styles.postStatText}>{item.likesCount}</Text>
          </View>
          <View style={styles.postStat}>
            <Icon name="chat-bubble-outline" size={14} color="#FFFFFF" />
            <Text style={styles.postStatText}>{item.commentsCount}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHashtagItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.hashtagItem}>
      <Text style={styles.hashtagText}>#{item}</Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Explore</Text>
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {trendingHashtags && trendingHashtags.length > 0 && (
        <View style={styles.hashtagsSection}>
          <Text style={styles.sectionTitle}>Trending Hashtags</Text>
          <FlatList
            data={trendingHashtags.slice(0, 10)}
            renderItem={renderHashtagItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hashtagsList}
          />
        </View>
      )}
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="explore" size={64} color={colors.text.disabled} />
      <Text style={styles.emptyText}>No content to explore</Text>
      <Text style={styles.emptySubtext}>
        Check back later for trending posts and hashtags
      </Text>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    header: {
      padding: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    headerTitle: {
      ...typography.textStyles.h2,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    categoriesContainer: {
      marginBottom: spacing.md,
    },
    categoriesList: {
      paddingRight: spacing.md,
    },
    categoryItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.gray[100],
      borderRadius: 20,
      marginRight: spacing.sm,
    },
    selectedCategoryItem: {
      backgroundColor: colors.primary,
    },
    categoryText: {
      ...typography.textStyles.caption,
      color: colors.text.primary,
      marginLeft: spacing.xs,
    },
    selectedCategoryText: {
      color: '#FFFFFF',
    },
    hashtagsSection: {
      marginTop: spacing.sm,
    },
    sectionTitle: {
      ...typography.textStyles.h6,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    hashtagsList: {
      paddingRight: spacing.md,
    },
    hashtagItem: {
      backgroundColor: colors.gray[100],
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 16,
      marginRight: spacing.sm,
    },
    hashtagText: {
      ...typography.textStyles.caption,
      color: colors.primary,
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
    postGradient: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
    },
    postOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: spacing.sm,
    },
    postCaption: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
      marginBottom: spacing.xs,
    },
    postStats: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    postStat: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: spacing.md,
    },
    postStatText: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
      marginLeft: spacing.xs,
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
      
      <FlatList
        data={trendingPosts || []}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={styles.content}
      />
    </View>
  );
};