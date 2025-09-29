import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@components/ThemeProvider';

export const SettingsScreen: React.FC = () => {
  const { colors, typography, spacing } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      ...typography.textStyles.h3,
      color: colors.text.primary,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Settings Screen</Text>
    </View>
  );
};
