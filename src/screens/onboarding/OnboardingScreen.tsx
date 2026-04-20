import React, { useState, useRef, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewToken,
} from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import ScreenBackground from '../../components/common/ScreenBackground';
import { OnboardingSlide, type OnboardingSlideData } from './OnboardingSlide';

type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const slides: OnboardingSlideData[] = [
  {
    id: '1',
    title: 'Phân loại rác\nqua game thú vị',
    description: 'Học cách phân loại rác đúng cách qua những trò chơi hấp dẫn và bổ ích',
    icon: 'gamepad-variant',
    gradient: ['#4CAF50', '#2E7D32'],
    bgColor: '#C8E6C9',
    tag: 'Trò chơi',
  },
  {
    id: '2',
    title: 'Quét AI\nnhận biết rác',
    description: 'Dùng camera thông minh để AI nhận diện và hướng dẫn phân loại rác ngay lập tức',
    icon: 'robot',
    gradient: ['#2196F3', '#0D47A1'],
    bgColor: '#BBDEFB',
    tag: 'Công nghệ AI',
  },
  {
    id: '3',
    title: 'Làm bài kiểm tra\nvà thi đấu',
    description: 'Thử thách bản thân qua các bài kiểm tra và cuộc thi phân loại rác với bạn bè',
    icon: 'clipboard-check',
    gradient: ['#FF9800', '#E65100'],
    bgColor: '#FFE0B2',
    tag: 'Kiểm tra',
  },
  {
    id: '4',
    title: 'Tích điểm\nnhận quà hấp dẫn',
    description: 'Mỗi câu đúng là một điểm thưởng — đổi điểm lấy những phần quà thú vị',
    icon: 'gift',
    gradient: ['#E91E63', '#880E4F'],
    bgColor: '#FCE4EC',
    tag: 'Phần thưởng',
  },
  {
    id: '5',
    title: 'Bảng xếp hạng\ncộng đồng xanh',
    description: 'So tài với toàn trường — leo lên top và trở thành chiến binh môi trường số 1',
    icon: 'trophy',
    gradient: ['#9C27B0', '#4A148C'],
    bgColor: '#E1BEE7',
    tag: 'Xếp hạng',
  },
];

// Animated pagination dot
const PaginationDot = ({ active, color }: { active: boolean; color: string }) => {
  const widthAnim = useRef(new Animated.Value(active ? 28 : 8)).current;
  const opacityAnim = useRef(new Animated.Value(active ? 1 : 0.35)).current;

  React.useEffect(() => {
    // width cannot use native driver — must use JS driver
    Animated.spring(widthAnim, {
      toValue: active ? 28 : 8,
      tension: 120,
      friction: 10,
      useNativeDriver: false,
    }).start();
    // opacity also set to JS driver to avoid mixing
    Animated.timing(opacityAnim, {
      toValue: active ? 1 : 0.35,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [active]);

  return (
    <Animated.View
      style={{
        height: 8,
        width: widthAnim,
        borderRadius: 4,
        backgroundColor: active ? color : '#C8C8D4',
        opacity: opacityAnim,
      }}
    />
  );
};

export default function OnboardingScreen() {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const handleNext = () => {
    // Bounce effect on button tap
    Animated.sequence([
      Animated.timing(buttonScaleAnim, { toValue: 0.94, duration: 80, useNativeDriver: true }),
      Animated.spring(buttonScaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start();

    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => navigation.replace('Login');

  const isLast = currentIndex === slides.length - 1;
  const activeSlide = slides[currentIndex];

  const renderItem = useCallback(
    ({ item, index }: { item: OnboardingSlideData; index: number }) => (
      <OnboardingSlide item={item} isActive={index === currentIndex} />
    ),
    [currentIndex]
  );

  return (
    <View style={styles.wrapper}>
      <ScreenBackground />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <Image
              source={require('../../../assets/images/logo_eco.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>EcoVerse</Text>
          </View>
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn} activeOpacity={0.7}>
            <Text style={styles.skipText}>Bỏ qua</Text>
            <MaterialCommunityIcons name="chevron-right" size={16} color="#8A8AB0" />
          </TouchableOpacity>
        </View>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          style={styles.flatList}
        />

        {/* Bottom section */}
        <View style={styles.bottom}>
          {/* Pagination */}
          <View style={styles.pagination}>
            {slides.map((s, i) => (
              <PaginationDot key={s.id} active={i === currentIndex} color={activeSlide.gradient[0]} />
            ))}
          </View>

          {/* Progress text */}
          <Text style={styles.progressText}>
            {currentIndex + 1} / {slides.length}
          </Text>

          {/* Next button */}
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={[styles.nextBtn, { backgroundColor: activeSlide.gradient[0] }]}
              onPress={handleNext}
              activeOpacity={0.9}
            >
              <Text style={styles.nextBtnText}>
                {isLast ? 'Bắt đầu ngay!' : 'Tiếp theo'}
              </Text>
              <View style={styles.nextBtnIcon}>
                <MaterialCommunityIcons
                  name={isLast ? 'rocket-launch' : 'arrow-right'}
                  size={20}
                  color={activeSlide.gradient[0]}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F7F7FC',
    position: 'relative',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 38,
    height: 38,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  skipBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBEBF5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 2,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8A8AB0',
  },
  flatList: {
    flex: 1,
  },
  // Bottom
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 8,
    gap: 12,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  progressText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#AEAECE',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Button
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 17,
    paddingHorizontal: 32,
    borderRadius: 20,
    gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 10,
  },
  nextBtnText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  nextBtnIcon: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
