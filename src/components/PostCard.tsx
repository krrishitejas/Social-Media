import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from './ThemeProvider';
import { Post } from '@types';

interface PostCardProps {
  post: Post;
  onPress: () => void;
  onLike?: (postId: string, isLiked: boolean) => void;
  onBookmark?: (postId: string, isBookmarked: boolean) => void;
  onShare?: (postId: string, platform: string) => void;
}

const { width } = Dimensions.get('window');

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onPress, 
  onLike, 
  onBookmark, 
  onShare 
}) => {
  const { colors, typography, spacing } = useTheme();
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
    onLike?.(post.id, newLikedState);
  };

  const handleBookmark = () => {
    const newBookmarkedState = !isBookmarked;
    setIsBookmarked(newBookmarkedState);
    onBookmark?.(post.id, newBookmarkedState);
  };

  const handleComment = () => {
    // TODO: Navigate to comments
    console.log('Comment pressed');
  };

  const handleShare = () => {
    onShare?.(post.id, 'general');
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background.primary,
      marginBottom: spacing.md,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.gray[300],
      marginRight: spacing.sm,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      ...typography.textStyles.button,
      color: colors.text.primary,
    },
    location: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    moreButton: {
      padding: spacing.sm,
    },
    media: {
      width: width,
      height: width,
      backgroundColor: colors.gray[200],
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    actionButton: {
      marginRight: spacing.lg,
    },
    actionButtonRight: {
      marginLeft: 'auto',
    },
    likesText: {
      ...typography.textStyles.button,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    caption: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    captionText: {
      ...typography.textStyles.body,
      color: colors.text.primary,
    },
    hashtag: {
      color: colors.primary,
    },
    commentsButton: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.sm,
    },
    commentsText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    timestamp: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
    },
    timestampText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.username}>{post.user.username}</Text>
          {post.location && (
            <Text style={styles.location}>{post.location.name}</Text>
          )}
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-horiz" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Media */}
      <TouchableOpacity onPress={onPress}>
        <Image
          source={{ uri: post.media[0]?.url }}
          style={styles.media}
          resizeMode="cover"
        />
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
          <Icon
            name={isLiked ? 'favorite' : 'favorite-border'}
            size={24}
            color={isLiked ? colors.error : colors.text.primary}
          />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
          <Icon name="chat-bubble-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Icon name="send" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.actionButtonRight]}
          onPress={handleBookmark}
        >
          <Icon
            name={isBookmarked ? 'bookmark' : 'bookmark-border'}
            size={24}
            color={colors.text.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      {likesCount > 0 && (
        <View style={styles.actions}>
          <Text style={styles.likesText}>
            {likesCount} {likesCount === 1 ? 'like' : 'likes'}
          </Text>
        </View>
      )}

      {/* Caption */}
      <View style={styles.caption}>
        <Text style={styles.captionText}>
          <Text style={styles.username}>{post.user.username} </Text>
          {post.caption}
        </Text>
      </View>

      {/* Comments */}
      {post.commentsCount > 0 && (
        <TouchableOpacity style={styles.commentsButton}>
          <Text style={styles.commentsText}>
            View all {post.commentsCount} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp */}
      <View style={styles.timestamp}>
        <Text style={styles.timestampText}>
          {new Date(post.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};
