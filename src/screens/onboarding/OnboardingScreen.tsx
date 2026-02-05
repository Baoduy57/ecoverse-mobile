import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, FlatList, ViewToken, Image, Animated } from 'react-native';
import { Button, Text, Surface } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import { colors } from '../../theme';

type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Học phân loại rác\nqua game',
    description: 'Tìm hiểu cách phân loại rác đúng cách qua các trò chơi thú vị',
    icon: 'gamepad-variant',
    color: colors.primary,
  },
  {
    id: '2',
    title: 'Hướng dẫn đăng nhập',
    description: 'Xem video hướng dẫn chi tiết các bước đăng nhập vào hệ thống',
    icon: 'video-outline',
    color: colors.waste.recyclable,
  },
  {
    id: '3',
    title: 'Làm quen với trò chơi',
    description: 'Trả lời các câu hỏi vui về phân loại rác, vừa học vừa chơi',
    icon: 'puzzle',
    color: colors.secondary,
  },
  {
    id: '4',
    title: 'Hướng dẫn làm bài\nkiểm tra',
    description: 'Ôn tập và làm bài kiểm tra để đánh giá kiến thức',
    icon: 'clipboard-check',
    color: colors.secondaryLight,
  },
  {
    id: '5',
    title: 'Đổi điểm nhận quà',
    description: 'Tích điểm nhận quà hấp dẫn khi hoàn thành nhiệm vụ',
    icon: 'gift',
    color: colors.accent,
  },
  {
    id: '6',
    title: 'Học tập cùng AI',
    description: 'Cùng AI bạn nghe nội dung các bài học về phân loại rác',
    icon: 'robot',
    color: colors.accentBlue,
  },
];

interface OnboardingScreenProps {}

const AnimatedIcon = ({
  icon,
  color,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  color: string;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }, { rotate }],
      }}
    >
      <MaterialCommunityIcons name={icon} size={64} color={color} />
    </Animated.View>
  );
};

export default function OnboardingScreen({}: OnboardingScreenProps) {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Background floating animations
  const floatAnim1 = useRef(new Animated.Value(0)).current;
  const floatAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  }, []);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={styles.slide}>
      <View style={styles.iconContainer}>
        <View style={[styles.iconBackground, { backgroundColor: item.color + '20' }]}>
          <Surface style={[styles.iconSurface, { backgroundColor: item.color }]} elevation={4}>
            <AnimatedIcon icon={item.icon} color={colors.text.white} />
          </Surface>
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text variant="headlineMedium" style={styles.title}>
          {item.title}
        </Text>
        <Text variant="bodyLarge" style={styles.description}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {/* Background Decorative Elements */}
      <View style={styles.bgDecorativeTop} />
      <View style={styles.bgDecorativeBottom} />

      {/* Floating Icons */}
      <Animated.View style={[styles.floatingIcon1, { transform: [{ translateY: floatAnim1 }] }]}>
        <MaterialCommunityIcons name="leaf" size={80} color="rgba(76, 175, 80, 0.15)" />
      </Animated.View>

      <Animated.View style={[styles.floatingIcon2, { transform: [{ translateY: floatAnim2 }] }]}>
        <MaterialCommunityIcons name="recycle" size={70} color="rgba(76, 175, 80, 0.15)" />
      </Animated.View>

      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../../assets/images/logo_eco.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Button
            mode="text"
            onPress={handleSkip}
            textColor={colors.text.primary}
            style={styles.skipButton}
          >
            Bỏ qua
          </Button>
        </View>

        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal={true}
          pagingEnabled={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
        />

        <View style={styles.pagination}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? colors.primary : colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.footer}>
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            {currentIndex === slides.length - 1 ? 'Bắt đầu ngay' : 'Tiếp theo'}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.onboardingBg,
    flex: 1,
    position: 'relative',
  },
  // Background decorative elements
  bgDecorativeTop: {
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
    borderRadius: 9999,
    height: '50%',
    position: 'absolute',
    right: '-15%',
    top: '-15%',
    width: '80%',
  },
  bgDecorativeBottom: {
    backgroundColor: 'rgba(129, 199, 132, 0.12)',
    borderRadius: 9999,
    bottom: '-20%',
    height: '45%',
    left: '-10%',
    position: 'absolute',
    width: '70%',
  },
  // Floating icons
  floatingIcon1: {
    position: 'absolute',
    right: 20,
    top: '25%',
    zIndex: 0,
  },
  floatingIcon2: {
    bottom: '30%',
    left: 15,
    position: 'absolute',
    zIndex: 0,
  },
  container: {
    backgroundColor: 'transparent',
    flex: 1,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  logoImage: {
    height: 45,
    width: 45,
  },
  skipButton: {
    opacity: 0.5,
  },
  slide: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
    width,
  },
  iconContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconBackground: {
    alignItems: 'center',
    borderRadius: 100,
    height: 200,
    justifyContent: 'center',
    width: 200,
  },
  iconSurface: {
    alignItems: 'center',
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  textContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  title: {
    color: colors.text.primary,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: colors.text.secondary,
    lineHeight: 24,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  pagination: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
  footer: {
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
