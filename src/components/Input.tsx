import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from './ThemeProvider';
import { InputProps } from '@types';

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  disabled = false,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  style,
  testID,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { colors, typography, spacing } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const toggleSecureEntry = () => {
    setIsSecure(!isSecure);
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: spacing.sm,
    },
    label: {
      ...typography.textStyles.label,
      color: colors.text.primary,
      marginBottom: spacing.xs,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: error ? colors.error : isFocused ? colors.primary : colors.border.light,
      borderRadius: 8,
      backgroundColor: disabled ? colors.gray[100] : colors.background.primary,
      paddingHorizontal: spacing.md,
      minHeight: 44,
    },
    input: {
      flex: 1,
      ...typography.textStyles.body,
      color: colors.text.primary,
      paddingVertical: spacing.sm,
    },
    multilineInput: {
      minHeight: 80,
      textAlignVertical: 'top',
    },
    secureButton: {
      padding: spacing.sm,
    },
    errorText: {
      ...typography.textStyles.caption,
      color: colors.error,
      marginTop: spacing.xs,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            { color: disabled ? colors.text.disabled : colors.text.primary },
          ]}
          placeholder={placeholder}
          placeholderTextColor={colors.text.disabled}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          editable={!disabled}
          secureTextEntry={isSecure}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          testID={testID}
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={accessibilityHint}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.secureButton}
            onPress={toggleSecureEntry}
            accessibilityLabel={isSecure ? 'Show password' : 'Hide password'}
          >
            <Icon
              name={isSecure ? 'visibility-off' : 'visibility'}
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
