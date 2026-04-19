import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../store/authStore';
import { studentApi } from '../../services/api/student';
import { colors } from '../../theme';
import ScreenBackground from '../../components/common/ScreenBackground';

export default function EditAvatarScreen() {
  const navigation = useNavigation();
  const { user, refreshCurrentUser } = useAuthStore();
  
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên');
    }
  };

  const handleConfirm = async () => {
    if (!user?.id || !customImage) return;
    setIsLoading(true);
    try {
      await studentApi.updateStudentAvatar(user.id, customImage);
      await refreshCurrentUser(true);
      Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện mới!');
      navigation.goBack();
    } catch (e: any) {
      console.error(e);
      Alert.alert('Lỗi', 'Không thể cập nhật ảnh đại diện');
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayAvatar = () => {
    if (customImage) return { uri: customImage };
    if (user?.avatar) return { uri: user.avatar };
    return require('../../../assets/images/avatar.jpg');
  };

  const displayGrade = user?.grade ? String(user.grade) : 'Chưa cập nhật';
  const displayClass = (user as any)?.class_name || (user as any)?.class_number || 'Chưa phân lớp';

  return (
    <View style={styles.container}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <MaterialCommunityIcons name="chevron-left" size={32} color={colors.text.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Avatar Hero Section */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#E8F5E9', '#FFFFFF']}
              style={styles.avatarBackdrop}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            />
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={['#4CAF50', '#81C784']}
                style={styles.avatarBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image source={getDisplayAvatar()} style={styles.largeAvatar} />
              </LinearGradient>
              <TouchableOpacity activeOpacity={0.8} style={styles.cameraBadge} onPress={handleUploadImage}>
                <MaterialCommunityIcons name="camera-plus" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroName}>{user?.name || 'Học sinh EcoVerse'}</Text>
            <Text style={styles.heroRole}>Thành viên hệ sinh thái</Text>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Thông tin tài khoản</Text>
            <Text style={styles.sectionSubtitle}>Các thông tin bên dưới chỉ được xem</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={[styles.iconWrap, { backgroundColor: '#E3F2FD' }]}>
                  <MaterialCommunityIcons name="account" size={24} color="#1E88E5" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Họ và tên</Text>
                  <Text style={styles.infoValue}>{user?.name || 'Chưa cập nhật'}</Text>
                </View>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#CBD5E1" />
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={[styles.iconWrap, { backgroundColor: '#F3E5F5' }]}>
                  <MaterialCommunityIcons name="school" size={24} color="#8E24AA" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Khối học</Text>
                  <Text style={styles.infoValue}>Khối {displayGrade}</Text>
                </View>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#CBD5E1" />
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={[styles.iconWrap, { backgroundColor: '#E8F5E9' }]}>
                  <MaterialCommunityIcons name="google-classroom" size={24} color="#43A047" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Lớp</Text>
                  <Text style={styles.infoValue}>{displayClass}</Text>
                </View>
                <MaterialCommunityIcons name="lock-outline" size={20} color="#CBD5E1" />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Action Button (only visible if customImage is selected) */}
        {customImage && (
          <View style={styles.footer}>
            <Button
              mode="contained"
              onPress={handleConfirm}
              loading={isLoading}
              disabled={isLoading}
              style={styles.confirmButton}
              contentStyle={styles.confirmButtonContent}
              labelStyle={styles.confirmButtonLabel}
            >
              Lưu ảnh diện mới
            </Button>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSpacer: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
    position: 'relative',
  },
  avatarBackdrop: {
    position: 'absolute',
    top: -50,
    left: 0,
    right: 0,
    height: 200,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  avatarBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  largeAvatar: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 4,
    backgroundColor: '#388E3C',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  heroName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  heroRole: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '500',
  },
  infoSection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  infoContent: {
    flex: 1,
    justifyContent: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 60,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 100,
    elevation: 8,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  confirmButtonContent: {
    paddingVertical: 6,
    height: 56,
  },
  confirmButtonLabel: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
