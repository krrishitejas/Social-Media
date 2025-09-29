import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '@components/ThemeProvider';
import { useAuth } from '@hooks/useAuth';
import { Input } from '@components/Input';
import { Button } from '@components/Button';
import { LinearGradient } from 'react-native-linear-gradient';
import { showErrorMessage, showSuccessMessage } from '@components/FlashMessage';
import { AuthStackParamList } from '@navigation/AuthNavigator';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { colors, typography, spacing } = useTheme();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { fullName, username, email, password, confirmPassword } = formData;

    if (!fullName || !username || !email || !password || !confirmPassword) {
      showErrorMessage('Please fill in all fields');
      return false;
    }

    if (password !== confirmPassword) {
      showErrorMessage('Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      showErrorMessage('Password must be at least 8 characters long');
      return false;
    }

    if (!agreedToTerms) {
      showErrorMessage('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      showSuccessMessage('Account created successfully!');
    } catch (error) {
      showErrorMessage('Registration failed', 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = (provider: 'google' | 'apple' | 'facebook') => {
    // Implement social registration
    Alert.alert('Coming Soon', `${provider} registration will be available soon`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    gradient: {
      flex: 1,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingTop: spacing['2xl'],
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing['2xl'],
    },
    logo: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      marginBottom: spacing.md,
    },
    title: {
      ...typography.textStyles.h2,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    form: {
      marginBottom: spacing.lg,
    },
    inputContainer: {
      marginBottom: spacing.md,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    halfInput: {
      width: '48%',
    },
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.lg,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: colors.border.medium,
      borderRadius: 4,
      marginRight: spacing.sm,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    termsText: {
      ...typography.textStyles.bodySmall,
      color: colors.text.secondary,
      flex: 1,
    },
    termsLink: {
      color: colors.primary,
      textDecorationLine: 'underline',
    },
    registerButton: {
      marginBottom: spacing.lg,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.lg,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border.light,
    },
    dividerText: {
      ...typography.textStyles.bodySmall,
      color: colors.text.secondary,
      marginHorizontal: spacing.md,
    },
    socialButtons: {
      marginBottom: spacing.lg,
    },
    socialButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      borderRadius: 8,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border.medium,
    },
    socialButtonText: {
      ...typography.textStyles.button,
      color: colors.text.primary,
      marginLeft: spacing.sm,
    },
    footer: {
      alignItems: 'center',
    },
    signInText: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
    },
    signInLink: {
      color: colors.primary,
      fontWeight: '600',
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LinearGradient
        colors={[colors.primary, colors.accent]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <View style={styles.logo} />
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join our community and start sharing
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChangeText={(value) => handleInputChange('fullName', value)}
              />
            </View>
            
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Input
                  label="Username"
                  placeholder="username"
                  value={formData.username}
                  onChangeText={(value) => handleInputChange('username', value)}
                  autoCapitalize="none"
                />
              </View>
              <View style={[styles.inputContainer, styles.halfInput]}>
                <Input
                  label="Email"
                  placeholder="email@example.com"
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleInputChange('confirmPassword', value)}
                secureTextEntry
              />
            </View>

            <View style={styles.termsContainer}>
              <TouchableOpacity
                style={[styles.checkbox, agreedToTerms && styles.checkboxChecked]}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                {agreedToTerms && (
                  <Text style={{ color: 'white', fontSize: 12 }}>✓</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text style={styles.termsLink}>Terms of Service</Text>
                {' '}and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>

          <Button
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialRegister('google')}
            >
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialRegister('apple')}
            >
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialRegister('facebook')}
            >
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.signInText}>
              Already have an account?{' '}
              <Text
                style={styles.signInLink}
                onPress={() => navigation.navigate('Login')}
              >
                Sign In
              </Text>
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
