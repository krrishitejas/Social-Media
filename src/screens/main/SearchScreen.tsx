import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@components/ThemeProvider';
import { useSearch } from '@hooks/useSearch';
import { User, Post } from '@types';

const { width } = Dimensions.get('window');
const POST_SIZE = (width - 4) / 3;

export const SearchScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts' | 'hashtags' | 'locations'>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const {
    searchResults,
    isLoading,
    trendingHashtags,
    trendingPosts,
    suggestedUsers,
    searchSuggestions,
    suggestionsLoading,
    addToHistory,
    searchHistory,
    removeFromHistory,
  } = useSearch(searchQuery, activeTab);

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'users', label: 'Users' },
    { key: 'posts', label: 'Posts' },
    { key: 'hashtags', label: 'Tags' },
    { key: 'locations', label: 'Places' },
  ] as const;

  useEffect(() => {
    if (searchQuery.length > 0) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addToHistory(query);
    }
  };

  const handleSuggestionPress = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    addToHistory(suggestion);
  };

  const handleFollow = (userId: string) => {
    // TODO: Implement follow functionality
    console.log('Follow user:', userId);
  };

  const handlePostPress = (postId: string) => {
    // TODO: Navigate to post
    console.log('Post pressed:', postId);
  };

  const handleHashtagPress = (hashtag: string) => {
    setSearchQuery(hashtag);
    setActiveTab('hashtags');
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity style={styles.userItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{item.username}</Text>
        <Text style={styles.fullName}>{item.fullName}</Text>
        <Text style={styles.bio}>{item.bio}</Text>
      </View>
      <TouchableOpacity 
        style={styles.followButton}
        onPress={() => handleFollow(item.id)}
      >
        <Text style={styles.followButtonText}>Follow</Text>
      </TouchableOpacity>
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
    </TouchableOpacity>
  );

  const renderHashtagItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.hashtagItem}
      onPress={() => handleHashtagPress(item)}
    >
      <Icon name="tag" size={20} color={colors.primary} />
      <Text style={styles.hashtagText}>#{item}</Text>
    </TouchableOpacity>
  );

  const renderLocationItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.locationItem}>
      <Icon name="location-on" size={20} color={colors.primary} />
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{item.name}</Text>
        <Text style={styles.locationAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchSuggestions = () => {
    if (!showSuggestions) return null;

    return (
      <View style={styles.suggestionsContainer}>
        {searchSuggestions && searchSuggestions.length > 0 && (
          <View style={styles.suggestionsSection}>
            <Text style={styles.suggestionsTitle}>Suggestions</Text>
            {searchSuggestions.map((suggestion, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(suggestion)}
              >
                <Icon name="search" size={20} color={colors.text.secondary} />
                <Text style={styles.suggestionText}>{suggestion}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {searchHistory.length > 0 && (
          <View style={styles.suggestionsSection}>
            <View style={styles.suggestionsHeader}>
              <Text style={styles.suggestionsTitle}>Recent</Text>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.clearButton}>Clear</Text>
              </TouchableOpacity>
            </View>
            {searchHistory.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Icon name="history" size={20} color={colors.text.secondary} />
                <Text style={styles.suggestionText}>{item}</Text>
                <TouchableOpacity
                  onPress={() => removeFromHistory(item)}
                  style={styles.removeButton}
                >
                  <Icon name="close" size={16} color={colors.text.secondary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderTrendingContent = () => {
    if (searchQuery.length > 0) return null;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        {trendingHashtags && trendingHashtags.length > 0 && (
          <View style={styles.trendingSection}>
            <Text style={styles.trendingTitle}>Trending Hashtags</Text>
            <View style={styles.hashtagsContainer}>
              {trendingHashtags.map((hashtag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.trendingHashtag}
                  onPress={() => handleHashtagPress(hashtag)}
                >
                  <Text style={styles.trendingHashtagText}>#{hashtag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {trendingPosts && trendingPosts.length > 0 && (
          <View style={styles.trendingSection}>
            <Text style={styles.trendingTitle}>Trending Posts</Text>
            <FlatList
              data={trendingPosts}
              renderItem={renderPostItem}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
            />
          </View>
        )}

        {suggestedUsers && suggestedUsers.length > 0 && (
          <View style={styles.trendingSection}>
            <Text style={styles.trendingTitle}>Suggested for You</Text>
            {suggestedUsers.map((user) => (
              <View key={user.id}>
                {renderUserItem({ item: user })}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderContent = () => {
    if (searchQuery.length === 0) {
      return renderTrendingContent();
    }

    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Searching...</Text>
        </View>
      );
    }

    if (!searchResults) return null;

    switch (activeTab) {
      case 'users':
        return (
          <FlatList
            data={searchResults.users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'posts':
        return (
          <FlatList
            data={searchResults.posts}
            renderItem={renderPostItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'hashtags':
        return (
          <FlatList
            data={searchResults.hashtags}
            renderItem={renderHashtagItem}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
          />
        );
      case 'locations':
        return (
          <FlatList
            data={searchResults.locations}
            renderItem={renderLocationItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        );
      default:
        return (
          <ScrollView showsVerticalScrollIndicator={false}>
            {searchResults.users.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.resultsTitle}>Users</Text>
                {searchResults.users.slice(0, 3).map((user) => (
                  <View key={user.id}>
                    {renderUserItem({ item: user })}
                  </View>
                ))}
              </View>
            )}
            
            {searchResults.posts.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.resultsTitle}>Posts</Text>
                <FlatList
                  data={searchResults.posts.slice(0, 6)}
                  renderItem={renderPostItem}
                  keyExtractor={(item) => item.id}
                  numColumns={3}
                  scrollEnabled={false}
                />
              </View>
            )}
            
            {searchResults.hashtags.length > 0 && (
              <View style={styles.resultsSection}>
                <Text style={styles.resultsTitle}>Hashtags</Text>
                {searchResults.hashtags.slice(0, 5).map((hashtag) => (
                  <View key={hashtag}>
                    {renderHashtagItem({ item: hashtag })}
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        );
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.background.primary,
    },
    searchInput: {
      flex: 1,
      height: 40,
      backgroundColor: colors.gray[100],
      borderRadius: 20,
      paddingHorizontal: spacing.md,
      marginRight: spacing.sm,
      ...typography.textStyles.body,
    },
    searchButton: {
      padding: spacing.sm,
    },
    suggestionsContainer: {
      backgroundColor: colors.background.primary,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    suggestionsSection: {
      paddingVertical: spacing.sm,
    },
    suggestionsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    suggestionsTitle: {
      ...typography.textStyles.h6,
      color: colors.text.primary,
      paddingHorizontal: spacing.md,
      marginBottom: spacing.sm,
    },
    suggestionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    suggestionText: {
      ...typography.textStyles.body,
      color: colors.text.primary,
      marginLeft: spacing.sm,
      flex: 1,
    },
    clearButton: {
      ...typography.textStyles.caption,
      color: colors.primary,
    },
    removeButton: {
      padding: spacing.xs,
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: colors.background.primary,
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
    tabText: {
      ...typography.textStyles.button,
      color: colors.text.secondary,
    },
    activeTabText: {
      color: colors.primary,
    },
    content: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
    },
    trendingSection: {
      padding: spacing.md,
    },
    trendingTitle: {
      ...typography.textStyles.h5,
      color: colors.text.primary,
      marginBottom: spacing.md,
    },
    hashtagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    trendingHashtag: {
      backgroundColor: colors.gray[100],
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      marginRight: spacing.sm,
      marginBottom: spacing.sm,
    },
    trendingHashtagText: {
      ...typography.textStyles.caption,
      color: colors.primary,
    },
    resultsSection: {
      padding: spacing.md,
    },
    resultsTitle: {
      ...typography.textStyles.h6,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: spacing.md,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      ...typography.textStyles.button,
      color: colors.text.primary,
    },
    fullName: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    bio: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
      marginTop: spacing.xs,
    },
    followButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 20,
      backgroundColor: colors.primary,
    },
    followButtonText: {
      ...typography.textStyles.button,
      color: '#FFFFFF',
    },
    postItem: {
      flex: 1,
      aspectRatio: 1,
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
    hashtagItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    hashtagText: {
      ...typography.textStyles.body,
      color: colors.primary,
      marginLeft: spacing.sm,
    },
    locationItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
    },
    locationInfo: {
      marginLeft: spacing.sm,
    },
    locationName: {
      ...typography.textStyles.button,
      color: colors.text.primary,
    },
    locationAddress: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={colors.text.disabled}
        />
        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {renderSearchSuggestions()}

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
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

      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};