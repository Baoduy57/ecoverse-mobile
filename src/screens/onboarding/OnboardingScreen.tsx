import React, { useState, useRef } from 'react';
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  logoImage: {
    width: 45,
    height: 45,
  },
  skipButton: {
    opacity: 0.5,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBackground: {
    borderRadius: 100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconSurface: {
    borderRadius: 60,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  description: {
    textAlign: 'center',
    color: colors.text.secondary,
    lineHeight: 24,
    paddingHorizontal: 16,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  button: {
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});
