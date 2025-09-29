import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import { useTheme } from './ThemeProvider';
import { Story } from '@types';

interface StoryRingProps {
  story: Story;
  onPress: () => void;
}

export const StoryRing: React.FC<StoryRingProps> = ({ story, onPress }) => {
  const { colors, typography, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginRight: spacing.md,
    },
    ringContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      padding: 2,
    },
    ring: {
      flex: 1,
      borderRadius: 30,
      overflow: 'hidden',
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.gray[300],
    },
    username: {
      ...typography.textStyles.caption,
      color: colors.text.primary,
      marginTop: spacing.xs,
      textAlign: 'center',
      maxWidth: 64,
    },
    viewedRing: {
      borderWidth: 2,
      borderColor: colors.gray[300],
    },
    unviewedRing: {
      borderWidth: 2,
      borderColor: colors.accent,
    },
  });

  const ringStyle = story.isViewed ? styles.viewedRing : styles.unviewedRing;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.ringContainer, ringStyle]}>
        <View style={styles.ring}>
          <Image
            source={{ uri: story.user.avatar }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
      </View>
      <Text style={styles.username} numberOfLines={1}>
        {story.user.username}
      </Text>
    </TouchableOpacity>
  );
};
