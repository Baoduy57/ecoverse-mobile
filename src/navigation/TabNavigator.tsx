import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator, BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { DashboardScreen } from '../screens/dashboard';
import { GameScreen } from '../screens/game';
import { ProfileScreen } from '../screens/profile';
import { LeaderboardScreen } from '../screens/leaderboard';
import { RewardScreen } from '../screens/reward';
import { colors } from '../theme';

export type HomeTabParamList = {
  Dashboard: undefined;
  Achievement: undefined;
  Game: undefined;
  Reward: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

const TAB_BAR_HEIGHT = 64;
const CENTER_BUTTON_SIZE = 46;
const NUM_TABS = 5;

const TAB_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  Dashboard: 'home',
  Achievement: 'trophy',
  Game: 'gamepad-variant',
  Reward: 'gift-outline',
  Profile: 'account-circle',
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const activeIndexAnim = useRef(new Animated.Value(state.index)).current;
  const [barWidth, setBarWidth] = useState(0);

  // Floating (bob) animation on the entire Tab Bar
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.timing(floatingAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Animate bubble to new tab on change
  useEffect(() => {
    Animated.spring(activeIndexAnim, {
      toValue: state.index,
      useNativeDriver: true,
      bounciness: 5,
      speed: 12,
    }).start();
  }, [state.index]);

  const tabWidth = barWidth / NUM_TABS;

  // Horizontal position of bubble center: centers on the active tab
  const bubbleTranslateX = activeIndexAnim.interpolate({
    inputRange: state.routes.map((_, i) => i),
    outputRange: state.routes.map((_, i) => (i * tabWidth) + (tabWidth / 2) - (CENTER_BUTTON_SIZE / 2)),
  });

  const floatTranslateY = floatingAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -8],
  });

  return (
    <Animated.View
      style={[styles.tabBarContainer, { transform: [{ translateY: floatTranslateY }] }]}
      onLayout={e => setBarWidth(e.nativeEvent.layout.width)}
    >
      {/* Sliding animated background bubble */}
      {barWidth > 0 && (
        <Animated.View
          style={[styles.bubble, { transform: [{ translateX: bubbleTranslateX }] }]}
          pointerEvents="none"
        />
      )}

      {/* Tab buttons */}
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.8}
            style={styles.tabButton}
          >
            <MaterialCommunityIcons
              name={TAB_ICONS[route.name]}
              size={26}
              color={isFocused ? colors.text.white : colors.text.secondary}
            />
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Achievement" component={LeaderboardScreen} />
      <Tab.Screen name="Game" component={GameScreen} />
      <Tab.Screen name="Reward" component={RewardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    backgroundColor: colors.primary,
    borderRadius: CENTER_BUTTON_SIZE / 2,
    height: CENTER_BUTTON_SIZE,
    width: CENTER_BUTTON_SIZE,
    top: (TAB_BAR_HEIGHT - CENTER_BUTTON_SIZE) / 2,
    left: 0,
    zIndex: 0,
  },
  tabBarContainer: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 28,
    bottom: Platform.OS === 'ios' ? 24 : 16,
    elevation: 8,
    flexDirection: 'row',
    height: TAB_BAR_HEIGHT,
    left: 16,
    position: 'absolute',
    right: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tabButton: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: TAB_BAR_HEIGHT,
    zIndex: 1,
  },
});
