import React, { useState, useEffect, useRef } from 'react';
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
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from './ThemeProvider';
import { Story } from '@types';

const { width, height } = Dimensions.get('window');

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
  onNext,
  onPrevious,
}) => {
  const { colors, typography, spacing } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (currentStory && !isPaused) {
      startProgress();
    } else {
      pauseProgress();
    }

    return () => {
      pauseProgress();
    };
  }, [currentStory, isPaused]);

  const startProgress = () => {
    progressAnim.setValue(0);
    setProgress(0);
    
    progressInterval.current = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 0.1;
        if (newProgress >= 1) {
          handleNext();
          return 0;
        }
        return newProgress;
      });
    }, 100);

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 5000, // 5 seconds per story
      useNativeDriver: false,
    }).start();
  };

  const pauseProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    progressAnim.stopAnimation();
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
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
    setIsPaused(isPressed);
  };

  const renderProgressBars = () => (
    <View style={styles.progressContainer}>
      {stories.map((_, index) => (
        <View key={index} style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground} />
          {index === currentIndex && (
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          )}
          {index < currentIndex && (
            <View style={[styles.progressBarFill, { width: '100%' }]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStoryContent = () => {
    if (!currentStory) return null;

    return (
      <View style={styles.storyContent}>
        <Image
          source={{ uri: currentStory.media.url }}
          style={styles.storyImage}
          resizeMode="cover"
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)']}
          style={styles.gradientOverlay}
        />
        
        <View style={styles.storyHeader}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: currentStory.user.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.username}>{currentStory.user.username}</Text>
            <Text style={styles.timestamp}>
              {new Date(currentStory.createdAt).toLocaleTimeString()}
            </Text>
          </View>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000000',
    },
    progressContainer: {
      flexDirection: 'row',
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.sm,
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    progressBarContainer: {
      flex: 1,
      height: 2,
      marginHorizontal: 1,
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: 1,
      overflow: 'hidden',
    },
    progressBarBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255,255,255,0.3)',
    },
    progressBarFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      backgroundColor: '#FFFFFF',
    },
    storyContent: {
      flex: 1,
      position: 'relative',
    },
    storyImage: {
      width: '100%',
      height: '100%',
    },
    gradientOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    storyHeader: {
      position: 'absolute',
      top: spacing.lg,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      zIndex: 5,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
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
      marginRight: spacing.sm,
    },
    timestamp: {
      ...typography.textStyles.caption,
      color: 'rgba(255,255,255,0.7)',
    },
    closeButton: {
      padding: spacing.sm,
    },
    tapArea: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
  });

  return (
    <View style={styles.container}>
      {renderProgressBars()}
      {renderStoryContent()}
      
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
