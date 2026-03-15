import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Text, Button, Surface, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DragDropGame } from '../../components/ai';
import ScreenBackground from '../../components/common/ScreenBackground';
import { WasteClassification } from '@/types/wasteClassification';
import { analyzeAndClassifyWaste } from '@/services/api/vision';
import { colors } from '@/theme';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type GameState = 'initial' | 'camera' | 'analyzing' | 'game' | 'success';

export default function AIScannerScreen() {
  const navigation = useNavigation();
  const [gameState, setGameState] = useState<GameState>('initial');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [classification, setClassification] = useState<WasteClassification | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    if (gameState === 'analyzing') {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 600,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      );
      const rotate = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
          easing: Easing.linear,
        })
      );
      pulse.start();
      rotate.start();
      return () => {
        pulse.stop();
        rotate.stop();
      };
    } else {
      pulseAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [gameState]);

  const requestPermissions = async () => {
    await requestCameraPermission();
    await ImagePicker.requestMediaLibraryPermissionsAsync();
  };

  const handleTakePhoto = async () => {
    if (!cameraRef.current) {
      Alert.alert('Lỗi', 'Camera chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 100));

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true,
        skipProcessing: false,
      });

      if (!photo) {
        throw new Error('Không nhận được ảnh từ camera');
      }

      setGameState('analyzing');

      if (photo.base64) {
        await analyzePhoto(photo.uri, photo.base64);
      } else {
        throw new Error('Không có dữ liệu base64');
      }
    } catch (error: any) {
      console.error('Take photo error:', error);
      Alert.alert(
        'Lỗi chụp ảnh',
        error.message || 'Không thể chụp ảnh. Vui lòng thử lại hoặc chọn ảnh từ thư viện.',
        [
          { text: 'Thử lại', onPress: () => setGameState('camera') },
          { text: 'Chọn từ thư viện', onPress: handlePickImage },
        ]
      );
      setGameState('camera');
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setGameState('analyzing');
        await analyzePhoto(result.assets[0].uri, result.assets[0].base64);
      }
    } catch (error) {
      console.error('Pick image error:', error);
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
    }
  };

  const analyzePhoto = async (uri: string, base64: string) => {
    try {
      const result = await analyzeAndClassifyWaste(uri, base64);
      setClassification(result);
      setGameState('game');
    } catch (error) {
      console.error('Analyze error:', error);
      Alert.alert('Lỗi', 'Không thể phân tích ảnh. Vui lòng thử lại.');
      setGameState('initial');
    }
  };

  const handleCorrectClassification = (feedback: string) => {
    setGameState('success');
    setTimeout(() => {
      Alert.alert('Tuyệt vời! 🎉', feedback, [
        {
          text: 'Quét tiếp',
          onPress: () => {
            setClassification(null);
            setGameState('initial');
          },
        },
        {
          text: 'Về trang chủ',
          onPress: () => navigation.goBack(),
        },
      ]);
    }, 500);
  };

  const handleRetry = () => {
    setClassification(null);
    setGameState('initial');
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Initial State
  if (gameState === 'initial') {
    return (
      <View style={[styles.container, styles.lightBg]}>
        <ScreenBackground />

        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.header}>
            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              icon="arrow-left"
              compact
              style={styles.backButton}
              labelStyle={styles.backButtonLabel}
            >
              Quay lại
            </Button>
          </View>

          <View style={styles.content}>
            <View style={styles.logoWrapper}>
              <LinearGradient
                colors={['#4CAF50', '#2196F3', '#9C27B0']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="robot-industrial" size={72} color="#FFFFFF" />
              </LinearGradient>
              <LinearGradient
                colors={['#FF9800', '#FFB74D']}
                style={styles.logoBadge}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <MaterialCommunityIcons name="star" size={12} color="#FFFFFF" />
                <Text style={styles.logoBadgeText}>EcoBot AI</Text>
              </LinearGradient>
            </View>

            <Text variant="headlineMedium" style={styles.title}>
              Quét AI phân loại rác ♻️
            </Text>

            <Text variant="bodyLarge" style={styles.subtitle}>
              Chụp ảnh vật thể để AI nhận diện và phân loại rác thải. Kéo vào đúng thùng để nhận xu!
              🪙
            </Text>

            {/* Feature chips */}
            <View style={styles.featureRow}>
              <View style={[styles.featureChip, { backgroundColor: '#E8F5E9' }]}>
                <MaterialCommunityIcons name="robot" size={14} color="#4CAF50" />
                <Text style={[styles.featureChipText, { color: '#4CAF50' }]}>AI thông minh</Text>
              </View>
              <View style={[styles.featureChip, { backgroundColor: '#FFF3E0' }]}>
                <MaterialCommunityIcons name="lightning-bolt" size={14} color="#FF9800" />
                <Text style={[styles.featureChipText, { color: '#FF9800' }]}>Siêu nhanh</Text>
              </View>
              <View style={[styles.featureChip, { backgroundColor: '#EDE7F6' }]}>
                <MaterialCommunityIcons name="medal" size={14} color="#9C27B0" />
                <Text style={[styles.featureChipText, { color: '#9C27B0' }]}>Nhận xu</Text>
              </View>
            </View>

            <View style={styles.buttons}>
              <Button
                mode="contained"
                icon="camera"
                onPress={() => setGameState('camera')}
                style={styles.primaryButton}
                contentStyle={styles.buttonContent}
                buttonColor={colors.primary}
              >
                Chụp ảnh quét
              </Button>

              <Button
                mode="outlined"
                icon="image-multiple"
                onPress={handlePickImage}
                style={styles.secondaryButton}
                contentStyle={styles.buttonContent}
                textColor={colors.primary}
              >
                Chọn từ thư viện
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Camera State
  if (gameState === 'camera') {
    if (!cameraPermission) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (!cameraPermission.granted) {
      return (
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons name="camera-off" size={64} color={colors.text.secondary} />
          <Text variant="titleMedium" style={styles.permissionTitle}>
            Cần quyền truy cập camera
          </Text>
          <Text variant="bodyMedium" style={styles.permissionText}>
            Ứng dụng cần camera để quét và nhận diện rác thải
          </Text>
          <Button
            mode="contained"
            onPress={requestCameraPermission}
            style={styles.permissionButton}
          >
            Cấp quyền
          </Button>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <CameraView style={styles.camera} facing="back" ref={cameraRef} />
        <View style={styles.cameraOverlay}>
          <Button
            mode="text"
            onPress={() => setGameState('initial')}
            icon="close"
            textColor="#FFFFFF"
            style={styles.closeButton}
            contentStyle={styles.closeButtonContent}
          >
            Đóng
          </Button>

          <View style={styles.scanFrameWrapper}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <View style={styles.scanLine} />
            </View>
            <LinearGradient
              colors={['transparent', 'rgba(76, 175, 80, 0.15)', 'transparent']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
            />
          </View>

          <View style={styles.instructionContainer}>
            <MaterialCommunityIcons name="qrcode-scan" size={22} color="#FFFFFF" />
            <Text style={styles.instruction}>Đặt vật thể trong khung để quét</Text>
          </View>

          <Button
            mode="contained"
            icon="camera"
            onPress={handleTakePhoto}
            style={styles.captureButton}
            contentStyle={styles.captureButtonContent}
            buttonColor="#FFFFFF"
            textColor={colors.primary}
          >
            Chụp ảnh
          </Button>
        </View>
      </View>
    );
  }

  // Analyzing State
  if (gameState === 'analyzing') {
    return (
      <View style={[styles.container, styles.lightBg]}>
        <ScreenBackground />
        <SafeAreaView style={styles.analyzingContainer}>
          <Animated.View style={[styles.analyzingIcon, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={['#4CAF50', '#2196F3', '#9C27B0']}
              style={styles.analyzingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <MaterialCommunityIcons name="robot" size={56} color="#FFFFFF" />
              </Animated.View>
            </LinearGradient>
          </Animated.View>
          <Text variant="headlineSmall" style={styles.analyzingTitle}>
            🤖 AI đang phân tích...
          </Text>
          <Text variant="bodyMedium" style={styles.analyzingSubtitle}>
            Đang nhận diện loại rác thải ✨
          </Text>
          <View style={styles.analyzingDotsRow}>
            {['#4CAF50', '#FF9800', '#2196F3'].map((c, i) => (
              <View key={i} style={[styles.analyzingDot, { backgroundColor: c }]} />
            ))}
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // Game State
  if (gameState === 'game' && classification) {
    return (
      <View style={[styles.container, styles.lightBg]}>
        <ScreenBackground />
        {/* Fun top bar accent */}
        <LinearGradient
          colors={[classification.suggestedType.color, classification.suggestedType.color + '88']}
          style={styles.gameTopAccent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <View style={styles.gameHeader}>
            <Button
              mode="text"
              onPress={handleRetry}
              icon="arrow-left"
              compact
              style={styles.backButton}
              labelStyle={styles.backButtonLabel}
            >
              Quay lại
            </Button>
            <View
              style={[
                styles.categoryBadge,
                { backgroundColor: classification.suggestedType.color + '20' },
              ]}
            >
              <MaterialCommunityIcons
                name={classification.suggestedType.icon as any}
                size={18}
                color={classification.suggestedType.color}
              />
              <Text style={[styles.badgeText, { color: classification.suggestedType.color }]}>
                {classification.suggestedType.name.toUpperCase()}
              </Text>
            </View>
          </View>

          <DragDropGame
            imageUri={classification.imageUri}
            correctWasteType={classification.suggestedType}
            displayName={classification.displayName}
            onCorrect={handleCorrectClassification}
            onRetry={handleRetry}
          />
        </SafeAreaView>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  analyzingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  analyzingGradient: {
    alignItems: 'center',
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  analyzingIcon: {
    marginBottom: 28,
  },
  analyzingSubtitle: {
    color: colors.text.secondary,
  },
  analyzingTitle: {
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 8,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonLabel: {
    color: colors.text.primary,
    fontSize: 15,
  },
  bottomLeft: {
    borderBottomLeftRadius: 28,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    bottom: -2,
    left: -2,
  },
  bottomRight: {
    borderBottomRightRadius: 28,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    bottom: -2,
    right: -2,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttons: {
    gap: 14,
    maxWidth: 320,
    width: '100%',
  },
  camera: {
    flex: 1,
  },
  cameraContainer: {
    backgroundColor: '#000',
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  captureButton: {
    alignSelf: 'center',
    borderRadius: 32,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  captureButtonContent: {
    paddingHorizontal: 32,
    paddingVertical: 14,
  },
  categoryBadge: {
    alignItems: 'center',
    borderRadius: 24,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  centerContainer: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  closeButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
  },
  closeButtonContent: {
    flexDirection: 'row-reverse',
  },
  container: {
    flex: 1,
  },
  lightBg: {
    backgroundColor: '#F2FAF4',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  corner: {
    borderColor: colors.primary,
    height: 36,
    position: 'absolute',
    width: 36,
  },
  gameHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  instruction: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  instructionContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  logoBadge: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 5,
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  logoBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoGradient: {
    alignItems: 'center',
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    width: 120,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  logoWrapper: {
    alignItems: 'center',
    marginBottom: 28,
  },
  permissionButton: {
    borderRadius: 16,
    marginTop: 24,
  },
  permissionText: {
    color: colors.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  permissionTitle: {
    color: colors.text.primary,
    fontWeight: '600',
    marginTop: 20,
  },
  primaryButton: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  safeArea: {
    flex: 1,
  },
  scanFrame: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 28,
    borderWidth: 2,
    height: 280,
    position: 'relative',
    width: 280,
  },
  scanFrameWrapper: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 280,
    justifyContent: 'center',
    position: 'relative',
    width: 280,
  },
  scanLine: {
    backgroundColor: colors.primary,
    height: 2,
    left: 8,
    opacity: 0.6,
    position: 'absolute',
    right: 8,
    top: '50%',
  },
  secondaryButton: {
    borderColor: colors.primary,
    borderRadius: 16,
    borderWidth: 2,
  },
  subtitle: {
    color: colors.text.secondary,
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  featureRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  featureChip: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  featureChipText: {
    fontSize: 12,
    fontWeight: '700',
  },

  gameTopAccent: {
    height: 5,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  analyzingDotsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  analyzingDot: {
    borderRadius: 8,
    height: 12,
    width: 12,
  },
  title: {
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  topLeft: {
    borderLeftWidth: 5,
    borderTopLeftRadius: 28,
    borderTopWidth: 5,
    left: -2,
    top: -2,
  },
  topRight: {
    borderRightWidth: 5,
    borderTopRightRadius: 28,
    borderTopWidth: 5,
    right: -2,
    top: -2,
  },
});
