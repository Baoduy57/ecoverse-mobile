import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  TextInput as RNTextInput,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuthStore } from '@store/authStore';
import ScreenBackground from '../../components/common/ScreenBackground';
import { colors, spacing, borderRadius } from '@theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const { studentLogin, isLoading } = useAuthStore();
  const [studentId, setStudentId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Animations
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    setErrorMessage('');
    const trimmedId = studentId.trim();
    if (!trimmedId) {
      setErrorMessage('Vui lòng nhập Mã học sinh');
      return;
    }

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await studentLogin(trimmedId);
    } catch (error: any) {
      setErrorMessage('Mã học sinh không hợp lệ');
    }
  };

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flex}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <Animated.View
                style={[
                  styles.logoContainer,
                  {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }],
                  },
                ]}
              >
                <Image
                  source={require('../../../assets/images/logo_eco.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </Animated.View>

              <Text variant="displaySmall" style={styles.title}>
                EcoVerse
              </Text>
              <Text variant="titleMedium" style={styles.subtitle}>
                Đăng nhập để tiếp tục
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.form}>
              {/* Username Input */}
              <View style={[styles.inputWrapper, errorMessage ? styles.inputError : null]}>
                <View style={styles.inputIconLeft}>
                  <MaterialCommunityIcons name="account" size={24} color={colors.text.disabled} />
                </View>
                <RNTextInput
                  placeholder="Mã học sinh"
                  value={studentId}
                  onChangeText={setStudentId}
                  style={styles.input}
                  placeholderTextColor={colors.text.disabled}
                  autoCapitalize="none"
                />
              </View>

              {/* Error Message */}
              {errorMessage ? (
                <Animated.View style={{ opacity: fadeAnim }}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </Animated.View>
              ) : null}

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                style={({ pressed }) => [styles.loginButton, pressed && styles.loginButtonPressed]}
              >
                <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                  <LinearGradient
                    colors={[colors.primary, '#11d862']}
                    style={styles.loginButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.buttonOverlay} />
                    <Text variant="titleLarge" style={styles.loginButtonText}>
                      Đăng nhập
                    </Text>
                  </LinearGradient>
                </Animated.View>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  errorText: {
    color: colors.status.error,
    fontSize: 13,
    fontWeight: '500',
    marginTop: -spacing.sm,
    paddingHorizontal: spacing.sm,
    textAlign: 'center',
  },
  flex: {
    flex: 1,
  },

  form: {
    gap: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  input: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    height: 56,
    paddingLeft: spacing['4xl'] + spacing.sm,
    paddingRight: spacing['4xl'] + spacing.sm,
  },
  inputIconLeft: {
    bottom: 0,
    justifyContent: 'center',
    left: spacing.base,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  inputError: {
    borderColor: colors.status.error,
    borderWidth: 1.5,
  },
  inputIconRight: {
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.base,
    top: 0,
    zIndex: 1,
  },
  inputWrapper: {
    backgroundColor: colors.surface,
    borderColor: 'transparent',
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    elevation: 2,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  loginButton: {
    borderRadius: borderRadius.xl,
    elevation: 8,
    marginTop: spacing.lg,
    overflow: 'hidden',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  loginButtonGradient: {
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  loginButtonPressed: {
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    transform: [{ translateY: 4 }],
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: spacing.base,
  },
  logoImage: {
    height: 170,
    width: 170,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing['4xl'],
  },
  subtitle: {
    color: colors.text.secondary,
    fontWeight: '700',
  },
  title: {
    color: colors.text.primary,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
});
