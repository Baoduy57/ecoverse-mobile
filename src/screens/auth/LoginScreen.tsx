import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
} from 'react-native';
import { Button, TextInput, Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  });

  const handleLogin = () => {
    console.log('Login:', email);
    login();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
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
            <Text variant="headlineLarge" style={styles.title}>
              EcoVerse
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Đăng nhập để tiếp tục
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              placeholder="Tên tài khoản"
              value={email}
              onChangeText={setEmail}
              mode="flat"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="account" color={colors.text.disabled} />}
              style={styles.input}
              underlineStyle={{ height: 0 }}
              contentStyle={styles.inputContent}
            />

            <TextInput
              placeholder="Mật khẩu"
              value={password}
              onChangeText={setPassword}
              mode="flat"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              left={<TextInput.Icon icon="lock" color={colors.text.disabled} />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  color={colors.text.disabled}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              underlineStyle={{ height: 0 }}
              contentStyle={styles.inputContent}
            />

            <Text variant="bodySmall" style={styles.forgotPassword}>
              Quên mật khẩu?
            </Text>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
            >
              Đăng nhập
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 32,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 10,
  },
  logoImage: {
    width: 170,
    height: 170,
  },
  title: {
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    color: colors.text.secondary,
  },
  form: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 25,
    overflow: 'hidden',
  },
  inputContent: {
    paddingLeft: 8,
  },
  forgotPassword: {
    color: colors.primary,
    textAlign: 'right',
    marginTop: -8,
  },
  loginButton: {
    marginTop: 16,
    borderRadius: 25,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 12,
  },
});
