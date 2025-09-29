import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  PanGestureHandler,
  State,
} from 'react-native';
import Video from 'react-native-video';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from './ThemeProvider';
import { Post } from '@types';

const { width, height } = Dimensions.get('window');

interface ReelsPlayerProps {
  posts: Post[];
  initialIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const ReelsPlayer: React.FC<ReelsPlayerProps> = ({
  posts,
  initialIndex,
  onClose,
  onNext,
  onPrevious,
}) => {
  const { colors, typography, spacing } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  const videoRef = useRef<Video>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);

  const currentPost = posts[currentIndex];

  useEffect(() => {
    if (currentPost) {
      setIsLiked(currentPost.isLiked);
      setIsBookmarked(currentPost.isBookmarked);
    }
  }, [currentPost]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    // TODO: Call API to like/unlike
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // TODO: Call API to bookmark/unbookmark
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share pressed');
  };

  const handleComment = () => {
    // TODO: Navigate to comments
    console.log('Comment pressed');
  };

  const handleNext = () => {
    if (currentIndex < posts.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      onPrevious();
    }
  };

  const handleTap = (event: any) => {
    const { locationX } = event.nativeEvent;
    const screenWidth = width;
    
    if (locationX < screenWidth / 2) {
      handlePrevious();
    } else {
      handleNext();
    }
  };

  const handleLongPress = (isPressed: boolean) => {
    setIsPlaying(!isPressed);
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const renderVideo = () => {
    if (!currentPost || !currentPost.media[0]) return null;

    const media = currentPost.media[0];
    if (media.type !== 'video') return null;

    return (
      <Video
        ref={videoRef}
        source={{ uri: media.url }}
        style={styles.video}
        resizeMode="cover"
        repeat
        paused={!isPlaying}
        onLoad={() => {
          // Video loaded
        }}
        onError={(error) => {
          console.error('Video error:', error);
        }}
      />
    );
  };

  const renderImage = () => {
    if (!currentPost || !currentPost.media[0]) return null;

    const media = currentPost.media[0];
    if (media.type !== 'image') return null;

    return (
      <Image
        source={{ uri: media.url }}
        style={styles.image}
        resizeMode="cover"
      />
    );
  };

  const renderOverlay = () => {
    if (!currentPost) return null;

    return (
      <View style={styles.overlay}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.gradient}
        />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <View style={styles.leftContent}>
            <Text style={styles.caption}>{currentPost.caption}</Text>
            
            <View style={styles.userInfo}>
              <Image
                source={{ uri: currentPost.user.avatar }}
                style={styles.avatar}
              />
              <Text style={styles.username}>{currentPost.user.username}</Text>
            </View>
          </View>

          <View style={styles.rightContent}>
            {/* Like Button */}
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Icon
                name={isLiked ? 'favorite' : 'favorite-border'}
                size={28}
                color={isLiked ? colors.error : '#FFFFFF'}
              />
              <Text style={styles.actionText}>{currentPost.likesCount}</Text>
            </TouchableOpacity>

            {/* Comment Button */}
            <TouchableOpacity style={styles.actionButton} onPress={handleComment}>
              <Icon name="chat-bubble-outline" size={28} color="#FFFFFF" />
              <Text style={styles.actionText}>{currentPost.commentsCount}</Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Icon name="send" size={28} color="#FFFFFF" />
              <Text style={styles.actionText}>{currentPost.sharesCount}</Text>
            </TouchableOpacity>

            {/* Bookmark Button */}
            <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
              <Icon
                name={isBookmarked ? 'bookmark' : 'bookmark-border'}
                size={28}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Play/Pause Button */}
        {!isPlaying && (
          <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
            <Icon name="play-arrow" size={48} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    video: {
      width: '100%',
      height: '100%',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    gradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingHorizontal: spacing.md,
      paddingTop: spacing.lg,
    },
    closeButton: {
      padding: spacing.sm,
    },
    content: {
      flex: 1,
      flexDirection: 'row',
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
    },
    leftContent: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    rightContent: {
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    caption: {
      ...typography.textStyles.body,
      color: '#FFFFFF',
      marginBottom: spacing.md,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      marginRight: spacing.sm,
    },
    username: {
      ...typography.textStyles.button,
      color: '#FFFFFF',
    },
    actionButton: {
      alignItems: 'center',
      marginBottom: spacing.lg,
    },
    actionText: {
      ...typography.textStyles.caption,
      color: '#FFFFFF',
      marginTop: spacing.xs,
    },
    playButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -24 }, { translateY: -24 }],
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 24,
      padding: spacing.sm,
    },
    tapArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  });

  return (
    <View style={styles.container}>
      {renderVideo()}
      {renderImage()}
      {renderOverlay()}
      
      <TouchableOpacity
        style={styles.tapArea}
        onPress={handleTap}
        onLongPress={() => handleLongPress(true)}
        onPressOut={() => handleLongPress(false)}
        activeOpacity={1}
      />
    </View>
  );
};
