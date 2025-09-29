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
import { showErrorMessage } from '@components/FlashMessage';
import { AuthStackParamList } from '@navigation/AuthNavigator';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { colors, typography, spacing } = useTheme();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      showErrorMessage('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await login({ email, password });
    } catch (error) {
      showErrorMessage('Login failed', 'Please check your credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'apple' | 'facebook') => {
    // Implement social login
    Alert.alert('Coming Soon', `${provider} login will be available soon`);
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
      paddingTop: spacing['4xl'],
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing['3xl'],
    },
    logo: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.textStyles.h1,
      color: colors.text.primary,
      marginBottom: spacing.sm,
    },
    subtitle: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
      textAlign: 'center',
    },
    form: {
      marginBottom: spacing.xl,
    },
    inputContainer: {
      marginBottom: spacing.lg,
    },
    forgotPassword: {
      alignSelf: 'flex-end',
      marginBottom: spacing.xl,
    },
    forgotPasswordText: {
      ...typography.textStyles.bodySmall,
      color: colors.primary,
    },
    loginButton: {
      marginBottom: spacing.lg,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: spacing.xl,
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
      marginBottom: spacing.xl,
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
    signUpText: {
      ...typography.textStyles.body,
      color: colors.text.secondary,
    },
    signUpLink: {
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
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue to your account
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('google')}
            >
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('apple')}
            >
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin('facebook')}
            >
              <Text style={styles.socialButtonText}>Continue with Facebook</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.signUpText}>
              Don't have an account?{' '}
              <Text
                style={styles.signUpLink}
                onPress={() => navigation.navigate('Register')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};
