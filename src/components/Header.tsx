import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from './ThemeProvider';
import { useAuth } from '@hooks/useAuth';

interface HeaderProps {
  onModeToggle?: () => void;
  currentMode?: 'algorithmic' | 'following';
}

export const Header: React.FC<HeaderProps> = ({ onModeToggle, currentMode }) => {
  const { colors, typography, spacing } = useTheme();
  const { user } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.background.primary,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      ...typography.textStyles.h3,
      color: colors.primary,
      fontWeight: 'bold',
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    modeToggle: {
      flexDirection: 'row',
      backgroundColor: colors.gray[100],
      borderRadius: 20,
      padding: 2,
      marginRight: spacing.md,
    },
    modeButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 18,
    },
    activeModeButton: {
      backgroundColor: colors.primary,
    },
    modeButtonText: {
      ...typography.textStyles.caption,
      color: colors.text.secondary,
    },
    activeModeButtonText: {
      color: '#FFFFFF',
    },
    iconButton: {
      padding: spacing.sm,
      marginLeft: spacing.sm,
    },
    notificationBadge: {
      position: 'absolute',
      top: 4,
      right: 4,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.error,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Text style={styles.logo}>Social</Text>
      </View>
      
      <View style={styles.rightSection}>
        {onModeToggle && (
          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                currentMode === 'algorithmic' && styles.activeModeButton,
              ]}
              onPress={onModeToggle}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  currentMode === 'algorithmic' && styles.activeModeButtonText,
                ]}
              >
                For You
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                currentMode === 'following' && styles.activeModeButton,
              ]}
              onPress={onModeToggle}
            >
              <Text
                style={[
                  styles.modeButtonText,
                  currentMode === 'following' && styles.activeModeButtonText,
                ]}
              >
                Following
              </Text>
            </TouchableOpacity>
          </View>
        )}
        
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="favorite" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton}>
          <Icon name="chat" size={24} color={colors.text.primary} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
