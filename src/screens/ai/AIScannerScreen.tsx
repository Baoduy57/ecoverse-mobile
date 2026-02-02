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
      <View style={styles.container}>
        <LinearGradient
          colors={['#FFFFFF', '#F1F8E9', '#E8F5E9']}
          style={StyleSheet.absoluteFill}
        />
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
                colors={colors.gradient.primary as unknown as [string, string, ...string[]]}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="robot-industrial" size={72} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.logoBadge}>
                <Text style={styles.logoBadgeText}>EcoBot</Text>
              </View>
            </View>

            <Text variant="headlineMedium" style={styles.title}>
              Quét AI phân loại rác
            </Text>

            <Text variant="bodyLarge" style={styles.subtitle}>
              Chụp ảnh vật thể để AI nhận diện và phân loại rác thải. Hãy kéo vào đúng thùng để nhận
              xu!
            </Text>

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
      <View style={styles.container}>
        <LinearGradient colors={['#FFFFFF', '#E8F5E9']} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.analyzingContainer}>
          <Animated.View style={[styles.analyzingIcon, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={colors.gradient.primary as unknown as [string, string, ...string[]]}
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
            AI đang phân tích...
          </Text>
          <Text variant="bodyMedium" style={styles.analyzingSubtitle}>
            Đang nhận diện loại rác thải
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  // Game State
  if (gameState === 'game' && classification) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#FFFFFF', '#F8FDF8']} style={StyleSheet.absoluteFill} />
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
            <Surface
              style={[
                styles.categoryBadge,
                { backgroundColor: classification.suggestedType.color + '18' },
              ]}
              elevation={0}
            >
              <MaterialCommunityIcons
                name={classification.suggestedType.icon as any}
                size={18}
                color={classification.suggestedType.color}
              />
              <Text
                variant="labelLarge"
                style={[styles.badgeText, { color: classification.suggestedType.color }]}
              >
                {classification.suggestedType.name.toUpperCase()}
              </Text>
            </Surface>
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonLabel: {
    fontSize: 15,
    color: colors.text.primary,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  badgeText: {
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  logoWrapper: {
    marginBottom: 28,
    alignItems: 'center',
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
  logoBadge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    backgroundColor: colors.primary + '20',
    borderRadius: 20,
  },
  logoBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  title: {
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 8,
  },
  buttons: {
    width: '100%',
    gap: 14,
    maxWidth: 320,
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
  secondaryButton: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  permissionTitle: {
    marginTop: 20,
    color: colors.text.primary,
    fontWeight: '600',
  },
  permissionText: {
    marginTop: 8,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  permissionButton: {
    marginTop: 24,
    borderRadius: 16,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  closeButton: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 24,
  },
  closeButtonContent: {
    flexDirection: 'row-reverse',
  },
  scanFrameWrapper: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderRadius: 28,
    backgroundColor: 'transparent',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: colors.primary,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: 28,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: 28,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: 28,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: 28,
  },
  scanLine: {
    position: 'absolute',
    top: '50%',
    left: 8,
    right: 8,
    height: 2,
    backgroundColor: colors.primary,
    opacity: 0.6,
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  instruction: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
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
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  analyzingIcon: {
    marginBottom: 28,
  },
  analyzingGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  analyzingTitle: {
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 8,
  },
  analyzingSubtitle: {
    color: colors.text.secondary,
  },
});
