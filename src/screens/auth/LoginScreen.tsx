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
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, borderRadius } from '@theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Animations
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;
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

    // Floating animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim1, {
          toValue: -20,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim1, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim2, {
          toValue: -15,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim2, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim3, {
          toValue: -10,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim3, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleLogin = () => {
    console.log('Login:', email);

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

    login();
  };

  return (
    <View style={styles.container}>
      {/* Background Decorative Elements */}
      <View style={styles.bgDecorativeTop} />
      <View style={styles.bgDecorativeRight} />
      <View style={styles.bgDecorativeBottom} />

      {/* Floating Icons */}
      <Animated.View
        style={[
          styles.floatingIcon1,
          { transform: [{ translateY: floatAnim1 }, { rotate: '12deg' }] },
        ]}
      >
        <MaterialCommunityIcons name="leaf" size={100} color="rgba(129, 199, 132, 0.5)" />
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingIcon2,
          { transform: [{ translateY: floatAnim2 }, { rotate: '-12deg' }] },
        ]}
      >
        <MaterialCommunityIcons name="recycle" size={80} color="rgba(129, 199, 132, 0.5)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon3, { transform: [{ translateY: floatAnim3 }] }]}>
        <MaterialCommunityIcons name="cloud" size={60} color="rgba(144, 202, 249, 0.6)" />
      </Animated.View>

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
              <View style={styles.inputWrapper}>
                <View style={styles.inputIconLeft}>
                  <MaterialCommunityIcons name="account" size={24} color={colors.text.disabled} />
                </View>
                <RNTextInput
                  placeholder="Tên tài khoản"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholderTextColor={colors.text.disabled}
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIconLeft}>
                  <MaterialCommunityIcons name="lock" size={24} color={colors.text.disabled} />
                </View>
                <RNTextInput
                  placeholder="Mật khẩu"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  placeholderTextColor={colors.text.disabled}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.inputIconRight}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={colors.text.disabled}
                  />
                </TouchableOpacity>
              </View>

              {/* Forgot Password */}
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text variant="bodySmall" style={styles.forgotPassword}>
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

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
  container: {
    backgroundColor: colors.background,
    flex: 1,
    position: 'relative',
  },
  // Background decorative elements
  bgDecorativeTop: {
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    height: '40%',
    left: '-10%',
    opacity: 0.6,
    position: 'absolute',
    top: '-10%',
    width: '70%',
  },
  bgDecorativeRight: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 9999,
    height: '50%',
    position: 'absolute',
    right: '-20%',
    top: '40%',
    width: '80%',
  },
  bgDecorativeBottom: {
    backgroundColor: '#dbe6e0',
    borderRadius: 9999,
    bottom: '-10%',
    height: '40%',
    left: '10%',
    opacity: 0.5,
    position: 'absolute',
    width: '60%',
  },
  // Floating icons
  floatingIcon1: {
    position: 'absolute',
    right: -20,
    top: '15%',
    zIndex: 0,
  },
  floatingIcon2: {
    bottom: '20%',
    left: -30,
    position: 'absolute',
    zIndex: 0,
  },
  floatingIcon3: {
    left: '5%',
    position: 'absolute',
    top: '40%',
    zIndex: 0,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing['4xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  logoContainer: {
    marginBottom: spacing.base,
  },
  logoImage: {
    height: 170,
    width: 170,
  },
  title: {
    color: colors.text.primary,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.text.secondary,
    fontWeight: '700',
  },
  form: {
    gap: spacing.lg,
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
  inputIconLeft: {
    bottom: 0,
    justifyContent: 'center',
    left: spacing.base,
    position: 'absolute',
    top: 0,
    zIndex: 1,
  },
  inputIconRight: {
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: spacing.base,
    top: 0,
    zIndex: 1,
  },
  input: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: '700',
    height: 56,
    paddingLeft: spacing['4xl'] + spacing.sm,
    paddingRight: spacing['4xl'] + spacing.sm,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: -spacing.sm,
  },
  forgotPassword: {
    color: colors.text.secondary,
    fontWeight: 'bold',
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
  loginButtonPressed: {
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    transform: [{ translateY: 4 }],
  },
  loginButtonGradient: {
    alignItems: 'center',
    height: 56,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  buttonOverlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  loginButtonText: {
    color: colors.surface,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    zIndex: 1,
  },
});
