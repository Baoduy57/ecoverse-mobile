import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AppStackParamList } from '@navigation/AppNavigator';
import { colors, spacing, borderRadius } from '@theme';
import * as ImagePicker from 'expo-image-picker';

type NavigationProp = StackNavigationProp<AppStackParamList>;

interface AvatarOption {
  id: string;
  source: any;
  bgColor: string;
  isLocked?: boolean;
}

const avatarOptions: AvatarOption[] = [
  {
    id: '1',
    source: require('../../../assets/images/default-avatar.jpg'),
    bgColor: '#FFE0B2',
  },
  {
    id: '2',
    source: require('../../../assets/images/default-avatar.jpg'),
    bgColor: '#C8E6C9',
  },
  {
    id: '3',
    source: require('../../../assets/images/default-avatar.jpg'),
    bgColor: '#BBDEFB',
  },
  {
    id: '4',
    source: require('../../../assets/images/default-avatar.jpg'),
    bgColor: '#B0BEC5',
  },
  {
    id: '5',
    source: require('../../../assets/images/default-avatar.jpg'),
    bgColor: '#E1BEE7',
  },
  {
    id: '6',
    source: require('../../../assets/images/default-avatar.jpg'),
    bgColor: '#F0F4C3',
  },
  {
    id: '7',
    source: require('../../../assets/images/default-avatar.jpg'),
    bgColor: '#CFD8DC',
  },
  {
    id: '8',
    source: require('../../../assets/images/default-avatar.jpg'),
    bgColor: '#FFCCBC',
  },
  {
    id: '9',
    isLocked: true,
    source: null,
    bgColor: '#F5F5F5',
  },
];

export default function EditAvatarScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [selectedAvatar, setSelectedAvatar] = useState<string>('1');
  const [customImage, setCustomImage] = useState<string | null>(null);

  // Animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;
  const floatAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Floating animation for decorative icons
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

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUploadImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh để tải ảnh lên');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCustomImage(result.assets[0].uri);
        setSelectedAvatar('custom');
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên');
    }
  };

  const handleConfirm = () => {
    // TODO: Save avatar to store/API
    console.log('Selected avatar:', selectedAvatar);
    navigation.goBack();
  };

  const getDisplayAvatar = () => {
    if (selectedAvatar === 'custom' && customImage) {
      return { uri: customImage };
    }
    const avatar = avatarOptions.find(a => a.id === selectedAvatar);
    return avatar?.source;
  };

  const getDisplayBgColor = () => {
    if (selectedAvatar === 'custom') {
      return '#E8F5E9';
    }
    const avatar = avatarOptions.find(a => a.id === selectedAvatar);
    return avatar?.bgColor || '#FFE0B2';
  };

  return (
    <View style={styles.container}>
      {/* Background Decorative Elements */}
      <View style={styles.bgDecorativeTop} />
      <View style={styles.bgDecorativeRight} />
      <View style={styles.bgDecorativeBottom} />

      {/* Floating Icons */}
      <Animated.View style={[styles.floatingIcon1, { transform: [{ translateY: floatAnim1 }] }]}>
        <MaterialCommunityIcons name="leaf" size={100} color="rgba(129, 199, 132, 0.3)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon2, { transform: [{ translateY: floatAnim2 }] }]}>
        <MaterialCommunityIcons name="recycle" size={80} color="rgba(129, 199, 132, 0.3)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon3, { transform: [{ translateY: floatAnim3 }] }]}>
        <MaterialCommunityIcons name="cloud" size={60} color="rgba(144, 202, 249, 0.4)" />
      </Animated.View>

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={colors.text.primary} />
          </TouchableOpacity>
          <Text variant="titleLarge" style={styles.headerTitle}>
            Chọn ảnh đại diện
          </Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Combined Section: Avatar + Upload + Grid */}
          <View style={styles.combinedSection}>
            {/* Current Avatar Preview */}
            <View style={styles.avatarPreviewContainer}>
              <View style={[styles.largeAvatarContainer, { backgroundColor: getDisplayBgColor() }]}>
                <Image source={getDisplayAvatar()} style={styles.largeAvatar} />
                <TouchableOpacity style={styles.editBadge} onPress={handleUploadImage}>
                  <MaterialCommunityIcons name="pencil" size={16} color={colors.surface} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Upload Button */}
            <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage}>
              <MaterialCommunityIcons name="folder-image" size={20} color={colors.primary} />
              <Text style={styles.uploadButtonText}>Tải ảnh lên</Text>
            </TouchableOpacity>

            {/* Avatar Grid */}
            <View style={styles.avatarGridContainer}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons name="grid" size={20} color={colors.primary} />
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Kho nhân vật
                </Text>
              </View>

              <View style={styles.avatarGrid}>
                {avatarOptions.map(avatar => (
                  <TouchableOpacity
                    key={avatar.id}
                    style={[
                      styles.avatarOption,
                      { backgroundColor: avatar.bgColor },
                      selectedAvatar === avatar.id && styles.avatarOptionSelected,
                    ]}
                    onPress={() => !avatar.isLocked && setSelectedAvatar(avatar.id)}
                    disabled={avatar.isLocked}
                  >
                    {avatar.isLocked ? (
                      <MaterialCommunityIcons name="lock" size={32} color={colors.text.disabled} />
                    ) : (
                      <Image source={avatar.source} style={styles.avatarOptionImage} />
                    )}
                    {selectedAvatar === avatar.id && !avatar.isLocked && (
                      <View style={styles.selectedCheckmark}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color={colors.primary}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Confirm Button */}
        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleConfirm}
            style={styles.confirmButton}
            contentStyle={styles.confirmButtonContent}
            labelStyle={styles.confirmButtonLabel}
            icon="check-circle"
          >
            Xác nhận
          </Button>
        </View>
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
  header: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  backButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  headerTitle: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  combinedSection: {
    backgroundColor: 'transparent',
    paddingBottom: spacing.xl,
  },
  avatarPreviewContainer: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  largeAvatarContainer: {
    borderRadius: borderRadius.full,
    elevation: 5,
    height: 140,
    padding: 8,
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    width: 140,
  },
  largeAvatar: {
    borderRadius: borderRadius.full,
    height: '100%',
    width: '100%',
  },
  editBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.surface,
    borderRadius: borderRadius.full,
    borderWidth: 3,
    bottom: 4,
    elevation: 3,
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 4,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 36,
  },
  uploadButton: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginBottom: spacing.xl,
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  uploadButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  avatarGridContainer: {
    paddingHorizontal: spacing.base,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.base,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'center',
  },
  avatarOption: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: borderRadius.lg,
    borderWidth: 3,
    elevation: 2,
    height: 90,
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 90,
  },
  avatarOptionSelected: {
    borderColor: colors.primary,
    borderWidth: 4,
    elevation: 4,
    shadowOpacity: 0.2,
  },
  avatarOptionImage: {
    borderRadius: borderRadius.md,
    height: '100%',
    width: '100%',
  },
  selectedCheckmark: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.full,
    position: 'absolute',
    right: -8,
    top: -8,
  },
  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 0,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.xl,
    elevation: 5,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  confirmButtonContent: {
    paddingVertical: spacing.sm,
  },
  confirmButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
